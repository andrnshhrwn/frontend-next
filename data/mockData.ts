import { PdamDashboardData } from '@/types/pdam';

export const mockPdamData: PdamDashboardData = {
  totalWaterMeter: 1250,
  inventory: {
    gudang: { count: 320, percentage: 25.6 },
    terpasang: { count: 810, percentage: 64.8 },
    rusak: { count: 120, percentage: 9.6 },
  },
  tickets: {
    total: 450,
    pending: { count: 75, percentage: 16.7 },
    inProgress: { count: 195, percentage: 43.3 },
    completed: { count: 180, percentage: 40.0 },
  },
  branches: [
    { id: '1', name: 'Cabang Wilayah Utara', sector: 'Sektor A-1', current: 696, target: 800, percentage: 87 },
    { id: '2', name: 'Cabang Wilayah Timur', sector: 'Sektor B-4', current: 912, target: 1200, percentage: 76 },
    { id: '3', name: 'Cabang Wilayah Barat', sector: 'Sektor C-2', current: 442, target: 650, percentage: 68 },
    { id: '4', name: 'Cabang Wilayah Selatan', sector: 'Sektor D-1', current: 540, target: 900, percentage: 60 },
    { id: '5', name: 'Cabang Wilayah Pusat', sector: 'Sektor E-3', current: 572, target: 1100, percentage: 52 },
  ],
  summaryInfo: {
    totalTarget: 4650,
    totalRealization: 3162,
    realizationPercentage: 68.0,
    deadline: '30 Juni 2024',
  },
};