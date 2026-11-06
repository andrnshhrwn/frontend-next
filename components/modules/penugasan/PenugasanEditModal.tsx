"use client";

import { useState } from "react";

import { AlertCircle } from "lucide-react";

import type {
  PenugasanUpdatePayload,
  TicketView,
} from "@/types/penugasan.types";

import { btnGhost, btnPrimary, labelCls } from "@/utils/penugasan.utils";

import PenugasanModalShell from "./PenugasanModalShell";

interface PenugasanEditModalProps {
  ticket: TicketView;
  onClose: () => void;
  onSave: (id: string, payload: PenugasanUpdatePayload) => Promise<void>;
}

export default function PenugasanEditModal({
  ticket,
  onClose,
  onSave,
}: PenugasanEditModalProps) {
  const [alasan, setAlasan] = useState(ticket.raw.alasan);
  const [tanggal, setTanggal] = useState(ticket.raw.tgl_penugasan.slice(0, 16));
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!alasan.trim()) {
      setError("Alasan penugasan wajib diisi.");
      return;
    }

    if (!tanggal) {
      setError("Tanggal penugasan wajib diisi.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await onSave(ticket.id, {
        alasan: alasan.trim(),
        tgl_penugasan: new Date(tanggal).toISOString(),
      });

      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal memperbarui penugasan.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PenugasanModalShell
      title="Edit Penugasan"
      subtitle={`${ticket.nomorSpk} • ${ticket.pelanggan}`}
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className={btnGhost}>
            Batal
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={btnPrimary}
          >
            {submitting ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className={labelCls}>Tanggal Penugasan</label>

          <input
            type="datetime-local"
            value={tanggal}
            onChange={(event) => setTanggal(event.target.value)}
            className="input input-bordered input-sm w-full text-xs border-slate-200"
          />
        </div>

        <div>
          <label className={labelCls}>Alasan Penugasan</label>

          <textarea
            value={alasan}
            onChange={(event) => setAlasan(event.target.value)}
            rows={4}
            maxLength={255}
            className="textarea textarea-bordered w-full text-xs border-slate-200"
            placeholder="Masukkan alasan penugasan..."
          />
        </div>

        <p className="text-[11px] text-slate-400">
          Pelanggan dan unit tidak dapat diubah melalui formulir ini.
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
