"use client";

import { AlertCircle, Plus, RefreshCw } from "lucide-react";

import { PageHeader, SearchInput } from "@/components/ui";
import { useUnit } from "@/hooks/modules/unit/useUnit";
import UnitStats from "@/components/modules/unit/UnitStats";
import UnitTable from "@/components/modules/unit/UnitTable";
import UnitFormModal from "@/components/modules/unit/UnitFormModal";
import UnitDeleteModal from "@/components/modules/unit/UnitDeleteModal";

export default function DataUnitPage() {
  const {
    data,
    search,
    setSearch,
    setCurrentPage,

    loading,
    saving,

    error,
    formError,
    setFormError,

    modalOpen,
    editing,
    deletingUnit,

    form,
    setForm,

    filtered,
    totalPages,
    safePage,
    paginated,
    itemsPerPage,
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
  } = useUnit();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Data Unit"
        subtitle="Kelola data unit cabang PAM Tirta Kamuning."
        badge=""
        badgeVariant="primary"
      >
        <button
          type="button"
          onClick={() => void loadUnits()}
          disabled={loading}
          className="btn btn-sm btn-ghost bg-white hover:bg-pdam-bg border border-slate-200 text-pdam-navy font-semibold normal-case shadow-xs"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
          />
          Muat Ulang
        </button>

        <button
          type="button"
          onClick={openAdd}
          className="btn btn-sm border-none bg-pdam-primary text-white shadow-xs hover:bg-pdam-navy"
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

      {/* Statistik */}
      <UnitStats loading={loading} totalUnit={data.length} />

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
      <UnitTable
        loading={loading}
        search={search}
        paginated={paginated}
        filteredLength={filtered.length}
        safePage={safePage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={setCurrentPage}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      {/* Modal tambah dan edit */}
      <UnitFormModal
        isOpen={modalOpen}
        onClose={closeFormModal}
        onSubmit={(event) => {
          event.preventDefault();
          void handleSave();
        }}
        editing={editing}
        form={form}
        setForm={setForm}
        formError={formError}
        saving={saving}
      />

      {/* Konfirmasi hapus */}
      <UnitDeleteModal
        isOpen={Boolean(deletingUnit)}
        onClose={closeDeleteModal}
        onConfirm={() => {
          void handleDelete();
        }}
        deletingUnit={deletingUnit}
      />
    </div>
  );
}
