"use client";

import React from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { BaseModal } from "./BaseModal";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  itemName: string;
  itemType?: string;
  warningText?: string;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Konfirmasi Hapus Data",
  itemName,
  itemType = "data",
  warningText = "Tindakan ini tidak dapat dibatalkan. Pastikan data tidak sedang berelasi aktif dengan transaksi lain.",
}: DeleteConfirmModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      icon={<AlertTriangle className="w-5 h-5 text-rose-500" />}
      maxWidth="sm"
    >
      <div className="space-y-4">
        <p className="text-xs text-slate-600 leading-relaxed">
          Apakah Anda yakin ingin menghapus {itemType}{" "}
          <span className="font-semibold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">
            {itemName}
          </span>
          ?
        </p>

        {warningText && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 text-[11px] text-rose-700 leading-relaxed">
            {warningText}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-ghost text-slate-600 hover:bg-slate-100"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="btn btn-sm bg-rose-600 hover:bg-rose-700 text-white border-none flex items-center gap-1.5 shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Hapus
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
