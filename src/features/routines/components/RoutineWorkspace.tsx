import { Calendar } from 'lucide-react';
import type { AuthUser } from '../../../common/common.types';
import { AppHeader } from '../../../common/components/AppHeader';
import { ConfirmModal } from '../../../common/components/ConfirmModal';
import { formatIndonesianDate } from '../../../common/dateUtils';
import { UI_MESSAGES } from '../../../constants/messages';
import { useRoutineWorkspaceController } from '../hooks/useRoutineWorkspaceController';
import { ActivityFormModal } from './ActivityFormModal';
import { ActivityTimeline } from './ActivityTimeline';
import { ModeInfoPopup } from './ModeInfoPopup';
import { ProgressCard } from './ProgressCard';

interface RoutineWorkspaceProps {
  user: AuthUser;
  onLogout: () => Promise<void>;
}

export function RoutineWorkspace({ user, onLogout }: RoutineWorkspaceProps) {
  const controller = useRoutineWorkspaceController(user.id);
  const { routine, mode } = controller;

  const timeline = (
    <ActivityTimeline
      activities={routine.activities}
      draftActivities={controller.draftActivities}
      selectedIds={controller.selectedIds}
      isLoading={routine.isLoading}
      error={routine.error}
      mode={mode}
      onEnterEdit={controller.enterEditMode}
      onRetry={() => void routine.reload()}
      onAdd={controller.openAddModal}
      onOpenDetails={controller.openActivityDetails}
      onToggleCompletion={controller.toggleActivity}
      onSelect={controller.toggleSelection}
      onDragEnd={controller.handleDragEnd}
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
            ? ''
            : UI_MESSAGES.HEADER.TODAY
        }
        user={user}
        onLogout={onLogout}
        isEditMode={mode === 'edit'}
        selectedCount={controller.selectedIds.size}
        isMutating={routine.isMutating}
        onExitEditMode={() => void controller.exitEditMode()}
        onCompleteSelected={() => void controller.handleCompleteSelected()}
        onDeleteSelected={() => controller.setBulkDeleteConfirmOpen(true)}
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

            <ProgressCard
              progress={routine.progress}
              isMutating={routine.isMutating}
              onClearAll={() => controller.setClearAllConfirmOpen(true)}
            />
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
        open={controller.formOpen}
        editingActivity={controller.editingActivity}
        isSubmitting={routine.isMutating}
        onSubmitValues={controller.handleFormSubmit}
        onSubmitManyValues={controller.handleBulkFormSubmit}
        onToggleCompletion={controller.toggleActivity}
        onRequestDelete={controller.setDeletingActivity}
        onClose={controller.closeForm}
      />

      <ConfirmModal
        open={Boolean(controller.deletingActivity)}
        title={UI_MESSAGES.ACTIVITY.DELETE_CONFIRM_TITLE}
        description={UI_MESSAGES.ACTIVITY.DELETE_CONFIRM_BODY}
        confirmLabel={UI_MESSAGES.ACTIVITY.DELETE_CONFIRM_BUTTON}
        isLoading={routine.isMutating}
        onConfirm={controller.handleConfirmDelete}
        onCancel={() => controller.setDeletingActivity(null)}
      />

      <ConfirmModal
        open={controller.bulkDeleteConfirmOpen}
        title={UI_MESSAGES.ACTIVITY.BULK_DELETE_CONFIRM_TITLE}
        description={UI_MESSAGES.ACTIVITY.BULK_DELETE_CONFIRM_BODY}
        confirmLabel={UI_MESSAGES.ACTIVITY.DELETE_CONFIRM_BUTTON}
        isLoading={routine.isMutating}
        onConfirm={controller.handleDeleteSelected}
        onCancel={() => controller.setBulkDeleteConfirmOpen(false)}
      />

      <ConfirmModal
        open={controller.clearAllConfirmOpen}
        title={UI_MESSAGES.ACTIVITY.CLEAR_ALL_CONFIRM_TITLE}
        description={UI_MESSAGES.ACTIVITY.CLEAR_ALL_CONFIRM_BODY}
        confirmLabel={UI_MESSAGES.ACTIVITY.DELETE_CONFIRM_BUTTON}
        isLoading={routine.isMutating}
        onConfirm={controller.handleClearAll}
        onCancel={() => controller.setClearAllConfirmOpen(false)}
      />
    </div>
  );
}
