export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface UpdateUserPayload {
  username?: string;
}
