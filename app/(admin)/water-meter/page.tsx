"use client";

import {
  Download,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  X,
  FileSpreadsheet,
  Upload,
  MapPin,
  History,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

/* ------------------------------------------------------------------ */
/* Types & data                                                        */
/* ------------------------------------------------------------------ */

type Status = "Tersedia" | "Terpasang" | "Rusak";

interface WaterMeter {
  noSeri: string;
  tera: string;
  merk: string;
  dn: string;
  status: Status;
  lokasi: string;
  detail: string;
}

const initialMeters: WaterMeter[] = [
  { noSeri: "WM-24-009182", tera: "Tera Sah 2024", merk: "Itron Aquadis+", dn: "DN 15 (1/2\")", status: "Tersedia", lokasi: "Gudang Unit Timur", detail: "Rak A-04" },
  { noSeri: "WM-22-048910", tera: "Tera Sah 2022", merk: "Linflow Multijet", dn: "DN 15 (1/2\")", status: "Terpasang", lokasi: "Bambang Setyawan", detail: "PLG-089211 • Jl. Rungkut Madya" },
  { noSeri: "WM-19-031209", tera: "Tera 2019", merk: "Bar-Meters Precision", dn: "DN 20 (3/4\")", status: "Rusak", lokasi: "Gudang Karantina", detail: "Eks: CV. Surya Teknik" },
  { noSeri: "WM-23-019943", tera: "Tera Sah 2023", merk: "Onda Brass Core", dn: "DN 15 (1/2\")", status: "Terpasang", lokasi: "Dewi Anggraini", detail: "PLG-067140 • Griya Asri Blok D" },
  { noSeri: "WM-24-009183", tera: "Tera Sah 2024", merk: "Actaris Metron Cyble", dn: "DN 25 (1\")", status: "Tersedia", lokasi: "Gudang Unit Timur", detail: "Rak B-01" },
  { noSeri: "WM-21-077124", tera: "Tera Sah 2021", merk: "Ningbo LXSG", dn: "DN 15 (1/2\")", status: "Terpasang", lokasi: "H. Ahmad Fauzi", detail: "PLG-031902 • Jl. Semampir Barat" },
  { noSeri: "WM-24-009184", tera: "Tera Sah 2024", merk: "Itron Flostar M", dn: "DN 20 (3/4\")", status: "Tersedia", lokasi: "Gudang Unit Timur", detail: "Rak A-07" },
  { noSeri: "WM-20-055102", tera: "Tera 2020", merk: "Linflow Classic", dn: "DN 15 (1/2\")", status: "Rusak", lokasi: "Gudang Karantina", detail: "Eks: Agus Supriyono" },
  { noSeri: "WM-23-019944", tera: "Tera Sah 2023", merk: "Onda Brass Core", dn: "DN 15 (1/2\")", status: "Terpasang", lokasi: "Siti Nurhaliza", detail: "PLG-077192 • Jl. Dharmahusada Indah" },
  { noSeri: "WM-24-009185", tera: "Tera Sah 2024", merk: "Itron Aquadis+", dn: "DN 15 (1/2\")", status: "Tersedia", lokasi: "Gudang Unit Timur", detail: "Rak A-05" },
];

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
const TERA_OPTIONS = ["Tera Sah 2026", "Tera Sah 2025", "Tera Sah 2024", "Tera Sah 2023"];
const UNIT_AKTIF = "Cabang Timur"; // unit milik admin yang login (id_unit)

const statusClass: Record<Status, string> = {
  Tersedia: "border-pdam-primary/30 bg-pdam-primary/10 text-pdam-primary",
  Terpasang: "border-pdam-navy/30 bg-pdam-navy/10 text-pdam-navy",
  Rusak: "border-pdam-red/30 bg-pdam-red/10 text-pdam-red",
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob(["\uFEFF" + content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const csvCell = (v: string) => `"${v.replace(/"/g, '""')}"`;

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQ && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else inQ = !inQ;
    } else if (c === "," && !inQ) {
      out.push(cur.trim());
      cur = "";
    } else cur += c;
  }
  out.push(cur.trim());
  return out;
}

/* ------------------------------------------------------------------ */
/* Reusable modal shell                                                */
/* ------------------------------------------------------------------ */

function Modal({
  title,
  subtitle,
  onClose,
  children,
  footer,
  wide,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="modal modal-open">
      <div className={`modal-box bg-white p-0 ${wide ? "max-w-2xl" : "max-w-md"}`}>
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-slate-200">
          <div>
            <h3 className="font-extrabold text-pdam-navy">{title}</h3>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-xs btn-square text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-slate-200 bg-pdam-bg/50 flex justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
      <div className="modal-backdrop bg-black/40" onClick={onClose} />
    </div>
  );
}

const labelCls = "text-[11px] font-bold text-pdam-navy uppercase mb-1 block";
const inputCls =
  "input input-bordered input-sm w-full text-xs border-slate-200 focus:border-pdam-primary";
const selectCls =
  "select select-bordered select-sm w-full text-xs border-slate-200 bg-white focus:border-pdam-primary";
const btnGhost =
  "btn btn-sm btn-ghost border border-slate-200 normal-case font-semibold text-slate-600";
const btnPrimary =
  "btn btn-sm bg-pdam-primary hover:bg-pdam-navy text-white border-0 normal-case font-semibold";

/* ------------------------------------------------------------------ */
/* Modal: Export                                                       */
/* ------------------------------------------------------------------ */

function ExportModal({
  onClose,
  allData,
  filteredData,
}: {
  onClose: () => void;
  allData: WaterMeter[];
  filteredData: WaterMeter[];
}) {
  const [format, setFormat] = useState<"csv" | "xlsx">("csv");
  const [scope, setScope] = useState<"filter" | "all">("filter");
  const [cols, setCols] = useState({
    noSeri: true,
    tera: true,
    merk: true,
    dn: true,
    status: true,
    lokasi: true,
    detail: true,
  });

  const rows = scope === "filter" ? filteredData : allData;
  const colLabels: Record<keyof typeof cols, string> = {
    noSeri: "No. Seri (SN)",
    tera: "Tera",
    merk: "Merk",
    dn: "Ukuran (DN)",
    status: "Status",
    lokasi: "Lokasi / Pelanggan",
    detail: "Keterangan",
  };
  const activeKeys = (Object.keys(cols) as (keyof typeof cols)[]).filter((k) => cols[k]);

  const handleExport = () => {
    const header = activeKeys.map((k) => csvCell(colLabels[k])).join(",");
    const body = rows.map((r) => activeKeys.map((k) => csvCell(r[k])).join(",")).join("\n");
    const stamp = new Date().toISOString().slice(0, 10);

    if (format === "csv") {
      downloadFile(`water-meter-${stamp}.csv`, `${header}\n${body}`, "text/csv;charset=utf-8");
    } else {
      // TODO: ganti dengan library SheetJS (xlsx) untuk file .xlsx asli.
      // Sementara: tab-separated, dibuka Excel sebagai .xls.
      const tsv = [activeKeys.map((k) => colLabels[k]).join("\t")]
        .concat(rows.map((r) => activeKeys.map((k) => r[k]).join("\t")))
        .join("\n");
      downloadFile(`water-meter-${stamp}.xls`, tsv, "application/vnd.ms-excel");
    }
    onClose();
  };

  return (
    <Modal
      title="Export Data Water Meter"
      subtitle="Pilih format, cakupan data, dan kolom yang akan diunduh."
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className={btnGhost}>
            Batal
          </button>
          <button
            onClick={handleExport}
            disabled={activeKeys.length === 0 || rows.length === 0}
            className={btnPrimary}
          >
            <Download className="w-4 h-4" /> Unduh {rows.length} Data
          </button>
        </>
      }
    >
      <div className="space-y-5">
        <div>
          <span className={labelCls}>Format File</span>
          <div className="grid grid-cols-2 gap-2">
            {(["csv", "xlsx"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`flex items-center gap-2 rounded-lg border p-3 text-xs font-semibold text-left transition-colors ${
                  format === f
                    ? "border-pdam-primary bg-pdam-primary/5 text-pdam-primary"
                    : "border-slate-200 text-slate-600 hover:bg-pdam-bg"
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                {f === "csv" ? "CSV (.csv)" : "Excel (.xls)"}
              </button>
            ))}
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
              Sesuai filter aktif ({filteredData.length} data)
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                className="radio radio-xs radio-primary"
                checked={scope === "all"}
                onChange={() => setScope("all")}
              />
              Semua data ({allData.length} data dimuat)
            </label>
          </div>
        </div>

        <div>
          <span className={labelCls}>Kolom</span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {(Object.keys(cols) as (keyof typeof cols)[]).map((k) => (
              <label key={k} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox checkbox-xs checkbox-primary"
                  checked={cols[k]}
                  onChange={(e) => setCols({ ...cols, [k]: e.target.checked })}
                />
                {colLabels[k]}
              </label>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Modal: Registrasi SN Baru (single + bulk CSV)                       */
/* ------------------------------------------------------------------ */

function RegistrasiModal({
  onClose,
  existingSN,
  onAdd,
}: {
  onClose: () => void;
  existingSN: Set<string>;
  onAdd: (items: WaterMeter[]) => void;
}) {
  const [tab, setTab] = useState<"single" | "bulk">("single");

  // single
  const [form, setForm] = useState({
    noSeri: "",
    merk: "",
    dn: DN_OPTIONS[0],
    tera: TERA_OPTIONS[0],
    rak: "",
  });
  const [error, setError] = useState("");

  // bulk
  const [fileName, setFileName] = useState("");
  const [parsed, setParsed] = useState<WaterMeter[]>([]);
  const [bulkErrors, setBulkErrors] = useState<string[]>([]);

  const handleSingle = () => {
    const sn = form.noSeri.trim().toUpperCase();
    if (!sn) return setError("Nomor seri wajib diisi.");
    if (sn.length > 50) return setError("Nomor seri maksimal 50 karakter.");
    if (existingSN.has(sn)) return setError("Nomor seri sudah terdaftar di database.");
    if (!form.merk) return setError("Pilih merk water meter.");
    onAdd([
      {
        noSeri: sn,
        tera: form.tera,
        merk: form.merk,
        dn: form.dn,
        status: "Tersedia",
        lokasi: `Gudang Unit ${UNIT_AKTIF.replace("Cabang ", "")}`,
        detail: form.rak ? `Rak ${form.rak}` : "-",
      },
    ]);
    onClose();
  };

  const templateCsv =
    "serial_number,merk,ukuran_dn,tera,rak\n" +
    `WM-26-000001,Itron Aquadis+,"DN 15 (1/2"")",Tera Sah 2026,A-01\n`;

  const handleFile = async (file?: File) => {
    if (!file) return;
    setFileName(file.name);
    const text = (await file.text()).replace(/^\uFEFF/, "");
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    const errs: string[] = [];
    const items: WaterMeter[] = [];
    const seen = new Set<string>();

    lines.slice(1).forEach((line, i) => {
      const [sn, merk, dn, tera, rak] = parseCsvLine(line);
      const rowNo = i + 2;
      const snUp = (sn || "").toUpperCase();
      if (!snUp) return errs.push(`Baris ${rowNo}: nomor seri kosong.`);
      if (existingSN.has(snUp) || seen.has(snUp))
        return errs.push(`Baris ${rowNo}: SN ${snUp} duplikat.`);
      if (!merk) return errs.push(`Baris ${rowNo}: merk kosong.`);
      seen.add(snUp);
      items.push({
        noSeri: snUp,
        merk,
        dn: dn || DN_OPTIONS[0],
        tera: tera || TERA_OPTIONS[0],
        status: "Tersedia",
        lokasi: `Gudang Unit ${UNIT_AKTIF.replace("Cabang ", "")}`,
        detail: rak ? `Rak ${rak}` : "-",
      });
    });
    setParsed(items);
    setBulkErrors(errs);
  };

  const handleBulk = () => {
    if (parsed.length === 0) return;
    onAdd(parsed);
    onClose();
  };

  return (
    <Modal
      wide
      title="Registrasi SN Baru"
      subtitle={`Daftarkan stok water meter dari Pusat ke inventori ${UNIT_AKTIF}. Status awal: Tersedia di unit.`}
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className={btnGhost}>
            Batal
          </button>
          {tab === "single" ? (
            <button onClick={handleSingle} className={btnPrimary}>
              <Plus className="w-4 h-4" /> Simpan SN
            </button>
          ) : (
            <button onClick={handleBulk} disabled={parsed.length === 0} className={btnPrimary}>
              <Upload className="w-4 h-4" /> Import {parsed.length} SN
            </button>
          )}
        </>
      }
    >
      <div className="inline-flex p-1 rounded-lg bg-pdam-bg border border-slate-200 mb-5">
        {(["single", "bulk"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`btn btn-xs normal-case font-semibold border-0 ${
              tab === t ? "bg-white text-pdam-primary shadow-xs" : "bg-transparent text-slate-500"
            }`}
          >
            {t === "single" ? "Input Satuan" : "Upload Massal (CSV)"}
          </button>
        ))}
      </div>

      {tab === "single" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelCls}>Nomor Seri (SN)</label>
            <input
              className={`${inputCls} font-mono`}
              placeholder="contoh: WM-26-000001"
              value={form.noSeri}
              onChange={(e) => setForm({ ...form, noSeri: e.target.value })}
            />
          </div>
          <div>
            <label className={labelCls}>Merk</label>
            <select
              className={selectCls}
              value={form.merk}
              onChange={(e) => setForm({ ...form, merk: e.target.value })}
            >
              <option value="">Pilih merk...</option>
              {MERK_OPTIONS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Ukuran (DN)</label>
            <select
              className={selectCls}
              value={form.dn}
              onChange={(e) => setForm({ ...form, dn: e.target.value })}
            >
              {DN_OPTIONS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Tera</label>
            <select
              className={selectCls}
              value={form.tera}
              onChange={(e) => setForm({ ...form, tera: e.target.value })}
            >
              {TERA_OPTIONS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Lokasi Rak (opsional)</label>
            <input
              className={inputCls}
              placeholder="contoh: A-04"
              value={form.rak}
              onChange={(e) => setForm({ ...form, rak: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2 rounded-lg bg-pdam-bg border border-slate-200 p-3 text-[11px] text-slate-600 flex gap-4">
            <span>
              Unit: <strong className="text-pdam-navy">{UNIT_AKTIF}</strong>
            </span>
            <span>
              Status awal: <strong className="text-pdam-primary">Tersedia di unit</strong>
            </span>
          </div>
          {error && (
            <p className="sm:col-span-2 text-xs text-pdam-red font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {error}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Kolom: serial_number, merk, ukuran_dn, tera, rak
            </span>
            <button
              onClick={() => downloadFile("template-registrasi-wm.csv", templateCsv, "text/csv")}
              className="text-pdam-primary font-semibold hover:underline"
            >
              Unduh template CSV
            </button>
          </div>

          <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 hover:border-pdam-primary hover:bg-pdam-primary/5 transition-colors p-6 cursor-pointer text-center">
            <Upload className="w-6 h-6 text-pdam-primary" />
            <span className="text-xs font-semibold text-pdam-navy">
              {fileName || "Klik untuk memilih file CSV"}
            </span>
            <span className="text-[10px] text-slate-400">Format .csv, baris pertama sebagai header</span>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </label>

          {fileName && (
            <div className="space-y-2 text-xs">
              <p className="flex items-center gap-1.5 text-pdam-primary font-semibold">
                <CheckCircle2 className="w-4 h-4" /> {parsed.length} baris valid siap diimport
              </p>
              {bulkErrors.length > 0 && (
                <div className="rounded-lg border border-pdam-red/30 bg-pdam-red/5 p-3 max-h-28 overflow-y-auto space-y-0.5">
                  <p className="font-semibold text-pdam-red flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {bulkErrors.length} baris dilewati
                  </p>
                  {bulkErrors.map((e, i) => (
                    <p key={i} className="text-[11px] text-slate-600">
                      {e}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Modal: Detail                                                       */
/* ------------------------------------------------------------------ */

function DetailModal({ item, onClose }: { item: WaterMeter; onClose: () => void }) {
  const riwayat = useMemo(() => {
    const base = [
      { judul: "Diregistrasi ke inventori unit", ket: `Status: Tersedia di unit • ${UNIT_AKTIF}`, waktu: "Tgl input (tgl_input)" },
    ];
    if (item.status === "Terpasang")
      base.push({ judul: "Dipasang ke pelanggan", ket: `${item.lokasi} • ${item.detail}`, waktu: "Tgl penggantian" });
    if (item.status === "Rusak")
      base.push({ judul: "Ditandai rusak / ditarik", ket: `${item.lokasi} • ${item.detail}`, waktu: "Tgl penggantian" });
    return base;
  }, [item]);

  const Row = ({ k, v, mono }: { k: string; v: ReactNode; mono?: boolean }) => (
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{k}</p>
      <p className={`text-xs font-semibold text-pdam-navy mt-0.5 ${mono ? "font-mono" : ""}`}>{v}</p>
    </div>
  );

  return (
    <Modal
      wide
      title="Detail Water Meter"
      subtitle="Informasi fisik, status, dan riwayat lokasi nomor seri."
      onClose={onClose}
      footer={
        <button onClick={onClose} className={btnGhost}>
          Tutup
        </button>
      }
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-mono font-bold text-lg text-pdam-primary">{item.noSeri}</p>
          <p className="text-[11px] text-slate-500">{item.tera}</p>
        </div>
        <span className={`badge badge-md font-bold border ${statusClass[item.status]}`}>
          {item.status}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-5 border-b border-slate-200">
        <Row k="Merk" v={item.merk} />
        <Row k="Ukuran" v={item.dn} mono />
        <Row k="Unit Cabang" v={UNIT_AKTIF} />
      </div>

      <div className="py-5 border-b border-slate-200">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
          <MapPin className="w-3 h-3" /> Lokasi / Pelanggan Saat Ini
        </p>
        <p className="text-xs font-bold text-pdam-navy">{item.lokasi}</p>
        <p className="text-[11px] text-slate-500">{item.detail}</p>
      </div>

      <div className="pt-5">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
          <History className="w-3 h-3" /> Riwayat
        </p>
        <ul className="space-y-3">
          {riwayat.map((r, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-1 w-2 h-2 rounded-full bg-pdam-primary shrink-0" />
              <div>
                <p className="text-xs font-semibold text-pdam-navy">{r.judul}</p>
                <p className="text-[11px] text-slate-500">{r.ket}</p>
                <p className="text-[10px] text-slate-400">{r.waktu}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

type StatusFilter = "Semua" | Status;

export default function WaterMeterPage() {
  const [meters, setMeters] = useState<WaterMeter[]>(initialMeters);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Semua");
  const [search, setSearch] = useState("");
  const [merkFilter, setMerkFilter] = useState("");
  const [dnFilter, setDnFilter] = useState("");

  const [showExport, setShowExport] = useState(false);
  const [showRegistrasi, setShowRegistrasi] = useState(false);
  const [detailItem, setDetailItem] = useState<WaterMeter | null>(null);

  const filtered = meters.filter((m) => {
    const q = search.toLowerCase();
    return (
      (statusFilter === "Semua" || m.status === statusFilter) &&
      (!merkFilter || m.merk === merkFilter) &&
      (!dnFilter || m.dn === dnFilter) &&
      (!q ||
        m.noSeri.toLowerCase().includes(q) ||
        m.lokasi.toLowerCase().includes(q) ||
        m.detail.toLowerCase().includes(q))
    );
  });

  const resetFilter = () => {
    setStatusFilter("Semua");
    setSearch("");
    setMerkFilter("");
    setDnFilter("");
  };

  const tabs: { label: string; value: StatusFilter; count: string }[] = [
    { label: "Semua Unit", value: "Semua", count: "1.250" },
    { label: "Tersedia di Gudang", value: "Tersedia", count: "320" },
    { label: "Terpasang Aktif", value: "Terpasang", count: "810" },
    { label: "Rusak / Tarik", value: "Rusak", count: "120" },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header Title */}
      <div>
        <p className="text-xs text-slate-500 mb-1">
          PDAM Tirta / Operasional /{" "}
          <span className="text-pdam-primary font-semibold">Inventori Stok</span>
        </p>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-pdam-navy">
              Inventori &amp; Monitoring Water Meter
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Pemantauan status fisik dan riwayat lokasi nomor seri water meter.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowExport(true)}
              className="btn btn-sm btn-ghost bg-white hover:bg-pdam-bg border border-slate-200 text-pdam-navy font-semibold normal-case shadow-xs"
            >
              <Download className="w-4 h-4 text-pdam-primary" />
              <span>Export Data (CSV/Excel)</span>
            </button>
            <button
              onClick={() => setShowRegistrasi(true)}
              className="btn btn-sm bg-pdam-primary hover:bg-pdam-navy text-white font-semibold normal-case border-0 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Registrasi SN Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Kartu Statistik Atas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-white border border-slate-200/90 shadow-xs p-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Total Unit Terdata
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-pdam-navy tabular-nums">1.250</span>
            <span className="text-[11px] text-slate-500">Unit Fisik</span>
          </div>
        </div>
        <div className="card bg-white border border-slate-200/90 shadow-xs p-4">
          <p className="text-[10px] font-bold text-pdam-primary uppercase tracking-wider mb-1">
            Tersedia di Cabang
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-pdam-primary tabular-nums">320</span>
            <span className="text-[11px] text-pdam-primary font-medium">Siap Pasang</span>
          </div>
        </div>
        <div className="card bg-white border border-slate-200/90 shadow-xs p-4">
          <p className="text-[10px] font-bold text-pdam-navy uppercase tracking-wider mb-1">
            Terpasang Aktif
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-pdam-navy tabular-nums">810</span>
            <span className="text-[11px] text-pdam-navy font-medium">Pelanggan Aktif</span>
          </div>
        </div>
        <div className="card bg-white border border-slate-200/90 shadow-xs p-4">
          <p className="text-[10px] font-bold text-pdam-red uppercase tracking-wider mb-1">
            Rusak / Afkir / Tarik
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-pdam-red tabular-nums">120</span>
            <span className="text-[11px] text-pdam-red font-medium">Perlu Tindakan</span>
          </div>
        </div>
      </div>

      {/* Filter & Bar Pencarian */}
      <div className="card bg-white border border-slate-200/90 shadow-xs p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-slate-200">
          {tabs.map((t) => (
            <button
              key={t.value}
              onClick={() => setStatusFilter(t.value)}
              className={`btn btn-sm font-medium normal-case ${
                statusFilter === t.value
                  ? "bg-pdam-primary hover:bg-pdam-navy text-white border-0 shadow-xs"
                  : "btn-ghost bg-pdam-bg hover:bg-slate-200 border border-slate-200/80 text-slate-700"
              }`}
            >
              {t.label}{" "}
              <span
                className={
                  statusFilter === t.value
                    ? "bg-white/20 px-1.5 py-0.5 rounded text-[10px] ml-1"
                    : "text-slate-400 ml-1"
                }
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-600">
          <span>
            Filter Aktif:{" "}
            <strong className="text-pdam-navy">
              {merkFilter || "Semua Merk"}, {dnFilter || "Semua Ukuran"}
            </strong>
            <button
              onClick={resetFilter}
              className="text-pdam-primary hover:text-pdam-navy underline ml-2"
            >
              Reset Filter
            </button>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari Nomor Seri (SN), ID Pelanggan, atau Nama..."
              className="input input-bordered input-sm w-full pl-9 text-xs bg-pdam-bg/50 border-slate-200 focus:border-pdam-primary focus:bg-white"
            />
          </div>
          <select
            value={merkFilter}
            onChange={(e) => setMerkFilter(e.target.value)}
            className="select select-bordered select-sm w-full text-xs border-slate-200 bg-white text-slate-700"
          >
            <option value="">Semua Merk Water Meter</option>
            {MERK_OPTIONS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
          <select
            value={dnFilter}
            onChange={(e) => setDnFilter(e.target.value)}
            className="select select-bordered select-sm w-full text-xs border-slate-200 bg-white text-slate-700"
          >
            <option value="">Semua Ukuran (DN)</option>
            {DN_OPTIONS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabel Data Water Meter */}
      <div className="card bg-white border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-sm w-full">
            <thead>
              <tr className="bg-pdam-bg text-pdam-navy text-[11px] uppercase tracking-wider border-b border-slate-200 font-bold">
                <th className="py-3.5 pl-5">No. Seri (SN)</th>
                <th className="py-3.5">Merk &amp; Ukuran</th>
                <th className="py-3.5">Status</th>
                <th className="py-3.5">Lokasi / Pelanggan</th>
                <th className="py-3.5 text-right pr-5">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((item) => (
                <tr key={item.noSeri} className="hover:bg-pdam-bg/60 transition-colors">
                  <td className="py-3.5 pl-5 font-bold">
                    <span className="text-pdam-primary font-mono block">{item.noSeri}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{item.tera}</span>
                  </td>
                  <td className="py-3.5">
                    <span className="font-semibold text-pdam-navy block">{item.merk}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{item.dn}</span>
                  </td>
                  <td className="py-3.5">
                    <span className={`badge badge-sm font-bold border ${statusClass[item.status]}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span className="font-semibold text-pdam-navy block">{item.lokasi}</span>
                    <span className="text-[10px] text-slate-500">{item.detail}</span>
                  </td>
                  <td className="py-3.5 text-right pr-5">
                    <button
                      onClick={() => setDetailItem(item)}
                      className="text-pdam-primary hover:text-pdam-navy font-semibold hover:underline flex items-center justify-end gap-0.5 ml-auto"
                    >
                      Detail <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-400">
                    Tidak ada water meter yang sesuai filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <span>
            Menampilkan {filtered.length} dari 1.250 unit water meter •{" "}
            <strong className="text-pdam-navy">Halaman 1 dari 125</strong>
          </span>
          <div className="join">
            <button className="join-item btn btn-sm btn-disabled">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="join-item btn btn-sm bg-pdam-primary text-white font-bold border-0">1</button>
            <button className="join-item btn btn-sm btn-ghost hover:bg-pdam-bg">2</button>
            <button className="join-item btn btn-sm btn-ghost hover:bg-pdam-bg">3</button>
            <button className="join-item btn btn-sm btn-ghost hover:bg-pdam-bg">...</button>
            <button className="join-item btn btn-sm btn-ghost hover:bg-pdam-bg">125</button>
            <button className="join-item btn btn-sm btn-ghost hover:bg-pdam-bg">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals (dirender sekali di luar tabel) */}
      {showExport && (
        <ExportModal
          onClose={() => setShowExport(false)}
          allData={meters}
          filteredData={filtered}
        />
      )}
      {showRegistrasi && (
        <RegistrasiModal
          onClose={() => setShowRegistrasi(false)}
          existingSN={new Set(meters.map((m) => m.noSeri))}
          onAdd={(items) => setMeters((prev) => [...items, ...prev])}
        />
      )}
      {detailItem && <DetailModal item={detailItem} onClose={() => setDetailItem(null)} />}
    </div>
  );
}
