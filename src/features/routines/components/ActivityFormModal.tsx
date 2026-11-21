import { Clock, X } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  MAX_ACTIVITY_NAME_LENGTH,
  TIME_INPUT_REGEX,
} from '../../../constants/appConstants';
import { UI_MESSAGES } from '../../../constants/messages';
import type { Activity, ActivityFormValues } from '../routine.types';

interface ActivityFormModalProps {
  open: boolean;
  editingActivity: Activity | null;
  isSubmitting: boolean;
  onSubmitValues: (values: ActivityFormValues) => Promise<boolean>;
  onClose: () => void;
}

export function ActivityFormModal({
  open,
  editingActivity,
  isSubmitting,
  onSubmitValues,
  onClose,
}: ActivityFormModalProps) {
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

  const startTimeValue = watch('start_time');

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

  const isEditing = Boolean(editingActivity);

  return (
    <div
      className="modal modal-open modal-bottom sm:modal-middle"
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-box rounded-t-3xl bg-white p-6 sm:rounded-3xl">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h3 className="font-display text-lg font-bold text-slate-900">
            {isEditing
              ? UI_MESSAGES.ACTIVITY.MODAL_EDIT_TITLE
              : UI_MESSAGES.ACTIVITY.MODAL_ADD_TITLE}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label={UI_MESSAGES.ACTIVITY.CANCEL}
            className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
          <div>
            <label
              htmlFor="activity-name"
              className="mb-1.5 block text-sm font-semibold text-slate-700"
            >
              {UI_MESSAGES.ACTIVITY.NAME_LABEL}
            </label>
            <input
              id="activity-name"
              type="text"
              placeholder={UI_MESSAGES.ACTIVITY.NAME_PLACEHOLDER}
              className={`input input-bordered min-h-[46px] w-full rounded-xl bg-slate-50/70 text-sm text-slate-900 focus:border-emerald-600 focus:bg-white focus:outline-none ${
                errors.name ? 'border-rose-400' : 'border-slate-200'
              }`}
              {...register('name', {
                required: UI_MESSAGES.ACTIVITY.NAME_REQUIRED,
                validate: (value) =>
                  value.trim().length > 0 || UI_MESSAGES.ACTIVITY.NAME_REQUIRED,
                maxLength: {
                  value: MAX_ACTIVITY_NAME_LENGTH,
                  message: UI_MESSAGES.ACTIVITY.NAME_MAX,
                },
              })}
            />
            {errors.name ? (
              <p className="mt-1 text-xs font-medium text-rose-600">{errors.name.message}</p>
            ) : null}
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label
                htmlFor="activity-start-time"
                className="text-sm font-semibold text-slate-700"
              >
                {UI_MESSAGES.ACTIVITY.START_TIME_LABEL}
              </label>
              {startTimeValue ? (
                <button
                  type="button"
                  onClick={() => setValue('start_time', '')}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  {UI_MESSAGES.ACTIVITY.CLEAR_TIME}
                </button>
              ) : null}
            </div>
            <div className="relative">
              <Clock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="activity-start-time"
                type="time"
                className="input input-bordered min-h-[46px] w-full rounded-xl border-slate-200 bg-slate-50/70 pl-10 text-sm text-slate-900 focus:border-emerald-600 focus:bg-white focus:outline-none"
                {...register('start_time', {
                  validate: (value) =>
                    !value || TIME_INPUT_REGEX.test(value) || 'Format jam tidak valid.',
                })}
              />
            </div>
            <p className="mt-1.5 text-xs text-slate-500">
              {UI_MESSAGES.ACTIVITY.START_TIME_HINT}
            </p>
          </div>

          <div className="modal-action mt-6 flex gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="btn min-h-[44px] flex-1 rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            >
              {UI_MESSAGES.ACTIVITY.CANCEL}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn min-h-[44px] flex-1 rounded-xl border-none bg-slate-900 text-white hover:bg-slate-800"
            >
              {isSubmitting ? <span className="loading loading-spinner loading-sm" /> : null}
              <span>
                {isEditing
                  ? UI_MESSAGES.ACTIVITY.SAVE_UPDATE
                  : UI_MESSAGES.ACTIVITY.SAVE_CREATE}
              </span>
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop bg-slate-900/40 backdrop-blur-[2px]" onClick={onClose} />
    </div>
  );
}
