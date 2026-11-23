import { Info } from "lucide-react";

interface ModeInfoPopupProps {
  message: string;
}

export function ModeInfoPopup({ message }: ModeInfoPopupProps) {
  return (
    <div className="fixed inset-x-0 top-16 z-40">
      <div className="mx-auto w-full sm:max-w-6xl sm:px-6 lg:px-8">
        <div
          role="status"
          data-mode-control
          className="alert alert-info alert-soft w-full flex-nowrap items-center border-info px-4 py-2 text-info shadow-sm sm:rounded-2xl  sm:px-4 rounded-none "
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
