import { ArrowUpDown, Check, ChevronDown, Plus } from "lucide-react";
import { useState } from "react";
import {
  TimelineEmptyState,
  TimelineErrorState,
  TimelineLoadingState,
} from "../../../common/components/StateView";
import { UI_MESSAGES } from "../../../constants/messages";
import type { Activity } from "../routine.types";
import { ActivityTimelineItem } from "./ActivityTimelineItem";

interface ActivityTimelineProps {
  activities: Activity[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onAdd: () => void;
  onEdit: (activity: Activity) => void;
  onDelete: (activity: Activity) => void;
  onToggle: (activity: Activity) => Promise<void>;
  onOpenReorder: () => void;
}

export function ActivityTimeline({
  activities,
  isLoading,
  error,
  onRetry,
  onAdd,
  onEdit,
  onDelete,
  onToggle,
  onOpenReorder,
}: ActivityTimelineProps) {
  const [isCheckMode, setIsCheckMode] = useState(false);
  const firstPendingId =
    activities.find((item) => !item.is_completed)?.id ?? null;

  return (
    <section aria-label={UI_MESSAGES.DASHBOARD.ROUTINE_SECTION_TITLE}>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-lg font-extrabold text-content sm:text-xl">
          {UI_MESSAGES.DASHBOARD.ROUTINE_SECTION_TITLE}
        </h2>

        <div className="flex items-center justify-start gap-2">
          {activities.length > 0 ? (
            <button
              type="button"
              aria-pressed={isCheckMode}
              onClick={() => setIsCheckMode((active) => !active)}
              className={`inline-flex min-h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-brand ${
                isCheckMode
                  ? "border-brand/50 bg-brand/10 text-brand"
                  : "border-border bg-surface text-content-secondary hover:bg-surface-subtle"
              }`}
            >
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-[3px] border border-current">
                <Check className="h-2.5 w-2.5" />
              </span>
              <span>{UI_MESSAGES.DASHBOARD.CHECK_MODE_TOGGLE}</span>
            </button>
          ) : null}

          {activities.length >= 2 ? (
            <button
              type="button"
              onClick={onOpenReorder}
              className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-border bg-surface px-3 text-xs font-semibold text-content-secondary transition-colors hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-brand"
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span>{UI_MESSAGES.DASHBOARD.REORDER_BUTTON}</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          ) : null}

          <button
            type="button"
            onClick={onAdd}
            className="btn hidden min-h-[42px] rounded-xl border-none bg-neutral px-4 text-sm font-semibold text-neutral-content hover:bg-neutral lg:inline-flex"
          >
            <Plus className="h-4 w-4" />
            <span>{UI_MESSAGES.DASHBOARD.ADD_BUTTON}</span>
          </button>
        </div>
      </div>

      {isLoading ? <TimelineLoadingState /> : null}

      {!isLoading && error ? (
        <TimelineErrorState message={error} onRetry={onRetry} />
      ) : null}

      {!isLoading && !error && activities.length === 0 ? (
        <TimelineEmptyState onAddFirst={onAdd} />
      ) : null}

      {!isLoading && !error && activities.length > 0 ? (
        <ol className="list-none p-0">
          {activities.map((activity, index) => (
            <ActivityTimelineItem
              key={activity.id}
              activity={activity}
              isFirst={index === 0}
              isLast={index === activities.length - 1}
              isNext={activity.id === firstPendingId}
              isCheckMode={isCheckMode}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </ol>
      ) : null}
    </section>
  );
}
