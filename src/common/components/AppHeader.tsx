import { ArrowLeft, Check, Trash2 } from "lucide-react";
import { APP_BRAND_UPPER, APP_VERSION } from "../../constants/appConstants";
import { UI_MESSAGES } from "../../constants/messages";
import type { AuthUser } from "../common.types";
import { AppHeaderAccountMenu } from "./AppHeaderAccountMenu";

interface AppHeaderProps {
  title: string;
  user: AuthUser;
  onLogout: () => Promise<void>;
  isEditMode: boolean;
  selectedCount: number;
  isMutating: boolean;
  onExitEditMode: () => void;
  onCompleteSelected: () => void;
  onDeleteSelected: () => void;
}

export function AppHeader({
  title,
  user,
  onLogout,
  isEditMode,
  selectedCount,
  isMutating,
  onExitEditMode,
  onCompleteSelected,
  onDeleteSelected,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-surface-subtle/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {isEditMode ? (
          <div className="flex w-full items-center justify-between">
            <button
              type="button"
              data-mode-control
              onClick={onExitEditMode}
              disabled={isMutating}
              aria-label={UI_MESSAGES.HEADER.EXIT_EDIT_MODE}
              title={UI_MESSAGES.HEADER.EXIT_EDIT_MODE}
              className="flex h-11 w-11 items-center justify-center rounded-full text-content-muted transition-colors hover:text-content focus-visible:outline-2 focus-visible:outline-content-muted disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                data-mode-control
                onClick={onCompleteSelected}
                disabled={selectedCount === 0 || isMutating}
                aria-label={UI_MESSAGES.HEADER.BULK_COMPLETE}
                title={UI_MESSAGES.HEADER.BULK_COMPLETE}
                className="flex h-11 w-11 items-center justify-center rounded-full text-content-muted transition-colors hover:text-content focus-visible:outline-2 focus-visible:outline-content-muted disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Check className="h-5 w-5" />
              </button>
              <button
                type="button"
                data-mode-control
                onClick={onDeleteSelected}
                disabled={selectedCount === 0 || isMutating}
                aria-label={UI_MESSAGES.HEADER.BULK_DELETE}
                title={UI_MESSAGES.HEADER.BULK_DELETE}
                className="flex h-11 w-11 items-center justify-center rounded-full text-content-muted transition-colors hover:text-content focus-visible:outline-2 focus-visible:outline-content-muted disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex min-w-0 items-center gap-3">
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

            <AppHeaderAccountMenu user={user} onLogout={onLogout} />
          </>
        )}
      </div>
    </header>
  );
}
