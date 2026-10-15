'use client';

import { 
  Download, 
  UserPlus, 
  Search, 
  Info, 
  Filter, 
  Plus, 
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';

export default function PelangganPage() {
  // Mock data pelanggan sesuai desain Figma/screenshot
  const customers = [
    {
      id: 'PLG-089211',
      nama: 'Bambang Sugianto',
      alamat: 'Jl. Danau Toba No. 42 Blok D',
      cabang: 'Cabang Timur',
      tipeTarif: 'Gol. 2A - Rumah Tangga',
      wmNoSeri: 'WM-22-048910',
      wmStatus: 'Aktif',
      wmStatusBadge: 'badge-info',
      needsInput: false,
    },
    {
      id: 'PLG-002104',
      nama: 'H. Ridwan Mansyur',
      alamat: 'Jl. Kawi No. 18 RT 02/RW 04',
      cabang: 'Cabang Tirta Utama',
      tipeTarif: 'Gol. 2B - Rumah Tangga Mampu',
      wmNoSeri: null,
      wmStatus: 'Belum Ada WM',
      wmStatusBadge: 'badge-error',
      needsInput: true,
    },
    {
      id: 'PLG-055102',
      nama: 'Siti Rahmawati Putri',
      alamat: 'Jl. Simpang Borobudur Gang 4 No. 12',
      cabang: 'Cabang Utara',
      tipeTarif: 'Gol. 2A - Rumah Tangga',
      wmNoSeri: 'WM-18-091420',
      wmStatus: 'Perlu Ganti',
      wmStatusBadge: 'badge-warning',
      needsInput: false,
    },
    {
      id: 'PLG-091480',
      nama: 'CV. Sumber Makmur Abadi',
      alamat: 'Jl. Soekarno Hatta Ruko Kav. 8',
      cabang: 'Cabang Barat',
      tipeTarif: 'Gol. 3A - Niaga Kecil',
      wmNoSeri: 'WM-21-087221',
      wmStatus: 'Aktif',
      wmStatusBadge: 'badge-info',
      needsInput: false,
    },
    {
      id: 'PLG-014802',
      nama: 'Dra. Endang Purwanti',
      alamat: 'Jl. Ijen No. 74',
      cabang: 'Cabang Tirta Utama',
      tipeTarif: 'Gol. 2B - Rumah Tangga Mampu',
      wmNoSeri: null,
      wmStatus: 'Belum Ada WM',
      wmStatusBadge: 'badge-error',
      needsInput: true,
    },
    {
      id: 'PLG-003892',
      nama: 'Masjid Al-Ikhlas',
      alamat: 'Jl. Mayjen Sungkono No. 5',
      cabang: 'Cabang Timur',
      tipeTarif: 'Gol. 1B - Sosial Khusus',
      wmNoSeri: null,
      wmStatus: 'Belum Ada WM',
      wmStatusBadge: 'badge-error',
      needsInput: true,
    },
    {
      id: 'PLG-078199',
      nama: 'PT. Indo Pangan Lestari',
      alamat: 'Kawasan Industri Candi Blok A-12',
      cabang: 'Cabang Selatan',
      tipeTarif: 'Gol. Industri Khusus',
      wmNoSeri: 'WM-23-010492',
      wmStatus: 'Aktif',
      wmStatusBadge: 'badge-info',
      needsInput: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header Title */}
      <div>
        <p className="text-xs text-base-content/60 mb-1">
          PDAM Tirta / Operasional / <span className="text-primary font-semibold">Data Pelanggan</span>
        </p>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Manajemen Data Pelanggan</h1>
            <p className="text-xs text-base-content/60 mt-0.5">
              Pengelolaan data pelanggan dan pemetaan status water meter aktif (termasuk penanganan data legacy/pelanggan lama).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button className="btn btn-sm btn-outline bg-base-100 font-semibold normal-case">
              <Download className="w-4 h-4" />
              <span>Export Data Pelanggan</span>
            </button>
            <button className="btn btn-sm btn-primary text-white font-semibold normal-case">
              <UserPlus className="w-4 h-4" />
              <span>+ Tambah Pelanggan Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Kartu Statistik Atas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-base-100 border border-base-200 shadow-sm p-4">
          <p className="text-[10px] font-bold text-base-content/50 uppercase tracking-wider mb-1">TOTAL PELANGGAN</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black">4.820</span>
            <span className="text-xs font-bold text-base-content/60">SR</span>
          </div>
          <p className="text-[11px] text-base-content/60 mt-1">Tersebar di 5 Unit Wilayah Cabang</p>
        </div>

        <div className="card bg-base-100 border border-base-200 shadow-sm p-4">
          <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">WM AKTIF NORMAL</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-primary">4.120</span>
            <span className="text-xs font-bold text-primary">Unit</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="badge badge-primary badge-xs font-bold">85.4%</span>
            <span className="text-[11px] text-base-content/60">Terdata SN Lengkap & Terkalibrasi</span>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-200 shadow-sm p-4">
          <p className="text-[10px] font-bold text-info uppercase tracking-wider mb-1">LEGACY (TANPA WM)</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-info">480</span>
            <span className="text-xs font-bold text-info">SR</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="badge badge-info badge-xs font-bold">9.9%</span>
            <span className="text-[11px] text-base-content/60">Perlu Input / Pemetaan Fisik</span>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-200 shadow-sm p-4">
          <p className="text-[10px] font-bold text-error uppercase tracking-wider mb-1">USULAN PERGANTIAN</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-error">220</span>
            <span className="text-xs font-bold text-error">Unit</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="badge badge-error badge-xs font-bold">4.5%</span>
            <span className="text-[11px] text-base-content/60">Usia {'>'}5 Thn / Kerusakan Fisik</span>
          </div>
        </div>
      </div>

      {/* Banner Info Perhatian Data Legacy */}
      <div className="card bg-info/10 border border-info/30 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-info/20 text-info shrink-0 mt-0.5">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-info flex items-center gap-2">
              Perhatian: Ditemukan 480 Data Pelanggan Lama (Legacy) Belum Memiliki Nomor Seri WM Digital
              <span className="badge badge-info badge-xs font-semibold">Butuh Pemetaan</span>
            </h4>
            <p className="text-xs text-base-content/70 mt-1">
              Gunakan tombol cepat "Input WM Aktif" pada baris pelanggan untuk mendokumentasikan nomor seri meteran baru atau hasil verifikasi fisik lapangan secara langsung.
            </p>
          </div>
        </div>

        <button className="btn btn-sm btn-info text-white font-semibold normal-case shrink-0">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter Data Legacy Saja</span>
        </button>
      </div>

      {/* Filter & Bar Pencarian */}
      <div className="card bg-base-100 border border-base-200 shadow-sm p-5 space-y-4">
        {/* Filter Tab Atas */}
        <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-base-200">
          <button className="btn btn-sm btn-primary text-white font-medium normal-case">
            Semua Pelanggan <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] ml-1">4.820</span>
          </button>
          <button className="btn btn-sm btn-ghost bg-base-200/60 font-medium normal-case">
            WM Aktif <span className="text-base-content/50 ml-1">4.340</span>
          </button>
          <button className="btn btn-sm btn-ghost bg-base-200/60 font-medium normal-case">
            Legacy / Belum Ada WM <span className="text-base-content/50 ml-1">480</span>
          </button>
        </div>

        {/* Input Search & Filter Dropdown */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
          <input 
            type="text" 
            placeholder="Cari ID Pelanggan, Nama, SN WM..." 
            className="input input-bordered input-sm w-full pl-9 text-xs"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-base-content/60 uppercase">CABANG:</span>
              <select className="select select-bordered select-sm text-xs font-medium">
                <option>Semua Cabang (5 Unit)</option>
                <option>Cabang Tirta Utama</option>
                <option>Cabang Timur</option>
                <option>Cabang Barat</option>
                <option>Cabang Utara</option>
                <option>Cabang Selatan</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-base-content/60 uppercase">GOLONGAN:</span>
              <select className="select select-bordered select-sm text-xs font-medium">
                <option>Semua Tarif</option>
                <option>Gol. 1B - Sosial Khusus</option>
                <option>Gol. 2A - Rumah Tangga</option>
                <option>Gol. 2B - Rumah Tangga Mampu</option>
                <option>Gol. 3A - Niaga Kecil</option>
                <option>Gol. Industri Khusus</option>
              </select>
            </div>
          </div>

          <div className="text-xs text-base-content/60 flex items-center gap-1.5 self-end sm:self-auto">
            <span>Menampilkan 7 dari 4.820 pelanggan</span>
            <button className="btn btn-ghost btn-xs btn-square text-base-content/60 hover:text-base-content">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabel Data Pelanggan */}
      <div className="card bg-base-100 border border-base-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-sm w-full">
            <thead>
              <tr className="bg-base-200/50 text-base-content/60 text-[11px] uppercase tracking-wider">
                <th className="py-3.5 pl-5">ID & NAMA PELANGGAN</th>
                <th className="py-3.5">ALAMAT & UNIT</th>
                <th className="py-3.5">TIPE TARIF</th>
                <th className="py-3.5">WATER METER AKTIF</th>
                <th className="py-3.5 text-right pr-5">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-200 text-xs">
              {customers.map((item, index) => (
                <tr key={index} className="hover:bg-base-200/40 transition-colors">
                  <td className="py-3.5 pl-5">
                    <span className="font-bold text-base-content block">{item.nama}</span>
                    <span className="text-[10px] font-mono text-base-content/50">{item.id}</span>
                  </td>

                  <td className="py-3.5">
                    <span className="text-base-content/80 block">{item.alamat}</span>
                    <span className="font-bold text-[11px] text-base-content">{item.cabang}</span>
                  </td>

                  <td className="py-3.5">
                    <span className="font-medium text-base-content/80">{item.tipeTarif}</span>
                  </td>

                  <td className="py-3.5">
                    <div className="flex items-center gap-2">
                      {item.wmNoSeri ? (
                        <>
                          <span className="font-bold text-primary">{item.wmNoSeri}</span>
                          <span className={`badge badge-xs font-bold ${item.wmStatusBadge}`}>
                            {item.wmStatus}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="badge badge-error badge-xs font-bold">
                            Belum Ada WM
                          </span>
                          <button className="btn btn-xs btn-primary text-white font-semibold normal-case gap-1">
                            <Plus className="w-3 h-3" />
                            Input WM
                          </button>
                        </>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 text-right pr-5">
                    <div className="flex items-center justify-end gap-3">
                      <button className="text-primary font-semibold hover:underline">
                        Detail
                      </button>
                      <button className="text-base-content/60 font-semibold hover:underline hover:text-base-content">
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-4 border-t border-base-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-base-content/60">
          <span>Menampilkan 1 - 7 dari 4.820 total pelanggan terdaftar</span>

          <div className="join">
            <button className="join-item btn btn-sm btn-ghost btn-disabled">&lt; Sebelumnya</button>
            <button className="join-item btn btn-sm btn-active btn-primary text-white font-bold">1</button>
            <button className="join-item btn btn-sm btn-ghost">2</button>
            <button className="join-item btn btn-sm btn-ghost">3</button>
            <button className="join-item btn btn-sm btn-ghost">..</button>
            <button className="join-item btn btn-sm btn-ghost">482</button>
            <button className="join-item btn btn-sm btn-ghost">Selanjutnya &gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}