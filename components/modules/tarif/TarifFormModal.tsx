import type { Dispatch, SetStateAction } from "react";
import { AlertCircle, LoaderCircle, Tags } from "lucide-react";
import { BaseModal } from "@/components/ui";

import type { Tarif, TarifForm } from "@/types/tarif.types";

interface TarifFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editing: Tarif | null;
  form: TarifForm;
  setForm: Dispatch<SetStateAction<TarifForm>>;
  formError: string;
  saving: boolean;
  onSave: () => void;
}

export default function TarifFormModal({
  isOpen,
  onClose,
  editing,
  form,
  setForm,
  formError,
  saving,
  onSave,
}: TarifFormModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        editing ? "Ubah Data Golongan Tarif" : "Tambah Golongan Tarif Baru"
      }
      subtitle="Data akan disimpan pada master golongan tarif."
      icon={<Tags className="h-5 w-5 text-pdam-primary" />}
      maxWidth="sm"
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">
            Kode Tarif
          </label>

          <input
            type="text"
            value={form.kode_tarif}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                kode_tarif: event.target.value.toUpperCase(),
              }))
            }
            maxLength={20}
            placeholder="Contoh: KU"
            disabled={saving}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-pdam-primary focus:outline-none focus:ring-2 focus:ring-pdam-primary/30 disabled:bg-slate-100"
          />

          <span className="mt-1 block text-[10px] text-slate-400">
            Masukkan kode unik untuk golongan tarif.
          </span>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">
            Nama Golongan Tarif
          </label>

          <input
            type="text"
            value={form.nama_tarif}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                nama_tarif: event.target.value,
              }))
            }
            maxLength={100}
            placeholder="Contoh: KERAN UMUM"
            disabled={saving}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-pdam-primary focus:outline-none focus:ring-2 focus:ring-pdam-primary/30 disabled:bg-slate-100"
          />

          <span className="mt-1 block text-[10px] text-slate-400">
            Masukkan nama golongan tarif pelanggan.
          </span>
        </div>

        {formError && (
          <div className="flex items-center gap-2 rounded-lg border border-rose-100 bg-rose-50 p-3 text-xs text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="btn btn-sm btn-ghost text-slate-600 hover:bg-slate-100"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="btn btn-sm border-none bg-pdam-primary text-white shadow-xs hover:bg-pdam-navy disabled:opacity-50"
          >
            {saving && <LoaderCircle className="h-3.5 w-3.5 animate-spin" />}

            {saving ? "Menyimpan..." : editing ? "Simpan Perubahan" : "Simpan"}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
