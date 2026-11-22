import { Check, Pencil, Trash2 } from "lucide-react";
import { formatDisplayTime } from "../../../common/dateUtils";
import { UI_MESSAGES } from "../../../constants/messages";
import type { Activity } from "../routine.types";

interface ActivityTimelineItemProps {
  activity: Activity;
  isFirst: boolean;
  isLast: boolean;
  isNext: boolean;
  isCheckMode: boolean;
  onToggle: (activity: Activity) => Promise<void>;
  onEdit: (activity: Activity) => void;
  onDelete: (activity: Activity) => void;
}

export function ActivityTimelineItem({
  activity,
  isFirst,
  isLast,
  isNext,
  isCheckMode,
  onToggle,
  onEdit,
  onDelete,
}: ActivityTimelineItemProps) {
  const formattedTime = formatDisplayTime(activity.start_time);

  return (
    <li className="relative flex items-stretch gap-3.5 sm:gap-4">
      <div className="relative flex w-6 shrink-0 flex-col items-center">
        <div
          className={`w-0.5 flex-1 ${
            isFirst
              ? "bg-transparent"
              : activity.is_completed
                ? "bg-brand/40"
                : "bg-surface-muted"
          }`}
        />

        <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center">
          {isNext ? (
            <span
              aria-hidden="true"
              className="absolute inset-0 z-0 rounded-full border-2 border-warning/60 bg-warning/20 motion-safe:animate-ping"
            />
          ) : null}
          {activity.is_completed ? (
            <span className="relative z-10 h-4 w-4 rounded-full bg-brand transition-all duration-200" />
          ) : isNext ? (
            <span className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-warning bg-warning-soft transition-all duration-200">
              <span className="h-2.5 w-2.5 rounded-full bg-warning" />
            </span>
          ) : (
            <span className="relative z-10 h-4 w-4 rounded-full border border-surface-muted bg-surface-muted transition-all duration-200" />
          )}
          <button
            type="button"
            role="checkbox"
            aria-checked={activity.is_completed}
            aria-hidden={!isCheckMode}
            aria-label={`Tandai ${activity.name} ${
              activity.is_completed ? "belum selesai" : "selesai"
            }`}
            tabIndex={isCheckMode ? 0 : -1}
            disabled={!isCheckMode}
            onClick={() => void onToggle(activity)}
            className={`absolute left-1/2 top-1/2 z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-200 active:scale-95 focus-visible:outline-2 focus-visible:outline-brand ${
              isCheckMode ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            {activity.is_completed ? (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-brand-content shadow-xs">
                <Check className="h-3.5 w-3.5 stroke-3" />
              </span>
            ) : (
              <span
                className={`h-6 w-6 rounded-full border-2 bg-surface ${
                  isNext ? "border-warning" : "border-brand"
                }`}
              />
            )}
          </button>
        </div>

        <div
          className={`w-0.5 flex-1 ${
            isLast
              ? "bg-transparent"
              : activity.is_completed
                ? "bg-brand/40"
                : "bg-surface-muted"
          }`}
        />
      </div>

      <div
        className={`mb-3 flex flex-1 items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 transition-colors ${
          activity.is_completed
            ? "border-brand/50 bg-brand/10 shadow-none opacity-50"
            : isNext
              ? "border-warning/50 bg-warning-soft shadow-warning/40 shadow-lg border-3"
              : "border-border/80 bg-surface shadow-xs"
        }`}
      >
        <div className="min-w-0 flex-1">
          {formattedTime || isNext ? (
            <div className="mb-1 flex flex-wrap items-center gap-2">
              {formattedTime ? (
                <span
                  className={`text-xs font-semibold tabular-nums ${
                    activity.is_completed
                      ? "text-brand/60"
                      : isNext
                        ? "text-warning"
                        : "text-content-muted"
                  }`}
                >
                  {formattedTime}
                </span>
              ) : null}
              {isNext ? (
                <span className="rounded-md bg-warning px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-warning-content">
                  {UI_MESSAGES.DASHBOARD.NEXT_BADGE}
                </span>
              ) : null}
            </div>
          ) : null}

          <p
            className={`wrap-break-word text-sm font-semibold sm:text-base ${
              activity.is_completed
                ? "text-brand/70 line-through decoration-2 decoration-brand/50"
                : "text-content"
            }`}
          >
            {activity.name}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            onClick={() => onEdit(activity)}
            aria-label={`Ubah ${activity.name}`}
            className={`flex min-h-11 min-w-10 items-center justify-center rounded-xl text-content-disabled transition-colors hover:bg-surface-muted hover:text-content-secondary focus-visible:outline-2 focus-visible:outline-brand ${
              activity.is_completed ? "opacity-60" : ""
            }`}
          >
            <Pencil className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(activity)}
            aria-label={`Hapus ${activity.name}`}
            className={`flex min-h-11 min-w-10 items-center justify-center rounded-xl text-content-disabled transition-colors hover:bg-danger-soft hover:text-danger focus-visible:outline-2 focus-visible:outline-danger ${
              activity.is_completed ? "opacity-60" : ""
            }`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </li>
  );
}
