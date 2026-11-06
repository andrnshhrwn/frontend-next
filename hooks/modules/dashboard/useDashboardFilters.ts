"use client";

import { useState } from "react";

export function useDashboardFilters() {
  const [selectedPeriod, setSelectedPeriod] = useState(() => {
    const now = new Date();

    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const [selectedBranch, setSelectedBranch] = useState("all");

  return {
    selectedPeriod,
    setSelectedPeriod,
    selectedBranch,
    setSelectedBranch,
  };
}
