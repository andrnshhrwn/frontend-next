import { Plus, Truck, X } from "lucide-react";

import { BaseModal } from "@/components/ui";

import type { PengirimanWmFormProps } from "@/types/pengirimanWm.types";

export default function PengirimanFormModal({
  isOpen,
  isSaving,
  isEditing,
  noPengiriman,
  tglPengiriman,
  unitTujuan,
  catatan,
  details,
  unitList,
  merkList,
  errorMessage,
  onClose,
  onSubmit,
  onNoPengirimanChange,
  onTglPengirimanChange,
  onUnitTujuanChange,
  onCatatanChange,
  onAddDetail,
  onDetailChange,
  onRemoveDetail,
}: PengirimanWmFormProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={() => {
        if (!isSaving) onClose();
      }}
      title={
        isEditing
          ? "Edit Pengiriman Water Meter"
          : "Catat Pengiriman Water Meter"
      }
      subtitle="Lengkapi informasi pengiriman dan rincian WM yang dikirim ke unit cabang."
      icon={<Truck className="h-5 w-5" />}
      maxWidth="2xl"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {errorMessage && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              No. Pengiriman
            </label>
            <input
              type="text"
              placeholder="Contoh: SHIP/2026/10/001"
              value={noPengiriman}
              onChange={(event) => onNoPengirimanChange(event.target.value)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-pdam-primary/20"
              maxLength={50}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Tanggal Pengiriman
            </label>
            <input
              type="date"
              value={tglPengiriman}
              onChange={(event) => onTglPengirimanChange(event.target.value)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-pdam-primary/20"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">
            Unit Cabang Tujuan
          </label>
          <select
            value={unitTujuan}
            onChange={(event) => onUnitTujuanChange(event.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-pdam-primary/20"
            required
          >
            <option value="">Pilih Unit Tujuan</option>
            {unitList.map((unit) => (
              <option key={unit.id_unit} value={unit.id_unit}>
                {unit.nama_unit}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 border-t border-slate-100 pt-3">
          <div className="flex items-center justify-between gap-3">
            <label className="block text-xs font-bold text-slate-800">
              Rincian Jumlah berdasarkan Merk WM
            </label>

            <button
              type="button"
              onClick={onAddDetail}
              disabled={isSaving}
              className="flex items-center gap-1 text-xs font-semibold text-pdam-primary hover:underline disabled:opacity-50"
            >
              <Plus className="h-3 w-3" />
              Tambah Merk
            </button>
          </div>

          {details.map((detail, index) => (
            <div
              key={index}
              className="grid grid-cols-1 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 p-2.5 sm:grid-cols-[1fr_130px_110px_auto]"
            >
              <select
                value={detail.id_merk}
                onChange={(event) =>
                  onDetailChange(index, "id_merk", event.target.value)
                }
                className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs focus:outline-none"
                required
              >
                <option value="">Pilih Merk WM</option>
                {merkList.map((merk) => (
                  <option key={merk.id_merk} value={merk.id_merk}>
                    {merk.merk_wm}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Ukuran DN"
                value={detail.ukuran_dn}
                onChange={(event) =>
                  onDetailChange(index, "ukuran_dn", event.target.value)
                }
                maxLength={20}
                className="w-full rounded-md border border-slate-200 px-2 py-1.5 font-mono text-xs focus:outline-none"
                required
              />

              <input
                type="number"
                placeholder="Jumlah"
                value={detail.jumlah}
                onChange={(event) =>
                  onDetailChange(index, "jumlah", Number(event.target.value))
                }
                className="w-full rounded-md border border-slate-200 px-2 py-1.5 font-mono text-xs font-bold focus:outline-none"
                min="1"
                step="1"
                required
              />

              <button
                type="button"
                onClick={() => onRemoveDetail(index)}
                disabled={isSaving || details.length <= 1}
                className="p-1 text-red-500 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-30"
                title="Hapus rincian"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}

          {details.length === 0 && (
            <p className="text-xs italic text-slate-400">
              Belum ada rincian WM. Klik Tambah Merk untuk menambahkan.
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">
            Catatan
          </label>
          <textarea
            rows={2}
            placeholder="Catatan pengiriman..."
            value={catatan}
            onChange={(event) => onCatatanChange(event.target.value)}
            maxLength={5000}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-pdam-primary/20"
          />
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="btn btn-ghost btn-sm rounded-md text-slate-600"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="btn btn-sm rounded-md border-none bg-pdam-primary text-white hover:bg-pdam-primary/90 disabled:opacity-50"
          >
            {isSaving
              ? "Menyimpan..."
              : isEditing
                ? "Simpan Perubahan"
                : "Simpan Catatan Pengiriman"}
          </button>
        </div>
      </form>
    </BaseModal>
  );
}
