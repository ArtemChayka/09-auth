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
        const sessionUser = await checkSession();

        if (sessionUser) {
          try {
            const fullUser = await getCurrentUser();
            setUser(fullUser);
          } catch (userError) {
            console.warn(
              'Failed to get full user data, using session data:',
              userError,
            );
            setUser(sessionUser);
          }
        } else {
          clearUser();
        }
      } catch (sessionError) {
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
