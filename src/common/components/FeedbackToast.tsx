import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useToast } from '../useToast';

export function FeedbackToast() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="toast toast-top toast-center z-50 w-full max-w-md px-4 pt-4">
      {toasts.map((toast) => {
        const isSuccess = toast.variant === 'success';
        return (
          <div
            key={toast.id}
            role="status"
            className={`alert flex items-center justify-between gap-3 rounded-2xl border shadow-lg ${
              isSuccess
                ? 'alert-success border-emerald-200 bg-emerald-50 text-emerald-950'
                : 'alert-error border-rose-200 bg-rose-50 text-rose-950'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {isSuccess ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
              )}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Tutup"
              className="flex min-h-[36px] min-w-[36px] items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-black/5"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
