import { Note } from '@/types/note';
import css from './NoteDetails.module.css';
import React from 'react';

interface NoteDetailsProps {
  note: Note;
}

export default function NoteDetails({ note }: NoteDetailsProps) {
  return (
    <div className={css.container}>
      <h2 className={css.title}>{note.title}</h2>
      <p className={css.content}>{note.content}</p>
      <div className={css.tagContainer}>
        <span>Tag: </span>
        <span className={css.tag}>{note.tag}</span>
      </div>
      <p className={css.date}>
        Created: {new Date(note.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}
