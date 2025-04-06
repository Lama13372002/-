import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Простой middleware, который не делает ничего, но устраняет ошибку
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

// Пустой matcher, чтобы middleware не применялся ни к каким маршрутам
export const config = {
  matcher: [],
};
