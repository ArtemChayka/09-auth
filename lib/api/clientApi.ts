import { apiInstance } from './api';
import { User } from '@/types/user';
import { Note } from '@/types/note';

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await apiInstance.delete(`/notes/${id}`);
  return data;
};

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

export const getCurrentUser = async (): Promise<User> => {
  const { data } = await apiInstance.get('/auth/session');
  return data;
};

export const updateUser = async (userData: Partial<User>): Promise<User> => {
  const { data } = await apiInstance.patch('/users/me', userData);
  return data;
};
