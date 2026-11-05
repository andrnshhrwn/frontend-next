"use client";

import {
  Download,
  UserPlus,
  Search,
  Users,
  Shield,
  ShieldCheck,
  RefreshCw,
  Building2,
  UserCog,
  Lock,
  Pencil,
  KeyRound,
  X,
  AlertCircle,
  Check,
  CheckCircle2,
  Minus,
  Loader2,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  userService,
  type User,
  type UserRole,
  type CreateUserPayload,
  type UpdateUserPayload,
} from "@/services/userService";
import { unitService, type Unit } from "@/services/unitService";
import { BaseModal } from "@/components/ui";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const roleLabels: Record<UserRole, string> = {
  admin_pusat: "Admin Pusat",
  admin_cabang: "Admin Cabang",
  teknisi: "Teknisi",
};

const roleClasses: Record<UserRole, string> = {
  admin_pusat: "border-pdam-navy/25 bg-pdam-navy/10 text-pdam-navy",
  admin_cabang: "border-pdam-primary/25 bg-pdam-primary/10 text-pdam-primary",
  teknisi: "border-amber-500/30 bg-amber-500/10 text-amber-700",
};

const labelCls = "text-[11px] font-bold text-pdam-navy uppercase mb-1 block";

const inputCls =
  "input input-bordered input-sm w-full text-xs border-slate-200 focus:border-pdam-primary";

const selectCls =
  "select select-bordered select-sm w-full text-xs border-slate-200 bg-white focus:border-pdam-primary";

const btnGhost =
  "btn btn-sm btn-ghost border border-slate-200 normal-case font-semibold text-slate-600";

const btnPrimary =
  "btn btn-sm bg-pdam-primary hover:bg-pdam-navy text-white border-0 normal-case font-semibold";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Terjadi kesalahan. Silakan coba kembali.";
}

function downloadCsv(filename: string, rows: string[][]) {
  const escapeCell = (value: string) => `"${value.replace(/"/g, '""')}"`;

  const csv = rows.map((row) => row.map(escapeCell).join(",")).join("\n");

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
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
    <BaseModal
      isOpen={true}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      maxWidth={wide ? "2xl" : "md"}
    >
      <div>
        {children}

        {footer && (
          <div className="flex justify-end gap-3 mt-6 pt-2">{footer}</div>
        )}
      </div>
    </BaseModal>
  );
}

/* ------------------------------------------------------------------ */
/* Modal: Tambah / Edit Pengguna                                       */
/* ------------------------------------------------------------------ */

