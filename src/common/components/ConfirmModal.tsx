import { AlertTriangle } from 'lucide-react';
import { UI_MESSAGES } from '../../constants/messages';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  isLoading?: boolean;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = UI_MESSAGES.ACTIVITY.CANCEL,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="modal modal-open modal-bottom sm:modal-middle"
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-box rounded-t-3xl bg-white p-6 sm:rounded-3xl">
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900">
              {title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              {description}
            </p>
          </div>
        </div>

        <div className="modal-action mt-6 flex gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="btn min-h-[44px] flex-1 rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => void onConfirm()}
            disabled={isLoading}
            className="btn min-h-[44px] flex-1 rounded-xl border-none bg-rose-600 text-white hover:bg-rose-700"
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : null}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-slate-900/40 backdrop-blur-[2px]" onClick={onCancel} />
    </div>
  );
}
