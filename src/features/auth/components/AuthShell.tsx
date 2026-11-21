import type { ReactNode } from 'react';
import { APP_BRAND_UPPER, APP_NAME } from '../../../constants/appConstants';

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-subtle px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-brand-content shadow-sm">
            <img
              src="/icon-192x192.png"
              alt="Logo Daystack"
              className="h-full w-full rounded-2xl object-cover"
            />
          </div>
          <p className="mt-3 text-[11px] font-bold tracking-[0.18em] text-brand">
            {APP_BRAND_UPPER}
          </p>
          <h1 className="mt-1.5 font-display text-2xl font-extrabold tracking-tight text-content">
            {title}
          </h1>
          <p className="mt-1.5 text-sm text-content-muted">{subtitle}</p>
        </div>

        <section
          aria-label={APP_NAME}
          className="rounded-3xl border border-border/80 bg-surface p-6 shadow-sm sm:p-8"
        >
          {children}
        </section>
      </div>
    </main>
  );
}
