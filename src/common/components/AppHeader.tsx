import { ArrowLeft, LogOut, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { APP_BRAND_UPPER } from '../../constants/appConstants';
import { UI_MESSAGES } from '../../constants/messages';
import type { AuthUser } from '../common.types';

interface AppHeaderProps {
  title: string;
  user: AuthUser;
  onLogout: () => Promise<void>;
  onBack?: () => void;
}

export function AppHeader({ title, user, onLogout, onBack }: AppHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent): void {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-[#F6F8FB]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              aria-label={UI_MESSAGES.REORDER.BACK_LABEL}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-700 transition-colors hover:bg-slate-200/70 focus-visible:outline-2 focus-visible:outline-emerald-600"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          ) : null}

          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-sm">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  d="M4 7.5L12 3.5L20 7.5L12 11.5L4 7.5Z"
                  fill="currentColor"
                />
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
            <div className="min-w-0">
              <p className="text-[10px] font-bold tracking-[0.14em] text-emerald-700">
                {APP_BRAND_UPPER}
              </p>
              <h1 className="truncate font-display text-base font-bold text-slate-900 sm:text-lg">
                {title}
              </h1>
            </div>
          </div>
        </div>

        <div className="relative shrink-0" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={UI_MESSAGES.HEADER.ACCOUNT}
            aria-expanded={menuOpen}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-emerald-800 text-white shadow-sm transition-colors hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-emerald-600"
          >
            <User className="h-5 w-5" />
          </button>

          {menuOpen ? (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg">
              <div className="border-b border-slate-100 px-2 pb-2.5">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {user.name}
                </p>
                <p className="truncate text-xs text-slate-500">{user.email}</p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  setMenuOpen(false);
                  await onLogout();
                }}
                className="mt-2 flex min-h-[44px] w-full items-center gap-2.5 rounded-xl px-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
              >
                <LogOut className="h-4 w-4" />
                <span>{UI_MESSAGES.HEADER.LOGOUT}</span>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
