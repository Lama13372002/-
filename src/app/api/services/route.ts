import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db/mysql';

// Получение списка услуг
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let query = 'SELECT * FROM services';
    const values: any[] = [];

    // Фильтрация по категории, если она указана
    if (category) {
      query += ' WHERE category = ?';
      values.push(category);
    }

    // Сортировка услуг по категории и названию
    query += ' ORDER BY category, name';

    const services = await executeQuery({
      query,
      values
    });

    return NextResponse.json({ services });

  } catch (error) {
    console.error('Ошибка при получении списка услуг:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при получении списка услуг' },
      { status: 500 }
    );
  }
}

// Создание новой услуги
export async function POST(request: NextRequest) {
  try {
    const {
      name,
      description,
      price,
      duration,
      image_url,
      category
    } = await request.json();

    // Базовая валидация
    if (!name || price === undefined || !duration) {
      return NextResponse.json(
        { error: 'Не все обязательные поля заполнены' },
        { status: 400 }
      );
    }

    // Проверка, что цена положительная
    if (price < 0) {
      return NextResponse.json(
        { error: 'Цена не может быть отрицательной' },
        { status: 400 }
      );
    }

    // Проверка, что длительность положительная
    if (duration < 0) {
      return NextResponse.json(
        { error: 'Длительность не может быть отрицательной' },
        { status: 400 }
      );
    }

    // Создание услуги в базе данных
    const result = await executeQuery<any>({
      query: `
        INSERT INTO services
        (name, description, price, duration, image_url, category)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      values: [
        name,
        description || null,
        price,
        duration,
        image_url || null,
        category || null
      ]
    });

    // Получение созданной услуги для ответа
    const serviceId = (result as any).insertId;
    const newService = await executeQuery({
      query: 'SELECT * FROM services WHERE id = ?',
      values: [serviceId]
    });

    return NextResponse.json({
      success: true,
      service: (newService as any[])[0],
      message: 'Услуга успешно создана'
    });

  } catch (error) {
    console.error('Ошибка при создании услуги:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при создании услуги' },
      { status: 500 }
    );
  }
}

// Массовое удаление услуг (для администратора)
export async function DELETE(request: NextRequest) {
  try {
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Не указаны ID услуг для удаления' },
        { status: 400 }
      );
    }

    // Проверка, используются ли услуги в записях
    const usedServices = await executeQuery<any[]>({
      query: `
        SELECT DISTINCT service_id
        FROM appointments
        WHERE service_id IN (?) AND status != 'cancelled'
      `,
      values: [ids]
    });

    if (usedServices && (usedServices as any[]).length > 0) {
      return NextResponse.json(
        { error: 'Некоторые услуги не могут быть удалены, так как они используются в активных записях' },
        { status: 400 }
      );
    }

    // Удаление услуг
    await executeQuery({
      query: `DELETE FROM services WHERE id IN (?)`,
      values: [ids]
    });

    return NextResponse.json({
      success: true,
      message: 'Услуги успешно удалены'
    });

  } catch (error) {
    console.error('Ошибка при удалении услуг:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при удалении услуг' },
      { status: 500 }
    );
  }
}
