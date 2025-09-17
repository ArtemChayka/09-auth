import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

// Функція для перевірки сесії (імітація виклику API)
async function checkSession(cookieString: string): Promise<boolean> {
  try {
    const baseURL = process.env.NEXT_PUBLIC_API_URL
      ? process.env.NEXT_PUBLIC_API_URL + '/api'
      : 'https://notehub-api.goit.study';

    const response = await fetch(`${baseURL}/auth/session`, {
      method: 'GET',
      headers: {
        Cookie: cookieString,
        'Content-Type': 'application/json',
      },
    });

    return response.ok && response.status === 200;
  } catch (error) {
    console.error('Session check failed:', error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Отримуємо cookies асинхронно
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');
  const refreshToken = cookieStore.get('refreshToken');

  // Визначаємо типи маршрутів
  const isAuthRoute =
    pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');
  const isPrivateRoute =
    pathname.startsWith('/notes') || pathname.startsWith('/profile');
  const isApiRoute = pathname.startsWith('/api');
  const isPublicRoute =
    pathname === '/' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon');

  // Пропускаємо API маршрути та публічні ресурси
  if (isApiRoute || isPublicRoute) {
    return NextResponse.next();
  }

  // Логіка аутентифікації
  let isAuthenticated = false;

  if (accessToken) {
    // Є accessToken - користувач автентифікований
    isAuthenticated = true;
  } else if (refreshToken) {
    // Немає accessToken, але є refreshToken - перевіряємо сесію
    const cookieString = cookieStore.toString();
    isAuthenticated = await checkSession(cookieString);

    if (!isAuthenticated) {
      // Якщо сесія недійсна, очищаємо refreshToken
      const response = NextResponse.redirect(new URL('/sign-in', request.url));
      response.cookies.delete('refreshToken');
      response.cookies.delete('accessToken');
      return response;
    }
  }

  // Якщо користувач не авторизований і намагається зайти на приватну сторінку
  if (isPrivateRoute && !isAuthenticated) {
    const signInUrl = new URL('/sign-in', request.url);
    // Зберігаємо URL, на який користувач хотів перейти
    signInUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Якщо користувач авторизований і намагається зайти на сторінки auth
  if (isAuthRoute && isAuthenticated) {
    // Перенаправляємо на домашню сторінку замість /profile
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Приватні маршрути
    '/notes/:path*',
    '/profile/:path*',
    // Auth маршрути
    '/sign-in',
    '/sign-up',
    // Виключаємо статичні файли та API
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
