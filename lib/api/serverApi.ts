import axios from 'axios';
import { Note, NoteTag } from '@/types/note';
import { User } from '@/types/user';

const baseURL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL + '/api'
  : 'https://notehub-api.goit.study';

const createServerInstance = (cookieString?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (cookieString) {
    headers.Cookie = cookieString;
  }

  return axios.create({
    baseURL,
    headers,
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

export const getServerUser = async (
  cookieString?: string,
): Promise<User | null> => {
  try {
    const instance = createServerInstance(cookieString);
    const { data } = await instance.get('/auth/session');
    return data;
  } catch (error) {
    console.error('Failed to get server user:', error);
    return null;
  }
};

export const fetchNotes = async (
  params: FetchNotesParams,
  cookieString?: string,
): Promise<FetchNotesResponse> => {
  try {
    const instance = createServerInstance(cookieString);
    const { data } = await instance.get('/notes', { params });
    return data;
  } catch (error) {
    console.error('Failed to fetch notes:', error);
    throw error;
  }
};

export const fetchNoteById = async (
  id: string,
  cookieString?: string,
): Promise<Note> => {
  try {
    const instance = createServerInstance(cookieString);
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
