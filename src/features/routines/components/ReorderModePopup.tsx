import { Info } from 'lucide-react';
import { UI_MESSAGES } from '../../../constants/messages';

export function ReorderModePopup() {
  return (
    <div
      role="status"
      className="alert alert-info fixed left-1/2 top-20 z-40 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 items-start rounded-2xl border border-info/20 bg-info/10 p-4 text-info shadow-xl backdrop-blur-md"
    >
      <Info className="mt-0.5 h-5 w-5 shrink-0" />
      <p className="text-sm font-medium leading-relaxed">
        {UI_MESSAGES.DASHBOARD.DRAG_MODE_INFO}
      </p>
    </div>
  );
}
