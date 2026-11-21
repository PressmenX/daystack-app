import { Check, Pencil, Trash2 } from 'lucide-react';
import { formatDisplayTime } from '../../../common/dateUtils';
import { UI_MESSAGES } from '../../../constants/messages';
import type { Activity } from '../routine.types';

interface ActivityTimelineItemProps {
  activity: Activity;
  isFirst: boolean;
  isLast: boolean;
  isNext: boolean;
  onToggle: (activity: Activity) => Promise<void>;
  onEdit: (activity: Activity) => void;
  onDelete: (activity: Activity) => void;
}

export function ActivityTimelineItem({
  activity,
  isFirst,
  isLast,
  isNext,
  onToggle,
  onEdit,
  onDelete,
}: ActivityTimelineItemProps) {
  const formattedTime = formatDisplayTime(activity.start_time);

  return (
    <li className="relative flex items-stretch gap-3.5 sm:gap-4">
      <div className="relative flex w-6 shrink-0 flex-col items-center">
        <div
          className={`w-0.5 flex-1 ${
            isFirst
              ? 'bg-transparent'
              : activity.is_completed
                ? 'bg-emerald-700'
                : 'bg-slate-200'
          }`}
        />

        <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center">
          {activity.is_completed ? (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-700 text-white shadow-xs">
              <Check className="h-3.5 w-3.5 stroke-[3]" />
            </span>
          ) : isNext ? (
            <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-amber-400 bg-amber-50">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            </span>
          ) : (
            <span className="h-4 w-4 rounded-full border border-slate-300 bg-slate-100" />
          )}
        </div>

        <div
          className={`w-0.5 flex-1 ${
            isLast
              ? 'bg-transparent'
              : activity.is_completed
                ? 'bg-emerald-700'
                : 'bg-slate-200'
          }`}
        />
      </div>

      <div
        className={`mb-3 flex flex-1 items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 transition-colors ${
          isNext
            ? 'border-amber-200 bg-[#FFFBF2] shadow-xs'
            : 'border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]'
        }`}
      >
        <div className="min-w-0 flex-1">
          {formattedTime || isNext ? (
            <div className="mb-1 flex flex-wrap items-center gap-2">
              {formattedTime ? (
                <span
                  className={`text-xs font-semibold tabular-nums ${
                    activity.is_completed
                      ? 'text-emerald-700'
                      : isNext
                        ? 'text-amber-700'
                        : 'text-slate-500'
                  }`}
                >
                  {formattedTime}
                </span>
              ) : null}
              {isNext ? (
                <span className="rounded-md bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white">
                  {UI_MESSAGES.DASHBOARD.NEXT_BADGE}
                </span>
              ) : null}
            </div>
          ) : null}

          <p
            className={`break-words text-sm font-semibold sm:text-base ${
              activity.is_completed
                ? 'text-slate-400 line-through'
                : 'text-slate-900'
            }`}
          >
            {activity.name}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            onClick={() => onEdit(activity)}
            aria-label={`Ubah ${activity.name}`}
            className="flex min-h-[44px] min-w-[40px] items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-emerald-600"
          >
            <Pencil className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(activity)}
            aria-label={`Hapus ${activity.name}`}
            className="flex min-h-[44px] min-w-[40px] items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-2 focus-visible:outline-rose-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <button
            type="button"
            role="checkbox"
            aria-checked={activity.is_completed}
            aria-label={`Tandai ${activity.name} ${activity.is_completed ? 'belum selesai' : 'selesai'}`}
            onClick={() => void onToggle(activity)}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl transition-transform active:scale-95 focus-visible:outline-2 focus-visible:outline-emerald-600"
          >
            {activity.is_completed ? (
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-700 text-white">
                <Check className="h-4 w-4 stroke-[2.8]" />
              </span>
            ) : (
              <span
                className={`h-7 w-7 rounded-full border-2 ${
                  isNext
                    ? 'border-amber-400 bg-white'
                    : 'border-slate-300 bg-slate-50'
                }`}
              />
            )}
          </button>
        </div>
      </div>
    </li>
  );
}
