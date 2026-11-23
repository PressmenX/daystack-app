import { X } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { UI_MESSAGES } from '../../../constants/messages';
import { useModalHistory } from '../../../common/useModalHistory';
import type { Activity, ActivityFormValues } from '../routine.types';
import { ActivityFormActions } from './ActivityFormActions';
import { ActivityFormFields } from './ActivityFormFields';

interface ActivityFormModalProps {
  open: boolean;
  editingActivity: Activity | null;
  isSubmitting: boolean;
  onSubmitValues: (values: ActivityFormValues) => Promise<boolean>;
  onToggleCompletion: (activity: Activity) => Promise<boolean>;
  onRequestDelete: (activity: Activity) => void;
  onClose: () => void;
}

export function ActivityFormModal({
  open,
  editingActivity,
  isSubmitting,
  onSubmitValues,
  onToggleCompletion,
  onRequestDelete,
  onClose,
}: ActivityFormModalProps) {
  useModalHistory(open, onClose);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ActivityFormValues>({
    defaultValues: { name: '', start_time: '' },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: editingActivity?.name ?? '',
        start_time: editingActivity?.start_time
          ? editingActivity.start_time.slice(0, 5)
          : '',
      });
    }
  }, [editingActivity, open, reset]);

  if (!open) {
    return null;
  }

  async function handleFormSubmit(values: ActivityFormValues): Promise<void> {
    const ok = await onSubmitValues(values);
    if (ok) {
      onClose();
    }
  }

  async function handleToggleCompletion(): Promise<void> {
    if (!editingActivity) {
      return;
    }
    const updated = await onToggleCompletion(editingActivity);
    if (updated) {
      onClose();
    }
  }

  const isEditing = Boolean(editingActivity);

  return (
    <div
      className="modal modal-open modal-bottom sm:modal-middle"
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-box rounded-t-3xl bg-surface p-6 sm:rounded-3xl">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h3 className="font-display text-lg font-bold text-content">
            {isEditing
              ? UI_MESSAGES.ACTIVITY.MODAL_EDIT_TITLE
              : UI_MESSAGES.ACTIVITY.MODAL_ADD_TITLE}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label={UI_MESSAGES.ACTIVITY.CANCEL}
            className="flex min-h-10 min-w-10 items-center justify-center rounded-xl text-content-disabled hover:bg-surface-muted hover:text-content-secondary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4"
          noValidate
        >
          <ActivityFormFields
            register={register}
            setValue={setValue}
            errors={errors}
            startTimeValue={watch('start_time')}
          />
          <ActivityFormActions
            editingActivity={editingActivity}
            isSubmitting={isSubmitting}
            onToggleCompletion={() => void handleToggleCompletion()}
            onRequestDelete={() => {
              onClose();
              if (editingActivity) {
                onRequestDelete(editingActivity);
              }
            }}
            onClose={onClose}
          />
        </form>
      </div>
      <div
        className="modal-backdrop bg-neutral/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
    </div>
  );
}
