import type { AuthUser } from '../../common/common.types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name?: string;
  email: string;
  password: string;
}

export interface AuthResponsePayload {
  token?: string;
  user: AuthUser;
}
