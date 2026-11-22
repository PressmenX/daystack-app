import { Info } from 'lucide-react';

interface ModeInfoPopupProps {
  message: string;
}

export function ModeInfoPopup({ message }: ModeInfoPopupProps) {
  return (
    <div
      role="status"
      data-mode-control
      className="alert alert-info fixed left-1/2 top-20 z-40 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 items-start rounded-2xl border border-info/20 bg-info/10 p-4 text-info shadow-xl backdrop-blur-md"
    >
      <Info className="mt-0.5 h-5 w-5 shrink-0" />
      <p className="text-sm font-medium leading-relaxed">{message}</p>
    </div>
  );
}
