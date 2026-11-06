"use client";

import { useState } from "react";

import { AlertCircle } from "lucide-react";

import type { TicketView } from "@/types/penugasan.types";

import { btnGhost } from "@/utils/penugasan.utils";

import PenugasanModalShell from "./PenugasanModalShell";

interface PenugasanCancelModalProps {
  ticket: TicketView;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function PenugasanCancelModal({
  ticket,
  onClose,
  onConfirm,
}: PenugasanCancelModalProps) {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    setSubmitting(true);
    setError("");

    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal membatalkan penugasan.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PenugasanModalShell
      title="Batalkan Penugasan"
      subtitle={ticket.nomorSpk}
      onClose={submitting ? () => {} : onClose}
      footer={
        <>
          <button onClick={onClose} disabled={submitting} className={btnGhost}>
            Kembali
          </button>

          <button
            onClick={handleConfirm}
            disabled={submitting}
            className="btn btn-sm bg-red-600 hover:bg-red-700 text-white border-0 normal-case font-semibold"
          >
            {submitting ? "Memproses..." : "Ya, Batalkan Penugasan"}
          </button>
        </>
      }
    >
      <div className="space-y-3">
        <div className="rounded-lg bg-red-50 border border-red-200 p-3">
          <div className="flex gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />

            <div>
              <p className="text-xs font-bold text-red-700">
                Konfirmasi pembatalan
              </p>

              <p className="text-xs text-red-600 mt-1">
                Apakah Anda yakin ingin membatalkan penugasan ini? Status
                penugasan akan berubah menjadi <strong>Dibatalkan</strong>.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 p-3 space-y-2">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">
              Nomor SPK
            </p>

            <p className="text-xs font-semibold text-pdam-navy">
              {ticket.nomorSpk}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">
              Pelanggan
            </p>

            <p className="text-xs font-semibold text-pdam-navy">
              {ticket.pelanggan}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">
              Unit
            </p>

            <p className="text-xs font-semibold text-pdam-navy">
              {ticket.cabang}
            </p>
          </div>
        </div>

        <p className="text-[11px] text-slate-500">
          Pembatalan tidak menghapus data SPK. Data tetap tersimpan dengan
          status Dibatalkan.
        </p>

        {error && (
          <p className="text-xs text-pdam-red flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </p>
        )}
      </div>
    </PenugasanModalShell>
  );
}
