import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { EMAIL_REGEX, MIN_PASSWORD_LENGTH } from '../../../constants/appConstants';
import { UI_MESSAGES } from '../../../constants/messages';
import { ROUTES } from '../../../constants/routes';
import type { LoginCredentials } from '../auth.types';
import { useAuth } from '../useAuth';
import { AuthShell } from './AuthShell';

export function LoginForm() {
  const { login, isSubmitting, authError, clearAuthError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: LoginCredentials): Promise<void> {
    await login(values);
  }

  return (
    <AuthShell
      title={UI_MESSAGES.AUTH.LOGIN_TITLE}
      subtitle={UI_MESSAGES.AUTH.LOGIN_SUBTITLE}
    >
      {authError ? (
        <div role="alert" className="alert alert-error mb-5 rounded-2xl border border-rose-200 bg-rose-50 text-rose-900">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
          <span className="text-sm font-medium">{authError}</span>
        </div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label htmlFor="login-email" className="mb-1.5 block text-sm font-semibold text-slate-700">
            {UI_MESSAGES.AUTH.EMAIL_LABEL}
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder={UI_MESSAGES.AUTH.EMAIL_PLACEHOLDER}
            className={`input input-bordered min-h-[46px] w-full rounded-xl bg-slate-50/70 text-sm text-slate-900 focus:border-emerald-600 focus:bg-white focus:outline-none ${
              errors.email ? 'border-rose-400' : 'border-slate-200'
            }`}
            {...register('email', {
              required: UI_MESSAGES.AUTH.EMAIL_REQUIRED,
              pattern: {
                value: EMAIL_REGEX,
                message: UI_MESSAGES.AUTH.EMAIL_INVALID,
              },
              onChange: clearAuthError,
            })}
          />
          {errors.email ? (
            <p className="mt-1 text-xs font-medium text-rose-600">{errors.email.message}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="login-password" className="mb-1.5 block text-sm font-semibold text-slate-700">
            {UI_MESSAGES.AUTH.PASSWORD_LABEL}
          </label>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder={UI_MESSAGES.AUTH.PASSWORD_PLACEHOLDER}
              className={`input input-bordered min-h-[46px] w-full rounded-xl bg-slate-50/70 pr-12 text-sm text-slate-900 focus:border-emerald-600 focus:bg-white focus:outline-none ${
                errors.password ? 'border-rose-400' : 'border-slate-200'
              }`}
              {...register('password', {
                required: UI_MESSAGES.AUTH.PASSWORD_REQUIRED,
                minLength: {
                  value: MIN_PASSWORD_LENGTH,
                  message: UI_MESSAGES.AUTH.PASSWORD_MIN,
                },
                onChange: clearAuthError,
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
              className="absolute right-1 top-1/2 flex min-h-[40px] min-w-[40px] -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password ? (
            <p className="mt-1 text-xs font-medium text-rose-600">{errors.password.message}</p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn mt-2 min-h-[48px] w-full rounded-xl border-none bg-slate-900 text-sm font-semibold text-white hover:bg-slate-800"
        >
          {isSubmitting ? <span className="loading loading-spinner loading-sm" /> : null}
          <span>{UI_MESSAGES.AUTH.LOGIN_SUBMIT}</span>
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        {UI_MESSAGES.AUTH.NO_ACCOUNT}{' '}
        <Link
          to={ROUTES.REGISTER}
          onClick={clearAuthError}
          className="font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
        >
          {UI_MESSAGES.AUTH.GO_REGISTER}
        </Link>
      </p>
    </AuthShell>
  );
}
