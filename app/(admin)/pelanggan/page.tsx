"use client";

import {
  Download,
  UserPlus,
  Search,
  Info,
  Filter,
  Plus,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  X,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Check,
  MapPin,
  Gauge,
} from "lucide-react";
import { useState, type ReactNode } from "react";

/* ------------------------------------------------------------------ */
/* Types & data                                                        */
/* ------------------------------------------------------------------ */

type WmStatus = "Aktif" | "Perlu Ganti" | "Belum Ada WM";

interface Pelanggan {
  id: string;
  nama: string;
  alamat: string;
  cabang: string;
  tipeTarif: string;
  wmNoSeri: string | null;
  wmStatus: WmStatus;
}

const initialCustomers: Pelanggan[] = [
  { id: "PLG-089211", nama: "Bambang Sugianto", alamat: "Jl. Danau Toba No. 42 Blok D", cabang: "Cabang Timur", tipeTarif: "Gol. 2A - Rumah Tangga", wmNoSeri: "WM-22-048910", wmStatus: "Aktif" },
  { id: "PLG-002104", nama: "H. Ridwan Mansyur", alamat: "Jl. Kawi No. 18 RT 02/RW 04", cabang: "Cabang Tirta Utama", tipeTarif: "Gol. 2B - Rumah Tangga Mampu", wmNoSeri: null, wmStatus: "Belum Ada WM" },
  { id: "PLG-055102", nama: "Siti Rahmawati Putri", alamat: "Jl. Simpang Borobudur Gang 4 No. 12", cabang: "Cabang Utara", tipeTarif: "Gol. 2A - Rumah Tangga", wmNoSeri: "WM-18-091420", wmStatus: "Perlu Ganti" },
  { id: "PLG-091480", nama: "CV. Sumber Makmur Abadi", alamat: "Jl. Soekarno Hatta Ruko Kav. 8", cabang: "Cabang Barat", tipeTarif: "Gol. 3A - Niaga Kecil", wmNoSeri: "WM-21-087221", wmStatus: "Aktif" },
  { id: "PLG-014802", nama: "Dra. Endang Purwanti", alamat: "Jl. Ijen No. 74", cabang: "Cabang Tirta Utama", tipeTarif: "Gol. 2B - Rumah Tangga Mampu", wmNoSeri: null, wmStatus: "Belum Ada WM" },
  { id: "PLG-003892", nama: "Masjid Al-Ikhlas", alamat: "Jl. Mayjen Sungkono No. 5", cabang: "Cabang Timur", tipeTarif: "Gol. 1B - Sosial Khusus", wmNoSeri: null, wmStatus: "Belum Ada WM" },
  { id: "PLG-078199", nama: "PT. Indo Pangan Lestari", alamat: "Kawasan Industri Candi Blok A-12", cabang: "Cabang Selatan", tipeTarif: "Gol. Industri Khusus", wmNoSeri: "WM-23-010492", wmStatus: "Aktif" },
];

const cabangOptions = ["Cabang Tirta Utama", "Cabang Timur", "Cabang Barat", "Cabang Utara", "Cabang Selatan"];
const tarifOptions = [
  "Gol. 1B - Sosial Khusus",
  "Gol. 2A - Rumah Tangga",
  "Gol. 2B - Rumah Tangga Mampu",
  "Gol. 3A - Niaga Kecil",
  "Gol. Industri Khusus",
];
const merkOptions = ["Itron", "Sensus", "Zenner", "Amico", "Bestar"]; // dari tabel merk_wm

interface StokWM {
  sn: string;
  merk: string;
  cabang: string;
}
// Stok berstatus tersedia_di_unit (water_meter)
const initialStock: StokWM[] = [
  { sn: "WM-24-009182", merk: "Itron", cabang: "Cabang Timur" },
  { sn: "WM-24-009183", merk: "Sensus", cabang: "Cabang Timur" },
  { sn: "WM-24-009190", merk: "Zenner", cabang: "Cabang Tirta Utama" },
  { sn: "WM-24-009191", merk: "Itron", cabang: "Cabang Tirta Utama" },
  { sn: "WM-24-009198", merk: "Amico", cabang: "Cabang Barat" },
];

