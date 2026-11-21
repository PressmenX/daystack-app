import type { ReactNode } from 'react';
import { APP_BRAND_UPPER, APP_NAME } from '../../../constants/appConstants';

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F6F8FB] px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-sm">
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
              <path d="M4 7.5L12 3.5L20 7.5L12 11.5L4 7.5Z" fill="currentColor" />
              <path
                d="M4 12L12 16L20 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 16.5L12 20.5L20 16.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="mt-3 text-[11px] font-bold tracking-[0.18em] text-emerald-700">
            {APP_BRAND_UPPER}
          </p>
          <h1 className="mt-1.5 font-display text-2xl font-extrabold tracking-tight text-slate-900">
            {title}
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>
        </div>

        <section
          aria-label={APP_NAME}
          className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8"
        >
          {children}
        </section>
      </div>
    </main>
  );
}
