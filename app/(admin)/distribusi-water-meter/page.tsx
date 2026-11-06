"use client";

import { useState } from "react";
import { Download, Plus, Truck } from "lucide-react";

import {
  PageHeader,
  ExportModal,
  DeleteConfirmModal,
  useToast,
} from "@/components/ui";

import {
  PengirimanDetailModal,
  PengirimanHistoryTab,
  PengirimanFormModal,
  PengirimanWmStats,
  StokUnitTab,
} from "@/components/modules/distribusi-water-meter";

import { usePengirimanWmData } from "@/hooks/modules/distribusi-water-meter/usePengirimanWmData";
import { usePengirimanWmStats } from "@/hooks/modules/distribusi-water-meter/usePengirimanWmStats";
import { usePengirimanWmFilter } from "@/hooks/modules/distribusi-water-meter/usePengirimanWmFilter";
import { usePengirimanWmForm } from "@/hooks/modules/distribusi-water-meter/usePengirimanWmForm";
import { usePengirimanWmActions } from "@/hooks/modules/distribusi-water-meter/usePengirimanWmActions";

import type { PengirimanWm } from "@/services/pengirimanService";
import type { PengirimanWmExportOptions } from "@/types/pengirimanWm.types";

import { EXPORT_COLUMNS } from "@/utils/pengirimanWm.utils";

type ActiveTab = "stok" | "pengiriman";

