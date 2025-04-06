import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Проверяем, относится ли запрос к админ-панели, но не к странице логина
  if (pathname.startsWith('/admin') && pathname !== '/admin') {
    const authToken = request.cookies.get('auth_token');

    // Если нет токена авторизации, перенаправляем на страницу логина
    if (!authToken?.value) {
      const loginUrl = new URL('/admin', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Проверяем, содержит ли токен данные админа
    try {
      const tokenData = JSON.parse(authToken.value);
      if (!tokenData.isAdmin) {
        const loginUrl = new URL('/admin', request.url);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      const loginUrl = new URL('/admin', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Указываем, для каких путей middleware должен выполняться
export const config = {
  matcher: ['/admin/:path*'],
};
