import { mockPdamData } from '@/data/mockData';
import { Calendar, SlidersHorizontal, Download, BarChart3, Info } from 'lucide-react';

export default function DashboardPage() {
  const data = mockPdamData;

  return (
    <div className="space-y-6">
      {/* Banner Monitoring */}
      <div className="card bg-white border border-slate-200/90 shadow-xs p-5 flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-pdam-primary/10 flex items-center justify-center text-pdam-primary shrink-0 ring-1 ring-pdam-primary/20">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-pdam-navy">Monitoring Pergantian Meter Air</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Konsolidasi logistik meter, kuota penugasan, dan performa realisasi cabang
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button className="btn btn-sm btn-ghost bg-pdam-bg hover:bg-slate-200 border border-slate-200 text-slate-700 font-medium normal-case">
            <Calendar className="w-3.5 h-3.5 text-pdam-navy" />
            <span>Kuartal II - 2024 (Aktif)</span>
          </button>
          <button className="btn btn-sm btn-ghost bg-pdam-bg hover:bg-slate-200 border border-slate-200 text-slate-700 font-medium normal-case">
            <SlidersHorizontal className="w-3.5 h-3.5 text-pdam-navy" />
            <span>Filter Cabang</span>
          </button>
          <button className="btn btn-sm bg-pdam-primary hover:bg-pdam-navy text-white font-medium normal-case border-0 shadow-xs">
            <Download className="w-3.5 h-3.5" />
            <span>Rekap PDF / XLSX</span>
          </button>
        </div>
      </div>

      {/* Grid Kartu Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Kartu 1: DISTRIBUSI STATUS WATER METER */}
        <div className="card bg-white border border-slate-200/90 shadow-xs p-6 justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[11px] font-bold text-pdam-navy uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-pdam-primary inline-block"></span>
                DISTRIBUSI STATUS WATER METER
              </span>
              <span className="badge border border-pdam-primary/30 bg-pdam-primary/10 text-pdam-primary text-[11px] font-semibold">
                Total Terdaftar
              </span>
            </div>
            
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-extrabold text-pdam-navy tabular-nums">
                {data.totalWaterMeter.toLocaleString('id-ID')}
              </span>
              <span className="text-xs text-slate-500 font-medium">Unit Water Meter di Cabang</span>
            </div>

            {/* Multi-color Progress Bar */}
            <div className="h-3.5 w-full bg-pdam-bg rounded-full overflow-hidden flex mb-2 border border-slate-200/60">
              <div style={{ width: `${data.inventory.gudang.percentage}%` }} className="bg-pdam-primary h-full"></div>
              <div style={{ width: `${data.inventory.terpasang.percentage}%` }} className="bg-pdam-navy h-full"></div>
              <div style={{ width: `${data.inventory.rusak.percentage}%` }} className="bg-pdam-red h-full"></div>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-5">
              <span>0%</span>
              <span>Proporsi Total Inventaris Lapangan & Gudang</span>
              <span>100%</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200">
            <div className="bg-pdam-bg p-3 rounded-xl border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-pdam-primary"></span> Di Gudang Unit
              </div>
              <p className="text-lg font-extrabold text-pdam-navy tabular-nums">{data.inventory.gudang.count}</p>
              <p className="text-[11px] text-pdam-primary font-bold">{data.inventory.gudang.percentage}% <span className="text-slate-400 font-normal">Siap instalasi</span></p>
            </div>
            <div className="bg-pdam-bg p-3 rounded-xl border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-pdam-navy"></span> Terpasang Aktif
              </div>
              <p className="text-lg font-extrabold text-pdam-navy tabular-nums">{data.inventory.terpasang.count}</p>
              <p className="text-[11px] text-pdam-navy font-bold">{data.inventory.terpasang.percentage}% <span className="text-slate-400 font-normal">Normal</span></p>
            </div>
            <div className="bg-pdam-bg p-3 rounded-xl border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-pdam-red"></span> Rusak / Retur
              </div>
              <p className="text-lg font-extrabold text-pdam-navy tabular-nums">{data.inventory.rusak.count}</p>
              <p className="text-[11px] text-pdam-red font-bold">{data.inventory.rusak.percentage}% <span className="text-slate-400 font-normal">Perlu tera</span></p>
            </div>
          </div>
        </div>

        {/* Kartu 2: STATUS PENUGASAN TIKET PERGANTIAN */}
        <div className="card bg-white border border-slate-200/90 shadow-xs p-6 justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[11px] font-bold text-pdam-navy uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-pdam-primary inline-block"></span>
                STATUS PENUGASAN TIKET PERGANTIAN
              </span>
              <span className="badge border border-pdam-primary/30 bg-pdam-primary/10 text-pdam-primary text-[11px] font-semibold">
                Periode Berjalan
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-5">
              <span className="text-4xl font-extrabold text-pdam-navy tabular-nums">{data.tickets.total}</span>
              <span className="text-xs text-slate-500 font-medium">Total Tiket Perintah Kerja (SPK)</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-pdam-bg p-3 rounded-xl border border-slate-200/80">
              <div className="flex justify-between text-xs mb-2">
                <span className="font-medium flex items-center gap-2 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Pending (Menunggu Teknisi)
                </span>
                <span className="font-extrabold text-pdam-navy">{data.tickets.pending.count} Tiket <span className="badge bg-slate-200 text-slate-700 border-0 badge-sm ml-2 font-bold">{data.tickets.pending.percentage}%</span></span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div className="bg-slate-400 h-full rounded-full" style={{ width: `${data.tickets.pending.percentage}%` }}></div>
              </div>
            </div>

            <div className="bg-pdam-bg p-3 rounded-xl border border-slate-200/80">
              <div className="flex justify-between text-xs mb-2">
                <span className="font-medium flex items-center gap-2 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-pdam-primary"></span> Proses (Dikerjakan di Lapangan)
                </span>
                <span className="font-extrabold text-pdam-navy">{data.tickets.inProgress.count} Tiket <span className="badge bg-pdam-primary/15 text-pdam-primary border-0 badge-sm ml-2 font-bold">{data.tickets.inProgress.percentage}%</span></span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div className="bg-pdam-primary h-full rounded-full" style={{ width: `${data.tickets.inProgress.percentage}%` }}></div>
              </div>
            </div>

            <div className="bg-pdam-bg p-3 rounded-xl border border-slate-200/80">
              <div className="flex justify-between text-xs mb-2">
                <span className="font-medium flex items-center gap-2 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-pdam-navy"></span> Selesai (Terverifikasi)
                </span>
                <span className="font-extrabold text-pdam-navy">{data.tickets.completed.count} Tiket <span className="badge bg-pdam-navy/15 text-pdam-navy border-0 badge-sm ml-2 font-bold">{data.tickets.completed.percentage}%</span></span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div className="bg-pdam-navy h-full rounded-full" style={{ width: `${data.tickets.completed.percentage}%` }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Statistik Progres Per Cabang */}
      <div className="card bg-white border border-slate-200/90 shadow-xs p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-200">
          <div>
            <h3 className="font-bold flex items-center gap-2 text-sm text-pdam-navy">
              <BarChart3 className="w-4 h-4 text-pdam-primary" />
              Statistik Progres Pergantian Tiap Cabang
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Komparasi capaian fisik penggantian Water Meter usia {'>'} 5 tahun terhadap kuota cabang</p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-pdam-primary inline-block"></span>
              <span className="text-slate-700">Capaian {'>'} 75%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-300 inline-block"></span>
              <span className="text-slate-700">Capaian ≤ 75%</span>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {data.branches.map((branch) => {
            const isHigh = branch.percentage > 75;
            return (
              <div key={branch.id} className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-pdam-navy">{branch.name}</span>
                    <span className="badge bg-slate-100 text-slate-600 border-slate-200 badge-sm font-semibold">{branch.sector}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-pdam-navy">{branch.current} <span className="text-slate-400 font-normal">/ {branch.target} WM</span></span>
                    <span className={`badge font-bold border-0 ${isHigh ? 'bg-pdam-primary text-white' : 'bg-slate-100 text-slate-600'}`}>
                      {branch.percentage}%
                    </span>
                  </div>
                </div>
                
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${isHigh ? 'bg-pdam-primary' : 'bg-slate-300'}`}
                    style={{ width: `${branch.percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3 bg-pdam-bg p-4 rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Info className="w-4 h-4 text-pdam-primary shrink-0" />
            <span>Akumulasi Target Keseluruhan Cabang: <strong className="text-pdam-navy">{data.summaryInfo.totalTarget.toLocaleString('id-ID')} WM</strong> | Total Realisasi Lapangan: <strong className="text-pdam-primary">{data.summaryInfo.totalRealization.toLocaleString('id-ID')} WM ({data.summaryInfo.realizationPercentage}%)</strong></span>
          </div>
          <div className="text-xs font-bold text-pdam-navy">
            Batas Waktu Target: <span className="text-pdam-red font-semibold">{data.summaryInfo.deadline}</span>
          </div>
        </div>

      </div>
    </div>
  );
}