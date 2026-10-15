"use client";

import {
  Download,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  RotateCcw,
  CheckCircle2,
  Clock,
  Activity,
  ClipboardList,
  X,
  FileSpreadsheet,
  AlertCircle,
  UserCheck,
  MapPin,
  Upload,
} from "lucide-react";
import { useState, type ReactNode } from "react";

/* ------------------------------------------------------------------ */
/* Types & data                                                        */
/* ------------------------------------------------------------------ */

type Status = "Pending" | "Proses" | "Selesai" | "Dibatalkan"; // enum penugasan.status
type Label = "URGENT" | "RUTIN" | "TERA" | "INVESTIGASI" | "PRIORITAS";
type Cabang = "Pusat" | "Timur" | "Barat" | "Utara" | "Selatan";

interface Ticket {
  id: string;
  tanggal: string;
  cabang: Cabang;
  pelanggan: string;
  idPelanggan: string;
  alamat: string;
  alasan: string;
  label: Label;
  teknisi: string | null;
  status: Status;
  catatan?: string;
}

const initialTickets: Ticket[] = [
  { id: "TICK-1042", tanggal: "24 Okt • 08:30", cabang: "Timur", pelanggan: "Bambang Sutedjo", idPelanggan: "PLG-089211", alamat: "Jl. Pandugo Timur IV No. 18", alasan: "Bodi Retak/Bocor", label: "URGENT", teknisi: null, status: "Pending" },
  { id: "TICK-1041", tanggal: "24 Okt • 08:15", cabang: "Barat", pelanggan: "Koperasi Tirta Makmur", idPelanggan: "PLG-091480", alamat: "Kawasan Niaga Margomulyo", alasan: "Meteran Macet", label: "RUTIN", teknisi: "Agus Prabowo", status: "Proses" },
  { id: "TICK-1039", tanggal: "24 Okt • 07:45", cabang: "Utara", pelanggan: "Dr. Maria Ulfah", idPelanggan: "PLG-055102", alamat: "Pantai Mentari Blok B-12", alasan: "Kedaluwarsa >5 Thn", label: "TERA", teknisi: "Deni Febrianto", status: "Selesai" },
  { id: "TICK-1038", tanggal: "24 Okt • 07:10", cabang: "Selatan", pelanggan: "CV. Surya Mandiri", idPelanggan: "PLG-078199", alamat: "Jl. Ngagel Jaya Selatan No. 44B", alasan: "Segel Rusak/Putus", label: "INVESTIGASI", teknisi: null, status: "Pending" },
  { id: "TICK-1035", tanggal: "23 Okt • 16:40", cabang: "Pusat", pelanggan: "Hotel Majapahit", idPelanggan: "PLG-014802", alamat: "Jl. Tunjungan No. 65", alasan: "Komersial DN 50", label: "PRIORITAS", teknisi: "Rizal Hidayat", status: "Proses" },
  { id: "TICK-1031", tanggal: "23 Okt • 14:10", cabang: "Timur", pelanggan: "Hartono Kusumo", idPelanggan: "PLG-003892", alamat: "Kertajaya Indah Timur XI", alasan: "Kaca Register Buram", label: "RUTIN", teknisi: "Budi Waluyo", status: "Selesai" },
];

// Mock master pelanggan (sumber: tabel pelanggan)
const pelangganList = [
  { id: "PLG-089211", nama: "Bambang Sutedjo", alamat: "Jl. Pandugo Timur IV No. 18", cabang: "Timur" as Cabang },
  { id: "PLG-002104", nama: "H. Ridwan Mansyur", alamat: "Jl. Kawi No. 18 RT 02/RW 04", cabang: "Pusat" as Cabang },
  { id: "PLG-055102", nama: "Siti Rahmawati Putri", alamat: "Jl. Simpang Borobudur Gang 4 No. 12", cabang: "Utara" as Cabang },
  { id: "PLG-091480", nama: "CV. Sumber Makmur Abadi", alamat: "Jl. Soekarno Hatta Ruko Kav. 8", cabang: "Barat" as Cabang },
  { id: "PLG-014802", nama: "Dra. Endang Purwanti", alamat: "Jl. Ijen No. 74", cabang: "Pusat" as Cabang },
  { id: "PLG-078199", nama: "PT. Indo Pangan Lestari", alamat: "Kawasan Industri Candi Blok A-12", cabang: "Selatan" as Cabang },
];

