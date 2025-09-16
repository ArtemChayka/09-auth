import { cookies } from 'next/headers';
import axios from 'axios';
import { User } from '@/types/user';

const baseURL = process.env.NEXT_PUBLIC_API_URL + '/api';

const createServerInstance = async () => {
  const cookieStore = await cookies();

  return axios.create({
    baseURL,
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
};

export const getServerUser = async (): Promise<User | null> => {
  try {
    const instance = await createServerInstance();
    const { data } = await instance.get('/auth/session');
    return data;
  } catch {
    return null;
  }
};
