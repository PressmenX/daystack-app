import { Clock } from 'lucide-react';
import type {
  FieldErrors,
  UseFormRegister,
} from 'react-hook-form';
import {
  MAX_ACTIVITY_NAME_LENGTH,
  TIME_INPUT_REGEX,
} from '../../../constants/appConstants';
import { UI_MESSAGES } from '../../../constants/messages';
import type { ActivityFormValues } from '../routine.types';

interface ActivityFormFieldsProps {
  register: UseFormRegister<ActivityFormValues>;
  setValue: (field: 'start_time', value: string) => void;
  errors: FieldErrors<ActivityFormValues>;
  startTimeValue: string;
}

export function ActivityFormFields({
  register,
  setValue,
  errors,
  startTimeValue,
}: ActivityFormFieldsProps) {
  return (
    <>
      <div>
        <label
          htmlFor="activity-name"
          className="mb-1.5 block text-xs font-semibold text-content-secondary"
        >
          {UI_MESSAGES.ACTIVITY.NAME_LABEL}
        </label>
        <input
          id="activity-name"
          type="text"
          placeholder={UI_MESSAGES.ACTIVITY.NAME_PLACEHOLDER}
          className={`input input-bordered min-h-11.5 w-full rounded-xl bg-surface-subtle/70 text-sm text-content focus:border-brand focus:bg-surface focus:outline-none ${
            errors.name ? 'border-danger' : 'border-border'
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
          <p className="mt-1 text-xs font-medium text-danger">
            {errors.name.message}
          </p>
        ) : null}
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label
            htmlFor="activity-start-time"
            className="text-xs font-semibold text-content-secondary"
          >
            {UI_MESSAGES.ACTIVITY.START_TIME_LABEL}
          </label>
          {startTimeValue ? (
            <button
              type="button"
              onClick={() => setValue('start_time', '')}
              className="text-xs font-semibold text-content-muted hover:text-content-secondary"
            >
              {UI_MESSAGES.ACTIVITY.CLEAR_TIME}
            </button>
          ) : null}
        </div>
        <div className="relative">
          <Clock className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-content-disabled" />
          <input
            id="activity-start-time"
            type="time"
            className="input input-bordered min-h-11.5 w-full rounded-xl border-border bg-surface-subtle/70 pl-10 text-sm text-content focus:border-brand focus:bg-surface focus:outline-none"
            {...register('start_time', {
              validate: (value) =>
                !value || TIME_INPUT_REGEX.test(value) || 'Format jam tidak valid.',
            })}
          />
        </div>
        <p className="mt-1.5 text-xs text-content-muted">
          {UI_MESSAGES.ACTIVITY.START_TIME_HINT}
        </p>
      </div>
    </>
  );
}
