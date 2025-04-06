import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { executeQuery } from '@/lib/db/mysql';

export async function GET(request: NextRequest) {
  try {
    // Проверяем наличие куки авторизации
    const authToken = cookies().get('auth_token');

    if (!authToken || !authToken.value) {
      return NextResponse.json(
        { isAuthenticated: false },
        { status: 401 }
      );
    }

    // Парсим данные из куки
    let tokenData;
    try {
      tokenData = JSON.parse(authToken.value);
    } catch (e) {
      cookies().delete('auth_token');
      return NextResponse.json(
        { isAuthenticated: false, error: 'Некорректный токен авторизации' },
        { status: 401 }
      );
    }

    // Проверяем наличие необходимых данных в токене
    if (!tokenData.userId || !tokenData.username) {
      cookies().delete('auth_token');
      return NextResponse.json(
        { isAuthenticated: false, error: 'Некорректный токен авторизации' },
        { status: 401 }
      );
    }

    // Проверяем, существует ли пользователь в базе данных
    const users = await executeQuery<any[]>({
      query: 'SELECT id, username, email FROM admins WHERE id = ?',
      values: [tokenData.userId]
    });

    if (!users || (users as any[]).length === 0) {
      cookies().delete('auth_token');
      return NextResponse.json(
        { isAuthenticated: false, error: 'Пользователь не найден' },
        { status: 401 }
      );
    }

    const user = users[0];

    // Создаем безопасный объект пользователя
    const safeUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: true
    };

    return NextResponse.json({
      isAuthenticated: true,
      user: safeUser
    });
  } catch (error) {
    console.error('Ошибка при проверке авторизации:', error);
    return NextResponse.json(
      { isAuthenticated: false, error: 'Произошла ошибка при проверке авторизации' },
      { status: 500 }
    );
  }
}