const alasanOptions: { alasan: string; label: Label }[] = [
  { alasan: "Bodi Retak/Bocor", label: "URGENT" },
  { alasan: "Segel Rusak/Putus", label: "INVESTIGASI" },
  { alasan: "Meteran Macet", label: "RUTIN" },
  { alasan: "Kaca Register Buram", label: "RUTIN" },
  { alasan: "Kedaluwarsa >5 Thn", label: "TERA" },
  { alasan: "Komersial DN 50", label: "PRIORITAS" },
];

const teknisiByCabang: Record<Cabang, { nama: string; aktif: number }[]> = {
  Pusat: [{ nama: "Rizal Hidayat", aktif: 3 }, { nama: "Yoga Pratama", aktif: 1 }],
  Timur: [{ nama: "Budi Waluyo", aktif: 2 }, { nama: "Anwar Setiadi", aktif: 0 }],
  Barat: [{ nama: "Agus Prabowo", aktif: 4 }, { nama: "Fajar Nugroho", aktif: 1 }],
  Utara: [{ nama: "Deni Febrianto", aktif: 2 }, { nama: "Bagas Wahyudi", aktif: 0 }],
  Selatan: [{ nama: "Rudi Hermawan", aktif: 1 }, { nama: "Teguh Santoso", aktif: 3 }],
};

const statusClass: Record<Status, string> = {
  Pending: "border-pdam-red/30 bg-pdam-red/10 text-pdam-red",
  Proses: "border-pdam-primary/30 bg-pdam-primary/10 text-pdam-primary",
  Selesai: "border-pdam-navy/30 bg-pdam-navy/10 text-pdam-navy",
  Dibatalkan: "border-slate-300 bg-slate-100 text-slate-500",
};

