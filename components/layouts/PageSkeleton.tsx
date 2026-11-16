export default function PageSkeleton() {
  return (
    <div
      className="animate-pulse space-y-6"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Memuat halaman...</span>

      {/* Judul halaman */}
      <div className="space-y-2">
        <div className="h-7 w-64 rounded-lg bg-slate-200/70" />
        <div className="h-4 w-96 max-w-full rounded-lg bg-slate-200/60" />
      </div>

      {/* Kartu ringkasan */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="space-y-3 rounded-xl border border-slate-200/80 bg-white p-5"
          >
            <div className="h-4 w-24 rounded bg-slate-200/70" />
            <div className="h-8 w-20 rounded bg-slate-200/80" />
            <div className="h-3 w-32 rounded bg-slate-200/60" />
          </div>
        ))}
      </div>

      {/* Tabel / grafik */}
      <div className="space-y-3 rounded-xl border border-slate-200/80 bg-white p-5">
        <div className="h-5 w-40 rounded bg-slate-200/70" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 w-full rounded-lg bg-slate-200/60" />
        ))}
      </div>
    </div>
  );
}
