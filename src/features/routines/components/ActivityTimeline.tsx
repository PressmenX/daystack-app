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
import { ArrowUpDown, Check, Pencil, Plus } from 'lucide-react';
import { useState } from 'react';
import { ConfirmModal } from '../../../common/components/ConfirmModal';
import {
  TimelineEmptyState,
  TimelineErrorState,
  TimelineLoadingState,
} from '../../../common/components/StateView';
import { UI_MESSAGES } from '../../../constants/messages';
import type { Activity, RoutineWorkspaceMode } from '../routine.types';
import { useActivityOrderDraft } from '../useActivityOrderDraft';
import { ActivityTimelineItem } from './ActivityTimelineItem';
import { ReorderModePopup } from './ReorderModePopup';

interface ActivityTimelineProps {
  activities: Activity[];
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
  mode: RoutineWorkspaceMode;
  onModeChange: (mode: RoutineWorkspaceMode) => void;
  onRetry: () => void;
  onAdd: () => void;
  onEdit: (activity: Activity) => void;
  onDelete: (activity: Activity) => void;
  onToggle: (activity: Activity) => Promise<void>;
  onSaveOrder: (activities: Activity[]) => Promise<boolean>;
}

interface EditModeButtonProps {
  isActive: boolean;
  onClick: () => void;
}

function EditModeButton({ isActive, onClick }: EditModeButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      aria-label={UI_MESSAGES.DASHBOARD.EDIT_BUTTON}
      title={UI_MESSAGES.DASHBOARD.EDIT_BUTTON}
      onClick={onClick}
      className={`flex h-12 w-12 items-center justify-center rounded-full border shadow-lg ring-2 transition-colors focus-visible:outline-2 focus-visible:outline-brand ${
        isActive
          ? 'border-warning bg-warning text-warning-content ring-warning/30 hover:brightness-110'
          : 'border-brand bg-brand text-brand-content ring-brand/30 hover:brightness-110'
      }`}
    >
      <Pencil className="h-5 w-5" />
    </button>
  );
}

export function ActivityTimeline({
  activities,
  isLoading,
  isMutating,
  error,
  mode,
  onModeChange,
  onRetry,
  onAdd,
  onEdit,
  onDelete,
  onToggle,
  onSaveOrder,
}: ActivityTimelineProps) {
  const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);
  const isReorderMode = mode === 'reorder';
  const {
    draftActivities,
    hasChanges,
    startDraft,
    resetDraft,
    handleDragEnd,
  } = useActivityOrderDraft(activities, isReorderMode);
  const firstPendingId =
    activities.find((item) => !item.is_completed)?.id ?? null;
  const timelineActivities = isReorderMode ? draftActivities : activities;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 140, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function toggleEditMode(): void {
    onModeChange(mode === 'edit' ? 'view' : 'edit');
  }

  function startReordering(): void {
    startDraft();
    onModeChange('reorder');
  }

  function leaveReorderMode(): void {
    resetDraft();
    onModeChange('view');
  }

  function handleCancelReorder(): void {
    if (hasChanges) {
      setConfirmDiscardOpen(true);
      return;
    }
    leaveReorderMode();
  }

  async function handleSaveOrder(): Promise<void> {
    if (!hasChanges) {
      leaveReorderMode();
      return;
    }

    const saved = await onSaveOrder(draftActivities);
    if (saved) {
      resetDraft(draftActivities);
      onModeChange('view');
    }
  }

  async function handleDiscardOrder(): Promise<void> {
    setConfirmDiscardOpen(false);
    leaveReorderMode();
  }

  return (
    <section aria-label={UI_MESSAGES.DASHBOARD.ROUTINE_SECTION_TITLE}>
      {isReorderMode ? <ReorderModePopup /> : null}

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-lg font-extrabold text-content sm:text-xl">
          {UI_MESSAGES.DASHBOARD.ROUTINE_SECTION_TITLE}
        </h2>

        {isReorderMode ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCancelReorder}
              disabled={isMutating}
              className="btn min-h-10 rounded-full border border-border bg-surface px-3 text-xs font-semibold text-content-secondary hover:bg-surface-subtle disabled:opacity-50"
            >
              {UI_MESSAGES.DASHBOARD.ORDER_CANCEL}
            </button>
            <button
              type="button"
              onClick={() => void handleSaveOrder()}
              disabled={isMutating}
              className="btn min-h-10 rounded-full border-none bg-neutral px-3 text-xs font-semibold text-neutral-content hover:bg-neutral disabled:opacity-50"
            >
              {isMutating ? (
                <span className="loading loading-spinner loading-xs" />
              ) : hasChanges ? (
                <Check className="h-3.5 w-3.5" />
              ) : null}
              <span>
                {hasChanges
                  ? UI_MESSAGES.DASHBOARD.ORDER_SAVE
                  : UI_MESSAGES.DASHBOARD.ORDER_DONE}
              </span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-6 sm:flex-1">
            {mode === 'view' && activities.length >= 2 ? (
              <button
                type="button"
                onClick={startReordering}
                className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-border bg-surface px-3 text-xs font-semibold text-content-secondary transition-colors hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-brand"
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
                <span>{UI_MESSAGES.DASHBOARD.REORDER_BUTTON}</span>
              </button>
            ) : null}

            <div className="hidden flex-col items-stretch gap-1 lg:flex">
              <EditModeButton
                isActive={mode === 'edit'}
                onClick={toggleEditMode}
              />
              <button
                type="button"
                onClick={onAdd}
                className="btn min-h-10.5 rounded-xl border-none bg-neutral px-4 text-sm font-semibold text-neutral-content hover:bg-neutral"
              >
                <Plus className="h-4 w-4" />
                <span>{UI_MESSAGES.DASHBOARD.ADD_BUTTON}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {isLoading ? <TimelineLoadingState /> : null}

      {!isLoading && error ? (
        <TimelineErrorState message={error} onRetry={onRetry} />
      ) : null}

      {!isLoading && !error && activities.length === 0 ? (
        <TimelineEmptyState onAddFirst={onAdd} />
      ) : null}

      {!isLoading && !error && activities.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
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
                  mode={mode}
                  onToggle={onToggle}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </ol>
          </SortableContext>
        </DndContext>
      ) : null}

      {mode !== 'reorder' ? (
        <div className="fixed bottom-6 right-5 z-30 flex flex-col items-center gap-3 lg:hidden">
          <EditModeButton
            isActive={mode === 'edit'}
            onClick={toggleEditMode}
          />
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

      <ConfirmModal
        open={confirmDiscardOpen}
        title={UI_MESSAGES.DASHBOARD.DISCARD_ORDER_CONFIRM_TITLE}
        description={UI_MESSAGES.DASHBOARD.DISCARD_ORDER_CONFIRM_BODY}
        confirmLabel={UI_MESSAGES.DASHBOARD.DISCARD_ORDER_CONFIRM_BUTTON}
        cancelLabel={UI_MESSAGES.DASHBOARD.ORDER_CANCEL}
        isLoading={isMutating}
        onConfirm={handleDiscardOrder}
        onCancel={() => setConfirmDiscardOpen(false)}
      />
    </section>
  );
}
