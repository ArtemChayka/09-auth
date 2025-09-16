'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import { fetchNotes } from '@/lib/api';
import { NoteTag } from '@/types/note';
import css from './Notes.module.css';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface NotesClientProps {
  selectedTag: NoteTag | 'All';
}

export default function NotesClient({ selectedTag }: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTag]);

  const queryParams = {
    page: currentPage,
    search: debouncedSearchQuery,
    ...(selectedTag !== 'All' && { tag: selectedTag }),
  };

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ['notes', queryParams],
    queryFn: () => fetchNotes(queryParams),
    placeholderData: (previousData) => previousData,
  });

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  if (isLoading) {
    return <p>Завантаження, зачекайте будь ласка...</p>;
  }

  if (error) {
    return <p>Не вдалося завантажити список нотаток. {error.message}</p>;
  }

  const isDataFetching = isFetching;

  return (
    <div className={css.container}>
      <div className={css.header}>
        <h1 className={css.title}>
          {selectedTag === 'All' ? 'Всі нотатки' : `Нотатки: ${selectedTag}`}
        </h1>
        <div className={css.toolbar}>
          <SearchBox onSearchChange={handleSearchChange} value={searchQuery} />
          <Link href="/notes/action/create" className={css.addButton}>
            Створити нотатку
          </Link>
        </div>
      </div>

      {isDataFetching && (
        <p className={css.loadingText}>Завантажуємо нові нотатки...</p>
      )}

      {data?.notes && data.notes.length > 0 ? (
        <>
          <NoteList notes={data.notes} />
          <Pagination
            pageCount={data.totalPages}
            onPageChange={handlePageChange}
            currentPage={currentPage}
          />
        </>
      ) : (
        <p className={css.noNotes}>Нотатки не знайдені.</p>
      )}
    </div>
  );
}
