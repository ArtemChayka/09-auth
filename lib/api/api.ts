import { Note, FetchNotesResponse } from '@/types/note';

const NOTEHUB_TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

// дані для демонстрації
export const MOCK_NOTES: Note[] = [
  {
    id: '1',
    title: 'Перша нотатка',
    content: 'Це зміст першої нотатки. Вона про розробку.',
    tags: ['Code', 'Work'],
    createdAt: '2023-01-01T10:00:00Z',
    updatedAt: '2023-01-01T10:00:00Z',
  },
  {
    id: '2',
    title: 'Рецепт пирога',
    content: 'Це рецепт смачного яблучного пирога.',
    tags: ['Food', 'Hobby'],
    createdAt: '2023-02-15T12:30:00Z',
    updatedAt: '2023-02-15T12:30:00Z',
  },
  {
    id: '3',
    title: 'Плани на вихідні',
    content: 'Планую поїхати на риболовлю та почитати книгу.',
    tags: ['Hobby', 'Personal'],
    createdAt: '2023-03-20T15:45:00Z',
    updatedAt: '2023-03-20T15:45:00Z',
  },
  {
    id: '4',
    title: 'Ідеї для проєкту',
    content: 'Нотатки про ідеї для нового веб-застосунку.',
    tags: ['Work', 'Code'],
    createdAt: '2023-04-05T09:10:00Z',
    updatedAt: '2023-04-05T09:10:00Z',
  },
  {
    id: '5',
    title: 'Нотатки з конференції',
    content: 'Основні тези доповіді про Next.js та React.',
    tags: ['Work', 'Code'],
    createdAt: '2023-05-10T11:20:00Z',
    updatedAt: '2023-05-10T11:20:00Z',
  },
];

interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tags: string[];
}

export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  search = '',
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  if (!NOTEHUB_TOKEN) {
    console.error('Помилка: NEXT_PUBLIC_NOTEHUB_TOKEN не визначено.');
  }

  let notes = [...MOCK_NOTES];

  if (tag && tag.toLowerCase() !== 'all') {
    notes = notes.filter((note) =>
      note.tags.some((t) => t.toLowerCase() === tag.toLowerCase()),
    );
  }

  if (search) {
    notes = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(search.toLowerCase()) ||
        note.content.toLowerCase().includes(search.toLowerCase()),
    );
  }

  const totalNotes = notes.length;
  const totalPages = Math.ceil(totalNotes / perPage);
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedNotes = notes.slice(startIndex, endIndex);

  return { notes: paginatedNotes, totalPages };
};

export const fetchNoteById = async (id: string): Promise<Note | undefined> => {
  if (!NOTEHUB_TOKEN) {
    console.error('Помилка: NEXT_PUBLIC_NOTEHUB_TOKEN не визначено.');
  }
  return MOCK_NOTES.find((note) => note.id === id);
};

export const createNote = async (
  note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Note> => {
  if (!NOTEHUB_TOKEN) {
    console.error('Помилка: NEXT_PUBLIC_NOTEHUB_TOKEN не визначено.');
  }
  const now = new Date().toISOString();
  const newNote = {
    ...note,
    id: (MOCK_NOTES.length + 1).toString(),
    createdAt: now,
    updatedAt: now,
  };
  MOCK_NOTES.push(newNote);
  return newNote;
};

export const deleteNote = async (id: string): Promise<Note | undefined> => {
  if (!NOTEHUB_TOKEN) {
    console.error('Помилка: NEXT_PUBLIC_NOTEHUB_TOKEN не визначено.');
  }
  const noteIndex = MOCK_NOTES.findIndex((note) => note.id === id);
  if (noteIndex !== -1) {
    const deletedNote = MOCK_NOTES.splice(noteIndex, 1)[0];
    return deletedNote;
  }
  return undefined;
};
