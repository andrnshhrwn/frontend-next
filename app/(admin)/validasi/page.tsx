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
  ShieldCheck,
  Check,
} from "lucide-react";
import { useState, type ReactNode } from "react";

/* ------------------------------------------------------------------ */
/* Types & Data                                                        */
/* ------------------------------------------------------------------ */

type Status = "Menunggu" | "Disetujui" | "Ditolak";
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
  standBaru: number | null;
  dn: string;
  catatan?: string;
  status: Status;
  statusDesc: string;
}

const initialData: Bap[] = [
  { idTiket: "TICK-KNG-2026-101", tanggal: "Hari ini, 10:45", bapNo: "BAP-KNG #24", pelanggan: "Bambang Sugianto", plgId: "PLG-KNG-089211", alamat: "Jl. Siliwangi No. 120", cabang: "Unit Kuningan", teknisi: "Dede Suryana", snLama: "WM-19-004812", standLama: 1482, kondisi: "macet", snBaru: "WM-26-001201", standBaru: 0, dn: "DN15 (1/2\")", catatan: "Meteran lama tidak berputar, segel utuh.", status: "Menunggu", statusDesc: "Perlu Validasi & Approval Admin Pusat" },
  { idTiket: "TICK-CLM-2026-099", tanggal: "Hari ini, 09:15", bapNo: "BAP-CLM #23", pelanggan: "Siti Rahmawati Putri", plgId: "PLG-CLM-055102", alamat: "Jl. Raya Bandorasa No. 12", cabang: "Unit Cilimus", teknisi: "Asep Saepudin", snLama: "WM-18-002194", standLama: 3819, kondisi: "kaca_pecah", snBaru: "WM-26-001202", standBaru: 0, dn: "DN15 (1/2\")", status: "Disetujui", statusDesc: "Validasi Pusat Disetujui & WM Aktif Terbarui" },
  { idTiket: "TICK-CGG-2026-094", tanggal: "Hari ini, 08:30", bapNo: "BAP-CGG #22", pelanggan: "H. Ridwan Mansyur", plgId: "PLG-CGG-002104", alamat: "Jl. Sukamulya No. 18", cabang: "Unit Cigugur", teknisi: "Nana Sutrisna", snLama: "WM-17-009941", standLama: 5201, kondisi: "berembun_parah", snBaru: "WM-26-001205", standBaru: null, dn: "DN15 (1/2\")", status: "Ditolak", statusDesc: "Foto Buram / Angka Stand Tidak Terbaca" },
  { idTiket: "TICK-CAW-2026-088", tanggal: "Kemarin, 16:20", bapNo: "BAP-CAW #21", pelanggan: "CV. Agro Ciawi Mandiri", plgId: "PLG-CAW-091480", alamat: "Kawasan Industri Ciawi Kav. 8", cabang: "Unit Ciawi", teknisi: "Dadang Suhendar", snLama: "WM-16-000843", standLama: 12430, kondisi: "bodi_korosi", snBaru: "WM-26-001203", standBaru: 0, dn: "DN25 (1\")", status: "Menunggu", statusDesc: "Perlu Validasi & Approval Admin Pusat" },
  { idTiket: "TICK-LRG-2026-085", tanggal: "Kemarin, 14:10", bapNo: "BAP-LRG #20", pelanggan: "Puskesmas DTP Luragung", plgId: "PLG-LRG-014802", alamat: "Jl. Raya Luragung No. 65", cabang: "Unit Luragung", teknisi: "Yudi Herdiana", snLama: "WM-19-001099", standLama: 2118, kondisi: "normal", snBaru: "WM-26-001206", standBaru: 0, dn: "DN15 (1/2\")", status: "Disetujui", statusDesc: "Validasi Pusat Disetujui & WM Aktif Terbarui" },
];

const statusClass: Record<Status, string> = {
  Menunggu: "border-pdam-primary/30 bg-pdam-primary/10 text-pdam-primary",
  Disetujui: "border-emerald-500/30 bg-emerald-50 text-emerald-700",
  Ditolak: "border-pdam-red/30 bg-pdam-red/10 text-pdam-red",
};

const alasanTolak = [
  "Foto stand meter buram / tidak terbaca",
  "Deviasi atau selisih stand meter tidak wajar",
  "Nomor seri meteran fisik tidak sesuai dengan BAP",
  "Foto dokumentasi lokasi / rumah pelanggan tidak lengkap",
  "Lainnya",
];

