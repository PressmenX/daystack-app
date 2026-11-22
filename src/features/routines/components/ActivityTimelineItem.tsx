import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check, GripVertical } from 'lucide-react';
import { formatDisplayTime } from '../../../common/dateUtils';
import { UI_MESSAGES } from '../../../constants/messages';
import type { Activity, RoutineWorkspaceMode } from '../routine.types';

interface ActivityTimelineItemProps {
  activity: Activity;
  isFirst: boolean;
  isLast: boolean;
  isNext: boolean;
  isSelected: boolean;
  mode: RoutineWorkspaceMode;
  onSelect: (activityId: string) => void;
  onOpenDetails: (activity: Activity) => void;
}

export function ActivityTimelineItem({
  activity,
  isFirst,
  isLast,
  isNext,
  isSelected,
  mode,
  onSelect,
  onOpenDetails,
}: ActivityTimelineItemProps) {
  const isEditMode = mode === 'edit';
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: activity.id, disabled: !isEditMode });
  const formattedTime = formatDisplayTime(activity.start_time);
  const timelineLineColor = activity.is_completed ? 'bg-brand' : 'bg-surface-muted';
  const nextNodeStyle = isEditMode
    ? 'border-info/60 bg-info/20'
    : 'border-warning/60 bg-warning/20';

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={`relative mb-3 flex items-stretch gap-3.5 sm:gap-4 ${
        isDragging ? 'z-20' : 'z-10'
      }`}
    >
      <div className="relative flex w-6 shrink-0 flex-col items-center">
        <div
          className={`w-0.75 flex-1 ${isFirst ? 'bg-transparent' : timelineLineColor} ${
            isEditMode ? 'opacity-0' : ''
          }`}
        />

        <div className="relative z-10 flex h-5 w-5 shrink-0 items-center justify-center">
          {isNext ? (
            <span
              aria-hidden="true"
              className={`absolute inset-0 z-0 rounded-full border-2 motion-safe:animate-ping ${nextNodeStyle} ${
                isEditMode ? 'opacity-0' : ''
              }`}
            />
          ) : null}
          {isEditMode ? (
            <button
              type="button"
              data-mode-control
              role="checkbox"
              aria-checked={isSelected}
              aria-label={`${UI_MESSAGES.DASHBOARD.SELECT_ACTIVITY_LABEL} ${activity.name}`}
              onClick={() => onSelect(activity.id)}
              className="absolute left-1/2 top-1/2 z-20 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-all active:scale-95 focus-visible:outline-2 focus-visible:outline-info"
            >
              {isSelected ? (
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-info bg-info/15 text-info shadow-xs">
                  <Check className="h-3.5 w-3.5 stroke-3" />
                </span>
              ) : (
                <span className="h-5 w-5 rounded-full border border-info bg-info/10" />
              )}
            </button>
          ) : activity.is_completed ? (
            <span className="relative z-10 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-brand-content transition-all duration-200">
              <Check className="h-3.5 w-3.5 stroke-3" />
            </span>
          ) : isNext ? (
            <span className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-warning bg-warning-soft transition-all duration-200">
              <span className="h-2.5 w-2.5 rounded-full bg-warning" />
            </span>
          ) : (
            <span className="relative z-10 h-5 w-5 rounded-full bg-surface-muted transition-all duration-200" />
          )}
        </div>

        <div
          className={`w-0.75 flex-1 ${isLast ? 'bg-transparent' : timelineLineColor} ${
            isEditMode ? 'opacity-0' : ''
          }`}
        />
      </div>

      <div
        data-activity-card
        className={`flex min-h-16 flex-1 items-stretch gap-1 rounded-2xl border transition-all ${
          isDragging
            ? 'border-brand/50 bg-surface shadow-lg ring-2 ring-brand/20'
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
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {!isLast ? (
        <span
          aria-hidden="true"
          className={`absolute -bottom-3 left-0 flex h-3 w-6 justify-center ${
            isEditMode ? 'opacity-0' : ''
          }`}
        >
          <span className={`h-full w-0.75 ${timelineLineColor}`} />
        </span>
      ) : null}
    </li>
  );
}
