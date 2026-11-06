"use client";

import { AlertCircle, Trash2 } from "lucide-react";

import { BaseModal } from "@/components/ui/BaseModal";

import type { PelangganDeleteModalProps } from "@/types/pelanggan.types";

import { btnGhost } from "@/utils/pelanggan.utils";

export function PelangganDeleteModal({
  customer,
  deleting,
  onClose,
  onConfirm,
}: PelangganDeleteModalProps) {
  return (
    <BaseModal
      isOpen
      onClose={() => {
        if (!deleting) onClose();
      }}
      title="Hapus Data Pelanggan"
      subtitle="Konfirmasi penghapusan data master pelanggan."
      maxWidth="md"
      icon={<AlertCircle className="w-5 h-5 text-pdam-red" />}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-pdam-red/10 text-pdam-red shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>

        <div>
          <p className="text-sm font-bold text-pdam-navy">
            Apakah kamu yakin ingin menghapus pelanggan ini?
          </p>

          <p className="text-xs text-slate-500 mt-1">
            Data pelanggan berikut akan dihapus:
          </p>

          <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-bold text-pdam-navy">{customer.nama}</p>

            <p className="text-[11px] font-mono text-slate-400 mt-0.5">
              {customer.idPelangganPdam}
            </p>

            <p className="text-[11px] text-slate-500 mt-1">{customer.cabang}</p>
          </div>

          <p className="text-[11px] text-pdam-red mt-3">
            Penghapusan tidak dapat dibatalkan. Pelanggan yang masih memiliki
            penugasan tidak dapat dihapus.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-5 mt-5 border-t border-slate-200">
        <button
          type="button"
          onClick={onClose}
          disabled={deleting}
          className={btnGhost}
        >
          Batal
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={deleting}
          className="btn btn-sm bg-pdam-red hover:bg-red-700 text-white border-0 normal-case font-semibold"
        >
          {deleting ? (
            <span className="loading loading-spinner loading-xs" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}

          {deleting ? "Menghapus..." : "Ya, Hapus"}
        </button>
      </div>
    </BaseModal>
  );
}
