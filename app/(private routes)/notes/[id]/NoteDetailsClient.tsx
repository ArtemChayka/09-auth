'use client';

import { useEffect, useState } from 'react';
import { fetchNoteById, Note } from '../../../../lib/api';
import css from './NoteDetails.module.css';

interface NoteDetailsProps {
  params: {
    id: string;
  };
}

export default function NoteDetails({ params }: NoteDetailsProps) {
  const noteId = params.id;
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    if (noteId) {
      loadNote();
    }
  }, [noteId]);

  if (loading) {
    return <div className={css.message}>Завантаження...</div>;
  }

  if (error) {
    return (
      <div className={css.message} style={{ color: 'red' }}>
        Помилка: {error}
      </div>
    );
  }

  if (!note) {
    return <div className={css.message}>Примітка не знайдена.</div>;
  }

  return (
    <div className={css.noteDetailsContainer}>
      <h1 className={css.title}>{note.title}</h1>
      <p className={css.content}>{note.content}</p>
      {note.tags && note.tags.length > 0 && (
        <div className={css.tagsContainer}>
          {note.tags.map((tag) => (
            <span key={tag} className={css.tag}>
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
