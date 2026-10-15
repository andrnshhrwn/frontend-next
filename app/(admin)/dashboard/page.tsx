import { mockPdamData } from '@/data/mockData';
import { Calendar, SlidersHorizontal, Download, BarChart3, Info } from 'lucide-react';

export default function DashboardPage() {
  const data = mockPdamData;

  return (
    <div className="space-y-6">
      {/* Banner Monitoring */}
      <div className="card bg-base-100 border border-base-200 shadow-sm p-5 flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm">Monitoring Pergantian Meter Air</h2>
            <p className="text-xs text-base-content/60 mt-0.5">
              Konsolidasi logistik meter, kuota penugasan, dan performa realisasi cabang
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button className="btn btn-sm btn-ghost bg-base-200 font-medium normal-case">
            <Calendar className="w-3.5 h-3.5" />
            <span>Kuartal II - 2024 (Aktif)</span>
          </button>
          <button className="btn btn-sm btn-ghost bg-base-200 font-medium normal-case">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter Cabang</span>
          </button>
          <button className="btn btn-sm btn-primary text-white font-medium normal-case">
            <Download className="w-3.5 h-3.5" />
            <span>Rekap PDF / XLSX</span>
          </button>
        </div>
      </div>

      {/* Grid Kartu Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Kartu 1: DISTRIBUSI STATUS WATER METER */}
        <div className="card bg-base-100 border border-base-200 shadow-sm p-6 justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
                DISTRIBUSI STATUS WATER METER
              </span>
              <span className="badge badge-primary badge-outline text-[11px]">
                Total Terdaftar
              </span>
            </div>
            
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-extrabold">
                {data.totalWaterMeter.toLocaleString('id-ID')}
              </span>
              <span className="text-xs text-base-content/60 font-medium">Unit Water Meter di Cabang</span>
            </div>

            {/* Multi-color Progress Bar */}
            <div className="h-3.5 w-full bg-base-200 rounded-full overflow-hidden flex mb-2">
              <div style={{ width: `${data.inventory.gudang.percentage}%` }} className="bg-primary h-full"></div>
              <div style={{ width: `${data.inventory.terpasang.percentage}%` }} className="bg-secondary h-full"></div>
              <div style={{ width: `${data.inventory.rusak.percentage}%` }} className="bg-error h-full"></div>
            </div>
            <div className="flex justify-between text-[11px] text-base-content/50 mb-5">
              <span>0%</span>
              <span>Proporsi Total Inventaris Lapangan & Gudang</span>
              <span>100%</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-base-200">
            <div className="bg-base-200/50 p-3 rounded-xl border border-base-200">
              <div className="flex items-center gap-1.5 text-[11px] text-base-content/70 font-medium mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-primary"></span> Di Gudang Unit
              </div>
              <p className="text-lg font-extrabold">{data.inventory.gudang.count}</p>
              <p className="text-[11px] text-primary font-bold">{data.inventory.gudang.percentage}% <span className="text-base-content/50 font-normal">Siap instalasi</span></p>
            </div>
            <div className="bg-base-200/50 p-3 rounded-xl border border-base-200">
              <div className="flex items-center gap-1.5 text-[11px] text-base-content/70 font-medium mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span> Terpasang Aktif
              </div>
              <p className="text-lg font-extrabold">{data.inventory.terpasang.count}</p>
              <p className="text-[11px] text-secondary font-bold">{data.inventory.terpasang.percentage}% <span className="text-base-content/50 font-normal">Normal</span></p>
            </div>
            <div className="bg-base-200/50 p-3 rounded-xl border border-base-200">
              <div className="flex items-center gap-1.5 text-[11px] text-base-content/70 font-medium mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-error"></span> Rusak / Retur
              </div>
              <p className="text-lg font-extrabold">{data.inventory.rusak.count}</p>
              <p className="text-[11px] text-error font-bold">{data.inventory.rusak.percentage}% <span className="text-base-content/50 font-normal">Perlu tera</span></p>
            </div>
          </div>
        </div>

        {/* Kartu 2: STATUS PENUGASAN TIKET PERGANTIAN */}
        <div className="card bg-base-100 border border-base-200 shadow-sm p-6 justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
                STATUS PENUGASAN TIKET PERGANTIAN
              </span>
              <span className="badge badge-primary badge-outline text-[11px]">
                Periode Berjalan
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-5">
              <span className="text-4xl font-extrabold">{data.tickets.total}</span>
              <span className="text-xs text-base-content/60 font-medium">Total Tiket Perintah Kerja (SPK)</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-base-200/50 p-2.5 rounded-xl border border-base-200">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-neutral-content"></span> Pending (Menunggu Teknisi)
                </span>
                <span className="font-extrabold">{data.tickets.pending.count} Tiket <span className="badge badge-neutral badge-sm ml-2">{data.tickets.pending.percentage}%</span></span>
              </div>
              <progress className="progress progress-neutral w-full" value={data.tickets.pending.percentage} max="100"></progress>
            </div>

            <div className="bg-base-200/50 p-2.5 rounded-xl border border-base-200">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span> Proses (Dikerjakan di Lapangan)
                </span>
                <span className="font-extrabold">{data.tickets.inProgress.count} Tiket <span className="badge badge-primary badge-sm ml-2">{data.tickets.inProgress.percentage}%</span></span>
              </div>
              <progress className="progress progress-primary w-full" value={data.tickets.inProgress.percentage} max="100"></progress>
            </div>

            <div className="bg-base-200/50 p-2.5 rounded-xl border border-base-200">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span> Selesai (Terverifikasi)
                </span>
                <span className="font-extrabold">{data.tickets.completed.count} Tiket <span className="badge badge-secondary badge-sm ml-2">{data.tickets.completed.percentage}%</span></span>
              </div>
              <progress className="progress progress-secondary w-full" value={data.tickets.completed.percentage} max="100"></progress>
            </div>
          </div>
        </div>

      </div>

      {/* Statistik Progres Per Cabang */}
      <div className="card bg-base-100 border border-base-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-base-200">
          <div>
            <h3 className="font-bold flex items-center gap-2 text-sm">
              <BarChart3 className="w-4 h-4 text-primary" />
              Statistik Progres Pergantian Tiap Cabang
            </h3>
            <p className="text-xs text-base-content/60 mt-0.5">Komparasi capaian fisik penggantian Water Meter usia {'>'} 5 tahun terhadap kuota cabang</p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-primary inline-block"></span>
              <span>Capaian {'>'} 75%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-neutral-content inline-block"></span>
              <span>Capaian $\le$ 75%</span>
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
                    <span className="font-bold">{branch.name}</span>
                    <span className="badge badge-ghost badge-sm font-semibold">{branch.sector}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold">{branch.current} <span className="text-base-content/40 font-normal">/ {branch.target} WM</span></span>
                    <span className={`badge font-bold ${isHigh ? 'badge-primary' : 'badge-ghost'}`}>
                      {branch.percentage}%
                    </span>
                  </div>
                </div>
                
                <progress 
                  className={`progress w-full ${isHigh ? 'progress-primary' : 'progress-neutral'}`} 
                  value={branch.percentage} 
                  max="100"
                ></progress>
              </div>
            );
          })}
        </div>

        <div className="mt-8 pt-4 border-t border-base-200 flex flex-col sm:flex-row justify-between items-center gap-3 bg-base-200/40 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-xs">
            <Info className="w-4 h-4 text-primary shrink-0" />
            <span>Akumulasi Target Keseluruhan Cabang: <strong>{data.summaryInfo.totalTarget.toLocaleString('id-ID')} WM</strong> | Total Realisasi Lapangan: <strong>{data.summaryInfo.totalRealization.toLocaleString('id-ID')} WM ({data.summaryInfo.realizationPercentage}%)</strong></span>
          </div>
          <div className="text-xs font-bold text-primary">
            Batas Waktu Target: {data.summaryInfo.deadline}
          </div>
        </div>

      </div>
    </div>
  );
}