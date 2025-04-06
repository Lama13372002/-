import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db/mysql';
import { z } from 'zod';

// Схема валидации для создания/обновления отзыва
const reviewSchema = z.object({
  client_name: z.string().min(1, 'Имя клиента обязательно'),
  review_text: z.string().min(1, 'Текст отзыва обязателен'),
  rating: z.number().min(1).max(5),
  avatar_url: z.string().optional(),
  is_approved: z.boolean().optional().default(false),
});

// GET /api/reviews - получение списка отзывов
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const onlyApproved = searchParams.get('approved') === 'true';

    // Формируем SQL-запрос с фильтрацией, если нужно
    let query = 'SELECT * FROM reviews';
    if (onlyApproved) {
      query += ' WHERE is_approved = 1';
    }
    query += ' ORDER BY created_at DESC';

    const reviews = await executeQuery<any[]>({ query });

    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Ошибка при получении отзывов' }, { status: 500 });
  }
}

// POST /api/reviews - создание нового отзыва
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Валидация полей
    const validationResult = reviewSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Ошибка валидации', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { client_name, review_text, rating, avatar_url, is_approved } = validationResult.data;

    // Создаем отзыв в базе данных
    const query = `
      INSERT INTO reviews (client_name, review_text, rating, avatar_url, is_approved)
      VALUES (?, ?, ?, ?, ?)
    `;

    const result = await executeQuery<any>({
      query,
      values: [client_name, review_text, rating, avatar_url || null, is_approved],
    });

    // Получаем ID созданного отзыва
    const insertId = (result as any).insertId;

    // Возвращаем созданный отзыв
    const createdReview = await executeQuery<any[]>({
      query: 'SELECT * FROM reviews WHERE id = ?',
      values: [insertId],
    });

    return NextResponse.json(createdReview[0], { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Ошибка при создании отзыва' }, { status: 500 });
  }
}
