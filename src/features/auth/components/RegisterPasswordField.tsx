import { Eye, EyeOff } from 'lucide-react';
import type { FieldError, UseFormRegister } from 'react-hook-form';
import { MIN_PASSWORD_LENGTH } from '../../../constants/appConstants';
import { UI_MESSAGES } from '../../../constants/messages';
import type { RegisterCredentials } from '../auth.types';

interface RegisterPasswordFieldProps {
  register: UseFormRegister<RegisterCredentials>;
  passwordError: FieldError | undefined;
  showPassword: boolean;
  onToggle: () => void;
  onChange: () => void;
}

export function RegisterPasswordField({
  register,
  passwordError,
  showPassword,
  onToggle,
  onChange,
}: RegisterPasswordFieldProps) {
  return (
    <div>
      <label
        htmlFor="register-password"
        className="mb-1.5 block text-sm font-semibold text-content-secondary"
      >
        {UI_MESSAGES.AUTH.PASSWORD_LABEL}
      </label>
      <div className="relative">
        <input
          id="register-password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder={UI_MESSAGES.AUTH.PASSWORD_PLACEHOLDER}
          className={`input input-bordered min-h-11.5 w-full rounded-xl bg-surface-subtle/70 pr-12 text-sm text-content focus:border-brand focus:bg-surface focus:outline-none ${
            passwordError ? 'border-danger' : 'border-border'
          }`}
          {...register('password', {
            required: UI_MESSAGES.AUTH.PASSWORD_REQUIRED,
            minLength: {
              value: MIN_PASSWORD_LENGTH,
              message: UI_MESSAGES.AUTH.PASSWORD_MIN,
            },
            onChange,
          })}
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
          className="absolute right-1 top-1/2 flex min-h-10 min-w-10 -translate-y-1/2 items-center justify-center rounded-lg text-content-disabled hover:text-content-secondary"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
      {passwordError ? (
        <p className="mt-1 text-xs font-medium text-danger">
          {passwordError.message}
        </p>
      ) : null}
    </div>
  );
}
