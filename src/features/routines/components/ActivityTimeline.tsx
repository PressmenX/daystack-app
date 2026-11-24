import type { DragEndEvent } from '@dnd-kit/core';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  TimelineEmptyState,
  TimelineErrorState,
  TimelineLoadingState,
} from '../../../common/components/StateView';
import { UI_MESSAGES } from '../../../constants/messages';
import type { Activity, RoutineWorkspaceMode } from '../routine.types';
import { ActivityTimelineItem } from './ActivityTimelineItem';
import { TimelineActions } from './TimelineActions';

interface ActivityTimelineProps {
  activities: Activity[];
  draftActivities: Activity[];
  selectedIds: Set<string>;
  isLoading: boolean;
  error: string | null;
  mode: RoutineWorkspaceMode;
  onEnterEdit: () => void;
  onRetry: () => void;
  onAdd: () => void;
  onOpenDetails: (activity: Activity) => void;
  onToggleCompletion: (activity: Activity) => Promise<boolean>;
  onSelect: (activityId: string) => void;
  onDragEnd: (event: DragEndEvent) => void;
}

export function ActivityTimeline({
  activities,
  draftActivities,
  selectedIds,
  isLoading,
  error,
  mode,
  onEnterEdit,
  onRetry,
  onAdd,
  onOpenDetails,
  onToggleCompletion,
  onSelect,
  onDragEnd,
}: ActivityTimelineProps) {
  const isEditMode = mode === 'edit';
  const timelineActivities = isEditMode ? draftActivities : activities;
  const firstPendingId =
    timelineActivities.find((item) => !item.is_completed)?.id ?? null;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 140, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <section
      aria-label={UI_MESSAGES.DASHBOARD.ROUTINE_SECTION_TITLE}
      className={isEditMode ? 'flex h-full min-h-0 flex-col' : ''}
    >
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-lg font-extrabold text-content sm:text-xl">
          {UI_MESSAGES.DASHBOARD.ROUTINE_SECTION_TITLE}
        </h2>
        <TimelineActions
          isEditMode={isEditMode}
          onEnterEdit={onEnterEdit}
          onAdd={onAdd}
        />
      </div>

      {isLoading ? <TimelineLoadingState /> : null}

      {!isLoading && error ? (
        <TimelineErrorState message={error} onRetry={onRetry} />
      ) : null}

      {!isLoading && !error && activities.length === 0 ? (
        <TimelineEmptyState onAddFirst={onAdd} />
      ) : null}

      {!isLoading && !error && activities.length > 0 ? (
        <div
          className={
            isEditMode
              ? 'min-h-0 flex-1 overflow-y-auto overscroll-contain pb-6'
              : ''
          }
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            autoScroll={false}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={timelineActivities.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <ol className="list-none p-0">
                {timelineActivities.map((activity, index) => (
                  <ActivityTimelineItem
                    key={activity.id}
                    activity={activity}
                    isFirst={index === 0}
                    isLast={index === timelineActivities.length - 1}
                    isNext={activity.id === firstPendingId}
                    isSelected={selectedIds.has(activity.id)}
                    mode={mode}
                    onSelect={onSelect}
                    onOpenDetails={onOpenDetails}
                    onToggleCompletion={onToggleCompletion}
                  />
                ))}
              </ol>
            </SortableContext>
          </DndContext>
        </div>
      ) : null}

    </section>
  );
}
