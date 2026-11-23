import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import {
  EMAIL_REGEX,
  MAX_USER_NAME_LENGTH,
} from "../../../constants/appConstants";
import { UI_MESSAGES } from "../../../constants/messages";
import { ROUTES } from "../../../constants/routes";
import type { RegisterCredentials } from "../auth.types";
import { useAuth } from "../useAuth";
import { AuthShell } from "./AuthShell";
import { RegisterPasswordField } from "./RegisterPasswordField";

export function RegisterForm() {
  const {
    register: registerAccount,
    isSubmitting,
    authError,
    clearAuthError,
  } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterCredentials>({
    defaultValues: { name: "", email: "", password: "" },
  });

  async function onSubmit(values: RegisterCredentials): Promise<void> {
    await registerAccount(values);
  }

  return (
    <AuthShell
      title={UI_MESSAGES.AUTH.REGISTER_TITLE}
      subtitle={UI_MESSAGES.AUTH.REGISTER_SUBTITLE}
    >
      {authError ? (
        <div
          role="alert"
          className="alert alert-error mb-5 rounded-2xl border border-danger/20 bg-danger-soft text-danger"
        >
          <AlertCircle className="h-5 w-5 shrink-0 text-danger" />
          <span className="text-sm font-medium">{authError}</span>
        </div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="register-name"
            className="mb-1.5 block text-sm font-semibold text-content-secondary"
          >
            {UI_MESSAGES.AUTH.NAME_LABEL}
          </label>
          <input
            id="register-name"
            type="text"
            autoComplete="name"
            maxLength={MAX_USER_NAME_LENGTH}
            placeholder={UI_MESSAGES.AUTH.NAME_PLACEHOLDER}
            className="input input-bordered min-h-11.5 w-full rounded-xl border-border bg-surface-subtle/70 text-sm text-content focus:border-brand focus:bg-surface focus:outline-none"
            {...register("name", { onChange: clearAuthError })}
          />
        </div>

        <div>
          <label
            htmlFor="register-email"
            className="mb-1.5 block text-sm font-semibold text-content-secondary"
          >
            {UI_MESSAGES.AUTH.EMAIL_LABEL}
          </label>
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            placeholder={UI_MESSAGES.AUTH.EMAIL_PLACEHOLDER}
            className={`input input-bordered min-h-11.5 w-full rounded-xl bg-surface-subtle/70 text-sm text-content focus:border-brand focus:bg-surface focus:outline-none ${
              errors.email ? "border-danger" : "border-border"
            }`}
            {...register("email", {
              required: UI_MESSAGES.AUTH.EMAIL_REQUIRED,
              pattern: {
                value: EMAIL_REGEX,
                message: UI_MESSAGES.AUTH.EMAIL_INVALID,
              },
              onChange: clearAuthError,
            })}
          />
          {errors.email ? (
            <p className="mt-1 text-xs font-medium text-danger">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <RegisterPasswordField
          register={register}
          passwordError={errors.password}
          showPassword={showPassword}
          onToggle={() => setShowPassword((previous) => !previous)}
          onChange={clearAuthError}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn mt-2 min-h-12 w-full rounded-xl border-none bg-brand text-sm font-semibold text-brand-content hover:bg-brand"
        >
          {isSubmitting ? (
            <span className="loading loading-spinner loading-sm" />
          ) : null}
          <span>{UI_MESSAGES.AUTH.REGISTER_SUBMIT}</span>
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-content-muted">
        {UI_MESSAGES.AUTH.HAVE_ACCOUNT}{" "}
        <Link
          to={ROUTES.LOGIN}
          onClick={clearAuthError}
          className="font-semibold text-brand hover:text-brand hover:underline"
        >
          {UI_MESSAGES.AUTH.GO_LOGIN}
        </Link>
      </p>
    </AuthShell>
  );
}
