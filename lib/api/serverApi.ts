import axios, { AxiosResponse } from 'axios';
import { Note, NoteTag } from '@/types/note';
import { User } from '@/types/user';

// Базовий URL для серверних запитів
const baseURL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL + '/api'
  : 'https://notehub-api.goit.study';

// Створення серверного axios instance з cookies string
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

// Інтерфейси
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

// Функції автентифікації та користувача
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

// Функції нотаток
export const fetchNotes = async (
  params: FetchNotesParams = {},
): Promise<FetchNotesResponse> => {
  const instance = await createServerInstance();
  const { data } = await instance.get('/notes', { params });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const instance = await createServerInstance();
  const { data } = await instance.get(`/notes/${id}`);
  return data;
};

// Допоміжна функція для отримання всіх нотаток
export const fetchAllNotes = async (): Promise<Note[]> => {
  const response = await fetchNotes({ perPage: 1000 });
  return response.notes;
};
