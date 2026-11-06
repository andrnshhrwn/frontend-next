"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  hideToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

const toastStyles: Record<
  ToastType,
  {
    icon: typeof CheckCircle2;
    container: string;
    iconColor: string;
    title: string;
    role: "status" | "alert";
  }
> = {
  success: {
    icon: CheckCircle2,
    container: "border-emerald-200 bg-white",
    iconColor: "text-emerald-600",
    title: "Berhasil",
    role: "status",
  },
  error: {
    icon: XCircle,
    container: "border-red-200 bg-white",
    iconColor: "text-red-600",
    title: "Terjadi Kesalahan",
    role: "alert",
  },
  warning: {
    icon: AlertTriangle,
    container: "border-amber-200 bg-white",
    iconColor: "text-amber-600",
    title: "Perhatian",
    role: "status",
  },
  info: {
    icon: Info,
    container: "border-blue-200 bg-white",
    iconColor: "text-blue-600",
    title: "Informasi",
    role: "status",
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const hideToast = useCallback((id: number) => {
    const timer = timers.current.get(id);

    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }

    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "success", duration = 3000) => {
      if (!message.trim()) return;

      const id = ++nextId.current;

      setToasts((current) => [
        ...current,
        {
          id,
          message,
          type,
        },
      ]);

      if (duration > 0) {
        const timer = setTimeout(() => {
          hideToast(id);
        }, duration);

        timers.current.set(id, timer);
      }
    },
    [hideToast],
  );

  useEffect(() => {
    return () => {
      timers.current.forEach((timer) => clearTimeout(timer));
      timers.current.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}

      <div
        className="fixed top-4 right-4 z-[9999] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 pointer-events-none"
        aria-live="polite"
        aria-relevant="additions removals"
      >
        {toasts.map((toast) => {
          const style = toastStyles[toast.type];
          const Icon = style.icon;

          return (
            <div
              key={toast.id}
              role={style.role}
              className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-lg shadow-slate-900/10 animate-in slide-in-from-top-2 fade-in duration-200 ${style.container}`}
            >
              <div className={`mt-0.5 shrink-0 ${style.iconColor}`}>
                <Icon className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-pdam-navy">
                  {style.title}
                </p>
                <p className="mt-1 break-words text-xs leading-relaxed text-slate-600">
                  {toast.message}
                </p>
              </div>

              <button
                type="button"
                onClick={() => hideToast(toast.id)}
                aria-label="Tutup notifikasi"
                className="shrink-0 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast harus digunakan di dalam ToastProvider.");
  }

  return context;
}
