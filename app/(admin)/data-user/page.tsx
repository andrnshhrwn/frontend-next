"use client";

import {
  Download,
  UserPlus,
  Search,
  Users,
  Shield,
  ShieldCheck,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Building2,
  UserCog,
  Smartphone,
  Lock,
  Pencil,
  KeyRound,
  Power,
  X,
  FileSpreadsheet,
  AlertCircle,
  Copy,
  Check,
  CheckCircle2,
  Minus,
} from "lucide-react";
import { useState, type ReactNode } from "react";

/* ------------------------------------------------------------------ */
/* Types & data                                                        */
/* ------------------------------------------------------------------ */

type Peran = "Admin Pusat" | "Admin Cabang" | "Teknisi Mobile";
type StatusUser = "Aktif" | "Nonaktif";

interface Pengguna {
  nip: string;
  nama: string;
  email: string;
  telp: string;
  peran: Peran;
  unit: string;
  login: string;
  status: StatusUser;
}

const initialUsers: Pengguna[] = [
  { nip: "19880412 201202 1 001", nama: "Agung Pratama, S.T.", email: "agung.pratama@pdamtirta.co.id", telp: "+62 811-2345-9801", peran: "Admin Pusat", unit: "Kantor Pusat (TI & Operasional)", login: "Hari ini, 08:14 WIB", status: "Aktif" },
  { nip: "19910520 201503 1 004", nama: "Hendra Prasetya, S.Kom.", email: "hendra.p@pdamtirta.co.id", telp: "+62 812-4456-7890", peran: "Admin Cabang", unit: "Wilayah Timur (UPT III)", login: "Kemarin, 16:45 WIB", status: "Aktif" },
  { nip: "19930811 201701 2 003", nama: "Siti Rahmawati", email: "siti.rahmawati@pdamtirta.co.id", telp: "+62 813-8890-1123", peran: "Admin Cabang", unit: "Wilayah Barat (UPT II)", login: "Hari ini, 07:30 WIB", status: "Aktif" },
  { nip: "19951204 201902 1 008", nama: "Rudi Hermawan", email: "rudi.hermawan@pdamtirta.co.id", telp: "+62 821-9988-7712", peran: "Teknisi Mobile", unit: "Wilayah Selatan (UPT IV)", login: "Hari ini, 08:35 WIB", status: "Aktif" },
  { nip: "19960715 202001 1 012", nama: "Bagas Wahyudi", email: "bagas.w@pdamtirta.co.id", telp: "+62 857-3344-5511", peran: "Teknisi Mobile", unit: "Wilayah Utara (UPT I)", login: "03 Mar 2025, 14:12 WIB", status: "Aktif" },
  { nip: "19901112 201402 2 002", nama: "Dian Anggraini, M.T.", email: "dian.anggraini@pdamtirta.co.id", telp: "+62 812-7711-2234", peran: "Admin Pusat", unit: "Kantor Pusat (Audit & Keamanan)", login: "Hari ini, 06:50 WIB", status: "Aktif" },
];

const CURRENT_USER_NIP = initialUsers[0].nip; // akun yang sedang login

const roleFilters = ["Semua Peran", "Admin Pusat", "Admin Cabang", "Teknisi"];

const unitOptions = [
  "Kantor Pusat (TI & Operasional)",
  "Kantor Pusat (Audit & Keamanan)",
  "Wilayah Timur (UPT III)",
  "Wilayah Barat (UPT II)",
  "Wilayah Selatan (UPT IV)",
  "Wilayah Utara (UPT I)",
];

const cabangFilterOptions = [
  { label: "Semua Cabang", value: "" },
  { label: "Kantor Pusat", value: "Kantor Pusat" },
  { label: "Wilayah Timur (UPT III)", value: "Wilayah Timur" },
  { label: "Wilayah Barat (UPT II)", value: "Wilayah Barat" },
  { label: "Wilayah Selatan (UPT IV)", value: "Wilayah Selatan" },
  { label: "Wilayah Utara (UPT I)", value: "Wilayah Utara" },
];

