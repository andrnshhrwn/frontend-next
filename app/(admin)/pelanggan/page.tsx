"use client";

import { AlertCircle, Info } from "lucide-react";

import { useToast } from "@/components/ui";

import {
  PelangganDeleteModal,
  PelangganDetailModal,
  PelangganFilters,
  PelangganFormModal,
  PelangganHeader,
  PelangganImportModal,
  PelangganStats,
  PelangganTable,
} from "@/components/modules/pelanggan";

import { usePelangganActions } from "@/hooks/modules/pelanggan/usePelangganActions";
import { usePelangganData } from "@/hooks/modules/pelanggan/usePelangganData";
import { usePelangganFilter } from "@/hooks/modules/pelanggan/usePelangganFilter";
import { usePelangganForm } from "@/hooks/modules/pelanggan/usePelangganForm";

export default function PelangganPage() {
  const { showToast } = useToast();

  const { customers, units, tariffs, loading, pageError, loadData } =
    usePelangganData();

  const filter = usePelangganFilter(customers);

  const modal = usePelangganForm();

  const editingCustomer = modal.editingCustomer(customers);
  const detailCustomer = modal.detailCustomer(customers);

  const totalPelanggan = customers.length;

  const totalWmTercatat = customers.filter(
    (customer) => !!customer.wmNoSeri,
  ).length;

  const totalWmBelumTercatat = totalPelanggan - totalWmTercatat;

  const { deleting, saveCustomer, deleteCustomer } = usePelangganActions({
    editingCustomer,
    loadData,
    closeForm: modal.closeForm,
    resetPage: filter.resetPage,
    showToast,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <PelangganHeader
        isLoading={loading}
        canCreate={units.length > 0 && tariffs.length > 0}
        onImport={() => modal.setImportOpen(true)}
        onCreate={modal.openCreate}
      />

      {/* Info Banner */}
      <div className="card bg-pdam-navy/5 border border-pdam-navy/20 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-pdam-navy/10 text-pdam-navy shrink-0 mt-0.5">
            <Info className="w-5 h-5" />
          </div>

          <div>
            <h4 className="font-bold text-xs text-pdam-navy">
              Informasi Pencatatan Nomor Seri WM
            </h4>

            <p className="text-xs text-slate-600 mt-1">
              Nomor seri WM aktif dikelola melalui proses BAP. Setelah BAP
              penggantian divalidasi oleh Pusat, nomor seri meter baru akan
              terhubung ke data pelanggan. Status belum tercatat hanya
              menunjukkan bahwa nomor seri belum tersimpan dalam sistem.
            </p>
          </div>
        </div>
      </div>

      {/* Statistik Pelanggan */}
      <PelangganStats
        isLoading={loading}
        totalPelanggan={totalPelanggan}
        totalWmTercatat={totalWmTercatat}
        totalWmBelumTercatat={totalWmBelumTercatat}
      />

      {/* Error State */}
      {pageError && (
        <div className="alert alert-error text-xs">
          <AlertCircle className="w-5 h-5" />

          <span>{pageError}</span>

          <button
            type="button"
            onClick={() => void loadData()}
            className="btn btn-sm btn-ghost"
          >
            <span className="loading loading-spinner loading-xs" />
            Coba Lagi
          </button>
        </div>
      )}

      {/* Filter & Search */}
      <PelangganFilters
        tab={filter.tab}
        onTabChange={filter.changeTab}
        search={filter.search}
        onSearchChange={filter.changeSearch}
        cabangFilter={filter.cabangFilter}
        onCabangFilterChange={filter.changeCabangFilter}
        tarifFilter={filter.tarifFilter}
        onTarifFilterChange={filter.changeTarifFilter}
        units={units}
        tariffs={tariffs}
      />

      {/* Table Data Pelanggan */}
      <PelangganTable
        customers={filter.displayedCustomers}
        filteredCount={filter.filtered.length}
        isLoading={loading}
        currentPage={filter.safeCurrentPage}
        totalPages={filter.totalPages}
        totalItems={filter.totalItems}
        itemsPerPage={filter.itemsPerPage}
        startIndex={filter.startIndex}
        endIndex={filter.endIndex}
        onPageChange={filter.setCurrentPage}
        onDetail={modal.openDetail}
        onEdit={modal.openEdit}
        onDelete={modal.setDeleteTarget}
      />

      {/* Modal Import Excel */}
      {modal.importOpen && (
        <PelangganImportModal
          onClose={() => modal.setImportOpen(false)}
          onImported={async (count) => {
            showToast(`${count} data pelanggan berhasil diimpor.`, "success");

            await loadData();
          }}
          showToast={showToast}
        />
      )}

      {/* Modal Form */}
      {modal.formState.open && (
        <PelangganFormModal
          key={modal.formState.id ?? "new"}
          editing={editingCustomer}
          units={units}
          tariffs={tariffs}
          onClose={modal.closeForm}
          onSave={saveCustomer}
        />
      )}

      {/* Modal Detail */}
      {detailCustomer && (
        <PelangganDetailModal
          customer={detailCustomer}
          onClose={modal.closeDetail}
          onEdit={() => modal.editFromDetail(detailCustomer)}
        />
      )}

      {/* Modal Delete */}
      {modal.deleteTarget && (
        <PelangganDeleteModal
          customer={modal.deleteTarget}
          deleting={deleting}
          onClose={() => modal.setDeleteTarget(null)}
          onConfirm={() => {
            void deleteCustomer(modal.deleteTarget, () => {
              modal.setDeleteTarget(null);
            });
          }}
        />
      )}
    </div>
  );
}
