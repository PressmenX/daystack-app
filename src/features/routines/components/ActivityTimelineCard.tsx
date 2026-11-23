import { GripVertical } from 'lucide-react';
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

      {isEditMode ? (
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
      ) : null}
    </div>
  );
}
