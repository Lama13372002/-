import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db/mysql';

interface RouteParams {
  params: {
    id: string;
  };
}

// Получение информации о конкретной записи по ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID записи не указан' },
        { status: 400 }
      );
    }

    // Выполнение запроса для получения записи вместе с информацией об услуге
    const appointments = await executeQuery({
      query: `
        SELECT
          a.*,
          s.name AS service_name,
          s.price AS service_price,
          s.duration AS service_duration
        FROM appointments a
        LEFT JOIN services s ON a.service_id = s.id
        WHERE a.id = ?
      `,
      values: [id]
    });

    const appointment = (appointments as any[])[0];

    if (!appointment) {
      return NextResponse.json(
        { error: 'Запись не найдена' },
        { status: 404 }
      );
    }

    return NextResponse.json({ appointment });

  } catch (error) {
    console.error('Ошибка при получении записи:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при получении записи' },
      { status: 500 }
    );
  }
}

// Обновление существующей записи
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID записи не указан' },
        { status: 400 }
      );
    }

    const {
      clientName,
      clientPhone,
      clientEmail,
      serviceId,
      appointmentDate,
      appointmentTime,
      status,
      notes
    } = await request.json();

    // Проверка, существует ли запись
    const checkResult = await executeQuery<any[]>({
      query: 'SELECT * FROM appointments WHERE id = ?',
      values: [id]
    });

    if (!checkResult || (checkResult as any[]).length === 0) {
      return NextResponse.json(
        { error: 'Запись не найдена' },
        { status: 404 }
      );
    }

    // Формируем запрос и значения динамически на основе предоставленных полей
    let query = 'UPDATE appointments SET ';
    const updateFields: string[] = [];
    const values: any[] = [];

    if (clientName !== undefined) {
      updateFields.push('client_name = ?');
      values.push(clientName);
    }

    if (clientPhone !== undefined) {
      updateFields.push('client_phone = ?');
      values.push(clientPhone);
    }

    if (clientEmail !== undefined) {
      updateFields.push('client_email = ?');
      values.push(clientEmail || null);
    }

    if (serviceId !== undefined) {
      updateFields.push('service_id = ?');
      values.push(serviceId);
    }

    if (appointmentDate !== undefined) {
      updateFields.push('appointment_date = ?');
      values.push(appointmentDate);
    }

    if (appointmentTime !== undefined) {
      updateFields.push('appointment_time = ?');
      values.push(appointmentTime);
    }

    if (status !== undefined) {
      updateFields.push('status = ?');
      values.push(status);
    }

    if (notes !== undefined) {
      updateFields.push('notes = ?');
      values.push(notes || null);
    }

    // Если нечего обновлять
    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: 'Не предоставлены данные для обновления' },
        { status: 400 }
      );
    }

    // Завершаем формирование запроса
    query += updateFields.join(', ') + ' WHERE id = ?';
    values.push(id);

    // Выполняем обновление
    await executeQuery({
      query,
      values
    });

    return NextResponse.json({
      success: true,
      message: 'Запись успешно обновлена'
    });

  } catch (error) {
    console.error('Ошибка при обновлении записи:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при обновлении записи' },
      { status: 500 }
    );
  }
}

// Удаление записи
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID записи не указан' },
        { status: 400 }
      );
    }

    // Проверка, существует ли запись
    const checkResult = await executeQuery<any[]>({
      query: 'SELECT * FROM appointments WHERE id = ?',
      values: [id]
    });

    if (!checkResult || (checkResult as any[]).length === 0) {
      return NextResponse.json(
        { error: 'Запись не найдена' },
        { status: 404 }
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
