"use client";

import { Download, Loader2, RefreshCw } from "lucide-react";

interface ValidasiHeaderProps {
  preparingExport: boolean;
  refreshing: boolean;
  loading: boolean;
  onExport: () => void;
  onRefresh: () => void;
}

export default function ValidasiHeader({
  preparingExport,
  refreshing,
  loading,
  onExport,
  onRefresh,
}: ValidasiHeaderProps) {
  return (
    <div>
      <p className="text-xs text-slate-500 mb-1">
        <span className="font-semibold text-pdam-primary">
          PAM Tirta Kamuning
        </span>{" "}
        / Validasi /{" "}
        <span className="text-pdam-primary font-semibold">
          Validasi BAP Penggantian
        </span>
      </p>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-extrabold tracking-tight text-pdam-navy">
              Validasi BAP &amp; Approval Final
            </h1>

            <span className="badge bg-pdam-primary/10 text-pdam-primary border-pdam-primary/20 text-[10px] font-bold">
              Wewenang Admin Pusat
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-1">
            Pemeriksaan bukti penggantian WM dan persetujuan final BAP dari
            teknisi lapangan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onExport}
            disabled={preparingExport || loading}
            className="btn btn-sm btn-outline border-pdam-primary text-pdam-primary hover:bg-pdam-primary hover:text-white normal-case"
          >
            {preparingExport ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}

            {preparingExport ? "Menyiapkan..." : "Ekspor CSV"}
          </button>

          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            className="btn btn-sm btn-ghost text-xs normal-case text-slate-500"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
            />

            {refreshing ? "Memuat..." : "Refresh data"}
          </button>
        </div>
      </div>
    </div>
  );
}
