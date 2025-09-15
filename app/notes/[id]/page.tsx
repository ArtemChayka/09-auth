import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { Metadata } from 'next';
import { fetchNoteById } from '@/lib/api';
import NoteDetailsClient from './NoteDetails.client';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const note = await fetchNoteById(id);

    const title = `${note.title} | NoteHub`;
    const description =
      note.content.length > 150
        ? `${note.content.substring(0, 150)}...`
        : note.content || 'Переглянути деталі нотатки в NoteHub';

    return {
      title,
      description,
      keywords: [note.tag, 'нотатки', 'NoteHub', 'організація'].join(', '),
      openGraph: {
        title,
        description,
        url: `https://notehub-app.com/notes/${id}`,
        images: [
          {
            url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
            width: 1200,
            height: 630,
            alt: `NoteHub - ${note.title}`,
          },
        ],
        type: 'article',
        publishedTime: note.createdAt,
        modifiedTime: note.updatedAt,
        tags: [note.tag],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
      },
    };
  } catch (error) {
    // Fallback metadata if note not found
    return {
      title: 'Нотатка не знайдена | NoteHub',
      description: 'Запитувана нотатка не існує або була видалена.',
      robots: {
        index: false,
        follow: false,
      },
      openGraph: {
        title: 'Нотатка не знайдена | NoteHub',
        description: 'Запитувана нотатка не існує або була видалена.',
        url: `https://notehub-app.com/notes/${id}`,
        images: [
          {
            url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
            width: 1200,
            height: 630,
            alt: 'NoteHub - Нотатка не знайдена',
          },
        ],
      },
    };
  }
}

export default async function NoteDetails({ params }: Props) {
  const { id } = await params;
  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ['note', id],
      queryFn: () => fetchNoteById(id),
    });
  } catch (error) {
    console.error('Error prefetching note:', error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient noteId={id} />
    </HydrationBoundary>
  );
}
