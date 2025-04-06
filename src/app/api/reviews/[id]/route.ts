import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db/mysql';
import { z } from 'zod';

// Схема валидации для обновления отзыва
const reviewUpdateSchema = z.object({
  client_name: z.string().min(1, 'Имя клиента обязательно').optional(),
  review_text: z.string().min(1, 'Текст отзыва обязателен').optional(),
  rating: z.number().min(1).max(5).optional(),
  avatar_url: z.string().optional(),
  is_approved: z.boolean().optional(),
});

// GET /api/reviews/[id] - получение конкретного отзыва
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Проверяем, что ID является числом
    if (!/^\d+$/.test(id)) {
      return NextResponse.json({ error: 'Неверный формат ID' }, { status: 400 });
    }

    // Получаем отзыв из базы данных
    const query = 'SELECT * FROM reviews WHERE id = ?';
    const reviews = await executeQuery<any[]>({
      query,
      values: [id],
    });

    // Проверяем, что отзыв найден
    if (!reviews || reviews.length === 0) {
      return NextResponse.json({ error: 'Отзыв не найден' }, { status: 404 });
    }

    return NextResponse.json(reviews[0], { status: 200 });
  } catch (error) {
    console.error('Error fetching review:', error);
    return NextResponse.json({ error: 'Ошибка при получении отзыва' }, { status: 500 });
  }
}

// PATCH /api/reviews/[id] - обновление отзыва
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Проверяем, что ID является числом
    if (!/^\d+$/.test(id)) {
      return NextResponse.json({ error: 'Неверный формат ID' }, { status: 400 });
    }

    const body = await request.json();

    // Валидация полей
    const validationResult = reviewUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Ошибка валидации', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    // Формируем запрос для обновления только предоставленных полей
    const updateData = validationResult.data;
    const updateFields = Object.keys(updateData).filter(
      (key) => updateData[key as keyof typeof updateData] !== undefined
    );

    if (updateFields.length === 0) {
      return NextResponse.json({ error: 'Нет данных для обновления' }, { status: 400 });
    }

    // Строим SQL-запрос динамически
    const setClause = updateFields.map((field) => `${field} = ?`).join(', ');
    const values = updateFields.map((field) => updateData[field as keyof typeof updateData]);
    values.push(id); // Добавляем ID для условия WHERE

    const query = `UPDATE reviews SET ${setClause} WHERE id = ?`;

    // Выполняем запрос
    const result = await executeQuery<any>({
      query,
      values,
    });

    // Проверяем, что отзыв был найден и обновлен
    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ error: 'Отзыв не найден' }, { status: 404 });
    }

    // Получаем обновленный отзыв
    const updatedReview = await executeQuery<any[]>({
      query: 'SELECT * FROM reviews WHERE id = ?',
      values: [id],
    });

    return NextResponse.json(updatedReview[0], { status: 200 });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json({ error: 'Ошибка при обновлении отзыва' }, { status: 500 });
  }
}

// DELETE /api/reviews/[id] - удаление отзыва
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Проверяем, что ID является числом
    if (!/^\d+$/.test(id)) {
      return NextResponse.json({ error: 'Неверный формат ID' }, { status: 400 });
    }

    // Сначала проверяем, существует ли отзыв
    const checkQuery = 'SELECT id FROM reviews WHERE id = ?';
    const reviews = await executeQuery<any[]>({
      query: checkQuery,
      values: [id],
    });

    if (!reviews || reviews.length === 0) {
      return NextResponse.json({ error: 'Отзыв не найден' }, { status: 404 });
    }

    // Удаляем отзыв
    const deleteQuery = 'DELETE FROM reviews WHERE id = ?';
    await executeQuery({
      query: deleteQuery,
      values: [id],
    });

    return NextResponse.json({ message: 'Отзыв успешно удален' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ error: 'Ошибка при удалении отзыва' }, { status: 500 });
  }
}
