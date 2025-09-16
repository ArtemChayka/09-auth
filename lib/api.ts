// Цей файл містить фіктивні дані та логіку API для нотаток.
// Він імітує реальний бекенд для розробки.

export type NoteTag = {
  id: string;
  name: string;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
};

// Фіктивні дані, що імітують нотатки з бази даних
const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Перша зустріч',
    content: 'Обговорення нових можливостей для проекту та розподіл завдань.',
    tags: ['зустрічі', 'проект', 'завдання'],
  },
  {
    id: '2',
    title: 'Ідеї для наступної версії',
    content:
      'Задокументувати всі ідеї, які були запропоновані на мозковому штурмі.',
    tags: ['ідеї', 'проект'],
  },
  {
    id: '3',
    title: 'План розробки',
    content:
      'Створити детальний план розробки на наступні два тижні. Зосередитись на функціоналі користувачів.',
    tags: ['розробка', 'план', 'проект'],
  },
  {
    id: '4',
    title: 'Нотатки з конференції',
    content:
      'Резюме основних доповідей з конференції по React. Особливо зацікавили нові хуки.',
    tags: ['конференція', 'навчання', 'react'],
  },
  {
    id: '5',
    title: 'Прототип дизайну',
    content:
      'Створення прототипу дизайну для мобільного додатка. Використання Figma.',
    tags: ['дизайн', 'проект'],
  },
];

// Імітація функції API для отримання всіх тегів.
export const fetchTags = async (): Promise<NoteTag[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const allTags = mockNotes.flatMap((note) => note.tags);
  const uniqueTags = Array.from(new Set(allTags));

  return uniqueTags.map((tag) => ({
    id: tag, // Використання імені тегу як id
    name: tag,
  }));
};

// Імітація функції API для отримання нотатки за ідентифікатором.
export const fetchNoteById = async (id: string): Promise<Note | null> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const note = mockNotes.find((note) => note.id === id);
  return note || null;
};
