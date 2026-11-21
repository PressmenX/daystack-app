export const APP_NAME = 'Daystack';
export const APP_BRAND_UPPER = 'DAYSTACK';

export const ROUTINE_KIND = {
  GLOBAL: 'global',
} as const;

export const ROUTINE_MODE = {
  CHECKLIST: 'checklist',
} as const;

export const DEFAULT_GLOBAL_ROUTINE_NAME = 'Global Routines';

export const MIN_PASSWORD_LENGTH = 6;
export const MAX_ACTIVITY_NAME_LENGTH = 120;
export const MAX_USER_NAME_LENGTH = 60;
export const TOAST_DURATION_MS = 3200;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const TIME_INPUT_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const SUPABASE_TABLES = {
  ROUTINES: 'routines',
  ACTIVITIES: 'activities',
} as const;

export const API_ENDPOINTS = {
  REGISTER: '/api/auth/register',
  LOGIN: '/api/auth/login',
  ME: '/api/auth/me',
  LOGOUT: '/api/auth/logout',
  GLOBAL_ROUTINE: '/api/routines/global',
  ACTIVITIES: '/api/activities',
  REORDER_ACTIVITIES: '/api/activities/reorder',
} as const;

export const DAYS_ID = [
  'Minggu',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
] as const;

export const MONTHS_ID = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
] as const;
