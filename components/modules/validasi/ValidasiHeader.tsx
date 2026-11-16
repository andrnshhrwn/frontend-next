"use client";

import { Download, Loader2, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/ui";

interface ValidasiHeaderProps {
  preparingExport: boolean;
  refreshing: boolean;
  loading: boolean;
  canManageValidation: boolean;
  authLoading: boolean;
  onExport: () => void;
  onRefresh: () => void;
}

export default function ValidasiHeader({
  preparingExport,
  refreshing,
  loading,
  canManageValidation,
  authLoading,
  onExport,
  onRefresh,
}: ValidasiHeaderProps) {
  return (
    <PageHeader
      title="Validasi BAP & Approval Final"
      subtitle={
        canManageValidation
          ? "Pemeriksaan bukti penggantian WM dan persetujuan final BAP dari teknisi lapangan."
          : "Pemantauan data BAP penggantian WM pada unit cabang Anda."
      }
      badge=""
      badgeVariant="primary"
    >
      <div className="flex flex-wrap items-center gap-2">
        {/* Tombol Export dengan min-width agar ukurannya stabil */}
        <button
          type="button"
          onClick={onExport}
          disabled={preparingExport || loading}
          className="btn btn-sm btn-ghost bg-white hover:bg-pdam-bg border border-slate-200 text-pdam-navy font-semibold normal-case shadow-xs min-w-32.5 justify-center"
        >
          {preparingExport ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Download className="w-3.5 h-3.5 text-pdam-primary" />
          )}
          <span>Export Data</span>
        </button>

        {/* Tombol Refresh dengan min-width agar ukurannya stabil */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="btn btn-sm btn-ghost bg-white hover:bg-pdam-bg border border-slate-200 text-pdam-navy font-semibold normal-case shadow-xs min-w-26.25 justify-center"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 text-pdam-primary ${
              refreshing ? "animate-spin" : ""
            }`}
          />
          <span>Refresh</span>
        </button>
      </div>
    </PageHeader>
  );
}
