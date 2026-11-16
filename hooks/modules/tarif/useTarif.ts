"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { tipeTarifService } from "@/services/tipeTarifService";
import { useToast } from "@/components/ui";

import type { Tarif, TarifForm, TarifExportOptions } from "@/types/tarif.types";

import {
  ITEMS_PER_PAGE,
  initialForm,
  validateTarifForm,
  buildTarifCSV,
} from "@/utils/tarif.utils";

import { paginate } from "@/utils/pagination.utils";

export function useTarif() {
  const { showToast } = useToast();

  const [data, setData] = useState<Tarif[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const [editing, setEditing] = useState<Tarif | null>(null);
  const [deletingTarif, setDeletingTarif] = useState<Tarif | null>(null);
  const [form, setForm] = useState<TarifForm>(initialForm);
  const [formError, setFormError] = useState("");

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Mengambil seluruh data tarif dari backend.
  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await tipeTarifService.findAll();
      setData(result);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengambil data golongan tarif.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  // Pencarian berdasarkan kode, UUID, dan nama tarif.
  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return data;

    return data.filter(
      (item) =>
        item.id_tarif.toLowerCase().includes(keyword) ||
        item.kode_tarif.toLowerCase().includes(keyword) ||
        item.nama_tarif.toLowerCase().includes(keyword),
    );
  }, [data, search]);

  // Pagination menggunakan utility bersama.
  const pagination = useMemo(
    () => paginate(filtered, currentPage, ITEMS_PER_PAGE),
    [filtered, currentPage],
  );

  const {
    paginatedData: paginated,
    totalPages,
    safeCurrentPage: safePage,
    startIndex,
    endIndex,
  } = pagination;

  // Menyesuaikan halaman aktif jika jumlah data berkurang.
  useEffect(() => {
    if (currentPage !== safePage) {
      setCurrentPage(safePage);
    }
  }, [currentPage, safePage]);

  // Statistik.
  const totalPelanggan = data.reduce(
    (total, item) => total + item.jumlahPelanggan,
    0,
  );

  const totalTarifDigunakan = data.filter(
    (item) => item.jumlahPelanggan > 0,
  ).length;

  // Membuka modal tambah.
  const openAdd = () => {
    setEditing(null);
    setForm(initialForm);
    setFormError("");
    setModalOpen(true);
  };

  // Membuka modal edit.
  const openEdit = (tarif: Tarif) => {
    setEditing(tarif);

    setForm({
      kode_tarif: tarif.kode_tarif,
      nama_tarif: tarif.nama_tarif,
    });

    setFormError("");
    setModalOpen(true);
  };

  // Validasi dan simpan data.
  const handleSave = async () => {
    const validation = validateTarifForm(form, data, editing?.id_tarif);

    if (!validation.payload) {
      setFormError(validation.error);
      return;
    }

    const payload = validation.payload;

    setSaving(true);
    setFormError("");

    try {
      if (editing) {
        await tipeTarifService.update(editing.id_tarif, payload);
        showToast("Golongan tarif berhasil diperbarui.", "success");
      } else {
        await tipeTarifService.create(payload);
        showToast("Golongan tarif berhasil ditambahkan.", "success");
      }

      await loadData();

      setCurrentPage(1);
      setModalOpen(false);
      setEditing(null);
      setForm(initialForm);
      setFormError("");
    } catch (err: unknown) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan data golongan tarif.",
      );
    } finally {
      setSaving(false);
    }
  };

  // Membuka modal hapus.
  const openDelete = (tarif: Tarif) => {
    setDeletingTarif(tarif);
    setDeleteModalOpen(true);
  };

  // Menghapus data berdasarkan UUID.
  const confirmDelete = async () => {
    if (!deletingTarif || deleting) return;

    const targetId = deletingTarif.id_tarif;

    setDeleting(true);
    setError("");

    try {
      await tipeTarifService.delete(targetId);

      setData((current) =>
        current.filter((item) => item.id_tarif !== targetId),
      );

      setDeleteModalOpen(false);
      setDeletingTarif(null);

      showToast("Golongan tarif berhasil dihapus.", "success");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menghapus data golongan tarif.",
      );
    } finally {
      setDeleting(false);
    }
  };

  // Ekspor CSV.
  const exportCSV = ({ scope, selectedCols }: TarifExportOptions) => {
    const sourceData = scope === "filtered" ? filtered : data;
    const csv = buildTarifCSV(sourceData, selectedCols);

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "data-golongan-tarif.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
    setExportModalOpen(false);

    showToast("Data golongan tarif berhasil diekspor.", "success");
  };

  return {
    data,
    loading,
    error,
    setError,
    search,
    setSearch,

    modalOpen,
    setModalOpen,
    deleteModalOpen,
    setDeleteModalOpen,
    exportModalOpen,
    setExportModalOpen,

    editing,
    deletingTarif,
    setDeletingTarif,
    form,
    setForm,
    formError,
    setFormError,

    saving,
    deleting,
    currentPage,
    setCurrentPage,

    filtered,
    totalPages,
    safePage,
    paginated,
    startIndex,
    endIndex,
    totalPelanggan,
    totalTarifDigunakan,

    loadData,
    openAdd,
    openEdit,
    handleSave,
    openDelete,
    confirmDelete,
    exportCSV,
  };
}
