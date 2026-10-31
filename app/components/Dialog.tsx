import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

// Native <dialog>: the browser handles focus trapping, Escape and stacking.
// It's a bottom sheet on phones and a centred card from 640px (styles/ui.css).
export const Dialog = ({
  open,
  onClose,
  title,
  labelId,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  labelId: string;
  children: ReactNode;
}) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      // Start on the title rather than the close button, so screen readers
      // announce it and no focus ring is drawn on the ×.
      dialog.querySelector<HTMLElement>('h2')?.focus();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Fires for Escape, the close button and backdrop clicks alike.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    dialog.addEventListener('close', onClose);
    return () => dialog.removeEventListener('close', onClose);
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelId}
      className="cg-dialog bg-base-100 text-base-content"
      onClick={(event) => {
        // The panel fills the dialog, so only backdrop clicks land here.
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
    >
      {open && (
        <div className="cg-dialog-panel">
          <header className="cg-dialog-header bg-base-100">
            <h2
              id={labelId}
              tabIndex={-1}
              className="text-xl sm:text-2xl font-semibold outline-none"
            >
              {title}
            </h2>
            <button
              type="button"
              className="btn btn-ghost btn-circle"
              aria-label="Close"
              onClick={() => ref.current?.close()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </header>
          <div className="cg-dialog-body">{children}</div>
        </div>
      )}
    </dialog>
  );
};

export default Dialog;
