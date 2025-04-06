import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Удаляем куки авторизации
    cookies().delete('auth_token');

    return NextResponse.json({
      success: true,
      message: 'Вы успешно вышли из системы'
    });
  } catch (error) {
    console.error('Ошибка при выходе из системы:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при выходе из системы' },
      { status: 500 }
    );
  }
}
