import { SUPABASE_TABLES } from '../../constants/appConstants';
import {
  isSupabaseConfigured,
  supabase,
  SUPABASE_CONFIG_ERROR,
} from '../../lib/supabase';
import type { Activity, ActivityFormValues } from './routine.types';

interface CreateActivityInput {
  routineId: string;
  userId: string;
  position: number;
  values: ActivityFormValues;
}

interface CreateActivitiesInput {
  routineId: string;
  userId: string;
  startPosition: number;
  values: ActivityFormValues[];
}

interface UpdateActivityInput {
  activityId: string;
  userId: string;
  values: ActivityFormValues;
}

export const activityService = {
  async createActivities(input: CreateActivitiesInput): Promise<Activity[]> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error(SUPABASE_CONFIG_ERROR);
    }
    const rows = input.values.map((values, index) => ({
      routine_id: input.routineId,
      user_id: input.userId,
      name: values.name.trim(),
      start_time: values.start_time.trim() || null,
      is_completed: false,
      position: input.startPosition + index,
    }));
    const { data, error } = await supabase
      .from(SUPABASE_TABLES.ACTIVITIES)
      .insert(rows)
      .select('*');
    if (error || !data) {
      throw new Error(error?.message || 'Gagal menambah aktivitas.');
    }
    return data as Activity[];
  },

  async createActivity(input: CreateActivityInput): Promise<Activity> {
    const cleanName = input.values.name.trim();
    const cleanTime = input.values.start_time.trim() || null;
    if (!isSupabaseConfigured || !supabase) {
      throw new Error(SUPABASE_CONFIG_ERROR);
    }
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
  },

  async updateActivity(input: UpdateActivityInput): Promise<Activity> {
    const cleanName = input.values.name.trim();
    const cleanTime = input.values.start_time.trim() || null;
    if (!isSupabaseConfigured || !supabase) {
      throw new Error(SUPABASE_CONFIG_ERROR);
    }
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
  },

  async toggleActivityCompletion(
    activityId: string,
    userId: string,
    isCompleted: boolean
  ): Promise<Activity> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error(SUPABASE_CONFIG_ERROR);
    }
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
  },

  async deleteActivity(activityId: string, userId: string): Promise<void> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error(SUPABASE_CONFIG_ERROR);
    }
    const { error } = await supabase
      .from(SUPABASE_TABLES.ACTIVITIES)
      .delete()
      .eq('id', activityId)
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message);
    }
  },

  async reorderActivities(orderedIds: string[], userId: string): Promise<void> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error(SUPABASE_CONFIG_ERROR);
    }
    const client = supabase;
    const updates = orderedIds.map((id, index) =>
      client
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
  },
};
