export type RoutineWorkspaceMode = 'view' | 'edit';

export interface Routine {
  id: string;
  user_id: string;
  name: string;
  kind: 'global';
  mode: 'checklist';
  start_time: string | null;
  created_at: string;
}

export interface Activity {
  id: string;
  routine_id: string;
  user_id: string;
  name: string;
  start_time: string | null;
  is_completed: boolean;
  position: number;
  created_at: string;
}

export interface ActivityFormValues {
  name: string;
  start_time: string;
}

export interface BulkActivityMutationResult {
  failedIds: string[];
}

export interface RoutineProgress {
  completedCount: number;
  totalCount: number;
  percentage: number;
  remainingCount: number;
}
