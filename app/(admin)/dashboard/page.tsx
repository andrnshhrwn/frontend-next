"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  SlidersHorizontal,
  Download,
  BarChart3,
  Info,
  Check,
  Building2,
} from "lucide-react";
import {
  dashboardService,
  type DashboardSummary,
  type UnitBranchProgress,
} from "@/services/dashboardService";

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [branches, setBranches] = useState<UnitBranchProgress[]>([]);
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        setIsLoading(true);
        setError("");

        const [summaryResponse, progressResponse] = await Promise.all([
          dashboardService.getSummary(),
          dashboardService.getUnitProgress(),
        ]);

        if (!active) return;

        setSummary(summaryResponse.data);
        setBranches(progressResponse.data);
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Gagal mengambil data dashboard.",
          );
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const displayedBranches = useMemo(
    () =>
      selectedBranch === "all"
        ? branches
        : branches.filter(
            (branch) => String(branch.id_unit) === selectedBranch,
          ),
    [branches, selectedBranch],
  );

  const currentBranchName =
    selectedBranch === "all"
      ? `Semua ${branches.length} Unit Cabang`
      : (branches.find((branch) => String(branch.id_unit) === selectedBranch)
          ?.nama_unit ?? "Unit Cabang");

  const totalTarget = branches.every((b) => b.target !== null)
    ? branches.reduce((sum, b) => sum + (b.target ?? 0), 0)
    : null;

  const totalRealisasi = branches.reduce((sum, b) => sum + b.realisasi, 0);

  const totalPercentage =
    totalTarget !== null && totalTarget > 0
      ? Math.round((totalRealisasi / totalTarget) * 100)
      : null;

  const formatNumber = (value: number) => value.toLocaleString("id-ID");

  const percentage = (value: number, total: number) =>
    total > 0 ? Math.round((value / total) * 100) : 0;

  const spk = summary?.spk;
  const totalSpk = spk?.total ?? 0;

  const statuses = [
    {
      label: "Pending (Menunggu Disposisi Teknisi Cabang)",
      count: spk?.pending ?? 0,
      color: "bg-slate-400",
      badge: "bg-slate-200 text-slate-700",
    },
    {
      label: "Proses (Dikerjakan Teknisi di Lapangan)",
      count: spk?.proses ?? 0,
      color: "bg-pdam-primary",
      badge: "bg-pdam-primary/15 text-pdam-primary",
    },
    {
      label: "Selesai",
      count: spk?.selesai ?? 0,
      color: "bg-emerald-600",
      badge: "bg-emerald-100 text-emerald-800",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Banner Monitoring */}
      <div className="card bg-white border border-slate-200/90 shadow-xs p-5 flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-pdam-primary/10 flex items-center justify-center text-pdam-primary shrink-0 ring-1 ring-pdam-primary/20">
            <BarChart3 className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-bold text-base text-pdam-navy">
                Monitoring Pergantian Water Meter
              </h2>
              <span className="badge bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold">
                Data Backend
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-0.5">
              Konsolidasi data SPK dan progres unit cabang (Periode{" "}
              {summary?.periode ?? "—"})
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 relative">
          <div className="btn btn-sm btn-ghost bg-pdam-bg border border-slate-200 text-slate-700 font-medium normal-case pointer-events-none">
            <Calendar className="w-3.5 h-3.5 text-pdam-navy" />
            <span className="font-semibold text-pdam-navy">
              {summary?.periode ?? "—"}
            </span>
            <span className="text-[10px] text-emerald-600 bg-emerald-100/70 px-1.5 py-0.5 rounded font-bold">
              {formatNumber(totalSpk)} SPK
            </span>
          </div>

          {/* Filter Cabang */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`btn btn-sm normal-case font-medium border ${
                selectedBranch !== "all"
                  ? "bg-pdam-primary text-white border-pdam-primary"
                  : "btn-ghost bg-pdam-bg hover:bg-slate-200 border-slate-200 text-slate-700"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>
                {selectedBranch === "all" ? "Filter Cabang" : currentBranchName}
              </span>
            </button>

            {isFilterOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setIsFilterOpen(false)}
                />

                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 p-2 z-30 space-y-1">
                  <div className="px-2 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Pilih Unit Cabang ({branches.length} Unit)
                  </div>

                  <button
                    onClick={() => {
                      setSelectedBranch("all");
                      setIsFilterOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-left transition-colors ${
                      selectedBranch === "all"
                        ? "bg-pdam-primary/10 text-pdam-primary font-bold"
                        : "text-slate-700 hover:bg-pdam-bg"
                    }`}
                  >
                    <span>Semua Unit Cabang ({branches.length} Unit)</span>
                    {selectedBranch === "all" && (
                      <Check className="w-3.5 h-3.5 text-pdam-primary" />
                    )}
                  </button>

                  <div className="h-px bg-slate-100 my-1" />

                  <div className="max-h-56 overflow-y-auto space-y-0.5">
                    {branches.map((branch) => (
                      <button
                        key={branch.id_unit}
                        onClick={() => {
                          setSelectedBranch(String(branch.id_unit));
                          setIsFilterOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded-lg text-left transition-colors ${
                          selectedBranch === String(branch.id_unit)
                            ? "bg-pdam-primary/10 text-pdam-primary font-bold"
                            : "text-slate-700 hover:bg-pdam-bg"
                        }`}
                      >
                        <div>
                          <p className="leading-tight">{branch.nama_unit}</p>
                          <p className="text-[10px] text-slate-400">
                            ID Unit: {branch.id_unit}
                          </p>
                        </div>
                        {selectedBranch === String(branch.id_unit) && (
                          <Check className="w-3.5 h-3.5 text-pdam-primary shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => window.print()}
            className="btn btn-sm bg-pdam-primary hover:bg-pdam-navy text-white font-medium normal-case border-0 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Rekap / Cetak</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
          <button
            onClick={() => window.location.reload()}
            className="ml-2 font-bold underline"
          >
            Muat ulang
          </button>
        </div>
      )}

      {isLoading && (
        <div className="card bg-white border border-slate-200 p-6 text-sm text-slate-500">
          Memuat data dashboard...
        </div>
      )}

      {!isLoading && !error && summary && (
        <>
          {/* Grid Kartu Utama */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Kartu 1: Inventori */}
            <div className="card bg-white border border-slate-200/90 shadow-xs p-6 justify-between">
              <div>
                <div className="flex justify-between items-center mb-3 gap-2">
                  <span className="text-[11px] font-bold text-pdam-navy uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-pdam-primary inline-block" />
                    DISTRIBUSI STATUS WATER METER (INVENTORI)
                  </span>
                  <span className="badge border border-pdam-primary/30 bg-pdam-primary/10 text-pdam-primary text-[11px] font-semibold">
                    Data Inventori
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-extrabold text-pdam-navy tabular-nums">
                    —
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Data inventori belum tersedia di API
                  </span>
                </div>

                <div className="h-3.5 w-full bg-pdam-bg rounded-full overflow-hidden flex mb-2 border border-slate-200/60" />

                <div className="flex justify-between text-[11px] text-slate-400 mb-5">
                  <span>—</span>
                  <span>Proporsi Status Inventaris</span>
                  <span>—</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200">
                {["Tersedia di Unit", "Terpasang Aktif", "Rusak / Ditarik"].map(
                  (label) => (
                    <div
                      key={label}
                      className="bg-pdam-bg p-3 rounded-xl border border-slate-200/80"
                    >
                      <div className="text-[11px] text-slate-600 font-medium mb-1">
                        {label}
                      </div>
                      <p className="text-lg font-extrabold text-pdam-navy">—</p>
                      <p className="text-[11px] text-slate-400">
                        Belum tersedia
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Kartu 2: Status SPK */}
            <div className="card bg-white border border-slate-200/90 shadow-xs p-6 justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[11px] font-bold text-pdam-navy uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-pdam-primary inline-block" />
                    STATUS TIKET PENUGASAN (SPK) BERJENJANG
                  </span>
                  <span className="badge border border-emerald-500/30 bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
                    Periode {summary.periode}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mb-5">
                  <span className="text-4xl font-extrabold text-pdam-navy tabular-nums">
                    {formatNumber(totalSpk)}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Total Perintah Kerja Diterbitkan
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {statuses.map((status) => {
                  const pct = percentage(status.count, totalSpk);

                  return (
                    <div
                      key={status.label}
                      className="bg-pdam-bg p-3 rounded-xl border border-slate-200/80"
                    >
                      <div className="flex justify-between text-xs mb-2 gap-3">
                        <span className="font-medium flex items-center gap-2 text-slate-700">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${status.color}`}
                          />
                          {status.label}
                        </span>
                        <span className="font-extrabold text-pdam-navy whitespace-nowrap">
                          {formatNumber(status.count)} SPK
                          <span
                            className={`badge ${status.badge} border-0 badge-sm ml-2 font-bold`}
                          >
                            {pct}%
                          </span>
                        </span>
                      </div>

                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`${status.color} h-full rounded-full transition-all duration-500`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-500">
                  Total pelanggan:{" "}
                  <strong className="text-pdam-navy">
                    {formatNumber(summary.total_pelanggan)}
                  </strong>
                  {" · "}WM dikirim:{" "}
                  <strong className="text-pdam-navy">
                    {formatNumber(summary.pengiriman_wm.total_wm_dikirim)}
                  </strong>
                  {" · "}Penggantian menunggu validasi:{" "}
                  <strong className="text-pdam-navy">
                    {formatNumber(summary.penggantian_wm.menunggu)}
                  </strong>
                </p>
              </div>
            </div>
          </div>

          {/* Statistik Progres Unit */}
          <div className="card bg-white border border-slate-200/90 shadow-xs p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold flex items-center gap-2 text-sm text-pdam-navy">
                    <Building2 className="w-4 h-4 text-pdam-primary" />
                    Statistik Progres Pergantian {branches.length} Unit Cabang
                    Aktif
                  </h3>
                  <span className="badge bg-pdam-primary/10 text-pdam-primary border-pdam-primary/20 text-[10px] font-bold">
                    {formatNumber(totalRealisasi)} Realisasi
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Progres berdasarkan jumlah penugasan selesai pada
                  masing-masing unit
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-pdam-primary inline-block" />
                  <span className="text-slate-700">Capaian &gt; 75%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-amber-400 inline-block" />
                  <span className="text-slate-700">
                    Capaian ≤ 75% / tanpa target
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {displayedBranches.map((branch) => {
                const pct = branch.persentase;
                const isHigh = pct !== null && pct > 75;
                const barWidth = Math.min(Math.max(pct ?? 0, 0), 100);

                return (
                  <div
                    key={branch.id_unit}
                    className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-colors space-y-2"
                  >
                    <div className="flex justify-between items-center text-xs gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-bold text-pdam-navy">
                          {branch.nama_unit}
                        </span>
                        <span className="badge bg-slate-100 text-slate-600 border-slate-200 badge-sm font-semibold">
                          Unit {branch.id_unit}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-extrabold text-pdam-navy">
                          {formatNumber(branch.realisasi)}
                          <span className="text-slate-400 font-normal">
                            {" "}
                            /{" "}
                            {branch.target === null
                              ? "—"
                              : formatNumber(branch.target)}{" "}
                            WM
                          </span>
                        </span>
                        <span
                          className={`badge font-bold border-0 ${
                            isHigh
                              ? "bg-pdam-primary text-white"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {pct === null ? "—" : `${pct}%`}
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isHigh ? "bg-pdam-primary" : "bg-amber-400"
                        }`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              {displayedBranches.length === 0 && (
                <p className="text-sm text-slate-500 py-4 text-center">
                  Tidak ada unit yang tersedia.
                </p>
              )}
            </div>

            {/* Footer Ringkasan Target */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3 bg-pdam-bg p-4 rounded-xl border">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Info className="w-4 h-4 text-pdam-primary shrink-0" />
                <span>
                  Akumulasi Target:{" "}
                  <strong className="text-pdam-navy">
                    {totalTarget === null
                      ? "Belum ditentukan"
                      : `${formatNumber(totalTarget)} WM`}
                  </strong>
                  {" | "}Total Realisasi:{" "}
                  <strong className="text-pdam-primary">
                    {formatNumber(totalRealisasi)} SPK
                    {totalPercentage === null ? "" : ` (${totalPercentage}%)`}
                  </strong>
                </span>
              </div>

              <div className="text-xs font-bold text-pdam-navy">
                Periode:{" "}
                <span className="text-pdam-primary">{summary.periode}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
