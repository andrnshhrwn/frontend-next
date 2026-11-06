"use client";

import { Download, Plus, RotateCcw } from "lucide-react";

interface PenugasanHeaderProps {
  isAdminPusat: boolean;
  isAdminCabang: boolean;
  unitName: string;
  refreshing: boolean;
  onExport: () => void;
  onRefresh: () => void;
  onCreate: () => void;
}

export default function PenugasanHeader({
  isAdminPusat,
  isAdminCabang,
  unitName,
  refreshing,
  onExport,
  onRefresh,
  onCreate,
}: PenugasanHeaderProps) {
  return (
    <div>
      <p className="text-xs text-slate-500 mb-1">
        <span className="font-semibold text-pdam-primary">
          PAM Tirta Kamuning
        </span>{" "}
        / Operasional /{" "}
        <span className="text-pdam-primary font-semibold">
          Penugasan Berjenjang
        </span>
      </p>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-pdam-navy">
              Manajemen Penugasan SPK
            </h1>

            <span className="badge bg-pdam-primary/10 text-pdam-primary border-pdam-primary/20 text-[10px] font-bold">
              {isAdminPusat ? "Monitoring Pusat" : unitName}
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-0.5">
            {isAdminPusat
              ? "Monitoring seluruh penugasan dari unit cabang."
              : "Kelola penugasan pelanggan dan penetapan teknisi pada unit Anda."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExport}
            className="btn btn-sm btn-ghost bg-white hover:bg-pdam-bg border border-slate-200 text-pdam-navy font-semibold normal-case shadow-xs"
          >
            <Download className="w-4 h-4 text-pdam-primary" />
            <span>Export Data (CSV)</span>
          </button>

          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="btn btn-sm btn-ghost bg-white hover:bg-pdam-bg border border-slate-200 text-pdam-navy font-semibold normal-case shadow-xs"
          >
            <RotateCcw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>

          {isAdminCabang && (
            <button
              onClick={onCreate}
              className="btn btn-sm bg-pdam-primary hover:bg-pdam-navy text-white font-semibold normal-case border-0 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Penugasan</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
