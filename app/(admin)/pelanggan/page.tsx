"use client";

import {
  Download,
  UserPlus,
  Search,
  Info,
  Filter,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  X,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Check,
  MapPin,
  Upload,
} from "lucide-react";
import { useState, type ReactNode } from "react";

/* ------------------------------------------------------------------ */
/* Types & Data                                                        */
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

type PelangganInput = { nama: string; alamat: string; cabang: string; tipeTarif: string };

const initialCustomers: Pelanggan[] = [
  { id: "PLG-KNG-089211", nama: "Bambang Sugianto", alamat: "Jl. Siliwangi No. 120, Kuningan Kota", cabang: "Unit Kuningan", tipeTarif: "Gol. 2A - Rumah Tangga (R1)", wmNoSeri: "WM-24-004891", wmStatus: "Aktif" },
  { id: "PLG-CGG-002104", nama: "H. Ridwan Mansyur", alamat: "Jl. Sukamulya No. 18 RT 02/RW 04, Cigugur", cabang: "Unit Cigugur", tipeTarif: "Gol. 2B - Rumah Tangga Mampu (R2)", wmNoSeri: null, wmStatus: "Belum Ada WM" },
  { id: "PLG-CLM-055102", nama: "Siti Rahmawati Putri", alamat: "Jl. Raya Bandorasa No. 12, Cilimus", cabang: "Unit Cilimus", tipeTarif: "Gol. 2A - Rumah Tangga (R1)", wmNoSeri: "WM-19-091420", wmStatus: "Perlu Ganti" },
  { id: "PLG-CAW-091480", nama: "CV. Agro Ciawi Mandiri", alamat: "Jl. Raya Ciawi-Gebang Kav. 8", cabang: "Unit Ciawi", tipeTarif: "Gol. 3A - Niaga Kecil (N1)", wmNoSeri: "WM-25-087221", wmStatus: "Aktif" },
  { id: "PLG-LRG-014802", nama: "Dra. Endang Purwanti", alamat: "Jl. Raya Luragung No. 74", cabang: "Unit Luragung", tipeTarif: "Gol. 2B - Rumah Tangga Mampu (R2)", wmNoSeri: null, wmStatus: "Belum Ada WM" },
  { id: "PLG-KDG-003892", nama: "Masjid Al-Ittihad Kadugede", alamat: "Desa Kadugede No. 5 RT 01/RW 02", cabang: "Unit Kadugede", tipeTarif: "Gol. 1B - Sosial Khusus", wmNoSeri: null, wmStatus: "Belum Ada WM" },
  { id: "PLG-CDH-078199", nama: "PT. Pangan Lestari Kuningan", alamat: "Kawasan Industri Cidahu Blok A-12", cabang: "Unit Cidahu", tipeTarif: "Gol. Industri (IND)", wmNoSeri: "WM-25-010492", wmStatus: "Aktif" },
  { id: "PLG-GRW-034112", nama: "Asep Saepullah", alamat: "Jl. Raya Garawangi No. 88", cabang: "Unit Garawangi", tipeTarif: "Gol. 2A - Rumah Tangga (R1)", wmNoSeri: "WM-24-019944", wmStatus: "Aktif" },
  { id: "PLG-JPR-041005", nama: "Kusnandar Wijaya", alamat: "Desa Dukuhdalem, Japara", cabang: "Unit Japara", tipeTarif: "Gol. 2A - Rumah Tangga (R1)", wmNoSeri: null, wmStatus: "Belum Ada WM" },
];

const cabangOptions = [
  "Unit Kuningan",
  "Unit Cilimus",
  "Unit Cigugur",
  "Unit Ciawi",
  "Unit Luragung",
  "Unit Kadugede",
  "Unit Garawangi",
  "Unit Japara",
  "Unit Cidahu",
];

