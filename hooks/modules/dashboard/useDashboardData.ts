"use client";

import { useCallback, useEffect, useState } from "react";

import {
  dashboardService,
  type DashboardSummary,
  type UnitBranchProgress,
} from "@/services/dashboardService";

export function useDashboardData(
  selectedPeriod: string,
  selectedBranch: string,
) {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [branches, setBranches] = useState<UnitBranchProgress[]>([]);
  const [availableBranches, setAvailableBranches] = useState<
    UnitBranchProgress[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Mengambil daftar unit untuk filter.
  useEffect(() => {
    let active = true;

    async function loadAvailableBranches() {
      try {
        const response = await dashboardService.getUnitProgress({
          periode: selectedPeriod,
        });

        if (!active || response.status !== "success") return;

        setAvailableBranches(response.data);
      } catch {
        // Error daftar filter tidak menggantikan error utama dashboard.
      }
    }

    loadAvailableBranches();

    return () => {
      active = false;
    };
  }, [selectedPeriod]);

  // Mengambil ringkasan dan progres sesuai filter.
  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        setIsLoading(true);
        setError("");

        const params = {
          periode: selectedPeriod,
          ...(selectedBranch !== "all" ? { id_unit: selectedBranch } : {}),
        };

        const [summaryResponse, progressResponse] = await Promise.all([
          dashboardService.getSummary(params),
          dashboardService.getUnitProgress(params),
        ]);

        if (!active) return;

        if (
          summaryResponse.status !== "success" ||
          progressResponse.status !== "success"
        ) {
          throw new Error("Gagal mengambil data dashboard.");
        }

        setSummary(summaryResponse.data);
        setBranches(progressResponse.data);
      } catch (err) {
        if (!active) return;

        setError(
          err instanceof Error
            ? err.message
            : "Gagal mengambil data dashboard.",
        );

        setSummary(null);
        setBranches([]);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, [selectedPeriod, selectedBranch, refreshKey]);

  const handleRetry = useCallback(() => {
    setRefreshKey((current) => current + 1);
  }, []);

  return {
    summary,
    branches,
    availableBranches,
    isLoading,
    error,
    handleRetry,
  };
}
