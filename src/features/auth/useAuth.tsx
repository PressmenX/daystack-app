import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { AuthUser } from '../../common/common.types';
import { useToast } from '../../common/useToast';
import { UI_MESSAGES } from '../../constants/messages';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import type { LoginCredentials, RegisterCredentials } from './auth.types';
import { authService } from './authService';

interface AuthContextValue {
  user: AuthUser | null;
  isInitializing: boolean;
  isSubmitting: boolean;
  authError: string | null;
  clearAuthError: () => void;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    let active = true;
    authService
      .getSessionUser()
      .then((sessionUser) => {
        if (active) {
          setUser(sessionUser);
        }
      })
      .finally(() => {
        if (active) {
          setIsInitializing(false);
        }
      });

    if (isSupabaseConfigured && supabase) {
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!session?.user) {
          setUser(null);
        }
      });
      return () => {
        active = false;
        listener.subscription.unsubscribe();
      };
    }

    return () => {
      active = false;
    };
  }, []);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<boolean> => {
      setIsSubmitting(true);
      setAuthError(null);
      try {
        const loggedUser = await authService.login(credentials);
        setUser(loggedUser);
        showToast(UI_MESSAGES.AUTH.LOGIN_SUCCESS, 'success');
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : UI_MESSAGES.AUTH.AUTH_FAILED;
        setAuthError(message);
        showToast(message, 'error');
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [showToast]
  );

  const register = useCallback(
    async (credentials: RegisterCredentials): Promise<boolean> => {
      setIsSubmitting(true);
      setAuthError(null);
      try {
        const createdUser = await authService.register(credentials);
        setUser(createdUser);
        showToast(UI_MESSAGES.AUTH.REGISTER_SUCCESS, 'success');
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : UI_MESSAGES.AUTH.AUTH_FAILED;
        setAuthError(message);
        showToast(message, 'error');
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [showToast]
  );

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    showToast(UI_MESSAGES.AUTH.LOGOUT_SUCCESS, 'success');
  }, [showToast]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isInitializing,
        isSubmitting,
        authError,
        clearAuthError,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
