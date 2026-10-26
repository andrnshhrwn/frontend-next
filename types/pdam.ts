export type UnitCabang = 
  | 'Kuningan' 
  | 'Cilimus' 
  | 'Cigugur' 
  | 'Ciawi' 
  | 'Luragung' 
  | 'Kadugede' 
  | 'Garawangi' 
  | 'Japara' 
  | 'Cidahu';

export type WaterMeterStatus = 'tersedia_di_unit' | 'terpasang' | 'rusak' | 'tarik';
export type PenugasanStatus = 'pending' | 'proses' | 'selesai' | 'dibatalkan';
export type KondisiFisikWMLama = 'normal' | 'macet' | 'kaca_pecah' | 'berembun_parah' | 'bodi_korosi';
export type UserRole = 'admin_pusat' | 'admin_cabang' | 'teknisi';

export interface BranchProgress {
  id: string;
  name: string;
  sector: string;
  code: string;
  current: number;
  target: number;
  percentage: number;
}

export interface PdamDashboardData {
  periode: string;
  totalWaterMeter: number;
  inventory: {
    gudang: { count: number; percentage: number }; // tersedia_di_unit
    terpasang: { count: number; percentage: number };
    rusak: { count: number; percentage: number }; // rusak / tarik
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
    totalCabang: number;
  };
}