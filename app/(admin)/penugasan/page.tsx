'use client';

import { 
  Download, 
  Plus, 
  Search, 
  Building2, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpRight, 
  RotateCcw,
  CheckCircle2,
  Clock,
  Activity
} from 'lucide-react';

export default function PenugasanPusatPage() {
  // Mock data Surat Perintah Kerja (SPK) sesuai desain
  const tickets = [
    { 
      id: 'TICK-1042', 
      tanggal: '24 Okt • 08:30', 
      cabang: 'Timur', 
      cabangType: 'badge-info',
      pelanggan: 'Bambang Sutedjo', 
      alamat: 'Jl. Pandugo Timur IV No. 18', 
      alasan: 'Bodi Retak/Bocor', 
      alasanBadge: 'badge-error', 
      alasanLabel: 'URGENT',
      teknisi: '+ Pilih', 
      teknisiIsAction: true,
      status: 'Pending', 
      statusType: 'badge-error' 
    },
    { 
      id: 'TICK-1041', 
      tanggal: '24 Okt • 08:15', 
      cabang: 'Barat', 
      cabangType: 'badge-warning',
      pelanggan: 'Koperasi Tirta Makmur', 
      alamat: 'Kawasan Niaga Margomulyo', 
      alasan: 'Meteran Macet', 
      alasanBadge: 'badge-ghost', 
      alasanLabel: 'RUTIN',
      teknisi: 'Agus Prabowo', 
      teknisiIsAction: false,
      status: 'Proses', 
      statusType: 'badge-primary' 
    },
    { 
      id: 'TICK-1039', 
      tanggal: '24 Okt • 07:45', 
      cabang: 'Utara', 
      cabangType: 'badge-success',
      pelanggan: 'Dr. Maria Ulfah', 
      alamat: 'Pantai Mentari Blok B-12', 
      alasan: 'Kedaluwarsa >5 Thn', 
      alasanBadge: 'badge-ghost', 
      alasanLabel: 'TERA',
      teknisi: 'Deni Febrianto', 
      teknisiIsAction: false,
      status: 'Selesai', 
      statusType: 'badge-secondary' 
    },
    { 
      id: 'TICK-1038', 
      tanggal: '24 Okt • 07:10', 
      cabang: 'Selatan', 
      cabangType: 'badge-neutral',
      pelanggan: 'CV. Surya Mandiri', 
      alamat: 'Jl. Ngagel Jaya Selatan No. 44B', 
      alasan: 'Segel Rusak/Putus', 
      alasanBadge: 'badge-warning', 
      alasanLabel: 'INVESTIGASI',
      teknisi: '+ Pilih', 
      teknisiIsAction: true,
      status: 'Pending', 
      statusType: 'badge-error' 
    },
    { 
      id: 'TICK-1035', 
      tanggal: '23 Okt • 16:40', 
      cabang: 'Pusat', 
      cabangType: 'badge-primary',
      pelanggan: 'Hotel Majapahit', 
      alamat: 'Jl. Tunjungan No. 65', 
      alasan: 'Komersial DN 50', 
      alasanBadge: 'badge-info', 
      alasanLabel: 'PRIORITAS',
      teknisi: 'Rizal Hidayat', 
      teknisiIsAction: false,
      status: 'Proses', 
      statusType: 'badge-primary' 
    },
    { 
      id: 'TICK-1031', 
      tanggal: '23 Okt • 14:10', 
      cabang: 'Timur', 
      cabangType: 'badge-info',
      pelanggan: 'Hartono Kusumo', 
      alamat: 'Kertajaya Indah Timur XI', 
      alasan: 'Kaca Register Buram', 
      alasanBadge: 'badge-ghost', 
      alasanLabel: 'RUTIN',
      teknisi: 'Budi Waluyo', 
      teknisiIsAction: false,
      status: 'Selesai', 
      statusType: 'badge-secondary' 
    },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header Title */}
      <div>
        <p className="text-xs text-base-content/60 mb-1">
          PDAM Tirta / Operasional / <span className="text-primary font-semibold">Penugasan</span>
        </p>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Manajemen Penugasan (Admin Pusat)</h1>
            <p className="text-xs text-base-content/60 mt-0.5">
              Monitoring dan alokasi Surat Perintah Kerja (SPK) penggantian water meter.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button className="btn btn-sm btn-outline bg-base-100 font-semibold normal-case">
              <Download className="w-4 h-4" />
              <span>Export Data (XLSX)</span>
            </button>
            <button className="btn btn-sm btn-primary text-white font-semibold normal-case">
              <Plus className="w-4 h-4" />
              <span>+ Buat Tiket Penugasan</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Kartu Statistik Nasional */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-base-100 border border-base-200 shadow-sm p-4 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-base-content/50 uppercase tracking-wider mb-1">Total SPK Nasional</p>
              <h3 className="text-2xl font-black">2,150</h3>
              <p className="text-[11px] text-base-content/60 mt-0.5">Akumulasi seluruh cabang</p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-base-200 flex items-center justify-center text-base-content/70">
              <ClipboardListIcon />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-200 shadow-sm p-4 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-error uppercase tracking-wider mb-1">Pending (Disposisi)</p>
              <h3 className="text-2xl font-black text-error">315</h3>
              <p className="text-[11px] text-error/80 mt-0.5">Memerlukan penugasan teknisi</p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-error/10 flex items-center justify-center text-error">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-200 shadow-sm p-4 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Sedang Dikerjakan</p>
              <h3 className="text-2xl font-black text-primary">980</h3>
              <p className="text-[11px] text-primary/80 mt-0.5">Teknisi di lapangan</p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Activity className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-200 shadow-sm p-4 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1">Selesai & Terverifikasi</p>
              <h3 className="text-2xl font-black text-secondary">855</h3>
              <p className="text-[11px] text-secondary/80 mt-0.5">Hasil segel tervalidasi</p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Bar Pencarian */}
      <div className="card bg-base-100 border border-base-200 shadow-sm p-5 space-y-4">
        {/* Input Pencarian & Dropdown Cabang */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
            <input 
              type="text" 
              placeholder="Cari ID Tiket, Pelanggan, No. Seri, Cabang..." 
              className="input input-bordered input-sm w-full pl-9 text-xs"
            />
          </div>

          <div>
            <select className="select select-bordered select-sm w-full text-xs font-semibold">
              <option>🏢 Semua Cabang (Nasional)</option>
              <option>Cabang Utama</option>
              <option>Cabang Timur</option>
              <option>Cabang Barat</option>
              <option>Cabang Utara</option>
              <option>Cabang Selatan</option>
            </select>
          </div>
        </div>

        {/* Tab Status & Reset */}
        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-base-200 gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <button className="btn btn-sm btn-primary text-white font-medium normal-case">
              Semua (2,150)
            </button>
            <button className="btn btn-sm btn-ghost bg-base-200/60 font-medium normal-case">
              Pending (315)
            </button>
            <button className="btn btn-sm btn-ghost bg-base-200/60 font-medium normal-case">
              Proses (980)
            </button>
            <button className="btn btn-sm btn-ghost bg-base-200/60 font-medium normal-case">
              Selesai (855)
            </button>
          </div>

          <button className="btn btn-sm btn-ghost text-xs text-base-content/60 hover:text-base-content gap-1">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Tabel Surat Perintah Kerja (SPK) */}
      <div className="card bg-base-100 border border-base-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-base-200 flex justify-between items-center bg-base-200/30">
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider flex items-center gap-2">
              Daftar Surat Perintah Kerja (SPK) 
              <span className="badge badge-primary badge-soft text-[10px] font-normal">Aktif Real-time</span>
            </h3>
          </div>
          <div className="text-xs text-base-content/60 flex items-center gap-2">
            <span>Menampilkan 6 dari 2,150 tiket</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-success font-semibold">
              <span className="w-2 h-2 rounded-full bg-success inline-block"></span> Sinkronisasi Terkini
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table table-sm w-full">
            <thead>
              <tr className="bg-base-200/50 text-base-content/60 text-[11px] uppercase tracking-wider">
                <th className="py-3.5 pl-5">ID & Tanggal</th>
                <th className="py-3.5">Cabang</th>
                <th className="py-3.5">Pelanggan & Alamat</th>
                <th className="py-3.5">Alasan</th>
                <th className="py-3.5">Teknisi</th>
                <th className="py-3.5">Status</th>
                <th className="py-3.5 text-right pr-5">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-200 text-xs">
              {tickets.map((item, index) => (
                <tr key={index} className="hover:bg-base-200/40 transition-colors">
                  <td className="py-3.5 pl-5 font-bold">
                    <span className="text-primary block">{item.id}</span>
                    <span className="text-[10px] text-base-content/50 font-normal">{item.tanggal}</span>
                  </td>
                  <td className="py-3.5">
                    <span className="badge badge-ghost badge-sm font-bold">{item.cabang}</span>
                  </td>
                  <td className="py-3.5">
                    <span className="font-semibold block">{item.pelanggan}</span>
                    <span className="text-[10px] text-base-content/50">{item.alamat}</span>
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`badge badge-xs font-bold ${item.alasanBadge}`}>{item.alasanLabel}</span>
                      <span className="text-base-content/80">{item.alasan}</span>
                    </div>
                  </td>
                  <td className="py-3.5">
                    {item.teknisiIsAction ? (
                      <button className="btn btn-xs btn-outline btn-primary font-semibold normal-case">
                        {item.teknisi}
                      </button>
                    ) : (
                      <span className="font-medium text-base-content/80">{item.teknisi}</span>
                    )}
                  </td>
                  <td className="py-3.5">
                    <span className={`badge badge-sm font-bold ${item.statusType}`}>
                      {item.status}
                    </span>
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
          <div className="flex items-center gap-2">
            <span>Baris per halaman:</span>
            <select className="select select-bordered select-xs w-16">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <span>• 1 - 6 dari 2,150 tiket</span>
          </div>

          <div className="join">
            <button className="join-item btn btn-sm btn-ghost">|&lt;</button>
            <button className="join-item btn btn-sm btn-ghost">&lt;</button>
            <button className="join-item btn btn-sm btn-active btn-primary text-white font-bold">1</button>
            <button className="join-item btn btn-sm btn-ghost">2</button>
            <button className="join-item btn btn-sm btn-ghost">3</button>
            <button className="join-item btn btn-sm btn-ghost">...</button>
            <button className="join-item btn btn-sm btn-ghost">215</button>
            <button className="join-item btn btn-sm btn-ghost">&gt;</button>
            <button className="join-item btn btn-sm btn-ghost">&gt;|</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Ikon pembantu
function ClipboardListIcon() {
  return (
    <svg className="w-5 h-5 text-base-content/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012-2m-6 9l2 2 4-4" />
    </svg>
  );
}