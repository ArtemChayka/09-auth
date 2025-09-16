import css from './layout.module.css';
import React from 'react';

interface NotesFilterLayoutProps {
 children: React.ReactNode,
  sidebar: React.ReactNode,
}
export default function NotesFilterLayout({
  children,
  sidebar,
}: NotesFilterLayoutProps) {
  return (
    <div className={css.container}>
      <div className={css.sidebar}>{sidebar}</div>
      <div className={css.content}>{children}</div>
    </div>
  );
}
