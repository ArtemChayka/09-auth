import { Metadata } from 'next';
import NoteForm from '@/components/NoteForm/NoteForm';
import css from './CreateNote.module.css';

export const metadata: Metadata = {
  title: 'Створити нотатку | NoteHub',
  description:
    'Створіть нову нотатку в NoteHub. Організуйте свої думки та ідеї в зручному форматі.',
  openGraph: {
    title: 'Створити нотатку | NoteHub',
    description:
      'Створіть нову нотатку в NoteHub. Організуйте свої думки та ідеї в зручному форматі.',
    url: 'https://notehub-app.com/notes/action/create',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub - Створити нотатку',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Створити нотатку | NoteHub',
    description:
      'Створіть нову нотатку в NoteHub. Організуйте свої думки та ідеї в зручному форматі.',
    images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
  },
};

export default function CreateNote() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Створити нотатку</h1>
        <NoteForm />
      </div>
    </main>
  );
}
