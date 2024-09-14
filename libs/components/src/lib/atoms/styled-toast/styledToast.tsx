import { DefaultToastOptions, resolveValue, Toaster } from 'react-hot-toast';

interface StyledToastProps {
  toastOptions?: DefaultToastOptions;
}

export function StyledToast({ toastOptions }: StyledToastProps) {
  return (
    <Toaster toastOptions={toastOptions}>
      {(t) => (
        <div className="py-2 px-4 rounded-lg bg-success-100 border-2 border-success-500">
          {resolveValue(t.message, t)}
        </div>
      )}
    </Toaster>
  );
}
