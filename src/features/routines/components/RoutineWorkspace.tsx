import { Calendar, Plus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AuthUser } from '../../../common/common.types';
import { AppHeader } from '../../../common/components/AppHeader';
import { ConfirmModal } from '../../../common/components/ConfirmModal';
import { formatIndonesianDate } from '../../../common/dateUtils';
import { UI_MESSAGES } from '../../../constants/messages';
import { ROUTES } from '../../../constants/routes';
import type { Activity, ActivityFormValues } from '../routine.types';
import { useGlobalRoutine } from '../useGlobalRoutine';
import { ActivityFormModal } from './ActivityFormModal';
import { ActivityTimeline } from './ActivityTimeline';
import { ProgressCard } from './ProgressCard';
import { ReorderRoutineView } from './ReorderRoutineView';

interface RoutineWorkspaceProps {
  user: AuthUser;
  onLogout: () => Promise<void>;
  view: 'dashboard' | 'reorder';
}

export function RoutineWorkspace({ user, onLogout, view }: RoutineWorkspaceProps) {
  const navigate = useNavigate();
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
    deleteActivity,
    saveOrder,
  } = useGlobalRoutine(user.id);

  const [formOpen, setFormOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [deletingActivity, setDeletingActivity] = useState<Activity | null>(null);

  function openAddModal(): void {
    setEditingActivity(null);
    setFormOpen(true);
  }

  function openEditModal(activity: Activity): void {
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
      setDeletingActivity(null);
    }
  }

  const headerTitle =
    view === 'reorder' ? UI_MESSAGES.HEADER.REORDER_TITLE : UI_MESSAGES.HEADER.TODAY;

  return (
    <div className="min-h-screen bg-surface-subtle pb-24 lg:pb-12">
      <AppHeader
        title={headerTitle}
        user={user}
        onLogout={onLogout}
        onBack={view === 'reorder' ? () => navigate(ROUTES.DASHBOARD) : undefined}
      />

      <main className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-8 lg:pt-8">
        {view === 'reorder' ? (
          <ReorderRoutineView
            activities={activities}
            isSaving={isMutating}
            onSaveOrder={saveOrder}
            onAddStep={openAddModal}
            onBack={() => navigate(ROUTES.DASHBOARD)}
          />
        ) : (
          <div className="space-y-6 lg:grid lg:grid-cols-12 lg:items-start lg:gap-8 lg:space-y-0">
            <div className="space-y-5 lg:sticky lg:top-24 lg:col-span-5">
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

            <div className="lg:col-span-7">
              <ActivityTimeline
                activities={activities}
                isLoading={isLoading}
                error={error}
                onRetry={() => void reload()}
                onAdd={openAddModal}
                onEdit={openEditModal}
                onDelete={(item) => setDeletingActivity(item)}
                onToggle={toggleActivity}
                onOpenReorder={() => navigate(ROUTES.REORDER)}
              />
            </div>
          </div>
        )}
      </main>

      {view === 'dashboard' ? (
        <button
          type="button"
          onClick={openAddModal}
          aria-label={UI_MESSAGES.DASHBOARD.ADD_BUTTON}
          className="fixed bottom-6 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-neutral text-neutral-content shadow-xl transition-transform hover:scale-105 active:scale-95 lg:hidden"
        >
          <Plus className="h-6 w-6 stroke-[2.5]" />
        </button>
      ) : null}

      <ActivityFormModal
        open={formOpen}
        editingActivity={editingActivity}
        isSubmitting={isMutating}
        onSubmitValues={handleFormSubmit}
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
    </div>
  );
}
