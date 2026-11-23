import { AlertTriangle } from 'lucide-react';
import { UI_MESSAGES } from '../../constants/messages';
import { useModalHistory } from '../useModalHistory';

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
  useModalHistory(open, onCancel);

  if (!open) {
    return null;
  }

  return (
    <div
      className="modal modal-open modal-bottom sm:modal-middle"
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-box rounded-t-3xl bg-surface p-6 sm:rounded-3xl">
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-danger-soft text-danger">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-content">
              {title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-content-secondary">
              {description}
            </p>
          </div>
        </div>

        <div className="modal-action mt-6 flex gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="btn min-h-11 flex-1 rounded-xl border-border bg-surface text-content-secondary hover:bg-surface-subtle"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => void onConfirm()}
            disabled={isLoading}
            className="btn min-h-11 flex-1 rounded-xl border-none bg-danger text-danger-content hover:bg-danger"
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : null}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-neutral/40 backdrop-blur-[2px]" onClick={onCancel} />
    </div>
  );
}