const peranClass: Record<Peran, string> = {
  "Admin Pusat": "border-pdam-navy/25 bg-pdam-navy/10 text-pdam-navy",
  "Admin Cabang": "border-pdam-primary/25 bg-pdam-primary/10 text-pdam-primary",
  "Teknisi Mobile": "border-amber-500/30 bg-amber-500/10 text-amber-700",
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

// Hanya untuk mock UI. Password sementara asli wajib dibuat di server.
function genPassword(len = 10) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

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
/* Modal: Export Log Akses                                             */
/* ------------------------------------------------------------------ */

function ExportModal({
  onClose,
  allData,
  filteredData,
}: {
  onClose: () => void;
  allData: Pengguna[];
  filteredData: Pengguna[];
}) {
  const [format, setFormat] = useState<"csv" | "xlsx">("csv");
  const [scope, setScope] = useState<"filter" | "all">("filter");
  const rows = scope === "filter" ? filteredData : allData;

  const header = ["NIP", "Nama", "Email", "Telepon", "Peran", "Unit Cabang", "Login Terakhir", "Status"];
  const toRow = (u: Pengguna) => [u.nip, u.nama, u.email, u.telp, u.peran, u.unit, u.login, u.status];

  const handleExport = () => {
    const stamp = new Date().toISOString().slice(0, 10);
    if (format === "csv") {
      const csv = [header.map(csvCell).join(",")]
        .concat(rows.map((r) => toRow(r).map(csvCell).join(",")))
        .join("\n");
      downloadFile(`log-akses-${stamp}.csv`, csv, "text/csv;charset=utf-8");
    } else {
      // TODO: ganti dengan SheetJS (xlsx) untuk file .xlsx asli.
      const tsv = [header.join("\t")].concat(rows.map((r) => toRow(r).join("\t"))).join("\n");
      downloadFile(`log-akses-${stamp}.xls`, tsv, "application/vnd.ms-excel");
    }
    onClose();
  };

  return (
    <Modal
      title="Export Log Akses"
      subtitle="Unduh daftar akun beserta aktivitas login terakhir."
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className={btnGhost}>
            Batal
          </button>
          <button onClick={handleExport} disabled={rows.length === 0} className={btnPrimary}>
            <Download className="w-4 h-4" /> Unduh {rows.length} Akun
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
              Sesuai filter aktif ({filteredData.length} akun)
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" className="radio radio-xs radio-primary" checked={scope === "all"} onChange={() => setScope("all")} />
              Semua akun yang dimuat ({allData.length} akun)
            </label>
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Modal: Tambah / Edit Pengguna                                       */
/* ------------------------------------------------------------------ */

function UserFormModal({
  editing,
  existingNips,
  onClose,
  onSave,
}: {
  editing: Pengguna | null;
  existingNips: Set<string>;
  onClose: () => void;
  onSave: (u: Pengguna, isNew: boolean) => void;
}) {
  const isEdit = !!editing;
  const [form, setForm] = useState({
    nama: editing?.nama ?? "",
    nip: editing?.nip ?? "",
    email: editing?.email ?? "",
    telp: editing?.telp ?? "",
    peran: (editing?.peran ?? "Admin Cabang") as Peran,
    unit: editing?.unit ?? unitOptions[2],
    password: isEdit ? "" : genPassword(),
  });
  const [error, setError] = useState("");

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    const nama = form.nama.trim();
    const nip = form.nip.trim();
    const email = form.email.trim().toLowerCase();
    if (!nama) return setError("Nama lengkap wajib diisi.");
    if (!nip) return setError("NIP wajib diisi.");
    if (!isEdit && existingNips.has(nip)) return setError("NIP sudah terdaftar.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Format email tidak valid.");
    if (!form.telp.trim()) return setError("Nomor telepon / WA wajib diisi.");
    if (!isEdit && form.password.length < 8) return setError("Password awal minimal 8 karakter.");

    onSave(
      {
        nip,
        nama,
        email,
        telp: form.telp.trim(),
        peran: form.peran,
        unit: form.unit,
        login: editing?.login ?? "Belum pernah login",
        status: editing?.status ?? "Aktif",
      },
      !isEdit
    );
    onClose();
  };

  return (
    <Modal
      wide
      title={isEdit ? "Edit Pengguna" : "Tambah Pengguna Baru"}
      subtitle={
        isEdit
          ? "Perbarui data akun dan hak akses pengguna."
          : "Akun baru akan aktif dan wajib mengganti password saat login pertama."
      }
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className={btnGhost}>
            Batal
          </button>
          <button onClick={handleSubmit} className={btnPrimary}>
            {isEdit ? <Check className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            {isEdit ? "Simpan Perubahan" : "Tambah Pengguna"}
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className={labelCls}>Nama Lengkap</label>
          <input className={inputCls} value={form.nama} onChange={(e) => set("nama", e.target.value)} placeholder="contoh: Agung Pratama, S.T." />
        </div>
        <div>
          <label className={labelCls}>NIP</label>
          <input
            className={`${inputCls} font-mono`}
            value={form.nip}
            disabled={isEdit}
            onChange={(e) => set("nip", e.target.value)}
            placeholder="19880412 201202 1 001"
          />
        </div>
        <div>
          <label className={labelCls}>No. Telepon / WA</label>
          <input className={inputCls} value={form.telp} onChange={(e) => set("telp", e.target.value)} placeholder="+62 8xx-xxxx-xxxx" />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Email Resmi</label>
          <input className={inputCls} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="nama@pdamtirta.co.id" />
        </div>
        <div>
          <label className={labelCls}>Peran</label>
          <select className={selectCls} value={form.peran} onChange={(e) => set("peran", e.target.value)}>
            <option>Admin Pusat</option>
            <option>Admin Cabang</option>
            <option>Teknisi Mobile</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Unit Cabang</label>
          <select className={selectCls} value={form.unit} onChange={(e) => set("unit", e.target.value)}>
            {unitOptions.map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
        </div>

        {!isEdit && (
          <div className="sm:col-span-2">
            <label className={labelCls}>Password Awal</label>
            <div className="flex gap-2">
              <input className={`${inputCls} font-mono`} value={form.password} onChange={(e) => set("password", e.target.value)} />
              <button
                type="button"
                onClick={() => set("password", genPassword())}
                className="btn btn-sm btn-ghost border border-slate-200 text-pdam-primary normal-case font-semibold shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Acak
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Sampaikan password ini ke pengguna secara aman. Di produksi, password dibuat dan di-hash di server.
            </p>
          </div>
        )}

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
/* Modal: Reset Password                                               */
/* ------------------------------------------------------------------ */

function ResetModal({ user, onClose, onDone }: { user: Pengguna; onClose: () => void; onDone: () => void }) {
  const [pwd, setPwd] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!pwd) return;
    try {
      await navigator.clipboard.writeText(pwd);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard tidak tersedia */
    }
  };

  return (
    <Modal
      title="Reset Password"
      subtitle={`${user.nama} • ${user.nip}`}
      onClose={onClose}
      footer={
        pwd ? (
          <button
            onClick={() => {
              onDone();
              onClose();
            }}
            className={btnPrimary}
          >
            <Check className="w-4 h-4" /> Selesai
          </button>
        ) : (
          <>
            <button onClick={onClose} className={btnGhost}>
              Batal
            </button>
            <button
              onClick={() => setPwd(genPassword())}
              className="btn btn-sm bg-amber-500 hover:bg-amber-600 text-white border-0 normal-case font-semibold"
            >
              <KeyRound className="w-4 h-4" /> Buat Password Sementara
            </button>
          </>
        )
      }
    >
      {pwd ? (
        <div className="space-y-3">
          <p className="text-xs text-slate-600">
            Password sementara berhasil dibuat. Sampaikan ke pengguna; mereka wajib menggantinya saat login berikutnya.
          </p>
          <div className="flex items-center justify-between rounded-lg border border-pdam-primary/30 bg-pdam-primary/5 px-4 py-3">
            <span className="font-mono font-bold text-pdam-navy tracking-wider">{pwd}</span>
            <button onClick={copy} className="btn btn-xs btn-ghost text-pdam-primary normal-case font-semibold gap-1">
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Tersalin" : "Salin"}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            Password lama <strong>{user.nama}</strong> akan langsung tidak berlaku, dan semua sesi login aktif akan
            dikeluarkan.
          </span>
        </div>
      )}
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Modal: Aktifkan / Nonaktifkan                                       */
/* ------------------------------------------------------------------ */

function ToggleModal({ user, onClose, onConfirm }: { user: Pengguna; onClose: () => void; onConfirm: () => void }) {
  const deactivating = user.status === "Aktif";
  return (
    <Modal
      title={deactivating ? "Nonaktifkan Pengguna" : "Aktifkan Pengguna"}
      subtitle={`${user.nama} • ${user.peran}`}
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className={btnGhost}>
            Batal
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={
              deactivating
                ? "btn btn-sm bg-pdam-red hover:bg-pdam-red/90 text-white border-0 normal-case font-semibold"
                : btnPrimary
            }
          >
            <Power className="w-4 h-4" /> {deactivating ? "Ya, Nonaktifkan" : "Ya, Aktifkan"}
          </button>
        </>
      }
    >
      {deactivating ? (
        <div className="flex items-start gap-3 rounded-lg border border-pdam-red/30 bg-pdam-red/5 p-3 text-xs text-pdam-red">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            Pengguna tidak akan bisa login ke web maupun aplikasi mobile.
            {user.peran === "Teknisi Mobile" && " Pastikan tugas aktif teknisi ini sudah dialihkan."} Data riwayat
            tetap tersimpan.
          </span>
        </div>
      ) : (
        <p className="text-xs text-slate-600">
          Pengguna akan dapat login kembali menggunakan kredensial yang berlaku.
        </p>
      )}
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Role & Permissions (tab 2)                                          */
/* ------------------------------------------------------------------ */

type Access = "all" | "unit" | "own" | "none";

const permissionRows: { fitur: string; pusat: Access; cabang: Access; teknisi: Access }[] = [
  { fitur: "Monitoring status & inventori WM", pusat: "all", cabang: "unit", teknisi: "none" },
  { fitur: "Kelola master data (tarif, merk WM)", pusat: "all", cabang: "none", teknisi: "none" },
  { fitur: "Registrasi stok WM baru", pusat: "none", cabang: "unit", teknisi: "none" },
  { fitur: "Buat tiket penugasan", pusat: "all", cabang: "none", teknisi: "none" },
  { fitur: "Disposisi teknisi (plotting)", pusat: "none", cabang: "unit", teknisi: "none" },
  { fitur: "Eksekusi penggantian, foto & stand meter", pusat: "none", cabang: "none", teknisi: "own" },
  { fitur: "Verifikasi hasil lapangan", pusat: "all", cabang: "unit", teknisi: "none" },
  { fitur: "Laporan pergantian", pusat: "all", cabang: "unit", teknisi: "none" },
  { fitur: "Kelola pengguna & hak akses", pusat: "all", cabang: "none", teknisi: "none" },
];

function AccessCell({ v }: { v: Access }) {
  if (v === "none") return <Minus className="w-4 h-4 text-slate-300 mx-auto" />;
  const map = {
    all: { t: "Penuh", c: "border-pdam-navy/25 bg-pdam-navy/10 text-pdam-navy" },
    unit: { t: "Unit sendiri", c: "border-pdam-primary/25 bg-pdam-primary/10 text-pdam-primary" },
    own: { t: "Tugas sendiri", c: "border-amber-500/30 bg-amber-500/10 text-amber-700" },
  } as const;
  return (
    <span className={`badge badge-sm font-semibold border gap-1 ${map[v].c}`}>
      <CheckCircle2 className="w-3 h-3" /> {map[v].t}
    </span>
  );
}

function RolePermissionsView() {
  const roles = [
    { nama: "Admin Pusat", scope: "Global (Pusat & seluruh cabang)", icon: ShieldCheck, cls: "bg-pdam-navy/10 text-pdam-navy" },
    { nama: "Admin Cabang", scope: "Unit cabang terkait", icon: Building2, cls: "bg-pdam-primary/10 text-pdam-primary" },
    { nama: "Teknisi", scope: "Hanya tugas yang ditugaskan (mobile)", icon: UserCog, cls: "bg-amber-500/10 text-amber-700" },
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roles.map((r) => (
          <div key={r.nama} className="card bg-white border border-slate-200/90 shadow-xs p-4 flex-row items-start gap-3">
            <div className={`p-2 rounded-lg ${r.cls}`}>
              <r.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-pdam-navy">{r.nama}</p>
              <p className="text-[11px] text-slate-500">{r.scope}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card bg-white border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-sm w-full">
            <thead>
              <tr className="bg-pdam-bg text-pdam-navy text-[11px] uppercase tracking-wider border-b border-slate-200 font-bold">
                <th className="py-3.5 pl-5">FITUR / HAK AKSES</th>
                <th className="py-3.5 text-center">ADMIN PUSAT</th>
                <th className="py-3.5 text-center">ADMIN CABANG</th>
                <th className="py-3.5 text-center pr-5">TEKNISI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {permissionRows.map((p) => (
                <tr key={p.fitur} className="hover:bg-pdam-bg/60 transition-colors">
                  <td className="py-3.5 pl-5 font-semibold text-pdam-navy">{p.fitur}</td>
                  <td className="py-3.5 text-center"><AccessCell v={p.pusat} /></td>
                  <td className="py-3.5 text-center"><AccessCell v={p.cabang} /></td>
                  <td className="py-3.5 text-center pr-5"><AccessCell v={p.teknisi} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-200 bg-pdam-bg/50 text-[11px] text-slate-500">
          Matriks bersifat baca-saja. Pembatasan hak akses (RBAC) diterapkan di level API sesuai peran akun.
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tombol aksi baris                                                   */
/* ------------------------------------------------------------------ */

function IconAction({
  tip,
  onClick,
  disabled,
  tone,
  children,
}: {
  tip: string;
  onClick: () => void;
  disabled?: boolean;
  tone: "primary" | "amber" | "red" | "green";
  children: ReactNode;
}) {
  const tones = {
    primary: "bg-pdam-primary/10 text-pdam-primary hover:bg-pdam-primary hover:text-white",
    amber: "bg-amber-500/10 text-amber-700 hover:bg-amber-500 hover:text-white",
    red: "bg-pdam-red/10 text-pdam-red hover:bg-pdam-red hover:text-white",
    green: "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-600 hover:text-white",
  };
  return (
    <div className="tooltip tooltip-left" data-tip={tip}>
      <button
        onClick={onClick}
        disabled={disabled}
        aria-label={tip}
        className={`btn btn-sm btn-square border-0 shadow-none transition-colors disabled:opacity-40 disabled:bg-slate-100 disabled:text-slate-400 ${tones[tone]}`}
      >
        {children}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function DataUserPage() {
  const [users, setUsers] = useState<Pengguna[]>(initialUsers);
  const [activeTab, setActiveTab] = useState<"user" | "role">("user");
  const [roleFilter, setRoleFilter] = useState("Semua Peran");
  const [cabangFilter, setCabangFilter] = useState("");
  const [search, setSearch] = useState("");

  const [showExport, setShowExport] = useState(false);
  const [formState, setFormState] = useState<{ open: boolean; nip: string | null }>({ open: false, nip: null });
  const [resetNip, setResetNip] = useState<string | null>(null);
  const [toggleNip, setToggleNip] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const editingUser = users.find((u) => u.nip === formState.nip) ?? null;
  const resetUser = users.find((u) => u.nip === resetNip) ?? null;
  const toggleUser = users.find((u) => u.nip === toggleNip) ?? null;

  const filtered = users.filter((u) => {
    const matchRole =
      roleFilter === "Semua Peran" ||
      (roleFilter === "Teknisi" ? u.peran === "Teknisi Mobile" : u.peran === roleFilter);
    const matchCabang = !cabangFilter || u.unit.startsWith(cabangFilter);
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      u.nama.toLowerCase().includes(q) ||
      u.nip.includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.telp.includes(q);
    return matchRole && matchCabang && matchSearch;
  });

  const handleSave = (u: Pengguna, isNew: boolean) => {
    setUsers((prev) => (isNew ? [u, ...prev] : prev.map((x) => (x.nip === u.nip ? u : x))));
    showToast(isNew ? `Pengguna ${u.nama} berhasil ditambahkan.` : `Data ${u.nama} berhasil diperbarui.`);
  };

  const handleToggle = (nip: string) => {
    const target = users.find((u) => u.nip === nip);
    if (!target) return;
    const next: StatusUser = target.status === "Aktif" ? "Nonaktif" : "Aktif";
    setUsers((prev) => prev.map((u) => (u.nip === nip ? { ...u, status: next } : u)));
    showToast(`${target.nama} berhasil di${next === "Aktif" ? "aktifkan" : "nonaktifkan"}.`);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
          Sistem Administrasi / <span className="text-pdam-primary">Hak Akses &amp; Pengguna</span>
        </p>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-pdam-navy">
              Pengaturan Sistem &amp; Hak Akses
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 max-w-md">
              Kelola akun admin, petugas lapangan, dan batasan hak akses pengguna aplikasi manajemen water meter.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowExport(true)}
              className="btn btn-sm btn-ghost bg-white hover:bg-pdam-bg border border-slate-200 text-pdam-navy font-semibold normal-case shadow-xs"
            >
              <Download className="w-4 h-4 text-pdam-primary" />
              <span>Export Log Akses</span>
            </button>
            <button
              onClick={() => setFormState({ open: true, nip: null })}
              className="btn btn-sm bg-pdam-primary hover:bg-pdam-navy text-white font-semibold normal-case border-0 shadow-xs"
            >
              <UserPlus className="w-4 h-4" />
              <span>Tambah Pengguna Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Utama */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-pdam-primary/5 border border-pdam-primary/15">
          <button
            onClick={() => setActiveTab("user")}
            className={`btn btn-sm normal-case font-semibold border-0 gap-2 ${
              activeTab === "user" ? "bg-white text-pdam-primary shadow-xs" : "bg-transparent text-slate-600 hover:bg-white/60"
            }`}
          >
            <Users className="w-4 h-4" />
            Manajemen Pengguna
            <span className="badge badge-xs border border-pdam-primary/25 bg-pdam-primary/10 text-pdam-primary font-bold">32</span>
          </button>
          <button
            onClick={() => setActiveTab("role")}
            className={`btn btn-sm normal-case font-semibold border-0 gap-2 ${
              activeTab === "role" ? "bg-white text-pdam-primary shadow-xs" : "bg-transparent text-slate-600 hover:bg-white/60"
            }`}
          >
            <Shield className="w-4 h-4" />
            Role &amp; Permissions
            <span className="badge badge-xs border border-pdam-primary/25 bg-pdam-primary/10 text-pdam-primary font-bold">3 Tingkat</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
          <RefreshCw className="w-3.5 h-3.5 text-pdam-primary" />
          Sinkronisasi LDAP PDAM aktif
        </div>
      </div>

      {/* 4 Kartu Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-white border border-slate-200/90 shadow-xs p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TOTAL PENGGUNA AKTIF</p>
            <div className="p-1.5 rounded-md bg-pdam-primary/10 text-pdam-primary"><Users className="w-4 h-4" /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-pdam-navy tabular-nums">32</span>
            <span className="text-xs font-bold text-slate-500">User</span>
            <span className="badge badge-xs border border-pdam-primary/25 bg-pdam-primary/10 text-pdam-primary font-bold">5 Unit Wilayah</span>
          </div>
          <progress className="progress progress-primary h-1 w-full mt-3" value={100} max={100} />
        </div>

        <div className="card bg-white border border-slate-200/90 shadow-xs p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ADMIN PUSAT</p>
            <div className="p-1.5 rounded-md bg-pdam-navy/10 text-pdam-navy"><ShieldCheck className="w-4 h-4" /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-pdam-navy tabular-nums">4</span>
            <span className="text-xs font-bold text-slate-500">Akun</span>
            <span className="badge badge-xs border border-pdam-navy/25 bg-pdam-navy/10 text-pdam-navy font-bold">Superadmin Access</span>
          </div>
          <progress className="progress h-1 w-full mt-3 text-pdam-navy" value={12.5} max={100} />
        </div>

        <div className="card bg-white border border-slate-200/90 shadow-xs p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ADMIN CABANG</p>
            <div className="p-1.5 rounded-md bg-pdam-primary/10 text-pdam-primary"><Building2 className="w-4 h-4" /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-pdam-navy tabular-nums">10</span>
            <span className="text-xs font-bold text-slate-500">Supervisor</span>
            <span className="badge badge-xs border border-pdam-primary/25 bg-pdam-primary/10 text-pdam-primary font-bold">Validasi SPK</span>
          </div>
          <progress className="progress progress-info h-1 w-full mt-3" value={31} max={100} />
        </div>

        <div className="card bg-white border border-slate-200/90 shadow-xs p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TEKNISI LAPANGAN</p>
            <div className="p-1.5 rounded-md bg-pdam-primary/10 text-pdam-primary"><UserCog className="w-4 h-4" /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-pdam-navy tabular-nums">18</span>
            <span className="text-xs font-bold text-slate-500">Personel</span>
            <span className="badge badge-xs border border-pdam-primary/25 bg-pdam-primary/10 text-pdam-primary font-bold gap-1">
              <Smartphone className="w-2.5 h-2.5" /> App Android
            </span>
          </div>
          <progress className="progress progress-success h-1 w-full mt-3" value={56} max={100} />
        </div>
      </div>

      {activeTab === "role" ? (
        <RolePermissionsView />
      ) : (
        <>
          {/* Filter & Pencarian */}
          <div className="card bg-white border border-slate-200/90 shadow-xs p-4">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {roleFilters.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRoleFilter(r)}
                    className={`btn btn-xs normal-case font-semibold ${
                      roleFilter === r
                        ? "bg-pdam-primary hover:bg-pdam-navy text-white border-0"
                        : "btn-ghost bg-pdam-bg border border-slate-200/80 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <select
                  value={cabangFilter}
                  onChange={(e) => setCabangFilter(e.target.value)}
                  className="select select-bordered select-sm text-xs font-medium border-slate-200 bg-white"
                >
                  {cabangFilterOptions.map((o) => (
                    <option key={o.label} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari nama, NIP, email, WA..."
                    className="input input-bordered input-sm w-full sm:w-64 pl-9 text-xs bg-pdam-bg/50 border-slate-200 focus:border-pdam-primary focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tabel Pengguna */}
          <div className="card bg-white border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table table-sm w-full">
                <thead>
                  <tr className="bg-pdam-bg text-pdam-navy text-[11px] uppercase tracking-wider border-b border-slate-200 font-bold">
                    <th className="py-3.5 pl-5">NIP &amp; NAMA LENGKAP</th>
                    <th className="py-3.5">KONTAK RESMI</th>
                    <th className="py-3.5">PERAN</th>
                    <th className="py-3.5">UNIT CABANG</th>
                    <th className="py-3.5">STATUS</th>
                    <th className="py-3.5 text-right pr-5">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filtered.map((u) => {
                    const isSelf = u.nip === CURRENT_USER_NIP;
                    return (
                      <tr key={u.nip} className={`hover:bg-pdam-bg/60 transition-colors ${u.status === "Nonaktif" ? "opacity-60" : ""}`}>
                        <td className="py-4 pl-5">
                          <span className="font-bold text-pdam-navy block">
                            {u.nama}
                            {isSelf && (
                              <span className="badge badge-xs ml-2 border border-pdam-primary/25 bg-pdam-primary/10 text-pdam-primary font-bold">
                                Anda
                              </span>
                            )}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">{u.nip}</span>
                        </td>

                        <td className="py-4">
                          <span className="text-slate-600 block break-all max-w-[190px]">{u.email}</span>
                          <span className="text-slate-500 text-[11px]">{u.telp}</span>
                        </td>

                        <td className="py-4">
                          <span className={`badge badge-sm border font-semibold ${peranClass[u.peran]}`}>{u.peran}</span>
                        </td>

                        <td className="py-4">
                          <span className="text-slate-700 block">{u.unit}</span>
                          <span className="text-[11px] text-slate-400">{u.login}</span>
                        </td>

                        <td className="py-4">
                          <span
                            className={`badge badge-sm font-bold border ${
                              u.status === "Aktif"
                                ? "border-pdam-primary/30 bg-pdam-primary/10 text-pdam-primary"
                                : "border-slate-300 bg-slate-100 text-slate-500"
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>

                        <td className="py-4 pr-5">
                          <div className="flex items-center justify-end gap-1.5">
                            <IconAction tip="Edit pengguna" tone="primary" onClick={() => setFormState({ open: true, nip: u.nip })}>
                              <Pencil className="w-4 h-4" />
                            </IconAction>
                            <IconAction tip="Reset password" tone="amber" onClick={() => setResetNip(u.nip)}>
                              <KeyRound className="w-4 h-4" />
                            </IconAction>
                            <IconAction
                              tip={isSelf ? "Tidak dapat menonaktifkan akun sendiri" : u.status === "Aktif" ? "Nonaktifkan" : "Aktifkan"}
                              tone={u.status === "Aktif" ? "red" : "green"}
                              disabled={isSelf}
                              onClick={() => setToggleNip(u.nip)}
                            >
                              <Power className="w-4 h-4" />
                            </IconAction>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-slate-400">
                        Tidak ada pengguna yang sesuai dengan filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer Pagination */}
            <div className="p-4 border-t border-slate-200 bg-pdam-bg/50 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
              <span>Menampilkan 1 - {filtered.length} dari 32 pengguna sistem</span>

              <div className="join">
                <button className="join-item btn btn-sm btn-ghost btn-disabled btn-square">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="join-item btn btn-sm bg-pdam-primary text-white font-bold border-0 btn-square">1</button>
                {[2, 3, 4, 5].map((n) => (
                  <button key={n} className="join-item btn btn-sm btn-ghost hover:bg-pdam-bg btn-square">
                    {n}
                  </button>
                ))}
                <button className="join-item btn btn-sm btn-ghost hover:bg-pdam-bg btn-square">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Banner Kebijakan Keamanan */}
      <div className="card bg-pdam-primary/5 border border-pdam-primary/20 p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-pdam-primary/10 text-pdam-primary shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-pdam-navy">Kebijakan Keamanan Akun Lapangan &amp; Akses SPK</h4>
            <p className="text-xs text-slate-600 mt-1">
              Setiap penggunaan atau pemasangan water meter diwajibkan menggunakan aplikasi resmi dengan otentikasi
              NIP aktif. Akses teknis akan otomatis terkunci jika perangkat terdeteksi di luar radius wilayah kerja
              UPT yang ditentukan.
            </p>
          </div>
        </div>
      </div>

      {/* Modals (dirender sekali di luar tabel) */}
      {showExport && <ExportModal onClose={() => setShowExport(false)} allData={users} filteredData={filtered} />}
      {formState.open && (
        <UserFormModal
          key={formState.nip ?? "new"}
          editing={editingUser}
          existingNips={new Set(users.map((u) => u.nip))}
          onClose={() => setFormState({ open: false, nip: null })}
          onSave={handleSave}
        />
      )}
      {resetUser && (
        <ResetModal
          user={resetUser}
          onClose={() => setResetNip(null)}
          onDone={() => showToast(`Password ${resetUser.nama} berhasil direset.`)}
        />
      )}
      {toggleUser && (
        <ToggleModal user={toggleUser} onClose={() => setToggleNip(null)} onConfirm={() => handleToggle(toggleUser.nip)} />
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
