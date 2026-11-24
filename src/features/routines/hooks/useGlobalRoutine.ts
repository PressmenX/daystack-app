import { useCallback, useEffect, useMemo, useState } from 'react';
import { useToast } from '../../../common/useToast';
import { UI_MESSAGES } from '../../../constants/messages';
import { activityService } from '../activityService';
import type {
  Activity,
  ActivityFormValues,
  BulkActivityMutationResult,
  Routine,
  RoutineProgress,
} from '../routine.types';
import { routineService } from '../routineService';

export function useGlobalRoutine(userId: string) {
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const loadRoutine = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = await routineService.fetchGlobalRoutine(userId);
      setRoutine(payload.routine);
      setActivities(payload.activities);
    } catch (err) {
      const message = err instanceof Error ? err.message : UI_MESSAGES.ACTIVITY.LOAD_ERROR;
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void loadRoutine();
  }, [loadRoutine]);

  const progress: RoutineProgress = useMemo(() => {
    const totalCount = activities.length;
    const completedCount = activities.filter((item) => item.is_completed).length;
    const remainingCount = totalCount - completedCount;
    const percentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
    return { completedCount, totalCount, percentage, remainingCount };
  }, [activities]);

  const addActivity = useCallback(
    async (values: ActivityFormValues): Promise<boolean> => {
      if (!routine) {
        return false;
      }
      setIsMutating(true);
      try {
        const nextPosition =
          activities.length > 0 ? activities[activities.length - 1].position + 1 : 0;
        const created = await activityService.createActivity({
          routineId: routine.id,
          userId,
          position: nextPosition,
          values,
        });
        setActivities((prev) => [...prev, created]);
        showToast(UI_MESSAGES.ACTIVITY.CREATE_SUCCESS, 'success');
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : UI_MESSAGES.ACTIVITY.MUTATION_ERROR;
        showToast(message, 'error');
        return false;
      } finally {
        setIsMutating(false);
      }
    },
    [activities, routine, showToast, userId]
  );

  const addActivities = useCallback(
    async (values: ActivityFormValues[]): Promise<boolean> => {
      if (!routine) {
        return false;
      }
      const validValues = values.filter((item) => item.name.trim().length > 0);
      if (validValues.length === 0) {
        return false;
      }
      setIsMutating(true);
      try {
        const nextPosition =
          activities.length > 0 ? activities[activities.length - 1].position + 1 : 0;
        const created = await activityService.createActivities({
          routineId: routine.id,
          userId,
          startPosition: nextPosition,
          values: validValues,
        });
        setActivities((prev) => [...prev, ...created]);
        showToast(UI_MESSAGES.ACTIVITY.CREATE_SUCCESS, 'success');
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : UI_MESSAGES.ACTIVITY.MUTATION_ERROR;
        showToast(message, 'error');
        return false;
      } finally {
        setIsMutating(false);
      }
    },
    [activities, routine, showToast, userId]
  );

  const updateActivity = useCallback(
    async (activityId: string, values: ActivityFormValues): Promise<boolean> => {
      setIsMutating(true);
      try {
        const updated = await activityService.updateActivity({
          activityId,
          userId,
          values,
        });
        setActivities((prev) =>
          prev.map((item) => (item.id === activityId ? updated : item))
        );
        showToast(UI_MESSAGES.ACTIVITY.UPDATE_SUCCESS, 'success');
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : UI_MESSAGES.ACTIVITY.MUTATION_ERROR;
        showToast(message, 'error');
        return false;
      } finally {
        setIsMutating(false);
      }
    },
    [showToast, userId]
  );

  const toggleActivity = useCallback(
    async (activity: Activity): Promise<boolean> => {
      const nextCompleted = !activity.is_completed;
      setActivities((prev) =>
        prev.map((item) =>
          item.id === activity.id ? { ...item, is_completed: nextCompleted } : item
        )
      );
      try {
        const updated = await activityService.toggleActivityCompletion(
          activity.id,
          userId,
          nextCompleted
        );
        setActivities((prev) =>
          prev.map((item) => (item.id === activity.id ? updated : item))
        );
        return true;
      } catch (err) {
        setActivities((prev) =>
          prev.map((item) =>
            item.id === activity.id ? { ...item, is_completed: activity.is_completed } : item
          )
        );
        const message = err instanceof Error ? err.message : UI_MESSAGES.ACTIVITY.MUTATION_ERROR;
        showToast(message, 'error');
        return false;
      }
    },
    [showToast, userId]
  );

  const completeActivities = useCallback(
    async (activityIds: string[]): Promise<BulkActivityMutationResult> => {
      const selectedIds = new Set(activityIds);
      const selectedActivities = activities.filter((item) => selectedIds.has(item.id));
      if (selectedActivities.length === 0) {
        return { failedIds: [] };
      }

      setIsMutating(true);
      setActivities((prev) =>
        prev.map((item) =>
          selectedIds.has(item.id) ? { ...item, is_completed: true } : item
        )
      );

      try {
        const results = await Promise.allSettled(
          selectedActivities.map((item) =>
            activityService.toggleActivityCompletion(item.id, userId, true)
          )
        );
        const updatedActivities = new Map<string, Activity>();
        const failedActivities: Array<{ id: string; reason: unknown }> = [];

        results.forEach((result, index) => {
          const activity = selectedActivities[index];
          if (result.status === 'fulfilled') {
            updatedActivities.set(activity.id, result.value);
          } else {
            failedActivities.push({ id: activity.id, reason: result.reason });
          }
        });

        const failedIds = new Set(failedActivities.map((item) => item.id));
        const previousCompletion = new Map(
          selectedActivities.map((item) => [item.id, item.is_completed])
        );
        setActivities((prev) =>
          prev.map((item) => {
            const updated = updatedActivities.get(item.id);
            if (updated) {
              return updated;
            }
            if (failedIds.has(item.id)) {
              return {
                ...item,
                is_completed: previousCompletion.get(item.id) ?? item.is_completed,
              };
            }
            return item;
          })
        );

        if (failedActivities.length > 0) {
          const firstFailure = failedActivities[0].reason;
          showToast(
            firstFailure instanceof Error
              ? firstFailure.message
              : UI_MESSAGES.ACTIVITY.MUTATION_ERROR,
            'error'
          );
        } else {
          showToast(UI_MESSAGES.DASHBOARD.BULK_COMPLETE_SUCCESS, 'success');
        }

        return { failedIds: [...failedIds] };
      } finally {
        setIsMutating(false);
      }
    },
    [activities, showToast, userId]
  );

  const deleteActivities = useCallback(
    async (activityIds: string[]): Promise<BulkActivityMutationResult> => {
      if (activityIds.length === 0) {
        return { failedIds: [] };
      }

      setIsMutating(true);
      try {
        const results = await Promise.allSettled(
          activityIds.map((id) => activityService.deleteActivity(id, userId))
        );
        const deletedIds = new Set<string>();
        const failedActivities: Array<{ id: string; reason: unknown }> = [];

        results.forEach((result, index) => {
          const activityId = activityIds[index];
          if (result.status === 'fulfilled') {
            deletedIds.add(activityId);
          } else {
            failedActivities.push({ id: activityId, reason: result.reason });
          }
        });

        setActivities((prev) =>
          prev
            .filter((item) => !deletedIds.has(item.id))
            .map((item, index) => ({ ...item, position: index }))
        );

        if (failedActivities.length > 0) {
          const firstFailure = failedActivities[0].reason;
          showToast(
            firstFailure instanceof Error
              ? firstFailure.message
              : UI_MESSAGES.ACTIVITY.MUTATION_ERROR,
            'error'
          );
        } else {
          showToast(UI_MESSAGES.DASHBOARD.BULK_DELETE_SUCCESS, 'success');
        }

        return { failedIds: failedActivities.map((item) => item.id) };
      } finally {
        setIsMutating(false);
      }
    },
    [showToast, userId]
  );

  const deleteActivity = useCallback(
    async (activityId: string): Promise<boolean> => {
      setIsMutating(true);
      try {
        await activityService.deleteActivity(activityId, userId);
        setActivities((prev) =>
          prev
            .filter((item) => item.id !== activityId)
            .map((item, index) => ({ ...item, position: index }))
        );
        showToast(UI_MESSAGES.ACTIVITY.DELETE_SUCCESS, 'success');
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : UI_MESSAGES.ACTIVITY.MUTATION_ERROR;
        showToast(message, 'error');
        return false;
      } finally {
        setIsMutating(false);
      }
    },
    [showToast, userId]
  );

  const saveOrder = useCallback(
    async (orderedActivities: Activity[]): Promise<boolean> => {
      setIsMutating(true);
      try {
        const orderedIds = orderedActivities.map((item) => item.id);
        await activityService.reorderActivities(orderedIds, userId);
        setActivities(
          orderedActivities.map((item, index) => ({ ...item, position: index }))
        );
        showToast(UI_MESSAGES.DASHBOARD.SAVE_ORDER_SUCCESS, 'success');
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : UI_MESSAGES.DASHBOARD.SAVE_ORDER_ERROR;
        showToast(message, 'error');
        return false;
      } finally {
        setIsMutating(false);
      }
    },
    [showToast, userId]
  );

  return {
    routine,
    activities,
    progress,
    isLoading,
    isMutating,
    error,
    reload: loadRoutine,
    addActivity,
    addActivities,
    updateActivity,
    toggleActivity,
    completeActivities,
    deleteActivity,
    deleteActivities,
    saveOrder,
  };
}
