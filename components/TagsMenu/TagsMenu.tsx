import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchTags } from '../../lib/api';
import { NoteTag } from '../../types/note';
import css from './TagsMenu.module.css';

export default function TagsMenu() {
  const [tags, setTags] = useState<NoteTag[]>([]);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTag = searchParams.get('tag');

  useEffect(() => {
    const getTags = async () => {
      try {
        const fetchedTags = await fetchTags();
        if (fetchedTags) {
          setTags(fetchedTags);
        }
      } catch (error) {
        console.error('Failed to fetch tags:', error);
      }
    };
    getTags();
  }, []);

  const getActiveClass = (tag: NoteTag) => {
    return tag.name === activeTag ? css.active : '';
  };

  return (
    <ul className={css.tagsMenu}>
      <li className={css.item}>
        <Link
          href="/notes"
          className={`${css.tagLink} ${
            !activeTag && pathname === '/notes' ? css.active : ''
          }`}
        >
          Всі нотатки
        </Link>
      </li>
      {tags &&
        tags.length > 0 &&
        tags.map((tag) => (
          <li key={tag.id} className={css.item}>
            <Link
              href={`/notes/filter/tag/${tag.name}`}
              className={`${css.tagLink} ${getActiveClass(tag)}`}
            >
              #{tag.name}
            </Link>
          </li>
        ))}
    </ul>
  );
}
