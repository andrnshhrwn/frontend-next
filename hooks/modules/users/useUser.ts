import { useCallback, useEffect, useMemo, useState } from "react";
import {
  userService,
  type CreateUserPayload,
  type CreateTeknisiPayload,
  type UpdateUserPayload,
} from "@/services/userService";
import { unitService } from "@/services/unitService";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/ui";
import type {
  User,
  Unit,
  UserTab,
  RoleFilter,
  UserSavePayload,
} from "@/types/user.types";
import {
  buildUserCsvRows,
  countUserRoles,
  filterUsers,
  getErrorMessage,
} from "@/utils/user.utils";

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

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function useUser() {
  const { showToast } = useToast();

  const { hasRole, loading: authLoading, isAuthenticated } = useAuth();

  const isAdminPusat = hasRole("admin_pusat");
  const isAdminCabang = hasRole("admin_cabang");

  const [users, setUsers] = useState<User[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pageError, setPageError] = useState("");

  const [activeTab, setActiveTab] = useState<UserTab>("user");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [unitFilter, setUnitFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [passwordUser, setPasswordUser] = useState<User | null>(null);

  const loadData = useCallback(
    async (isRefresh = false) => {
      // Tunggu sampai AuthProvider selesai memeriksa sesi.
      if (authLoading) return;

      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);

          // Bersihkan data lama ketika memuat ulang sesi atau role.
          setUsers([]);
          setUnits([]);
        }

        setPageError("");

        if (!isAuthenticated) {
          setUsers([]);
          setUnits([]);
          setPageError("Sesi pengguna tidak ditemukan. Silakan login kembali.");
          return;
        }

        if (isAdminPusat) {
          const [userData, unitData] = await Promise.all([
            userService.findAll(),
            unitService.findAll(),
          ]);

          setUsers(userData);
          setUnits(unitData);
        } else if (isAdminCabang) {
          const technicianData = await userService.findTeknisi();

          setUsers(technicianData);
          setUnits([]);
        } else {
          setUsers([]);
          setUnits([]);
          setPageError("Kamu tidak memiliki akses untuk mengelola pengguna.");
        }
      } catch (error) {
        setPageError(getErrorMessage(error));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [authLoading, isAuthenticated, isAdminPusat, isAdminCabang],
  );

  useEffect(() => {
    if (!authLoading) {
      void loadData();
    }
  }, [authLoading, loadData]);

  const filteredUsers = useMemo(
    () => filterUsers(users, roleFilter, unitFilter, search),
    [users, roleFilter, unitFilter, search],
  );

  const roleCounts = useMemo(() => countUserRoles(users), [users]);

  const handleSaveUser = async (payload: UserSavePayload, isNew: boolean) => {
    if (authLoading || !isAuthenticated) {
      throw new Error("Sesi pengguna tidak valid. Silakan login kembali.");
    }

    if (isNew) {
      if (isAdminPusat) {
        await userService.create(payload as CreateUserPayload);
      } else if (isAdminCabang) {
        const technicianPayload: CreateTeknisiPayload = {
          fullname: payload.fullname ?? "",
          username: payload.username ?? "",
          password: payload.password ?? "",
        };

        if (
          !technicianPayload.fullname.trim() ||
          !technicianPayload.username.trim() ||
          !technicianPayload.password
        ) {
          throw new Error("Nama lengkap, username, dan password wajib diisi.");
        }

        await userService.createTeknisi(technicianPayload);
      } else {
        throw new Error("Kamu tidak memiliki akses untuk membuat pengguna.");
      }

      showToast("Pengguna berhasil ditambahkan.", "success");
    } else if (editingUser && isAdminPusat) {
      await userService.update(
        editingUser.id_user,
        payload as UpdateUserPayload,
      );

      showToast("Data pengguna berhasil diperbarui.", "success");
    } else {
      throw new Error("Kamu tidak memiliki akses untuk mengubah pengguna.");
    }

    await loadData(true);
  };

  const handleChangePassword = async (password: string) => {
    if (authLoading || !isAuthenticated || !isAdminPusat) {
      throw new Error(
        "Kamu tidak memiliki akses untuk mengubah password pengguna lain.",
      );
    }

    if (!passwordUser) return;

    await userService.update(passwordUser.id_user, { password });

    showToast(`Password ${passwordUser.fullname} berhasil diubah.`, "success");

    setPasswordUser(null);
  };

  const handleExport = () => {
    if (!isAdminPusat && !isAdminCabang) {
      showToast("Kamu tidak memiliki akses untuk mengekspor data.", "error");
      return;
    }

    const rows = buildUserCsvRows(filteredUsers);
    const date = new Date().toISOString().slice(0, 10);

    downloadCsv(`data-pengguna-${date}.csv`, rows);

    showToast("Data pengguna berhasil diekspor.", "success");
  };

  return {
    users,
    units,
    loading,
    refreshing,
    pageError,
    activeTab,
    roleFilter,
    unitFilter,
    search,
    editingUser,
    showCreate,
    passwordUser,
    filteredUsers,
    roleCounts,

    isAdminPusat,
    isAdminCabang,

    setActiveTab,
    setRoleFilter,
    setUnitFilter,
    setSearch,
    setEditingUser,
    setShowCreate,
    setPasswordUser,

    loadData,
    handleSaveUser,
    handleChangePassword,
    handleExport,
  };
}
