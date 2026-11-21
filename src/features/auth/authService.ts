import type { User } from '@supabase/supabase-js';
import type { AuthUser } from '../../common/common.types';
import {
  API_ENDPOINTS,
  DEFAULT_GLOBAL_ROUTINE_NAME,
  ROUTINE_KIND,
  ROUTINE_MODE,
  SUPABASE_TABLES,
} from '../../constants/appConstants';
import { UI_MESSAGES } from '../../constants/messages';
import { apiRequest } from '../../lib/apiClient';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import type {
  AuthResponsePayload,
  LoginCredentials,
  RegisterCredentials,
} from './auth.types';

function mapSupabaseUser(user: User): AuthUser {
  const metadataName =
    typeof user.user_metadata?.name === 'string'
      ? user.user_metadata.name.trim()
      : '';
  const fallbackName = user.email?.split('@')[0] || UI_MESSAGES.DASHBOARD.DEFAULT_USER_NAME;
  return {
    id: user.id,
    email: user.email || '',
    name: metadataName || fallbackName,
  };
}

async function ensureSupabaseGlobalRoutine(userId: string): Promise<void> {
  if (!supabase) {
    return;
  }
  const { data: existing, error: fetchError } = await supabase
    .from(SUPABASE_TABLES.ROUTINES)
    .select('id')
    .eq('user_id', userId)
    .eq('kind', ROUTINE_KIND.GLOBAL)
    .maybeSingle();

  if (fetchError) {
    throw new Error(fetchError.message);
  }
  if (!existing) {
    const { error: insertError } = await supabase
      .from(SUPABASE_TABLES.ROUTINES)
      .insert({
        user_id: userId,
        name: DEFAULT_GLOBAL_ROUTINE_NAME,
        kind: ROUTINE_KIND.GLOBAL,
        mode: ROUTINE_MODE.CHECKLIST,
      });
    if (insertError) {
      throw new Error(insertError.message);
    }
  }
}

export const authService = {
  async getSessionUser(): Promise<AuthUser | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session?.user) {
        return null;
      }
      return mapSupabaseUser(data.session.user);
    }

    try {
      const data = await apiRequest<{ user: AuthUser }>(API_ENDPOINTS.ME);
      return data.user;
    } catch {
      return null;
    }
  },

  async login(credentials: LoginCredentials): Promise<AuthUser> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email.trim(),
        password: credentials.password,
      });
      if (error || !data.user) {
        throw new Error(error?.message || UI_MESSAGES.AUTH.AUTH_FAILED);
      }
      if (data.session) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
        if (sessionError) {
          throw new Error(sessionError.message);
        }
      }
      await ensureSupabaseGlobalRoutine(data.user.id);
      return mapSupabaseUser(data.user);
    }

    const payload = await apiRequest<AuthResponsePayload>(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return payload.user;
  },

  async register(credentials: RegisterCredentials): Promise<AuthUser> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email.trim(),
        password: credentials.password,
        options: {
          data: {
            name: credentials.name?.trim() || '',
          },
        },
      });
      if (error || !data.user) {
        throw new Error(error?.message || UI_MESSAGES.AUTH.AUTH_FAILED);
      }
      if (data.session) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
        if (sessionError) {
          throw new Error(sessionError.message);
        }
        await ensureSupabaseGlobalRoutine(data.user.id);
      }
      return mapSupabaseUser(data.user);
    }

    const payload = await apiRequest<AuthResponsePayload>(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return payload.user;
  },

  async logout(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }
      return;
    }

    await apiRequest<{ ok: boolean }>(API_ENDPOINTS.LOGOUT, { method: 'POST' });
  },
};
