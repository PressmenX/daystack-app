import { Check } from 'lucide-react';
import { UI_MESSAGES } from '../../../constants/messages';

interface ActivityTimelineNodeProps {
  isEditMode: boolean;
  isSelected: boolean;
  isCompleted: boolean;
  isNext: boolean;
  activityName: string;
  onSelect: () => void;
}

export function ActivityTimelineNode({
  isEditMode,
  isSelected,
  isCompleted,
  isNext,
  activityName,
  onSelect,
}: ActivityTimelineNodeProps) {
  const nextNodeStyle = isEditMode
    ? 'border-info/60 bg-info/20'
    : 'border-warning/60 bg-warning/20';

  return (
    <div className="relative z-10 flex h-5 w-5 shrink-0 items-center justify-center">
      {isNext ? (
        <span
          aria-hidden="true"
          className={`absolute inset-0 z-0 rounded-full border-2 ${nextNodeStyle} ${
            isEditMode ? 'opacity-0' : 'motion-safe:animate-ping'
          }`}
        />
      ) : null}
      {isEditMode ? (
        <button
          type="button"
          data-mode-control
          role="checkbox"
          aria-checked={isSelected}
          aria-label={`${UI_MESSAGES.DASHBOARD.SELECT_ACTIVITY_LABEL} ${activityName}`}
          onClick={onSelect}
          className="absolute left-1/2 top-1/2 z-20 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-all active:scale-95 focus-visible:outline-2 focus-visible:outline-info"
        >
          {isSelected ? (
            <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-info text-info-content shadow-[0_0_0_3px_rgba(37,99,235,0.28)]">
              <Check className="h-4 w-4 stroke-3" />
            </span>
          ) : (
            <span className="h-5 w-5 rounded-full border border-info bg-info/10" />
          )}
        </button>
      ) : isCompleted ? (
        <span className="relative z-10 h-4 w-4 rounded-full bg-brand transition-all duration-200" />
      ) : isNext ? (
        <span className="relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-warning bg-warning-soft transition-all duration-200">
          <span className="h-2 w-2 rounded-full bg-warning" />
        </span>
      ) : (
        <span className="relative z-10 h-4 w-4 rounded-full bg-surface-muted transition-all duration-200" />
      )}
    </div>
  );
}
