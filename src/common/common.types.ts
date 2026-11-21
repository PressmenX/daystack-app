export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export type ToastVariant = 'success' | 'error';

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}
