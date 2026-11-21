import { ArrowUpDown, Plus } from "lucide-react";
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
  const firstPendingId =
    activities.find((item) => !item.is_completed)?.id ?? null;

  return (
    <section aria-label={UI_MESSAGES.DASHBOARD.ROUTINE_SECTION_TITLE}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-display text-lg font-extrabold text-content sm:text-xl">
          {UI_MESSAGES.DASHBOARD.ROUTINE_SECTION_TITLE}
        </h2>

        <div className="flex items-center gap-2">
          {activities.length >= 2 ? (
            <button
              type="button"
              onClick={onOpenReorder}
              className="inline-flex  min-h-10 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-brand transition-colors hover:bg-brand/10"
            >
              <span>{UI_MESSAGES.DASHBOARD.REORDER_BUTTON}</span>
              <ArrowUpDown className="h-4 w-4" />
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
