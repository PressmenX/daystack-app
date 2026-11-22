import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Activity } from './routine.types';

export function useActivityOrderDraft(
  activities: Activity[],
  isActive: boolean,
) {
  const [draftActivities, setDraftActivities] = useState(activities);

  useEffect(() => {
    if (!isActive) {
      setDraftActivities(activities);
    }
  }, [activities, isActive]);

  const hasChanges = useMemo(
    () =>
      activities.length !== draftActivities.length ||
      activities.some((activity, index) => activity.id !== draftActivities[index]?.id),
    [activities, draftActivities],
  );

  const startDraft = useCallback(() => {
    setDraftActivities([...activities]);
  }, [activities]);

  const resetDraft = useCallback((nextActivities: Activity[] = activities) => {
    setDraftActivities([...nextActivities]);
  }, [activities]);

  const handleDragEnd = useCallback(({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) {
      return;
    }

    setDraftActivities((current) => {
      const oldIndex = current.findIndex((activity) => activity.id === active.id);
      const newIndex = current.findIndex((activity) => activity.id === over.id);
      if (oldIndex < 0 || newIndex < 0) {
        return current;
      }
      return arrayMove(current, oldIndex, newIndex);
    });
  }, []);

  return {
    draftActivities,
    hasChanges,
    startDraft,
    resetDraft,
    handleDragEnd,
  };
}
