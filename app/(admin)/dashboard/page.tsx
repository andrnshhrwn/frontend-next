'use client';

import { useState } from 'react';
import { mockPdamData } from '@/data/mockData';
import { Calendar, SlidersHorizontal, Download, BarChart3, Info, Check, MapPin, Building2, Layers } from 'lucide-react';

export default function DashboardPage() {
  const data = mockPdamData;
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  const displayedBranches = selectedBranch === 'all' 
    ? data.branches 
    : data.branches.filter(b => b.id === selectedBranch);

  const currentBranchName = selectedBranch === 'all' 
    ? 'Semua 9 Unit Cabang' 
    : data.branches.find(b => b.id === selectedBranch)?.name || 'Semua Cabang';

  return (
    <div className="space-y-6">
      {/* Banner Monitoring Real Dataset */}
      <div className="card bg-white border border-slate-200/90 shadow-xs p-5 flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-pdam-primary/10 flex items-center justify-center text-pdam-primary shrink-0 ring-1 ring-pdam-primary/20">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-pdam-navy">Monitoring Pergantian Water Meter</h2>
              <span className="badge bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold">
                Data Riil PAM Tirta Kamuning
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Konsolidasi logistik meter, kuota SPK, dan capaian realisasi 267 transaksi di 9 Unit Cabang (Periode {data.periode})
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 relative">
          <div className="btn btn-sm btn-ghost bg-pdam-bg hover:bg-slate-200 border border-slate-200 text-slate-700 font-medium normal-case pointer-events-none">
            <Calendar className="w-3.5 h-3.5 text-pdam-navy" />
            <span className="font-semibold text-pdam-navy">{data.periode}</span>
            <span className="text-[10px] text-emerald-600 bg-emerald-100/70 px-1.5 py-0.5 rounded font-bold">267 Transaksi</span>
          </div>

          {/* Filter Cabang Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`btn btn-sm normal-case font-medium border ${
                selectedBranch !== 'all' 
                  ? 'bg-pdam-primary text-white border-pdam-primary' 
                  : 'btn-ghost bg-pdam-bg hover:bg-slate-200 border-slate-200 text-slate-700'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{selectedBranch === 'all' ? 'Filter Cabang' : currentBranchName}</span>
            </button>

            {isFilterOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setIsFilterOpen(false)} />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 p-2 z-30 space-y-1">
                  <div className="px-2 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Pilih Unit Cabang (9 Unit)
                  </div>
                  <button
                    onClick={() => { setSelectedBranch('all'); setIsFilterOpen(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-left transition-colors ${
                      selectedBranch === 'all' 
                        ? 'bg-pdam-primary/10 text-pdam-primary font-bold' 
                        : 'text-slate-700 hover:bg-pdam-bg'
                    }`}
                  >
                    <span>Semua Unit Cabang (9 Unit)</span>
                    {selectedBranch === 'all' && <Check className="w-3.5 h-3.5 text-pdam-primary" />}
                  </button>
                  <div className="h-px bg-slate-100 my-1" />
                  <div className="max-h-56 overflow-y-auto space-y-0.5">
                    {data.branches.map(b => (
                      <button
                        key={b.id}
                        onClick={() => { setSelectedBranch(b.id); setIsFilterOpen(false); }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded-lg text-left transition-colors ${
                          selectedBranch === b.id 
                            ? 'bg-pdam-primary/10 text-pdam-primary font-bold' 
                            : 'text-slate-700 hover:bg-pdam-bg'
                        }`}
                      >
                        <div>
                          <p className="leading-tight">{b.name}</p>
                          <p className="text-[10px] text-slate-400">{b.code} • {b.sector}</p>
                        </div>
                        {selectedBranch === b.id && <Check className="w-3.5 h-3.5 text-pdam-primary shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <button 
            onClick={() => alert(`Mengekspor Laporan Konsolidasi Pergantian Water Meter PAM Tirta Kamuning Periode ${data.periode} (267 Transaksi Cabang)...`)}
            className="btn btn-sm bg-pdam-primary hover:bg-pdam-navy text-white font-medium normal-case border-0 shadow-xs"
          >
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
                DISTRIBUSI STATUS WATER METER (INVENTORI)
              </span>
              <span className="badge border border-pdam-primary/30 bg-pdam-primary/10 text-pdam-primary text-[11px] font-semibold">
                Total PAM Tirta Kamuning
              </span>
            </div>
            
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-extrabold text-pdam-navy tabular-nums">
                {data.totalWaterMeter.toLocaleString('id-ID')}
              </span>
              <span className="text-xs text-slate-500 font-medium">Unit Water Meter di 9 Cabang &amp; Pusat</span>
            </div>

            {/* Multi-color Progress Bar */}
            <div className="h-3.5 w-full bg-pdam-bg rounded-full overflow-hidden flex mb-2 border border-slate-200/60">
              <div 
                style={{ width: `${data.inventory.gudang.percentage}%` }} 
                className="bg-pdam-primary h-full transition-all duration-500"
                title={`Tersedia di Unit: ${data.inventory.gudang.count} unit (${data.inventory.gudang.percentage}%)`}
              ></div>
              <div 
                style={{ width: `${data.inventory.terpasang.percentage}%` }} 
                className="bg-pdam-navy h-full transition-all duration-500"
                title={`Terpasang Aktif: ${data.inventory.terpasang.count} unit (${data.inventory.terpasang.percentage}%)`}
              ></div>
              <div 
                style={{ width: `${data.inventory.rusak.percentage}%` }} 
                className="bg-pdam-red h-full transition-all duration-500"
                title={`Rusak / Ditarik: ${data.inventory.rusak.count} unit (${data.inventory.rusak.percentage}%)`}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-5">
              <span>0%</span>
              <span>Proporsi Status Inventaris (Tersedia • Terpasang • Rusak)</span>
              <span>100%</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200">
            <div className="bg-pdam-bg p-3 rounded-xl border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-pdam-primary"></span> Tersedia di Unit
              </div>
              <p className="text-lg font-extrabold text-pdam-navy tabular-nums">{data.inventory.gudang.count}</p>
              <p className="text-[11px] text-pdam-primary font-bold">{data.inventory.gudang.percentage}% <span className="text-slate-400 font-normal">Stok cabang</span></p>
            </div>
            <div className="bg-pdam-bg p-3 rounded-xl border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-pdam-navy"></span> Terpasang Aktif
              </div>
              <p className="text-lg font-extrabold text-pdam-navy tabular-nums">{data.inventory.terpasang.count}</p>
              <p className="text-[11px] text-pdam-navy font-bold">{data.inventory.terpasang.percentage}% <span className="text-slate-400 font-normal">Pelanggan</span></p>
            </div>
            <div className="bg-pdam-bg p-3 rounded-xl border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-pdam-red"></span> Rusak / Ditarik
              </div>
              <p className="text-lg font-extrabold text-pdam-navy tabular-nums">{data.inventory.rusak.count}</p>
              <p className="text-[11px] text-pdam-red font-bold">{data.inventory.rusak.percentage}% <span className="text-slate-400 font-normal">Hasil ganti</span></p>
            </div>
          </div>
        </div>

        {/* Kartu 2: STATUS PENUGASAN TIKET PERGANTIAN */}
        <div className="card bg-white border border-slate-200/90 shadow-xs p-6 justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[11px] font-bold text-pdam-navy uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-pdam-primary inline-block"></span>
                STATUS TIKET PENUGASAN (SPK) BERJENJANG
              </span>
              <span className="badge border border-emerald-500/30 bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
                Periode {data.periode}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-5">
              <span className="text-4xl font-extrabold text-pdam-navy tabular-nums">{data.tickets.total}</span>
              <span className="text-xs text-slate-500 font-medium">Total Perintah Kerja Diterbitkan</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-pdam-bg p-3 rounded-xl border border-slate-200/80">
              <div className="flex justify-between text-xs mb-2">
                <span className="font-medium flex items-center gap-2 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Pending (Menunggu Disposisi Teknisi Cabang)
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
                  <span className="w-2.5 h-2.5 rounded-full bg-pdam-primary"></span> Proses (Dikerjakan Teknisi di Lapangan)
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
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Selesai &amp; Terverifikasi BAP (Realisasi Riil)
                </span>
                <span className="font-extrabold text-emerald-700">{data.tickets.completed.count} Tiket <span className="badge bg-emerald-100 text-emerald-800 border-0 badge-sm ml-2 font-bold">{data.tickets.completed.percentage}%</span></span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${data.tickets.completed.percentage}%` }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Statistik Progres 9 Cabang PAM Tirta Kamuning */}
      <div className="card bg-white border border-slate-200/90 shadow-xs p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold flex items-center gap-2 text-sm text-pdam-navy">
                <Building2 className="w-4 h-4 text-pdam-primary" />
                Statistik Progres Pergantian 9 Unit Cabang Aktif
              </h3>
              <span className="badge bg-pdam-primary/10 text-pdam-primary border-pdam-primary/20 text-[10px] font-bold">
                Total 267 Transaksi
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Komparasi capaian fisik penggantian Water Meter usia &gt; 5 tahun atau kondisi rusak di 9 unit cabang PAM Tirta Kamuning
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-pdam-primary inline-block"></span>
              <span className="text-slate-700">Capaian &gt; 75%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-400 inline-block"></span>
              <span className="text-slate-700">Capaian ≤ 75%</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {displayedBranches.map((branch) => {
            const isHigh = branch.percentage > 75;
            return (
              <div key={branch.id} className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-colors space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-pdam-navy">{branch.name}</span>
                    <span className="badge bg-slate-100 text-slate-600 border-slate-200 badge-sm font-semibold">{branch.code}</span>
                    <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">• {branch.sector}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-pdam-navy">
                      {branch.current} <span className="text-slate-400 font-normal">/ {branch.target} WM</span>
                    </span>
                    <span className={`badge font-bold border-0 ${isHigh ? 'bg-pdam-primary text-white' : 'bg-amber-100 text-amber-800'}`}>
                      {branch.percentage}%
                    </span>
                  </div>
                </div>
                
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${isHigh ? 'bg-pdam-primary' : 'bg-amber-400'}`}
                    style={{ width: `${branch.percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Ringkasan Target */}
        <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3 bg-pdam-bg p-4 rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Info className="w-4 h-4 text-pdam-primary shrink-0" />
            <span>
              Akumulasi Target 9 Cabang: <strong className="text-pdam-navy">{data.summaryInfo.totalTarget.toLocaleString('id-ID')} WM</strong> | 
              Total Realisasi Lapangan: <strong className="text-pdam-primary">{data.summaryInfo.totalRealization.toLocaleString('id-ID')} WM ({data.summaryInfo.realizationPercentage}%)</strong>
            </span>
          </div>
          <div className="text-xs font-bold text-pdam-navy">
            Batas Waktu Periode: <span className="text-pdam-red font-semibold">{data.summaryInfo.deadline}</span>
          </div>
        </div>

      </div>
    </div>
  );
}