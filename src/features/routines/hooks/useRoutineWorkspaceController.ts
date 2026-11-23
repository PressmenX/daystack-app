import { useState } from 'react';
import type { Activity, ActivityFormValues } from '../routine.types';
import { useGlobalRoutine } from './useGlobalRoutine';
import { useRoutineEditMode } from './useRoutineEditMode';

export function useRoutineWorkspaceController(userId: string) {
  const routine = useGlobalRoutine(userId);
  const [formOpen, setFormOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [deletingActivity, setDeletingActivity] = useState<Activity | null>(null);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const editMode = useRoutineEditMode({
    activities: routine.activities,
    isMutating: routine.isMutating,
    saveOrder: routine.saveOrder,
  });

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
      return routine.updateActivity(editingActivity.id, values);
    }
    return routine.addActivity(values);
  }

  async function handleConfirmDelete(): Promise<void> {
    if (!deletingActivity) {
      return;
    }
    const ok = await routine.deleteActivity(deletingActivity.id);
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
    const result = await routine.completeActivities([...selectedIds]);
    setSelectedIds(new Set(result.failedIds));
  }

  async function handleDeleteSelected(): Promise<void> {
    const result = await routine.deleteActivities([...selectedIds]);
    setSelectedIds(new Set(result.failedIds));
    setBulkDeleteConfirmOpen(false);
  }

  function closeForm(): void {
    setFormOpen(false);
  }

  return {
    routine,
    mode: editMode.mode,
    draftActivities: editMode.draftActivities,
    selectedIds,
    formOpen,
    editingActivity,
    deletingActivity,
    bulkDeleteConfirmOpen,
    enterEditMode: editMode.enterEditMode,
    exitEditMode: editMode.handleExitEditMode,
    openAddModal,
    openActivityDetails,
    handleFormSubmit,
    handleConfirmDelete,
    toggleSelection,
    handleCompleteSelected,
    handleDeleteSelected,
    handleDragEnd: editMode.handleDragEnd,
    toggleActivity: routine.toggleActivity,
    setDeletingActivity,
    setBulkDeleteConfirmOpen,
    closeForm,
  };
}
