import { DeleteConfirmModal } from "@/components/ui";
import type { Unit } from "@/types/unit.types";

interface UnitDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  deletingUnit: Unit | null;
}

export default function UnitDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  deletingUnit,
}: UnitDeleteModalProps) {
  return (
    <DeleteConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Hapus Unit"
      itemName={deletingUnit?.nama_unit ?? ""}
      itemType="unit"
      warningText="Pastikan unit tidak sedang digunakan oleh data atau transaksi lain. Penghapusan dapat ditolak oleh backend jika masih memiliki relasi."
    />
  );
}
