"use client";

import { ExportModal } from "@/components/ui";

import { EXPORT_COLUMNS } from "@/utils/merkWM.utils";

interface MerkWMExportModalProps {
  isOpen: boolean;
  totalFiltered: number;
  totalAll: number;
  onClose: () => void;
  onExport: (options: {
    scope: "filtered" | "all";
    selectedCols: string[];
  }) => void;
}

export default function MerkWMExportModal({
  isOpen,
  totalFiltered,
  totalAll,
  onClose,
  onExport,
}: MerkWMExportModalProps) {
  return (
    <ExportModal
      isOpen={isOpen}
      onClose={onClose}
      columns={EXPORT_COLUMNS}
      totalFiltered={totalFiltered}
      totalAll={totalAll}
      onExport={onExport}
    />
  );
}
