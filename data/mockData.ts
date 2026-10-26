import { PdamDashboardData } from '@/types/pdam';

export const mockPdamData: PdamDashboardData = {
  periode: 'Agustus 2026',
  totalWaterMeter: 1840,
  inventory: {
    gudang: { count: 420, percentage: 22.8 },
    terpasang: { count: 1285, percentage: 69.8 },
    rusak: { count: 135, percentage: 7.4 },
  },
  tickets: {
    total: 320,
    pending: { count: 21, percentage: 6.6 },
    inProgress: { count: 32, percentage: 10.0 },
    completed: { count: 267, percentage: 83.4 }, // Rekapitulasi 267 unit pergantian di bulan Agustus 2026
  },
  branches: [
    { id: '1', name: 'Unit Kuningan', code: 'CAB-KNG', sector: 'Wilayah Kota', current: 52, target: 60, percentage: 87 },
    { id: '2', name: 'Unit Cilimus', code: 'CAB-CLM', sector: 'Wilayah Utara I', current: 44, target: 50, percentage: 88 },
    { id: '3', name: 'Unit Cigugur', code: 'CAB-CGG', sector: 'Wilayah Barat I', current: 36, target: 40, percentage: 90 },
    { id: '4', name: 'Unit Ciawi', code: 'CAB-CAW', sector: 'Wilayah Utara II', current: 31, target: 38, percentage: 82 },
    { id: '5', name: 'Unit Luragung', code: 'CAB-LRG', sector: 'Wilayah Timur I', current: 28, target: 35, percentage: 80 },
    { id: '6', name: 'Unit Kadugede', code: 'CAB-KDG', sector: 'Wilayah Selatan', current: 25, target: 32, percentage: 78 },
    { id: '7', name: 'Unit Garawangi', code: 'CAB-GRW', sector: 'Wilayah Tengah', current: 21, target: 28, percentage: 75 },
    { id: '8', name: 'Unit Japara', code: 'CAB-JPR', sector: 'Wilayah Timur II', current: 16, target: 22, percentage: 73 },
    { id: '9', name: 'Unit Cidahu', code: 'CAB-CDH', sector: 'Wilayah Timur III', current: 14, target: 20, percentage: 70 },
  ],
  summaryInfo: {
    totalTarget: 325,
    totalRealization: 267,
    realizationPercentage: 82.2,
    deadline: '31 Agustus 2026',
    totalCabang: 9,
  },
};