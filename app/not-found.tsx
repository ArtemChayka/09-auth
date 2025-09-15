import { Metadata } from 'next';
import Link from 'next/link';
import css from './page.module.css';

export const metadata: Metadata = {
  title: '404 - Сторінка не знайдена | NoteHub',
  description:
    'Вибачте, сторінку, яку ви шукаєте, не існує. Поверніться до головної сторінки NoteHub.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: '404 - Сторінка не знайдена | NoteHub',
    description:
      'Вибачте, сторінку, яку ви шукаєте, не існує. Поверніться до головної сторінки NoteHub.',
    url: 'https://notehub-app.com/404',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub App - Сторінка не знайдена',
      },
    ],
  },
};

export default function NotFound() {
  return (
    <main>
      <div className={css.container}>
        <h1 className={css.title}>404 - Сторінка не знайдена</h1>
        <p className={css.description}>
          Вибачте, сторінку, яку ви шукаєте, не існує. Можливо, вона була
          переміщена або видалена.
        </p>
        <p className={css.description}>
          <Link href="/">Повернутися на головну сторінку</Link>
        </p>
      </div>
    </main>
  );
}
