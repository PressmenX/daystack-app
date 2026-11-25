import { Check, Clock, TrendingUp } from "lucide-react";
import { UI_MESSAGES } from "../../../constants/messages";
import type { RoutineProgress } from "../routine.types";

interface ProgressCardProps {
  progress: RoutineProgress;
  isMutating: boolean;
  onClearAll: () => void;
}

export function ProgressCard({
  progress,
  isMutating,
  onClearAll,
}: ProgressCardProps) {
  const { completedCount, totalCount, percentage, remainingCount } = progress;

  const isAllCompleted = totalCount > 0 && remainingCount === 0;
  let statusLabel: string = UI_MESSAGES.DASHBOARD.STATUS_IN_PROGRESS;
  let helperMessage = `${UI_MESSAGES.DASHBOARD.PROGRESS_MSG_REMAINING_PREFIX} ${remainingCount} ${UI_MESSAGES.DASHBOARD.PROGRESS_MSG_REMAINING_SUFFIX}`;

  if (totalCount === 0) {
    statusLabel = UI_MESSAGES.DASHBOARD.STATUS_EMPTY;
    helperMessage = UI_MESSAGES.DASHBOARD.PROGRESS_MSG_EMPTY;
  } else if (remainingCount === 0) {
    statusLabel = UI_MESSAGES.DASHBOARD.STATUS_DONE;
    helperMessage = UI_MESSAGES.DASHBOARD.PROGRESS_MSG_ALL_DONE;
  } else if (completedCount === 0) {
    statusLabel = UI_MESSAGES.DASHBOARD.STATUS_PENDING;
  }

  return (
    <section
      aria-label={UI_MESSAGES.DASHBOARD.PROGRESS_KICKER}
      className={`relative overflow-hidden rounded-3xl border border-border/80 p-5 shadow-sm transition-colors sm:p-6 ${
        isAllCompleted ? "bg-brand" : "bg-surface"
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-brand/10"
      />

      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <p
            className={`text-xs font-bold tracking-[0.12em] ${
              isAllCompleted ? "text-white/70" : "text-content-muted"
            }`}
          >
            {UI_MESSAGES.DASHBOARD.PROGRESS_KICKER}
          </p>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
              isAllCompleted
                ? "bg-white/20 text-white"
                : "bg-brand/10 text-brand"
            }`}
          >
            {totalCount === 0 ? (
              <Clock className="h-3.5 w-3.5" />
            ) : (
              <TrendingUp className="h-3.5 w-3.5" />
            )}
            <span>{statusLabel}</span>
          </span>
        </div>

        <div className="mt-3 flex flex-row-reverse items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span
                className={`font-display text-xl font-extrabold tabular-nums sm:text-2xl ${
                  isAllCompleted ? "text-white" : "text-content"
                }`}
              >
                {completedCount} / {totalCount}{" "}
                {UI_MESSAGES.DASHBOARD.COMPLETED_LABEL}
              </span>
              {completedCount > 0 ? (
                <span
                  className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                    isAllCompleted
                      ? "bg-white text-brand"
                      : "bg-brand text-brand-content"
                  }`}
                >
                  <Check className="h-3 w-3 stroke-3" />
                </span>
              ) : null}
            </div>
            <div
              className={` py-2 text-xs leading-relaxed ${
                isAllCompleted ? "text-white" : "text-content-secondary"
              }`}
            >
              {isAllCompleted ? (
                <button
                  type="button"
                  onClick={onClearAll}
                  disabled={isMutating}
                  className="btn btn-sm min-h-8 rounded-lg border border-white bg-transparent px-3 text-white shadow-none hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isMutating
                    ? "Menghapus..."
                    : UI_MESSAGES.DASHBOARD.CLEAR_ALL}
                </button>
              ) : (
                <p>{helperMessage}</p>
              )}
            </div>
          </div>
          <div
            role="progressbar"
            aria-label={UI_MESSAGES.DASHBOARD.PROGRESS_KICKER}
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            className="relative h-24 w-24 shrink-0 sm:h-28 sm:w-28"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 96 96"
              className="h-full w-full -rotate-90"
            >
              <circle
                cx="48"
                cy="48"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="7"
                className={isAllCompleted ? "text-white/25" : "text-brand/15"}
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 40}
                strokeDashoffset={2 * Math.PI * 40 * (1 - percentage / 100)}
                className={`transition-[stroke-dashoffset] duration-300 ${
                  isAllCompleted ? "text-white" : "text-brand"
                }`}
              />
            </svg>
            <span
              className={`absolute inset-0 flex items-center justify-center font-display text-lg font-bold tabular-nums sm:text-xl ${
                isAllCompleted ? "text-white" : "text-brand"
              }`}
            >
              {percentage}%
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
