"use client";

import { DeleteConfirmModal } from "@/components/ui";

import type { MerkWM } from "@/types/merkWM.types";

interface MerkWMDeleteModalProps {
  item: MerkWM | null;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function MerkWMDeleteModal({
  item,
  deleting,
  onClose,
  onConfirm,
}: MerkWMDeleteModalProps) {
  return (
    <DeleteConfirmModal
      isOpen={Boolean(item)}
      onClose={() => {
        if (!deleting) {
          onClose();
        }
      }}
      onConfirm={onConfirm}
      itemName={item?.merk_wm ?? ""}
      itemType="merk water meter"
      warningText="Merk WM tidak dapat dihapus jika sudah digunakan pada detail pengiriman WM."
    />
  );
}
