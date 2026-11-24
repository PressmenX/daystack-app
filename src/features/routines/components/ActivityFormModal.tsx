import { Clock, Plus, Trash2, X } from 'lucide-react';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { UI_MESSAGES } from '../../../constants/messages';
import { useModalHistory } from '../../../common/useModalHistory';
import type { Activity, ActivityFormValues } from '../routine.types';
import type { BulkActivityFormValues } from '../routine.types';
import { ActivityFormActions } from './ActivityFormActions';
import { ActivityFormFields } from './ActivityFormFields';

interface ActivityFormModalProps {
  open: boolean;
  editingActivity: Activity | null;
  isSubmitting: boolean;
  onSubmitValues: (values: ActivityFormValues) => Promise<boolean>;
  onSubmitManyValues: (values: ActivityFormValues[]) => Promise<boolean>;
  onToggleCompletion: (activity: Activity) => Promise<boolean>;
  onRequestDelete: (activity: Activity) => void;
  onClose: () => void;
}

export function ActivityFormModal({
  open,
  editingActivity,
  isSubmitting,
  onSubmitValues,
  onSubmitManyValues,
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
    control,
    formState: { errors },
  } = useForm<BulkActivityFormValues>({
    defaultValues: {
      name: '',
      start_time: '',
      activities: [{ name: '', start_time: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'activities',
  });

  useEffect(() => {
    if (open) {
      if (editingActivity) {
        reset({
          name: editingActivity.name,
          start_time: editingActivity.start_time
            ? editingActivity.start_time.slice(0, 5)
            : '',
          activities: [{ name: editingActivity.name, start_time: editingActivity.start_time?.slice(0, 5) ?? '' }],
        });
      } else {
        reset({
          name: '',
          start_time: '',
          activities: [{ name: '', start_time: '' }],
        });
      }
    }
  }, [editingActivity, open, reset]);

  if (!open) {
    return null;
  }

  async function handleFormSubmit(values: BulkActivityFormValues): Promise<void> {
    const ok = isEditing
      ? await onSubmitValues({
          name: values.name,
          start_time: values.start_time,
        })
      : await onSubmitManyValues(values.activities);
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
      <div className="modal-box rounded-t-3xl bg-surface p-4 sm:rounded-3xl sm:p-6">
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
          {isEditing ? (
            <>
              <ActivityFormFields
                register={register}
                setValue={(field, value) => setValue(field, value)}
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
            </>
          ) : (
            <>
              <div className="grid grid-cols-[minmax(0,1fr)_112px_36px] gap-1.5 sm:grid-cols-[minmax(0,1fr)_180px_44px] sm:gap-2">
                <span className="whitespace-nowrap text-xs font-semibold text-content-secondary">
                  {UI_MESSAGES.ACTIVITY.NAME_LABEL}
                </span>
                <span
                  className="whitespace-nowrap text-xs font-semibold text-content-secondary"
                  title={UI_MESSAGES.ACTIVITY.START_TIME_LABEL}
                >
                  Jam Mulai
                </span>
                <span aria-hidden="true" />
              </div>

              <div className="space-y-2.5">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-[minmax(0,1fr)_112px_36px] items-center gap-1.5 sm:grid-cols-[minmax(0,1fr)_180px_44px] sm:gap-2"
                  >
                    <input
                      id={`activity-name-${index}`}
                      type="text"
                      aria-label={`${UI_MESSAGES.ACTIVITY.NAME_LABEL} ${index + 1}`}
                      placeholder={UI_MESSAGES.ACTIVITY.NAME_PLACEHOLDER}
                      className="input input-bordered min-h-11.5 min-w-0 w-full rounded-xl border-border bg-surface-subtle/70 px-3 text-sm text-content focus:border-brand focus:bg-surface focus:outline-none"
                      {...register(`activities.${index}.name`, {
                        required: UI_MESSAGES.ACTIVITY.NAME_REQUIRED,
                        validate: (value) =>
                          value.trim().length > 0 || UI_MESSAGES.ACTIVITY.NAME_REQUIRED,
                        maxLength: {
                          value: 120,
                          message: UI_MESSAGES.ACTIVITY.NAME_MAX,
                        },
                      })}
                    />
                    <div className="relative min-w-0">
                      <Clock className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-content-disabled sm:left-3 sm:h-4 sm:w-4" />
                      <input
                        id={`activity-start-time-${index}`}
                        type="time"
                        aria-label={`${UI_MESSAGES.ACTIVITY.START_TIME_LABEL} ${index + 1}`}
                        className="input input-bordered min-h-11.5 min-w-0 w-full rounded-xl border-border bg-surface-subtle/70 pl-8 pr-1 text-xs text-content focus:border-brand focus:bg-surface focus:outline-none sm:pl-9 sm:pr-3 sm:text-sm"
                        {...register(`activities.${index}.start_time`)}
                      />
                    </div>
                    <button
                      type="button"
                      className="flex h-11 w-9 items-center justify-center rounded-xl text-danger hover:bg-danger-soft disabled:cursor-not-allowed disabled:opacity-40 sm:h-11 sm:w-11"
                      onClick={() => {
                        if (fields.length > 1) {
                          remove(index);
                        }
                      }}
                      disabled={fields.length === 1}
                      aria-label={UI_MESSAGES.ACTIVITY.DELETE_ACTION}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-center pt-1">
                <button
                  type="button"
                  onClick={() => append({ name: '', start_time: '' })}
                  disabled={fields.length >= 10}
                  aria-label="Tambah aktivitas"
                  className="flex min-h-11 w-12 items-center justify-center rounded-xl border border-brand/40 bg-surface text-brand hover:bg-brand/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              <div className="modal-action mt-3 flex gap-2.5">
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
                  <span>{isSubmitting ? "Menambahkan..." : "Tambah"}</span>
                </button>
              </div>
            </>
          )}
        </form>
      </div>
      <div
        className="modal-backdrop bg-neutral/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
    </div>
  );
}
