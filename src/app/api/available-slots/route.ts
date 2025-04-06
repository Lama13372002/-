import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db/mysql';
import { format, parse, addMinutes } from 'date-fns';

// Настройки рабочего времени
const WORK_START_HOUR = 10; // Начало рабочего дня (10:00)
const WORK_END_HOUR = 20;   // Конец рабочего дня (20:00)
const SLOT_DURATION = 30;   // Длительность слота в минутах

interface TimeSlot {
  time: string;
  available: boolean;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const serviceId = searchParams.get('serviceId');

    if (!date) {
      return NextResponse.json(
        { error: 'Не указана дата' },
        { status: 400 }
      );
    }

    // 1. Генерируем все возможные слоты времени для указанного дня
    const timeSlots: TimeSlot[] = [];
    for (let hour = WORK_START_HOUR; hour < WORK_END_HOUR; hour++) {
      for (let minute = 0; minute < 60; minute += SLOT_DURATION) {
        timeSlots.push({
          time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
          available: true
        });
      }
    }

    // 2. Получаем длительность выбранной услуги (если указана)
    let serviceDuration = SLOT_DURATION; // По умолчанию используем стандартную длительность слота

    if (serviceId) {
      const serviceResult = await executeQuery<any[]>({
        query: 'SELECT duration FROM services WHERE id = ?',
        values: [serviceId]
      });

      if (serviceResult && (serviceResult as any[]).length > 0) {
        serviceDuration = serviceResult[0].duration;
      }
    }

    // 3. Получаем все существующие записи на указанную дату
    const appointments = await executeQuery<any[]>({
      query: `
        SELECT
          a.appointment_time,
          s.duration
        FROM appointments a
        LEFT JOIN services s ON a.service_id = s.id
        WHERE a.appointment_date = ? AND a.status != 'cancelled'
      `,
      values: [date]
    });

    // 4. Помечаем занятые слоты как недоступные
    if (appointments && (appointments as any[]).length > 0) {
      appointments.forEach(appointment => {
        const appointmentTime = appointment.appointment_time;
        const appointmentDuration = appointment.duration || 60; // Если не указана длительность, предполагаем 60 минут

        // Время начала записи
        const startTime = parse(appointmentTime, 'HH:mm', new Date());

        // Время окончания записи (начало + длительность)
        const endTime = addMinutes(startTime, appointmentDuration);

        // Помечаем все слоты, которые пересекаются с данной записью, как недоступные
        timeSlots.forEach((slot, index) => {
          const slotTime = parse(slot.time, 'HH:mm', new Date());
          const slotEndTime = addMinutes(slotTime, serviceDuration);

          // Если текущий слот пересекается с существующей записью, помечаем его как недоступный
          if (
            (slotTime >= startTime && slotTime < endTime) || // Начало слота попадает в интервал записи
            (slotEndTime > startTime && slotEndTime <= endTime) || // Конец слота попадает в интервал записи
            (slotTime <= startTime && slotEndTime >= endTime) // Слот полностью охватывает запись
          ) {
            timeSlots[index].available = false;
          }
        });
      });
    }

    // 5. Проверяем, чтобы слоты не выходили за рамки рабочего дня
    timeSlots.forEach((slot, index) => {
      const slotTime = parse(slot.time, 'HH:mm', new Date());
      const slotEndTime = addMinutes(slotTime, serviceDuration);

      // Конвертируем время окончания в часы с десятичной частью для сравнения
      const endTimeInHours = slotEndTime.getHours() + (slotEndTime.getMinutes() / 60);

      // Если время окончания услуги выходит за рамки рабочего дня, помечаем слот как недоступный
      if (endTimeInHours > WORK_END_HOUR) {
        timeSlots[index].available = false;
      }
    });

    return NextResponse.json({
      date,
      serviceDuration,
      timeSlots
    });

  } catch (error) {
    console.error('Ошибка при получении доступных слотов:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при получении доступных слотов' },
      { status: 500 }
    );
  }
}
