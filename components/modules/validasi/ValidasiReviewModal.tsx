"use client";

import { useState } from "react";

import type { TransitionEvent } from "react";

import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import { BaseModal } from "@/components/ui";

import type { ValidasiReviewModalProps } from "@/types/validasi.types";

import {
  alasanTolak,
  fmtStand,
  formatDate,
  getErrorMessage,
  getStatusLabel,
  kondisiLabel,
  statusClass,
} from "@/utils/validasi.utils";

import ValidasiPhotoViewer from "./ValidasiPhotoViewer";

interface PreviewImage {
  label: string;
  imageUrl: string;
}

interface PendingView {
  preview: PreviewImage | null;
}

export default function ValidasiReviewModal({
  item,
  onClose,
  onApprove,
  onReject,
  processing,
}: ValidasiReviewModalProps) {
  const status = getStatusLabel(item.status_validasi);

  const canValidate =
    item.status_validasi === "menunggu" &&
    item.tahap_penggantian === "menunggu_validasi";

  const [checks, setChecks] = useState({
    foto: false,
    sn: false,
    stand: false,
    kondisi: false,
  });

  const [previewImage, setPreviewImage] = useState<PreviewImage | null>(null);

  const [pendingView, setPendingView] = useState<PendingView | null>(null);

  const [isPreviewTransitioning, setIsPreviewTransitioning] = useState(false);

  const [mode, setMode] = useState<"review" | "reject">("review");
  const [alasan, setAlasan] = useState(alasanTolak[0]);
  const [catatanTolak, setCatatanTolak] = useState("");
  const [error, setError] = useState("");

  const allChecked = Object.values(checks).every(Boolean);

  const checkItems: {
    key: keyof typeof checks;
    label: string;
  }[] = [
    {
      key: "foto",
      label:
        "Foto WM lama dan WM baru terlihat jelas serta sesuai dengan laporan.",
    },
    {
      key: "sn",
      label: "Nomor seri WM baru sesuai dengan bukti dokumentasi.",
    },
    {
      key: "stand",
      label:
        "Angka stand WM lama dan stand awal WM baru sesuai dengan dokumentasi.",
    },
    {
      key: "kondisi",
      label: "Kondisi fisik WM lama sesuai dengan laporan teknisi.",
    },
  ];

  /**
   * Memulai transisi pergantian konten.
   * Konten lama akan dibuat transparan terlebih dahulu.
   */
  const transitionToView = (nextPreview: PreviewImage | null) => {
    if (isPreviewTransitioning || pendingView !== null) return;

    setPendingView({
      preview: nextPreview,
    });

    setIsPreviewTransitioning(true);
  };

  /**
   * Mengganti konten setelah animasi fade-out selesai.
   */
  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (
      event.target !== event.currentTarget ||
      event.propertyName !== "opacity" ||
      pendingView === null
    ) {
      return;
    }

    setPreviewImage(pendingView.preview);
    setPendingView(null);

    requestAnimationFrame(() => {
      setIsPreviewTransitioning(false);
    });
  };

  const openPreview = (label: string, imageUrl: string) => {
    transitionToView({
      label,
      imageUrl,
    });
  };

  const closePreview = () => {
    transitionToView(null);
  };

  const handleModalClose = () => {
    if (previewImage) {
      closePreview();
      return;
    }

    onClose();
  };

  const handleApprove = async () => {
    setError("");

    try {
      await onApprove();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleReject = async () => {
    setError("");

    const catatan =
      alasan === "Lainnya"
        ? catatanTolak.trim()
        : catatanTolak.trim()
          ? `${alasan}. ${catatanTolak.trim()}`
          : alasan;

    if (!catatan) {
      setError("Catatan penolakan wajib diisi.");
      return;
    }

    if (catatan.length > 5000) {
      setError("Catatan penolakan maksimal 5000 karakter.");
      return;
    }

    try {
      await onReject(catatan);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const pelanggan = item.penugasan.pelanggan;

  return (
    <BaseModal
      isOpen
      onClose={handleModalClose}
      title={
        previewImage
          ? `Preview Foto - ${previewImage.label}`
          : canValidate
            ? "Validasi & Approval Final BAP"
            : "Detail BAP Penggantian WM"
      }
      subtitle={`${item.penugasan.nomor_spk} • ${item.penugasan.unit.nama_unit}`}
      icon={<ShieldCheck className="w-5 h-5" />}
      maxWidth="2xl"
      preventClose={processing}
    >
      <div
        onTransitionEnd={handleTransitionEnd}
        className={`
          transition-[opacity,transform]
          duration-100
          ease-in-out
          ${
            isPreviewTransitioning
              ? "opacity-0 scale-[0.98]"
              : "opacity-100 scale-100"
          }
        `}
      >
        {previewImage ? (
          /* PHOTO PREVIEW */
          <div className="space-y-4">
            <div className="w-full h-[60vh] flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-3">
              <img
                src={previewImage.imageUrl}
                alt={previewImage.label}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
          </div>
        ) : (
          /* BAP DETAIL */
          <div className="space-y-4">
            {/* CUSTOMER SUMMARY */}

            <div className="flex items-start justify-between gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="min-w-0">
                <p className="text-sm font-bold text-pdam-navy">
                  {pelanggan.nama}
                </p>

                <p className="text-[11px] font-mono text-slate-500">
                  {pelanggan.id_pelanggan_pdam} • {pelanggan.alamat}
                </p>

                <p className="text-[11px] text-slate-500 mt-1">
                  Teknisi: <strong>{item.teknisi.fullname}</strong>
                </p>

                <p className="text-[11px] text-slate-500 mt-1">
                  Tanggal penggantian:{" "}
                  <strong>{formatDate(item.tgl_penggantian)}</strong>
                </p>
              </div>

              <span
                className={`badge badge-md font-bold border shrink-0 ${statusClass[status]}`}
              >
                {status}
              </span>
            </div>

            {/* STATUS INFORMATION */}

            {!canValidate && (
              <div
                className={`rounded-lg border p-3 text-xs flex items-start gap-2 ${
                  status === "Ditolak"
                    ? "border-pdam-red/30 bg-pdam-red/5 text-pdam-red"
                    : status === "Disetujui"
                      ? "border-emerald-500/30 bg-emerald-50 text-emerald-800"
                      : "border-slate-300 bg-slate-50 text-slate-600"
                }`}
              >
                {status === "Ditolak" ? (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                )}

                <div>
                  <strong>Status BAP:</strong> {status}
                  {item.catatan_validasi && (
                    <p className="mt-1">
                      <strong>Catatan:</strong> {item.catatan_validasi}
                    </p>
                  )}
                  {status === "Disetujui" && (
                    <p className="mt-1">
                      Nomor seri WM aktif pelanggan telah diperbarui.
                    </p>
                  )}
                  {status === "Belum Diajukan" && (
                    <p className="mt-1">
                      BAP belum berada pada tahap pengajuan validasi.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* PHOTOS */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ValidasiPhotoViewer
                label="Foto WM Lama"
                path={item.path_image_wm_lama}
                onPreview={openPreview}
              />

              <ValidasiPhotoViewer
                label="Foto WM Baru"
                path={item.path_image_wm_baru}
                onPreview={openPreview}
              />
            </div>

            {/* WM COMPARISON */}

            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <table className="table table-sm w-full text-xs">
                <thead>
                  <tr className="bg-slate-100 text-pdam-navy text-[10px] uppercase tracking-wider font-bold">
                    <th className="py-2.5 pl-4">Parameter WM</th>
                    <th className="py-2.5">WM Lama</th>
                    <th className="py-2.5">WM Baru</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2.5 pl-4 font-bold text-slate-500">
                      Nomor Seri
                    </td>

                    <td className="py-2.5 font-mono text-slate-600">
                      {item.no_seri_wm_lama ?? "-"}
                    </td>

                    <td className="py-2.5 font-mono font-bold text-pdam-primary">
                      {item.no_seri_wm_baru ?? "-"}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2.5 pl-4 font-bold text-slate-500">
                      Stand Meter
                    </td>

                    <td className="py-2.5 font-mono">
                      {fmtStand(item.stand_wm_lama)}
                    </td>

                    <td className="py-2.5 font-mono font-bold text-pdam-primary">
                      {fmtStand(item.stand_awal_wm_baru)}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2.5 pl-4 font-bold text-slate-500">
                      Kondisi Fisik WM Lama
                    </td>

                    <td className="py-2.5">
                      {kondisiLabel[item.kondisi_fisik_wm_lama]}
                    </td>

                    <td className="py-2.5 text-slate-400">-</td>
                  </tr>

                  <tr>
                    <td className="py-2.5 pl-4 font-bold text-slate-500">
                      WM Aktif Sebelumnya
                    </td>

                    <td className="py-2.5 font-mono" colSpan={2}>
                      {pelanggan.wm_no_seri_aktif ?? "-"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* APPROVAL CHECKLIST */}

            {canValidate && mode === "review" && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="text-xs font-bold text-pdam-navy uppercase mb-2">
                  Checklist Approval Admin Pusat
                </p>

                <div className="space-y-2">
                  {checkItems.map((check) => (
                    <label
                      key={check.key}
                      className="flex items-start gap-2 text-xs cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        className="checkbox checkbox-xs checkbox-primary mt-0.5"
                        checked={checks[check.key]}
                        disabled={processing}
                        onChange={(event) =>
                          setChecks((previous) => ({
                            ...previous,
                            [check.key]: event.target.checked,
                          }))
                        }
                      />

                      <span className="text-slate-700">{check.label}</span>
                    </label>
                  ))}
                </div>

                <p className="text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-200 italic">
                  Persetujuan akan memperbarui nomor seri WM aktif pelanggan
                  berdasarkan nomor seri WM baru pada BAP.
                </p>
              </div>
            )}

            {/* REJECTION FORM */}

            {canValidate && mode === "reject" && (
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-pdam-navy uppercase mb-1 block">
                    Alasan Penolakan
                  </label>

                  <select
                    className="select select-bordered select-sm w-full text-xs border-slate-200 bg-white"
                    value={alasan}
                    disabled={processing}
                    onChange={(event) => setAlasan(event.target.value)}
                  >
                    {alasanTolak.map((reason) => (
                      <option key={reason} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-pdam-navy uppercase mb-1 block">
                    Catatan Instruksi Perbaikan
                  </label>

                  <textarea
                    rows={4}
                    value={catatanTolak}
                    disabled={processing}
                    onChange={(event) => setCatatanTolak(event.target.value)}
                    placeholder={
                      alasan === "Lainnya"
                        ? "Jelaskan alasan penolakan secara spesifik..."
                        : "Tambahkan detail perbaikan jika diperlukan..."
                    }
                    maxLength={5000}
                    className="textarea textarea-bordered w-full text-xs border-slate-200"
                  />

                  <p className="text-[10px] text-slate-400 text-right mt-1">
                    {catatanTolak.length}/5000 karakter
                  </p>
                </div>
              </div>
            )}

            {/* ERROR */}

            {error && (
              <p className="text-xs text-pdam-red font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {error}
              </p>
            )}

            {/* ACTION BUTTONS */}

            <div className="flex flex-wrap items-center justify-end gap-2 pt-4 border-t border-slate-200">
              {!canValidate ? (
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-sm btn-ghost border border-slate-200 normal-case"
                >
                  Tutup
                </button>
              ) : mode === "reject" ? (
                <>
                  <button
                    type="button"
                    onClick={() => setMode("review")}
                    disabled={processing}
                    className="btn btn-sm btn-ghost border border-slate-200 normal-case"
                  >
                    Kembali
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleReject()}
                    disabled={processing}
                    className="btn btn-sm bg-pdam-red hover:bg-pdam-red/90 text-white border-0 normal-case"
                  >
                    {processing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}

                    {processing ? "Memproses..." : "Tolak BAP"}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={processing}
                    className="btn btn-sm btn-ghost border border-slate-200 normal-case"
                  >
                    Batal
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode("reject")}
                    disabled={processing}
                    className="btn btn-sm btn-outline border-pdam-red text-pdam-red hover:bg-pdam-red hover:text-white normal-case"
                  >
                    Tolak / Minta Revisi
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleApprove()}
                    disabled={!allChecked || processing}
                    className="btn btn-sm bg-pdam-primary hover:bg-pdam-navy text-white border-0 normal-case"
                  >
                    {processing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}

                    {processing ? "Memproses..." : "Setujui BAP"}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  );
}
