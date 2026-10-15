'use client';

import { 
  Download, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  FileCheck, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpRight 
} from 'lucide-react';

export default function ValidasiPage() {
  // Mock data Verifikasi Hasil Lapangan / BAP
  const bapData = [
    {
      idTiket: 'TICK-TMR-2026-101',
      tanggal: 'Hari ini, 10:45',
      bapNo: 'BAP #24',
      pelanggan: 'Bambang Sugianto',
      plgId: 'PLG-089211',
      alamat: 'Jl. Rungkut Asri Timur No. 42 • DMA-RKT-04',
      teknisi: 'Rudi Hermawan',
      meterLama: 'WM-19-004812 (1.482 m³)',
      meterBaru: 'WM-24-009185 (0 m³ • DN15)',
      status: 'Menunggu',
      statusType: 'badge-info',
      statusDesc: 'Perlu Tinjauan Segera',
    },
    {
      idTiket: 'TICK-TMR-2026-099',
      tanggal: 'Hari ini, 09:15',
      bapNo: 'BAP #23',
      pelanggan: 'Siti Aminah',
      plgId: 'PLG-081042',
      alamat: 'Komplek Pandugo 2 Blok C-18 • DMA-PDG-01',
      teknisi: 'Dwi Anggoro',
      meterLama: 'WM-18-002194 (3.819 m³)',
      meterBaru: 'WM-24-009180 (0 m³ • DN15)',
      status: 'Disetujui',
      statusType: 'badge-success',
      statusDesc: 'BAP Diterbitkan & Sinkron',
    },
    {
      idTiket: 'TICK-TMR-2026-094',
      tanggal: 'Hari ini, 08:30',
      bapNo: 'BAP #22',
      pelanggan: 'Hj. Maryam Fauzi',
      plgId: 'PLG-076534',
      alamat: 'Jl. Medokan Asri Utara III/12 • DMA-MDK-02',
      teknisi: 'Rudi Hermawan',
      meterLama: 'WM-17-009941 (5.201 m³)',
      meterBaru: 'WM-24-009172 (Stand Buram • DN15)',
      isBaruError: true,
      status: 'Ditolak',
      statusType: 'badge-error',
      statusDesc: 'Foto Buram / Deviasi Stand',
    },
    {
      idTiket: 'TICK-TMR-2026-088',
      tanggal: 'Kemarin, 16:20',
      bapNo: 'BAP #21',
      pelanggan: 'PT. Surya Inti Abadi',
      plgId: 'PLG-012900',
      alamat: 'SIER Blok M-5 • DMA-IND-01',
      teknisi: 'Ilham Santoso',
      meterLama: 'WM-16-000843 (12.430 m³)',
      meterBaru: 'WM-24-009165 (0 m³ • DN25)',
      status: 'Menunggu',
      statusType: 'badge-info',
      statusDesc: 'Perlu Tinjauan Segera',
    },
    {
      idTiket: 'TICK-TMR-2026-085',
      tanggal: 'Kemarin, 14:10',
      bapNo: 'BAP #20',
      pelanggan: 'Kurniawan Tejo',
      plgId: 'PLG-064891',
      alamat: 'Jl. Tenggilis Mejoyo Slt VII/5 • DMA-TNG-03',
      teknisi: 'Dwi Anggoro',
      meterLama: 'WM-19-001099 (2.118 m³)',
      meterBaru: 'WM-24-009158 (0 m³ • DN15)',
      status: 'Disetujui',
      statusType: 'badge-success',
      statusDesc: 'BAP Diterbitkan & Sinkron',
    },
    {
      idTiket: 'TICK-TMR-2026-081',
      tanggal: 'Kemarin, 11:05',
      bapNo: 'BAP #19',
      pelanggan: 'Dewi Anggraini',
      plgId: 'PLG-059914',
      alamat: 'Jl. Semampir Barat Gg II/8 • DMA-SMP-01',
      teknisi: 'Ilham Santoso',
      meterLama: 'WM-19-003310 (1.890 m³)',
      meterBaru: 'WM-24-009151 (0 m³ • DN15)',
      status: 'Menunggu',
      statusType: 'badge-info',
      statusDesc: 'Perlu Tinjauan Segera',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header Title */}
      <div>
        <p className="text-xs text-base-content/60 mb-1">
          PDAM Tirta / Unit Penggantian / <span className="text-primary font-semibold">Verifikasi Hasil Lapangan</span>
        </p>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Verifikasi Hasil Lapangan</h1>
            <p className="text-xs text-base-content/60 mt-0.5">
              Pemeriksaan dan validasi Berita Acara Penggantian (BAP), foto fisik, dan kesesuaian stand meter baru dari teknisi lapangan.
            </p>
          </div>

          <button className="btn btn-sm btn-outline bg-base-100 font-semibold normal-case">
            <Download className="w-4 h-4" />
            <span>Export Rekap Verifikasi</span>
          </button>
        </div>
      </div>

      {/* 4 Kartu Status Berkas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-base-100 border border-base-200 shadow-sm p-4 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-base-content/50 uppercase tracking-wider mb-1">Menunggu Verifikasi</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black">28</span>
                <span className="text-xs text-base-content/60 font-medium">Berkas</span>
              </div>
              <span className="badge badge-info badge-xs font-semibold mt-2">
                • Perlu Tinjauan Segera
              </span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-info/10 flex items-center justify-center text-info">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-200 shadow-sm p-4 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-success uppercase tracking-wider mb-1">Disetujui Hari Ini</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-success">64</span>
                <span className="text-xs text-success font-medium">Berkas</span>
              </div>
              <span className="badge badge-success badge-xs font-semibold mt-2 text-white">
                ✓ BAP Diterbitkan & Sinkron
              </span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center text-success">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-200 shadow-sm p-4 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-error uppercase tracking-wider mb-1">Ditolak / Revisi</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-error">5</span>
                <span className="text-xs text-error font-medium">Berkas</span>
              </div>
              <span className="badge badge-error badge-xs font-semibold mt-2 text-white">
                ⚠️ Foto Buram / Deviasi Stand
              </span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-error/10 flex items-center justify-center text-error">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-200 shadow-sm p-4 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-base-content/50 uppercase tracking-wider mb-1">Total Berkas Masuk</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black">97</span>
                <span className="text-xs text-base-content/60 font-medium">SPK</span>
              </div>
              <span className="text-[11px] text-primary font-bold mt-2 block">
                📈 Efisiensi Verifikasi 94.8%
              </span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Bar Pencarian */}
      <div className="card bg-base-100 border border-base-200 shadow-sm p-5 space-y-4">
        {/* Tab Status */}
        <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-base-200">
          <button className="btn btn-sm btn-primary text-white font-medium normal-case">
            Semua (97)
          </button>
          <button className="btn btn-sm btn-ghost bg-base-200/60 font-medium normal-case">
            Menunggu Verifikasi (28)
          </button>
          <button className="btn btn-sm btn-ghost bg-base-200/60 font-medium normal-case">
            Disetujui (64)
          </button>
          <button className="btn btn-sm btn-ghost bg-base-200/60 font-medium normal-case">
            Ditolak / Revisi (5)
          </button>
        </div>

        {/* Dropdown Cabang & Input Search */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <select className="select select-bordered select-sm w-full text-xs font-semibold">
              <option>🏢 Cabang Wilayah Timur</option>
              <option>Cabang Tirta Utama</option>
              <option>Cabang Wilayah Barat</option>
              <option>Cabang Wilayah Utara</option>
              <option>Cabang Wilayah Selatan</option>
            </select>
          </div>

          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
            <input 
              type="text" 
              placeholder="Cari ID tiket, pelanggan, SN WM, teknisi..." 
              className="input input-bordered input-sm w-full pl-9 text-xs"
            />
          </div>

          <div>
            <button className="btn btn-sm btn-outline btn-block font-semibold normal-case text-xs">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter Lanjutan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabel Verifikasi Hasil Lapangan */}
      <div className="card bg-base-100 border border-base-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-sm w-full">
            <thead>
              <tr className="bg-base-200/50 text-base-content/60 text-[11px] uppercase tracking-wider">
                <th className="py-3.5 pl-5">ID TIKET & TANGGAL</th>
                <th className="py-3.5">PELANGGAN & ALAMAT</th>
                <th className="py-3.5">TEKNISI</th>
                <th className="py-3.5">METER LAMA → BARU</th>
                <th className="py-3.5">STATUS</th>
                <th className="py-3.5 text-right pr-5">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-200 text-xs">
              {bapData.map((item, index) => (
                <tr key={index} className="hover:bg-base-200/40 transition-colors">
                  <td className="py-3.5 pl-5 font-bold">
                    <span className="text-primary block">{item.idTiket}</span>
                    <span className="text-[10px] text-base-content/50 font-normal">
                      {item.tanggal} • <strong className="text-base-content">{item.bapNo}</strong>
                    </span>
                  </td>

                  <td className="py-3.5">
                    <span className="font-bold text-base-content block">
                      {item.pelanggan} <span className="font-normal text-[10px] text-base-content/50">({item.plgId})</span>
                    </span>
                    <span className="text-[10px] text-base-content/60">{item.alamat}</span>
                  </td>

                  <td className="py-3.5">
                    <span className="font-medium text-base-content/80">{item.teknisi}</span>
                  </td>

                  <td className="py-3.5">
                    <div className="flex flex-col text-[11px]">
                      <span className="text-base-content/60">{item.meterLama}</span>
                      <div className="flex items-center gap-1 font-bold">
                        <ArrowRight className="w-3 h-3 text-primary shrink-0" />
                        <span className={item.isBaruError ? 'text-error' : 'text-primary'}>
                          {item.meterBaru}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5">
                    <span className={`badge badge-sm font-bold ${item.statusType}`}>
                      • {item.status}
                    </span>
                  </td>

                  <td className="py-3.5 text-right pr-5">
                    <button className="btn btn-xs btn-outline btn-primary font-semibold normal-case gap-0.5 ml-auto">
                      Periksa <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-4 border-t border-base-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-base-content/60">
          <div className="flex items-center gap-2">
            <span>Menampilkan 1 - 6 dari 97</span>
            <span>• Baris:</span>
            <select className="select select-bordered select-xs w-16">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
          </div>

          <div className="join">
            <button className="join-item btn btn-sm btn-ghost btn-disabled">Prev</button>
            <button className="join-item btn btn-sm btn-active btn-primary text-white font-bold">1</button>
            <button className="join-item btn btn-sm btn-ghost">2</button>
            <button className="join-item btn btn-sm btn-ghost">3</button>
            <button className="join-item btn btn-sm btn-ghost">..</button>
            <button className="join-item btn btn-sm btn-ghost">17</button>
            <button className="join-item btn btn-sm btn-ghost">Next</button>
          </div>
        </div>
      </div>

      {/* Legenda Keterangan Status */}
      <div className="pt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center text-[11px] text-base-content/60 border-t border-base-200 gap-2">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-bold uppercase tracking-wider text-base-content/80">KETERANGAN STATUS:</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-info inline-block"></span> Menunggu Validasi Admin
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-success inline-block"></span> Selesai & BAP Telah Diterbitkan
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-error inline-block"></span> Dikembalikan ke Teknisi Lapangan
          </span>
        </div>

        <div className="font-mono text-[10px] text-base-content/40">
          PDAM Tirta Audit Engine v2.4
        </div>
      </div>
    </div>
  );
}