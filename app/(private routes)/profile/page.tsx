'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from '@/lib/store/authStore';
import css from './Profile.module.css';

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [username, setUsername] = useState(user?.username || '');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      await updateUser({ username });
      router.push('/notes/filter/All');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to update username');
      }
    }
  };

  const handleCancel = () => {
    setUsername(user?.username || '');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <main className={css.main}>
      <div className={css.profileContainer}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src="/avatar"
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} onSubmit={handleSave}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <p>Email: {user.email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
        {error && <p className={css.error}>{error}</p>}
      </div>
    </main>
  );
}
