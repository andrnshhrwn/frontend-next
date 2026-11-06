"use client";

import { AlertCircle } from "lucide-react";

interface ValidasiErrorProps {
  message: string;
  onRetry: () => void;
}

export default function ValidasiError({
  message,
  onRetry,
}: ValidasiErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <div className="rounded-lg border border-pdam-red/30 bg-pdam-red/5 p-4 text-sm text-pdam-red flex items-start gap-2">
      <AlertCircle className="w-5 h-5 shrink-0" />

      <div className="flex-1">
        <p className="font-bold">Gagal memuat data validasi</p>

        <p className="text-xs mt-1">{message}</p>

        <button
          type="button"
          onClick={onRetry}
          className="text-xs font-bold underline mt-2"
        >
          Coba lagi
        </button>
      </div>
    </div>
  );
}
