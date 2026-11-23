import { useCallback, useEffect, useRef, useState } from 'react';
import { isModalBackNavigation } from '../../../common/useModalHistory';
import type { Activity, RoutineWorkspaceMode } from '../routine.types';
import { useActivityOrderDraft } from './useActivityOrderDraft';

interface UseRoutineEditModeParams {
  activities: Activity[];
  isMutating: boolean;
  saveOrder: (activities: Activity[]) => Promise<boolean>;
  onExitEditMode: () => void;
}

export function useRoutineEditMode({
  activities,
  isMutating,
  saveOrder,
  onExitEditMode,
}: UseRoutineEditModeParams) {
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

  const handleExitEditMode = useCallback(async (): Promise<void> => {
    if (exitingEditMode.current) {
      return;
    }

    if (isMutating) {
      if (!editHistoryEntry.current) {
        window.history.pushState(window.history.state, '', window.location.href);
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
      onExitEditMode();
      setMode('view');

      if (editHistoryEntry.current) {
        editHistoryEntry.current = false;
        window.history.back();
      }
    } finally {
      exitingEditMode.current = false;
    }
  }, [
    draftActivities,
    hasChanges,
    isMutating,
    onExitEditMode,
    resetDraft,
    saveOrder,
  ]);

  useEffect(() => {
    if (mode !== 'edit') {
      return;
    }

    function handleBrowserBack(): void {
      if (isModalBackNavigation()) {
        return;
      }
      if (!editHistoryEntry.current) {
        return;
      }
      editHistoryEntry.current = false;
      void handleExitEditMode();
    }

    window.addEventListener('popstate', handleBrowserBack);
    return () => window.removeEventListener('popstate', handleBrowserBack);
  }, [handleExitEditMode, mode]);

  function enterEditMode(): void {
    startDraft();
    window.history.pushState(window.history.state, '', window.location.href);
    editHistoryEntry.current = true;
    setMode('edit');
  }

  function clearEditUi(): void {
    setMode('view');
  }

  return {
    mode,
    draftActivities,
    handleDragEnd,
    enterEditMode,
    handleExitEditMode,
    clearEditUi,
  };
}
