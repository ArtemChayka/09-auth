'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { checkSession, getCurrentUser } from '@/lib/api/clientApi';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const { setUser, clearUser } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Спочатку перевіряємо сесію
        const sessionUser = await checkSession();

        if (sessionUser) {
          // Якщо сесія валідна, отримуємо повні дані користувача
          try {
            const fullUser = await getCurrentUser();
            setUser(fullUser);
          } catch (userError) {
            // Якщо не можемо отримати повні дані, використовуємо дані з сесії
            console.warn(
              'Failed to get full user data, using session data:',
              userError,
            );
            setUser(sessionUser);
          }
        } else {
          // Сесія недійсна, очищуємо стан
          clearUser();
        }
      } catch (sessionError) {
        // Помилка перевірки сесії - користувач неавторизований
        console.warn('Session check failed:', sessionError);
        clearUser();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [setUser, clearUser]);

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          fontSize: '1.2rem',
        }}
      >
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}
