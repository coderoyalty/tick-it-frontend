'use cient';

import { useQuery } from '@tanstack/react-query';

import api from '@/lib/axios';
import axios from 'axios';

/**
 * {
  "id": "cmhzbemus0000tea0kf75sx6v",
  "email": "johndoe@gmail.com",
  "name": "John Doe",
  "username": null,
  "createdAt": "2025-11-14T20:33:04.563Z",
  "updatedAt": "2025-11-14T20:33:04.563Z"
}
 */

interface User {
  id: string;
  email: string;
  name: string;
  username: string | null;
  createdAt: string;
  updatedAt: string;
}

export const USER_KEY = ['user'];

export async function getAuthUser() {
  try {
    const { data } = await api.get('/auth/me', {});

    return data as User;
  } catch (err) {
    if (
      axios.isAxiosError(err) &&
      [401, 403].includes(err.response?.status || 200)
    ) {
      return null;
    }

    throw err;
  }
}

export const useUser = () => {
  return useQuery<User | null>({
    queryKey: USER_KEY,
    queryFn: getAuthUser,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60 * 5, // cache data for 5 minutes
  });
};
