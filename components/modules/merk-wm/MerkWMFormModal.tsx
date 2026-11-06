"use client";

import { AlertCircle, Gauge, LoaderCircle } from "lucide-react";

import { BaseModal } from "@/components/ui";

import type { MerkWMFormState } from "@/types/merkWM.types";

interface MerkWMFormModalProps {
  isOpen: boolean;
  editing: boolean;
  saving: boolean;
  form: MerkWMFormState;
  error: string;
  onClose: () => void;
  onSave: () => void;
  onFormChange: (
    updater: (current: MerkWMFormState) => MerkWMFormState,
  ) => void;
}

export default function MerkWMFormModal({
  isOpen,
  editing,
  saving,
  form,
  error,
  onClose,
  onSave,
  onFormChange,
}: MerkWMFormModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={editing ? "Ubah Data Merk" : "Tambah Merk Water Meter Baru"}
      subtitle="Data akan disimpan pada master merk water meter."
      icon={<Gauge className="h-5 w-5 text-pdam-primary" />}
      maxWidth="sm"
      preventClose={saving}
    >
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          onSave();
        }}
      >
        <div>
          <label
            htmlFor="kode_wm"
            className="mb-1 block text-xs font-semibold text-slate-700"
          >
            Kode WM
          </label>

          <input
            id="kode_wm"
            type="text"
            value={form.kode_wm}
            onChange={(event) =>
              onFormChange((current) => ({
                ...current,
                kode_wm: event.target.value,
              }))
            }
            maxLength={20}
            placeholder="Contoh: 001"
            disabled={saving}
            required
            autoFocus
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-pdam-primary focus:outline-none focus:ring-2 focus:ring-pdam-primary/30 disabled:bg-slate-100"
          />

          <span className="mt-1 block text-[10px] text-slate-400">
            Kode harus unik dan maksimal 20 karakter.
          </span>
        </div>

        <div>
          <label
            htmlFor="merk_wm"
            className="mb-1 block text-xs font-semibold text-slate-700"
          >
            Nama Merk
          </label>

          <input
            id="merk_wm"
            type="text"
            value={form.merk_wm}
            onChange={(event) =>
              onFormChange((current) => ({
                ...current,
                merk_wm: event.target.value,
              }))
            }
            maxLength={50}
            placeholder="Contoh: Itron, Onda, Linflow"
            disabled={saving}
            required
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-pdam-primary focus:outline-none focus:ring-2 focus:ring-pdam-primary/30 disabled:bg-slate-100"
          />

          <span className="mt-1 block text-[10px] text-slate-400">
            Maksimal 50 karakter nama merk.
          </span>
        </div>

        <div>
          <label
            htmlFor="wm_digit"
            className="mb-1 block text-xs font-semibold text-slate-700"
          >
            Jumlah Digit Stand Meter
          </label>

          <input
            id="wm_digit"
            type="number"
            min={1}
            step={1}
            value={form.wm_digit}
            onChange={(event) =>
              onFormChange((current) => ({
                ...current,
                wm_digit: event.target.value,
              }))
            }
            disabled={saving}
            required
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-pdam-primary focus:outline-none focus:ring-2 focus:ring-pdam-primary/30 disabled:bg-slate-100"
          />

          <span className="mt-1 block text-[10px] text-slate-400">
            Harus berupa bilangan bulat positif.
          </span>
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-center gap-2 rounded-lg border border-rose-100 bg-rose-50 p-3 text-xs text-rose-700"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="btn btn-sm btn-ghost text-slate-600 hover:bg-slate-100 disabled:opacity-50"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={saving}
            className="btn btn-sm border-none bg-pdam-primary text-white shadow-xs hover:bg-pdam-primary/90 disabled:opacity-50"
          >
            {saving && <LoaderCircle className="h-3.5 w-3.5 animate-spin" />}

            {saving ? "Menyimpan..." : editing ? "Simpan Perubahan" : "Simpan"}
          </button>
        </div>
      </form>
    </BaseModal>
  );
}
