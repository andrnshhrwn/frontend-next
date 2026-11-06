import type {
  DashboardSummary,
  UnitBranchProgress,
} from "@/services/dashboardService";

export interface DashboardHeaderProps {
  selectedPeriod: string;
  selectedBranch: string;
  currentBranchName: string;
  availableBranches: UnitBranchProgress[];
  onPeriodChange: (period: string) => void;
  onBranchChange: (branchId: string) => void;
}

export interface DashboardSummaryCardsProps {
  summary: DashboardSummary;
  selectedPeriod: string;
}

export interface DashboardStatusSectionProps {
  spk: DashboardSummary["spk"];
  bap: DashboardSummary["penggantian_wm"];
  selectedPeriod: string;
}

export interface DashboardInventoryProps {
  inventory: DashboardSummary["inventori"];
  selectedPeriod: string;
}

export interface DashboardBranchProgressProps {
  branches: UnitBranchProgress[];
  totalRealisasi: number;
  selectedPeriod: string;
}
