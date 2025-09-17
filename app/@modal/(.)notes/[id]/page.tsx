import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/serverApi';
import { cookies } from 'next/headers';
import NotePreview from '@/components/NotePreview/NotePreview';
import { notFound } from 'next/navigation';

interface NotePageProps {
  params: Promise<{ id: string }>;
}

export default async function NotePage({ params }: NotePageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const queryClient = new QueryClient();
  const cookieStore = await cookies();

  try {
    await queryClient.prefetchQuery({
      queryKey: ['note', id],
      queryFn: () => fetchNoteById(id, cookieStore.toString()),
    });
  } catch (error) {
    console.error('Error prefetching note:', error);
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreview noteId={id} />
    </HydrationBoundary>
  );
}
