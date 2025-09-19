import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

// Функція для парсингу Set-Cookie заголовків
function parseCookieHeader(
  setCookieHeader: string,
): { name: string; value: string; options: Record<string, unknown> } | null {
  const parts = setCookieHeader.split(';');
  const [nameValue] = parts;
  const [name, value] = nameValue.split('=');

  if (!name || !value) return null;

  const options: Record<string, unknown> = {};
  parts.slice(1).forEach((part) => {
    const [key, val] = part.trim().split('=');
    if (key.toLowerCase() === 'httponly') options.httpOnly = true;
    if (key.toLowerCase() === 'secure') options.secure = true;
    if (key.toLowerCase() === 'samesite') options.sameSite = val;
    if (key.toLowerCase() === 'path') options.path = val;
    if (key.toLowerCase() === 'max-age') options.maxAge = parseInt(val);
  });

  return { name: name.trim(), value: value.trim(), options };
}

// Функція для перевірки сесії з обробкою оновлення токенів
async function checkSessionWithRefresh(
  cookieString: string,
): Promise<{ isValid: boolean; response?: NextResponse }> {
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

    if (response.ok && response.status === 200) {
      // Перевіряємо чи є нові токени в заголовках відповіді
      const setCookieHeaders = response.headers.getSetCookie();

      if (setCookieHeaders && setCookieHeaders.length > 0) {
        // Створюємо NextResponse з новими cookies
        const nextResponse = NextResponse.next();

        setCookieHeaders.forEach((cookieHeader) => {
          const parsedCookie = parseCookieHeader(cookieHeader);
          if (parsedCookie) {
            nextResponse.cookies.set(
              parsedCookie.name,
              parsedCookie.value,
              parsedCookie.options,
            );
          }
        });

        return { isValid: true, response: nextResponse };
      }

      return { isValid: true };
    }

    return { isValid: false };
  } catch (error) {
    console.error('Session check failed:', error);
    return { isValid: false };
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
  const isPublicRoute = pathname === '/';

  // Пропускаємо API маршрути та публічні ресурси
  if (isApiRoute || isPublicRoute) {
    return NextResponse.next();
  }

  // Логіка аутентифікації
  let isAuthenticated = false;
  let refreshResponse: NextResponse | undefined;

  if (accessToken) {
    // Є accessToken - користувач автентифікований
    isAuthenticated = true;
  } else if (refreshToken) {
    // Немає accessToken, але є refreshToken - перевіряємо сесію
    const cookieString = cookieStore.toString();
    const sessionResult = await checkSessionWithRefresh(cookieString);

    isAuthenticated = sessionResult.isValid;
    refreshResponse = sessionResult.response;

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
    signInUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Якщо користувач авторизований і намагається зайти на сторінки auth
  if (isAuthRoute && isAuthenticated) {
    const homeUrl = new URL('/', request.url);
    // Якщо були оновлені cookies, додаємо їх до відповіді
    if (refreshResponse) {
      const redirectResponse = NextResponse.redirect(homeUrl);
      // Копіюємо оновлені cookies
      refreshResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
      });
      return redirectResponse;
    }
    return NextResponse.redirect(homeUrl);
  }

  // Повертаємо відповідь з оновленими cookies якщо вони є
  return refreshResponse || NextResponse.next();
}

export const config = {
  matcher: ['/notes/:path*', '/profile/:path*', '/sign-in', '/sign-up'],
};