export default function DistribusiWaterMeterPage() {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<ActiveTab>("stok");

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [selectedPengiriman, setSelectedPengiriman] =
    useState<PengirimanWm | null>(null);

  const [deletingPengiriman, setDeletingPengiriman] =
    useState<PengirimanWm | null>(null);

  // Data dari backend
  const {
    pengirimanList,
    unitList,
    merkList,
    pelangganList,
    isLoading,
    errorMessage: dataErrorMessage,
    fetchData,
  } = usePengirimanWmData();

  // Perhitungan stok dan statistik
  const stats = usePengirimanWmStats(pengirimanList, pelangganList);

  // Pencarian, filter, dan pagination
  const filter = usePengirimanWmFilter(pengirimanList, unitList);

  // Form tambah dan edit
  const form = usePengirimanWmForm(unitList, merkList);

  // Aksi create, update, delete, dan export
  const actions = usePengirimanWmActions({
    fetchData,
    closeFormModal: form.closeFormModal,
  });

  // ======================================================
  // MODAL HANDLERS
  // ======================================================

  const handleOpenAddModal = () => {
    actions.clearError();
    form.openAddModal();
  };

  const handleCloseFormModal = () => {
    if (actions.isSaving) return;

    form.closeFormModal();
    actions.clearError();
  };

  const handleOpenEditModal = (item: PengirimanWm) => {
    actions.clearError();
    form.openEditModal(item);

    setDetailModalOpen(false);
    setSelectedPengiriman(null);
  };

  const handleOpenDetailModal = (item: PengirimanWm) => {
    setSelectedPengiriman(item);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedPengiriman(null);
  };

  const handleOpenDeleteModal = (item: PengirimanWm) => {
    setDeletingPengiriman(item);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeletingPengiriman(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingPengiriman) return;

    const success = await actions.deletePengiriman(
      deletingPengiriman.id_pengiriman,
    );

    if (success) {
      handleCloseDeleteModal();
    }
  };

  // ======================================================
  // FORM SUBMIT
  // ======================================================

  const handleSubmitPengiriman = (event: React.FormEvent<HTMLFormElement>) => {
    void actions.submitPengiriman(event, {
      editingPengiriman: form.editingPengiriman,
      noPengiriman: form.formNoPengiriman,
      tglPengiriman: form.formTglPengiriman,
      unitTujuan: form.formUnitTujuan,
      catatan: form.formCatatan,
      details: form.formDetails,
    });
  };

  // ======================================================
  // EXPORT
  // ======================================================

  const handleExport = (options: PengirimanWmExportOptions) => {
    actions.exportPengiriman(
      options,
      filter.filteredPengiriman,
      pengirimanList,
    );

    setExportModalOpen(false);
  };

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="space-y-6">
      <PageHeader
        title="Monitoring & Pengiriman Water Meter"
        subtitle="Pencatatan pengiriman Water Meter dari Pusat ke Cabang dan monitoring ketersediaan stok unit."
        badge="PAM Tirta Kamuning - Pusat"
        badgeVariant="primary"
      >
        <button
          type="button"
          onClick={() => setExportModalOpen(true)}
          disabled={pengirimanList.length === 0}
          className="btn btn-sm rounded-md border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <Download className="h-3.5 w-3.5" />
          Ekspor CSV
        </button>

        <button
          type="button"
          onClick={handleOpenAddModal}
          disabled={unitList.length === 0 || merkList.length === 0}
          className="btn btn-sm rounded-md border-none bg-pdam-primary text-white hover:bg-pdam-primary/90 disabled:opacity-50"
        >
          <Plus className="h-3.5 w-3.5" />
          Catat Pengiriman WM
        </button>
      </PageHeader>

      {dataErrorMessage && !form.formModalOpen && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
          <span>{dataErrorMessage}</span>

          <button
            type="button"
            onClick={() => void fetchData()}
            className="font-semibold hover:underline"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Statistik */}
      <PengirimanWmStats {...stats} />

      {/* Tab navigasi */}
      <div className="flex gap-4 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("stok")}
          className={`border-b-2 px-1 pb-3 text-sm font-semibold transition ${
            activeTab === "stok"
              ? "border-pdam-primary text-pdam-primary"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Monitoring Ketersediaan Stok Unit
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("pengiriman")}
          className={`border-b-2 px-1 pb-3 text-sm font-semibold transition ${
            activeTab === "pengiriman"
              ? "border-pdam-primary text-pdam-primary"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Catatan Riwayat Pengiriman
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
          Memuat data pengiriman WM...
        </div>
      )}

      {/* Tab stok */}
      {!isLoading && activeTab === "stok" && (
        <StokUnitTab
          unitList={unitList}
          filteredUnit={filter.filteredUnit}
          search={filter.search}
          cabangFilter={filter.cabangFilter}
          unitFilterOptions={filter.unitFilterOptions}
          onSearchChange={filter.setSearch}
          onCabangFilterChange={filter.setCabangFilter}
          getUnitPengiriman={stats.getUnitPengiriman}
          getUnitWmTerpasang={stats.getUnitWmTerpasang}
          getUnitTotalDikirim={stats.getUnitTotalDikirim}
          getUnitStok={stats.getUnitStok}
        />
      )}

      {/* Tab riwayat */}
      {!isLoading && activeTab === "pengiriman" && (
        <PengirimanHistoryTab
          data={filter.paginatedPengiriman}
          search={filter.search}
          cabangFilter={filter.cabangFilter}
          unitFilterOptions={filter.unitFilterOptions}
          currentPage={filter.currentPage}
          totalPages={filter.totalPages}
          totalItems={filter.totalItems}
          startIndex={filter.startIndex}
          endIndex={filter.endIndex}
          onSearchChange={filter.setSearch}
          onCabangFilterChange={filter.setCabangFilter}
          onPageChange={filter.setCurrentPage}
          onDetail={handleOpenDetailModal}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteModal}
        />
      )}

      {/* Modal tambah / edit */}
      <PengirimanFormModal
        isOpen={form.formModalOpen}
        isSaving={actions.isSaving}
        isEditing={Boolean(form.editingPengiriman)}
        noPengiriman={form.formNoPengiriman}
        tglPengiriman={form.formTglPengiriman}
        unitTujuan={form.formUnitTujuan}
        catatan={form.formCatatan}
        details={form.formDetails}
        unitList={unitList}
        merkList={merkList}
        errorMessage={actions.errorMessage}
        onClose={handleCloseFormModal}
        onSubmit={handleSubmitPengiriman}
        onNoPengirimanChange={form.setFormNoPengiriman}
        onTglPengirimanChange={form.setFormTglPengiriman}
        onUnitTujuanChange={form.setFormUnitTujuan}
        onCatatanChange={form.setFormCatatan}
        onAddDetail={form.addDetailRow}
        onDetailChange={form.changeDetail}
        onRemoveDetail={form.removeDetailRow}
      />

      {/* Modal detail */}
      <PengirimanDetailModal
        isOpen={detailModalOpen}
        pengiriman={selectedPengiriman}
        onClose={handleCloseDetailModal}
        onEdit={handleOpenEditModal}
      />

      {/* Konfirmasi hapus */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={() => void handleConfirmDelete()}
        title="Hapus Catatan Pengiriman"
        itemName={deletingPengiriman?.no_pengiriman ?? ""}
        itemType="catatan pengiriman WM"
        warningText="Penghapusan catatan pengiriman akan mengurangi total pengiriman yang tercatat pada unit tujuan. Pastikan data ini memang perlu dihapus."
      />

      {/* Modal ekspor */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        columns={EXPORT_COLUMNS}
        totalFiltered={filter.filteredPengiriman.length}
        totalAll={pengirimanList.length}
        onExport={handleExport}
      />
    </div>
  );
}
