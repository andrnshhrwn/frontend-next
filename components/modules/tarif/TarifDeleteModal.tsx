import { DeleteConfirmModal } from "@/components/ui";
import type { Tarif } from "@/types/tarif.types";

interface TarifDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  deletingTarif: Tarif | null;
}

export default function TarifDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  deletingTarif,
}: TarifDeleteModalProps) {
  return (
    <DeleteConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Hapus Golongan Tarif"
      itemName={deletingTarif?.nama_tarif ?? ""}
      itemType="golongan tarif"
      warningText="Tindakan ini tidak dapat dibatalkan. Golongan tarif tidak dapat dihapus jika masih digunakan oleh pelanggan."
    />
  );
}
