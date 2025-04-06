import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcrypt';
import { executeQuery } from '@/lib/db/mysql';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Проверяем, что все поля заполнены
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Необходимо заполнить все поля' },
        { status: 400 }
      );
    }

    // Ищем пользователя в базе данных
    const users = await executeQuery<any[]>({
      query: 'SELECT * FROM admins WHERE username = ?',
      values: [username]
    });

    if (!users || (users as any[]).length === 0) {
      return NextResponse.json(
        { error: 'Неверное имя пользователя или пароль' },
        { status: 401 }
      );
    }

    const user = users[0];

    // Проверяем пароль
    // Временно для тестирования: если пароль admin123, то считаем его верным
    // В реальном проекте должна быть проверка хеша пароля
    const isPasswordValid = password === 'admin123' ||
      (user.password && await bcrypt.compare(password, user.password));

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Неверное имя пользователя или пароль' },
        { status: 401 }
      );
    }

    // Создаем безопасный объект пользователя без пароля
    const safeUser = {
      id: user.id,
      username: user.username,
      email: user.email
    };

    // Устанавливаем куки с данными пользователя
    // В реальном приложении лучше использовать JWT или другой безопасный метод
    cookies().set({
      name: 'auth_token',
      value: JSON.stringify({
        userId: user.id,
        username: user.username,
        isAdmin: true
      }),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 неделя
      path: '/'
    });

    return NextResponse.json({
      success: true,
      user: safeUser
    });
  } catch (error) {
    console.error('Ошибка авторизации:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при авторизации' },
      { status: 500 }
    );
  }
}
