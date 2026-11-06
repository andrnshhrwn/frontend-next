"use client";

import { usePelangganImport } from "@/hooks/modules/pelanggan/usePelangganImport";

import {
  AlertCircle,
  Check,
  CheckCircle2,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

import { BaseModal } from "@/components/ui/BaseModal";

import type {
  ImportPelangganError,
  ImportPelangganSkipped,
} from "@/services/pelangganService";

import type { PelangganImportModalProps } from "@/types/pelanggan.types";

import { btnGhost, btnPrimary, labelCls } from "@/utils/pelanggan.utils";

function ErrorTable({
  title,
  items,
  color,
  type,
}: {
  title: string;
  items: ImportPelangganError[] | ImportPelangganSkipped[];
  color: "red" | "amber";
  type: "error" | "skipped";
}) {
  if (items.length === 0) return null;

  return (
    <div>
      <h4 className="text-xs font-bold text-pdam-navy mb-2">
        {title} ({items.length})
      </h4>

      <div className="overflow-x-auto border border-slate-200 rounded-lg max-h-48">
        <table className="table table-xs w-full">
          <thead className="bg-pdam-bg sticky top-0">
            <tr>
              <th>Baris</th>
              <th>Kolom</th>
              <th>Keterangan</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => {
              const column =
                type === "skipped"
                  ? (item as ImportPelangganSkipped).column
                  : (item as ImportPelangganError).field;

              const message =
                type === "skipped"
                  ? (item as ImportPelangganSkipped).reason
                  : (item as ImportPelangganError).message;

              return (
                <tr key={`${item.row}-${index}`}>
                  <td className="font-mono">{item.row}</td>

                  <td className="font-medium">{column || "-"}</td>

                  <td
                    className={
                      color === "red" ? "text-red-600" : "text-amber-700"
                    }
                  >
                    {message || "Keterangan tidak tersedia."}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function PelangganImportModal({
  onClose,
  onImported,
  showToast,
}: PelangganImportModalProps) {
  const {
    file,
    previewData,
    importResult,
    loadingPreview,
    loadingImport,
    error,
    dragging,
    setDragging,
    busy,
    handleFileChange,
    handleDrop,
    handlePreview,
    handleConfirm,
    clearFile,
    resetPreview,
  } = usePelangganImport({ onImported });

  const handleClose = () => {
    if (!busy) onClose();
  };

  const downloadTemplate = () => {
    const headers = [
      "id_pelanggan_pdam",
      "kode_unit",
      "nama",
      "alamat",
      "kode_tarif",
    ];

    const example = ["", "", "", "", ""];

    const csvContent = [headers, example]
      .map((row) => row.map((value) => `"${value}"`).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "template_import_pelanggan.csv";
    link.click();

    URL.revokeObjectURL(url);

    showToast("Template import pelanggan berhasil diunduh.", "success");
  };

  const formatFileSize = (size: number) =>
    size < 1024 * 1024
      ? `${(size / 1024).toFixed(1)} KB`
      : `${(size / (1024 * 1024)).toFixed(2)} MB`;

  return (
    <BaseModal
      isOpen
      onClose={handleClose}
      title="Import Data Pelanggan"
      subtitle="Tambahkan data pelanggan secara massal menggunakan file Excel atau CSV."
      maxWidth="2xl"
    >
      <div className="space-y-5">
        <div className="rounded-lg border border-pdam-primary/20 bg-pdam-primary/5 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-pdam-navy">
                Panduan Import Data
              </h4>

              <p className="text-[11px] text-slate-500 mt-1">
                Data valid akan diimpor, duplikat dilewati, dan data tidak valid
                dilaporkan.
              </p>
            </div>

            {!importResult && (
              <button
                type="button"
                onClick={downloadTemplate}
                className="btn btn-xs btn-outline border-pdam-primary text-pdam-primary hover:bg-pdam-primary hover:text-white normal-case shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Unduh Template CSV
              </button>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {[
              "id_pelanggan_pdam",
              "kode_unit",
              "nama",
              "alamat",
              "kode_tarif",
            ].map((column) => (
              <span
                key={column}
                className="badge badge-sm bg-white border border-slate-200 text-slate-600 font-mono text-[9px]"
              >
                {column}
              </span>
            ))}
          </div>
        </div>

        {!importResult && (
          <div>
            <label className={labelCls}>Unggah File Excel / CSV</label>

            <div
              onDragOver={(e) => {
                e.preventDefault();

                if (!busy) setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-7 text-center transition-colors ${
                dragging
                  ? "border-pdam-primary bg-pdam-primary/5"
                  : "border-slate-300 bg-slate-50 hover:border-pdam-primary/50"
              } ${busy ? "opacity-60" : ""}`}
            >
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                disabled={busy}
                onChange={(e) => {
                  handleFileChange(e.target.files?.[0] ?? null);

                  e.currentTarget.value = "";
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-pdam-primary/10 text-pdam-primary flex items-center justify-center mb-3">
                  <RefreshCw className="w-6 h-6" />
                </div>

                <p className="text-sm font-bold text-pdam-navy">
                  {dragging
                    ? "Lepaskan file di sini"
                    : "Pilih atau seret file ke sini"}
                </p>

                <p className="text-[11px] text-slate-400 mt-1">
                  Format .xlsx, .xls, atau .csv
                </p>

                <span className="text-[10px] text-slate-400 mt-2">
                  Maksimal ukuran file 2 MB
                </span>
              </div>
            </div>

            {file && (
              <div className="flex items-center justify-between gap-3 mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                <div className="flex items-center gap-2 min-w-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />

                  <div className="min-w-0">
                    <p className="text-xs font-bold text-emerald-800 truncate">
                      {file.name}
                    </p>

                    <p className="text-[10px] text-emerald-700">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={busy}
                  onClick={clearFile}
                  className="btn btn-ghost btn-xs btn-square text-slate-500 shrink-0"
                  title="Hapus file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="alert alert-error text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {previewData && !importResult && (
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-pdam-navy">
                Hasil Pemeriksaan Data
              </h4>

              <button
                type="button"
                onClick={resetPreview}
                disabled={busy}
                className="text-[11px] font-semibold text-pdam-primary hover:underline"
              >
                Periksa Ulang
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-[10px] text-slate-400 font-bold uppercase">
                  Total Baris
                </p>

                <p className="text-xl font-extrabold text-pdam-navy mt-1">
                  {previewData.total_rows}
                </p>
              </div>

              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                <p className="text-[10px] text-emerald-700 font-bold uppercase">
                  Siap Import
                </p>

                <p className="text-xl font-extrabold text-emerald-700 mt-1">
                  {previewData.valid_rows}
                </p>
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="text-[10px] text-amber-700 font-bold uppercase">
                  Dilewati
                </p>

                <p className="text-xl font-extrabold text-amber-700 mt-1">
                  {previewData.skipped_rows}
                </p>
              </div>

              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="text-[10px] text-red-700 font-bold uppercase">
                  Tidak Valid
                </p>

                <p className="text-xl font-extrabold text-red-700 mt-1">
                  {previewData.invalid_rows}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
              <CheckCircle2 className="w-5 h-5 shrink-0" />

              <span>
                <strong>{previewData.valid_rows} data</strong> siap diimpor.
                Data duplikat akan dilewati dan data tidak valid tidak akan
                dimasukkan.
              </span>
            </div>

            <ErrorTable
              title="Data Dilewati"
              items={previewData.skipped}
              color="amber"
              type="skipped"
            />

            <ErrorTable
              title="Data Tidak Valid"
              items={previewData.errors}
              color="red"
              type="error"
            />

            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-xs font-bold text-pdam-navy">
                  Preview Data Pelanggan
                </h4>

                <span className="text-[10px] text-slate-400">
                  Maksimal {previewData.preview_limit} baris
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-lg max-h-64">
                <table className="table table-xs w-full">
                  <thead className="bg-pdam-bg sticky top-0">
                    <tr>
                      <th>ID Pelanggan</th>
                      <th>Nama</th>
                      <th>Alamat</th>
                      <th>Kode Unit</th>
                      <th>Kode Tarif</th>
                    </tr>
                  </thead>

                  <tbody>
                    {previewData.preview.map((item, index) => (
                      <tr key={`${item.id_pelanggan_pdam}-${index}`}>
                        <td className="font-mono">{item.id_pelanggan_pdam}</td>

                        <td>{item.nama}</td>
                        <td>{item.alamat}</td>

                        <td className="font-mono">{item.kode_unit}</td>

                        <td className="font-mono">{item.kode_tarif}</td>
                      </tr>
                    ))}

                    {previewData.preview.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-5 text-slate-400"
                        >
                          Tidak ada data untuk ditampilkan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="text-[10px] text-slate-400">
              Proses import menggunakan seluruh data valid, bukan hanya baris
              yang ditampilkan pada preview.
            </p>
          </div>
        )}

        {importResult && (
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div>
              <h4 className="text-sm font-extrabold text-pdam-navy">
                Hasil Import Pelanggan
              </h4>

              <p className="text-xs text-slate-500 mt-1">
                Proses import telah selesai. Berikut ringkasan hasilnya.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-[10px] text-emerald-700 font-bold uppercase">
                  Berhasil Diimpor
                </p>

                <p className="text-2xl font-extrabold text-emerald-700 mt-1">
                  {importResult.imported_count}
                </p>
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <p className="text-[10px] text-amber-700 font-bold uppercase">
                  Dilewati
                </p>

                <p className="text-2xl font-extrabold text-amber-700 mt-1">
                  {importResult.skipped_count}
                </p>
              </div>

              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-[10px] text-red-700 font-bold uppercase">
                  Gagal
                </p>

                <p className="text-2xl font-extrabold text-red-700 mt-1">
                  {importResult.failed_count}
                </p>
              </div>
            </div>

            <ErrorTable
              title="Data Dilewati"
              items={importResult.skipped}
              color="amber"
              type="skipped"
            />

            <ErrorTable
              title="Data yang Gagal Diimpor"
              items={importResult.errors}
              color="red"
              type="error"
            />

            {importResult.failed_count === 0 &&
            importResult.skipped_count === 0 ? (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                Seluruh data berhasil diimpor.
              </div>
            ) : (
              <p className="text-[11px] text-slate-500">
                Periksa daftar di atas untuk mengetahui baris yang dilewati atau
                gagal. Data yang berhasil diimpor sudah tersimpan.
              </p>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
          {importResult ? (
            <button type="button" onClick={onClose} className={btnPrimary}>
              <Check className="w-4 h-4" />
              Selesai
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleClose}
                disabled={busy}
                className={btnGhost}
              >
                Batal
              </button>

              {!previewData ? (
                <button
                  type="button"
                  onClick={handlePreview}
                  disabled={!file || busy}
                  className={btnPrimary}
                >
                  {loadingPreview ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}

                  {loadingPreview ? "Memeriksa..." : "Preview Data"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={
                    !previewData.can_import ||
                    previewData.valid_rows === 0 ||
                    busy
                  }
                  className={btnPrimary}
                >
                  {loadingImport ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}

                  {loadingImport ? "Mengimpor..." : "Konfirmasi Import"}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </BaseModal>
  );
}
