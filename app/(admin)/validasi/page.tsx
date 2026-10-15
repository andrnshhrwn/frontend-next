"use client";

import {
  Download,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  FileCheck,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  X,
  Camera,
  FileSpreadsheet,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import { useState, type ReactNode } from "react";

/* ------------------------------------------------------------------ */
/* Types & data                                                        */
/* ------------------------------------------------------------------ */

type Status = "Menunggu" | "Disetujui" | "Ditolak";
// enum penggantian_wm.kondisi_fisik_wm_lama
type Kondisi = "normal" | "macet" | "kaca_pecah" | "berembun_parah" | "bodi_korosi";

const kondisiLabel: Record<Kondisi, string> = {
  normal: "Normal",
  macet: "Macet",
  kaca_pecah: "Kaca Pecah",
  berembun_parah: "Berembun Parah",
  bodi_korosi: "Bodi Korosi",
};

interface Bap {
  idTiket: string;
  tanggal: string;
  bapNo: string;
  pelanggan: string;
  plgId: string;
  alamat: string;
  cabang: string;
  teknisi: string;
  snLama: string;
  standLama: number;
  kondisi: Kondisi;
  snBaru: string;
  standBaru: number | null; // null = stand tidak terbaca pada foto
  dn: string;
  catatan?: string;
  status: Status;
  statusDesc: string;
}

const initialData: Bap[] = [
  { idTiket: "TICK-TMR-2026-101", tanggal: "Hari ini, 10:45", bapNo: "BAP #24", pelanggan: "Bambang Sugianto", plgId: "PLG-089211", alamat: "Jl. Rungkut Asri Timur No. 42 • DMA-RKT-04", cabang: "Timur", teknisi: "Rudi Hermawan", snLama: "WM-19-004812", standLama: 1482, kondisi: "macet", snBaru: "WM-24-009185", standBaru: 0, dn: "DN15", catatan: "Meteran lama tidak berputar, segel utuh.", status: "Menunggu", statusDesc: "Perlu Tinjauan Segera" },
  { idTiket: "TICK-TMR-2026-099", tanggal: "Hari ini, 09:15", bapNo: "BAP #23", pelanggan: "Siti Aminah", plgId: "PLG-081042", alamat: "Komplek Pandugo 2 Blok C-18 • DMA-PDG-01", cabang: "Timur", teknisi: "Dwi Anggoro", snLama: "WM-18-002194", standLama: 3819, kondisi: "kaca_pecah", snBaru: "WM-24-009180", standBaru: 0, dn: "DN15", status: "Disetujui", statusDesc: "BAP Diterbitkan & Sinkron" },
  { idTiket: "TICK-TMR-2026-094", tanggal: "Hari ini, 08:30", bapNo: "BAP #22", pelanggan: "Hj. Maryam Fauzi", plgId: "PLG-076534", alamat: "Jl. Medokan Asri Utara III/12 • DMA-MDK-02", cabang: "Timur", teknisi: "Rudi Hermawan", snLama: "WM-17-009941", standLama: 5201, kondisi: "berembun_parah", snBaru: "WM-24-009172", standBaru: null, dn: "DN15", status: "Ditolak", statusDesc: "Foto Buram / Deviasi Stand" },
  { idTiket: "TICK-TMR-2026-088", tanggal: "Kemarin, 16:20", bapNo: "BAP #21", pelanggan: "PT. Surya Inti Abadi", plgId: "PLG-012900", alamat: "SIER Blok M-5 • DMA-IND-01", cabang: "Timur", teknisi: "Ilham Santoso", snLama: "WM-16-000843", standLama: 12430, kondisi: "berembun_parah", snBaru: "WM-24-009165", standBaru: 0, dn: "DN25", status: "Menunggu", statusDesc: "Perlu Tinjauan Segera" },
  { idTiket: "TICK-TMR-2026-085", tanggal: "Kemarin, 14:10", bapNo: "BAP #20", pelanggan: "Kurniawan Tejo", plgId: "PLG-064891", alamat: "Jl. Tenggilis Mejoyo Slt VII/5 • DMA-TNG-03", cabang: "Timur", teknisi: "Dwi Anggoro", snLama: "WM-19-001099", standLama: 2118, kondisi: "normal", snBaru: "WM-24-009158", standBaru: 0, dn: "DN15", status: "Disetujui", statusDesc: "BAP Diterbitkan & Sinkron" },
  { idTiket: "TICK-TMR-2026-081", tanggal: "Kemarin, 11:05", bapNo: "BAP #19", pelanggan: "Dewi Anggraini", plgId: "PLG-059914", alamat: "Jl. Semampir Barat Gg II/8 • DMA-SMP-01", cabang: "Timur", teknisi: "Ilham Santoso", snLama: "WM-19-003310", standLama: 1890, kondisi: "bodi_korosi", snBaru: "WM-24-009151", standBaru: 0, dn: "DN15", status: "Menunggu", statusDesc: "Perlu Tinjauan Segera" },
];

const statusClass: Record<Status, string> = {
  Menunggu: "border-pdam-primary/30 bg-pdam-primary/10 text-pdam-primary",
  Disetujui: "border-pdam-navy/30 bg-pdam-navy/10 text-pdam-navy",
  Ditolak: "border-pdam-red/30 bg-pdam-red/10 text-pdam-red",
};

const alasanTolak = [
  "Foto buram / tidak terbaca",
  "Deviasi stand meter",
  "Nomor seri tidak sesuai",
  "Foto tidak lengkap",
  "Lainnya",
];

const fmtStand = (n: number | null) => (n === null ? "Stand Buram" : `${n.toLocaleString("id-ID")} m³`);

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
      <div
        className={`modal-box bg-white p-0 ${wide ? "max-w-3xl" : "max-w-md"} max-h-[92vh] flex flex-col`}
      >
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-slate-200 shrink-0">
          <div>
            <h3 className="font-extrabold text-pdam-navy">{title}</h3>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-xs btn-square text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 py-5 overflow-y-auto">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-slate-200 bg-pdam-bg/50 flex justify-end gap-2 shrink-0">
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
/* Modal: Export Rekap                                                 */
/* ------------------------------------------------------------------ */

function ExportModal({
  onClose,
  allData,
  filteredData,
}: {
  onClose: () => void;
  allData: Bap[];
  filteredData: Bap[];
}) {
  const [format, setFormat] = useState<"xlsx" | "csv">("xlsx");
  const [scope, setScope] = useState<"filter" | "all">("filter");
  const rows = scope === "filter" ? filteredData : allData;

  const header = [
    "ID Tiket", "No. BAP", "Tanggal", "Pelanggan", "ID Pelanggan", "Cabang", "Teknisi",
    "SN Lama", "Stand Lama", "Kondisi Fisik WM Lama", "SN Baru", "Stand Awal WM Baru", "Ukuran", "Status", "Keterangan",
  ];
  const toRow = (b: Bap) => [
    b.idTiket, b.bapNo, b.tanggal, b.pelanggan, b.plgId, b.cabang, b.teknisi,
    b.snLama, String(b.standLama), kondisiLabel[b.kondisi], b.snBaru, fmtStand(b.standBaru), b.dn, b.status, b.statusDesc,
  ];

  const handleExport = () => {
    const stamp = new Date().toISOString().slice(0, 10);
    if (format === "csv") {
      const csv = [header.map(csvCell).join(",")]
        .concat(rows.map((r) => toRow(r).map(csvCell).join(",")))
        .join("\n");
      downloadFile(`rekap-verifikasi-${stamp}.csv`, csv, "text/csv;charset=utf-8");
    } else {
      // TODO: ganti dengan SheetJS (xlsx) untuk file .xlsx asli.
      const tsv = [header.join("\t")].concat(rows.map((r) => toRow(r).join("\t"))).join("\n");
      downloadFile(`rekap-verifikasi-${stamp}.xls`, tsv, "application/vnd.ms-excel");
    }
    onClose();
  };

  return (
    <Modal
      title="Export Rekap Verifikasi"
      subtitle="Unduh rekap BAP sesuai cakupan yang dipilih."
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className={btnGhost}>
            Batal
          </button>
          <button onClick={handleExport} disabled={rows.length === 0} className={btnPrimary}>
            <Download className="w-4 h-4" /> Unduh {rows.length} Berkas
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
              Sesuai filter aktif ({filteredData.length} berkas)
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                className="radio radio-xs radio-primary"
                checked={scope === "all"}
                onChange={() => setScope("all")}
              />
              Semua berkas yang dimuat ({allData.length} berkas)
            </label>
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Modal: Filter Lanjutan                                              */
/* ------------------------------------------------------------------ */

interface AdvFilter {
  teknisi: string;
  kondisi: string;
  dn: string;
}
const emptyAdv: AdvFilter = { teknisi: "", kondisi: "", dn: "" };

function AdvancedFilterModal({
  value,
  teknisiList,
  onClose,
  onApply,
}: {
  value: AdvFilter;
  teknisiList: string[];
  onClose: () => void;
  onApply: (v: AdvFilter) => void;
}) {
  const [f, setF] = useState<AdvFilter>(value);

  return (
    <Modal
      title="Filter Lanjutan"
      subtitle="Persempit daftar berkas berdasarkan teknisi, kondisi fisik, dan ukuran meter."
      onClose={onClose}
      footer={
        <>
          <button onClick={() => setF(emptyAdv)} className="btn btn-sm btn-ghost text-slate-500 normal-case font-semibold mr-auto gap-1">
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
          <button onClick={onClose} className={btnGhost}>
            Batal
          </button>
          <button
            onClick={() => {
              onApply(f);
              onClose();
            }}
            className={btnPrimary}
          >
            Terapkan
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className={labelCls}>Teknisi</label>
          <select className={selectCls} value={f.teknisi} onChange={(e) => setF({ ...f, teknisi: e.target.value })}>
            <option value="">Semua Teknisi</option>
            {teknisiList.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Kondisi Fisik WM Lama</label>
          <select className={selectCls} value={f.kondisi} onChange={(e) => setF({ ...f, kondisi: e.target.value })}>
            <option value="">Semua Kondisi</option>
            {(Object.keys(kondisiLabel) as Kondisi[]).map((k) => (
              <option key={k} value={k}>
                {kondisiLabel[k]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Ukuran Meter Baru</label>
          <select className={selectCls} value={f.dn} onChange={(e) => setF({ ...f, dn: e.target.value })}>
            <option value="">Semua Ukuran</option>
            <option>DN15</option>
            <option>DN20</option>
            <option>DN25</option>
          </select>
        </div>
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Modal: Periksa / Lihat BAP                                          */
/* ------------------------------------------------------------------ */

function PhotoPlaceholder({ label, path }: { label: string; path: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      {/* Ganti dengan <img src={...}> dari field path_image_* saat terhubung ke API */}
      <div className="aspect-4/3 rounded-lg border-2 border-dashed border-slate-300 bg-pdam-bg flex flex-col items-center justify-center gap-1 text-slate-400">
        <Camera className="w-6 h-6" />
        <span className="text-[10px] font-mono">{path}</span>
      </div>
    </div>
  );
}

function ReviewModal({
  item,
  onClose,
  onApprove,
  onReject,
}: {
  item: Bap;
  onClose: () => void;
  onApprove: () => void;
  onReject: (alasan: string) => void;
}) {
  const readOnly = item.status !== "Menunggu";
  const [checks, setChecks] = useState({ foto: false, sn: false, stand: false, kondisi: false });
  const [mode, setMode] = useState<"review" | "reject">("review");
  const [alasan, setAlasan] = useState(alasanTolak[0]);
  const [catatanTolak, setCatatanTolak] = useState("");
  const [error, setError] = useState("");

  const allChecked = Object.values(checks).every(Boolean);
  const standBermasalah = item.standBaru === null;

  const checkItems: { key: keyof typeof checks; label: string }[] = [
    { key: "foto", label: "Foto WM lama & baru jelas dan terbaca" },
    { key: "sn", label: "Nomor seri WM baru sesuai dengan stok unit" },
    { key: "stand", label: "Stand meter lama & stand awal WM baru sesuai foto" },
    { key: "kondisi", label: "Kondisi fisik WM lama sesuai bukti foto" },
  ];

  const handleReject = () => {
    if (alasan === "Lainnya" && !catatanTolak.trim())
      return setError("Jelaskan alasan penolakan pada kolom catatan.");
    onReject(alasan === "Lainnya" ? catatanTolak.trim() : alasan);
    onClose();
  };

  const Row = ({ k, v }: { k: string; v: ReactNode }) => (
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{k}</p>
      <p className="text-xs font-semibold text-pdam-navy mt-0.5">{v}</p>
    </div>
  );

  return (
    <Modal
      wide
      title={readOnly ? "Detail Verifikasi BAP" : "Periksa Berita Acara Penggantian"}
      subtitle={`${item.idTiket} • ${item.bapNo} • Dilaporkan ${item.tanggal}`}
      onClose={onClose}
      footer={
        readOnly ? (
          <button onClick={onClose} className={btnGhost}>
            Tutup
          </button>
        ) : mode === "reject" ? (
          <>
            <button onClick={() => setMode("review")} className={btnGhost}>
              Kembali
            </button>
            <button
              onClick={handleReject}
              className="btn btn-sm bg-pdam-red hover:bg-pdam-red/90 text-white border-0 normal-case font-semibold"
            >
              <XCircle className="w-4 h-4" /> Kembalikan ke Teknisi
            </button>
          </>
        ) : (
          <>
            <button onClick={onClose} className={btnGhost}>
              Tutup
            </button>
            <button
              onClick={() => setMode("reject")}
              className="btn btn-sm btn-outline border-pdam-red text-pdam-red hover:bg-pdam-red hover:text-white normal-case font-semibold"
            >
              Tolak / Revisi
            </button>
            <button
              onClick={() => {
                onApprove();
                onClose();
              }}
              disabled={!allChecked}
              className={btnPrimary}
              title={allChecked ? "" : "Lengkapi seluruh checklist pemeriksaan"}
            >
              <CheckCircle2 className="w-4 h-4" /> Setujui &amp; Terbitkan BAP
            </button>
          </>
        )
      }
    >
      {/* Ringkasan */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-sm font-bold text-pdam-navy">{item.pelanggan}</p>
          <p className="text-[10px] font-mono text-slate-400">{item.plgId}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{item.alamat}</p>
        </div>
        <span className={`badge badge-md font-bold border ${statusClass[item.status]}`}>
          • {item.status}
        </span>
      </div>

      {readOnly && (
        <div
          className={`rounded-lg border p-3 mb-5 text-xs flex items-start gap-2 ${
            item.status === "Ditolak"
              ? "border-pdam-red/30 bg-pdam-red/5 text-pdam-red"
              : "border-pdam-navy/20 bg-pdam-navy/5 text-pdam-navy"
          }`}
        >
          {item.status === "Ditolak" ? (
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          )}
          <span>
            <strong>{item.status === "Ditolak" ? "Dikembalikan ke teknisi:" : "Hasil:"}</strong>{" "}
            {item.statusDesc}
          </span>
        </div>
      )}

      {/* Foto bukti */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <PhotoPlaceholder label="Foto WM Lama" path="path_image_wm_lama" />
        <PhotoPlaceholder label="Foto WM Baru" path="path_image_wm_baru" />
      </div>

      {/* Perbandingan data */}
      <div className="rounded-lg border border-slate-200 overflow-hidden mb-5">
        <table className="table table-sm w-full text-xs">
          <thead>
            <tr className="bg-pdam-bg text-pdam-navy text-[10px] uppercase tracking-wider">
              <th className="py-2.5 pl-4"></th>
              <th className="py-2.5">WM Lama</th>
              <th className="py-2.5">WM Baru</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="py-2.5 pl-4 font-bold text-slate-500">Nomor Seri</td>
              <td className="py-2.5 font-mono">{item.snLama}</td>
              <td className="py-2.5 font-mono font-bold text-pdam-primary">{item.snBaru}</td>
            </tr>
            <tr>
              <td className="py-2.5 pl-4 font-bold text-slate-500">Stand</td>
              <td className="py-2.5 font-mono">{fmtStand(item.standLama)}</td>
              <td className={`py-2.5 font-mono font-bold ${standBermasalah ? "text-pdam-red" : "text-pdam-primary"}`}>
                {fmtStand(item.standBaru)}
              </td>
            </tr>
            <tr>
              <td className="py-2.5 pl-4 font-bold text-slate-500">Kondisi / Ukuran</td>
              <td className="py-2.5">{kondisiLabel[item.kondisi]}</td>
              <td className="py-2.5 font-mono">{item.dn}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <Row k="Teknisi" v={item.teknisi} />
        <Row k="Cabang" v={`Cabang ${item.cabang}`} />
        {item.catatan && (
          <div className="col-span-2">
            <Row k="Catatan Teknisi" v={item.catatan} />
          </div>
        )}
      </div>

      {standBermasalah && !readOnly && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 mb-5 text-xs text-amber-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          Stand awal WM baru tidak terbaca pada foto. Disarankan mengembalikan berkas ke teknisi.
        </div>
      )}

      {/* Checklist / form tolak */}
      {!readOnly && mode === "review" && (
        <div>
          <p className={labelCls}>Checklist Pemeriksaan</p>
          <div className="space-y-2">
            {checkItems.map((c) => (
              <label key={c.key} className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox checkbox-xs checkbox-primary"
                  checked={checks[c.key]}
                  onChange={(e) => setChecks({ ...checks, [c.key]: e.target.checked })}
                />
                {c.label}
              </label>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-3">
            Saat disetujui: status WM baru menjadi <strong>terpasang</strong>, WM lama diperbarui,{" "}
            <code>pelanggan.id_wm_aktif</code> disinkronkan, dan tiket berstatus <strong>selesai</strong>{" "}
            (satu transaksi database).
          </p>
        </div>
      )}

      {!readOnly && mode === "reject" && (
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Alasan Penolakan</label>
            <select className={selectCls} value={alasan} onChange={(e) => setAlasan(e.target.value)}>
              {alasanTolak.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Catatan untuk Teknisi {alasan !== "Lainnya" && "(opsional)"}</label>
            <textarea
              rows={3}
              value={catatanTolak}
              onChange={(e) => setCatatanTolak(e.target.value)}
              maxLength={200}
              placeholder="Jelaskan bagian yang perlu diperbaiki..."
              className="textarea textarea-bordered w-full text-xs border-slate-200 focus:border-pdam-primary"
            />
          </div>
          {error && (
            <p className="text-xs text-pdam-red font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {error}
            </p>
          )}
        </div>
      )}
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

type StatusFilter = "Semua" | Status;

export default function ValidasiPage() {
  const [data, setData] = useState<Bap[]>(initialData);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Semua");
  const [cabang, setCabang] = useState("Timur");
  const [search, setSearch] = useState("");
  const [adv, setAdv] = useState<AdvFilter>(emptyAdv);

  const [showExport, setShowExport] = useState(false);
  const [showAdv, setShowAdv] = useState(false);
  const [reviewId, setReviewId] = useState<string | null>(null);

  const reviewItem = data.find((d) => d.idTiket === reviewId) ?? null;
  const advCount = Object.values(adv).filter(Boolean).length;
  const teknisiList = Array.from(new Set(data.map((d) => d.teknisi)));

  const filtered = data.filter((b) => {
    const q = search.toLowerCase();
    return (
      (statusFilter === "Semua" || b.status === statusFilter) &&
      (!cabang || b.cabang === cabang) &&
      (!adv.teknisi || b.teknisi === adv.teknisi) &&
      (!adv.kondisi || b.kondisi === adv.kondisi) &&
      (!adv.dn || b.dn === adv.dn) &&
      (!q ||
        b.idTiket.toLowerCase().includes(q) ||
        b.pelanggan.toLowerCase().includes(q) ||
        b.plgId.toLowerCase().includes(q) ||
        b.snLama.toLowerCase().includes(q) ||
        b.snBaru.toLowerCase().includes(q) ||
        b.teknisi.toLowerCase().includes(q))
    );
  });

  const update = (id: string, patch: Partial<Bap>) =>
    setData((prev) => prev.map((b) => (b.idTiket === id ? { ...b, ...patch } : b)));

  const tabs: { label: string; value: StatusFilter; count: number }[] = [
    { label: "Semua", value: "Semua", count: 97 },
    { label: "Menunggu Verifikasi", value: "Menunggu", count: 28 },
    { label: "Disetujui", value: "Disetujui", count: 64 },
    { label: "Ditolak / Revisi", value: "Ditolak", count: 5 },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header Title */}
      <div>
        <p className="text-xs text-slate-500 mb-1">
          PDAM Tirta / Unit Penggantian /{" "}
          <span className="text-pdam-primary font-semibold">Verifikasi Hasil Lapangan</span>
        </p>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-pdam-navy">
              Verifikasi Hasil Lapangan
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Pemeriksaan dan validasi Berita Acara Penggantian (BAP), foto fisik, dan kesesuaian stand
              meter baru dari teknisi lapangan.
            </p>
          </div>

          <button
            onClick={() => setShowExport(true)}
            className="btn btn-sm btn-ghost bg-white hover:bg-pdam-bg border border-slate-200 text-pdam-navy font-semibold normal-case shadow-xs"
          >
            <Download className="w-4 h-4 text-pdam-primary" />
            <span>Export Rekap Verifikasi</span>
          </button>
        </div>
      </div>

      {/* 4 Kartu Status Berkas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-white border border-slate-200/90 shadow-xs p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-pdam-primary uppercase tracking-wider mb-1">
                Menunggu Verifikasi
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-pdam-primary tabular-nums">28</span>
                <span className="text-xs text-slate-500 font-medium">Berkas</span>
              </div>
              <span className="badge border border-pdam-primary/25 bg-pdam-primary/10 text-pdam-primary badge-xs font-semibold mt-2">
                • Perlu Tinjauan Segera
              </span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-pdam-primary/10 flex items-center justify-center text-pdam-primary border border-pdam-primary/20">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="card bg-white border border-slate-200/90 shadow-xs p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-pdam-navy uppercase tracking-wider mb-1">
                Disetujui Hari Ini
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-pdam-navy tabular-nums">64</span>
                <span className="text-xs text-pdam-navy font-medium">Berkas</span>
              </div>
              <span className="badge border border-pdam-navy/25 bg-pdam-navy/10 text-pdam-navy badge-xs font-semibold mt-2">
                ✓ BAP Diterbitkan &amp; Sinkron
              </span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-pdam-navy/10 flex items-center justify-center text-pdam-navy border border-pdam-navy/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="card bg-white border border-slate-200/90 shadow-xs p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-pdam-red uppercase tracking-wider mb-1">
                Ditolak / Revisi
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-pdam-red tabular-nums">5</span>
                <span className="text-xs text-pdam-red font-medium">Berkas</span>
              </div>
              <span className="badge border border-pdam-red/25 bg-pdam-red/10 text-pdam-red badge-xs font-semibold mt-2">
                ⚠️ Foto Buram / Deviasi Stand
              </span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-pdam-red/10 flex items-center justify-center text-pdam-red border border-pdam-red/20">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="card bg-white border border-slate-200/90 shadow-xs p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Total Berkas Masuk
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-pdam-navy tabular-nums">97</span>
                <span className="text-xs text-slate-500 font-medium">SPK</span>
              </div>
              <span className="text-[11px] text-pdam-primary font-bold mt-2 block">
                📈 Efisiensi Verifikasi 94.8%
              </span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-pdam-bg flex items-center justify-center text-pdam-navy border border-slate-200/80">
              <FileCheck className="w-5 h-5" />
            </div>
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
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <select
            value={cabang}
            onChange={(e) => setCabang(e.target.value)}
            className="select select-bordered select-sm w-full text-xs font-semibold border-slate-200 bg-white text-slate-700"
          >
            <option value="">Semua Cabang</option>
            <option value="Timur">Cabang Wilayah Timur</option>
            <option value="Barat">Cabang Wilayah Barat</option>
            <option value="Utara">Cabang Wilayah Utara</option>
            <option value="Selatan">Cabang Wilayah Selatan</option>
          </select>

          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari ID tiket, pelanggan, SN WM, teknisi..."
              className="input input-bordered input-sm w-full pl-9 text-xs bg-pdam-bg/50 border-slate-200 focus:border-pdam-primary focus:bg-white"
            />
          </div>

          <button
            onClick={() => setShowAdv(true)}
            className="btn btn-sm btn-ghost bg-white hover:bg-pdam-bg border border-slate-200 btn-block font-semibold normal-case text-xs text-slate-700"
          >
            <Filter className="w-3.5 h-3.5 text-pdam-navy" />
            <span>Filter Lanjutan</span>
            {advCount > 0 && (
              <span className="badge badge-xs bg-pdam-primary text-white border-0 font-bold">
                {advCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tabel Verifikasi */}
      <div className="card bg-white border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-sm w-full">
            <thead>
              <tr className="bg-pdam-bg text-pdam-navy text-[11px] uppercase tracking-wider border-b border-slate-200 font-bold">
                <th className="py-3.5 pl-5">ID TIKET &amp; TANGGAL</th>
                <th className="py-3.5">PELANGGAN &amp; ALAMAT</th>
                <th className="py-3.5">TEKNISI</th>
                <th className="py-3.5">METER LAMA → BARU</th>
                <th className="py-3.5">STATUS</th>
                <th className="py-3.5 text-right pr-5">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((item) => (
                <tr key={item.idTiket} className="hover:bg-pdam-bg/60 transition-colors">
                  <td className="py-3.5 pl-5 font-bold">
                    <span className="text-pdam-primary font-mono block">{item.idTiket}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {item.tanggal} • <strong className="text-pdam-navy">{item.bapNo}</strong>
                    </span>
                  </td>

                  <td className="py-3.5">
                    <span className="font-bold text-pdam-navy block">
                      {item.pelanggan}{" "}
                      <span className="font-normal text-[10px] text-slate-400">({item.plgId})</span>
                    </span>
                    <span className="text-[10px] text-slate-500">{item.alamat}</span>
                  </td>

                  <td className="py-3.5">
                    <span className="font-medium text-slate-700">{item.teknisi}</span>
                  </td>

                  <td className="py-3.5">
                    <div className="flex flex-col text-[11px]">
                      <span className="text-slate-500 font-mono">
                        {item.snLama} ({fmtStand(item.standLama)})
                      </span>
                      <div className="flex items-center gap-1 font-bold font-mono">
                        <ArrowRight className="w-3 h-3 text-pdam-primary shrink-0" />
                        <span className={item.standBaru === null ? "text-pdam-red" : "text-pdam-primary"}>
                          {item.snBaru} ({fmtStand(item.standBaru)} • {item.dn})
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5">
                    <span className={`badge badge-sm font-bold border ${statusClass[item.status]}`}>
                      • {item.status}
                    </span>
                  </td>

                  <td className="py-3.5 text-right pr-5">
                    {item.status === "Menunggu" ? (
                      <button
                        onClick={() => setReviewId(item.idTiket)}
                        className="btn btn-xs btn-outline border-pdam-primary text-pdam-primary hover:bg-pdam-primary hover:text-white font-semibold normal-case gap-0.5 ml-auto"
                      >
                        Periksa <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setReviewId(item.idTiket)}
                        className="text-pdam-primary hover:text-pdam-navy font-semibold hover:underline inline-flex items-center gap-0.5"
                      >
                        Lihat <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">
                    Tidak ada berkas yang sesuai filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Menampilkan 1 - {filtered.length} dari 97</span>
            <span>• Baris:</span>
            <select className="select select-bordered select-xs w-16 border-slate-200 bg-white">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
          </div>

          <div className="join">
            <button className="join-item btn btn-sm btn-ghost btn-disabled">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="join-item btn btn-sm bg-pdam-primary text-white font-bold border-0">1</button>
            <button className="join-item btn btn-sm btn-ghost hover:bg-pdam-bg">2</button>
            <button className="join-item btn btn-sm btn-ghost hover:bg-pdam-bg">3</button>
            <button className="join-item btn btn-sm btn-ghost hover:bg-pdam-bg">..</button>
            <button className="join-item btn btn-sm btn-ghost hover:bg-pdam-bg">17</button>
            <button className="join-item btn btn-sm btn-ghost hover:bg-pdam-bg">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Legenda Keterangan Status */}
      <div className="pt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center text-[11px] text-slate-500 border-t border-slate-200 gap-2">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-bold uppercase tracking-wider text-pdam-navy">KETERANGAN STATUS:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-pdam-primary inline-block"></span> Menunggu Validasi Admin
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-pdam-navy inline-block"></span> Selesai &amp; BAP Telah Diterbitkan
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-pdam-red inline-block"></span> Dikembalikan ke Teknisi Lapangan
          </span>
        </div>
        <div className="font-mono text-[10px] text-slate-400">PDAM Tirta Audit Engine v2.4</div>
      </div>

      {/* Modals (dirender sekali di luar tabel) */}
      {showExport && (
        <ExportModal onClose={() => setShowExport(false)} allData={data} filteredData={filtered} />
      )}
      {showAdv && (
        <AdvancedFilterModal
          value={adv}
          teknisiList={teknisiList}
          onClose={() => setShowAdv(false)}
          onApply={setAdv}
        />
      )}
      {reviewItem && (
        <ReviewModal
          key={reviewItem.idTiket}
          item={reviewItem}
          onClose={() => setReviewId(null)}
          onApprove={() =>
            update(reviewItem.idTiket, { status: "Disetujui", statusDesc: "BAP Diterbitkan & Sinkron" })
          }
          onReject={(alasan) => update(reviewItem.idTiket, { status: "Ditolak", statusDesc: alasan })}
        />
      )}
    </div>
  );
}
