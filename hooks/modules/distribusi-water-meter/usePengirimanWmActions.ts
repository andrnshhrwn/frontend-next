"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import {
  pengirimanWmService,
  type CreatePengirimanWmPayload,
  type UpdatePengirimanWmPayload,
  type PengirimanWm,
} from "@/services/pengirimanService";

import type {
  UsePengirimanWmActionsOptions,
  SubmitPengirimanOptions,
  PengirimanWmExportOptions,
} from "@/types/pengirimanWm.types";

import { EXPORT_COLUMNS, getErrorMessage } from "@/utils/pengirimanWm.utils";
import { useToast } from "@/components/ui";

export function usePengirimanWmActions({
  fetchData,
  closeFormModal,
}: UsePengirimanWmActionsOptions) {
  const { showToast } = useToast();

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const submitPengiriman = async (
    event: FormEvent<HTMLFormElement>,
    form: SubmitPengirimanOptions,
  ) => {
    event.preventDefault();
    setErrorMessage("");

    if (!form.unitTujuan) {
      setErrorMessage("Silakan pilih unit tujuan.");
      return;
    }

    if (form.details.length === 0) {
      setErrorMessage("Minimal harus ada satu rincian WM.");
      return;
    }

    const invalidDetail = form.details.some(
      (item) =>
        !item.id_merk ||
        !item.ukuran_dn.trim() ||
        !Number.isInteger(Number(item.jumlah)) ||
        Number(item.jumlah) <= 0,
    );

    if (invalidDetail) {
      setErrorMessage(
        "Pastikan merk, ukuran DN, dan jumlah WM sudah diisi dengan benar.",
      );
      return;
    }

    const details = form.details.map((item) => ({
      id_merk: item.id_merk,
      ukuran_dn: item.ukuran_dn.trim(),
      jumlah: Number(item.jumlah),
    }));

    const payload: CreatePengirimanWmPayload = {
      no_pengiriman: form.noPengiriman.trim(),
      tgl_pengiriman: form.tglPengiriman,
      id_unit_tujuan: form.unitTujuan,
      catatan: form.catatan.trim() || null,
      details,
    };

    setIsSaving(true);

    try {
      if (form.editingPengiriman) {
        const updatePayload: UpdatePengirimanWmPayload = payload;

        await pengirimanWmService.update(
          form.editingPengiriman.id_pengiriman,
          updatePayload,
        );

        showToast("Catatan pengiriman WM berhasil diperbarui.", "success");
      } else {
        await pengirimanWmService.create(payload);

        showToast("Catatan pengiriman WM berhasil disimpan.", "success");
      }

      closeFormModal();
      await fetchData();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const deletePengiriman = async (id: string): Promise<boolean> => {
    try {
      await pengirimanWmService.delete(id);

      showToast("Catatan pengiriman WM berhasil dihapus.", "success");

      await fetchData();

      return true;
    } catch (error) {
      showToast(getErrorMessage(error), "error");
      return false;
    }
  };

  const exportPengiriman = (
    options: PengirimanWmExportOptions,
    filteredPengiriman: PengirimanWm[],
    pengirimanList: PengirimanWm[],
  ) => {
    const target =
      options.scope === "filtered" ? filteredPengiriman : pengirimanList;

    const header = options.selectedCols
      .map(
        (column) =>
          EXPORT_COLUMNS.find((item) => item.id === column)?.label ?? column,
      )
      .join(",");

    const rows = target.map((item) =>
      options.selectedCols
        .map((column) => {
          let value: string | number = "";

          switch (column) {
            case "noPengiriman":
              value = item.no_pengiriman;
              break;
            case "tglPengiriman":
              value = item.tgl_pengiriman;
              break;
            case "unitTujuan":
              value = item.unit_tujuan?.nama_unit ?? "";
              break;
            case "totalWm":
              value = item.total_wm;
              break;
            case "catatan":
              value = item.catatan ?? "";
              break;
          }

          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(","),
    );

    const csvContent = [header, ...rows].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `catatan-pengiriman-wm-${Date.now()}.csv`;
    anchor.click();

    URL.revokeObjectURL(url);

    showToast("Data pengiriman WM berhasil diekspor.", "success");
  };

  const clearError = () => {
    setErrorMessage("");
  };

  return {
    isSaving,
    errorMessage,
    clearError,
    submitPengiriman,
    deletePengiriman,
    exportPengiriman,
  };
}