function UserFormModal({
  editing,
  units,
  onClose,
  onSave,
}: {
  editing: User | null;
  units: Unit[];
  onClose: () => void;
  onSave: (
    payload: CreateUserPayload | UpdateUserPayload,
    isNew: boolean,
  ) => Promise<void>;
}) {
  const isEdit = Boolean(editing);

  const [fullname, setFullname] = useState(editing?.fullname ?? "");
  const [username, setUsername] = useState(editing?.username ?? "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(editing?.role ?? "admin_cabang");
  const [idUnit, setIdUnit] = useState(editing?.id_unit ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");

    if (!fullname.trim()) {
      setError("Nama lengkap wajib diisi.");
      return;
    }

    if (!username.trim()) {
      setError("Username wajib diisi.");
      return;
    }

    if (username.trim().length < 3) {
      setError("Username minimal 3 karakter.");
      return;
    }

    if (!isEdit && password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }

    if (role !== "admin_pusat" && !idUnit) {
      setError("Unit wajib dipilih untuk peran ini.");
      return;
    }

    const payload: CreateUserPayload | UpdateUserPayload = isEdit
      ? {
          fullname: fullname.trim(),
          username: username.trim(),
          role,
          id_unit: role === "admin_pusat" ? null : idUnit,
        }
      : {
          fullname: fullname.trim(),
          username: username.trim(),
          password,
          role,
          id_unit: role === "admin_pusat" ? null : idUnit,
        };

    try {
      setLoading(true);
      await onSave(payload, !isEdit);
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      wide
      title={isEdit ? "Edit Pengguna" : "Tambah Pengguna Baru"}
      subtitle={
        isEdit
          ? "Perbarui informasi dan hak akses pengguna."
          : "Buat akun pengguna baru pada sistem PAM Tirta Kamuning."
      }
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className={btnGhost}
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className={btnPrimary}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isEdit ? (
              <Check className="w-4 h-4" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}

            {loading
              ? "Menyimpan..."
              : isEdit
                ? "Simpan Perubahan"
                : "Tambah Pengguna"}
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className={labelCls}>Nama Lengkap</label>
          <input
            className={inputCls}
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            placeholder="Contoh: Agung Pratama"
            maxLength={100}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelCls}>Username</label>
          <input
            className={`${inputCls} font-mono`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="contoh: agung.pratama"
            maxLength={50}
          />
          <p className="text-[10px] text-slate-400 mt-1">
            Gunakan huruf, angka, titik, garis bawah, atau tanda hubung.
          </p>
        </div>

        <div>
          <label className={labelCls}>Peran</label>
          <select
            className={selectCls}
            value={role}
            onChange={(e) => {
              const nextRole = e.target.value as UserRole;
              setRole(nextRole);

              if (nextRole === "admin_pusat") {
                setIdUnit("");
              }
            }}
          >
            <option value="admin_pusat">Admin Pusat</option>
            <option value="admin_cabang">Admin Cabang</option>
            <option value="teknisi">Teknisi</option>
          </select>
        </div>

        <div>
          <label className={labelCls}>Unit</label>
          <select
            className={selectCls}
            value={idUnit}
            disabled={role === "admin_pusat"}
            onChange={(e) => setIdUnit(e.target.value)}
          >
            <option value="">
              {role === "admin_pusat" ? "Tidak menggunakan unit" : "Pilih unit"}
            </option>

            {units.map((unit) => (
              <option key={unit.id_unit} value={unit.id_unit}>
                {unit.nama_unit}
              </option>
            ))}
          </select>
        </div>

        {!isEdit && (
          <div className="sm:col-span-2">
            <label className={labelCls}>Password Awal</label>
            <input
              className={`${inputCls} font-mono`}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
              maxLength={72}
              autoComplete="new-password"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Password akan di-hash oleh backend sebelum disimpan.
            </p>
          </div>
        )}

        {error && (
          <p className="sm:col-span-2 text-xs text-pdam-red font-medium flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {error}
          </p>
        )}
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Modal: Change Password                                              */
/* ------------------------------------------------------------------ */

function ChangePasswordModal({
  user,
  onClose,
  onSave,
}: {
  user: User;
  onClose: () => void;
  onSave: (password: string) => Promise<void>;
}) {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    setError("");

    if (password.length < 8) {
      setError("Password baru minimal 8 karakter.");
      return;
    }

    if (password.length > 72) {
      setError("Password maksimal 72 karakter.");
      return;
    }

    if (password !== confirmation) {
      setError("Konfirmasi password tidak sama.");
      return;
    }

    try {
      setLoading(true);
      await onSave(password);
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Change Password"
      subtitle={`${user.fullname} • ${user.username}`}
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className={btnGhost}
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className={btnPrimary}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <KeyRound className="w-4 h-4" />
            )}
            {loading ? "Menyimpan..." : "Ubah Password"}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 flex items-start gap-3 text-xs text-amber-800">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p>
            Password akun pengguna akan diganti. Pengguna harus menggunakan
            password baru pada login berikutnya.
          </p>
        </div>

        <div>
          <label className={labelCls}>Password Baru</label>
          <input
            className={inputCls}
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimal 8 karakter"
            maxLength={72}
            autoComplete="new-password"
          />
        </div>

        <div>
          <label className={labelCls}>Konfirmasi Password Baru</label>
          <input
            className={inputCls}
            type={showPassword ? "text" : "password"}
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            placeholder="Masukkan ulang password baru"
            maxLength={72}
            autoComplete="new-password"
          />
        </div>

        <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            className="checkbox checkbox-xs checkbox-primary"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
          />
          Tampilkan password
        </label>

        {error && (
          <p className="text-xs text-pdam-red font-medium flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {error}
          </p>
        )}
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Role & Permissions                                                  */
/* ------------------------------------------------------------------ */

type Access = "all" | "unit" | "own" | "none";

const permissionRows: {
  fitur: string;
  pusat: Access;
  cabang: Access;
  teknisi: Access;
}[] = [
  {
    fitur: "Monitoring status & inventori WM",
    pusat: "all",
    cabang: "unit",
    teknisi: "none",
  },
  {
    fitur: "Kelola master data (tarif, merk WM)",
    pusat: "all",
    cabang: "none",
    teknisi: "none",
  },
  {
    fitur: "Registrasi stok WM baru",
    pusat: "none",
    cabang: "unit",
    teknisi: "none",
  },
  {
    fitur: "Buat tiket penugasan",
    pusat: "none",
    cabang: "unit",
    teknisi: "none",
  },
  {
    fitur: "Disposisi teknisi",
    pusat: "none",
    cabang: "unit",
    teknisi: "none",
  },
  {
    fitur: "Eksekusi penggantian, foto & stand meter",
    pusat: "none",
    cabang: "none",
    teknisi: "own",
  },
  {
    fitur: "Verifikasi hasil lapangan",
    pusat: "all",
    cabang: "unit",
    teknisi: "none",
  },
  {
    fitur: "Laporan pergantian",
    pusat: "all",
    cabang: "unit",
    teknisi: "none",
  },
  {
    fitur: "Kelola pengguna & hak akses",
    pusat: "all",
    cabang: "none",
    teknisi: "none",
  },
];

function AccessCell({ value }: { value: Access }) {
  if (value === "none") {
    return <Minus className="w-4 h-4 text-slate-300 mx-auto" />;
  }

  const map = {
    all: {
      label: "Penuh",
      cls: "border-pdam-navy/25 bg-pdam-navy/10 text-pdam-navy",
    },
    unit: {
      label: "Unit sendiri",
      cls: "border-pdam-primary/25 bg-pdam-primary/10 text-pdam-primary",
    },
    own: {
      label: "Tugas sendiri",
      cls: "border-amber-500/30 bg-amber-500/10 text-amber-700",
    },
  } as const;

  return (
    <span
      className={`badge badge-sm font-semibold border gap-1 ${map[value].cls}`}
    >
      <CheckCircle2 className="w-3 h-3" />
      {map[value].label}
    </span>
  );
}

function RolePermissionsView() {
  const roles = [
    {
      name: "Admin Pusat",
      scope: "Global (Pusat & seluruh cabang)",
      icon: ShieldCheck,
      cls: "bg-pdam-navy/10 text-pdam-navy",
    },
    {
      name: "Admin Cabang",
      scope: "Unit cabang terkait",
      icon: Building2,
      cls: "bg-pdam-primary/10 text-pdam-primary",
    },
    {
      name: "Teknisi",
      scope: "Hanya tugas yang ditugaskan",
      icon: UserCog,
      cls: "bg-amber-500/10 text-amber-700",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roles.map((role) => (
          <div
            key={role.name}
            className="card bg-white border border-slate-200/90 shadow-xs p-4 flex-row items-start gap-3"
          >
            <div className={`p-2 rounded-lg ${role.cls}`}>
              <role.icon className="w-5 h-5" />
            </div>

            <div>
              <p className="font-bold text-sm text-pdam-navy">{role.name}</p>
              <p className="text-[11px] text-slate-500">{role.scope}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card bg-white border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-sm w-full">
            <thead>
              <tr className="bg-pdam-bg text-pdam-navy text-[11px] uppercase tracking-wider border-b border-slate-200 font-bold">
                <th className="py-3.5 pl-5">Fitur / Hak Akses</th>
                <th className="py-3.5 text-center">Admin Pusat</th>
                <th className="py-3.5 text-center">Admin Cabang</th>
                <th className="py-3.5 text-center pr-5">Teknisi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {permissionRows.map((permission) => (
                <tr
                  key={permission.fitur}
                  className="hover:bg-pdam-bg/60 transition-colors"
                >
                  <td className="py-3.5 pl-5 font-semibold text-pdam-navy">
                    {permission.fitur}
                  </td>
                  <td className="py-3.5 text-center">
                    <AccessCell value={permission.pusat} />
                  </td>
                  <td className="py-3.5 text-center">
                    <AccessCell value={permission.cabang} />
                  </td>
                  <td className="py-3.5 text-center pr-5">
                    <AccessCell value={permission.teknisi} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-200 bg-pdam-bg/50 text-[11px] text-slate-500">
          Matriks ini merupakan gambaran hak akses aplikasi. Pembatasan akses
          sebenarnya tetap diterapkan oleh backend melalui autentikasi dan
          otorisasi.
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tombol aksi                                                         */
/* ------------------------------------------------------------------ */

function IconAction({
  tip,
  onClick,
  tone,
  children,
}: {
  tip: string;
  onClick: () => void;
  tone: "primary" | "amber";
  children: ReactNode;
}) {
  const tones = {
    primary:
      "bg-pdam-primary/10 text-pdam-primary hover:bg-pdam-primary hover:text-white",
    amber: "bg-amber-500/10 text-amber-700 hover:bg-amber-500 hover:text-white",
  };

  return (
    <div className="tooltip tooltip-left" data-tip={tip}>
      <button
        type="button"
        onClick={onClick}
        aria-label={tip}
        className={`btn btn-sm btn-square border-0 shadow-none transition-colors ${tones[tone]}`}
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
  const [users, setUsers] = useState<User[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pageError, setPageError] = useState("");

  const [activeTab, setActiveTab] = useState<"user" | "role">("user");
  const [roleFilter, setRoleFilter] = useState("all");
  const [unitFilter, setUnitFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [passwordUser, setPasswordUser] = useState<User | null>(null);

  const [toast, setToast] = useState<string | null>(null);

  const loadData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setPageError("");

      const [userData, unitData] = await Promise.all([
        userService.findAll(),
        unitService.findAll(),
      ]);

      setUsers(userData);
      setUnits(unitData);
    } catch (error) {
      setPageError(getErrorMessage(error));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3000);
  };

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      const matchesUnit = unitFilter === "all" || user.id_unit === unitFilter;

      const matchesSearch =
        !query ||
        user.fullname.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query) ||
        roleLabels[user.role].toLowerCase().includes(query) ||
        (user.unit?.nama_unit ?? "").toLowerCase().includes(query);

      return matchesRole && matchesUnit && matchesSearch;
    });
  }, [users, roleFilter, unitFilter, search]);

  const roleCounts = useMemo(
    () => ({
      admin_pusat: users.filter((user) => user.role === "admin_pusat").length,
      admin_cabang: users.filter((user) => user.role === "admin_cabang").length,
      teknisi: users.filter((user) => user.role === "teknisi").length,
    }),
    [users],
  );

  const handleSaveUser = async (
    payload: CreateUserPayload | UpdateUserPayload,
    isNew: boolean,
  ) => {
    if (isNew) {
      await userService.create(payload as CreateUserPayload);
      showToast("Pengguna berhasil ditambahkan.");
    } else if (editingUser) {
      await userService.update(
        editingUser.id_user,
        payload as UpdateUserPayload,
      );
      showToast("Data pengguna berhasil diperbarui.");
    }

    await loadData(true);
  };

  const handleChangePassword = async (password: string) => {
    if (!passwordUser) return;

    await userService.update(passwordUser.id_user, { password });

    showToast(`Password ${passwordUser.fullname} berhasil diubah.`);

    setPasswordUser(null);
  };

  const handleExport = () => {
    const rows = [
      ["Nama Lengkap", "Username", "Peran", "Unit"],
      ...filteredUsers.map((user) => [
        user.fullname,
        user.username,
        roleLabels[user.role],
        user.unit?.nama_unit ?? "-",
      ]),
    ];

    const date = new Date().toISOString().slice(0, 10);

    downloadCsv(`data-pengguna-${date}.csv`, rows);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs text-slate-500 mb-1">
          <span className="font-semibold text-pdam-primary">
            PAM Tirta Kamuning
          </span>{" "}
          / Master Data /{" "}
          <span className="text-pdam-primary font-semibold">
            Data Pengguna & Hak Akses
          </span>
        </p>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-pdam-navy">
              Pengaturan Pengguna & Hak Akses
            </h1>

            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Kelola akun Admin Pusat, Admin Cabang, dan Teknisi berdasarkan
              pembagian hak akses sistem.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExport}
              disabled={filteredUsers.length === 0}
              className="btn btn-sm btn-ghost bg-white hover:bg-pdam-bg border border-slate-200 text-pdam-navy font-semibold normal-case shadow-xs"
            >
              <Download className="w-4 h-4 text-pdam-primary" />
              Export CSV
            </button>

            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="btn btn-sm bg-pdam-primary hover:bg-pdam-navy text-white font-semibold normal-case border-0 shadow-xs"
            >
              <UserPlus className="w-4 h-4" />
              Tambah Pengguna
            </button>
          </div>
        </div>
      </div>

      {/* Tab */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-pdam-primary/5 border border-pdam-primary/15">
          <button
            type="button"
            onClick={() => setActiveTab("user")}
            className={`btn btn-sm normal-case font-semibold border-0 gap-2 ${
              activeTab === "user"
                ? "bg-white text-pdam-primary shadow-xs"
                : "bg-transparent text-slate-600 hover:bg-white/60"
            }`}
          >
            <Users className="w-4 h-4" />
            Manajemen Pengguna
            <span className="badge badge-xs border border-pdam-primary/25 bg-pdam-primary/10 text-pdam-primary font-bold">
              {users.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("role")}
            className={`btn btn-sm normal-case font-semibold border-0 gap-2 ${
              activeTab === "role"
                ? "bg-white text-pdam-primary shadow-xs"
                : "bg-transparent text-slate-600 hover:bg-white/60"
            }`}
          >
            <Shield className="w-4 h-4" />
            Role & Permissions
            <span className="badge badge-xs border border-pdam-primary/25 bg-pdam-primary/10 text-pdam-primary font-bold">
              3 Peran
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => void loadData(true)}
          disabled={refreshing}
          className="btn btn-sm btn-ghost text-xs normal-case text-slate-500"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? "Memuat..." : "Refresh data"}
        </button>
      </div>

      {/* Statistik dari API */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-white border border-slate-200/90 shadow-xs p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              TOTAL PENGGUNA
            </p>
            <Users className="w-4 h-4 text-pdam-primary" />
          </div>
          <span className="text-2xl font-black text-pdam-navy tabular-nums">
            {users.length}
          </span>
          <p className="text-xs text-slate-500 mt-1">Akun terdaftar</p>
        </div>

        <div className="card bg-white border border-slate-200/90 shadow-xs p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              ADMIN PUSAT
            </p>
            <ShieldCheck className="w-4 h-4 text-pdam-navy" />
          </div>
          <span className="text-2xl font-black text-pdam-navy tabular-nums">
            {roleCounts.admin_pusat}
          </span>
          <p className="text-xs text-slate-500 mt-1">Akses global</p>
        </div>

        <div className="card bg-white border border-slate-200/90 shadow-xs p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              ADMIN CABANG
            </p>
            <Building2 className="w-4 h-4 text-pdam-primary" />
          </div>
          <span className="text-2xl font-black text-pdam-navy tabular-nums">
            {roleCounts.admin_cabang}
          </span>
          <p className="text-xs text-slate-500 mt-1">
            Akses unit masing-masing
          </p>
        </div>

        <div className="card bg-white border border-slate-200/90 shadow-xs p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              TEKNISI
            </p>
            <UserCog className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl font-black text-pdam-navy tabular-nums">
            {roleCounts.teknisi}
          </span>
          <p className="text-xs text-slate-500 mt-1">Pengguna lapangan</p>
        </div>
      </div>

      {/* Error */}
      {pageError && (
        <div className="alert alert-error text-sm">
          <AlertCircle className="w-5 h-5" />
          <div>
            <p className="font-bold">Gagal memuat data pengguna</p>
            <p className="text-xs">{pageError}</p>
          </div>
          <button
            type="button"
            onClick={() => void loadData()}
            className="btn btn-sm"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {activeTab === "role" ? (
        <RolePermissionsView />
      ) : (
        <>
          {/* Filter dan pencarian */}
          <div className="card bg-white border border-slate-200/90 shadow-xs p-4">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { label: "Semua Peran", value: "all" },
                  { label: "Admin Pusat", value: "admin_pusat" },
                  { label: "Admin Cabang", value: "admin_cabang" },
                  { label: "Teknisi", value: "teknisi" },
                ].map((filter) => (
                  <button
                    type="button"
                    key={filter.value}
                    onClick={() => setRoleFilter(filter.value)}
                    className={`btn btn-xs normal-case font-semibold ${
                      roleFilter === filter.value
                        ? "bg-pdam-primary hover:bg-pdam-navy text-white border-0"
                        : "btn-ghost bg-pdam-bg border border-slate-200/80 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <select
                  value={unitFilter}
                  onChange={(e) => setUnitFilter(e.target.value)}
                  className="select select-bordered select-sm text-xs font-medium border-slate-200 bg-white"
                >
                  <option value="all">Semua Unit</option>
                  {units.map((unit) => (
                    <option key={unit.id_unit} value={unit.id_unit}>
                      {unit.nama_unit}
                    </option>
                  ))}
                </select>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari nama atau username..."
                    className="input input-bordered input-sm w-full sm:w-64 pl-9 text-xs bg-pdam-bg/50 border-slate-200 focus:border-pdam-primary focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tabel */}
          <div className="card bg-white border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table table-sm w-full">
                <thead>
                  <tr className="bg-pdam-bg text-pdam-navy text-[11px] uppercase tracking-wider border-b border-slate-200 font-bold">
                    <th className="py-3.5 pl-5">Nama Pengguna</th>
                    <th className="py-3.5">Username</th>
                    <th className="py-3.5">Peran</th>
                    <th className="py-3.5">Unit</th>
                    <th className="py-3.5 text-right pr-5">Aksi</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-xs">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-pdam-primary" />
                        <p className="text-slate-500 mt-2">
                          Memuat data pengguna...
                        </p>
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-12 text-center text-slate-400"
                      >
                        Tidak ada pengguna yang sesuai dengan filter.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr
                        key={user.id_user}
                        className="hover:bg-pdam-bg/60 transition-colors"
                      >
                        <td className="py-4 pl-5">
                          <span className="font-bold text-pdam-navy block">
                            {user.fullname}
                          </span>
                        </td>

                        <td className="py-4">
                          <span className="font-mono text-slate-600">
                            {user.username}
                          </span>
                        </td>

                        <td className="py-4">
                          <span
                            className={`badge badge-sm border font-semibold ${roleClasses[user.role]}`}
                          >
                            {roleLabels[user.role]}
                          </span>
                        </td>

                        <td className="py-4">
                          <span className="text-slate-700">
                            {user.unit?.nama_unit ?? (
                              <span className="text-slate-400 italic">
                                Tidak terikat unit
                              </span>
                            )}
                          </span>
                        </td>

                        <td className="py-4 pr-5">
                          <div className="flex items-center justify-end gap-1.5">
                            <IconAction
                              tip="Edit pengguna"
                              tone="primary"
                              onClick={() => setEditingUser(user)}
                            >
                              <Pencil className="w-4 h-4" />
                            </IconAction>

                            <IconAction
                              tip="Change Password"
                              tone="amber"
                              onClick={() => setPasswordUser(user)}
                            >
                              <KeyRound className="w-4 h-4" />
                            </IconAction>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-200 bg-pdam-bg/50 flex justify-between items-center gap-3 text-xs text-slate-500">
              <span>
                Menampilkan {filteredUsers.length} dari {users.length} pengguna
              </span>
              <span>Data berasal dari backend</span>
            </div>
          </div>
        </>
      )}

      {/* Kebijakan keamanan */}
      <div className="card bg-pdam-primary/5 border border-pdam-primary/20 p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-pdam-primary/10 text-pdam-primary shrink-0">
            <Lock className="w-4 h-4" />
          </div>

          <div>
            <h4 className="font-bold text-xs text-pdam-navy">
              Kebijakan Keamanan Akun
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              Pengelolaan pengguna dibatasi berdasarkan peran. Admin Pusat
              mengelola seluruh akun, sedangkan Admin Cabang hanya dapat
              mengambil daftar teknisi pada unitnya melalui endpoint khusus
              backend.
            </p>
          </div>
        </div>
      </div>

      {/* Modal tambah */}
      {showCreate && (
        <UserFormModal
          key="create-user"
          editing={null}
          units={units}
          onClose={() => setShowCreate(false)}
          onSave={handleSaveUser}
        />
      )}

      {/* Modal edit */}
      {editingUser && (
        <UserFormModal
          key={editingUser.id_user}
          editing={editingUser}
          units={units}
          onClose={() => setEditingUser(null)}
          onSave={handleSaveUser}
        />
      )}

      {/* Modal change password */}
      {passwordUser && (
        <ChangePasswordModal
          user={passwordUser}
          onClose={() => setPasswordUser(null)}
          onSave={handleChangePassword}
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
