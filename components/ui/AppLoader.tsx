import { ShieldLock } from "lucide-react";

interface AppLoaderProps {
  /** Teks untuk screen reader */
  label?: string;
  /** true = menutup seluruh layar, false = hanya mengisi area induknya */
  fullScreen?: boolean;
  className?: string;
}

export default function AppLoader({
  label = "Memuat aplikasi...",
  fullScreen = true,
  className = "",
}: AppLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label ?? "Memuat"}
      className={[
        "flex flex-col items-center justify-center gap-4 bg-pdam-bg p-4",
        fullScreen
          ? "fixed inset-0 z-100 min-h-screen"
          : "h-full min-h-48 w-full",
        className,
      ].join(" ")}
    >
      <div className="flex h-20 w-20 animate-pulse items-center justify-center rounded-2xl bg-pdam-primary/5 ring-1 ring-pdam-primary/10">
        <ShieldLock
          className="h-10 w-10 text-pdam-primary opacity-60"
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </div>

      {label && (
        <p className="text-xs font-medium tracking-wide text-slate-500">
          {label}
        </p>
      )}
    </div>
  );
}
