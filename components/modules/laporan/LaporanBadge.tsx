const STYLES: Record<string, string> = {
  // penugasan
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  proses: "border-blue-200 bg-blue-50 text-blue-700",
  selesai: "border-emerald-200 bg-emerald-50 text-emerald-700",
  dibatalkan: "border-slate-200 bg-slate-100 text-slate-600",
  // validasi BAP
  menunggu: "border-amber-200 bg-amber-50 text-amber-700",
  disetujui: "border-emerald-200 bg-emerald-50 text-emerald-700",
  ditolak: "border-red-200 bg-red-50 text-red-700",
  belum_diajukan: "border-slate-200 bg-slate-100 text-slate-600",
};

export default function LaporanBadge({ value }: { value: string }) {
  return (
    <span
      className={`inline-block rounded-md border px-2 py-0.5 text-[11px] font-semibold capitalize ${
        STYLES[value] ?? STYLES.dibatalkan
      }`}
    >
      {value.replace(/_/g, " ")}
    </span>
  );
}
