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
import { Pencil, Plus } from 'lucide-react';
import {
  TimelineEmptyState,
  TimelineErrorState,
  TimelineLoadingState,
} from '../../../common/components/StateView';
import { UI_MESSAGES } from '../../../constants/messages';
import type { Activity, RoutineWorkspaceMode } from '../routine.types';
import { ActivityTimelineItem } from './ActivityTimelineItem';

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
  onSelect: (activityId: string) => void;
  onDragEnd: (event: DragEndEvent) => void;
}

interface EditModeButtonProps {
  onClick: () => void;
}

function EditModeButton({ onClick }: EditModeButtonProps) {
  return (
    <button
      type="button"
      aria-label={UI_MESSAGES.DASHBOARD.EDIT_BUTTON}
      title={UI_MESSAGES.DASHBOARD.EDIT_BUTTON}
      onClick={onClick}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-brand bg-brand text-brand-content shadow-lg ring-2 ring-brand/30 transition-colors hover:brightness-110 focus-visible:outline-2 focus-visible:outline-brand"
    >
      <Pencil className="h-5 w-5" />
    </button>
  );
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
        {!isEditMode ? (
          <div className="hidden items-center gap-2 lg:flex">
            <EditModeButton onClick={onEnterEdit} />
            <button
              type="button"
              onClick={onAdd}
              className="btn min-h-10.5 rounded-xl border-none bg-neutral px-4 text-sm font-semibold text-neutral-content hover:bg-neutral"
            >
              <Plus className="h-4 w-4" />
              <span>{UI_MESSAGES.DASHBOARD.ADD_BUTTON}</span>
            </button>
          </div>
        ) : null}
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
                  />
                ))}
              </ol>
            </SortableContext>
          </DndContext>
        </div>
      ) : null}

      {!isEditMode ? (
        <div className="fixed bottom-6 right-5 z-30 flex flex-col items-center gap-3 lg:hidden">
          <EditModeButton onClick={onEnterEdit} />
          <button
            type="button"
            onClick={onAdd}
            aria-label={UI_MESSAGES.DASHBOARD.ADD_BUTTON}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral text-neutral-content shadow-xl transition-transform hover:scale-105 active:scale-95"
          >
            <Plus className="h-6 w-6 stroke-[2.5]" />
          </button>
        </div>
      ) : null}
    </section>
  );
}
