"use client";

import React, { useState } from "react";
import { Plus, Upload, AlertCircle, FileSpreadsheet, Download, CheckCircle2 } from "lucide-react";
import { BaseModal } from "@/components/ui";
import type { WaterMeterItem } from "./WaterMeterDetailModal";

interface WaterMeterAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (items: WaterMeterItem[]) => void;
  existingSN: Set<string>;
  unitAktif: string;
}

const MERK_OPTIONS = [
  "Itron Aquadis+",
  "Itron Flostar M",
  "Linflow Multijet",
  "Linflow Classic",
  "Onda Brass Core",
  "Actaris Metron Cyble",
  "Bar-Meters Precision",
  "Ningbo LXSG",
];

const DN_OPTIONS = ["DN 15 (1/2\")", "DN 20 (3/4\")", "DN 25 (1\")"];
const TAHUN_OPTIONS = [2026, 2025, 2024, 2023, 2022];

export function WaterMeterAddModal({
  isOpen,
  onClose,
  onAdd,
  existingSN,
  unitAktif,
}: WaterMeterAddModalProps) {
  const [tab, setTab] = useState<"single" | "bulk">("single");
  const [form, setForm] = useState({
    noSeri: "",
    merk: "",
    dn: DN_OPTIONS[0],
    tahunPengadaan: 2026,
  });
  const [error, setError] = useState("");

  // Bulk state
  const [fileName, setFileName] = useState("");
  const [parsed, setParsed] = useState<WaterMeterItem[]>([]);
  const [bulkErrors, setBulkErrors] = useState<string[]>([]);

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sn = form.noSeri.trim().toUpperCase();
    if (!sn) return setError("Nomor seri water meter wajib diisi.");
    if (sn.length > 50) return setError("Nomor seri maksimal 50 karakter.");
    if (existingSN.has(sn)) return setError("Nomor seri sudah terdaftar di sistem.");
    if (!form.merk) return setError("Pilih merk water meter.");

    onAdd([
      {
        noSeri: sn,
        tahunPengadaan: Number(form.tahunPengadaan),
        merk: form.merk,
        dn: form.dn,
        status: "Tersedia di Unit",
        unitCabang: unitAktif,
        lokasi: `Gudang ${unitAktif}`,
        detail: "Alokasi Logistik",
      },
    ]);
    onClose();
  };

  const templateCsv =
    "serial_number,merk,ukuran_dn,tahun_pengadaan\n" +
    `WM-26-000001,Itron Aquadis+,"DN 15 (1/2"")",2026\n` +
    `WM-26-000002,Linflow Multijet,"DN 15 (1/2"")",2026\n`;

  const downloadTemplate = () => {
    const blob = new Blob(["\uFEFF" + templateCsv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template-registrasi-water-meter.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const text = await file.text();
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length < 2) {
      setBulkErrors(["File CSV kosong atau hanya berisi header."]);
      return;
    }

    const seen = new Set<string>();
    const valid: WaterMeterItem[] = [];
    const errs: string[] = [];

    // Skip header line
    lines.slice(1).forEach((line, idx) => {
      const parts = line.split(",").map((p) => p.replace(/^"|"$/g, "").trim());
      const [sn, merk, dn, tahun] = parts;
      const rowNo = idx + 2;

      if (!sn) return errs.push(`Baris ${rowNo}: nomor seri kosong.`);
      const snUpper = sn.toUpperCase();
      if (existingSN.has(snUpper) || seen.has(snUpper)) {
        return errs.push(`Baris ${rowNo}: nomor seri ${snUpper} duplikat.`);
      }
      seen.add(snUpper);

      valid.push({
        noSeri: snUpper,
        merk: merk || "Itron Aquadis+",
        dn: dn || DN_OPTIONS[0],
        tahunPengadaan: parseInt(tahun, 10) || 2026,
        status: "Tersedia di Unit",
        unitCabang: unitAktif,
        lokasi: `Gudang ${unitAktif}`,
        detail: "Alokasi Batch CSV",
      });
    });

    setParsed(valid);
    setBulkErrors(errs);
  };

  const handleBulkSubmit = () => {
    if (parsed.length === 0) return;
    onAdd(parsed);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrasi Water Meter Baru"
      subtitle="Input stok meteran air baru untuk dialokasikan ke gudang unit kerja."
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setTab("single");
              setError("");
            }}
            className={`py-2 rounded-lg transition ${
              tab === "single"
                ? "bg-white text-pdam-navy shadow-xs"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Input Satuan
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("bulk");
              setError("");
            }}
            className={`py-2 rounded-lg transition ${
              tab === "bulk"
                ? "bg-white text-pdam-navy shadow-xs"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Impor CSV Batch
          </button>
        </div>

        {tab === "single" ? (
          <form onSubmit={handleSingleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nomor Seri (Serial Number) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: WM-26-001205"
                  value={form.noSeri}
                  onChange={(e) => setForm({ ...form, noSeri: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pdam-primary/30 focus:border-pdam-primary uppercase"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Merk Water Meter *
                </label>
                <select
                  required
                  value={form.merk}
                  onChange={(e) => setForm({ ...form, merk: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-pdam-primary/30 focus:border-pdam-primary"
                >
                  <option value="">-- Pilih Merk --</option>
                  {MERK_OPTIONS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Diameter Nominal (Ukuran DN)
                </label>
                <select
                  value={form.dn}
                  onChange={(e) => setForm({ ...form, dn: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-pdam-primary/30 focus:border-pdam-primary"
                >
                  {DN_OPTIONS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Tahun Pengadaan
                </label>
                <select
                  value={form.tahunPengadaan}
                  onChange={(e) =>
                    setForm({ ...form, tahunPengadaan: Number(e.target.value) })
                  }
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-pdam-primary/30 focus:border-pdam-primary"
                >
                  {TAHUN_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2 p-3 rounded-lg bg-sky-50 border border-sky-100 text-xs text-sky-800 flex items-center justify-between">
                <span>
                  Unit Alokasi: <strong className="font-semibold">{unitAktif}</strong>
                </span>
                <span>
                  Status Awal: <strong className="font-semibold">Tersedia di Unit</strong>
                </span>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-sm btn-ghost text-slate-600 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="submit"
                className="btn btn-sm bg-pdam-primary hover:bg-pdam-primary/90 text-white border-none flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Simpan Water Meter
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs pb-1">
              <span className="text-slate-500">
                Format kolom: <code className="text-pdam-navy font-mono">serial_number, merk, ukuran_dn, tahun_pengadaan</code>
              </span>
              <button
                type="button"
                onClick={downloadTemplate}
                className="text-pdam-primary font-semibold hover:underline flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                Unduh Template CSV
              </button>
            </div>

            <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 hover:border-pdam-primary hover:bg-pdam-primary/5 transition-colors p-8 cursor-pointer text-center">
              <Upload className="w-8 h-8 text-pdam-primary" />
              <span className="text-xs font-semibold text-pdam-navy">
                {fileName || "Klik untuk memilih file CSV"}
              </span>
              <span className="text-[11px] text-slate-400">
                Pilih file CSV dengan baris pertama sebagai header
              </span>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {bulkErrors.length > 0 && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 text-xs text-rose-700 max-h-32 overflow-y-auto space-y-1">
                {bulkErrors.map((err, i) => (
                  <p key={i}>• {err}</p>
                ))}
              </div>
            )}

            {parsed.length > 0 && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Siap mengimpor <strong>{parsed.length}</strong> unit water meter ke {unitAktif}.
                </span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-sm btn-ghost text-slate-600 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleBulkSubmit}
                disabled={parsed.length === 0}
                className="btn btn-sm bg-pdam-primary hover:bg-pdam-primary/90 text-white border-none flex items-center gap-1.5 shadow-xs disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5" />
                Impor {parsed.length > 0 ? `(${parsed.length} Unit)` : ""}
              </button>
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  );
}
