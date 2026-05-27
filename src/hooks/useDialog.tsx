import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

type DialogTone = "default" | "danger";

type ConfirmDialogOptions = {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: DialogTone;
};

type AlertDialogOptions = {
  title?: string;
  message: string;
  confirmLabel?: string;
  tone?: DialogTone;
};

type DialogRequest = {
  kind: "alert" | "confirm";
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  tone: DialogTone;
  resolve: (value: boolean) => void;
};

type DialogContextValue = {
  confirm: (options: ConfirmDialogOptions) => Promise<boolean>;
  alert: (options: AlertDialogOptions) => Promise<void>;
};

const DialogContext = createContext<DialogContextValue | null>(null);

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const queueRef = useRef<DialogRequest[]>([]);
  const [activeDialog, setActiveDialog] = useState<DialogRequest | null>(null);

  const enqueueDialog = useCallback((request: DialogRequest) => {
    queueRef.current.push(request);
    setActiveDialog((current) => {
      if (current) return current;
      return queueRef.current.shift() ?? null;
    });
  }, []);

  const closeDialog = useCallback((confirmed: boolean) => {
    setActiveDialog((current) => {
      if (!current) return current;
      current.resolve(confirmed);
      return queueRef.current.shift() ?? null;
    });
  }, []);

  const confirm = useCallback(
    (options: ConfirmDialogOptions) =>
      new Promise<boolean>((resolve) => {
        enqueueDialog({
          kind: "confirm",
          title: options.title ?? "Please confirm",
          message: options.message,
          confirmLabel: options.confirmLabel ?? "Confirm",
          cancelLabel: options.cancelLabel ?? "Cancel",
          tone: options.tone ?? "default",
          resolve
        });
      }),
    [enqueueDialog]
  );

  const alert = useCallback(
    (options: AlertDialogOptions) =>
      new Promise<void>((resolve) => {
        enqueueDialog({
          kind: "alert",
          title: options.title ?? "Notice",
          message: options.message,
          confirmLabel: options.confirmLabel ?? "OK",
          cancelLabel: "Cancel",
          tone: options.tone ?? "default",
          resolve: () => resolve()
        });
      }),
    [enqueueDialog]
  );

  const value = useMemo(
    () => ({
      confirm,
      alert
    }),
    [alert, confirm]
  );

  useEffect(() => {
    if (!activeDialog) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      closeDialog(activeDialog.kind === "alert");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeDialog, closeDialog]);

  return (
    <DialogContext.Provider value={value}>
      {children}
      {activeDialog ? (
        <div className="create-wizard-modal-overlay app-dialog-overlay" role="dialog" aria-modal="true">
          <div className={`create-wizard-modal app-dialog app-dialog-${activeDialog.tone}`}>
            <div className="create-wizard-modal-header">
              <h3>{activeDialog.title}</h3>
              {activeDialog.kind === "confirm" ? (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => closeDialog(false)}
                >
                  ×
                </button>
              ) : null}
            </div>
            <p className="app-dialog-copy">{activeDialog.message}</p>
            <div className="app-dialog-actions">
              {activeDialog.kind === "confirm" ? (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => closeDialog(false)}
                >
                  {activeDialog.cancelLabel}
                </button>
              ) : null}
              <button
                type="button"
                className={`primary-button${activeDialog.tone === "danger" ? " app-dialog-danger" : ""}`}
                onClick={() => closeDialog(true)}
              >
                {activeDialog.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within DialogProvider.");
  }
  return context;
}
