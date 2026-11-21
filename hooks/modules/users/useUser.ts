"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  userService,
  type CreateUserPayload,
  type CreateTeknisiPayload,
  type UpdateUserPayload,
} from "@/services/userService";

import { unitService } from "@/services/unitService";
import { useAuthStore } from "@/lib/auth/auth-store";
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

  // Autentikasi dari Zustand.
  const user = useAuthStore((state) => state.user);
  const authStatus = useAuthStore((state) => state.status);

  const authLoading = authStatus === "idle" || authStatus === "checking";

  const isAuthenticated = authStatus === "authenticated";

  const isAdminPusat = isAuthenticated && user?.role === "admin_pusat";

  const isAdminCabang = isAuthenticated && user?.role === "admin_cabang";

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

  // Mencegah request lama menimpa data dari sesi terbaru.
  const requestIdRef = useRef(0);

  const clearData = useCallback(() => {
    setUsers([]);
    setUnits([]);
  }, []);

  const loadData = useCallback(
    async (isRefresh = false) => {
      // Jangan mengambil data sebelum autentikasi selesai.
      if (authLoading) return;

      const requestId = ++requestIdRef.current;

      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
          clearData();
        }

        setPageError("");

        if (authStatus === "error") {
          clearData();
          setPageError(
            "Sesi pengguna tidak dapat diverifikasi. Periksa koneksi atau coba kembali.",
          );
          return;
        }

        if (!isAuthenticated) {
          clearData();
          setPageError("Sesi pengguna tidak ditemukan. Silakan login kembali.");
          return;
        }

        if (isAdminPusat) {
          const [userData, unitData] = await Promise.all([
            userService.findAll(),
            unitService.findAll(),
          ]);

          if (requestId !== requestIdRef.current) return;

          setUsers(userData);
          setUnits(unitData);
        } else if (isAdminCabang) {
          const technicianData = await userService.findTeknisi();

          if (requestId !== requestIdRef.current) return;

          setUsers(technicianData);
          setUnits([]);
        } else {
          clearData();
          setPageError("Kamu tidak memiliki akses untuk mengelola pengguna.");
        }
      } catch (error: unknown) {
        if (requestId !== requestIdRef.current) return;

        clearData();
        setPageError(getErrorMessage(error));
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [
      authLoading,
      authStatus,
      isAuthenticated,
      isAdminPusat,
      isAdminCabang,
      clearData,
    ],
  );

  // Ambil data setelah autentikasi selesai diverifikasi.
  useEffect(() => {
    if (authLoading) return;

    void loadData();
  }, [authLoading, loadData]);

  // Batalkan validitas request sebelumnya ketika identitas sesi berubah.
  useEffect(() => {
    return () => {
      requestIdRef.current += 1;
    };
  }, [user?.id_user, authStatus]);

  // Filter pengguna.
  const filteredUsers = useMemo(
    () => filterUsers(users, roleFilter, unitFilter, search),
    [users, roleFilter, unitFilter, search],
  );

  // Statistik berdasarkan role.
  const roleCounts = useMemo(() => countUserRoles(users), [users]);

  // Membuat atau memperbarui pengguna.
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

  // Mengubah password pengguna lain.
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

  // Ekspor data pengguna ke CSV.
  const handleExport = () => {
    if (!isAuthenticated || (!isAdminPusat && !isAdminCabang)) {
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
