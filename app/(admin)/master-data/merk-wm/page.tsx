"use client";

import { AlertCircle, Download, Gauge, LoaderCircle, Plus } from "lucide-react";

import { PageHeader, StatCard } from "@/components/ui";
import { useMerkWM } from "@/hooks/modules/merk-wm/useMerkWM";
import MerkWMTable from "@/components/modules/merk-wm/MerkWMTable";
import MerkWMFormModal from "@/components/modules/merk-wm/MerkWMFormModal";
import MerkWMDeleteModal from "@/components/modules/merk-wm/MerkWMDeleteModal";
import MerkWMExportModal from "@/components/modules/merk-wm/MerkWMExportModal";

export default function DataMerkWMPage() {
  const merkWM = useMerkWM();

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
          onClick={() => merkWM.setExportModalOpen(true)}
          disabled={merkWM.data.length === 0}
          className="btn btn-sm btn-outline border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50"
        >
          <Download className="h-3.5 w-3.5" />
          Ekspor CSV
        </button>

        <button
          type="button"
          onClick={merkWM.openAdd}
          className="btn btn-sm border-none bg-pdam-primary text-white shadow-xs hover:bg-pdam-primary/90"
        >
          <Plus className="h-3.5 w-3.5" />
          Tambah Merk
        </button>
      </PageHeader>

      {/* Error halaman */}
      {merkWM.pageError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

          <div className="flex-1">{merkWM.pageError}</div>

          <button
            type="button"
            onClick={() => void merkWM.loadData()}
            disabled={merkWM.loading}
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
          value={merkWM.loading ? "..." : merkWM.totalWM}
          subtext="Jumlah data pada master merk"
          icon={<Gauge className="h-5 w-5" />}
          variant="primary"
        />
      </div>

      {/* Tabel dan pencarian */}
      <MerkWMTable
        loading={merkWM.loading}
        search={merkWM.search}
        paginated={merkWM.paginated}
        filteredLength={merkWM.filtered.length}
        safePage={merkWM.safePage}
        totalPages={merkWM.totalPages}
        onSearchChange={merkWM.changeSearch}
        onClearSearch={merkWM.clearSearch}
        onPageChange={merkWM.setCurrentPage}
        onEdit={merkWM.openEdit}
        onDelete={merkWM.setDeletingMerk}
      />

      {/* Modal tambah dan edit */}
      <MerkWMFormModal
        isOpen={merkWM.modalOpen}
        editing={Boolean(merkWM.editing)}
        saving={merkWM.saving}
        form={merkWM.form}
        error={merkWM.error}
        onClose={merkWM.closeFormModal}
        onSave={() => void merkWM.handleSave()}
        onFormChange={merkWM.setForm}
      />

      {/* Modal konfirmasi hapus */}
      <MerkWMDeleteModal
        item={merkWM.deletingMerk}
        deleting={merkWM.deleting}
        onClose={() => {
          if (!merkWM.deleting) {
            merkWM.setDeletingMerk(null);
          }
        }}
        onConfirm={() => void merkWM.confirmDelete()}
      />

      {/* Modal ekspor */}
      <MerkWMExportModal
        isOpen={merkWM.exportModalOpen}
        onClose={() => merkWM.setExportModalOpen(false)}
        totalFiltered={merkWM.filtered.length}
        totalAll={merkWM.data.length}
        onExport={merkWM.handleExport}
      />
    </div>
  );
}
