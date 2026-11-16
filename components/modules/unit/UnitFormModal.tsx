import type { Dispatch, FormEvent, SetStateAction } from "react";
import { LoaderCircle } from "lucide-react";
import { BaseModal } from "@/components/ui";

import type { Unit, UnitForm } from "@/types/unit.types";

interface UnitFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  editing: Unit | null;
  form: UnitForm;
  setForm: Dispatch<SetStateAction<UnitForm>>;
  formError: string;
  saving: boolean;
}

export default function UnitFormModal({
  isOpen,
  onClose,
  onSubmit,
  editing,
  form,
  setForm,
  formError,
  saving,
}: UnitFormModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={editing ? "Edit Unit" : "Tambah Unit"}
    >
      <form className="space-y-5" onSubmit={onSubmit}>
        <div>
          <label
            htmlFor="kode_unit"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Kode Unit
          </label>

          <input
            id="kode_unit"
            type="text"
            value={form.kode_unit}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                kode_unit: event.target.value,
              }))
            }
            maxLength={20}
            required
            autoFocus
            disabled={saving}
            placeholder="Contoh: 01"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
          />
        </div>

        <div>
          <label
            htmlFor="nama_unit"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Nama Unit
          </label>

          <input
            id="nama_unit"
            type="text"
            value={form.nama_unit}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                nama_unit: event.target.value,
              }))
            }
            maxLength={100}
            required
            disabled={saving}
            placeholder="Masukkan nama unit"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
          />
        </div>

        {formError && (
          <p role="alert" className="text-sm text-red-600">
            {formError}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className="btn btn-sm btn-outline"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={saving}
            className="btn btn-sm border-none bg-pdam-primary text-white hover:bg-pdam-navy disabled:opacity-50"
          >
            {saving && <LoaderCircle className="h-3.5 w-3.5 animate-spin" />}
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </BaseModal>
  );
}
