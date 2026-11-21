"use client";

import { useMemo, useState } from "react";

import { AlertCircle, Loader2, ShieldCheck } from "lucide-react";

import { BaseModal, ExportModal, useToast } from "@/components/ui";

import { validasiService } from "@/services/validasiService";

import {
  ValidasiError,
  ValidasiFilters,
  ValidasiHeader,
  ValidasiReviewModal,
  ValidasiStats,
  ValidasiTable,
} from "@/components/modules/validasi";

import { useValidasiData } from "@/hooks/modules/validasi/useValidasiData";
import { useValidasiDetail } from "@/hooks/modules/validasi/useValidasiDetail";
import { useValidasiExport } from "@/hooks/modules/validasi/useValidasiExport";

import type { StatusFilter } from "@/types/validasi.types";

import {
  exportColumns,
  matchesSearch,
  PAGE_LIMIT,
} from "@/utils/validasi.utils";
import { useAuthStore, useHasRole } from "@/lib/auth/auth-store";

export default function ValidasiPage() {
  const { showToast } = useToast();
  // ACCESS CONTROL
  const canManageValidation = useHasRole("admin_pusat");

  const authStatus = useAuthStore((state) => state.status);

  const authLoading = authStatus === "idle" || authStatus === "checking";

  // PAGE STATE
  const [processing, setProcessing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Semua");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // DATA HOOK
  const { data, pagination, loading, refreshing, pageError, loadData } =
    useValidasiData(statusFilter, page);

  // DETAIL HOOK
  const {
    reviewId,
    reviewItem,
    loadingDetail,
    detailError,
    openDetail,
    closeDetail,
    resetDetail,
  } = useValidasiDetail(processing);

  // EXPORT HOOK
  const {
    showExport,
    setShowExport,
    preparingExport,
    exportRows,
    exportFilteredRows,
    prepareExport,
    handleExport,
  } = useValidasiExport({
    statusFilter,
    search,
    showToast,
  });

  // SEARCH
  const filtered = useMemo(() => {
    return data.filter((item) => matchesSearch(item, search));
  }, [data, search]);

  const handleSearchChange = (value: string): void => {
    setSearch(value);
    setPage(1);
  };

  // APPROVE
  const handleApprove = async (): Promise<void> => {
    if (!canManageValidation || !reviewItem) {
      return;
    }

    try {
      setProcessing(true);

      await validasiService.setujui(reviewItem.id_penggantian);

      resetDetail();

      showToast(
        "BAP berhasil disetujui. Nomor seri WM aktif pelanggan telah diperbarui.",
        "success",
      );

      await loadData(true);
    } finally {
      setProcessing(false);
    }
  };

  // REJECT
  const handleReject = async (catatan: string): Promise<void> => {
    if (!canManageValidation || !reviewItem) {
      return;
    }

    try {
      setProcessing(true);

      await validasiService.tolak(reviewItem.id_penggantian, {
        catatan_validasi: catatan,
      });

      resetDetail();

      showToast(
        "BAP berhasil ditolak. Catatan perbaikan telah disimpan.",
        "success",
      );

      await loadData(true);
    } finally {
      setProcessing(false);
    }
  };

  // FILTER STATUS
  const handleStatusChange = (status: StatusFilter): void => {
    setStatusFilter(status);
    setPage(1);
  };

  // PAGINATION
  const total = pagination?.total ?? 0;
  const currentPage = pagination?.page ?? page;
  const totalPages = pagination?.totalPages ?? 0;

  // RENDER
  return (
    <div className="space-y-6">
      <ValidasiHeader
        preparingExport={preparingExport}
        refreshing={refreshing}
        loading={loading}
        canManageValidation={canManageValidation}
        authLoading={authLoading}
        onExport={() => void prepareExport()}
        onRefresh={() => void loadData(true)}
      />

      <ValidasiStats
        total={total}
        currentPage={currentPage}
        totalPages={totalPages}
        displayed={filtered.length}
        pageLimit={PAGE_LIMIT}
      />

      <ValidasiFilters
        statusFilter={statusFilter}
        search={search}
        onStatusChange={handleStatusChange}
        onSearchChange={handleSearchChange}
      />

      <ValidasiError message={pageError} onRetry={() => void loadData(true)} />

      <ValidasiTable
        data={filtered}
        loading={loading}
        pagination={pagination}
        page={currentPage}
        total={total}
        pageLimit={PAGE_LIMIT}
        canManageValidation={canManageValidation}
        onPageChange={setPage}
        onOpenDetail={(id) => void openDetail(id)}
      />

      {reviewId &&
        (reviewItem ? (
          <ValidasiReviewModal
            key={reviewItem.id_penggantian}
            item={reviewItem}
            canManageValidation={canManageValidation}
            onClose={closeDetail}
            onApprove={handleApprove}
            onReject={handleReject}
            processing={processing}
          />
        ) : (
          <BaseModal
            isOpen
            onClose={closeDetail}
            title="Detail BAP"
            subtitle="Mengambil data dari backend"
            icon={<ShieldCheck className="w-5 h-5" />}
            maxWidth="md"
          >
            <div className="py-8 text-center">
              {loadingDetail ? (
                <>
                  <Loader2 className="w-7 h-7 animate-spin mx-auto text-pdam-primary" />

                  <p className="text-xs text-slate-500 mt-2">
                    Memuat detail BAP...
                  </p>
                </>
              ) : (
                <>
                  <AlertCircle className="w-7 h-7 mx-auto text-pdam-red" />

                  <p className="text-xs text-pdam-red mt-2">
                    {detailError || "Detail BAP tidak tersedia."}
                  </p>

                  <button
                    type="button"
                    onClick={() => void openDetail(reviewId)}
                    className="btn btn-sm btn-ghost mt-3"
                  >
                    Coba lagi
                  </button>
                </>
              )}
            </div>
          </BaseModal>
        ))}

      <ExportModal
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        title="Ekspor Data Validasi BAP"
        subtitle="Pilih cakupan data dan kolom yang ingin dimasukkan ke file CSV."
        columns={exportColumns}
        totalFiltered={exportFilteredRows.length}
        totalAll={exportRows.length}
        onExport={handleExport}
      />
    </div>
  );
}
