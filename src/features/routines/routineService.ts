import {
  DEFAULT_GLOBAL_ROUTINE_NAME,
  ROUTINE_KIND,
  ROUTINE_MODE,
  SUPABASE_TABLES,
} from '../../constants/appConstants';
import {
  isSupabaseConfigured,
  supabase,
  SUPABASE_CONFIG_ERROR,
} from '../../lib/supabase';
import type { Activity, Routine } from './routine.types';

interface GlobalRoutinePayload {
  routine: Routine;
  activities: Activity[];
}

export const routineService = {
  async fetchGlobalRoutine(userId: string): Promise<GlobalRoutinePayload> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error(SUPABASE_CONFIG_ERROR);
    }

    let { data: routine, error: routineError } = await supabase
        .from(SUPABASE_TABLES.ROUTINES)
        .select('*')
        .eq('user_id', userId)
        .eq('kind', ROUTINE_KIND.GLOBAL)
        .maybeSingle();

    if (routineError) {
      throw new Error(routineError.message);
    }

    if (!routine) {
      const { data: created, error: createError } = await supabase
          .from(SUPABASE_TABLES.ROUTINES)
          .insert({
            user_id: userId,
            name: DEFAULT_GLOBAL_ROUTINE_NAME,
            kind: ROUTINE_KIND.GLOBAL,
            mode: ROUTINE_MODE.CHECKLIST,
          })
          .select('*')
          .single();

      if (createError || !created) {
        throw new Error(createError?.message || 'Gagal membuat Global Routines.');
      }
      routine = created;
    }

    const { data: activities, error: activitiesError } = await supabase
      .from(SUPABASE_TABLES.ACTIVITIES)
      .select('*')
      .eq('routine_id', routine.id)
      .eq('user_id', userId)
      .order('position', { ascending: true });

    if (activitiesError) {
      throw new Error(activitiesError.message);
    }

    return {
      routine: routine as Routine,
      activities: (activities ?? []) as Activity[],
    };
  },
};
