import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  Hand,
  LayoutGrid,
  PlusCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { UI_MESSAGES } from "../../../constants/messages";
import type { Activity } from "../routine.types";
import { SortableActivityItem } from "./SortableActivityItem";

interface ReorderRoutineViewProps {
  activities: Activity[];
  isSaving: boolean;
  onSaveOrder: (ordered: Activity[]) => Promise<boolean>;
  onAddStep: () => void;
  onBack: () => void;
}

export function ReorderRoutineView({
  activities,
  isSaving,
  onSaveOrder,
  onAddStep,
  onBack,
}: ReorderRoutineViewProps) {
  const [draftActivities, setDraftActivities] =
    useState<Activity[]>(activities);

  useEffect(() => {
    setDraftActivities(activities);
  }, [activities]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 140, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent): void {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }
    setDraftActivities((prev) => {
      const oldIndex = prev.findIndex((item) => item.id === active.id);
      const newIndex = prev.findIndex((item) => item.id === over.id);
      if (oldIndex < 0 || newIndex < 0) {
        return prev;
      }
      return arrayMove(prev, oldIndex, newIndex);
    });
  }

  async function handleSave(): Promise<void> {
    const ok = await onSaveOrder(draftActivities);
    if (ok) {
      onBack();
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label={UI_MESSAGES.REORDER.BACK_LABEL}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-surface text-content-secondary shadow-xs ring-1 ring-border/80 transition-colors hover:bg-surface-subtle"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="font-display text-lg font-extrabold text-content sm:text-xl">
            {UI_MESSAGES.REORDER.PAGE_TITLE}
          </h2>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/15 px-3 py-1.5 text-xs font-bold text-brand">
          <LayoutGrid className="h-3.5 w-3.5" />
          <span>{UI_MESSAGES.REORDER.MODE_BADGE}</span>
        </span>
      </div>

      <div className="flex items-start gap-3 rounded-2xl bg-info/10 px-4 py-3.5 text-sm leading-relaxed text-content-secondary">
        <Hand className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
        <p>{UI_MESSAGES.REORDER.INSTRUCTION}</p>
      </div>

      <div className="flex items-center gap-3.5 rounded-2xl border border-border/80 bg-surface p-4 shadow-xs">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand/15 text-brand">
          <BookOpen className="h-5 w-5" />
        </div>
        <div>
          <p className="font-display text-sm font-bold text-content sm:text-base">
            {UI_MESSAGES.REORDER.PAGE_TITLE}
          </p>
          <p className="text-xs font-medium tabular-nums text-content-muted">
            {draftActivities.length} {UI_MESSAGES.REORDER.CARD_SUBTITLE_SUFFIX}
          </p>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={draftActivities.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <ol className="list-none p-0">
            {draftActivities.map((activity, index) => (
              <SortableActivityItem
                key={activity.id}
                activity={activity}
                index={index}
                isFirst={index === 0}
                isLast={index === draftActivities.length - 1}
              />
            ))}
          </ol>
        </SortableContext>
      </DndContext>

      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={onAddStep}
          className="btn min-h-12 w-full rounded-full border border-border bg-surface text-sm font-semibold text-content-secondary shadow-xs hover:bg-surface-subtle"
        >
          <PlusCircle className="h-4 w-4 text-brand" />
          <span>{UI_MESSAGES.REORDER.ADD_STEP_BUTTON}</span>
        </button>

        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={isSaving}
          className="btn min-h-[50px] w-full rounded-full border-none bg-neutral text-sm font-semibold text-neutral-content shadow-md hover:bg-neutral"
        >
          {isSaving ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-brand/60" />
          )}
          <span>{UI_MESSAGES.REORDER.SAVE_ORDER_BUTTON}</span>
        </button>
      </div>
    </div>
  );
}
