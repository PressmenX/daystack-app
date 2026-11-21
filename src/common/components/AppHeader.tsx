import { ArrowLeft, LogOut, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { APP_BRAND_UPPER, APP_VERSION } from "../../constants/appConstants";
import { UI_MESSAGES } from "../../constants/messages";
import type { AuthUser } from "../common.types";

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
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-surface-subtle/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              aria-label={UI_MESSAGES.REORDER.BACK_LABEL}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-content-secondary transition-colors hover:bg-surface-muted/70 focus-visible:outline-2 focus-visible:outline-brand"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          ) : null}

          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand text-brand-content shadow-sm">
              <img
                src="/icon-192x192.png"
                alt="Logo Daystack"
                className="h-full w-full rounded-2xl object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold tracking-[0.14em] text-brand">
                  {APP_BRAND_UPPER}
                </p>
                <span className="badge badge-outline badge-xs text-[10px] font-semibold text-content-disabled">
                  v{APP_VERSION}
                </span>
              </div>
              <h1 className="truncate font-display text-base font-bold text-content sm:text-lg">
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
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-brand text-brand-content shadow-sm transition-all hover:brightness-70"
          >
            <span>{user.name[0]}</span>
          </button>

          {menuOpen ? (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-border bg-surface p-3 shadow-lg">
              <div className="border-b border-surface-muted px-2 pb-2.5">
                <p className="truncate text-sm font-semibold text-content">
                  {user.name}
                </p>
                <p className="truncate text-xs text-content-muted">
                  {user.email}
                </p>
              </div>
              <div className="mt-2 px-2.5 text-[11px] font-medium text-content-disabled">
                Versi aplikasi v{APP_VERSION}
              </div>
              <button
                type="button"
                onClick={async () => {
                  setMenuOpen(false);
                  await onLogout();
                }}
                className="mt-2 flex min-h-[44px] w-full items-center gap-2.5 rounded-xl px-2.5 text-sm font-medium text-danger transition-colors hover:bg-danger-soft"
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
