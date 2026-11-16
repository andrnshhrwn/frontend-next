"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useToast } from "@/components/ui";
import { unitService } from "@/services/unitService";

import type { Unit, UnitForm } from "@/types/unit.types";

import {
  EMPTY_FORM,
  ITEMS_PER_PAGE,
  filterAndSortUnits,
  validateUnitForm,
} from "@/utils/unit.utils";

import { paginate } from "@/utils/pagination.utils";

export function useUnit() {
  const { showToast } = useToast();

  const [data, setData] = useState<Unit[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingInProgress, setDeletingInProgress] = useState(false);

  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Unit | null>(null);
  const [deletingUnit, setDeletingUnit] = useState<Unit | null>(null);

  const [form, setForm] = useState<UnitForm>(EMPTY_FORM);

  // Mengambil seluruh data Unit dari backend.
  const loadUnits = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const units = await unitService.findAll();
      setData(units);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal memuat data Unit.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUnits();
  }, [loadUnits]);

  // Pengurutan dan pencarian.
  const filtered = useMemo(
    () => filterAndSortUnits(data, search),
    [data, search],
  );

  // Pagination menggunakan utilitas bersama.
  const pagination = useMemo(
    () => paginate(filtered, currentPage, ITEMS_PER_PAGE),
    [filtered, currentPage],
  );

  const {
    paginatedData: paginated,
    totalItems,
    totalPages,
    safeCurrentPage: safePage,
    startIndex,
    endIndex,
  } = pagination;

  // Sinkronisasi halaman ketika jumlah data berubah.
  useEffect(() => {
    if (currentPage !== safePage) {
      setCurrentPage(safePage);
    }
  }, [currentPage, safePage]);

  // Membuka modal tambah.
  function openAdd() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setModalOpen(true);
  }

  // Membuka modal edit.
  function openEdit(unit: Unit) {
    setEditing(unit);

    setForm({
      kode_unit: unit.kode_unit,
      nama_unit: unit.nama_unit,
    });

    setFormError("");
    setModalOpen(true);
  }

  // Menutup modal form.
  function closeFormModal() {
    if (saving) return;

    setModalOpen(false);
    setFormError("");
  }

  // Validasi dan simpan data.
  async function handleSave() {
    const validation = validateUnitForm(form);

    if (!validation.payload) {
      setFormError(validation.error);
      return;
    }

    const payload = validation.payload;

    setSaving(true);
    setFormError("");

    try {
      if (editing) {
        await unitService.update(editing.id_unit, payload);
        showToast("Data Unit berhasil diperbarui.", "success");
      } else {
        await unitService.create(payload);
        showToast("Data Unit berhasil ditambahkan.", "success");
      }

      setModalOpen(false);
      setEditing(null);
      setForm(EMPTY_FORM);
      setFormError("");
      setCurrentPage(1);

      await loadUnits();
    } catch (err: unknown) {
      setFormError(
        err instanceof Error ? err.message : "Gagal menyimpan data Unit.",
      );
    } finally {
      setSaving(false);
    }
  }

  // Membuka modal konfirmasi hapus.
  function openDelete(unit: Unit) {
    setDeletingUnit(unit);
  }

  // Menutup modal konfirmasi hapus.
  function closeDeleteModal() {
    if (!deletingInProgress) {
      setDeletingUnit(null);
    }
  }

  // Menghapus data Unit.
  async function handleDelete() {
    if (!deletingUnit || deletingInProgress) return;

    const targetId = deletingUnit.id_unit;

    setDeletingInProgress(true);
    setError("");

    try {
      await unitService.delete(targetId);

      setData((current) => current.filter((unit) => unit.id_unit !== targetId));

      setDeletingUnit(null);
      showToast("Data Unit berhasil dihapus.", "success");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Gagal menghapus data Unit.",
      );
    } finally {
      setDeletingInProgress(false);
    }
  }

  return {
    data,
    search,
    setSearch,
    currentPage,
    setCurrentPage,

    loading,
    saving,
    deletingInProgress,

    error,
    formError,
    setFormError,

    modalOpen,
    setModalOpen,
    editing,
    deletingUnit,
    setDeletingUnit,

    form,
    setForm,

    filtered,
    totalItems,
    totalPages,
    safePage,
    paginated,
    itemsPerPage: ITEMS_PER_PAGE,
    startIndex,
    endIndex,

    loadUnits,
    openAdd,
    openEdit,
    openDelete,
    closeFormModal,
    closeDeleteModal,
    handleSave,
    handleDelete,
  };
}
