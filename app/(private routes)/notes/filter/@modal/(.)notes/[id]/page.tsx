import NotePreview from '@/components/NotePreview/NotePreview';

export default function NotePreviewModalPage({
  params,
}: {
  params: { id: string };
}) {
  return <NotePreview noteId={params.id} />;
}
