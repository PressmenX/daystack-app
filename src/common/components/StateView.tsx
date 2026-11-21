import { AlertCircle, ListPlus, RefreshCw } from "lucide-react";
import { UI_MESSAGES } from "../../constants/messages";

interface LoadingStateProps {
  message?: string;
}

export function TimelineLoadingState({
  message = UI_MESSAGES.STATES.LOADING,
}: LoadingStateProps) {
  return (
    <div className="space-y-3" aria-busy="true" aria-label={message}>
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="flex items-center gap-4 rounded-2xl border border-border/70 bg-surface p-4"
        >
          <div className="skeleton h-6 w-6 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-3 w-14 rounded" />
            <div className="skeleton h-4 w-44 rounded" />
          </div>
          <div className="skeleton h-7 w-7 shrink-0 rounded-full" />
        </div>
      ))}
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
        className="btn mt-5 min-h-[44px] rounded-xl border-none bg-brand px-5 text-sm font-semibold text-brand-content hover:bg-brand"
      >
        {UI_MESSAGES.STATES.EMPTY_CTA}
      </button>
    </div>
  );
}
