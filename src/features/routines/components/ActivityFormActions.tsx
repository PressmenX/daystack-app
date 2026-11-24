import { Check, Trash2 } from "lucide-react";
import { UI_MESSAGES } from "../../../constants/messages";
import type { Activity } from "../routine.types";

interface ActivityFormActionsProps {
  editingActivity: Activity | null;
  isSubmitting: boolean;
  onToggleCompletion: () => void;
  onRequestDelete: () => void;
  onClose: () => void;
}

export function ActivityFormActions({
  editingActivity,
  isSubmitting,
  onToggleCompletion,
  onRequestDelete,
  onClose,
}: ActivityFormActionsProps) {
  const isEditing = Boolean(editingActivity);

  return (
    <>
      <div className="modal-action mt-6 flex gap-2.5">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="btn min-h-11 flex-1 rounded-xl border-border bg-surface text-content-secondary hover:bg-surface-subtle disabled:cursor-not-allowed disabled:opacity-50"
        >
          {UI_MESSAGES.ACTIVITY.CANCEL}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn min-h-11 flex-1 rounded-xl border-none bg-neutral text-neutral-content hover:bg-neutral disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="loading loading-spinner loading-sm" />
          ) : null}
          {isSubmitting ? (
            <span>{isEditing ? "Menyimpan..." : "Menambahkan..."}</span>
          ) : (
            <span>
              {isEditing
                ? UI_MESSAGES.ACTIVITY.SAVE_UPDATE
                : UI_MESSAGES.ACTIVITY.SAVE_CREATE}
            </span>
          )}
        </button>
      </div>

      {isEditing && editingActivity ? (
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onToggleCompletion}
            disabled={isSubmitting}
            className="btn min-h-11 flex-1 rounded-xl border border-brand/30 bg-brand/10 text-brand hover:bg-brand/15 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            <span>
              {editingActivity.is_completed
                ? UI_MESSAGES.ACTIVITY.MARK_UNDONE_ACTION
                : UI_MESSAGES.ACTIVITY.MARK_DONE_ACTION}
            </span>
          </button>
          <button
            type="button"
            onClick={onRequestDelete}
            disabled={isSubmitting}
            aria-label={UI_MESSAGES.ACTIVITY.DELETE_ACTION}
            className="btn min-h-11 min-w-11 rounded-xl border border-danger/20 bg-danger-soft text-danger hover:bg-danger/15 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            <span>{UI_MESSAGES.ACTIVITY.DELETE_ACTION}</span>
          </button>
        </div>
      ) : null}
    </>
  );
}