const fmtStand = (n: number | null) => (n === null ? "Tidak Terbaca" : `${n.toLocaleString("id-ID")} m³`);

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
/* Modal Shell                                                         */
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
      <div className={`modal-box bg-white p-0 ${wide ? "max-w-3xl" : "max-w-md"} max-h-[92vh] flex flex-col`}>
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-slate-200 shrink-0">
          <div>
            <h3 className="font-extrabold text-pdam-navy flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-pdam-primary" /> {title}
            </h3>
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
/* Modal: Review & Checklist Validasi BAP                              */
/* ------------------------------------------------------------------ */

function PhotoPlaceholder({ label, path }: { label: string; path: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <div className="aspect-4/3 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center gap-1 text-slate-400">
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
    { key: "foto", label: "Foto bukti fisik WM lama, WM baru, dan lokasi pelanggan terverifikasi jelas" },
    { key: "sn", label: "Nomor seri WM baru terdaftar dalam alokasi stok pengiriman unit cabang" },
    { key: "stand", label: "Angka stand meter lama & stand awal WM baru (0 m³) sesuai dokumentasi foto" },
    { key: "kondisi", label: "Kondisi fisik WM lama sesuai dengan deskripsi laporan teknisi" },
  ];

  const handleReject = () => {
    if (alasan === "Lainnya" && !catatanTolak.trim())
      return setError("Mohon isi catatan penolakan secara spesifik.");
    onReject(alasan === "Lainnya" ? catatanTolak.trim() : alasan);
    onClose();
  };

  return (
    <Modal
      wide
      title={readOnly ? "Detail Validasi BAP Lapangan" : "Validasi & Approval Final BAP (Pusat)"}
      subtitle={`${item.idTiket} • ${item.bapNo} • Diajukan dari ${item.cabang}`}
      onClose={onClose}
      footer={
        readOnly ? (
          <button onClick={onClose} className={btnGhost}>Tutup</button>
        ) : mode === "reject" ? (
          <>
            <button onClick={() => setMode("review")} className={btnGhost}>Kembali</button>
            <button
              onClick={handleReject}
              className="btn btn-sm bg-pdam-red hover:bg-pdam-red/90 text-white border-0 normal-case font-semibold"
            >
              <XCircle className="w-4 h-4" /> Kembalikan / Tolak BAP
            </button>
          </>
        ) : (
          <>
            <button onClick={onClose} className={btnGhost}>Batal</button>
            <button
              onClick={() => setMode("reject")}
              className="btn btn-sm btn-outline border-pdam-red text-pdam-red hover:bg-pdam-red hover:text-white normal-case font-semibold"
            >
              Tolak / Minta Revisi
            </button>
            <button
              onClick={() => {
                onApprove();
                onClose();
              }}
              disabled={!allChecked}
              className={btnPrimary}
            >
              <CheckCircle2 className="w-4 h-4" /> Disetujui &amp; Update Otomatis
            </button>
          </>
        )
      }
    >
      {/* Detail Ringkasan Laporan */}
      <div className="flex items-start justify-between mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
        <div>
          <p className="text-sm font-bold text-pdam-navy">{item.pelanggan}</p>
          <p className="text-[11px] font-mono text-slate-500">{item.plgId} • {item.alamat}</p>
          <p className="text-[11px] text-slate-500 mt-1">
            Teknisi: <strong>{item.teknisi}</strong> ({item.cabang})
          </p>
        </div>
        <span className={`badge badge-md font-bold border ${statusClass[item.status]}`}>
          • {item.status}
        </span>
      </div>

      {readOnly && (
        <div className={`rounded-lg border p-3 mb-4 text-xs flex items-start gap-2 ${
          item.status === "Ditolak"
            ? "border-pdam-red/30 bg-pdam-red/5 text-pdam-red"
            : "border-emerald-500/30 bg-emerald-50 text-emerald-800"
        }`}>
          {item.status === "Ditolak" ? <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />}
          <span>
            <strong>Status Akhir Validasi:</strong> {item.statusDesc}
          </span>
        </div>
      )}

      {/* Foto Bukti Fisik */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <PhotoPlaceholder label="Dokumentasi WM Lama (Ditarik)" path="foto_wm_lama.jpg" />
        <PhotoPlaceholder label="Dokumentasi WM Baru (Terpasang)" path="foto_wm_baru.jpg" />
      </div>

      {/* Tabel Data Perbandingan WM */}
      <div className="rounded-lg border border-slate-200 overflow-hidden mb-4">
        <table className="table table-sm w-full text-xs">
          <thead>
            <tr className="bg-slate-100 text-pdam-navy text-[10px] uppercase tracking-wider font-bold">
              <th className="py-2.5 pl-4">Parameter Physical Meter</th>
              <th className="py-2.5">Meteran Lama</th>
              <th className="py-2.5">Meteran Baru (Pengganti)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="py-2.5 pl-4 font-bold text-slate-500">Nomor Seri (SN)</td>
              <td className="py-2.5 font-mono text-slate-600">{item.snLama}</td>
              <td className="py-2.5 font-mono font-bold text-pdam-primary">{item.snBaru}</td>
            </tr>
            <tr>
              <td className="py-2.5 pl-4 font-bold text-slate-500">Stand Angka Meter</td>
              <td className="py-2.5 font-mono">{fmtStand(item.standLama)}</td>
              <td className={`py-2.5 font-mono font-bold ${standBermasalah ? "text-pdam-red" : "text-pdam-primary"}`}>
                {fmtStand(item.standBaru)}
              </td>
            </tr>
            <tr>
              <td className="py-2.5 pl-4 font-bold text-slate-500">Kondisi Physical / Ukuran</td>
              <td className="py-2.5">{kondisiLabel[item.kondisi]}</td>
              <td className="py-2.5 font-mono">{item.dn}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {standBermasalah && !readOnly && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 mb-4 text-xs text-amber-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span><strong>Peringatan:</strong> Angka stand meter baru tidak terbaca jelas pada foto. Pertimbangkan untuk menolak atau meminta perbaikan foto BAP.</span>
        </div>
      )}

      {/* Checklist Validasi Pusat */}
      {!readOnly && mode === "review" && (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <p className="text-xs font-bold text-pdam-navy uppercase mb-2">Checklist Approval Admin Pusat</p>
          <div className="space-y-2">
            {checkItems.map((c) => (
              <label key={c.key} className="flex items-start gap-2 text-xs cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="checkbox checkbox-xs checkbox-primary mt-0.5"
                  checked={checks[c.key]}
                  onChange={(e) => setChecks({ ...checks, [c.key]: e.target.checked })}
                />
                <span className="text-slate-700">{c.label}</span>
              </label>
            ))}
          </div>

          <p className="text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-200 italic">
            * Menyetujui BAP ini akan secara otomatis memperbarui database: status WM Baru menjadi <strong>Terpasang</strong>, WM Lama menjadi <strong>Tarik/Rusak</strong>, serta memperbarui <strong>WM Aktif Pelanggan</strong>.
          </p>
        </div>
      )}

      {!readOnly && mode === "reject" && (
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Alasan Penolakan Validasi</label>
            <select className={selectCls} value={alasan} onChange={(e) => setAlasan(e.target.value)}>
              {alasanTolak.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Catatan Instruksi Perbaikan untuk Teknisi</label>
            <textarea
              rows={3}
              value={catatanTolak}
              onChange={(e) => setCatatanTolak(e.target.value)}
              placeholder="Berikan catatan detail terkait bagian yang perlu diperbaiki oleh teknisi..."
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
/* Main Page Component                                                 */
/* ------------------------------------------------------------------ */

export default function ValidasiPage() {
  const [data, setData] = useState<Bap[]>(initialData);
  const [statusFilter, setStatusFilter] = useState<string>("Semua");
  const [cabangFilter, setCabangFilter] = useState<string>("Semua");
  const [search, setSearch] = useState("");
  const [reviewId, setReviewId] = useState<string | null>(null);

  const reviewItem = data.find((d) => d.idTiket === reviewId) ?? null;

  const filtered = data.filter((b) => {
    const q = search.toLowerCase();
    const matchStatus = statusFilter === "Semua" || b.status === statusFilter;
    const matchCabang = cabangFilter === "Semua" || b.cabang === cabangFilter;
    const matchSearch =
      !q ||
      b.idTiket.toLowerCase().includes(q) ||
      b.pelanggan.toLowerCase().includes(q) ||
      b.plgId.toLowerCase().includes(q) ||
      b.snLama.toLowerCase().includes(q) ||
      b.snBaru.toLowerCase().includes(q) ||
      b.teknisi.toLowerCase().includes(q);

    return matchStatus && matchCabang && matchSearch;
  });

  const handleApprove = (id: string) => {
    setData((prev) =>
      prev.map((b) =>
        b.idTiket === id
          ? {
              ...b,
              status: "Disetujui",
              statusDesc: "Disetujui oleh Pusat. Data WM Aktif pelanggan otomatis terbarui.",
            }
          : b
      )
    );
  };

  const handleReject = (id: string, alasanDesc: string) => {
    setData((prev) =>
      prev.map((b) =>
        b.idTiket === id
          ? {
              ...b,
              status: "Ditolak",
              statusDesc: `Dikembalikan ke teknisi: ${alasanDesc}`,
            }
          : b
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs text-slate-500 mb-1">
          <span className="font-semibold text-pdam-primary">PAM Tirta Kamuning</span> / Validasi / <span className="text-pdam-primary font-semibold">Validasi BAP Penggantian</span>
        </p>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-pdam-navy">Validasi BAP &amp; Approval Final</h1>
              <span className="badge bg-pdam-primary/10 text-pdam-primary border-pdam-primary/20 text-[10px] font-bold">
                Wewenang Admin Pusat
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pemeriksaan bukti foto BAP dari teknisi dan approval persetujuan penggantian WM terpusat.
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="card bg-white border border-slate-200/90 shadow-xs p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-slate-200">
          {["Semua", "Menunggu", "Disetujui", "Ditolak"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`btn btn-sm font-medium normal-case ${
                statusFilter === st
                  ? "bg-pdam-primary text-white border-0 shadow-xs"
                  : "btn-ghost bg-pdam-bg hover:bg-slate-200 border border-slate-200/80 text-slate-700"
              }`}
            >
              {st === "Semua" ? "Semua Status" : st}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari ID tiket, nama pelanggan, teknisi, atau nomor seri WM..."
            className="input input-bordered input-sm w-full pl-9 text-xs bg-pdam-bg/50 border-slate-200 focus:border-pdam-primary focus:bg-white"
          />
        </div>
      </div>

      {/* Tabel BAP */}
      <div className="card bg-white border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-sm w-full">
            <thead>
              <tr className="bg-pdam-bg text-pdam-navy text-[11px] uppercase tracking-wider border-b border-slate-200 font-bold">
                <th className="py-3.5 pl-5">ID TIKET &amp; TANGGAL</th>
                <th className="py-3.5">PELANGGAN &amp; UNIT CABANG</th>
                <th className="py-3.5">TEKNISI</th>
                <th className="py-3.5">METER LAMA → BARU</th>
                <th className="py-3.5">STATUS VALIDASI</th>
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
                    <span className="font-bold text-pdam-navy block">{item.pelanggan}</span>
                    <span className="text-[10px] text-slate-500">{item.cabang} • {item.plgId}</span>
                  </td>

                  <td className="py-3.5 font-medium text-slate-700">{item.teknisi}</td>

                  <td className="py-3.5">
                    <div className="flex flex-col text-[11px]">
                      <span className="text-slate-500 font-mono">{item.snLama} ({fmtStand(item.standLama)})</span>
                      <div className="flex items-center gap-1 font-bold font-mono">
                        <ArrowRight className="w-3 h-3 text-pdam-primary shrink-0" />
                        <span className={item.standBaru === null ? "text-pdam-red" : "text-pdam-primary"}>
                          {item.snBaru} ({fmtStand(item.standBaru)})
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
                    <button
                      onClick={() => setReviewId(item.idTiket)}
                      className={`btn btn-xs normal-case gap-1 ${
                        item.status === "Menunggu"
                          ? "bg-pdam-primary hover:bg-pdam-navy text-white border-0"
                          : "btn-ghost text-pdam-primary hover:underline"
                      }`}
                    >
                      {item.status === "Menunggu" ? "Periksa & Validasi" : "Detail BAP"}
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {reviewItem && (
        <ReviewModal
          key={reviewItem.idTiket}
          item={reviewItem}
          onClose={() => setReviewId(null)}
          onApprove={() => handleApprove(reviewItem.idTiket)}
          onReject={(alasan) => handleReject(reviewItem.idTiket, alasan)}
        />
      )}
    </div>
  );
}