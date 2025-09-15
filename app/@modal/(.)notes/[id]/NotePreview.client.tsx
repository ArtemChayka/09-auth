'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { fetchNoteById } from '@/lib/api';
import Modal from '@/components/Modal/Modal';
import css from '@/components/NotePreview/NotePreview.module.css';

export default function NotePreviewClient({ noteId }: { noteId: string }) {
  const router = useRouter();

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => fetchNoteById(noteId),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const handleClose = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <Modal onClose={handleClose}>
        <div className={css.previewLoading}>Loading...</div>
      </Modal>
    );
  }

  if (error) {
    return (
      <Modal onClose={handleClose}>
        <div className={css.previewError}>Error: {error.message}</div>
      </Modal>
    );
  }

  if (!note) {
    return (
      <Modal onClose={handleClose}>
        <div className={css.previewNotFound}>Note not found.</div>
      </Modal>
    );
  }

  return (
    <Modal onClose={handleClose}>
      <div className={css.previewContainer}>
        <h2 className={css.previewTitle}>{note.title}</h2>
        <p className={css.previewContent}>{note.content}</p>
        <div className={css.previewTags}>
          Tag: <span className={css.previewTag}>{note.tag}</span>
        </div>
        <p className={css.date}>
          Created: {new Date(note.createdAt).toLocaleDateString()}
        </p>
      </div>
    </Modal>
  );
}
