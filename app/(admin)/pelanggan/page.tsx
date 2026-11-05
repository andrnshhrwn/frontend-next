"use client";

import {
  UserPlus,
  Search,
  Info,
  X,
  AlertCircle,
  CheckCircle2,
  Check,
  MapPin,
  RefreshCw,
  Eye,
  Pencil,
  Trash2,
  Users,
  Gauge,
} from "lucide-react";

import { useEffect, useState, type ReactNode, type DragEvent } from "react";

import { pelangganService } from "@/services/pelangganService";

import type {
  ImportPelangganError,
  ImportPelangganSkipped,
  ImportPelangganPreview,
  ImportPelangganResult,
  Pelanggan as PelangganApi,
  PelangganPayload,
} from "@/services/pelangganService";

import { unitService } from "@/services/unitService";
import type { Unit } from "@/services/unitService";

import { tipeTarifService } from "@/services/tipeTarifService";
import type { TarifWithJumlahPelanggan } from "@/services/tipeTarifService";
import { StatCard } from "@/components/ui";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

type WmStatus = "Nomor Seri Tercatat" | "Nomor Seri Belum Tercatat";

type PelangganTab = "semua" | "tercatat" | "belum_tercatat";

interface Pelanggan {
  id: string;
  idPelangganPdam: string;
  nama: string;
  alamat: string;
  cabang: string;
  idUnit: string;
  tipeTarif: string;
  idTarif: string;
  wmNoSeri: string | null;
  wmStatus: WmStatus;
}

