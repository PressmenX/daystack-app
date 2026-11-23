import { LogOut } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { APP_VERSION } from '../../constants/appConstants';
import { UI_MESSAGES } from '../../constants/messages';
import type { AuthUser } from '../common.types';

interface AppHeaderAccountMenuProps {
  user: AuthUser;
  onLogout: () => Promise<void>;
}

export function AppHeaderAccountMenu({
  user,
  onLogout,
}: AppHeaderAccountMenuProps) {
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
    <div className="relative shrink-0" ref={menuRef}>
      <button
        type="button"
        onClick={() => setMenuOpen((previous) => !previous)}
        aria-label={UI_MESSAGES.HEADER.ACCOUNT}
        aria-expanded={menuOpen}
        className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-brand text-brand-content shadow-sm transition-all hover:brightness-70"
      >
        <span>{user.name[0]}</span>
      </button>

      {menuOpen ? (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-border bg-surface p-3 shadow-lg">
          <div className="border-b border-surface-muted px-2 pb-2.5">
            <p className="truncate text-sm font-semibold text-content">
              {user.name}
            </p>
            <p className="truncate text-xs text-content-muted">{user.email}</p>
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
            className="mt-2 flex min-h-11 w-full items-center gap-2.5 rounded-xl px-2.5 text-sm font-medium text-danger transition-colors hover:bg-danger-soft"
          >
            <LogOut className="h-4 w-4" />
            <span>{UI_MESSAGES.HEADER.LOGOUT}</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
