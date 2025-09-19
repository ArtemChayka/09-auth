import axios, { AxiosResponse } from 'axios';
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

export const checkSession = async (
  cookieString?: string,
): Promise<AxiosResponse<User>> => {
  const instance = createServerInstance(cookieString);
  return await instance.get('/auth/session');
};

export const getServerUser = async (
  cookieString?: string,
): Promise<User | null> => {
  try {
    const instance = createServerInstance(cookieString);
    const { data } = await instance.get('/users/me');
    return data;
  } catch (error) {
    console.error('Failed to get server user:', error);
    return null;
  }
};

export const fetchNotes = async (
  params: FetchNotesParams = {},
  cookieString?: string,
): Promise<FetchNotesResponse> => {
  const instance = createServerInstance(cookieString);
  const { data } = await instance.get('/notes', { params });
  return data;
};

export const fetchNoteById = async (
  id: string,
  cookieString?: string,
): Promise<Note> => {
  const instance = createServerInstance(cookieString);
  const { data } = await instance.get(`/notes/${id}`);
  return data;
};

export const fetchAllNotes = async (cookieString?: string): Promise<Note[]> => {
  const response = await fetchNotes({ perPage: 1000 }, cookieString);
  return response.notes;
};
