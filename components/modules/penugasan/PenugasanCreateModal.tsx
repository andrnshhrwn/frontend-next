"use client";

import { useState } from "react";

import { AlertCircle, MapPin, Plus, Search } from "lucide-react";

import type { Pelanggan, TicketInput } from "@/types/penugasan.types";

import { btnGhost, btnPrimary, labelCls } from "@/utils/penugasan.utils";

import PenugasanModalShell from "./PenugasanModalShell";

interface PenugasanCreateModalProps {
  onClose: () => void;
  onCreate: (data: TicketInput) => Promise<void>;
  pelanggan: Pelanggan[];
  unitId: string;
}

export default function PenugasanCreateModal({
  onClose,
  onCreate,
  pelanggan,
  unitId,
}: PenugasanCreateModalProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Pelanggan | null>(null);
  const [alasan, setAlasan] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const results = pelanggan
    .filter(
      (item) =>
        item.nama.toLowerCase().includes(query.toLowerCase()) ||
        item.id_pelanggan_pdam.toLowerCase().includes(query.toLowerCase()),
    )
    .slice(0, 10);

  const handleSubmit = async () => {
    if (!selected) {
      setError("Pilih pelanggan terlebih dahulu.");
      return;
    }

    if (!alasan.trim()) {
      setError("Alasan penugasan wajib diisi.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await onCreate({
        id_pelanggan: selected.id_pelanggan,
        id_unit: unitId,
        alasan: alasan.trim(),
      });

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat penugasan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PenugasanModalShell
      wide
      title="Buat Penugasan"
      subtitle="Penugasan dibuat oleh Admin Cabang dengan status awal Pending."
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
            <Plus className="w-4 h-4" />
            {submitting ? "Menyimpan..." : "Buat Penugasan"}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className={labelCls}>Pelanggan</label>

          {selected ? (
            <div className="flex items-start justify-between rounded-lg border border-pdam-primary/30 bg-pdam-primary/5 p-3">
              <div>
                <p className="text-xs font-bold text-pdam-navy">
                  {selected.nama}
                </p>

                <p className="text-[10px] font-mono text-slate-400">
                  {selected.id_pelanggan_pdam}
                </p>

                <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {selected.alamat}
                </p>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="text-[11px] font-semibold text-pdam-primary hover:underline"
              >
                Ubah
              </button>
            </div>
          ) : (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Cari nama atau ID pelanggan..."
                  className="input input-bordered input-sm w-full pl-9 text-xs border-slate-200 focus:border-pdam-primary"
                />
              </div>

              <ul className="mt-2 rounded-lg border border-slate-200 divide-y divide-slate-100 max-h-44 overflow-y-auto">
                {results.map((item) => (
                  <li key={item.id_pelanggan}>
                    <button
                      onClick={() => setSelected(item)}
                      className="w-full text-left px-3 py-2 hover:bg-pdam-bg transition-colors"
                    >
                      <span className="text-xs font-semibold text-pdam-navy block">
                        {item.nama}
                      </span>

                      <span className="text-[10px] text-slate-400 font-mono">
                        {item.id_pelanggan_pdam}
                      </span>
                    </button>
                  </li>
                ))}

                {results.length === 0 && (
                  <li className="px-3 py-4 text-center text-xs text-slate-400">
                    Pelanggan tidak ditemukan.
                  </li>
                )}
              </ul>
            </>
          )}
        </div>

        <div>
          <label className={labelCls}>Alasan Penugasan</label>

          <textarea
            value={alasan}
            onChange={(event) => setAlasan(event.target.value)}
            rows={3}
            maxLength={255}
            placeholder="Masukkan alasan penugasan..."
            className="textarea textarea-bordered w-full text-xs border-slate-200 focus:border-pdam-primary"
          />
        </div>

        {error && (
          <p className="text-xs text-pdam-red font-medium flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </p>
        )}
      </div>
    </PenugasanModalShell>
  );
}
