"use client";

import type { ReactNode } from "react";

import { MapPin, Pencil } from "lucide-react";

import { BaseModal } from "@/components/ui/BaseModal";

import type { PelangganDetailModalProps } from "@/types/pelanggan.types";

import { btnGhost, btnPrimary } from "@/utils/pelanggan.utils";

export function PelangganDetailModal({
  customer,
  onClose,
  onEdit,
}: PelangganDetailModalProps) {
  const Row = ({ k, v }: { k: string; v: ReactNode }) => (
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        {k}
      </p>

      <p className="text-xs font-semibold text-pdam-navy mt-0.5">{v}</p>
    </div>
  );

  return (
    <BaseModal
      isOpen
      onClose={onClose}
      title="Detail Pelanggan"
      subtitle="Informasi master pelanggan."
      maxWidth="2xl"
    >
      <div className="mb-5">
        <p className="text-base font-bold text-pdam-navy">{customer.nama}</p>

        <p className="text-[11px] font-mono text-slate-400">
          {customer.idPelangganPdam}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 pb-5 border-b border-slate-200">
        <div className="col-span-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            Alamat
          </p>

          <p className="text-xs font-semibold text-pdam-navy">
            {customer.alamat}
          </p>
        </div>

        <Row k="Unit Cabang" v={customer.cabang} />
        <Row k="Golongan Tarif" v={customer.tipeTarif} />
      </div>

      <div className="pt-5">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          Pencatatan Nomor Seri WM Aktif
        </p>

        <div
          className={`rounded-lg border p-3 ${
            customer.wmNoSeri
              ? "border-emerald-200 bg-emerald-50"
              : "border-amber-200 bg-amber-50"
          }`}
        >
          <p
            className={`text-xs font-bold ${
              customer.wmNoSeri ? "text-emerald-700" : "text-amber-700"
            }`}
          >
            {customer.wmStatus}
          </p>

          {customer.wmNoSeri ? (
            <p className="text-xs font-mono text-emerald-800 mt-1">
              Nomor Seri: {customer.wmNoSeri}
            </p>
          ) : (
            <p className="text-[11px] text-amber-700 mt-1">
              Nomor seri WM aktif belum tercatat dalam sistem. Status ini tidak
              menunjukkan bahwa pelanggan secara fisik belum memiliki water
              meter.
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-5 mt-5 border-t border-slate-200">
        <button type="button" onClick={onClose} className={btnGhost}>
          Tutup
        </button>

        <button type="button" onClick={onEdit} className={btnPrimary}>
          <Pencil className="w-4 h-4" />
          Edit Data
        </button>
      </div>
    </BaseModal>
  );
}
