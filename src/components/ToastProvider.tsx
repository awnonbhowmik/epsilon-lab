"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

type ToastLevel = "info" | "warn" | "error";

interface Toast {
  id: number;
  message: string;
  level: ToastLevel;
}

interface ToastContextValue {
  showToast: (message: string, level?: ToastLevel) => void;
}

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

let nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, level: ToastLevel = "error") => {
      const id = nextId++;
      setToasts((prev) => [...prev, { id, message, level }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    },
    [],
  );

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const levelClasses: Record<ToastLevel, string> = {
    info: "border-blue-600 bg-blue-950/90 text-blue-200",
    warn: "border-yellow-600 bg-yellow-950/90 text-yellow-200",
    error: "border-red-600 bg-red-950/90 text-red-200",
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.length > 0 && (
        <div className="fixed bottom-4 left-4 z-[100] flex flex-col gap-2 max-w-sm">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`border rounded-lg px-4 py-3 text-sm shadow-lg flex items-start gap-2 ${levelClasses[t.level]}`}
            >
              <span className="flex-1">{t.message}</span>
              <button
                onClick={() => dismiss(t.id)}
                className="shrink-0 opacity-60 hover:opacity-100"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}
