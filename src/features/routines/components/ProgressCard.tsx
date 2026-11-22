import { Check, ChevronRight, Clock, TrendingUp } from 'lucide-react';
import { UI_MESSAGES } from '../../../constants/messages';
import type { RoutineProgress } from '../routine.types';

interface ProgressCardProps {
  progress: RoutineProgress;
}

export function ProgressCard({ progress }: ProgressCardProps) {
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
        isAllCompleted ? 'bg-brand' : 'bg-surface'
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
              isAllCompleted ? 'text-white/70' : 'text-content-muted'
            }`}
          >
            {UI_MESSAGES.DASHBOARD.PROGRESS_KICKER}
          </p>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
              isAllCompleted ? 'bg-white/20 text-white' : 'bg-brand/10 text-brand'
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

        <div className="mt-3 flex items-baseline justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span
              className={`font-display text-2xl font-extrabold tabular-nums sm:text-3xl ${
                isAllCompleted ? 'text-white' : 'text-content'
              }`}
            >
              {completedCount} / {totalCount} {UI_MESSAGES.DASHBOARD.COMPLETED_LABEL}
            </span>
            {completedCount > 0 ? (
              <span
                className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${
                  isAllCompleted ? 'bg-white text-brand' : 'bg-brand text-brand-content'
                }`}
              >
                <Check className="h-3.5 w-3.5 stroke-3" />
              </span>
            ) : null}
          </div>
          <span className={`font-display text-xl font-bold tabular-nums sm:text-2xl ${isAllCompleted ? 'text-white' : 'text-brand'}`}>
            {percentage}%
          </span>
        </div>

        <div
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          className={`mt-4 h-2.5 w-full overflow-hidden rounded-full ${
            isAllCompleted ? 'bg-white/25' : 'bg-brand/15'
          }`}
        >
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isAllCompleted ? 'bg-white' : 'bg-brand'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div
          className={`mt-4 flex items-start gap-2 text-sm leading-relaxed ${
            isAllCompleted ? 'text-white' : 'text-content-secondary'
          }`}
        >
          <ChevronRight
            className={`mt-0.5 h-4 w-4 shrink-0 ${
              isAllCompleted ? 'text-white' : 'text-brand'
            }`}
          />
          <p>{helperMessage}</p>
        </div>
      </div>
    </section>
  );
}
