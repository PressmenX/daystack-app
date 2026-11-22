import { Calendar } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { AuthUser } from '../../../common/common.types';
import { AppHeader } from '../../../common/components/AppHeader';
import { ConfirmModal } from '../../../common/components/ConfirmModal';
import { formatIndonesianDate } from '../../../common/dateUtils';
import { UI_MESSAGES } from '../../../constants/messages';
import type {
  Activity,
  ActivityFormValues,
  RoutineWorkspaceMode,
} from '../routine.types';
import { useActivityOrderDraft } from '../useActivityOrderDraft';
import { useGlobalRoutine } from '../useGlobalRoutine';
import { ActivityFormModal } from './ActivityFormModal';
import { ActivityTimeline } from './ActivityTimeline';
import { ModeInfoPopup } from './ModeInfoPopup';
import { ProgressCard } from './ProgressCard';

interface RoutineWorkspaceProps {
  user: AuthUser;
  onLogout: () => Promise<void>;
}

export function RoutineWorkspace({ user, onLogout }: RoutineWorkspaceProps) {
  const {
    activities,
    progress,
    isLoading,
    isMutating,
    error,
    reload,
    addActivity,
    updateActivity,
    toggleActivity,
    completeActivities,
    deleteActivity,
    deleteActivities,
    saveOrder,
  } = useGlobalRoutine(user.id);
  const [formOpen, setFormOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [deletingActivity, setDeletingActivity] = useState<Activity | null>(null);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [mode, setMode] = useState<RoutineWorkspaceMode>('view');
  const editHistoryEntry = useRef(false);
  const exitingEditMode = useRef(false);
  const {
    draftActivities,
    hasChanges,
    startDraft,
    resetDraft,
    handleDragEnd,
  } = useActivityOrderDraft(activities, mode === 'edit');

  const handleExitEditMode = useCallback(
    async (): Promise<void> => {
      if (exitingEditMode.current) {
        return;
      }

      if (isMutating) {
        if (!editHistoryEntry.current) {
          window.history.pushState(
            window.history.state,
            '',
            window.location.href,
          );
          editHistoryEntry.current = true;
        }
        return;
      }

      exitingEditMode.current = true;
      try {
        if (hasChanges) {
          const saved = await saveOrder(draftActivities);
          if (!saved) {
            if (!editHistoryEntry.current) {
              window.history.pushState(
                window.history.state,
                '',
                window.location.href,
              );
              editHistoryEntry.current = true;
            }
            return;
          }
        }

        resetDraft(draftActivities);
        setSelectedIds(new Set());
        setFormOpen(false);
        setDeletingActivity(null);
        setBulkDeleteConfirmOpen(false);
        setMode('view');

        if (editHistoryEntry.current) {
          editHistoryEntry.current = false;
          window.history.back();
        }
      } finally {
        exitingEditMode.current = false;
      }
    },
    [
      draftActivities,
      hasChanges,
      isMutating,
      resetDraft,
      saveOrder,
    ],
  );

  useEffect(() => {
    if (mode !== 'edit') {
      return;
    }

    function handleBrowserBack(): void {
      if (!editHistoryEntry.current) {
        return;
      }
      editHistoryEntry.current = false;
      void handleExitEditMode();
    }

    window.addEventListener('popstate', handleBrowserBack);
    return () => window.removeEventListener('popstate', handleBrowserBack);
  }, [handleExitEditMode, mode]);

  useEffect(() => {
    if (mode !== 'edit') {
      return;
    }

    function handleOutsidePointerDown(event: PointerEvent): void {
      if (!(event.target instanceof Element)) {
        return;
      }

      if (
        event.target.closest(
          '[data-activity-card], [data-mode-control], [role="dialog"]',
        )
      ) {
        return;
      }

      void handleExitEditMode();
    }

    document.addEventListener('pointerdown', handleOutsidePointerDown);
    return () =>
      document.removeEventListener('pointerdown', handleOutsidePointerDown);
  }, [handleExitEditMode, mode]);

  function enterEditMode(): void {
    setSelectedIds(new Set());
    startDraft();
    window.history.pushState(
      window.history.state,
      '',
      window.location.href,
    );
    editHistoryEntry.current = true;
    setMode('edit');
  }

  function openAddModal(): void {
    setEditingActivity(null);
    setFormOpen(true);
  }

  function openActivityDetails(activity: Activity): void {
    setEditingActivity(activity);
    setFormOpen(true);
  }

  async function handleFormSubmit(values: ActivityFormValues): Promise<boolean> {
    if (editingActivity) {
      return updateActivity(editingActivity.id, values);
    }
    return addActivity(values);
  }

  async function handleConfirmDelete(): Promise<void> {
    if (!deletingActivity) {
      return;
    }
    const ok = await deleteActivity(deletingActivity.id);
    if (ok) {
      setSelectedIds((previous) => {
        const next = new Set(previous);
        next.delete(deletingActivity.id);
        return next;
      });
      setDeletingActivity(null);
    }
  }

  function toggleSelection(activityId: string): void {
    setSelectedIds((previous) => {
      const next = new Set(previous);
      if (next.has(activityId)) {
        next.delete(activityId);
      } else {
        next.add(activityId);
      }
      return next;
    });
  }

  async function handleCompleteSelected(): Promise<void> {
    const result = await completeActivities([...selectedIds]);
    setSelectedIds(new Set(result.failedIds));
  }

  async function handleDeleteSelected(): Promise<void> {
    const result = await deleteActivities([...selectedIds]);
    setSelectedIds(new Set(result.failedIds));
    setBulkDeleteConfirmOpen(false);
  }

  const timeline = (
    <ActivityTimeline
      activities={activities}
      draftActivities={draftActivities}
      selectedIds={selectedIds}
      isLoading={isLoading}
      error={error}
      mode={mode}
      onEnterEdit={enterEditMode}
      onRetry={() => void reload()}
      onAdd={openAddModal}
      onOpenDetails={openActivityDetails}
      onSelect={toggleSelection}
      onDragEnd={handleDragEnd}
    />
  );

  return (
    <div
      className={`bg-surface-subtle ${
        mode === 'edit'
          ? 'flex h-dvh flex-col overflow-hidden'
          : 'min-h-screen pb-24 lg:pb-12'
      }`}
    >
      <AppHeader
        title={
          mode === 'edit'
            ? UI_MESSAGES.HEADER.EDIT_MODE_TITLE
            : UI_MESSAGES.HEADER.TODAY
        }
        user={user}
        onLogout={onLogout}
        isEditMode={mode === 'edit'}
        selectedCount={selectedIds.size}
        isMutating={isMutating}
        onExitEditMode={() => void handleExitEditMode()}
        onCompleteSelected={() => void handleCompleteSelected()}
        onDeleteSelected={() => setBulkDeleteConfirmOpen(true)}
      />

      {mode === 'edit' ? (
        <ModeInfoPopup message={UI_MESSAGES.DASHBOARD.EDIT_MODE_INFO} />
      ) : null}

      <main
        className={
          mode === 'edit'
            ? 'mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col px-4 pb-2 pt-16 sm:px-6 lg:px-8 lg:pt-14'
            : 'mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-8 lg:pt-8'
        }
      >
        <div
          className={
            mode === 'edit'
              ? 'flex h-full min-h-0 flex-col lg:grid lg:grid-cols-12 lg:items-stretch lg:gap-8'
              : 'space-y-6 lg:grid lg:grid-cols-12 lg:items-start lg:gap-8 lg:space-y-0'
          }
        >
            <div
              className={
                mode === 'edit'
                  ? 'shrink-0 lg:col-span-5 lg:self-start'
                  : 'space-y-5 lg:sticky lg:top-24 lg:col-span-5'
              }
            >
              <div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-content-muted">
                  <Calendar className="h-3.5 w-3.5 text-warning" />
                  <span>{formatIndonesianDate()}</span>
                </div>
                <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-content sm:text-3xl">
                  {UI_MESSAGES.DASHBOARD.GREETING_PREFIX} {user.name}{' '}
                  <span aria-hidden="true">👋</span>
                </h2>
              </div>

              <ProgressCard progress={progress} />
            </div>

            <div
              className={
                mode === 'edit'
                  ? 'fixed left-1/2 top-36 bottom-4 z-40 flex w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 flex-col rounded-2xl bg-surface p-4 shadow-xl'
                  : 'lg:col-span-7'
              }
            >
              {timeline}
            </div>
        </div>
      </main>

      {mode === 'edit' ? (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-20 bg-neutral/45 backdrop-blur-[1px]"
        />
      ) : null}

      <ActivityFormModal
        open={formOpen}
        editingActivity={editingActivity}
        isSubmitting={isMutating}
        onSubmitValues={handleFormSubmit}
        onToggleCompletion={toggleActivity}
        onRequestDelete={setDeletingActivity}
        onClose={() => setFormOpen(false)}
      />

      <ConfirmModal
        open={Boolean(deletingActivity)}
        title={UI_MESSAGES.ACTIVITY.DELETE_CONFIRM_TITLE}
        description={UI_MESSAGES.ACTIVITY.DELETE_CONFIRM_BODY}
        confirmLabel={UI_MESSAGES.ACTIVITY.DELETE_CONFIRM_BUTTON}
        isLoading={isMutating}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingActivity(null)}
      />

      <ConfirmModal
        open={bulkDeleteConfirmOpen}
        title={UI_MESSAGES.ACTIVITY.BULK_DELETE_CONFIRM_TITLE}
        description={UI_MESSAGES.ACTIVITY.BULK_DELETE_CONFIRM_BODY}
        confirmLabel={UI_MESSAGES.ACTIVITY.DELETE_CONFIRM_BUTTON}
        isLoading={isMutating}
        onConfirm={handleDeleteSelected}
        onCancel={() => setBulkDeleteConfirmOpen(false)}
      />
    </div>
  );
}
