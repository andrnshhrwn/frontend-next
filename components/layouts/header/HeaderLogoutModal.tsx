"use client";

import { LogOut, ShieldAlert } from "lucide-react";

import { BaseModal } from "@/components/ui";

interface HeaderLogoutModalProps {
  isOpen: boolean;
  displayName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function HeaderLogoutModal({
  isOpen,
  displayName,
  onClose,
  onConfirm,
}: HeaderLogoutModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Konfirmasi Logout"
      maxWidth="sm"
    >
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50">
          <ShieldAlert className="h-6 w-6 text-rose-600" />
        </div>

        <h3 className="mb-2 text-sm font-bold text-slate-800">
          Apakah Anda yakin ingin keluar?
        </h3>

        <p className="text-xs leading-relaxed text-slate-500">
          Anda akan mengakhiri sesi login sebagai{" "}
          <span className="font-semibold text-slate-700">{displayName}</span>.
          Untuk mengakses sistem kembali, Anda harus login ulang.
        </p>
      </div>

      <div className="-mx-6 -mb-6 mt-6 flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-sm rounded-md border border-slate-200 bg-white px-4 text-slate-600 hover:border-slate-300 hover:bg-slate-100"
        >
          Batal
        </button>

        <button
          type="button"
          onClick={onConfirm}
          className="btn btn-sm rounded-md border border-rose-600 bg-rose-600 px-4 text-white hover:border-rose-700 hover:bg-rose-700"
        >
          <LogOut className="h-4 w-4" />
          Ya, Keluar
        </button>
      </div>
    </BaseModal>
  );
}
