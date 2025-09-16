import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { Metadata } from 'next';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';
import { NoteTag } from '@/types/note';

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug?.[0] || 'All';

  const validTags: (NoteTag | 'All')[] = [
    'All',
    'Todo',
    'Work',
    'Personal',
    'Meeting',
    'Shopping',
  ];

  const selectedTag = validTags.includes(tag as NoteTag | 'All') ? tag : 'All';

  const tagTitles = {
    All: 'Всі нотатки',
    Todo: 'Нотатки Todo',
    Work: 'Робочі нотатки',
    Personal: 'Особисті нотатки',
    Meeting: 'Нотатки зустрічей',
    Shopping: 'Список покупок',
  };

  const title = `${tagTitles[selectedTag as keyof typeof tagTitles]} | NoteHub`;
  const description =
    selectedTag === 'All'
      ? 'Перегляньте всі ваші нотатки в NoteHub. Організовуйте та керуйте своїми думками ефективно.'
      : `Перегляньте нотатки категорії "${selectedTag}" в NoteHub. Знайдіть потрібну інформацію швидко та легко.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://notehub-app.com/notes/filter/${selectedTag}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `NoteHub - ${tagTitles[selectedTag as keyof typeof tagTitles]}`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
    },
  };
}

export default async function FilteredNotes({ params }: Props) {
  const { slug } = await params;
  const tag = slug?.[0];

  const validTags: (NoteTag | 'All')[] = [
    'All',
    'Todo',
    'Work',
    'Personal',
    'Meeting',
    'Shopping',
  ];
  const selectedTag = validTags.includes(tag as NoteTag | 'All') ? tag : 'All';

  const queryClient = new QueryClient();

  const searchParams =
    selectedTag === 'All' ? {} : { tag: selectedTag as NoteTag };

  await queryClient.prefetchQuery({
    queryKey: ['notes', { page: 1, search: '', ...searchParams }],
    queryFn: () =>
      fetchNotes({ page: 1, perPage: 12, search: '', ...searchParams }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient selectedTag={selectedTag as NoteTag | 'All'} />
    </HydrationBoundary>
  );
}
