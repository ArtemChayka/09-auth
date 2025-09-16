'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { getCurrentUser } from '@/lib/api/clientApi';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const { setUser, clearUser } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        setUser(user);
      } catch {
        clearUser();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [setUser, clearUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
