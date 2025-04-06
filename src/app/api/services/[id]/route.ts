import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db/mysql';

interface RouteParams {
  params: {
    id: string;
  };
}

// Получение конкретной услуги по ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID услуги не указан' },
        { status: 400 }
      );
    }

    const services = await executeQuery({
      query: 'SELECT * FROM services WHERE id = ?',
      values: [id]
    });

    const service = (services as any[])[0];

    if (!service) {
      return NextResponse.json(
        { error: 'Услуга не найдена' },
        { status: 404 }
      );
    }

    return NextResponse.json({ service });

  } catch (error) {
    console.error('Ошибка при получении услуги:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при получении услуги' },
      { status: 500 }
    );
  }
}

// Обновление услуги
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID услуги не указан' },
        { status: 400 }
      );
    }

    const {
      name,
      description,
      price,
      duration,
      image_url,
      category
    } = await request.json();

    // Проверяем, существует ли услуга
    const serviceCheck = await executeQuery<any[]>({
      query: 'SELECT * FROM services WHERE id = ?',
      values: [id]
    });

    if (!serviceCheck || (serviceCheck as any[]).length === 0) {
      return NextResponse.json(
        { error: 'Услуга не найдена' },
        { status: 404 }
      );
    }

    // Формируем запрос и значения динамически на основе предоставленных полей
    let query = 'UPDATE services SET ';
    const updateFields: string[] = [];
    const values: any[] = [];

    if (name !== undefined) {
      updateFields.push('name = ?');
      values.push(name);
    }

    if (description !== undefined) {
      updateFields.push('description = ?');
      values.push(description || null);
    }

    if (price !== undefined) {
      // Проверка, что цена положительная
      if (price < 0) {
        return NextResponse.json(
          { error: 'Цена не может быть отрицательной' },
          { status: 400 }
        );
      }
      updateFields.push('price = ?');
      values.push(price);
    }

    if (duration !== undefined) {
      // Проверка, что длительность положительная
      if (duration < 0) {
        return NextResponse.json(
          { error: 'Длительность не может быть отрицательной' },
          { status: 400 }
        );
      }
      updateFields.push('duration = ?');
      values.push(duration);
    }

    if (image_url !== undefined) {
      updateFields.push('image_url = ?');
      values.push(image_url || null);
    }

    if (category !== undefined) {
      updateFields.push('category = ?');
      values.push(category || null);
    }

    // Обновляем timestamp
    updateFields.push('updated_at = CURRENT_TIMESTAMP');

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

    // Получаем обновленную услугу
    const updatedService = await executeQuery({
      query: 'SELECT * FROM services WHERE id = ?',
      values: [id]
    });

    return NextResponse.json({
      success: true,
      service: (updatedService as any[])[0],
      message: 'Услуга успешно обновлена'
    });

  } catch (error) {
    console.error('Ошибка при обновлении услуги:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при обновлении услуги' },
      { status: 500 }
    );
  }
}

// Удаление услуги
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID услуги не указан' },
        { status: 400 }
      );
    }

    // Проверяем, существует ли услуга
    const serviceCheck = await executeQuery<any[]>({
      query: 'SELECT * FROM services WHERE id = ?',
      values: [id]
    });

    if (!serviceCheck || (serviceCheck as any[]).length === 0) {
      return NextResponse.json(
        { error: 'Услуга не найдена' },
        { status: 404 }
      );
    }

    // Проверяем, используется ли услуга в активных записях
    const usedService = await executeQuery<any[]>({
      query: `
        SELECT COUNT(*) as count
        FROM appointments
        WHERE service_id = ? AND status != 'cancelled'
      `,
      values: [id]
    });

    if (usedService && (usedService as any[])[0].count > 0) {
      return NextResponse.json(
        { error: 'Услуга не может быть удалена, так как она используется в активных записях' },
        { status: 400 }
      );
    }

    // Удаляем услугу
    await executeQuery({
      query: 'DELETE FROM services WHERE id = ?',
      values: [id]
    });

    return NextResponse.json({
      success: true,
      message: 'Услуга успешно удалена'
    });

  } catch (error) {
    console.error('Ошибка при удалении услуги:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при удалении услуги' },
      { status: 500 }
    );
  }
}
