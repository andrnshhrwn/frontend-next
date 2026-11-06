"use client";

import { AlertCircle, X } from "lucide-react";

import { useState } from "react";

import { getStoredUser } from "@/services/apiClient";

import { useToast } from "@/components/ui";

import {
  PenugasanHeader,
  PenugasanStats,
  PenugasanFilters,
  PenugasanTable,
  PenugasanExportModal,
  PenugasanCreateModal,
  PenugasanEditModal,
  PenugasanDeleteModal,
  PenugasanAssignModal,
  PenugasanCancelModal,
  PenugasanDetailModal,
} from "@/components/modules/penugasan";

import { usePenugasanData } from "@/hooks/modules/penugasan/usePenugasanData";

import { usePenugasanFilter } from "@/hooks/modules/penugasan/usePenugasanFilter";

import { usePenugasanActions } from "@/hooks/modules/penugasan/usePenugasanActions";

import { usePenugasanModals } from "@/hooks/modules/penugasan/usePenugasanModals";

import { ITEMS_PER_PAGE } from "@/utils/penugasan.utils";

export default function PenugasanPusatPage() {
  const { showToast } = useToast();

  const currentUser = getStoredUser();

  const isAdminPusat = currentUser?.role === "admin_pusat";
  const isAdminCabang = currentUser?.role === "admin_cabang";

  // ID unit dari backend berupa UUID string.
  const unitId = currentUser?.id_unit ? String(currentUser.id_unit) : "";

  const unitName = currentUser?.nama_unit ?? "Unit";

  const access = {
    isAdminPusat,
    isAdminCabang,
    unitId,
    unitName,
  };

  const {
    tickets,
    pelanggan,
    teknisi,
    loading,
    loadingTeknisi,
    error,
    setError,
    loadData,
    loadTeknisi,
  } = usePenugasanData(access);

  const {
    search,
    setSearch,
    cabangFilter,
    setCabangFilter,
    statusFilter,
    setStatusFilter,
    setCurrentPage,
    filtered,
    paginatedTickets,
    totalPages,
    safeCurrentPage,
    startIndex,
    endIndex,
    stats,
    tabs,
    units,
    handlePageChange,
    resetFilter,
  } = usePenugasanFilter(tickets);

  const modals = usePenugasanModals();

  const [refreshing, setRefreshing] = useState(false);

  const {
    handleCreate,
    handleAssign,
    handleUpdate,
    handleDelete,
    handleCancel,
  } = usePenugasanActions({
    loadData,
    setCurrentPage,
    setCancelId: modals.setCancelId,
    showToast,
  });

  const editTicket = tickets.find((item) => item.id === modals.editId) ?? null;

  const deleteTicket =
    tickets.find((item) => item.id === modals.deleteId) ?? null;

  const assignTicket =
    tickets.find((item) => item.id === modals.assignId) ?? null;

  const detailTicket =
    tickets.find((item) => item.id === modals.detailId) ?? null;

  const cancelTicket =
    tickets.find((item) => item.id === modals.cancelId) ?? null;

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      await loadData();
    } finally {
      setRefreshing(false);
    }
  };

  /* ---------------------------------------------------------------- */
  /* Access control                                                     */
  /* ---------------------------------------------------------------- */

  if (!isAdminPusat && !isAdminCabang) {
    return (
      <div className="card bg-white border border-slate-200 p-6">
        <p className="text-sm font-semibold text-pdam-red">
          Anda tidak memiliki akses ke halaman ini.
        </p>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /* Render                                                            */
  /* ---------------------------------------------------------------- */

  return (
    <div className="space-y-6">
      <PenugasanHeader
        isAdminPusat={isAdminPusat}
        isAdminCabang={isAdminCabang}
        unitName={unitName}
        refreshing={refreshing}
        onExport={() => modals.setShowExport(true)}
        onRefresh={handleRefresh}
        onCreate={() => modals.setShowCreate(true)}
      />

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-pdam-red/30 bg-pdam-red/5 p-3 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-pdam-red mt-0.5" />

          <div className="flex-1">
            <p className="text-xs font-semibold text-pdam-red">{error}</p>
          </div>

          <button onClick={() => setError("")} className="text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Statistik */}
      <PenugasanStats stats={stats} />

      {/* Filter dan pencarian */}
      <PenugasanFilters
        search={search}
        onSearchChange={setSearch}
        cabangFilter={cabangFilter}
        onCabangFilterChange={setCabangFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        tabs={tabs}
        units={units}
        isAdminPusat={isAdminPusat}
        isAdminCabang={isAdminCabang}
        unitName={unitName}
        onReset={resetFilter}
      />

      {/* Tabel SPK */}
      <PenugasanTable
        tickets={paginatedTickets}
        filteredCount={filtered.length}
        totalCount={tickets.length}
        loading={loading}
        isAdminCabang={isAdminCabang}
        currentPage={safeCurrentPage}
        totalPages={totalPages}
        itemsPerPage={ITEMS_PER_PAGE}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={handlePageChange}
        onAssign={async (ticket) => {
          modals.setAssignId(ticket.id);
          await loadTeknisi();
        }}
        onEdit={modals.setEditId}
        onDelete={modals.setDeleteId}
        onDetail={modals.setDetailId}
      />

      {/* Export */}
      {modals.showExport && (
        <PenugasanExportModal
          onClose={() => modals.setShowExport(false)}
          onExportComplete={() =>
            showToast("Data penugasan berhasil diekspor.", "success")
          }
          allData={tickets}
          filteredData={filtered}
        />
      )}

      {/* Create */}
      {modals.showCreate && isAdminCabang && (
        <PenugasanCreateModal
          onClose={() => modals.setShowCreate(false)}
          onCreate={handleCreate}
          pelanggan={pelanggan}
          unitId={unitId}
        />
      )}

      {/* Assign */}
      {assignTicket && isAdminCabang && (
        <PenugasanAssignModal
          ticket={assignTicket}
          onClose={() => modals.setAssignId(null)}
          onAssign={(idTeknisi) => handleAssign(assignTicket.id, idTeknisi)}
          teknisi={loadingTeknisi ? [] : teknisi}
        />
      )}

      {/* Detail */}
      {detailTicket && !assignTicket && (
        <PenugasanDetailModal
          ticket={detailTicket}
          onClose={() => modals.setDetailId(null)}
          onPickTeknisi={async () => {
            modals.setDetailId(null);
            modals.setAssignId(detailTicket.id);
            await loadTeknisi();
          }}
          onRequestCancel={() => {
            // Tutup modal detail terlebih dahulu.
            modals.setDetailId(null);

            // Buka modal konfirmasi pembatalan.
            modals.setCancelId(detailTicket.id);
          }}
          isAdminCabang={isAdminCabang}
        />
      )}

      {/* Cancel */}
      {cancelTicket && isAdminCabang && (
        <PenugasanCancelModal
          ticket={cancelTicket}
          onClose={() => modals.setCancelId(null)}
          onConfirm={() => handleCancel(cancelTicket.id)}
        />
      )}

      {/* Edit */}
      {editTicket && isAdminCabang && (
        <PenugasanEditModal
          ticket={editTicket}
          onClose={() => modals.setEditId(null)}
          onSave={handleUpdate}
        />
      )}

      {/* Delete */}
      {deleteTicket && isAdminCabang && (
        <PenugasanDeleteModal
          ticket={deleteTicket}
          onClose={() => modals.setDeleteId(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
