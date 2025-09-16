'use client';

import { useEffect, useState } from 'react';
import { fetchNoteById, Note } from '../../../../lib/api';
import css from './NotePreview.module.css';

interface NotePreviewProps {
  noteId: string;
}

export default function NotePreview({ noteId }: NotePreviewProps) {
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!noteId) {
      setError('Note ID is missing.');
      setLoading(false);
      return;
    }

    const loadNote = async () => {
      try {
        setLoading(true);
        const fetchedNote = await fetchNoteById(noteId);
        setNote(fetchedNote);
      } catch (err) {
        setError('Failed to load note.');
        console.error('Error fetching note:', err);
      } finally {
        setLoading(false);
      }
    };

    loadNote();
  }, [noteId]);

  if (loading) {
    return <div className={css.message}>Завантаження нотатки...</div>;
  }

  if (error) {
    return (
      <div className={css.message} style={{ color: 'red' }}>
        Помилка: {error}
      </div>
    );
  }

  if (!note) {
    return <div className={css.message}>Нотатка не знайдена.</div>;
  }

  return (
    <div className={css.previewContainer}>
      <h1 className={css.title}>{note.title}</h1>
      <p className={css.content}>{note.content}</p>
      {note.tags && note.tags.length > 0 && (
        <div className={css.tagsContainer}>
          {note.tags.map((tag: string) => (
            <span key={tag} className={css.tag}>
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
