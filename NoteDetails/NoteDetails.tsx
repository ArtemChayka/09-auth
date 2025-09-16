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
            <div className={css.tagsContainer}>
                Теги:{' '}
                {note.tags.map((tag) => (
                    <span key={tag.id} className={css.tag}>
                        {tag.name}
                    </span>
                ))}
            </div>
        </div>
  )
}
