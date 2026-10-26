"use client";

import React, { useState } from "react";
import { Download, FileSpreadsheet } from "lucide-react";
import { BaseModal } from "./BaseModal";

interface ExportColumn {
  id: string;
  label: string;
  defaultChecked?: boolean;
}

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  columns: ExportColumn[];
  totalFiltered: number;
  totalAll: number;
  onExport: (options: { scope: "filtered" | "all"; selectedCols: string[] }) => void;
}

export function ExportModal({
  isOpen,
  onClose,
  title = "Ekspor Data ke CSV",
  subtitle = "Pilih cakupan data dan kolom yang ingin disertakan dalam file ekspor.",
  columns,
  totalFiltered,
  totalAll,
  onExport,
}: ExportModalProps) {
  const [scope, setScope] = useState<"filtered" | "all">("filtered");
  const [selectedCols, setSelectedCols] = useState<string[]>(
    columns.filter((c) => c.defaultChecked !== false).map((c) => c.id)
  );

  const toggleColumn = (id: string) => {
    setSelectedCols((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelectedCols(columns.map((c) => c.id));
  const deselectAll = () => setSelectedCols([]);

  const handleExport = () => {
    if (selectedCols.length === 0) return;
    onExport({ scope, selectedCols });
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      icon={<FileSpreadsheet className="w-5 h-5 text-pdam-primary" />}
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Scope Selection */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1.5">
            Cakupan Baris Data
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setScope("filtered")}
              className={`p-3 rounded-xl border text-left transition ${
                scope === "filtered"
                  ? "border-pdam-primary bg-pdam-primary/5 ring-1 ring-pdam-primary"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="font-semibold text-xs text-slate-800">Data Terfilter</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {totalFiltered} baris hasil pencarian
              </div>
            </button>

            <button
              type="button"
              onClick={() => setScope("all")}
              className={`p-3 rounded-xl border text-left transition ${
                scope === "all"
                  ? "border-pdam-primary bg-pdam-primary/5 ring-1 ring-pdam-primary"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="font-semibold text-xs text-slate-800">Semua Data</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {totalAll} baris keseluruhan
              </div>
            </button>
          </div>
        </div>

        {/* Column Selection */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700">Pilih Kolom</label>
            <div className="flex gap-2 text-[11px]">
              <button
                type="button"
                onClick={selectAll}
                className="text-pdam-primary hover:underline"
              >
                Pilih Semua
              </button>
              <span className="text-slate-300">•</span>
              <button
                type="button"
                onClick={deselectAll}
                className="text-slate-500 hover:underline"
              >
                Kosongkan
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-44 overflow-y-auto p-2 rounded-xl border border-slate-100 bg-slate-50/50">
            {columns.map((col) => (
              <label
                key={col.id}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white text-xs text-slate-700 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={selectedCols.includes(col.id)}
                  onChange={() => toggleColumn(col.id)}
                  className="checkbox checkbox-xs rounded border-slate-300"
                />
                <span className="truncate">{col.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-ghost text-slate-600 hover:bg-slate-100"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={selectedCols.length === 0}
            className="btn btn-sm bg-pdam-primary hover:bg-pdam-primary/90 text-white border-none flex items-center gap-1.5 shadow-xs disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            Unduh CSV
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
