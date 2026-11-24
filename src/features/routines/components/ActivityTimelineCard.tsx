import { Check, GripVertical } from 'lucide-react';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import type { DraggableAttributes } from '@dnd-kit/core';
import { formatDisplayTime } from '../../../common/dateUtils';
import { UI_MESSAGES } from '../../../constants/messages';
import type { Activity } from '../routine.types';

interface ActivityTimelineCardProps {
  activity: Activity;
  isEditMode: boolean;
  isSelected: boolean;
  isNext: boolean;
  isDragging: boolean;
  dragAttributes: DraggableAttributes;
  dragListeners: SyntheticListenerMap | undefined;
  onOpenDetails: (activity: Activity) => void;
  onToggleCompletion: (activity: Activity) => Promise<boolean>;
}

export function ActivityTimelineCard({
  activity,
  isEditMode,
  isSelected,
  isNext,
  isDragging,
  dragAttributes,
  dragListeners,
  onOpenDetails,
  onToggleCompletion,
}: ActivityTimelineCardProps) {
  const formattedTime = formatDisplayTime(activity.start_time);

  return (
    <div
      data-activity-card
      className={`flex min-h-16 flex-1 items-stretch gap-1 rounded-2xl border transition-all ${
        isDragging
          ? 'border-brand/50 bg-surface shadow-lg ring-2 ring-brand/20'
          : isEditMode && isSelected
            ? 'border-info bg-info/10 shadow-md ring-2 ring-info/30'
          : activity.is_completed
            ? 'border-brand/60 bg-brand/10 shadow-none'
            : isNext
              ? 'border-warning/50 bg-warning-soft shadow-warning/40 shadow-lg border-3'
              : 'border-border/80 bg-surface shadow-xs'
      }`}
    >
      <button
        type="button"
        onClick={() => onOpenDetails(activity)}
        aria-label={`${UI_MESSAGES.DASHBOARD.ACTIVITY_DETAILS_LABEL} ${activity.name}`}
        className="flex min-w-0 flex-1 items-center px-4 py-3.5 text-left focus-visible:outline-2 focus-visible:outline-brand"
      >
        <div className="min-w-0 flex-1">
          {formattedTime || isNext ? (
            <div className="mb-1 flex flex-wrap items-center gap-2">
              {formattedTime ? (
                <span
                  className={`text-xs font-semibold tabular-nums ${
                    activity.is_completed
                      ? 'text-brand/60'
                      : isNext
                        ? 'text-warning'
                        : 'text-content-muted'
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

          <div className="flex flex-wrap items-center gap-2">
            <p
              className={`wrap-break-word text-sm font-semibold sm:text-base ${
                activity.is_completed
                  ? 'text-brand line-through decoration-2 decoration-brand/50 opacity-30'
                  : 'text-content'
              }`}
            >
              {activity.name}
            </p>
            {isDragging ? (
              <span className="rounded-md bg-warning-soft px-2 py-0.5 text-[10px] font-bold tracking-wide text-warning">
                {UI_MESSAGES.DASHBOARD.DRAGGING_BADGE}
              </span>
            ) : null}
          </div>
        </div>
      </button>

      {!isEditMode ? (
        <button
          type="button"
          role="checkbox"
          aria-checked={activity.is_completed}
          aria-label={`${activity.is_completed ? UI_MESSAGES.ACTIVITY.MARK_UNDONE_ACTION : UI_MESSAGES.ACTIVITY.MARK_DONE_ACTION}: ${activity.name}`}
          onClick={() => void onToggleCompletion(activity)}
          className="relative mr-3 flex h-11 w-11 shrink-0 self-center items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-brand"
        >
          {isNext && !activity.is_completed ? (
            <span
              aria-hidden="true"
              className="absolute inset-1 rounded-full border-2 border-warning motion-safe:animate-ping"
            />
          ) : null}
          <span
            className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors ${
              activity.is_completed
                ? 'border-brand bg-brand text-brand-content'
                : isNext
                  ? 'border-warning bg-surface text-warning'
                  : 'border-surface-muted bg-surface text-content-disabled'
            }`}
          >
            {activity.is_completed ? (
              <Check className="h-5 w-5 stroke-[3]" />
            ) : null}
          </span>
        </button>
      ) : (
        <button
          type="button"
          data-mode-control
          aria-label={`${UI_MESSAGES.DASHBOARD.DRAG_ACTIVITY_LABEL} ${activity.name}`}
          className={`mr-1 my-1 flex min-h-11 min-w-11 touch-none cursor-grab items-center justify-center rounded-xl transition-colors active:cursor-grabbing ${
            isDragging
              ? 'bg-brand/15 text-brand'
              : 'text-content-disabled hover:bg-surface-muted hover:text-content-secondary'
          }`}
          {...dragAttributes}
          {...dragListeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
