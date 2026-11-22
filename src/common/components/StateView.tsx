import { AlertCircle, ListPlus, RefreshCw } from "lucide-react";
import { UI_MESSAGES } from "../../constants/messages";

interface LoadingStateProps {
  message?: string;
}

export function TimelineLoadingState({
  message = UI_MESSAGES.STATES.LOADING,
}: LoadingStateProps) {
  return (
    <div aria-busy="true" aria-label={message}>
      <ol className="list-none p-0">
        {[0, 1, 2].map((item) => (
          <li
            key={item}
            className="relative flex items-stretch gap-3.5 sm:gap-4"
          >
            <div className="relative flex w-6 shrink-0 flex-col items-center">
              <div
                className={`w-0.5 flex-1 ${
                  item === 0 ? "bg-transparent" : "bg-surface-muted"
                }`}
              />
              <div className="skeleton relative z-10 h-4 w-4 shrink-0 rounded-full" />
              <div
                className={`w-0.5 flex-1 ${
                  item === 2 ? "bg-transparent" : "bg-surface-muted"
                }`}
              />
            </div>

            <div className="mb-3 flex min-h-18x-1 items-center justify-between gap-3 rounded-2xl border border-border/80 bg-surface px-4 py-3.5">
              <div className="min-w-0 flex-1 space-y-2">
                <div className="skeleton h-3 w-14 rounded" />
                <div
                  className={`skeleton h-4 rounded ${
                    item === 1 ? "w-36" : "w-44"
                  }`}
                />
              </div>
             
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function TimelineErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="alert flex flex-col items-start gap-4 rounded-2xl border border-danger/20 bg-danger-soft p-5 text-danger sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger" />
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="btn btn-sm  min-h-10 rounded-xl border-danger/20 bg-surface px-4 text-danger hover:bg-danger/15"
      >
        <RefreshCw className="h-4 w-4" />
        <span>{UI_MESSAGES.STATES.RETRY}</span>
      </button>
    </div>
  );
}

interface EmptyStateProps {
  onAddFirst: () => void;
}

export function TimelineEmptyState({ onAddFirst }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-surface-muted bg-surface px-6 py-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
        <ListPlus className="h-7 w-7" />
      </div>
      <h3 className="mt-4 font-display text-lg font-bold text-content">
        {UI_MESSAGES.STATES.EMPTY_TITLE}
      </h3>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-content-muted">
        {UI_MESSAGES.STATES.EMPTY_DESCRIPTION}
      </p>
      <button
        type="button"
        onClick={onAddFirst}
        className="btn mt-5 min-h-11 rounded-xl border-none bg-brand px-5 text-sm font-semibold text-brand-content hover:bg-brand"
      >
        {UI_MESSAGES.STATES.EMPTY_CTA}
      </button>
    </div>
  );
}
