import { API_ENDPOINTS, SUPABASE_TABLES } from '../../constants/appConstants';
import { apiRequest } from '../../lib/apiClient';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import type { Activity, ActivityFormValues } from './routine.types';

interface CreateActivityInput {
  routineId: string;
  userId: string;
  position: number;
  values: ActivityFormValues;
}

interface UpdateActivityInput {
  activityId: string;
  userId: string;
  values: ActivityFormValues;
}

export const activityService = {
  async createActivity(input: CreateActivityInput): Promise<Activity> {
    const cleanName = input.values.name.trim();
    const cleanTime = input.values.start_time.trim() || null;

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from(SUPABASE_TABLES.ACTIVITIES)
        .insert({
          routine_id: input.routineId,
          user_id: input.userId,
          name: cleanName,
          start_time: cleanTime,
          is_completed: false,
          position: input.position,
        })
        .select('*')
        .single();

      if (error || !data) {
        throw new Error(error?.message || 'Gagal menambah aktivitas.');
      }
      return data as Activity;
    }

    const response = await apiRequest<{ activity: Activity }>(API_ENDPOINTS.ACTIVITIES, {
      method: 'POST',
      body: JSON.stringify({ name: cleanName, start_time: cleanTime }),
    });
    return response.activity;
  },

  async updateActivity(input: UpdateActivityInput): Promise<Activity> {
    const cleanName = input.values.name.trim();
    const cleanTime = input.values.start_time.trim() || null;

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from(SUPABASE_TABLES.ACTIVITIES)
        .update({ name: cleanName, start_time: cleanTime })
        .eq('id', input.activityId)
        .eq('user_id', input.userId)
        .select('*')
        .single();

      if (error || !data) {
        throw new Error(error?.message || 'Gagal memperbarui aktivitas.');
      }
      return data as Activity;
    }

    const response = await apiRequest<{ activity: Activity }>(
      `${API_ENDPOINTS.ACTIVITIES}/${input.activityId}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ name: cleanName, start_time: cleanTime }),
      }
    );
    return response.activity;
  },

  async toggleActivityCompletion(
    activityId: string,
    userId: string,
    isCompleted: boolean
  ): Promise<Activity> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from(SUPABASE_TABLES.ACTIVITIES)
        .update({ is_completed: isCompleted })
        .eq('id', activityId)
        .eq('user_id', userId)
        .select('*')
        .single();

      if (error || !data) {
        throw new Error(error?.message || 'Gagal memperbarui status aktivitas.');
      }
      return data as Activity;
    }

    const response = await apiRequest<{ activity: Activity }>(
      `${API_ENDPOINTS.ACTIVITIES}/${activityId}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ is_completed: isCompleted }),
      }
    );
    return response.activity;
  },

  async deleteActivity(activityId: string, userId: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from(SUPABASE_TABLES.ACTIVITIES)
        .delete()
        .eq('id', activityId)
        .eq('user_id', userId);

      if (error) {
        throw new Error(error.message);
      }
      return;
    }

    await apiRequest<{ ok: boolean }>(`${API_ENDPOINTS.ACTIVITIES}/${activityId}`, {
      method: 'DELETE',
    });
  },

  async reorderActivities(orderedIds: string[], userId: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const updates = orderedIds.map((id, index) =>
        supabase!
          .from(SUPABASE_TABLES.ACTIVITIES)
          .update({ position: index })
          .eq('id', id)
          .eq('user_id', userId)
      );
      const results = await Promise.all(updates);
      const failed = results.find((res) => res.error);
      if (failed?.error) {
        throw new Error(failed.error.message);
      }
      return;
    }

    await apiRequest<{ activities: Activity[] }>(API_ENDPOINTS.REORDER_ACTIVITIES, {
      method: 'PATCH',
      body: JSON.stringify({ orderedIds }),
    });
  },
};
