import { Info } from 'lucide-react';

interface ModeInfoPopupProps {
  message: string;
}

export function ModeInfoPopup({ message }: ModeInfoPopupProps) {
  return (
    <div className="fixed inset-x-0 top-16 z-40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div
          role="status"
          data-mode-control
          className="alert alert-info flex-nowrap items-center rounded-2xl border border-info/20 bg-info/10 px-3 py-2 text-info shadow-sm sm:px-4"
        >
          <Info className="h-5 w-5 shrink-0" />
          <p className="min-w-0 text-xs font-medium leading-tight sm:text-sm sm:leading-relaxed">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
