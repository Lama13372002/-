import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db/mysql';

interface RouteParams {
  params: {
    id: string;
  };
}

// Получение конкретной работы по ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID работы не указан' },
        { status: 400 }
      );
    }

    const galleryItems = await executeQuery({
      query: 'SELECT * FROM gallery WHERE id = ?',
      values: [id]
    });

    const galleryItem = (galleryItems as any[])[0];

    if (!galleryItem) {
      return NextResponse.json(
        { error: 'Работа не найдена' },
        { status: 404 }
      );
    }

    return NextResponse.json({ galleryItem });

  } catch (error) {
    console.error('Ошибка при получении работы:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при получении работы' },
      { status: 500 }
    );
  }
}

// Обновление работы
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID работы не указан' },
        { status: 400 }
      );
    }

    const {
      title,
      description,
      image_url,
      category,
      is_published
    } = await request.json();

    // Проверяем, существует ли работа
    const galleryItemCheck = await executeQuery<any[]>({
      query: 'SELECT * FROM gallery WHERE id = ?',
      values: [id]
    });

    if (!galleryItemCheck || (galleryItemCheck as any[]).length === 0) {
      return NextResponse.json(
        { error: 'Работа не найдена' },
        { status: 404 }
      );
    }

    // Формируем запрос и значения динамически на основе предоставленных полей
    let query = 'UPDATE gallery SET ';
    const updateFields: string[] = [];
    const values: any[] = [];

    if (title !== undefined) {
      updateFields.push('title = ?');
      values.push(title);
    }

    if (description !== undefined) {
      updateFields.push('description = ?');
      values.push(description || null);
    }

    if (image_url !== undefined) {
      updateFields.push('image_url = ?');
      values.push(image_url);
    }

    if (category !== undefined) {
      updateFields.push('category = ?');
      values.push(category || null);
    }

    if (is_published !== undefined) {
      updateFields.push('is_published = ?');
      values.push(is_published ? 1 : 0);
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

    // Получаем обновленную работу
    const updatedGalleryItem = await executeQuery({
      query: 'SELECT * FROM gallery WHERE id = ?',
      values: [id]
    });

    return NextResponse.json({
      success: true,
      galleryItem: (updatedGalleryItem as any[])[0],
      message: 'Работа успешно обновлена'
    });

  } catch (error) {
    console.error('Ошибка при обновлении работы:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при обновлении работы' },
      { status: 500 }
    );
  }
}

// Удаление работы
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID работы не указан' },
        { status: 400 }
      );
    }

    // Проверяем, существует ли работа
    const galleryItemCheck = await executeQuery<any[]>({
      query: 'SELECT * FROM gallery WHERE id = ?',
      values: [id]
    });

    if (!galleryItemCheck || (galleryItemCheck as any[]).length === 0) {
      return NextResponse.json(
        { error: 'Работа не найдена' },
        { status: 404 }
      );
    }

    // Удаляем работу
    await executeQuery({
      query: 'DELETE FROM gallery WHERE id = ?',
      values: [id]
    });

    return NextResponse.json({
      success: true,
      message: 'Работа успешно удалена'
    });

  } catch (error) {
    console.error('Ошибка при удалении работы:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при удалении работы' },
      { status: 500 }
    );
  }
}
