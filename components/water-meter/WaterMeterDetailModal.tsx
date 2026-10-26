"use client";

import React from "react";
import { MapPin, History, Calendar, CheckCircle2, ShieldCheck, Tag } from "lucide-react";
import { BaseModal, StatusBadge } from "@/components/ui";

export interface WaterMeterItem {
  noSeri: string;
  tahunPengadaan: number;
  merk: string;
  dn: string;
  status: "Tersedia di Unit" | "Terpasang" | "Rusak" | "Ditarik";
  unitCabang: string;
  lokasi: string;
  detail: string;
}

interface WaterMeterDetailModalProps {
  item: WaterMeterItem | null;
  onClose: () => void;
}

export function WaterMeterDetailModal({ item, onClose }: WaterMeterDetailModalProps) {
  if (!item) return null;

  const riwayat = [
    {
      judul: "Penerimaan Logistik Gudang",
      ket: `Penerimaan batch pengadaan ${item.tahunPengadaan} dari Kantor Pusat Kuningan`,
      waktu: `12 Jan ${item.tahunPengadaan} • 09:30`,
    },
    {
      judul: "Alokasi ke Unit Kerja",
      ket: `Didistribusikan ke Gudang ${item.unitCabang}`,
      waktu: `18 Jan ${item.tahunPengadaan} • 14:15`,
    },
    ...(item.status === "Terpasang"
      ? [
          {
            judul: "Pemasangan di Pelanggan",
            ket: `Terpasang pada ${item.lokasi} (${item.detail})`,
            waktu: "14 Agu 2026 • 10:45",
          },
        ]
      : item.status === "Rusak" || item.status === "Ditarik"
      ? [
          {
            judul: "Penarikan dari Lapangan",
            ket: `Ditarik ke Gudang Karantina - ${item.detail}`,
            waktu: "19 Agu 2026 • 11:20",
          },
        ]
      : []),
  ];

  return (
    <BaseModal
      isOpen={!!item}
      onClose={onClose}
      title="Detail Water Meter"
      subtitle="Informasi spesifikasi fisik, unit alokasi, status, dan riwayat mutasi aset."
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Header Identitas */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Nomor Seri Aset
            </span>
            <p className="font-mono font-bold text-xl text-pdam-primary tracking-tight">
              {item.noSeri}
            </p>
          </div>
          <StatusBadge status={item.status} size="md" />
        </div>

        {/* Spesifikasi Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase">Merk</span>
            <p className="text-xs font-bold text-slate-800 mt-0.5">{item.merk}</p>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase">Diameter Nominal</span>
            <p className="text-xs font-bold font-mono text-slate-800 mt-0.5">{item.dn}</p>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase">Tahun Pengadaan</span>
            <p className="text-xs font-bold text-slate-800 mt-0.5 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-pdam-primary" />
              {item.tahunPengadaan}
            </p>
          </div>
          <div className="sm:col-span-3 pt-2 border-t border-slate-200/60">
            <span className="text-[10px] font-semibold text-slate-400 uppercase">Unit Penanggung Jawab</span>
            <p className="text-xs font-bold text-pdam-navy mt-0.5">{item.unitCabang}</p>
          </div>
        </div>

        {/* Lokasi / Pelanggan */}
        <div className="p-3.5 rounded-xl border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-pdam-primary" /> Lokasi / Pelanggan Saat Ini
          </p>
          <p className="text-xs font-bold text-pdam-navy">{item.lokasi}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{item.detail}</p>
        </div>

        {/* Riwayat Mutasi */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-slate-400" /> Riwayat Mutasi Aset
          </p>
          <div className="space-y-3 pl-1">
            {riwayat.map((r, i) => (
              <div key={i} className="flex items-start gap-3 relative">
                {i < riwayat.length - 1 && (
                  <div className="absolute left-[7px] top-4 bottom-[-10px] w-0.5 bg-slate-200" />
                )}
                <span className="mt-1 w-3.5 h-3.5 rounded-full bg-pdam-primary/10 border-2 border-pdam-primary shrink-0 z-10" />
                <div>
                  <p className="text-xs font-semibold text-slate-800">{r.judul}</p>
                  <p className="text-[11px] text-slate-500">{r.ket}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{r.waktu}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-ghost text-slate-600 hover:bg-slate-100"
          >
            Tutup
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
