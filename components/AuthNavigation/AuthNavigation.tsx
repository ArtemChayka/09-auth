'use client';

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
    }
  };

  return (
    <>
      {isAuthenticated ? (
        <>
          <li className={css.navigationItem}>
            <a href="/profile" className={css.navigationLink}>
              Profile
            </a>
          </li>
          <li className={css.navigationItem}>
            <p className={css.userEmail}>{user?.email}</p>
            <button className={css.logoutButton} onClick={handleLogout}>
              Logout
            </button>
          </li>
        </>
      ) : (
        <>
          <li className={css.navigationItem}>
            <a href="/sign-in" className={css.navigationLink}>
              Login
            </a>
          </li>
          <li className={css.navigationItem}>
            <a href="/sign-up" className={css.navigationLink}>
              Sign up
            </a>
          </li>
        </>
      )}
    </>
  );
}
