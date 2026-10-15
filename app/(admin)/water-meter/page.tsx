'use client';

import { 
  Download, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpRight 
} from 'lucide-react';

export default function WaterMeterPage() {
  // Mock data water meter sesuai desain
  const waterMeters = [
    { noSeri: 'WM-24-009182', tera: 'Tera Sah 2024', merk: 'Itron Aquadis+', dn: 'DN 15 (1/2")', status: 'Tersedia', statusType: 'badge-primary', lokasi: 'Gudang Unit Timur', detail: 'Rak A-04' },
    { noSeri: 'WM-22-048910', tera: 'Tera Sah 2022', merk: 'Linflow Multijet', dn: 'DN 15 (1/2")', status: 'Terpasang', statusType: 'badge-info', lokasi: 'Bambang Setyawan', detail: 'PLG-089211 • Jl. Rungkut Madya' },
    { noSeri: 'WM-19-031209', tera: 'Tera 2019', merk: 'Bar-Meters Precision', dn: 'DN 20 (3/4")', status: 'Rusak', statusType: 'badge-error', lokasi: 'Gudang Karantina', detail: 'Eks: CV. Surya Teknik' },
    { noSeri: 'WM-23-019943', tera: 'Tera Sah 2023', merk: 'Onda Brass Core', dn: 'DN 15 (1/2")', status: 'Terpasang', statusType: 'badge-info', lokasi: 'Dewi Anggraini', detail: 'PLG-067140 • Griya Asri Blok D' },
    { noSeri: 'WM-24-009183', tera: 'Tera Sah 2024', merk: 'Actaris Metron Cyble', dn: 'DN 25 (1")', status: 'Tersedia', statusType: 'badge-primary', lokasi: 'Gudang Unit Timur', detail: 'Rak B-01' },
    { noSeri: 'WM-21-077124', tera: 'Tera Sah 2021', merk: 'Ningbo LXSG', dn: 'DN 15 (1/2")', status: 'Terpasang', statusType: 'badge-info', lokasi: 'H. Ahmad Fauzi', detail: 'PLG-031902 • Jl. Semampir Barat' },
    { noSeri: 'WM-24-009184', tera: 'Tera Sah 2024', merk: 'Itron Flostar M', dn: 'DN 20 (3/4")', status: 'Tersedia', statusType: 'badge-primary', lokasi: 'Gudang Unit Timur', detail: 'Rak A-07' },
    { noSeri: 'WM-20-055102', tera: 'Tera 2020', merk: 'Linflow Classic', dn: 'DN 15 (1/2")', status: 'Rusak', statusType: 'badge-error', lokasi: 'Gudang Karantina', detail: 'Eks: Agus Supriyono' },
    { noSeri: 'WM-23-019944', tera: 'Tera Sah 2023', merk: 'Onda Brass Core', dn: 'DN 15 (1/2")', status: 'Terpasang', statusType: 'badge-info', lokasi: 'Siti Nurhaliza', detail: 'PLG-077192 • Jl. Dharmahusada Indah' },
    { noSeri: 'WM-24-009185', tera: 'Tera Sah 2024', merk: 'Itron Aquadis+', dn: 'DN 15 (1/2")', status: 'Tersedia', statusType: 'badge-primary', lokasi: 'Gudang Unit Timur', detail: 'Rak A-05' },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header Title */}
      <div>
        <p className="text-xs text-base-content/60 mb-1">
          PDAM Tirta / Operasional / <span className="text-primary font-semibold">Inventori Stok</span>
        </p>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Inventori & Monitoring Water Meter</h1>
            <p className="text-xs text-base-content/60 mt-0.5">
              Pemantauan status fisik dan riwayat lokasi nomor seri water meter.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button className="btn btn-sm btn-outline bg-base-100 font-semibold normal-case">
              <Download className="w-4 h-4" />
              <span>Export Data (CSV/Excel)</span>
            </button>
            <button className="btn btn-sm btn-primary text-white font-semibold normal-case">
              <Plus className="w-4 h-4" />
              <span>Registrasi SN Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Kartu Statistik Atas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-base-100 border border-base-200 shadow-sm p-4">
          <p className="text-[10px] font-bold text-base-content/50 uppercase tracking-wider mb-1">Total Unit Terdata</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black">1.250</span>
            <span className="text-[11px] text-base-content/60">Unit Fisik</span>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-200 shadow-sm p-4">
          <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Tersedia di Cabang</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-primary">320</span>
            <span className="text-[11px] text-primary font-medium">Siap Pasang</span>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-200 shadow-sm p-4">
          <p className="text-[10px] font-bold text-info uppercase tracking-wider mb-1">Terpasang Aktif</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-info">810</span>
            <span className="text-[11px] text-info font-medium">Pelanggan Aktif</span>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-200 shadow-sm p-4">
          <p className="text-[10px] font-bold text-error uppercase tracking-wider mb-1">Rusak / Afkir / Tarik</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-error">120</span>
            <span className="text-[11px] text-error font-medium">Perlu Tindakan</span>
          </div>
        </div>
      </div>

      {/* Filter & Bar Pencarian */}
      <div className="card bg-base-100 border border-base-200 shadow-sm p-5 space-y-4">
        {/* Tombol Filter Status */}
        <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-base-200">
          <button className="btn btn-sm btn-primary text-white font-medium normal-case">
            Semua Unit <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] ml-1">1.250</span>
          </button>
          <button className="btn btn-sm btn-ghost bg-base-200/60 font-medium normal-case">
            Tersedia di Gudang <span className="text-base-content/50 ml-1">320</span>
          </button>
          <button className="btn btn-sm btn-ghost bg-base-200/60 font-medium normal-case">
            Terpasang Aktif <span className="text-base-content/50 ml-1">810</span>
          </button>
          <button className="btn btn-sm btn-ghost bg-base-200/60 font-medium normal-case">
            Rusak / Tarik <span className="text-base-content/50 ml-1">120</span>
          </button>
        </div>

        {/* Filter Input Pencarian & Dropdown */}
        <div className="flex items-center justify-between text-xs text-base-content/70">
          <span>Filter Aktif: <strong>Semua Merk, Semua Ukuran</strong> <a href="#" className="text-primary underline ml-1">Reset Filter</a></span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
            <input 
              type="text" 
              placeholder="Cari Nomor Seri (SN), ID Pelanggan, atau Nama..." 
              className="input input-bordered input-sm w-full pl-9 text-xs"
            />
          </div>

          <div>
            <select className="select select-bordered select-sm w-full text-xs">
              <option>Semua Merk Water Meter</option>
              <option>Itron Aquadis+</option>
              <option>Linflow Multijet</option>
              <option>Onda Brass Core</option>
            </select>
          </div>

          <div>
            <select className="select select-bordered select-sm w-full text-xs">
              <option>Semua Ukuran (DN)</option>
              <option>DN 15 (1/2")</option>
              <option>DN 20 (3/4")</option>
              <option>DN 25 (1")</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabel Data Water Meter */}
      <div className="card bg-base-100 border border-base-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-sm w-full">
            <thead>
              <tr className="bg-base-200/50 text-base-content/60 text-[11px] uppercase tracking-wider">
                <th className="py-3.5 pl-5">No. Seri (SN)</th>
                <th className="py-3.5">Merk & Ukuran</th>
                <th className="py-3.5">Status</th>
                <th className="py-3.5">Lokasi / Pelanggan</th>
                <th className="py-3.5 text-right pr-5">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-200 text-xs">
              {waterMeters.map((item, index) => (
                <tr key={index} className="hover:bg-base-200/40 transition-colors">
                  <td className="py-3.5 pl-5 font-bold">
                    <span className="text-primary block">{item.noSeri}</span>
                    <span className="text-[10px] text-base-content/50 font-normal">{item.tera}</span>
                  </td>
                  <td className="py-3.5">
                    <span className="font-semibold block">{item.merk}</span>
                    <span className="text-[10px] text-base-content/50">{item.dn}</span>
                  </td>
                  <td className="py-3.5">
                    <span className={`badge badge-sm font-bold ${item.statusType}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span className="font-semibold block">{item.lokasi}</span>
                    <span className="text-[10px] text-base-content/50">{item.detail}</span>
                  </td>
                  <td className="py-3.5 text-right pr-5">
                    <button className="text-primary font-semibold hover:underline flex items-center justify-end gap-0.5 ml-auto">
                      Detail <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-4 border-t border-base-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-base-content/60">
          <span>Menampilkan 1 - 10 dari 1.250 unit water meter • <strong>Halaman 1 dari 125</strong></span>

          <div className="join">
            <button className="join-item btn btn-sm btn-disabled"><ChevronLeft className="w-4 h-4" /></button>
            <button className="join-item btn btn-sm btn-active btn-primary text-white font-bold">1</button>
            <button className="join-item btn btn-sm btn-ghost">2</button>
            <button className="join-item btn btn-sm btn-ghost">3</button>
            <button className="join-item btn btn-sm btn-ghost">...</button>
            <button className="join-item btn btn-sm btn-ghost">125</button>
            <button className="join-item btn btn-sm btn-ghost"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}