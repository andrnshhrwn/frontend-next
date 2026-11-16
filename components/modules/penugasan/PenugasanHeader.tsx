"use client";

import { PageHeader } from "@/components/ui";
import { Download, Plus, RefreshCw} from "lucide-react";

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
    <div className="w-full">
      <PageHeader
        title="Manajemen Penugasan SPK"
        subtitle={
          isAdminPusat
            ? "Monitoring seluruh penugasan dari unit cabang."
            : "Kelola penugasan pelanggan dan penetapan teknisi pada unit Anda."
        }
        badge=""
        badgeVariant="primary"
      >
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onExport}
            className="btn btn-sm btn-ghost bg-white hover:bg-pdam-bg border border-slate-200 text-pdam-navy font-semibold normal-case shadow-xs"
          >
            <Download className="w-4 h-4 text-pdam-primary" />
            <span>Export Data</span>
          </button>

          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            className="btn btn-sm btn-ghost bg-white hover:bg-pdam-bg border border-slate-200 text-pdam-navy font-semibold normal-case shadow-xs"
          >
            <RefreshCw
              className={`w-4 h-4 text-pdam-primary ${refreshing ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>

          {isAdminCabang && (
            <button
              type="button"
              onClick={onCreate}
              className="btn btn-sm bg-pdam-primary hover:bg-pdam-navy text-white font-semibold normal-case border-0 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Penugasan</span>
            </button>
          )}
        </div>
      </PageHeader>
    </div>
  );
}
