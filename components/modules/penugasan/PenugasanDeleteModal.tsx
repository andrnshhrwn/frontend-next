"use client";

import { useState } from "react";

import { AlertCircle } from "lucide-react";

import type { TicketView } from "@/types/penugasan.types";

import { btnGhost } from "@/utils/penugasan.utils";

import PenugasanModalShell from "./PenugasanModalShell";

interface PenugasanDeleteModalProps {
  ticket: TicketView;
  onClose: () => void;
  onDelete: (id: string) => Promise<void>;
}

export default function PenugasanDeleteModal({
  ticket,
  onClose,
  onDelete,
}: PenugasanDeleteModalProps) {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleDelete = async () => {
    setSubmitting(true);
    setError("");

    try {
      await onDelete(ticket.id);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal menghapus penugasan.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PenugasanModalShell
      title="Hapus Penugasan"
      subtitle={ticket.nomorSpk}
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} disabled={submitting} className={btnGhost}>
            Batal
          </button>

          <button
            onClick={handleDelete}
            disabled={submitting}
            className="btn btn-sm bg-red-600 hover:bg-red-700 text-white border-0 normal-case font-semibold"
          >
            {submitting ? "Menghapus..." : "Ya, Hapus"}
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
                Konfirmasi penghapusan
              </p>

              <p className="text-xs text-red-600 mt-1">
                Anda akan menghapus penugasan untuk pelanggan{" "}
                <strong>{ticket.pelanggan}</strong>. Tindakan ini tidak dapat
                dibatalkan.
              </p>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-500">
          Penghapusan hanya diperbolehkan jika status Pending atau Dibatalkan
          dan penugasan belum memiliki BAP. Backend tetap menjadi pihak yang
          memvalidasi aturan tersebut.
        </p>

        {error && <p className="text-xs text-pdam-red">{error}</p>}
      </div>
    </PenugasanModalShell>
  );
}
