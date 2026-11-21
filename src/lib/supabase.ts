import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// TODO(developer): Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY pada berkas .env untuk mengaktifkan backend Supabase.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.trim().length > 0 &&
  supabaseAnonKey.trim().length > 0
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!.trim(), supabaseAnonKey!.trim())
  : null;
