import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db/mysql';

// Получение списка работ галереи
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    let query = 'SELECT * FROM gallery';
    const values: any[] = [];
    const conditions: string[] = [];

    // Фильтрация по категории, если она указана
    if (category) {
      conditions.push('category = ?');
      values.push(category);
    }

    // Показывать только опубликованные работы для публичного доступа
    const publicOnly = searchParams.get('public') === 'true';
    if (publicOnly) {
      conditions.push('is_published = 1');
    }

    // Добавление условий в запрос, если они есть
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Сортировка работ по дате создания (новые сверху)
    query += ' ORDER BY created_at DESC';

    // Ограничение количества результатов
    if (limit) {
      query += ' LIMIT ?';
      values.push(limit);
    }

    const gallery = await executeQuery({
      query,
      values
    });

    return NextResponse.json({ gallery });

  } catch (error) {
    console.error('Ошибка при получении галереи работ:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при получении галереи работ' },
      { status: 500 }
    );
  }
}

// Добавление новой работы в галерею
export async function POST(request: NextRequest) {
  try {
    const {
      title,
      description,
      image_url,
      category,
      is_published = true
    } = await request.json();

    // Базовая валидация
    if (!title || !image_url) {
      return NextResponse.json(
        { error: 'Не все обязательные поля заполнены' },
        { status: 400 }
      );
    }

    // Добавление работы в базу данных
    const result = await executeQuery<any>({
      query: `
        INSERT INTO gallery
        (title, description, image_url, category, is_published)
        VALUES (?, ?, ?, ?, ?)
      `,
      values: [
        title,
        description || null,
        image_url,
        category || null,
        is_published ? 1 : 0
      ]
    });

    // Получение созданной работы для ответа
    const galleryItemId = (result as any).insertId;
    const newGalleryItem = await executeQuery({
      query: 'SELECT * FROM gallery WHERE id = ?',
      values: [galleryItemId]
    });

    return NextResponse.json({
      success: true,
      gallery_item: (newGalleryItem as any[])[0],
      message: 'Работа успешно добавлена в галерею'
    });

  } catch (error) {
    console.error('Ошибка при добавлении работы в галерею:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при добавлении работы в галерею' },
      { status: 500 }
    );
  }
}

// Массовое удаление работ из галереи (для администратора)
export async function DELETE(request: NextRequest) {
  try {
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Не указаны ID работ для удаления' },
        { status: 400 }
      );
    }

    // Удаление работ
    await executeQuery({
      query: `DELETE FROM gallery WHERE id IN (?)`,
      values: [ids]
    });

    return NextResponse.json({
      success: true,
      message: 'Работы успешно удалены из галереи'
    });

  } catch (error) {
    console.error('Ошибка при удалении работ из галереи:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при удалении работ из галереи' },
      { status: 500 }
    );
  }
}
