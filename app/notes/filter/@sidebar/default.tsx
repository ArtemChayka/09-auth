import Link from 'next/link';
import { NoteTag } from '../../../../types/note';
import css from './SidebarNotes.module.css';

const tags: (NoteTag | 'All')[] = [
  'All',
  'Todo',
  'Work',
  'Personal',
  'Meeting',
  'Shopping',
];

export default function SidebarDefault() {
  return (
    <div>
      <ul className={css.menuList}>
        {tags.map((tag) => (
          <li key={tag} className={css.menuItem}>
            <Link href={`/notes/filter/${tag}`} className={css.menuLink}>
              {tag === 'All' ? 'All notes' : tag}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
