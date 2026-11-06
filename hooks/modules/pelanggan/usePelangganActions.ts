import { useState } from "react";

import { pelangganService } from "@/services/pelangganService";

import type { Pelanggan, PelangganInput } from "@/types/pelanggan.types";

import { mapPelangganPayload } from "@/utils/pelanggan.utils";

interface UsePelangganActionsOptions {
  editingCustomer: Pelanggan | null;
  loadData: () => Promise<void>;
  closeForm: () => void;
  resetPage: () => void;
  showToast: (
    message: string,
    type?: "success" | "error" | "warning" | "info",
    duration?: number,
  ) => void;
}

export function usePelangganActions({
  editingCustomer,
  loadData,
  closeForm,
  resetPage,
  showToast,
}: UsePelangganActionsOptions) {
  const [deleting, setDeleting] = useState(false);

  const saveCustomer = async (data: PelangganInput) => {
    const payload = mapPelangganPayload(data);

    if (editingCustomer) {
      await pelangganService.update(editingCustomer.id, payload);

      showToast(`Data ${data.nama} berhasil diperbarui.`, "success");
    } else {
      await pelangganService.create(payload);

      showToast(`Pelanggan ${data.nama} berhasil ditambahkan.`, "success");
    }

    closeForm();
    resetPage();

    await loadData();
  };

  const deleteCustomer = async (
    deleteTarget: Pelanggan | null,
    onSuccess: () => void,
  ) => {
    if (!deleteTarget) return;

    setDeleting(true);

    try {
      await pelangganService.delete(deleteTarget.id);

      showToast(`Pelanggan ${deleteTarget.nama} berhasil dihapus.`, "success");

      onSuccess();

      await loadData();
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Gagal menghapus data pelanggan.",
        "error",
      );
    } finally {
      setDeleting(false);
    }
  };

  return {
    deleting,
    saveCustomer,
    deleteCustomer,
  };
}
