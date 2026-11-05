"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Download,
  Plus,
  Pencil,
  Trash2,
  Gauge,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";

import {
  PageHeader,
  StatCard,
  SearchInput,
  BaseModal,
  DeleteConfirmModal,
  ExportModal,
  Pagination,
} from "@/components/ui";

import {
  merkWMService,
  type MerkWM,
  type MerkWMPayload,
} from "@/services/merkWMService";

const EXPORT_COLUMNS = [
  { id: "kode_wm", label: "Kode WM" },
  { id: "id_merk", label: "ID Merk" },
  { id: "merk_wm", label: "Nama Merk" },
  { id: "wm_digit", label: "Jumlah Digit Stand" },
];

const ITEMS_PER_PAGE = 6;

const EMPTY_FORM = {
  kode_wm: "",
  merk_wm: "",
  wm_digit: "5",
};

export default function DataMerkWMPage() {
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

  const [form, setForm] = useState({ ...EMPTY_FORM });

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
    const sortedData = [...data].sort((a, b) =>
      a.kode_wm.localeCompare(b.kode_wm, undefined, {
        numeric: true,
        sensitivity: "base",
      }),
    );

    const keyword = search.trim().toLowerCase();

    if (!keyword) return sortedData;

    return sortedData.filter(
      (item) =>
        item.id_merk.toLowerCase().includes(keyword) ||
        item.kode_wm.toLowerCase().includes(keyword) ||
        item.merk_wm.toLowerCase().includes(keyword) ||
        String(item.wm_digit).includes(keyword),
    );
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
    const kode = form.kode_wm.trim();
    const nama = form.merk_wm.trim();
    const digit = Number(form.wm_digit);

    if (!kode) {
      setError("Kode WM wajib diisi.");
      return;
    }

    if (kode.length > 20) {
      setError("Kode WM maksimal 20 karakter.");
      return;
    }

    if (!nama) {
      setError("Nama merk wajib diisi.");
      return;
    }

    if (nama.length > 50) {
      setError("Nama merk maksimal 50 karakter.");
      return;
    }

    if (form.wm_digit.trim() === "" || !Number.isInteger(digit) || digit <= 0) {
      setError("Jumlah digit harus berupa bilangan bulat positif.");
      return;
    }

    const payload: MerkWMPayload = {
      kode_wm: kode,
      merk_wm: nama,
      wm_digit: digit,
    };

    setSaving(true);
    setError("");

    try {
      if (editing) {
        await merkWMService.update(editing.id_merk, payload);
      } else {
        await merkWMService.create(payload);
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

  // Hapus data
  const confirmDelete = async () => {
    if (!deletingMerk || deleting) return;

    setDeleting(true);
    setPageError("");

    try {
      await merkWMService.delete(deletingMerk.id_merk);

      setData((current) =>
        current.filter((item) => item.id_merk !== deletingMerk.id_merk),
      );

      setDeletingMerk(null);
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
  const handleExport = ({
    scope,
    selectedCols,
  }: {
    scope: "filtered" | "all";
    selectedCols: string[];
  }) => {
    const target = scope === "filtered" ? filtered : data;

    const header = selectedCols
      .map(
        (column) =>
          EXPORT_COLUMNS.find((item) => item.id === column)?.label || column,
      )
      .map((value) => `"${value.replace(/"/g, '""')}"`)
      .join(",");

    const rows = target.map((item) =>
      selectedCols
        .map((column) => {
          const value = String(item[column as keyof MerkWM] ?? "");

          return `"${value.replace(/"/g, '""')}"`;
        })
        .join(","),
    );

    const csvContent = [header, ...rows].join("\r\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `data-merk-wm-pam-tirta-kamuning-${Date.now()}.csv`;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
    setExportModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Merk Water Meter"
        subtitle="Kelola master data kode merk dan jumlah digit meteran air untuk standar pembacaan meter di PAM Tirta Kamuning."
        badge="Master Data PAM Tirta Kamuning"
        badgeVariant="primary"
      >
        <button
          type="button"
          onClick={() => setExportModalOpen(true)}
          disabled={data.length === 0}
          className="btn btn-sm btn-outline border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50"
        >
          <Download className="h-3.5 w-3.5" />
          Ekspor CSV
        </button>

        <button
          type="button"
          onClick={openAdd}
          className="btn btn-sm border-none bg-pdam-primary text-white shadow-xs hover:bg-pdam-primary/90"
        >
          <Plus className="h-3.5 w-3.5" />
          Tambah Merk
        </button>
      </PageHeader>

      {/* Error halaman */}
      {pageError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

          <div className="flex-1">{pageError}</div>

          <button
            type="button"
            onClick={() => void loadData()}
            disabled={loading}
            className="shrink-0 font-semibold underline disabled:opacity-50"
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* Statistik */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Merk Terdaftar"
          value={loading ? "..." : totalWM}
          subtext="Jumlah data pada master merk"
          icon={<Gauge className="h-5 w-5" />}
          variant="primary"
        />
      </div>

      {/* Pencarian */}
      <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row">
        <SearchInput
          value={search}
          onChange={(value: string) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          placeholder="Cari kode, ID, atau nama merk..."
          className="w-full sm:max-w-xs"
        />

        {search && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setCurrentPage(1);
            }}
            className="shrink-0 text-xs text-slate-500 underline hover:text-pdam-primary"
          >
            Hapus Pencarian
          </button>
        )}
      </div>

      {/* Tabel */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">Kode WM</th>
                <th className="px-4 py-3">Nama Merk Water Meter</th>
                <th className="px-4 py-3 text-center">Digit Stand</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <span className="inline-flex items-center gap-2">
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Memuat data merk water meter...
                    </span>
                  </td>
                </tr>
              ) : paginated.length > 0 ? (
                paginated.map((item) => (
                  <tr
                    key={item.id_merk}
                    className="transition-colors hover:bg-slate-50/60"
                  >
                    <td className="px-4 py-3.5 font-mono font-bold text-pdam-primary">
                      <span className="rounded border border-pdam-primary/20 bg-pdam-primary/10 px-2 py-0.5 text-xs">
                        {item.kode_wm}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 font-medium text-slate-700">
                      {item.merk_wm}
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <span className="inline-block rounded bg-slate-100 px-2 py-0.5 font-mono text-xs font-bold text-slate-700">
                        {item.wm_digit} digit
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(item)}
                          className="btn btn-xs btn-ghost text-slate-600 hover:bg-pdam-primary/10 hover:text-pdam-primary"
                          title="Edit Merk"
                          aria-label={`Edit merk ${item.merk_wm}`}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingMerk(item)}
                          className="btn btn-xs btn-ghost text-slate-500 hover:bg-red-50 hover:text-red-600"
                          title="Hapus Merk"
                          aria-label={`Hapus merk ${item.merk_wm}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    {search
                      ? "Tidak ada merk water meter yang sesuai dengan pencarian."
                      : "Belum ada data merk water meter."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && filtered.length > 0 && (
          <div className="border-t border-slate-100 p-4">
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              totalItems={filtered.length}
              onPageChange={setCurrentPage}
              startIndex={(safePage - 1) * ITEMS_PER_PAGE}
              endIndex={Math.min(safePage * ITEMS_PER_PAGE, filtered.length)}
            />
          </div>
        )}
      </div>

      {/* Modal tambah dan edit */}
      <BaseModal
        isOpen={modalOpen}
        onClose={closeFormModal}
        title={editing ? "Ubah Data Merk" : "Tambah Merk Water Meter Baru"}
        subtitle="Data akan disimpan pada master merk water meter."
        icon={<Gauge className="h-5 w-5 text-pdam-primary" />}
        maxWidth="sm"
      >
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            void handleSave();
          }}
        >
          <div>
            <label
              htmlFor="kode_wm"
              className="mb-1 block text-xs font-semibold text-slate-700"
            >
              Kode WM
            </label>

            <input
              id="kode_wm"
              type="text"
              value={form.kode_wm}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  kode_wm: event.target.value,
                }))
              }
              maxLength={20}
              placeholder="Contoh: 001"
              disabled={saving}
              required
              autoFocus
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-pdam-primary focus:outline-none focus:ring-2 focus:ring-pdam-primary/30 disabled:bg-slate-100"
            />

            <span className="mt-1 block text-[10px] text-slate-400">
              Kode harus unik dan maksimal 20 karakter.
            </span>
          </div>

          <div>
            <label
              htmlFor="merk_wm"
              className="mb-1 block text-xs font-semibold text-slate-700"
            >
              Nama Merk
            </label>

            <input
              id="merk_wm"
              type="text"
              value={form.merk_wm}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  merk_wm: event.target.value,
                }))
              }
              maxLength={50}
              placeholder="Contoh: Itron, Onda, Linflow"
              disabled={saving}
              required
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-pdam-primary focus:outline-none focus:ring-2 focus:ring-pdam-primary/30 disabled:bg-slate-100"
            />

            <span className="mt-1 block text-[10px] text-slate-400">
              Maksimal 50 karakter nama merk.
            </span>
          </div>

          <div>
            <label
              htmlFor="wm_digit"
              className="mb-1 block text-xs font-semibold text-slate-700"
            >
              Jumlah Digit Stand Meter
            </label>

            <input
              id="wm_digit"
              type="number"
              min={1}
              step={1}
              value={form.wm_digit}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  wm_digit: event.target.value,
                }))
              }
              disabled={saving}
              required
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-pdam-primary focus:outline-none focus:ring-2 focus:ring-pdam-primary/30 disabled:bg-slate-100"
            />

            <span className="mt-1 block text-[10px] text-slate-400">
              Harus berupa bilangan bulat positif.
            </span>
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-center gap-2 rounded-lg border border-rose-100 bg-rose-50 p-3 text-xs text-rose-700"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={closeFormModal}
              disabled={saving}
              className="btn btn-sm btn-ghost text-slate-600 hover:bg-slate-100 disabled:opacity-50"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={saving}
              className="btn btn-sm border-none bg-pdam-primary text-white shadow-xs hover:bg-pdam-primary/90 disabled:opacity-50"
            >
              {saving && <LoaderCircle className="h-3.5 w-3.5 animate-spin" />}

              {saving
                ? "Menyimpan..."
                : editing
                  ? "Simpan Perubahan"
                  : "Simpan"}
            </button>
          </div>
        </form>
      </BaseModal>

      {/* Konfirmasi hapus */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingMerk)}
        onClose={() => {
          if (!deleting) {
            setDeletingMerk(null);
          }
        }}
        onConfirm={() => void confirmDelete()}
        itemName={deletingMerk?.merk_wm ?? ""}
        itemType="merk water meter"
        warningText="Merk WM tidak dapat dihapus jika sudah digunakan pada detail pengiriman WM."
      />

      {/* Ekspor CSV */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        columns={EXPORT_COLUMNS}
        totalFiltered={filtered.length}
        totalAll={data.length}
        onExport={handleExport}
      />
    </div>
  );
}
