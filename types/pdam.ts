export interface BranchProgress {
  id: string;
  name: string;
  sector: string;
  current: number;
  target: number;
  percentage: number;
}

export interface PdamDashboardData {
  totalWaterMeter: number;
  inventory: {
    gudang: { count: number; percentage: number };
    terpasang: { count: number; percentage: number };
    rusak: { count: number; percentage: number };
  };
  tickets: {
    total: number;
    pending: { count: number; percentage: number };
    inProgress: { count: number; percentage: number };
    completed: { count: number; percentage: number };
  };
  branches: BranchProgress[];
  summaryInfo: {
    totalTarget: number;
    totalRealization: number;
    realizationPercentage: number;
    deadline: string;
  };
}