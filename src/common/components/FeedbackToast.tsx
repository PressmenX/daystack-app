import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useToast } from '../useToast';

export function FeedbackToast() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) {
    return null;
  }

  return createPortal(
    <div className="toast toast-top toast-center z-9999 w-full max-w-md px-4 pt-4">
      {toasts.map((toast) => {
        const isSuccess = toast.variant === 'success';
        return (
          <div
            key={toast.id}
            role="status"
            className={`alert flex items-center justify-between gap-3 rounded-2xl border shadow-lg ${
              isSuccess
                ? 'alert-success border-brand/20 bg-brand/10 text-brand backdrop-blur-2xl'
                : 'alert-error border-danger/20 bg-danger-soft text-danger'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {isSuccess ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-brand" />
              ) : (
                <AlertCircle className="h-5 w-5 shrink-0 text-danger" />
              )}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Tutup"
              className="flex min-h-9 min-w-9 items-center justify-center rounded-lg text-content-muted transition-colors hover:bg-black/5"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>,
    document.body
  );
}
