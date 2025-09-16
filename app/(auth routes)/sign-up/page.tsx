'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import css from './SignUp.module.css';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { register } = useAuthStore();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      await register({ email, password, username: 'default_username' });
      router.push('/notes/filter/All');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Registration failed');
      }
    }
  };

  return (
    <div className={css.container}>
      <div className={css.formWrapper}>
        <h1 className={css.title}>Реєстрація</h1>
        <form className={css.form} onSubmit={handleRegister}>
          <input
            className={css.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className={css.input}
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className={css.button} type="submit">
            Зареєструватися
          </button>
        </form>
        {error && <p className={css.error}>{error}</p>}
        <Link className={css.link} href="/sign-in">
          Вже маєте обліковий запис? Увійти
        </Link>
      </div>
    </div>
  );
}
