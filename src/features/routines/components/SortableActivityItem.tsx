import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { formatDisplayTime } from '../../../common/dateUtils';
import { UI_MESSAGES } from '../../../constants/messages';
import type { Activity } from '../routine.types';

interface SortableActivityItemProps {
  activity: Activity;
  index: number;
  isFirst: boolean;
  isLast: boolean;
}

export function SortableActivityItem({
  activity,
  index,
  isFirst,
  isLast,
}: SortableActivityItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: activity.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formattedTime = formatDisplayTime(activity.start_time);
  const stepLabel = String(index + 1).padStart(2, '0');
  const isHighlightedNode = index === 0 || isDragging || activity.is_completed;

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`relative flex items-stretch gap-3.5 sm:gap-4 ${
        isDragging ? 'z-20' : 'z-10'
      }`}
    >
      <div className="relative flex w-9 shrink-0 flex-col items-center">
        <div
          className={`w-0.5 flex-1 ${
            isFirst
              ? 'bg-transparent'
              : activity.is_completed
                ? 'bg-brand'
                : 'bg-surface-muted'
          }`}
        />
        <span
          className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-xs font-bold tabular-nums ${
            isHighlightedNode
              ? 'bg-brand text-brand-content shadow-xs'
              : 'border border-border bg-surface-muted text-content-secondary'
          }`}
        >
          {stepLabel}
        </span>
        <div
          className={`w-0.5 flex-1 ${
            isLast
              ? 'bg-transparent'
              : activity.is_completed
                ? 'bg-brand'
                : 'bg-surface-muted'
          }`}
        />
      </div>

      <div
        className={`mb-3 flex flex-1 items-center justify-between gap-3 rounded-2xl border bg-surface px-4 py-3.5 transition-shadow ${
          isDragging
            ? 'border-brand/50 shadow-lg ring-2 ring-brand/20'
            : 'border-border/80 shadow-xs'
        }`}
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate font-display text-sm font-bold text-content sm:text-base">
              {activity.name}
            </p>
            {isDragging ? (
              <span className="rounded-md bg-warning-soft px-2 py-0.5 text-[10px] font-bold tracking-wide text-warning">
                {UI_MESSAGES.REORDER.DRAGGING_BADGE}
              </span>
            ) : null}
          </div>

          {formattedTime ? (
            <p className="mt-1 text-xs font-medium tabular-nums text-content-muted">
              {formattedTime} {UI_MESSAGES.REORDER.TIME_SUFFIX}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          aria-label={`Geser urutan ${activity.name}`}
          className={`flex min-h-11 min-w-11 touch-none cursor-grab items-center justify-center rounded-xl transition-colors active:cursor-grabbing ${
            isDragging
              ? 'bg-brand/15 text-brand'
              : 'text-content-disabled hover:bg-surface-muted hover:text-content-secondary'
          }`}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </button>
      </div>
    </li>
  );
}
