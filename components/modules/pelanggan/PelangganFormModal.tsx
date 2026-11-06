"use client";

import { useState } from "react";

import { AlertCircle, Check, UserPlus } from "lucide-react";

import { BaseModal } from "@/components/ui/BaseModal";

import type { PelangganFormModalProps } from "@/types/pelanggan.types";

import {
  btnGhost,
  btnPrimary,
  inputCls,
  labelCls,
  selectCls,
} from "@/utils/pelanggan.utils";

export function PelangganFormModal({
  editing,
  units,
  tariffs,
  onClose,
  onSave,
}: PelangganFormModalProps) {
  const isEdit = !!editing;

  const [form, setForm] = useState({
    id_pelanggan_pdam: editing?.idPelangganPdam ?? "",
    nama: editing?.nama ?? "",
    alamat: editing?.alamat ?? "",
    id_unit: editing?.idUnit ?? units[0]?.id_unit ?? "",
    id_tarif: editing?.idTarif ?? tariffs[0]?.id_tarif ?? "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form, value: string) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.id_pelanggan_pdam.trim()) {
      setError("ID Pelanggan PDAM wajib diisi.");
      return;
    }

    if (!form.nama.trim()) {
      setError("Nama pelanggan wajib diisi.");
      return;
    }

    if (!form.alamat.trim()) {
      setError("Alamat wajib diisi.");
      return;
    }

    if (!form.id_unit || !form.id_tarif) {
      setError("Unit dan tarif wajib dipilih.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onSave({
        id_pelanggan_pdam: form.id_pelanggan_pdam.trim(),
        nama: form.nama.trim(),
        alamat: form.alamat.trim(),
        id_unit: form.id_unit,
        id_tarif: form.id_tarif,
      });

      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal menyimpan data pelanggan.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal
      isOpen
      onClose={() => {
        if (!loading) onClose();
      }}
      title={isEdit ? "Edit Data Pelanggan" : "Tambah Pelanggan Baru"}
      subtitle={
        isEdit
          ? `${editing!.idPelangganPdam} • Nomor seri WM aktif dikelola melalui proses BAP.`
          : "Nomor seri WM aktif akan tercatat setelah proses pemasangan dan validasi BAP selesai."
      }
      maxWidth="2xl"
      icon={<UserPlus className="w-5 h-5" />}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className={labelCls}>ID Pelanggan PDAM</label>

          <input
            className={inputCls}
            maxLength={50}
            value={form.id_pelanggan_pdam}
            onChange={(e) => set("id_pelanggan_pdam", e.target.value)}
            placeholder="Masukkan ID pelanggan PDAM"
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelCls}>Nama Pelanggan</label>

          <input
            className={inputCls}
            maxLength={100}
            value={form.nama}
            onChange={(e) => set("nama", e.target.value)}
            placeholder="Contoh: Bambang Sugianto"
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelCls}>Alamat</label>

          <input
            className={inputCls}
            maxLength={255}
            value={form.alamat}
            onChange={(e) => set("alamat", e.target.value)}
            placeholder="Contoh: Jl. Danau Toba No. 42 Blok D"
          />
        </div>

        <div>
          <label className={labelCls}>Unit Cabang</label>

          <select
            className={selectCls}
            value={form.id_unit}
            onChange={(e) => set("id_unit", e.target.value)}
          >
            {units.map((unit) => (
              <option key={unit.id_unit} value={unit.id_unit}>
                {unit.nama_unit}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls}>Golongan Tarif</label>

          <select
            className={selectCls}
            value={form.id_tarif}
            onChange={(e) => set("id_tarif", e.target.value)}
          >
            {tariffs.map((tarif) => (
              <option key={tarif.id_tarif} value={tarif.id_tarif}>
                {tarif.nama_tarif}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p className="sm:col-span-2 text-xs text-pdam-red font-medium flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </p>
        )}

        <div className="sm:col-span-2 flex justify-end gap-2 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className={btnGhost}
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || units.length === 0 || tariffs.length === 0}
            className={btnPrimary}
          >
            {loading ? (
              <span className="loading loading-spinner loading-xs" />
            ) : isEdit ? (
              <Check className="w-4 h-4" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}

            {loading
              ? "Menyimpan..."
              : isEdit
                ? "Simpan Perubahan"
                : "Tambah Pelanggan"}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
