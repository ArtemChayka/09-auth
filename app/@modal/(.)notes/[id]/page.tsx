'use client';

import Modal from '@/components/Modal/Modal';
import NotePreview from '@/components/NotePreview/NotePreview';
import { notFound } from 'next/navigation';
import css from '@/app/page.module.css';
import { useRouter } from 'next/navigation';

interface NotePageProps {
  params: { id: string };
}

export default function NotePage({ params }: NotePageProps) {
  const router = useRouter();

  if (!params.id) {
    notFound();
  }

  return (
    <Modal onClose={() => router.back()}>
      <div className={css.container}>
        <NotePreview noteId={params.id} />
      </div>
    </Modal>
  );
}
