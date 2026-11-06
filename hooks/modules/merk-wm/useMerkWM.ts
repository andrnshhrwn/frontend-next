import { useCallback, useEffect, useMemo, useState } from "react";

import { merkWMService } from "@/services/merkWMService";

import { useToast } from "@/components/ui";

import type {
  MerkWM,
  MerkWMFormState,
  MerkWMExportOptions,
} from "@/types/merkWM.types";

import {
  EMPTY_FORM,
  ITEMS_PER_PAGE,
  createMerkWMPayload,
  downloadMerkWMCSV,
  filterMerkWM,
  generateMerkWMCSV,
  sortMerkWM,
  validateMerkWMForm,
} from "@/utils/merkWM.utils";

export function useMerkWM() {
  const { showToast } = useToast();

  const [data, setData] = useState<MerkWM[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const [deletingMerk, setDeletingMerk] = useState<MerkWM | null>(null);

  const [editing, setEditing] = useState<MerkWM | null>(null);

  const [form, setForm] = useState<MerkWMFormState>({
    ...EMPTY_FORM,
  });

  const [error, setError] = useState("");
  const [pageError, setPageError] = useState("");

  // Mengambil data Merk WM
  const loadData = useCallback(async () => {
    setLoading(true);
    setPageError("");

    try {
      const result = await merkWMService.findAll();
      setData(result);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Gagal mengambil data merk water meter.";

      setPageError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  // Pengurutan dan pencarian
  const filtered = useMemo(() => {
    const sortedData = sortMerkWM(data);
    return filterMerkWM(sortedData, search);
  }, [data, search]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));

  const safePage = Math.min(currentPage, totalPages);

  const paginated = useMemo(() => {
    const startIndex = (safePage - 1) * ITEMS_PER_PAGE;

    return filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filtered, safePage]);

  useEffect(() => {
    if (currentPage !== safePage) {
      setCurrentPage(safePage);
    }
  }, [currentPage, safePage]);

  // Statistik
  const totalWM = data.length;

  // Modal tambah
  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setError("");
    setModalOpen(true);
  };

  // Modal edit
  const openEdit = (item: MerkWM) => {
    setEditing(item);

    setForm({
      kode_wm: item.kode_wm,
      merk_wm: item.merk_wm,
      wm_digit: String(item.wm_digit),
    });

    setError("");
    setModalOpen(true);
  };

  // Menutup modal form
  const closeFormModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setError("");
  };

  // Simpan data
  const handleSave = async () => {
    const validationError = validateMerkWMForm(form);

    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = createMerkWMPayload(form);

    setSaving(true);
    setError("");

    try {
      if (editing) {
        await merkWMService.update(editing.id_merk, payload);

        showToast("Data merk water meter berhasil diperbarui.", "success");
      } else {
        await merkWMService.create(payload);

        showToast("Data merk water meter berhasil ditambahkan.", "success");
      }

      setModalOpen(false);
      setEditing(null);
      setForm({ ...EMPTY_FORM });
      setCurrentPage(1);

      await loadData();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan data merk water meter.",
      );
    } finally {
      setSaving(false);
    }
  };

  // Konfirmasi hapus
  const confirmDelete = async () => {
    if (!deletingMerk || deleting) return;

    const targetId = deletingMerk.id_merk;

    setDeleting(true);
    setPageError("");

    try {
      await merkWMService.delete(targetId);

      setData((current) => current.filter((item) => item.id_merk !== targetId));

      setDeletingMerk(null);

      showToast("Data merk water meter berhasil dihapus.", "success");
    } catch (err: unknown) {
      setPageError(
        err instanceof Error
          ? err.message
          : "Gagal menghapus data merk water meter.",
      );
    } finally {
      setDeleting(false);
    }
  };

  // Ekspor CSV
  const handleExport = ({ scope, selectedCols }: MerkWMExportOptions) => {
    const target = scope === "filtered" ? filtered : data;

    const csvContent = generateMerkWMCSV(target, selectedCols);

    downloadMerkWMCSV(csvContent);

    setExportModalOpen(false);

    showToast("Data merk water meter berhasil diekspor.", "success");
  };

  const clearSearch = () => {
    setSearch("");
    setCurrentPage(1);
  };

  const changeSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  return {
    data,
    loading,
    saving,
    deleting,

    search,
    currentPage,
    safePage,
    totalPages,
    paginated,
    filtered,
    totalWM,

    modalOpen,
    exportModalOpen,
    deletingMerk,
    editing,

    form,
    error,
    pageError,

    setForm,
    setCurrentPage,
    setModalOpen,
    setExportModalOpen,
    setDeletingMerk,
    setPageError,

    loadData,
    openAdd,
    openEdit,
    closeFormModal,
    handleSave,
    confirmDelete,
    handleExport,
    clearSearch,
    changeSearch,
  };
}
