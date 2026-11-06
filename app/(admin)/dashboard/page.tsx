"use client";

import { useMemo } from "react";
import { RefreshCw } from "lucide-react";

import {
  DashboardBranchProgress,
  DashboardSummaryCards,
  DashboardHeader,
  DashboardInventory,
  DashboardStatusSection,
} from "@/components/modules/dashboard";

import { useDashboardFilters } from "@/hooks/modules/dashboard/useDashboardFilters";
import { useDashboardData } from "@/hooks/modules/dashboard/useDashboardData";

export default function DashboardPage() {
  const {
    selectedPeriod,
    setSelectedPeriod,
    selectedBranch,
    setSelectedBranch,
  } = useDashboardFilters();

  const {
    summary,
    branches,
    availableBranches,
    isLoading,
    error,
    handleRetry,
  } = useDashboardData(selectedPeriod, selectedBranch);

  const currentBranchName =
    selectedBranch === "all"
      ? `Semua ${availableBranches.length} Unit`
      : (availableBranches.find((branch) => branch.id_unit === selectedBranch)
          ?.nama_unit ?? "Unit Cabang");

  const totalRealisasi = useMemo(
    () => branches.reduce((sum, branch) => sum + branch.realisasi, 0),
    [branches],
  );

  return (
    <div className="space-y-5">
      <DashboardHeader
        selectedPeriod={selectedPeriod}
        selectedBranch={selectedBranch}
        currentBranchName={currentBranchName}
        availableBranches={availableBranches}
        onPeriodChange={setSelectedPeriod}
        onBranchChange={setSelectedBranch}
      />

      {error && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>

          <button
            type="button"
            onClick={handleRetry}
            className="font-semibold underline underline-offset-2"
          >
            Coba lagi
          </button>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center gap-3 border border-slate-200 bg-white px-4 py-5 text-sm text-slate-500">
          <RefreshCw className="h-4 w-4 animate-spin" />
          Memuat rekapitulasi dashboard...
        </div>
      )}

      {!isLoading && !error && summary && (
        <>
          <DashboardSummaryCards
            summary={summary}
            selectedPeriod={selectedPeriod}
          />

          <DashboardStatusSection
            spk={summary.spk}
            bap={summary.penggantian_wm}
            selectedPeriod={selectedPeriod}
          />

          <DashboardInventory
            inventory={summary.inventori}
            selectedPeriod={selectedPeriod}
          />

          <DashboardBranchProgress
            branches={branches}
            totalRealisasi={totalRealisasi}
            selectedPeriod={selectedPeriod}
          />
        </>
      )}
    </div>
  );
}
