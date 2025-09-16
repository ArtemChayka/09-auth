import axios from 'axios';
import { User, LoginPayload, RegisterPayload } from '../types/users';

const instance = axios.create({
  baseURL: 'https://notehub-api.goit.study',
  withCredentials: true,
});

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: Note['tags'];
}

export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  search = '',
  tag,
}: {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = {
    page,
    perPage,
    search,
  };

  if (tag) {
    params.tag = tag;
  }

  const { data } = await instance.get<FetchNotesResponse>('/notes', {
    params,
  });

  return data;
};

export const createNote = async (note: CreateNotePayload): Promise<Note> => {
  const { data } = await instance.post<Note>('/notes', note);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await instance.delete<Note>(`/notes/${id}`);
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await instance.get<Note>(`/notes/${id}`);
  return data;
};

export const fetchMe = async (): Promise<User> => {
  const { data } = await instance.get<User>('/users/me');
  return data;
};

export const login = async (payload: LoginPayload): Promise<User> => {
  const { data } = await instance.post<User>('/auth/login', payload);
  return data;
};

export const register = async (payload: RegisterPayload): Promise<User> => {
  const { data } = await instance.post<User>('/auth/register', payload);
  return data;
};

export const logout = async (): Promise<void> => {
  await instance.post('/auth/logout');
};
