import { Pencil, Plus } from 'lucide-react';
import { UI_MESSAGES } from '../../../constants/messages';

interface TimelineActionsProps {
  isEditMode: boolean;
  onEnterEdit: () => void;
  onAdd: () => void;
}

export function TimelineActions({
  isEditMode,
  onEnterEdit,
  onAdd,
}: TimelineActionsProps) {
  if (isEditMode) {
    return null;
  }

  return (
    <>
      <div className="hidden items-center gap-2 lg:flex">
        <button
          type="button"
          aria-label={UI_MESSAGES.DASHBOARD.EDIT_BUTTON}
          title={UI_MESSAGES.DASHBOARD.EDIT_BUTTON}
          onClick={onEnterEdit}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-brand bg-brand text-brand-content shadow-lg ring-2 ring-brand/30 transition-colors hover:brightness-110 focus-visible:outline-2 focus-visible:outline-brand"
        >
          <Pencil className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={onAdd}
          className="btn min-h-10.5 rounded-xl border-none bg-neutral px-4 text-sm font-semibold text-neutral-content hover:bg-neutral"
        >
          <Plus className="h-4 w-4" />
          <span>{UI_MESSAGES.DASHBOARD.ADD_BUTTON}</span>
        </button>
      </div>

      <div className="fixed bottom-6 right-5 z-30 flex flex-col items-center gap-3 lg:hidden">
        <button
          type="button"
          aria-label={UI_MESSAGES.DASHBOARD.EDIT_BUTTON}
          title={UI_MESSAGES.DASHBOARD.EDIT_BUTTON}
          onClick={onEnterEdit}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-brand bg-brand text-brand-content shadow-lg ring-2 ring-brand/30 transition-colors hover:brightness-110 focus-visible:outline-2 focus-visible:outline-brand"
        >
          <Pencil className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={onAdd}
          aria-label={UI_MESSAGES.DASHBOARD.ADD_BUTTON}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral text-neutral-content shadow-xl transition-transform hover:scale-105 active:scale-95"
        >
          <Plus className="h-6 w-6 stroke-[2.5]" />
        </button>
      </div>
    </>
  );
}
