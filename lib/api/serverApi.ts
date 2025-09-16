import { Note } from '@/types/note';
import { MOCK_NOTES } from './api';


export const fetchAllNotes = async (): Promise<Note[]> => {
  return MOCK_NOTES;
};

export const fetchNoteDetails = async (
  id: string,
): Promise<Note | undefined> => {
  return MOCK_NOTES.find((note) => note.id === id);
};

export const fetchNoteById = async (id: string): Promise<Note | undefined> => {
  return MOCK_NOTES.find((note) => note.id === id);
};
