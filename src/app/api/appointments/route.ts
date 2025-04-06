import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db/mysql';

export async function POST(request: NextRequest) {
  try {
    const {
      clientName,
      clientPhone,
      clientEmail,
      serviceId,
      appointmentDate,
      appointmentTime,
      notes
    } = await request.json();

    // Базовая валидация
    if (!clientName || !clientPhone || !serviceId || !appointmentDate || !appointmentTime) {
      return NextResponse.json(
        { error: 'Не все обязательные поля заполнены' },
        { status: 400 }
      );
    }

    // Проверка, что дата не в прошлом
    const now = new Date();
    const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);

    if (appointmentDateTime < now) {
      return NextResponse.json(
        { error: 'Нельзя записаться на прошедшее время' },
        { status: 400 }
      );
    }

    // Проверка, доступно ли это время
    // В реальном приложении здесь должна быть проверка доступности времени

    // Создание записи в базе данных
    const result = await executeQuery<any>({
      query: `
        INSERT INTO appointments
        (client_name, client_phone, client_email, service_id, appointment_date, appointment_time, notes, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      values: [
        clientName,
        clientPhone,
        clientEmail || null,
        serviceId,
        appointmentDate,
        appointmentTime,
        notes || null,
        'pending'  // По умолчанию статус "в ожидании"
      ]
    });

    // Формируем ответ с ID созданной записи
    return NextResponse.json({
      success: true,
      appointmentId: (result as any).insertId,
      message: 'Запись успешно создана'
    });

  } catch (error) {
    console.error('Ошибка при создании записи:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при создании записи' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Получаем параметры запроса (дата, статус и т.д.)
    const { searchParams } = new URL(request.url);

    let query = `
      SELECT
        a.*,
        s.name AS service_name,
        s.price AS service_price,
        s.duration AS service_duration
      FROM appointments a
      LEFT JOIN services s ON a.service_id = s.id
    `;

    const queryParams: any[] = [];
    const conditions: string[] = [];

    // Фильтрация по дате
    const date = searchParams.get('date');
    if (date) {
      conditions.push('a.appointment_date = ?');
      queryParams.push(date);
    }

    // Фильтрация по статусу
    const status = searchParams.get('status');
    if (status) {
      conditions.push('a.status = ?');
      queryParams.push(status);
    }

    // Фильтрация по ID клиента
    const clientId = searchParams.get('clientId');
    if (clientId) {
      conditions.push('a.client_id = ?');
      queryParams.push(clientId);
    }

    // Добавление условий в запрос, если они есть
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Сортировка по дате и времени
    query += ' ORDER BY a.appointment_date ASC, a.appointment_time ASC';

    // Выполнение запроса
    const appointments = await executeQuery({
      query,
      values: queryParams
    });

    return NextResponse.json({ appointments });

  } catch (error) {
    console.error('Ошибка при получении записей:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при получении записей' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID записи не указан' },
        { status: 400 }
      );
    }

    // Удаление записи
    await executeQuery({
      query: 'DELETE FROM appointments WHERE id = ?',
      values: [id]
    });

    return NextResponse.json({
      success: true,
      message: 'Запись успешно удалена'
    });

  } catch (error) {
    console.error('Ошибка при удалении записи:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при удалении записи' },
      { status: 500 }
    );
  }
}
