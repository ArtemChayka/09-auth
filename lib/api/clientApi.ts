import { apiInstance } from './api';
import { User } from '@/types/user';
import { Note, NoteTag } from '@/types/note';

// Інтерфейси для параметрів запитів
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

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface UpdateUserPayload {
  username?: string;
}

// Функції авторизації
export const registerUser = async (credentials: {
  email: string;
  password: string;
}): Promise<User> => {
  const { data } = await apiInstance.post('/auth/register', credentials);
  return data;
};

export const loginUser = async (credentials: {
  email: string;
  password: string;
}): Promise<User> => {
  const { data } = await apiInstance.post('/auth/login', credentials);
  return data;
};

export const logoutUser = async (): Promise<void> => {
  await apiInstance.post('/auth/logout');
};

// Функція перевірки сесії
export const checkSession = async (): Promise<User | null> => {
  try {
    const { data } = await apiInstance.get('/auth/session');
    return data;
  } catch (error) {
    console.error('Session check failed:', error);
    return null;
  }
};

// Функції користувача
export const getCurrentUser = async (): Promise<User> => {
  const { data } = await apiInstance.get('/users/me');
  return data;
};

export const updateUser = async (
  userData: UpdateUserPayload,
): Promise<User> => {
  const { data } = await apiInstance.patch('/users/me', userData);
  return data;
};

// Функції нотаток
export const fetchNotes = async (
  params: FetchNotesParams = {},
): Promise<FetchNotesResponse> => {
  const { data } = await apiInstance.get('/notes', { params });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await apiInstance.get(`/notes/${id}`);
  return data;
};

export const createNote = async (note: CreateNotePayload): Promise<Note> => {
  const { data } = await apiInstance.post('/notes', note);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await apiInstance.delete(`/notes/${id}`);
  return data;
};