interface PelangganInput {
  id_pelanggan_pdam: string;
  nama: string;
  alamat: string;
  id_unit: string;
  id_tarif: string;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function mapPelanggan(data: PelangganApi): Pelanggan {
  const wmNoSeri = data.wm_no_seri_aktif;

  return {
    id: data.id_pelanggan,
    idPelangganPdam: data.id_pelanggan_pdam,
    nama: data.nama,
    alamat: data.alamat,
    cabang: data.unit.nama_unit,
    idUnit: data.id_unit,
    tipeTarif: data.tarif.nama_tarif,
    idTarif: data.id_tarif,
    wmNoSeri,
    wmStatus: wmNoSeri ? "Nomor Seri Tercatat" : "Nomor Seri Belum Tercatat",
  };
}

function mapPelangganPayload(data: PelangganInput): PelangganPayload {
  return {
    id_pelanggan_pdam: data.id_pelanggan_pdam,
    nama: data.nama,
    alamat: data.alamat,
    id_unit: data.id_unit,
    id_tarif: data.id_tarif,
  };
}

/* ------------------------------------------------------------------ */
/* Styles                                                             */
/* ------------------------------------------------------------------ */

const wmBadge: Record<WmStatus, string> = {
  "Nomor Seri Tercatat": "border-emerald-300 bg-emerald-50 text-emerald-700",
  "Nomor Seri Belum Tercatat": "border-amber-300 bg-amber-50 text-amber-700",
};

const labelCls = "text-[11px] font-bold text-pdam-navy uppercase mb-1 block";

const inputCls =
  "input input-bordered input-sm w-full text-xs border-slate-200 focus:border-pdam-primary";

const selectCls =
  "select select-bordered select-sm w-full text-xs border-slate-200 bg-white focus:border-pdam-primary";

const btnGhost =
  "btn btn-sm btn-ghost border border-slate-200 normal-case font-semibold text-slate-600";

const btnPrimary =
  "btn btn-sm bg-pdam-primary hover:bg-pdam-navy text-white border-0 normal-case font-semibold";

/* ------------------------------------------------------------------ */
/* Modal Shell                                                        */
/* ------------------------------------------------------------------ */

function Modal({
  title,
  subtitle,
  onClose,
  children,
  footer,
  wide,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="modal modal-open">
      <div
        className={`modal-box bg-white p-0 ${
          wide ? "max-w-2xl" : "max-w-md"
        } max-h-[92vh] flex flex-col`}
      >
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-slate-200 shrink-0">
          <div>
            <h3 className="font-extrabold text-pdam-navy">{title}</h3>

            {subtitle && (
              <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-xs btn-square text-slate-400"
            aria-label="Tutup modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 overflow-y-auto">{children}</div>

        {footer && (
          <div className="px-6 py-4 border-t border-slate-200 bg-pdam-bg/50 flex justify-end gap-2 shrink-0">
            {footer}
          </div>
        )}
      </div>

      <div className="modal-backdrop bg-black/40" onClick={onClose} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Modal: Form Pelanggan                                               */
/* ------------------------------------------------------------------ */

function CustomerFormModal({
  editing,
  units,
  tariffs,
  onClose,
  onSave,
}: {
  editing: Pelanggan | null;
  units: Unit[];
  tariffs: TarifWithJumlahPelanggan[];
  onClose: () => void;
  onSave: (data: PelangganInput) => Promise<void>;
}) {
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
    <Modal
      wide
      title={isEdit ? "Edit Data Pelanggan" : "Tambah Pelanggan Baru"}
      subtitle={
        isEdit
          ? `${editing!.idPelangganPdam} • Nomor seri WM aktif dikelola melalui proses BAP.`
          : "Nomor seri WM aktif akan tercatat setelah proses pemasangan dan validasi BAP selesai."
      }
      onClose={onClose}
      footer={
        <>
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
        </>
      }
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
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Modal: Detail Pelanggan                                             */
/* ------------------------------------------------------------------ */

function DetailModal({
  customer,
  onClose,
  onEdit,
}: {
  customer: Pelanggan;
  onClose: () => void;
  onEdit: () => void;
}) {
  const Row = ({ k, v }: { k: string; v: ReactNode }) => (
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        {k}
      </p>

      <p className="text-xs font-semibold text-pdam-navy mt-0.5">{v}</p>
    </div>
  );

  return (
    <Modal
      wide
      title="Detail Pelanggan"
      subtitle="Informasi master pelanggan."
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className={btnGhost}>
            Tutup
          </button>

          <button type="button" onClick={onEdit} className={btnPrimary}>
            Edit Data
          </button>
        </>
      }
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
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Modal: Import Excel Pelanggan                                      */
/* ------------------------------------------------------------------ */

function ImportPelangganModal({
  onClose,
  onImported,
}: {
  onClose: () => void;
  onImported: (count: number) => Promise<void>;
}) {
  const [file, setFile] = useState<File | null>(null);

  const [previewData, setPreviewData] = useState<ImportPelangganPreview | null>(
    null,
  );

  const [importResult, setImportResult] =
    useState<ImportPelangganResult | null>(null);

  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingImport, setLoadingImport] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  // Sesuaikan dengan batas MAX_FILE_SIZE backend jika middleware
  // menggunakan batas global yang sama.
  const MAX_FILE_SIZE = 2 * 1024 * 1024;

  const busy = loadingPreview || loadingImport;

  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) return;

    const extension = selectedFile.name.split(".").pop()?.toLowerCase();

    if (!["xlsx", "xls", "csv"].includes(extension ?? "")) {
      setError("Format file harus .xlsx, .xls, atau .csv.");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("Ukuran file maksimal 2 MB.");
      return;
    }

    setFile(selectedFile);
    setPreviewData(null);
    setImportResult(null);
    setError("");
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);

    if (busy || importResult) return;

    handleFileChange(e.dataTransfer.files?.[0] ?? null);
  };

  const handlePreview = async () => {
    if (!file) {
      setError("Pilih file terlebih dahulu.");
      return;
    }

    setLoadingPreview(true);
    setError("");
    setPreviewData(null);

    try {
      const result = await pelangganService.previewImport(file);
      setPreviewData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal memproses file pelanggan.",
      );
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleConfirm = async () => {
    if (!previewData?.can_import || previewData.rows.length === 0) {
      return;
    }

    setLoadingImport(true);
    setError("");

    try {
      const result = await pelangganService.confirmImport(previewData.rows);

      setImportResult(result);

      await onImported(result.imported_count);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal mengimpor data pelanggan.",
      );
    } finally {
      setLoadingImport(false);
    }
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
  };

  const formatFileSize = (size: number) =>
    size < 1024 * 1024
      ? `${(size / 1024).toFixed(1)} KB`
      : `${(size / (1024 * 1024)).toFixed(2)} MB`;

  const ErrorTable = ({
    title,
    items,
    color,
    type,
  }: {
    title: string;
    items: ImportPelangganError[] | ImportPelangganSkipped[];
    color: "red" | "amber";
    type: "error" | "skipped";
  }) => {
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
  };

  return (
    <Modal
      wide
      title="Import Data Pelanggan"
      subtitle="Tambahkan data pelanggan secara massal menggunakan file Excel atau CSV."
      onClose={() => {
        if (!busy) onClose();
      }}
      footer={
        <>
          {importResult ? (
            <button type="button" onClick={onClose} className={btnPrimary}>
              <Check className="w-4 h-4" />
              Selesai
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
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
        </>
      }
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
                  onClick={() => {
                    setFile(null);
                    setPreviewData(null);
                    setImportResult(null);
                    setError("");
                  }}
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
                onClick={() => {
                  setPreviewData(null);
                  setError("");
                }}
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
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Page Utama                                                         */
/* ------------------------------------------------------------------ */

export default function PelangganPage() {
  const [customers, setCustomers] = useState<Pelanggan[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [tariffs, setTariffs] = useState<TarifWithJumlahPelanggan[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [importOpen, setImportOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Pelanggan | null>(null);

  const [deleting, setDeleting] = useState(false);

  const [tab, setTab] = useState<PelangganTab>("semua");
  const [search, setSearch] = useState("");
  const [cabangFilter, setCabangFilter] = useState("");
  const [tarifFilter, setTarifFilter] = useState("");

  const [formState, setFormState] = useState<{
    open: boolean;
    id: string | null;
  }>({
    open: false,
    id: null,
  });

  const [detailId, setDetailId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  /* ---------------------------------------------------------------- */
  /* Load Data                                                        */
  /* ---------------------------------------------------------------- */

  const loadData = async () => {
    setLoading(true);
    setPageError(null);

    try {
      const [pelangganData, unitData, tarifData] = await Promise.all([
        pelangganService.findAll(),
        unitService.findAll(),
        tipeTarifService.findAll(),
      ]);

      setCustomers(pelangganData.map(mapPelanggan));
      setUnits(unitData);
      setTariffs(tarifData);
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "Gagal mengambil data pelanggan.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  /* ---------------------------------------------------------------- */
  /* Toast                                                            */
  /* ---------------------------------------------------------------- */

  const showToast = (message: string) => {
    setToast(message);

    window.setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  /* ---------------------------------------------------------------- */
  /* Selected Data                                                    */
  /* ---------------------------------------------------------------- */

  const editingCustomer =
    customers.find((customer) => customer.id === formState.id) ?? null;

  const detailCustomer =
    customers.find((customer) => customer.id === detailId) ?? null;

  /* ---------------------------------------------------------------- */
  /* Statistik Pelanggan                                              */
  /* ---------------------------------------------------------------- */

  const totalPelanggan = customers.length;

  const totalWmTercatat = customers.filter(
    (customer) => !!customer.wmNoSeri,
  ).length;

  const totalWmBelumTercatat = totalPelanggan - totalWmTercatat;

  /* ---------------------------------------------------------------- */
  /* Filter                                                           */
  /* ---------------------------------------------------------------- */

  const filtered = customers.filter((customer) => {
    const q = search.toLowerCase();

    const matchesWmStatus =
      tab === "semua" ||
      (tab === "tercatat" && !!customer.wmNoSeri) ||
      (tab === "belum_tercatat" && !customer.wmNoSeri);

    return (
      matchesWmStatus &&
      (!cabangFilter || customer.idUnit === cabangFilter) &&
      (!tarifFilter || customer.idTarif === tarifFilter) &&
      (!q ||
        customer.idPelangganPdam.toLowerCase().includes(q) ||
        customer.nama.toLowerCase().includes(q) ||
        customer.alamat.toLowerCase().includes(q) ||
        (customer.wmNoSeri ?? "").toLowerCase().includes(q))
    );
  });

  /* ---------------------------------------------------------------- */
  /* Pagination                                                       */
  /* ---------------------------------------------------------------- */

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const safeCurrentPage = Math.min(currentPage, Math.max(totalPages, 1));

  const startIndex =
    totalItems === 0 ? 0 : (safeCurrentPage - 1) * itemsPerPage;

  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const displayedCustomers = filtered.slice(
    startIndex,
    safeCurrentPage * itemsPerPage,
  );

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);
  };

  /* ---------------------------------------------------------------- */
  /* Save Customer                                                    */
  /* ---------------------------------------------------------------- */

  const handleSaveCustomer = async (data: PelangganInput) => {
    const payload = mapPelangganPayload(data);

    if (editingCustomer) {
      await pelangganService.update(editingCustomer.id, payload);

      showToast(`Data ${data.nama} berhasil diperbarui.`);
    } else {
      await pelangganService.create(payload);

      showToast(`Pelanggan ${data.nama} berhasil ditambahkan.`);
    }

    setFormState({
      open: false,
      id: null,
    });

    setCurrentPage(1);

    await loadData();
  };

  /* ---------------------------------------------------------------- */
  /* Delete Customer                                                  */
  /* ---------------------------------------------------------------- */

  const handleDeleteCustomer = async () => {
    if (!deleteTarget) return;

    setDeleting(true);

    try {
      await pelangganService.delete(deleteTarget.id);

      showToast(`Pelanggan ${deleteTarget.nama} berhasil dihapus.`);

      setDeleteTarget(null);

      await loadData();
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Gagal menghapus data pelanggan.",
      );
    } finally {
      setDeleting(false);
    }
  };

  /* ---------------------------------------------------------------- */
  /* Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs text-slate-500 mb-1">
          <span className="font-semibold text-pdam-primary">
            PAM Tirta Kamuning
          </span>{" "}
          / Master Data /{" "}
          <span className="text-pdam-primary font-semibold">
            Data Pelanggan
          </span>
        </p>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-pdam-navy">
                Manajemen Data Pelanggan
              </h1>

              <span className="badge bg-pdam-primary/10 text-pdam-primary border-pdam-primary/20 text-[10px] font-bold">
                Master Data Pusat
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-0.5">
              Pengelolaan master data pelanggan terpusat. Data nomor seri WM
              aktif akan diperbarui melalui proses validasi BAP penggantian.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setImportOpen(true)}
              disabled={loading}
              className="btn btn-sm btn-outline border-pdam-primary text-pdam-primary hover:bg-pdam-primary hover:text-white normal-case font-semibold"
            >
              <RefreshCw className="w-4 h-4" />
              Import Excel
            </button>

            <button
              type="button"
              onClick={() => setFormState({ open: true, id: null })}
              disabled={loading || units.length === 0 || tariffs.length === 0}
              className="btn btn-sm bg-pdam-primary hover:bg-pdam-navy text-white font-semibold normal-case border-0 shadow-xs"
            >
              <UserPlus className="w-4 h-4" />
              <span>Tambah Pelanggan Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="card bg-pdam-navy/5 border border-pdam-navy/20 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-pdam-navy/10 text-pdam-navy shrink-0 mt-0.5">
            <Info className="w-5 h-5" />
          </div>

          <div>
            <h4 className="font-bold text-xs text-pdam-navy">
              Informasi Pencatatan Nomor Seri WM
            </h4>

            <p className="text-xs text-slate-600 mt-1">
              Nomor seri WM aktif dikelola melalui proses BAP. Setelah BAP
              penggantian divalidasi oleh Pusat, nomor seri meter baru akan
              terhubung ke data pelanggan. Status belum tercatat hanya
              menunjukkan bahwa nomor seri belum tersimpan dalam sistem.
            </p>
          </div>
        </div>
      </div>

      {/* Statistik Pelanggan */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Pelanggan"
          value={loading ? "..." : totalPelanggan}
          subtext="Seluruh data pelanggan terdaftar"
          icon={<Users className="w-5 h-5" />}
          variant="navy"
          active={tab === "semua"}
          onClick={() => {
            setTab("semua");
            setCurrentPage(1);
          }}
        />

        <StatCard
          title="Nomor Seri Tercatat"
          value={loading ? "..." : totalWmTercatat}
          subtext="Pelanggan dengan nomor seri WM aktif"
          icon={<Gauge className="w-5 h-5" />}
          variant="emerald"
          active={tab === "tercatat"}
          onClick={() => {
            setTab("tercatat");
            setCurrentPage(1);
          }}
        />

        <StatCard
          title="Nomor Seri Belum Tercatat"
          value={loading ? "..." : totalWmBelumTercatat}
          subtext="Nomor seri WM belum tersimpan di sistem"
          icon={<AlertCircle className="w-5 h-5" />}
          variant="amber"
          active={tab === "belum_tercatat"}
          onClick={() => {
            setTab("belum_tercatat");
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Error State */}
      {pageError && (
        <div className="alert alert-error text-xs">
          <AlertCircle className="w-5 h-5" />

          <span>{pageError}</span>

          <button
            type="button"
            onClick={() => void loadData()}
            className="btn btn-sm btn-ghost"
          >
            <RefreshCw className="w-4 h-4" />
            Coba Lagi
          </button>
        </div>
      )}

      {/* Filter & Search */}
      <div className="card bg-white border border-slate-200/90 shadow-xs p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-slate-200">
          {[
            { v: "semua", label: "Semua Pelanggan" },
            { v: "tercatat", label: "Nomor Seri Tercatat" },
            {
              v: "belum_tercatat",
              label: "Nomor Seri Belum Tercatat",
            },
          ].map((item) => (
            <button
              type="button"
              key={item.v}
              onClick={() => {
                setTab(item.v as PelangganTab);
                setCurrentPage(1);
              }}
              className={`btn btn-sm font-medium normal-case ${
                tab === item.v
                  ? "bg-pdam-primary hover:bg-pdam-navy text-white border-0 shadow-xs"
                  : "btn-ghost bg-pdam-bg hover:bg-slate-200 border border-slate-200/80 text-slate-700"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari ID Pelanggan, Nama, Alamat, atau No. Seri WM..."
            className="input input-bordered input-sm w-full pl-9 text-xs bg-pdam-bg/50 border-slate-200 focus:border-pdam-primary focus:bg-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select
            className={selectCls}
            value={cabangFilter}
            onChange={(e) => {
              setCabangFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Semua Unit Cabang</option>

            {units.map((unit) => (
              <option key={unit.id_unit} value={unit.id_unit}>
                {unit.nama_unit}
              </option>
            ))}
          </select>

          <select
            className={selectCls}
            value={tarifFilter}
            onChange={(e) => {
              setTarifFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Semua Golongan Tarif</option>

            {tariffs.map((tarif) => (
              <option key={tarif.id_tarif} value={tarif.id_tarif}>
                {tarif.nama_tarif}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Data Pelanggan */}
      <div className="card bg-white border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-sm w-full">
            <thead>
              <tr className="bg-pdam-bg text-pdam-navy text-[11px] uppercase tracking-wider border-b border-slate-200 font-bold">
                <th className="py-3.5 pl-5">ID &amp; NAMA PELANGGAN</th>

                <th className="py-3.5">ALAMAT &amp; UNIT CABANG</th>

                <th className="py-3.5">GOLONGAN TARIF</th>

                <th className="py-3.5">PENCATATAN NOMOR SERI WM</th>

                <th className="py-3.5 text-right pr-5">AKSI</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <span className="loading loading-spinner loading-md text-pdam-primary" />

                    <p className="text-xs text-slate-500 mt-2">
                      Memuat data pelanggan...
                    </p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Tidak ada data pelanggan yang ditemukan.
                  </td>
                </tr>
              ) : (
                displayedCustomers.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-pdam-bg/60 transition-colors"
                  >
                    <td className="py-3.5 pl-5">
                      <span className="font-bold text-pdam-navy block">
                        {item.nama}
                      </span>

                      <span className="text-[10px] font-mono text-slate-400">
                        {item.idPelangganPdam}
                      </span>
                    </td>

                    <td className="py-3.5">
                      <span className="text-slate-600 block">
                        {item.alamat}
                      </span>

                      <span className="font-bold text-[11px] text-pdam-navy">
                        {item.cabang}
                      </span>
                    </td>

                    <td className="py-3.5">
                      <span className="font-medium text-slate-700">
                        {item.tipeTarif}
                      </span>
                    </td>

                    <td className="py-3.5">
                      {item.wmNoSeri ? (
                        <div>
                          <span
                            className={`badge badge-xs font-bold border ${wmBadge[item.wmStatus]}`}
                          >
                            Nomor Seri Tercatat
                          </span>

                          <span className="font-mono text-[10px] text-slate-500 block mt-1">
                            {item.wmNoSeri}
                          </span>
                        </div>
                      ) : (
                        <span
                          className={`badge badge-xs font-bold border ${wmBadge[item.wmStatus]}`}
                        >
                          Nomor Seri Belum Tercatat
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 text-right pr-5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setDetailId(item.id)}
                          title="Detail pelanggan"
                          aria-label={`Detail pelanggan ${item.nama}`}
                          className="btn btn-ghost btn-xs btn-square text-emerald-700 hover:bg-emerald-700/10"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setFormState({
                              open: true,
                              id: item.id,
                            })
                          }
                          title="Edit pelanggan"
                          aria-label={`Edit pelanggan ${item.nama}`}
                          className="btn btn-ghost btn-xs btn-square text-pdam-primary hover:bg-pdam-primary/10"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteTarget(item)}
                          title="Hapus pelanggan"
                          aria-label={`Hapus pelanggan ${item.nama}`}
                          className="btn btn-ghost btn-xs btn-square text-pdam-red hover:bg-pdam-red/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!loading && totalItems > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 px-1">
          <p className="text-xs text-slate-500">
            Menampilkan{" "}
            <span className="font-bold text-pdam-navy">
              {startIndex + 1}-{endIndex}
            </span>{" "}
            dari <span className="font-bold text-pdam-navy">{totalItems}</span>{" "}
            pelanggan
          </p>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => goToPage(safeCurrentPage - 1)}
              disabled={safeCurrentPage === 1}
              className="btn btn-sm btn-ghost border border-slate-200 text-slate-600 disabled:opacity-40"
            >
              Sebelumnya
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - safeCurrentPage) <= 1,
              )
              .reduce<(number | "dots")[]>((result, page, index, pages) => {
                if (index > 0 && page - pages[index - 1] > 1) {
                  result.push("dots");
                }

                result.push(page);

                return result;
              }, [])
              .map((page, index) =>
                page === "dots" ? (
                  <span
                    key={`dots-${index}`}
                    className="px-2 text-slate-400 text-xs"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    type="button"
                    onClick={() => goToPage(page)}
                    className={`btn btn-sm min-w-9 ${
                      safeCurrentPage === page
                        ? "bg-pdam-primary text-white border-pdam-primary"
                        : "btn-ghost border border-slate-200 text-slate-600"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

            <button
              type="button"
              onClick={() => goToPage(safeCurrentPage + 1)}
              disabled={totalPages === 0 || safeCurrentPage === totalPages}
              className="btn btn-sm btn-ghost border border-slate-200 text-slate-600 disabled:opacity-40"
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}

      {/* Modal Import Excel */}
      {importOpen && (
        <ImportPelangganModal
          onClose={() => setImportOpen(false)}
          onImported={async (count) => {
            showToast(`${count} data pelanggan berhasil diimpor.`);
            await loadData();
          }}
        />
      )}

      {/* Modal Form */}
      {formState.open && (
        <CustomerFormModal
          key={formState.id ?? "new"}
          editing={editingCustomer}
          units={units}
          tariffs={tariffs}
          onClose={() =>
            setFormState({
              open: false,
              id: null,
            })
          }
          onSave={handleSaveCustomer}
        />
      )}

      {/* Modal Detail */}
      {detailCustomer && (
        <DetailModal
          customer={detailCustomer}
          onClose={() => setDetailId(null)}
          onEdit={() => {
            setDetailId(null);

            setFormState({
              open: true,
              id: detailCustomer.id,
            });
          }}
        />
      )}

      {/* Modal Delete */}
      {deleteTarget && (
        <Modal
          title="Hapus Data Pelanggan"
          subtitle="Konfirmasi penghapusan data master pelanggan."
          onClose={() => {
            if (!deleting) setDeleteTarget(null);
          }}
          footer={
            <>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className={btnGhost}
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleDeleteCustomer}
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
            </>
          }
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
                <p className="text-xs font-bold text-pdam-navy">
                  {deleteTarget.nama}
                </p>

                <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                  {deleteTarget.idPelangganPdam}
                </p>

                <p className="text-[11px] text-slate-500 mt-1">
                  {deleteTarget.cabang}
                </p>
              </div>

              <p className="text-[11px] text-pdam-red mt-3">
                Penghapusan tidak dapat dibatalkan. Pelanggan yang masih
                memiliki penugasan tidak dapat dihapus.
              </p>
            </div>
          </div>
        </Modal>
      )}

      {/* Toast */}
      {toast && (
        <div className="toast toast-end z-50">
          <div className="alert bg-pdam-navy text-white text-xs shadow-lg border-0 py-2.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toast}</span>
          </div>
        </div>
      )}
    </div>
  );
}
