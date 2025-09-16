import { Metadata } from 'next';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import css from './Profile.module.css';

export const metadata: Metadata = {
  title: 'Profile | NoteHub',
  description: 'Сторінка профілю користувача NoteHub',
  robots: { index: false, follow: false },
};

export default function Profile() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <img
            src={user.avatar || '/default-avatar.png'}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user.username || 'N/A'}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
