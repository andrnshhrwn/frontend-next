"use client";

import { useState } from "react";

import { UserCheck } from "lucide-react";

import type { TicketView } from "@/types/penugasan.types";

import type { Teknisi } from "@/services/penugasanService";

import { btnGhost, btnPrimary } from "@/utils/penugasan.utils";

import PenugasanModalShell from "./PenugasanModalShell";

interface PenugasanAssignModalProps {
  ticket: TicketView;
  onClose: () => void;
  onAssign: (idTeknisi: string) => Promise<void>;
  teknisi: Teknisi[];
}

export default function PenugasanAssignModal({
  ticket,
  onClose,
  onAssign,
  teknisi,
}: PenugasanAssignModalProps) {
  const [chosen, setChosen] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAssign = async () => {
    if (!chosen) return;

    setSubmitting(true);
    setError("");

    try {
      await onAssign(chosen);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal menetapkan teknisi.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PenugasanModalShell
      title="Pilih Teknisi"
      subtitle={`${ticket.nomorSpk} • ${ticket.pelanggan} • ${ticket.cabang}`}
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className={btnGhost}>
            Batal
          </button>

          <button
            onClick={handleAssign}
            disabled={!chosen || submitting}
            className={btnPrimary}
          >
            <UserCheck className="w-4 h-4" />
            {submitting ? "Menyimpan..." : "Tugaskan"}
          </button>
        </>
      }
    >
      <p className="text-[11px] text-slate-500 mb-3">
        Pilih teknisi dari unit yang sama dengan penugasan ini. Penetapan
        teknisi tidak otomatis mengubah status penugasan.
      </p>

      <ul className="space-y-2">
        {teknisi.map((item) => (
          <li key={item.id_user}>
            <label
              className={`flex items-center justify-between rounded-lg border p-3 cursor-pointer transition-colors ${
                chosen === item.id_user
                  ? "border-pdam-primary bg-pdam-primary/5"
                  : "border-slate-200 hover:bg-pdam-bg"
              }`}
            >
              <span className="flex items-center gap-3">
                <input
                  type="radio"
                  className="radio radio-xs radio-primary"
                  checked={chosen === item.id_user}
                  onChange={() => setChosen(item.id_user)}
                />

                <span className="text-xs font-semibold text-pdam-navy">
                  {item.fullname}
                </span>
              </span>

              <span className="text-[10px] text-slate-400">
                {item.username}
              </span>
            </label>
          </li>
        ))}

        {teknisi.length === 0 && (
          <li className="text-center text-xs text-slate-400 py-5">
            Tidak ada teknisi yang tersedia.
          </li>
        )}
      </ul>

      {error && <p className="text-xs text-pdam-red mt-3">{error}</p>}
    </PenugasanModalShell>
  );
}
