import { cookies } from 'next/headers';
import axios from 'axios';
import { Note, NoteTag } from '@/types/note';
import { User } from '@/types/user';

// Базовий URL для серверних запитів
const baseURL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL + '/api'
  : 'https://notehub-api.goit.study';

// Створення серверного axios instance з cookies
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

// Альтернативна функція для middleware (без direct cookies usage)
const createServerInstanceWithCookies = (cookieString: string) => {
  return axios.create({
    baseURL,
    headers: {
      Cookie: cookieString,
      'Content-Type': 'application/json',
    },
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
export const checkSession = async (): Promise<User | null> => {
  try {
    const instance = await createServerInstance();
    const { data } = await instance.get('/auth/session');
    return data;
  } catch (error) {
    console.error('Failed to check session:', error);
    return null;
  }
};

// Версія для middleware
export const checkSessionWithCookies = async (
  cookieString: string,
): Promise<User | null> => {
  try {
    const instance = createServerInstanceWithCookies(cookieString);
    const { data } = await instance.get('/auth/session');
    return data;
  } catch (error) {
    console.error('Failed to check session:', error);
    return null;
  }
};

export const getServerUser = async (): Promise<User | null> => {
  try {
    const instance = await createServerInstance();
    const { data } = await instance.get('/users/me');
    return data;
  } catch (error) {
    console.error('Failed to get server user:', error);
    return null;
  }
};

// Версія для middleware
export const getServerUserWithCookies = async (
  cookieString: string,
): Promise<User | null> => {
  try {
    const instance = createServerInstanceWithCookies(cookieString);
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
  try {
    const instance = await createServerInstance();
    const { data } = await instance.get('/notes', { params });
    return data;
  } catch (error) {
    console.error('Failed to fetch notes:', error);
    throw error;
  }
};

// Версія для middleware
export const fetchNotesWithCookies = async (
  params: FetchNotesParams = {},
  cookieString: string,
): Promise<FetchNotesResponse> => {
  try {
    const instance = createServerInstanceWithCookies(cookieString);
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

// Версія для middleware
export const fetchNoteByIdWithCookies = async (
  id: string,
  cookieString: string,
): Promise<Note> => {
  try {
    const instance = createServerInstanceWithCookies(cookieString);
    const { data } = await instance.get(`/notes/${id}`);
    return data;
  } catch (error) {
    console.error(`Failed to fetch note ${id}:`, error);
    throw error;
  }
};

// Допоміжна функція для отримання всіх нотаток
export const fetchAllNotes = async (): Promise<Note[]> => {
  try {
    const response = await fetchNotes({ perPage: 1000 });
    return response.notes;
  } catch (error) {
    console.error('Failed to fetch all notes:', error);
    throw error;
  }
};
