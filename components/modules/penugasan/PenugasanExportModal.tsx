"use client";

import { useState } from "react";

import { Download, FileSpreadsheet } from "lucide-react";

import type { TicketView } from "@/types/penugasan.types";

import {
  buildPenugasanCsv,
  btnGhost,
  btnPrimary,
  downloadFile,
  labelCls,
} from "@/utils/penugasan.utils";

import PenugasanModalShell from "./PenugasanModalShell";

interface PenugasanExportModalProps {
  onClose: () => void;
  onExportComplete: () => void;
  allData: TicketView[];
  filteredData: TicketView[];
}

export default function PenugasanExportModal({
  onClose,
  onExportComplete,
  allData,
  filteredData,
}: PenugasanExportModalProps) {
  const [scope, setScope] = useState<"filter" | "all">("filter");

  const rows = scope === "filter" ? filteredData : allData;

  const handleExport = () => {
    const csv = buildPenugasanCsv(rows);
    const stamp = new Date().toISOString().slice(0, 10);

    downloadFile(`penugasan-${stamp}.csv`, csv, "text/csv;charset=utf-8");

    onExportComplete();
    onClose();
  };

  return (
    <PenugasanModalShell
      title="Export Data Penugasan"
      subtitle="Unduh daftar penugasan berdasarkan cakupan data."
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className={btnGhost}>
            Batal
          </button>

          <button
            onClick={handleExport}
            disabled={rows.length === 0}
            className={btnPrimary}
          >
            <Download className="w-4 h-4" />
            Unduh {rows.length} Penugasan
          </button>
        </>
      }
    >
      <div className="space-y-5">
        <div>
          <span className={labelCls}>Format File</span>

          <div className="flex items-center gap-2 rounded-lg border border-pdam-primary bg-pdam-primary/5 p-3">
            <FileSpreadsheet className="w-4 h-4 text-pdam-primary" />
            <span className="text-xs font-semibold text-pdam-primary">
              CSV (.csv)
            </span>
          </div>
        </div>

        <div>
          <span className={labelCls}>Cakupan Data</span>

          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                className="radio radio-xs radio-primary"
                checked={scope === "filter"}
                onChange={() => setScope("filter")}
              />
              Sesuai filter aktif ({filteredData.length} penugasan)
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                className="radio radio-xs radio-primary"
                checked={scope === "all"}
                onChange={() => setScope("all")}
              />
              Semua data yang dimuat ({allData.length} penugasan)
            </label>
          </div>
        </div>
      </div>
    </PenugasanModalShell>
  );
}
