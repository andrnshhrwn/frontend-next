"use client";

import { AlertCircle, Download, Plus } from "lucide-react";

import { PageHeader, SearchInput } from "@/components/ui";
import { useTarif } from "@/hooks/modules/tarif/useTarif";
import TarifStats from "@/components/modules/tarif/TarifStats";
import TarifTable from "@/components/modules/tarif/TarifTable";
import TarifFormModal from "@/components/modules/tarif/TarifFormModal";
import TarifDeleteModal from "@/components/modules/tarif/TarifDeleteModal";
import TarifExportModal from "@/components/modules/tarif/TarifExportModal";

export default function DataTarifPage() {
  const {
    data,
    loading,
    error,
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
  } = useTarif();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Golongan Tarif"
        subtitle="Kelola data tipe tarif pelanggan."
        badge=""
        badgeVariant="primary"
      >
        <button
          type="button"
          onClick={() => setExportModalOpen(true)}
          disabled={data.length === 0}
          className="btn btn-sm btn-ghost bg-white hover:bg-pdam-bg border border-slate-200 text-pdam-navy font-semibold normal-case shadow-xs"
        >
          <Download className="h-3.5 w-3.5" />
          Ekspor CSV
        </button>

        <button
          type="button"
          onClick={openAdd}
          className="btn btn-sm border-none bg-pdam-primary text-white shadow-xs hover:bg-pdam-navy"
        >
          <Plus className="h-3.5 w-3.5" />
          Tambah Tarif
        </button>
      </PageHeader>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4.5 w-4.5 shrink-0" />

          <div className="flex-1">{error}</div>

          <button
            type="button"
            onClick={() => void loadData()}
            disabled={loading}
            className="font-medium underline disabled:opacity-50"
          >
            Muat ulang
          </button>
        </div>
      )}

      {/* Statistik */}
      <TarifStats
        loading={loading}
        totalTarif={data.length}
        totalPelanggan={totalPelanggan}
        totalTarifDigunakan={totalTarifDigunakan}
      />

      {/* Pencarian */}
      <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row">
        <div className="w-full sm:max-w-xs">
          <SearchInput
            value={search}
            onChange={(value: string) => {
              setSearch(value);
              setCurrentPage(1);
            }}
            placeholder="Cari kode atau nama tarif..."
            className="w-full"
          />
        </div>

        <div className="text-xs text-slate-500">
          Menampilkan{" "}
          <span className="font-semibold text-slate-700">
            {filtered.length}
          </span>{" "}
          golongan tarif
        </div>
      </div>

      {/* Tabel */}
      <TarifTable
        loading={loading}
        error={error}
        paginated={paginated}
        filteredLength={filtered.length}
        safePage={safePage}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={setCurrentPage}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      {/* Modal tambah dan edit */}
      <TarifFormModal
        isOpen={modalOpen}
        onClose={() => {
          if (!saving) {
            setModalOpen(false);
            setFormError("");
          }
        }}
        editing={editing}
        form={form}
        setForm={setForm}
        formError={formError}
        saving={saving}
        onSave={() => {
          void handleSave();
        }}
      />

      {/* Modal konfirmasi hapus */}
      <TarifDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!deleting) {
            setDeleteModalOpen(false);
            setDeletingTarif(null);
          }
        }}
        onConfirm={() => {
          void confirmDelete();
        }}
        deletingTarif={deletingTarif}
      />

      {/* Modal ekspor */}
      <TarifExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        totalFiltered={filtered.length}
        totalAll={data.length}
        onExport={exportCSV}
      />
    </div>
  );
}
