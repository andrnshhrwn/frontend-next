import React from "react";

type BadgeType =
  // Water Meter
  | "Tersedia di Unit"
  | "tersedia_di_unit"
  | "Terpasang"
  | "terpasang"
  | "Rusak"
  | "rusak"
  | "Ditarik"
  | "tarik"
  // SPK / Penugasan
  | "Menunggu"
  | "pending"
  | "Pending"
  | "Proses"
  | "proses"
  | "Selesai"
  | "selesai"
  | "Dibatalkan"
  | "dibatalkan"
  // Validasi
  | "Disetujui"
  | "Ditolak"
  // Generic
  | "Aktif"
  | "Nonaktif";

interface StatusBadgeProps {
  status: BadgeType | string;
  size?: "sm" | "md";
  showDot?: boolean;
  className?: string;
}

export function StatusBadge({
  status,
  size = "sm",
  showDot = true,
  className = "",
}: StatusBadgeProps) {
  const normalized = status.toLowerCase().replace(/\s+/g, "_");

  // Determine appearance
  let label = status;
  let bgClass = "bg-slate-100 text-slate-700 border-slate-200";
  let dotColor = "bg-slate-500";

  switch (normalized) {
    case "tersedia_di_unit":
    case "tersedia":
      label = "Tersedia di Unit";
      bgClass = "bg-sky-50 text-sky-700 border-sky-200";
      dotColor = "bg-sky-500";
      break;

    case "terpasang":
      label = "Terpasang";
      bgClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
      dotColor = "bg-emerald-500";
      break;

    case "rusak":
      label = "Rusak";
      bgClass = "bg-rose-50 text-rose-700 border-rose-200";
      dotColor = "bg-rose-500";
      break;

    case "ditarik":
    case "tarik":
      label = "Ditarik";
      bgClass = "bg-slate-100 text-slate-600 border-slate-300";
      dotColor = "bg-slate-400";
      break;

    case "pending":
    case "menunggu":
      label = status === "Menunggu" ? "Menunggu" : "Pending";
      bgClass = "bg-amber-50 text-amber-700 border-amber-200";
      dotColor = "bg-amber-500";
      break;

    case "proses":
      label = "Proses";
      bgClass = "bg-blue-50 text-blue-700 border-blue-200";
      dotColor = "bg-blue-500";
      break;

    case "selesai":
    case "disetujui":
      label = status === "Disetujui" ? "Disetujui" : "Selesai";
      bgClass = "bg-teal-50 text-teal-700 border-teal-200";
      dotColor = "bg-teal-500";
      break;

    case "dibatalkan":
    case "ditolak":
      label = status === "Ditolak" ? "Ditolak" : "Dibatalkan";
      bgClass = "bg-rose-50 text-rose-700 border-rose-200";
      dotColor = "bg-rose-500";
      break;

    case "aktif":
      label = "Aktif";
      bgClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
      dotColor = "bg-emerald-500";
      break;

    case "nonaktif":
      label = "Nonaktif";
      bgClass = "bg-slate-100 text-slate-600 border-slate-300";
      dotColor = "bg-slate-400";
      break;

    default:
      label = status;
      break;
  }

  const sizeClass =
    size === "sm" ? "text-[11px] px-2 py-0.5" : "text-xs px-2.5 py-1";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${bgClass} ${sizeClass} ${className}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
      <span>{label}</span>
    </span>
  );
}
