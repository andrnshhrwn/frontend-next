"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Building2,
  LoaderCircle,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";

import {
  PageHeader,
  StatCard,
  SearchInput,
  BaseModal,
  DeleteConfirmModal,
  Pagination,
} from "@/components/ui";

import { unitService, type Unit } from "@/services/unitService";

type UnitForm = {
  kode_unit: string;
  nama_unit: string;
};

const EMPTY_FORM: UnitForm = {
  kode_unit: "",
  nama_unit: "",
};

const ITEMS_PER_PAGE = 6;

export default function DataUnitPage() {
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

  const filtered = useMemo(() => {
    const sortedData = [...data].sort((a, b) =>
      a.kode_unit.localeCompare(b.kode_unit, undefined, {
        numeric: true,
        sensitivity: "base",
      }),
    );

    const keyword = search.trim().toLowerCase();

    if (!keyword) return sortedData;

    return sortedData.filter(
      (unit) =>
        unit.id_unit.toLowerCase().includes(keyword) ||
        unit.kode_unit.toLowerCase().includes(keyword) ||
        unit.nama_unit.toLowerCase().includes(keyword),
    );
  }, [data, search]);

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

  function openAdd() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(unit: Unit) {
    setEditing(unit);
    setForm({
      kode_unit: unit.kode_unit,
      nama_unit: unit.nama_unit,
    });
    setFormError("");
    setModalOpen(true);
  }

  function closeFormModal() {
    if (saving) return;

    setModalOpen(false);
    setFormError("");
  }

  async function handleSave() {
    const kode_unit = form.kode_unit.trim();
    const nama_unit = form.nama_unit.trim();

    if (!kode_unit) {
      setFormError("Kode Unit wajib diisi.");
      return;
    }

    if (kode_unit.length > 20) {
      setFormError("Kode Unit maksimal 20 karakter.");
      return;
    }

    if (!nama_unit) {
      setFormError("Nama Unit wajib diisi.");
      return;
    }

    if (nama_unit.length > 100) {
      setFormError("Nama Unit maksimal 100 karakter.");
      return;
    }

    setSaving(true);
    setFormError("");

    try {
      const payload = {
        kode_unit,
        nama_unit,
      };

      if (editing) {
        await unitService.update(editing.id_unit, payload);
      } else {
        await unitService.create(payload);
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

  async function handleDelete() {
    if (!deletingUnit || deletingInProgress) return;

    const targetId = deletingUnit.id_unit;

    setDeletingInProgress(true);
    setError("");

    try {
      await unitService.delete(targetId);

      setData((current) => current.filter((unit) => unit.id_unit !== targetId));

      setDeletingUnit(null);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Gagal menghapus data Unit.",
      );
    } finally {
      setDeletingInProgress(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Data Unit"
        subtitle="Kelola data unit cabang PAM Tirta Kamuning."
        badge="Master Data PAM Tirta Kamuning"
        badgeVariant="primary"
      >
        <button
          type="button"
          onClick={() => void loadUnits()}
          disabled={loading}
          className="btn btn-sm btn-outline border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
          />
          Muat Ulang
        </button>

        <button
          type="button"
          onClick={openAdd}
          className="btn btn-sm border-none bg-pdam-primary text-white shadow-xs hover:bg-pdam-primary/90"
        >
          <Plus className="h-3.5 w-3.5" />
          Tambah Unit
        </button>
      </PageHeader>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

          <div className="flex-1">{error}</div>

          <button
            type="button"
            onClick={() => void loadUnits()}
            disabled={loading}
            className="shrink-0 font-semibold underline disabled:opacity-50"
          >
            Coba lagi
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Unit Terdaftar"
          value={loading ? "..." : data.length}
          subtext="Jumlah unit pada master data"
          icon={<Building2 className="h-5 w-5" />}
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
          placeholder="Cari kode, nama, atau ID Unit..."
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
                <th className="px-4 py-3">Kode Unit</th>
                <th className="px-4 py-3">Nama Unit</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-12 text-center text-slate-400"
                  >
                    <span className="inline-flex items-center gap-2">
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Memuat data Unit...
                    </span>
                  </td>
                </tr>
              ) : paginated.length > 0 ? (
                paginated.map((item) => (
                  <tr
                    key={item.id_unit}
                    className="transition-colors hover:bg-slate-50/80"
                  >
                    <td className="whitespace-nowrap px-4 py-3.5 font-mono font-bold text-pdam-primary">
                      <span className="rounded border border-pdam-primary/20 bg-pdam-primary/10 px-2 py-0.5 text-xs">
                        {item.kode_unit}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 font-medium text-slate-700">
                      {item.nama_unit}
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(item)}
                          className="btn btn-xs btn-ghost text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                          title="Edit Unit"
                          aria-label={`Edit unit ${item.nama_unit}`}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingUnit(item)}
                          className="btn btn-xs btn-ghost text-slate-500 hover:bg-red-50 hover:text-red-600"
                          title="Hapus Unit"
                          aria-label={`Hapus unit ${item.nama_unit}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-12 text-center text-slate-400"
                  >
                    {search
                      ? "Tidak ada unit yang sesuai dengan pencarian."
                      : "Belum ada data unit."}
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
        title={editing ? "Edit Unit" : "Tambah Unit"}
      >
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            void handleSave();
          }}
        >
          <div>
            <label
              htmlFor="kode_unit"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Kode Unit
            </label>

            <input
              id="kode_unit"
              type="text"
              value={form.kode_unit}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  kode_unit: event.target.value,
                }))
              }
              maxLength={20}
              required
              autoFocus
              disabled={saving}
              placeholder="Contoh: 01"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            />
          </div>

          <div>
            <label
              htmlFor="nama_unit"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Nama Unit
            </label>

            <input
              id="nama_unit"
              type="text"
              value={form.nama_unit}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  nama_unit: event.target.value,
                }))
              }
              maxLength={100}
              required
              disabled={saving}
              placeholder="Masukkan nama unit"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            />
          </div>

          {formError && (
            <p role="alert" className="text-sm text-red-600">
              {formError}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              disabled={saving}
              onClick={closeFormModal}
              className="btn btn-sm btn-outline"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={saving}
              className="btn btn-sm border-none bg-pdam-primary text-white hover:bg-pdam-primary/90 disabled:opacity-50"
            >
              {saving && <LoaderCircle className="h-3.5 w-3.5 animate-spin" />}
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </BaseModal>

      {/* Konfirmasi hapus */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingUnit)}
        onClose={() => {
          if (!deletingInProgress) {
            setDeletingUnit(null);
          }
        }}
        onConfirm={() => void handleDelete()}
        title="Hapus Unit"
        itemName={deletingUnit?.nama_unit ?? ""}
        itemType="unit"
        warningText="Pastikan unit tidak sedang digunakan oleh data atau transaksi lain. Penghapusan dapat ditolak oleh backend jika masih memiliki relasi."
      />
    </div>
  );
}
