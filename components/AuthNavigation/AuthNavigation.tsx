'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import { logoutUser } from '@/lib/api/clientApi';
import { useRouter } from 'next/navigation';
import css from './AuthNavigation.module.css';

export default function AuthNavigation() {
  const { user, isAuthenticated, clearUser } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser();
      clearUser();
      router.push('/sign-in');
    } catch (error) {
      console.error('Logout failed:', error);
      // Все одно очищуємо локальний стан при помилці
      clearUser();
      router.push('/sign-in');
    }
  };

  return (
    <>
      {isAuthenticated ? (
        <>
          <li className={css.navigationItem}>
            <Link href="/profile" className={css.navigationLink}>
              Profile
            </Link>
          </li>
          <li className={css.navigationItem}>
            <p className={css.userEmail}>{user?.email}</p>
            <button
              className={css.logoutButton}
              onClick={handleLogout}
              type="button"
            >
              Logout
            </button>
          </li>
        </>
      ) : (
        <>
          <li className={css.navigationItem}>
            <Link href="/sign-in" className={css.navigationLink}>
              Login
            </Link>
          </li>
          <li className={css.navigationItem}>
            <Link href="/sign-up" className={css.navigationLink}>
              Sign up
            </Link>
          </li>
        </>
      )}
    </>
  );
}
