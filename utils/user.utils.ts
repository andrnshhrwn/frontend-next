import type {
  User,
  UserRole,
  UserRoleCounts,
  PermissionRow,
  RoleFilter,
} from "../types/user.types";

export const roleLabels: Record<UserRole, string> = {
  admin_pusat: "Admin Pusat",
  admin_cabang: "Admin Cabang",
  teknisi: "Teknisi",
};

export const roleClasses: Record<UserRole, string> = {
  admin_pusat: "border-pdam-navy/25 bg-pdam-navy/10 text-pdam-navy",
  admin_cabang: "border-pdam-primary/25 bg-pdam-primary/10 text-pdam-primary",
  teknisi: "border-amber-500/30 bg-amber-500/10 text-amber-700",
};

export const labelCls =
  "text-[11px] font-bold text-pdam-navy uppercase mb-1 block";

export const inputCls =
  "input input-bordered input-sm w-full text-xs border-slate-200 focus:border-pdam-primary";

export const selectCls =
  "select select-bordered select-sm w-full text-xs border-slate-200 bg-white focus:border-pdam-primary";

export const btnGhost =
  "btn btn-sm btn-ghost border border-slate-200 normal-case font-semibold text-slate-600";

export const btnPrimary =
  "btn btn-sm bg-pdam-primary hover:bg-pdam-navy text-white border-0 normal-case font-semibold";

export const roleFilters: {
  label: string;
  value: RoleFilter;
}[] = [
  { label: "Semua Peran", value: "all" },
  { label: "Admin Pusat", value: "admin_pusat" },
  { label: "Admin Cabang", value: "admin_cabang" },
  { label: "Teknisi", value: "teknisi" },
];

export const permissionRows: PermissionRow[] = [
  {
    fitur: "Monitoring status & inventori WM",
    pusat: "all",
    cabang: "none",
    teknisi: "none",
  },
  {
    fitur: "Kelola master data (unit, tarif, merk WM)",
    pusat: "all",
    cabang: "none",
    teknisi: "none",
  },
  {
    fitur: "Registrasi stok WM baru",
    pusat: "all",
    cabang: "none",
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
    cabang: "none",
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

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;

  return "Terjadi kesalahan. Silakan coba kembali.";
}

export function filterUsers(
  users: User[],
  roleFilter: RoleFilter,
  unitFilter: string,
  search: string,
): User[] {
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
}

export function countUserRoles(users: User[]): UserRoleCounts {
  return {
    admin_pusat: users.filter((user) => user.role === "admin_pusat").length,
    admin_cabang: users.filter((user) => user.role === "admin_cabang").length,
    teknisi: users.filter((user) => user.role === "teknisi").length,
  };
}

export function buildUserCsvRows(users: User[]): string[][] {
  return [
    ["Nama Lengkap", "Username", "Peran", "Unit"],
    ...users.map((user) => [
      user.fullname,
      user.username,
      roleLabels[user.role],
      user.unit?.nama_unit ?? "-",
    ]),
  ];
}
