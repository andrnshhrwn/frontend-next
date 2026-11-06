"use client";

import type { ReactNode } from "react";

import { UserCheck, X } from "lucide-react";

import type { TicketView } from "@/types/penugasan.types";

import {
  btnGhost,
  btnPrimary,
  formatDate,
  statusClass,
  statusLabel,
} from "@/utils/penugasan.utils";

import PenugasanModalShell from "./PenugasanModalShell";

interface PenugasanDetailModalProps {
  ticket: TicketView;
  onClose: () => void;
  onPickTeknisi: () => void;
  onRequestCancel: () => void;
  isAdminCabang: boolean;
}

interface DetailRowProps {
  k: string;
  v: ReactNode;
}

function DetailRow({ k, v }: DetailRowProps) {
  return (
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        {k}
      </p>

      <p className="text-xs font-semibold text-pdam-navy mt-0.5">{v}</p>
    </div>
  );
}

export default function PenugasanDetailModal({
  ticket,
  onClose,
  onPickTeknisi,
  onRequestCancel,
  isAdminCabang,
}: PenugasanDetailModalProps) {
  const timeline = [
    {
      judul: "Penugasan dibuat",
      ket: formatDate(ticket.raw.tgl_penugasan),
    },
  ];

  if (ticket.teknisi) {
    timeline.push({
      judul: "Teknisi ditetapkan",
      ket: ticket.teknisi,
    });
  }

  if (ticket.status === "selesai") {
    timeline.push({
      judul: "Penugasan selesai",
      ket: "Status penugasan selesai",
    });
  }

  if (ticket.status === "dibatalkan") {
    timeline.push({
      judul: "Penugasan dibatalkan",
      ket: "Status penugasan dibatalkan",
    });
  }

  return (
    <PenugasanModalShell
      wide
      title="Detail Penugasan"
      subtitle="Informasi penugasan dan data terkait."
      onClose={onClose}
      footer={
        <>
          {isAdminCabang && ticket.status === "pending" && (
            <>
              {!ticket.teknisi && (
                <button onClick={onPickTeknisi} className={btnPrimary}>
                  <UserCheck className="w-4 h-4" />
                  Pilih Teknisi
                </button>
              )}

              <button
                onClick={onRequestCancel}
                className="btn btn-sm bg-red-600 hover:bg-red-700 text-white border-0 normal-case font-semibold"
              >
                <X className="w-4 h-4" />
                Batalkan Penugasan
              </button>
            </>
          )}

          <button onClick={onClose} className={btnGhost}>
            Tutup
          </button>
        </>
      }
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-mono font-bold text-lg text-pdam-primary">
            {ticket.nomorSpk}
          </p>

          <p className="text-[11px] text-slate-500">{ticket.tanggal}</p>
        </div>

        <span
          className={`badge badge-md font-bold border ${statusClass[ticket.status]}`}
        >
          {statusLabel[ticket.status]}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-5 border-b border-slate-200">
        <DetailRow k="Pelanggan" v={ticket.pelanggan} />

        <DetailRow
          k="ID Pelanggan"
          v={<span className="font-mono">{ticket.idPelanggan}</span>}
        />

        <DetailRow k="Unit" v={ticket.cabang} />

        <div className="col-span-2 sm:col-span-3">
          <DetailRow k="Alamat" v={ticket.alamat} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 py-5 border-b border-slate-200">
        <DetailRow k="Alasan" v={ticket.alasan} />

        <DetailRow
          k="Teknisi"
          v={
            ticket.teknisi ?? (
              <span className="text-slate-400">Belum ditugaskan</span>
            )
          }
        />

        <DetailRow k="Pembuat" v={ticket.raw.pembuat?.fullname ?? "-"} />
      </div>

      <div className="pt-5">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
          Riwayat
        </p>

        <ul className="space-y-3">
          {timeline.map((item, index) => (
            <li key={index} className="flex gap-3">
              <span className="mt-1 w-2 h-2 rounded-full bg-pdam-primary shrink-0" />

              <div>
                <p className="text-xs font-semibold text-pdam-navy">
                  {item.judul}
                </p>

                <p className="text-[11px] text-slate-500">{item.ket}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </PenugasanModalShell>
  );
}
