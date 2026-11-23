import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Activity, RoutineWorkspaceMode } from '../routine.types';
import { ActivityTimelineCard } from './ActivityTimelineCard';
import { ActivityTimelineNode } from './ActivityTimelineNode';

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
  const timelineLineColor = activity.is_completed ? 'bg-brand' : 'bg-surface-muted';

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

        <ActivityTimelineNode
          isEditMode={isEditMode}
          isSelected={isSelected}
          isCompleted={activity.is_completed}
          isNext={isNext}
          activityName={activity.name}
          onSelect={() => onSelect(activity.id)}
        />

        <div
          className={`w-0.75 flex-1 ${isLast ? 'bg-transparent' : timelineLineColor} ${
            isEditMode ? 'opacity-0' : ''
          }`}
        />
      </div>

      <ActivityTimelineCard
        activity={activity}
        isEditMode={isEditMode}
        isSelected={isSelected}
        isNext={isNext}
        isDragging={isDragging}
        dragAttributes={attributes}
        dragListeners={listeners}
        onOpenDetails={onOpenDetails}
      />

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