const wmBadge: Record<WmStatus, string> = {
  Aktif: "border-pdam-primary/30 bg-pdam-primary/10 text-pdam-primary",
  "Perlu Ganti": "border-amber-500/30 bg-amber-500/10 text-amber-700",
  "Belum Ada WM": "border-pdam-red/30 bg-pdam-red/10 text-pdam-red",
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
      <div className={`modal-box bg-white p-0 ${wide ? "max-w-2xl" : "max-w-md"} max-h-[92vh] flex flex-col`}>
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
const inputCls = "input input-bordered input-sm w-full text-xs border-slate-200 focus:border-pdam-primary";
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
  allData: Pelanggan[];
  filteredData: Pelanggan[];
}) {
  const [format, setFormat] = useState<"csv" | "xlsx">("csv");
  const [scope, setScope] = useState<"filter" | "all">("filter");
  const rows = scope === "filter" ? filteredData : allData;

  const header = ["ID Pelanggan", "Nama", "Alamat", "Cabang", "Tipe Tarif", "SN WM Aktif", "Status WM"];
  const toRow = (c: Pelanggan) => [c.id, c.nama, c.alamat, c.cabang, c.tipeTarif, c.wmNoSeri ?? "-", c.wmStatus];

  const handleExport = () => {
    const stamp = new Date().toISOString().slice(0, 10);
    if (format === "csv") {
      const csv = [header.map(csvCell).join(",")]
        .concat(rows.map((r) => toRow(r).map(csvCell).join(",")))
        .join("\n");
      downloadFile(`data-pelanggan-${stamp}.csv`, csv, "text/csv;charset=utf-8");
    } else {
      // TODO: ganti dengan SheetJS (xlsx) untuk file .xlsx asli.
      const tsv = [header.join("\t")].concat(rows.map((r) => toRow(r).join("\t"))).join("\n");
      downloadFile(`data-pelanggan-${stamp}.xls`, tsv, "application/vnd.ms-excel");
    }
    onClose();
  };

  return (
    <Modal
      title="Export Data Pelanggan"
      subtitle="Unduh data pelanggan beserta status water meter aktif."
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className={btnGhost}>Batal</button>
          <button onClick={handleExport} disabled={rows.length === 0} className={btnPrimary}>
            <Download className="w-4 h-4" /> Unduh {rows.length} Pelanggan
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
              <input type="radio" className="radio radio-xs radio-primary" checked={scope === "filter"} onChange={() => setScope("filter")} />
              Sesuai filter aktif ({filteredData.length} pelanggan)
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" className="radio radio-xs radio-primary" checked={scope === "all"} onChange={() => setScope("all")} />
              Semua yang dimuat ({allData.length} pelanggan)
            </label>
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Modal: Tambah / Edit Pelanggan                                      */
/* ------------------------------------------------------------------ */

function CustomerFormModal({
  editing,
  onClose,
  onSave,
}: {
  editing: Pelanggan | null;
  onClose: () => void;
  onSave: (data: { nama: string; alamat: string; cabang: string; tipeTarif: string }) => void;
}) {
  const isEdit = !!editing;
  const [form, setForm] = useState({
    nama: editing?.nama ?? "",
    alamat: editing?.alamat ?? "",
    cabang: editing?.cabang ?? cabangOptions[0],
    tipeTarif: editing?.tipeTarif ?? tarifOptions[1],
  });
  const [error, setError] = useState("");
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.nama.trim()) return setError("Nama pelanggan wajib diisi.");
    if (form.nama.length > 100) return setError("Nama maksimal 100 karakter.");
    if (!form.alamat.trim()) return setError("Alamat wajib diisi.");
    if (form.alamat.length > 255) return setError("Alamat maksimal 255 karakter.");
    onSave({ ...form, nama: form.nama.trim(), alamat: form.alamat.trim() });
    onClose();
  };

  return (
    <Modal
      wide
      title={isEdit ? "Edit Data Pelanggan" : "Tambah Pelanggan Baru"}
      subtitle={
        isEdit
          ? `${editing!.id} • Water meter diubah lewat menu Input WM / Penggantian.`
          : "Pelanggan baru akan berstatus Belum Ada WM sampai nomor seri diinput."
      }
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className={btnGhost}>Batal</button>
          <button onClick={handleSubmit} className={btnPrimary}>
            {isEdit ? <Check className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            {isEdit ? "Simpan Perubahan" : "Tambah Pelanggan"}
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className={labelCls}>Nama Pelanggan</label>
          <input className={inputCls} maxLength={100} value={form.nama} onChange={(e) => set("nama", e.target.value)} placeholder="contoh: Bambang Sugianto" />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Alamat</label>
          <input className={inputCls} maxLength={255} value={form.alamat} onChange={(e) => set("alamat", e.target.value)} placeholder="contoh: Jl. Danau Toba No. 42 Blok D" />
        </div>
        <div>
          <label className={labelCls}>Unit Cabang</label>
          <select className={selectCls} value={form.cabang} onChange={(e) => set("cabang", e.target.value)}>
            {cabangOptions.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Golongan Tarif</label>
          <select className={selectCls} value={form.tipeTarif} onChange={(e) => set("tipeTarif", e.target.value)}>
            {tarifOptions.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        {error && (
          <p className="sm:col-span-2 text-xs text-pdam-red font-medium flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> {error}
          </p>
        )}
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Modal: Input WM Aktif (pelanggan legacy)                            */
/* ------------------------------------------------------------------ */

function InputWmModal({
  customer,
  stock,
  usedSN,
  onClose,
  onSave,
}: {
  customer: Pelanggan;
  stock: StokWM[];
  usedSN: Set<string>;
  onClose: () => void;
  onSave: (sn: string, fromStock: boolean) => void;
}) {
  const unitStock = stock.filter((s) => s.cabang === customer.cabang);
  const [mode, setMode] = useState<"stok" | "manual">(unitStock.length > 0 ? "stok" : "manual");
  const [chosen, setChosen] = useState("");
  const [manualSN, setManualSN] = useState("");
  const [merk, setMerk] = useState(merkOptions[0]);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (mode === "stok") {
      if (!chosen) return setError("Pilih salah satu nomor seri dari stok unit.");
      onSave(chosen, true);
    } else {
      const sn = manualSN.trim().toUpperCase();
      if (!sn) return setError("Nomor seri wajib diisi.");
      if (sn.length > 50) return setError("Nomor seri maksimal 50 karakter.");
      if (usedSN.has(sn)) return setError("Nomor seri sudah terdaftar di database.");
      onSave(sn, false);
    }
    onClose();
  };

  return (
    <Modal
      wide
      title="Input WM Aktif"
      subtitle={`${customer.nama} • ${customer.id} • ${customer.cabang}`}
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className={btnGhost}>Batal</button>
          <button onClick={handleSubmit} className={btnPrimary}>
            <Gauge className="w-4 h-4" /> Simpan WM Aktif
          </button>
        </>
      }
    >
      <div className="inline-flex p-1 rounded-lg bg-pdam-bg border border-slate-200 mb-5">
        {(["stok", "manual"] as const).map((t) => (
          <button
            key={t}
            onClick={() => {
              setMode(t);
              setError("");
            }}
            className={`btn btn-xs normal-case font-semibold border-0 ${
              mode === t ? "bg-white text-pdam-primary shadow-xs" : "bg-transparent text-slate-500"
            }`}
          >
            {t === "stok" ? "Pilih dari Stok Unit" : "Input Manual (Verifikasi Fisik)"}
          </button>
        ))}
      </div>

      {mode === "stok" ? (
        unitStock.length > 0 ? (
          <ul className="space-y-2">
            {unitStock.map((s) => (
              <li key={s.sn}>
                <label
                  className={`flex items-center justify-between rounded-lg border p-3 cursor-pointer transition-colors ${
                    chosen === s.sn ? "border-pdam-primary bg-pdam-primary/5" : "border-slate-200 hover:bg-pdam-bg"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <input type="radio" className="radio radio-xs radio-primary" checked={chosen === s.sn} onChange={() => setChosen(s.sn)} />
                    <span className="font-mono text-xs font-bold text-pdam-primary">{s.sn}</span>
                  </span>
                  <span className="text-[11px] text-slate-500">{s.merk} • Tersedia di unit</span>
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-slate-500 rounded-lg border border-slate-200 bg-pdam-bg p-4 text-center">
            Tidak ada stok WM tersedia di {customer.cabang}. Gunakan input manual.
          </p>
        )
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Nomor Seri (SN)</label>
            <input className={`${inputCls} font-mono`} value={manualSN} onChange={(e) => setManualSN(e.target.value)} placeholder="contoh: WM-19-004812" />
          </div>
          <div>
            <label className={labelCls}>Merk</label>
            <select className={selectCls} value={merk} onChange={(e) => setMerk(e.target.value)}>
              {merkOptions.map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
          <p className="sm:col-span-2 text-[11px] text-slate-400">
            Gunakan untuk mendokumentasikan meteran yang sudah terpasang di lapangan (hasil verifikasi fisik).
          </p>
        </div>
      )}

      {error && (
        <p className="mt-4 text-xs text-pdam-red font-medium flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" /> {error}
        </p>
      )}
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Modal: Detail Pelanggan                                             */
/* ------------------------------------------------------------------ */

function DetailModal({
  customer,
  onClose,
  onEdit,
  onInputWm,
}: {
  customer: Pelanggan;
  onClose: () => void;
  onEdit: () => void;
  onInputWm: () => void;
}) {
  const Row = ({ k, v }: { k: string; v: ReactNode }) => (
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{k}</p>
      <p className="text-xs font-semibold text-pdam-navy mt-0.5">{v}</p>
    </div>
  );

  return (
    <Modal
      wide
      title="Detail Pelanggan"
      subtitle="Data pelanggan dan status water meter aktif."
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className={btnGhost}>Tutup</button>
          <button onClick={onEdit} className={btnGhost}>Edit Data</button>
          {!customer.wmNoSeri && (
            <button onClick={onInputWm} className={btnPrimary}>
              <Plus className="w-4 h-4" /> Input WM
            </button>
          )}
        </>
      }
    >
      <div className="mb-5">
        <p className="text-base font-bold text-pdam-navy">{customer.nama}</p>
        <p className="text-[11px] font-mono text-slate-400">{customer.id}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 pb-5 border-b border-slate-200">
        <div className="col-span-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Alamat
          </p>
          <p className="text-xs font-semibold text-pdam-navy">{customer.alamat}</p>
        </div>
        <Row k="Unit Cabang" v={customer.cabang} />
        <Row k="Golongan Tarif" v={customer.tipeTarif} />
      </div>

      <div className="pt-5">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Water Meter Aktif</p>
        {customer.wmNoSeri ? (
          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
            <span className="font-mono font-bold text-pdam-primary">{customer.wmNoSeri}</span>
            <span className={`badge badge-sm font-bold border ${wmBadge[customer.wmStatus]}`}>{customer.wmStatus}</span>
          </div>
        ) : (
          <div className="flex items-start gap-2 rounded-lg border border-pdam-red/30 bg-pdam-red/5 p-3 text-xs text-pdam-red">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            Data legacy: pelanggan ini belum memiliki nomor seri WM aktif. Gunakan tombol Input WM untuk memetakan.
          </div>
        )}
        {customer.wmStatus === "Perlu Ganti" && (
          <p className="text-[11px] text-amber-700 mt-2">
            Water meter diusulkan untuk diganti. Terbitkan tiket di menu Penugasan.
          </p>
        )}
        {/* Riwayat penggantian: ambil dari tabel penggantian_wm saat terhubung ke API */}
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

type Tab = "semua" | "aktif" | "legacy";

export default function PelangganPage() {
  const [customers, setCustomers] = useState<Pelanggan[]>(initialCustomers);
  const [stock, setStock] = useState<StokWM[]>(initialStock);

  const [tab, setTab] = useState<Tab>("semua");
  const [search, setSearch] = useState("");
  const [cabangFilter, setCabangFilter] = useState("");
  const [tarifFilter, setTarifFilter] = useState("");

  const [showExport, setShowExport] = useState(false);
  const [formState, setFormState] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [wmId, setWmId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const editingCustomer = customers.find((c) => c.id === formState.id) ?? null;
  const wmCustomer = customers.find((c) => c.id === wmId) ?? null;
  const detailCustomer = customers.find((c) => c.id === detailId) ?? null;

  const usedSN = new Set([
    ...customers.map((c) => c.wmNoSeri).filter((s): s is string => !!s),
    ...stock.map((s) => s.sn),
  ]);

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      (tab === "semua" || (tab === "aktif" ? !!c.wmNoSeri : !c.wmNoSeri)) &&
      (!cabangFilter || c.cabang === cabangFilter) &&
      (!tarifFilter || c.tipeTarif === tarifFilter) &&
      (!q ||
        c.id.toLowerCase().includes(q) ||
        c.nama.toLowerCase().includes(q) ||
        (c.wmNoSeri ?? "").toLowerCase().includes(q))
    );
  });

  const resetFilter = () => {
    setTab("semua");
    setSearch("");
    setCabangFilter("");
    setTarifFilter("");
  };

  const handleSaveCustomer = (data: { nama: string; alamat: string; cabang: string; tipeTarif: string }) => {
    if (editingCustomer) {
      setCustomers((prev) => prev.map((c) => (c.id === editingCustomer.id ? { ...c, ...data } : c)));
      showToast(`Data ${data.nama} berhasil diperbarui.`);
    } else {
      const nextNo = Math.max(...customers.map((c) => Number(c.id.replace("PLG-", "")))) + 1;
      setCustomers((prev) => [
        { id: `PLG-${String(nextNo).padStart(6, "0")}`, ...data, wmNoSeri: null, wmStatus: "Belum Ada WM" },
        ...prev,
      ]);
      showToast(`Pelanggan ${data.nama} berhasil ditambahkan.`);
    }
  };

  const handleSaveWm = (sn: string, fromStock: boolean) => {
    if (!wmCustomer) return;
    setCustomers((prev) =>
      prev.map((c) => (c.id === wmCustomer.id ? { ...c, wmNoSeri: sn, wmStatus: "Aktif" } : c))
    );
    if (fromStock) setStock((prev) => prev.filter((s) => s.sn !== sn));
    showToast(`WM ${sn} berhasil dipetakan ke ${wmCustomer.nama}.`);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header Title */}
      <div>
        <p className="text-xs text-slate-500 mb-1">
          PDAM Tirta / Operasional / <span className="text-pdam-primary font-semibold">Data Pelanggan</span>
        </p>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-pdam-navy">Manajemen Data Pelanggan</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Pengelolaan data pelanggan dan pemetaan status water meter aktif (termasuk penanganan data
              legacy/pelanggan lama).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowExport(true)}
              className="btn btn-sm btn-ghost bg-white hover:bg-pdam-bg border border-slate-200 text-pdam-navy font-semibold normal-case shadow-xs"
            >
              <Download className="w-4 h-4 text-pdam-primary" />
              <span>Export Data Pelanggan</span>
            </button>
            <button
              onClick={() => setFormState({ open: true, id: null })}
              className="btn btn-sm bg-pdam-primary hover:bg-pdam-navy text-white font-semibold normal-case border-0 shadow-xs"
            >
              <UserPlus className="w-4 h-4" />
              <span>Tambah Pelanggan Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Kartu Statistik Atas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-white border border-slate-200/90 shadow-xs p-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">TOTAL PELANGGAN</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-pdam-navy tabular-nums">4.820</span>
            <span className="text-xs font-bold text-slate-500">SR</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Tersebar di 5 Unit Wilayah Cabang</p>
        </div>

        <div className="card bg-white border border-slate-200/90 shadow-xs p-4">
          <p className="text-[10px] font-bold text-pdam-primary uppercase tracking-wider mb-1">WM AKTIF NORMAL</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-pdam-primary tabular-nums">4.120</span>
            <span className="text-xs font-bold text-pdam-primary">Unit</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="badge border border-pdam-primary/25 bg-pdam-primary/10 text-pdam-primary badge-xs font-bold">85.4%</span>
            <span className="text-[11px] text-slate-500">Terdata SN Lengkap &amp; Terkalibrasi</span>
          </div>
        </div>

        <div className="card bg-white border border-slate-200/90 shadow-xs p-4">
          <p className="text-[10px] font-bold text-pdam-navy uppercase tracking-wider mb-1">LEGACY (TANPA WM)</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-pdam-navy tabular-nums">480</span>
            <span className="text-xs font-bold text-pdam-navy">SR</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="badge border border-pdam-navy/25 bg-pdam-navy/10 text-pdam-navy badge-xs font-bold">9.9%</span>
            <span className="text-[11px] text-slate-500">Perlu Input / Pemetaan Fisik</span>
          </div>
        </div>

        <div className="card bg-white border border-slate-200/90 shadow-xs p-4">
          <p className="text-[10px] font-bold text-pdam-red uppercase tracking-wider mb-1">USULAN PERGANTIAN</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-pdam-red tabular-nums">220</span>
            <span className="text-xs font-bold text-pdam-red">Unit</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="badge border border-pdam-red/25 bg-pdam-red/10 text-pdam-red badge-xs font-bold">4.5%</span>
            <span className="text-[11px] text-slate-500">Usia &gt;5 Thn / Kerusakan Fisik</span>
          </div>
        </div>
      </div>

      {/* Banner Info Perhatian Data Legacy */}
      <div className="card bg-pdam-navy/5 border border-pdam-navy/20 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-pdam-navy/10 text-pdam-navy shrink-0 mt-0.5">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-pdam-navy flex items-center gap-2">
              Perhatian: Ditemukan 480 Data Pelanggan Lama (Legacy) Belum Memiliki Nomor Seri WM Digital
              <span className="badge border border-pdam-navy/25 bg-pdam-navy/10 text-pdam-navy badge-xs font-semibold">
                Butuh Pemetaan
              </span>
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              Gunakan tombol cepat &quot;Input WM Aktif&quot; pada baris pelanggan untuk mendokumentasikan nomor seri
              meteran baru atau hasil verifikasi fisik lapangan secara langsung.
            </p>
          </div>
        </div>

        <button
          onClick={() => setTab("legacy")}
          className="btn btn-sm bg-pdam-navy hover:bg-pdam-navy/90 text-white font-semibold normal-case shrink-0 border-0 shadow-xs"
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Filter Data Legacy Saja</span>
        </button>
      </div>

      {/* Filter & Bar Pencarian */}
      <div className="card bg-white border border-slate-200/90 shadow-xs p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-slate-200">
          {[
            { v: "semua" as Tab, label: "Semua Pelanggan", count: "4.820" },
            { v: "aktif" as Tab, label: "WM Aktif", count: "4.340" },
            { v: "legacy" as Tab, label: "Legacy / Belum Ada WM", count: "480" },
          ].map((t) => (
            <button
              key={t.v}
              onClick={() => setTab(t.v)}
              className={`btn btn-sm font-medium normal-case ${
                tab === t.v
                  ? "bg-pdam-primary hover:bg-pdam-navy text-white border-0 shadow-xs"
                  : "btn-ghost bg-pdam-bg hover:bg-slate-200 border border-slate-200/80 text-slate-700"
              }`}
            >
              {t.label}{" "}
              <span className={tab === t.v ? "bg-white/20 px-1.5 py-0.5 rounded text-[10px] ml-1" : "text-slate-400 ml-1"}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari ID Pelanggan, Nama, SN WM..."
            className="input input-bordered input-sm w-full pl-9 text-xs bg-pdam-bg/50 border-slate-200 focus:border-pdam-primary focus:bg-white"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-pdam-navy uppercase">CABANG:</span>
              <select
                value={cabangFilter}
                onChange={(e) => setCabangFilter(e.target.value)}
                className="select select-bordered select-sm text-xs font-medium border-slate-200 bg-white"
              >
                <option value="">Semua Cabang (5 Unit)</option>
                {cabangOptions.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-pdam-navy uppercase">GOLONGAN:</span>
              <select
                value={tarifFilter}
                onChange={(e) => setTarifFilter(e.target.value)}
                className="select select-bordered select-sm text-xs font-medium border-slate-200 bg-white"
              >
                <option value="">Semua Tarif</option>
                {tarifOptions.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-1.5 self-end sm:self-auto">
            <span>Menampilkan {filtered.length} dari 4.820 pelanggan</span>
            <button onClick={resetFilter} title="Reset filter" className="btn btn-ghost btn-xs btn-square text-slate-400 hover:text-pdam-navy">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabel Data Pelanggan */}
      <div className="card bg-white border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-sm w-full">
            <thead>
              <tr className="bg-pdam-bg text-pdam-navy text-[11px] uppercase tracking-wider border-b border-slate-200 font-bold">
                <th className="py-3.5 pl-5">ID &amp; NAMA PELANGGAN</th>
                <th className="py-3.5">ALAMAT &amp; UNIT</th>
                <th className="py-3.5">TIPE TARIF</th>
                <th className="py-3.5">WATER METER AKTIF</th>
                <th className="py-3.5 text-right pr-5">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-pdam-bg/60 transition-colors">
                  <td className="py-3.5 pl-5">
                    <span className="font-bold text-pdam-navy block">{item.nama}</span>
                    <span className="text-[10px] font-mono text-slate-400">{item.id}</span>
                  </td>

                  <td className="py-3.5">
                    <span className="text-slate-600 block">{item.alamat}</span>
                    <span className="font-bold text-[11px] text-pdam-navy">{item.cabang}</span>
                  </td>

                  <td className="py-3.5">
                    <span className="font-medium text-slate-700">{item.tipeTarif}</span>
                  </td>

                  <td className="py-3.5">
                    <div className="flex items-center gap-2">
                      {item.wmNoSeri ? (
                        <>
                          <span className="font-bold text-pdam-primary font-mono">{item.wmNoSeri}</span>
                          <span className={`badge badge-xs font-bold border ${wmBadge[item.wmStatus]}`}>
                            {item.wmStatus}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="badge border border-pdam-red/30 bg-pdam-red/10 text-pdam-red badge-xs font-bold">
                            Belum Ada WM
                          </span>
                          <button
                            onClick={() => setWmId(item.id)}
                            className="btn btn-xs bg-pdam-primary hover:bg-pdam-navy text-white font-semibold normal-case gap-1 border-0 shadow-xs"
                          >
                            <Plus className="w-3 h-3" />
                            Input WM
                          </button>
                        </>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 text-right pr-5">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => setDetailId(item.id)}
                        className="text-pdam-primary font-semibold hover:text-pdam-navy hover:underline"
                      >
                        Detail
                      </button>
                      <button
                        onClick={() => setFormState({ open: true, id: item.id })}
                        className="text-slate-400 font-semibold hover:text-pdam-navy hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-400">
                    Tidak ada pelanggan yang sesuai filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <span>Menampilkan 1 - {filtered.length} dari 4.820 total pelanggan terdaftar</span>

          <div className="join">
            <button className="join-item btn btn-sm btn-ghost btn-disabled">
              <ChevronLeft className="w-4 h-4" /> Sebelumnya
            </button>
            <button className="join-item btn btn-sm bg-pdam-primary text-white font-bold border-0">1</button>
            <button className="join-item btn btn-sm btn-ghost hover:bg-pdam-bg">2</button>
            <button className="join-item btn btn-sm btn-ghost hover:bg-pdam-bg">3</button>
            <button className="join-item btn btn-sm btn-ghost hover:bg-pdam-bg">..</button>
            <button className="join-item btn btn-sm btn-ghost hover:bg-pdam-bg">482</button>
            <button className="join-item btn btn-sm btn-ghost hover:bg-pdam-bg">
              Selanjutnya <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals (dirender sekali di luar tabel) */}
      {showExport && <ExportModal onClose={() => setShowExport(false)} allData={customers} filteredData={filtered} />}
      {formState.open && (
        <CustomerFormModal
          key={formState.id ?? "new"}
          editing={editingCustomer}
          onClose={() => setFormState({ open: false, id: null })}
          onSave={handleSaveCustomer}
        />
      )}
      {wmCustomer && (
        <InputWmModal
          key={wmCustomer.id}
          customer={wmCustomer}
          stock={stock}
          usedSN={usedSN}
          onClose={() => setWmId(null)}
          onSave={handleSaveWm}
        />
      )}
      {detailCustomer && !wmCustomer && !formState.open && (
        <DetailModal
          customer={detailCustomer}
          onClose={() => setDetailId(null)}
          onEdit={() => setFormState({ open: true, id: detailCustomer.id })}
          onInputWm={() => setWmId(detailCustomer.id)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="toast toast-end z-50">
          <div className="alert bg-pdam-navy text-white text-xs shadow-lg border-0 py-2.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toast}</span>
          </div>
        </div>
      )}
    </div>
  );
}