const labelClass: Record<Label, string> = {
  URGENT: "border-pdam-red/30 bg-pdam-red/10 text-pdam-red",
  INVESTIGASI: "border-amber-500/30 bg-amber-500/10 text-amber-700",
  PRIORITAS: "border-pdam-primary/30 bg-pdam-primary/10 text-pdam-primary",
  RUTIN: "border-slate-200 bg-slate-100 text-slate-600",
  TERA: "border-slate-200 bg-slate-100 text-slate-600",
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function formatNow() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${d.getDate()} ${BULAN[d.getMonth()]} • ${hh}:${mm}`;
}

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

/* ------------------------------------------------------------------ */
/* Modal shell                                                         */
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
  allData: Ticket[];
  filteredData: Ticket[];
}) {
  const [format, setFormat] = useState<"xlsx" | "csv">("xlsx");
  const [scope, setScope] = useState<"filter" | "all">("filter");
  const rows = scope === "filter" ? filteredData : allData;

  const header = ["ID Tiket", "Tanggal", "Cabang", "Pelanggan", "Alamat", "Alasan", "Prioritas", "Teknisi", "Status"];
  const toRow = (t: Ticket) => [
    t.id,
    t.tanggal,
    t.cabang,
    t.pelanggan,
    t.alamat,
    t.alasan,
    t.label,
    t.teknisi ?? "-",
    t.status,
  ];

  const handleExport = () => {
    const stamp = new Date().toISOString().slice(0, 10);
    if (format === "csv") {
      const csv = [header.map(csvCell).join(",")]
        .concat(rows.map((r) => toRow(r).map(csvCell).join(",")))
        .join("\n");
      downloadFile(`penugasan-${stamp}.csv`, csv, "text/csv;charset=utf-8");
    } else {
      // TODO: ganti dengan SheetJS (xlsx) untuk file .xlsx asli.
      // Sementara: tab-separated yang dibuka Excel sebagai .xls.
      const tsv = [header.join("\t")].concat(rows.map((r) => toRow(r).join("\t"))).join("\n");
      downloadFile(`penugasan-${stamp}.xls`, tsv, "application/vnd.ms-excel");
    }
    onClose();
  };

  return (
    <Modal
      title="Export Data Penugasan"
      subtitle="Unduh daftar SPK sesuai cakupan yang dipilih."
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className={btnGhost}>
            Batal
          </button>
          <button onClick={handleExport} disabled={rows.length === 0} className={btnPrimary}>
            <Download className="w-4 h-4" /> Unduh {rows.length} Tiket
          </button>
        </>
      }
    >
      <div className="space-y-5">
        <div>
          <span className={labelCls}>Format File</span>
          <div className="grid grid-cols-2 gap-2">
            {(["xlsx", "csv"] as const).map((f) => (
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
                {f === "xlsx" ? "Excel (XLSX)" : "CSV (.csv)"}
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
              Sesuai filter aktif ({filteredData.length} tiket)
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                className="radio radio-xs radio-primary"
                checked={scope === "all"}
                onChange={() => setScope("all")}
              />
              Semua tiket yang dimuat ({allData.length} tiket)
            </label>
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Modal: Buat Tiket Penugasan (satuan + upload massal CSV)            */
/* ------------------------------------------------------------------ */

type TicketInput = {
  pelanggan: (typeof pelangganList)[number];
  alasan: string;
  label: Label;
  catatan: string;
};

const MAX_BULK_ROWS = 500;

// Parser CSV/TSV sederhana: mendukung tanda kutip, koma, titik koma, dan tab
function parseDelimited(text: string): string[][] {
  const clean = text.replace(/^\uFEFF/, "");
  const firstLine = clean.split(/\r?\n/)[0] ?? "";
  const delim = firstLine.includes("\t") ? "\t" : firstLine.includes(";") && !firstLine.includes(",") ? ";" : ",";

  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];
    if (quoted) {
      if (ch === '"' && clean[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === delim) {
      row.push(cell.trim());
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && clean[i + 1] === "\n") i++;
      row.push(cell.trim());
      if (row.some((c) => c !== "")) rows.push(row);
      row = [];
      cell = "";
    } else cell += ch;
  }
  row.push(cell.trim());
  if (row.some((c) => c !== "")) rows.push(row);
  return rows;
}

function CreateTicketModal({
  onClose,
  onCreate,
  onBulkCreate,
}: {
  onClose: () => void;
  onCreate: (data: TicketInput) => void;
  onBulkCreate: (items: TicketInput[]) => void;
}) {
  const [tab, setTab] = useState<"single" | "bulk">("single");

  // single
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<(typeof pelangganList)[number] | null>(null);
  const [alasan, setAlasan] = useState(alasanOptions[0].alasan);
  const [catatan, setCatatan] = useState("");
  const [error, setError] = useState("");

  // bulk
  const [fileName, setFileName] = useState("");
  const [parsed, setParsed] = useState<TicketInput[]>([]);
  const [bulkErrors, setBulkErrors] = useState<string[]>([]);

  const results = pelangganList
    .filter(
      (p) =>
        p.nama.toLowerCase().includes(query.toLowerCase()) ||
        p.id.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 5);

  const handleSingle = () => {
    if (!selected) return setError("Pilih pelanggan terlebih dahulu.");
    const opt = alasanOptions.find((a) => a.alasan === alasan)!;
    onCreate({ pelanggan: selected, alasan: opt.alasan, label: opt.label, catatan: catatan.trim() });
    onClose();
  };

  const templateCsv =
    "id_pelanggan,alasan,catatan\n" +
    "PLG-089211,Bodi Retak/Bocor,Bocor di sambungan\n" +
    "PLG-002104,Meteran Macet,\n";

  const handleFile = async (file?: File) => {
    if (!file) return;
    setFileName(file.name);
    const rows = parseDelimited(await file.text()).slice(1); // baris pertama = header
    const errs: string[] = [];
    const items: TicketInput[] = [];
    const seen = new Set<string>();

    if (rows.length > MAX_BULK_ROWS)
      errs.push(`File berisi ${rows.length} baris, hanya ${MAX_BULK_ROWS} baris pertama yang diproses.`);

    rows.slice(0, MAX_BULK_ROWS).forEach((cols, i) => {
      const [id = "", alasanInput = "", note = ""] = cols;
      const rowNo = i + 2;
      const pel = pelangganList.find((p) => p.id.toLowerCase() === id.toLowerCase());
      const opt = alasanOptions.find((a) => a.alasan.toLowerCase() === alasanInput.toLowerCase());

      if (!id) return errs.push(`Baris ${rowNo}: ID pelanggan kosong.`);
      if (!pel) return errs.push(`Baris ${rowNo}: ID pelanggan ${id} tidak ditemukan.`);
      if (!opt) return errs.push(`Baris ${rowNo}: alasan "${alasanInput || "-"}" tidak dikenali.`);
      const key = `${pel.id}|${opt.alasan}`;
      if (seen.has(key)) return errs.push(`Baris ${rowNo}: ${pel.id} dengan alasan yang sama duplikat.`);
      seen.add(key);
      items.push({ pelanggan: pel, alasan: opt.alasan, label: opt.label, catatan: note });
    });

    setParsed(items);
    setBulkErrors(errs);
  };

  const handleBulk = () => {
    if (parsed.length === 0) return;
    onBulkCreate(parsed);
    onClose();
  };

  return (
    <Modal
      wide
      title="Buat Tiket Penugasan"
      subtitle="Tiket diterbitkan oleh Admin Pusat dengan status awal Pending, lalu didisposisikan ke teknisi."
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className={btnGhost}>
            Batal
          </button>
          {tab === "single" ? (
            <button onClick={handleSingle} className={btnPrimary}>
              <Plus className="w-4 h-4" /> Terbitkan Tiket
            </button>
          ) : (
            <button onClick={handleBulk} disabled={parsed.length === 0} className={btnPrimary}>
              <Upload className="w-4 h-4" /> Import {parsed.length} Tiket
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
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Pelanggan</label>
            {selected ? (
              <div className="flex items-start justify-between rounded-lg border border-pdam-primary/30 bg-pdam-primary/5 p-3">
                <div>
                  <p className="text-xs font-bold text-pdam-navy">{selected.nama}</p>
                  <p className="text-[10px] font-mono text-slate-400">{selected.id}</p>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {selected.alamat} • Cabang {selected.cabang}
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
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Cari nama atau ID pelanggan..."
                    className="input input-bordered input-sm w-full pl-9 text-xs border-slate-200 focus:border-pdam-primary"
                  />
                </div>
                <ul className="mt-2 rounded-lg border border-slate-200 divide-y divide-slate-100 max-h-44 overflow-y-auto">
                  {results.map((p) => (
                    <li key={p.id}>
                      <button
                        onClick={() => setSelected(p)}
                        className="w-full text-left px-3 py-2 hover:bg-pdam-bg transition-colors"
                      >
                        <span className="text-xs font-semibold text-pdam-navy block">{p.nama}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {p.id} • Cabang {p.cabang}
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
            <label className={labelCls}>Alasan Penggantian</label>
            <select className={selectCls} value={alasan} onChange={(e) => setAlasan(e.target.value)}>
              {alasanOptions.map((a) => (
                <option key={a.alasan} value={a.alasan}>
                  {a.alasan} ({a.label})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Catatan (opsional)</label>
            <textarea
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              rows={3}
              maxLength={200}
              placeholder="Informasi tambahan untuk Admin Cabang / teknisi..."
              className="textarea textarea-bordered w-full text-xs border-slate-200 focus:border-pdam-primary"
            />
          </div>

          {error && (
            <p className="text-xs text-pdam-red font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {error}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Kolom: id_pelanggan, alasan, catatan</span>
            <button
              onClick={() => downloadFile("template-penugasan.csv", templateCsv, "text/csv")}
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
            <span className="text-[10px] text-slate-400">
              Format .csv, baris pertama sebagai header, maks. {MAX_BULK_ROWS} baris
            </span>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </label>

          <p className="text-[11px] text-slate-500">
            Alasan yang valid: {alasanOptions.map((a) => a.alasan).join(", ")}.
          </p>

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
/* Modal: Pilih Teknisi                                                */
/* ------------------------------------------------------------------ */

function AssignModal({
  ticket,
  onClose,
  onAssign,
}: {
  ticket: Ticket;
  onClose: () => void;
  onAssign: (nama: string) => void;
}) {
  const [chosen, setChosen] = useState("");
  const list = teknisiByCabang[ticket.cabang];

  return (
    <Modal
      title="Pilih Teknisi"
      subtitle={`${ticket.id} • ${ticket.pelanggan} • Cabang ${ticket.cabang}`}
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className={btnGhost}>
            Batal
          </button>
          <button
            onClick={() => {
              onAssign(chosen);
              onClose();
            }}
            disabled={!chosen}
            className={btnPrimary}
          >
            <UserCheck className="w-4 h-4" /> Tugaskan
          </button>
        </>
      }
    >
      <p className="text-[11px] text-slate-500 mb-3">
        Menampilkan teknisi unit Cabang {ticket.cabang}. Status tiket akan menjadi{" "}
        <strong className="text-pdam-primary">Proses</strong> setelah ditugaskan.
      </p>
      <ul className="space-y-2">
        {list.map((t) => (
          <li key={t.nama}>
            <label
              className={`flex items-center justify-between rounded-lg border p-3 cursor-pointer transition-colors ${
                chosen === t.nama
                  ? "border-pdam-primary bg-pdam-primary/5"
                  : "border-slate-200 hover:bg-pdam-bg"
              }`}
            >
              <span className="flex items-center gap-3">
                <input
                  type="radio"
                  className="radio radio-xs radio-primary"
                  checked={chosen === t.nama}
                  onChange={() => setChosen(t.nama)}
                />
                <span className="text-xs font-semibold text-pdam-navy">{t.nama}</span>
              </span>
              <span
                className={`badge badge-sm font-bold border ${
                  t.aktif >= 3
                    ? "border-amber-500/30 bg-amber-500/10 text-amber-700"
                    : "border-pdam-primary/30 bg-pdam-primary/10 text-pdam-primary"
                }`}
              >
                {t.aktif} tugas aktif
              </span>
            </label>
          </li>
        ))}
      </ul>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Modal: Detail                                                       */
/* ------------------------------------------------------------------ */

function DetailModal({
  ticket,
  onClose,
  onPickTeknisi,
  onCancel,
}: {
  ticket: Ticket;
  onClose: () => void;
  onPickTeknisi: () => void;
  onCancel: () => void;
}) {
  const [confirmCancel, setConfirmCancel] = useState(false);

  const timeline: { judul: string; ket: string }[] = [
    { judul: "Tiket diterbitkan Admin Pusat", ket: ticket.tanggal },
  ];
  if (ticket.teknisi)
    timeline.push({ judul: "Teknisi ditugaskan", ket: `${ticket.teknisi} • Cabang ${ticket.cabang}` });
  if (ticket.status === "Selesai")
    timeline.push({ judul: "Pekerjaan selesai & terverifikasi", ket: "Laporan teknisi diverifikasi Admin Cabang" });
  if (ticket.status === "Dibatalkan")
    timeline.push({ judul: "Tiket dibatalkan", ket: "Tidak ada penggantian dilakukan" });

  const Row = ({ k, v }: { k: string; v: ReactNode }) => (
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{k}</p>
      <p className="text-xs font-semibold text-pdam-navy mt-0.5">{v}</p>
    </div>
  );

  return (
    <Modal
      wide
      title="Detail Tiket Penugasan"
      subtitle="Informasi SPK dan riwayat alur penugasan."
      onClose={onClose}
      footer={
        <>
          {ticket.status === "Pending" &&
            (confirmCancel ? (
              <>
                <span className="text-xs text-slate-500 self-center mr-auto">
                  Yakin batalkan tiket ini?
                </span>
                <button onClick={() => setConfirmCancel(false)} className={btnGhost}>
                  Tidak
                </button>
                <button
                  onClick={() => {
                    onCancel();
                    onClose();
                  }}
                  className="btn btn-sm bg-pdam-red hover:bg-pdam-red/90 text-white border-0 normal-case font-semibold"
                >
                  Ya, Batalkan
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setConfirmCancel(true)}
                  className="btn btn-sm btn-ghost text-pdam-red hover:bg-pdam-red/10 normal-case font-semibold mr-auto"
                >
                  Batalkan Tiket
                </button>
                <button onClick={onClose} className={btnGhost}>
                  Tutup
                </button>
                <button onClick={onPickTeknisi} className={btnPrimary}>
                  <UserCheck className="w-4 h-4" /> Pilih Teknisi
                </button>
              </>
            ))}
          {ticket.status !== "Pending" && (
            <button onClick={onClose} className={btnGhost}>
              Tutup
            </button>
          )}
        </>
      }
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-mono font-bold text-lg text-pdam-primary">{ticket.id}</p>
          <p className="text-[11px] text-slate-500">{ticket.tanggal}</p>
        </div>
        <span className={`badge badge-md font-bold border ${statusClass[ticket.status]}`}>
          {ticket.status}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-5 border-b border-slate-200">
        <Row k="Pelanggan" v={ticket.pelanggan} />
        <Row k="ID Pelanggan" v={<span className="font-mono">{ticket.idPelanggan}</span>} />
        <Row k="Cabang" v={ticket.cabang} />
        <div className="col-span-2 sm:col-span-3">
          <Row k="Alamat" v={ticket.alamat} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 py-5 border-b border-slate-200">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Alasan</p>
          <div className="flex items-center gap-1.5">
            <span className={`badge badge-xs font-bold border ${labelClass[ticket.label]}`}>
              {ticket.label}
            </span>
            <span className="text-xs font-semibold text-pdam-navy">{ticket.alasan}</span>
          </div>
        </div>
        <Row k="Teknisi" v={ticket.teknisi ?? <span className="text-slate-400">Belum ditugaskan</span>} />
        {ticket.catatan && (
          <div className="col-span-2">
            <Row k="Catatan" v={ticket.catatan} />
          </div>
        )}
      </div>

      <div className="pt-5">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Riwayat</p>
        <ul className="space-y-3">
          {timeline.map((t, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-1 w-2 h-2 rounded-full bg-pdam-primary shrink-0" />
              <div>
                <p className="text-xs font-semibold text-pdam-navy">{t.judul}</p>
                <p className="text-[11px] text-slate-500">{t.ket}</p>
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

type StatusFilter = "Semua" | "Pending" | "Proses" | "Selesai";

export default function PenugasanPusatPage() {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [search, setSearch] = useState("");
  const [cabangFilter, setCabangFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Semua");

  const [showExport, setShowExport] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [assignId, setAssignId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);

  // Modal membaca tiket terbaru dari state lewat id
  const assignTicket = tickets.find((t) => t.id === assignId) ?? null;
  const detailTicket = tickets.find((t) => t.id === detailId) ?? null;

  const filtered = tickets.filter((t) => {
    const q = search.toLowerCase();
    return (
      (statusFilter === "Semua" || t.status === statusFilter) &&
      (!cabangFilter || t.cabang === cabangFilter) &&
      (!q ||
        t.id.toLowerCase().includes(q) ||
        t.pelanggan.toLowerCase().includes(q) ||
        t.idPelanggan.toLowerCase().includes(q) ||
        t.cabang.toLowerCase().includes(q))
    );
  });

  const resetFilter = () => {
    setSearch("");
    setCabangFilter("");
    setStatusFilter("Semua");
  };

  const updateTicket = (id: string, patch: Partial<Ticket>) =>
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));

  const handleCreate = ({
    pelanggan,
    alasan,
    label,
    catatan,
  }: {
    pelanggan: (typeof pelangganList)[number];
    alasan: string;
    label: Label;
    catatan: string;
  }) => {
    const nextNo = Math.max(...tickets.map((t) => Number(t.id.replace("TICK-", "")))) + 1;
    setTickets((prev) => [
      {
        id: `TICK-${nextNo}`,
        tanggal: formatNow(),
        cabang: pelanggan.cabang,
        pelanggan: pelanggan.nama,
        idPelanggan: pelanggan.id,
        alamat: pelanggan.alamat,
        alasan,
        label,
        teknisi: null,
        status: "Pending",
        catatan: catatan || undefined,
      },
      ...prev,
    ]);
  };

  const handleBulkCreate = (items: TicketInput[]) => {
    let no = Math.max(...tickets.map((t) => Number(t.id.replace("TICK-", ""))));
    const now = formatNow();
    const created: Ticket[] = items.map((it) => ({
      id: `TICK-${++no}`,
      tanggal: now,
      cabang: it.pelanggan.cabang,
      pelanggan: it.pelanggan.nama,
      idPelanggan: it.pelanggan.id,
      alamat: it.pelanggan.alamat,
      alasan: it.alasan,
      label: it.label,
      teknisi: null,
      status: "Pending",
      catatan: it.catatan || undefined,
    }));
    setTickets((prev) => [...created.reverse(), ...prev]);
  };

  const tabs: { label: string; value: StatusFilter; count: string }[] = [
    { label: "Semua", value: "Semua", count: "2,150" },
    { label: "Pending", value: "Pending", count: "315" },
    { label: "Proses", value: "Proses", count: "980" },
    { label: "Selesai", value: "Selesai", count: "855" },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header Title */}
      <div>
        <p className="text-xs text-slate-500 mb-1">
          PDAM Tirta / Operasional /{" "}
          <span className="text-pdam-primary font-semibold">Penugasan</span>
        </p>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-pdam-navy">
              Manajemen Penugasan (Admin Pusat)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Monitoring dan alokasi Surat Perintah Kerja (SPK) penggantian water meter.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowExport(true)}
              className="btn btn-sm btn-ghost bg-white hover:bg-pdam-bg border border-slate-200 text-pdam-navy font-semibold normal-case shadow-xs"
            >
              <Download className="w-4 h-4 text-pdam-primary" />
              <span>Export Data (XLSX)</span>
            </button>
            <button
              onClick={() => setShowCreate(true)}
              className="btn btn-sm bg-pdam-primary hover:bg-pdam-navy text-white font-semibold normal-case border-0 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Tiket Penugasan</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Kartu Statistik Nasional */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-white border border-slate-200/90 shadow-xs p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Total SPK Nasional
              </p>
              <h3 className="text-2xl font-black text-pdam-navy tabular-nums">2,150</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Akumulasi seluruh cabang</p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-pdam-bg flex items-center justify-center text-pdam-navy border border-slate-200/80">
              <ClipboardList className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="card bg-white border border-slate-200/90 shadow-xs p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-pdam-red uppercase tracking-wider mb-1">
                Pending (Disposisi)
              </p>
              <h3 className="text-2xl font-black text-pdam-red tabular-nums">315</h3>
              <p className="text-[11px] text-pdam-red/80 mt-0.5">Memerlukan penugasan teknisi</p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-pdam-red/10 flex items-center justify-center text-pdam-red border border-pdam-red/20">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="card bg-white border border-slate-200/90 shadow-xs p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-pdam-primary uppercase tracking-wider mb-1">
                Sedang Dikerjakan
              </p>
              <h3 className="text-2xl font-black text-pdam-primary tabular-nums">980</h3>
              <p className="text-[11px] text-pdam-primary/80 mt-0.5">Teknisi di lapangan</p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-pdam-primary/10 flex items-center justify-center text-pdam-primary border border-pdam-primary/20">
              <Activity className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="card bg-white border border-slate-200/90 shadow-xs p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-pdam-navy uppercase tracking-wider mb-1">
                Selesai &amp; Terverifikasi
              </p>
              <h3 className="text-2xl font-black text-pdam-navy tabular-nums">855</h3>
              <p className="text-[11px] text-pdam-navy/80 mt-0.5">Hasil segel tervalidasi</p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-pdam-navy/10 flex items-center justify-center text-pdam-navy border border-pdam-navy/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Bar Pencarian */}
      <div className="card bg-white border border-slate-200/90 shadow-xs p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari ID Tiket, Pelanggan, No. Seri, Cabang..."
              className="input input-bordered input-sm w-full pl-9 text-xs bg-pdam-bg/50 border-slate-200 focus:border-pdam-primary focus:bg-white"
            />
          </div>
          <select
            value={cabangFilter}
            onChange={(e) => setCabangFilter(e.target.value)}
            className="select select-bordered select-sm w-full text-xs font-semibold border-slate-200 bg-white text-slate-700"
          >
            <option value="">Semua Cabang (Nasional)</option>
            {(["Pusat", "Timur", "Barat", "Utara", "Selatan"] as Cabang[]).map((c) => (
              <option key={c} value={c}>
                Cabang {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-200 gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
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
                {t.label} ({t.count})
              </button>
            ))}
          </div>

          <button
            onClick={resetFilter}
            className="btn btn-sm btn-ghost text-xs text-slate-400 hover:text-pdam-navy gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Tabel SPK */}
      <div className="card bg-white border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-pdam-bg/60">
          <h3 className="font-bold text-xs uppercase tracking-wider flex items-center gap-2 text-pdam-navy">
            Daftar Surat Perintah Kerja (SPK)
            <span className="badge border border-pdam-primary/30 bg-pdam-primary/10 text-pdam-primary text-[10px] font-semibold">
              Aktif Real-time
            </span>
          </h3>
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span>Menampilkan {filtered.length} dari 2,150 tiket</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span> Sinkronisasi Terkini
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table table-sm w-full">
            <thead>
              <tr className="bg-pdam-bg text-pdam-navy text-[11px] uppercase tracking-wider border-b border-slate-200 font-bold">
                <th className="py-3.5 pl-5">ID &amp; Tanggal</th>
                <th className="py-3.5">Cabang</th>
                <th className="py-3.5">Pelanggan &amp; Alamat</th>
                <th className="py-3.5">Alasan</th>
                <th className="py-3.5">Teknisi</th>
                <th className="py-3.5">Status</th>
                <th className="py-3.5 text-right pr-5">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-pdam-bg/60 transition-colors">
                  <td className="py-3.5 pl-5 font-bold">
                    <span className="text-pdam-primary font-mono block">{item.id}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{item.tanggal}</span>
                  </td>
                  <td className="py-3.5">
                    <span className="badge bg-slate-100 text-slate-700 border-slate-200 badge-sm font-bold">
                      {item.cabang}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span className="font-semibold text-pdam-navy block">{item.pelanggan}</span>
                    <span className="text-[10px] text-slate-500">{item.alamat}</span>
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`badge badge-xs font-bold border ${labelClass[item.label]}`}>
                        {item.label}
                      </span>
                      <span className="text-slate-700">{item.alasan}</span>
                    </div>
                  </td>
                  <td className="py-3.5">
                    {item.teknisi ? (
                      <span className="font-medium text-slate-700">{item.teknisi}</span>
                    ) : item.status === "Pending" ? (
                      <button
                        onClick={() => setAssignId(item.id)}
                        className="btn btn-xs btn-outline border-pdam-primary text-pdam-primary hover:bg-pdam-primary hover:text-white font-semibold normal-case"
                      >
                        + Pilih
                      </button>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-3.5">
                    <span className={`badge badge-sm font-bold border ${statusClass[item.status]}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right pr-5">
                    <button
                      onClick={() => setDetailId(item.id)}
                      className="text-pdam-primary hover:text-pdam-navy font-semibold hover:underline flex items-center justify-end gap-0.5 ml-auto"
                    >
                      Detail <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    Tidak ada tiket yang sesuai filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Baris per halaman:</span>
            <select className="select select-bordered select-xs w-16 border-slate-200 bg-white">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <span>• 1 - {filtered.length} dari 2,150 tiket</span>
          </div>

          <div className="join">
            <button className="join-item btn btn-sm btn-ghost hover:bg-pdam-bg">|&lt;</button>
            <button className="join-item btn btn-sm btn-ghost hover:bg-pdam-bg">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="join-item btn btn-sm bg-pdam-primary text-white font-bold border-0">1</button>
            <button className="join-item btn btn-sm btn-ghost hover:bg-pdam-bg">2</button>
            <button className="join-item btn btn-sm btn-ghost hover:bg-pdam-bg">3</button>
            <button className="join-item btn btn-sm btn-ghost hover:bg-pdam-bg">...</button>
            <button className="join-item btn btn-sm btn-ghost hover:bg-pdam-bg">215</button>
            <button className="join-item btn btn-sm btn-ghost hover:bg-pdam-bg">
              <ChevronRight className="w-4 h-4" />
            </button>
            <button className="join-item btn btn-sm btn-ghost hover:bg-pdam-bg">&gt;|</button>
          </div>
        </div>
      </div>

      {/* Modals (dirender sekali di luar tabel) */}
      {showExport && (
        <ExportModal onClose={() => setShowExport(false)} allData={tickets} filteredData={filtered} />
      )}
      {showCreate && (
        <CreateTicketModal
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
          onBulkCreate={handleBulkCreate}
        />
      )}
      {assignTicket && (
        <AssignModal
          ticket={assignTicket}
          onClose={() => setAssignId(null)}
          onAssign={(nama) => updateTicket(assignTicket.id, { teknisi: nama, status: "Proses" })}
        />
      )}
      {detailTicket && !assignTicket && (
        <DetailModal
          ticket={detailTicket}
          onClose={() => setDetailId(null)}
          onPickTeknisi={() => setAssignId(detailTicket.id)}
          onCancel={() => updateTicket(detailTicket.id, { status: "Dibatalkan", teknisi: null })}
        />
      )}
    </div>
  );
}