const tarifOptions = [
  "Gol. 1B - Sosial Khusus",
  "Gol. 2A - Rumah Tangga (R1)",
  "Gol. 2B - Rumah Tangga Mampu (R2)",
  "Gol. 3A - Niaga Kecil (N1)",
  "Gol. 3B - Niaga Besar (N2)",
  "Gol. Industri (IND)",
  "Gol. Instansi Pemerintah (IP)",
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
/* Modal: Form Pelanggan Baru / Edit                                   */
/* ------------------------------------------------------------------ */

function CustomerFormModal({
  editing,
  onClose,
  onSave,
}: {
  editing: Pelanggan | null;
  onClose: () => void;
  onSave: (data: PelangganInput) => void;
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
    if (!form.alamat.trim()) return setError("Alamat wajib diisi.");
    onSave({ ...form, nama: form.nama.trim(), alamat: form.alamat.trim() });
    onClose();
  };

  return (
    <Modal
      wide
      title={isEdit ? "Edit Data Pelanggan" : "Tambah Pelanggan Baru"}
      subtitle={
        isEdit
          ? `${editing!.id} • Data WM aktif diperbarui secara otomatis dari BAP Lapangan.`
          : "Pelanggan baru akan berstatus Belum Ada WM sampai dilakukan pemasangan di lapangan."
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
/* Modal: Detail Pelanggan                                             */
/* ------------------------------------------------------------------ */

function DetailModal({
  customer,
  onClose,
  onEdit,
}: {
  customer: Pelanggan;
  onClose: () => void;
  onEdit: () => void;
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
      subtitle="Informasi master pelanggan & status water meter aktif."
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className={btnGhost}>Tutup</button>
          <button onClick={onEdit} className={btnPrimary}>Edit Data</button>
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
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Water Meter Aktif Terpasang</p>
        {customer.wmNoSeri ? (
          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3 bg-slate-50">
            <div>
              <span className="font-mono font-bold text-pdam-primary block text-sm">{customer.wmNoSeri}</span>
              <span className="text-[10px] text-slate-400">Terdaftar dari Berita Acara Penggantian (BAP)</span>
            </div>
            <span className={`badge badge-sm font-bold border ${wmBadge[customer.wmStatus]}`}>{customer.wmStatus}</span>
          </div>
        ) : (
          <div className="flex items-start gap-2 rounded-lg border border-pdam-red/30 bg-pdam-red/5 p-3 text-xs text-pdam-red">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <strong>Belum Ada WM:</strong> Pelanggan ini belum memiliki catatan nomor seri WM aktif. Data WM akan otomatis terisi setelah teknisi mengeksekusi penugasan dan BAP divalidasi oleh Pusat.
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Page utama                                                          */
/* ------------------------------------------------------------------ */

export default function PelangganPage() {
  const [customers, setCustomers] = useState<Pelanggan[]>(initialCustomers);
  const [tab, setTab] = useState<"semua" | "aktif" | "legacy">("semua");
  const [search, setSearch] = useState("");
  const [cabangFilter, setCabangFilter] = useState("");
  const [tarifFilter, setTarifFilter] = useState("");

  const [formState, setFormState] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [detailId, setDetailId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const editingCustomer = customers.find((c) => c.id === formState.id) ?? null;
  const detailCustomer = customers.find((c) => c.id === detailId) ?? null;

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

  const handleSaveCustomer = (data: PelangganInput) => {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs text-slate-500 mb-1">
          <span className="font-semibold text-pdam-primary">PAM Tirta Kamuning</span> / Master Data / <span className="text-pdam-primary font-semibold">Data Pelanggan</span>
        </p>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-pdam-navy">Manajemen Data Pelanggan</h1>
              <span className="badge bg-pdam-primary/10 text-pdam-primary border-pdam-primary/20 text-[10px] font-bold">
                Master Data Pusat
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pengelolaan master data pelanggan terpusat. Data nomor seri WM aktif akan otomatis terisi melalui validasi BAP penggantian di lapangan.
            </p>
          </div>

          <button
            onClick={() => setFormState({ open: true, id: null })}
            className="btn btn-sm bg-pdam-primary hover:bg-pdam-navy text-white font-semibold normal-case border-0 shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Pelanggan Baru</span>
          </button>
        </div>
      </div>

      {/* Info Banner Otomatisasi BAP */}
      <div className="card bg-pdam-navy/5 border border-pdam-navy/20 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-pdam-navy/10 text-pdam-navy shrink-0 mt-0.5">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-pdam-navy">
              Informasi Pemetaan Water Meter Aktif &amp; Data Legacy
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              Sistem tidak memerlukan penginputan manual nomor seri WM. Saat SPK penugasan dijalankan oleh teknisi dan <strong>BAP divalidasi oleh Pusat</strong>, nomor seri meter baru akan otomatis terhubung ke pelanggan.
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="card bg-white border border-slate-200/90 shadow-xs p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-slate-200">
          {[
            { v: "semua", label: "Semua Pelanggan" },
            { v: "aktif", label: "WM Terpasang" },
            { v: "legacy", label: "Belum Ada WM (Legacy)" },
          ].map((t) => (
            <button
              key={t.v}
              onClick={() => setTab(t.v as any)}
              className={`btn btn-sm font-medium normal-case ${
                tab === t.v
                  ? "bg-pdam-primary hover:bg-pdam-navy text-white border-0 shadow-xs"
                  : "btn-ghost bg-pdam-bg hover:bg-slate-200 border border-slate-200/80 text-slate-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari ID Pelanggan, Nama, Alamat, atau No. Seri WM..."
            className="input input-bordered input-sm w-full pl-9 text-xs bg-pdam-bg/50 border-slate-200 focus:border-pdam-primary focus:bg-white"
          />
        </div>
      </div>

      {/* Table Data Pelanggan */}
      <div className="card bg-white border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-sm w-full">
            <thead>
              <tr className="bg-pdam-bg text-pdam-navy text-[11px] uppercase tracking-wider border-b border-slate-200 font-bold">
                <th className="py-3.5 pl-5">ID &amp; NAMA PELANGGAN</th>
                <th className="py-3.5">ALAMAT &amp; UNIT CABANG</th>
                <th className="py-3.5">GOLONGAN TARIF</th>
                <th className="py-3.5">WATER METER AKTIF (OTOMATIS BAP)</th>
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
                        <span className="badge border border-pdam-red/30 bg-pdam-red/10 text-pdam-red badge-xs font-bold">
                          Belum Ada WM
                        </span>
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
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {formState.open && (
        <CustomerFormModal
          key={formState.id ?? "new"}
          editing={editingCustomer}
          onClose={() => setFormState({ open: false, id: null })}
          onSave={handleSaveCustomer}
        />
      )}
      {detailCustomer && (
        <DetailModal
          customer={detailCustomer}
          onClose={() => setDetailId(null)}
          onEdit={() => setFormState({ open: true, id: detailCustomer.id })}
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