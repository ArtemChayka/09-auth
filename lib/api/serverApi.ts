import { cookies } from 'next/headers';
import axios from 'axios';
import { Note, NoteTag } from '@/types/note';
import { User } from '@/types/user';

const baseURL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL + '/api'
  : 'https://notehub-api.goit.study';

const createServerInstance = async () => {
  const cookieStore = await cookies();

  return axios.create({
    baseURL,
    headers: {
      Cookie: cookieStore.toString(),
      'Content-Type': 'application/json',
    },
  });
};

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: NoteTag;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const getServerUser = async (): Promise<User | null> => {
  try {
    const instance = await createServerInstance();
    const { data } = await instance.get('/auth/session');
    return data;
  } catch (error) {
    console.error('Failed to get server user:', error);
    return null;
  }
};

export const fetchNotes = async (
  params: FetchNotesParams,
): Promise<FetchNotesResponse> => {
  try {
    const instance = await createServerInstance();
    const { data } = await instance.get('/notes', { params });
    return data;
  } catch (error) {
    console.error('Failed to fetch notes:', error);
    throw error;
  }
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  try {
    const instance = await createServerInstance();
    const { data } = await instance.get(`/notes/${id}`);
    return data;
  } catch (error) {
    console.error(`Failed to fetch note ${id}:`, error);
    throw error;
  }
};

export const fetchAllNotes = async (): Promise<Note[]> => {
  try {
    const response = await fetchNotes({ perPage: 1000 }); 
    return response.notes;
  } catch (error) {
    console.error('Failed to fetch all notes:', error);
    throw error;
  }
};
