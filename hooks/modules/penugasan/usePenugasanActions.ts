import { penugasanService } from "@/services/penugasanService";

import type {
  PenugasanUpdatePayload,
  TicketInput,
} from "@/types/penugasan.types";

interface UsePenugasanActionsOptions {
  loadData: () => Promise<void>;
  setCurrentPage: (page: number) => void;
  setCancelId: (id: string | null) => void;
  showToast: (message: string, type: "success") => void;
}

export function usePenugasanActions({
  loadData,
  setCurrentPage,
  setCancelId,
  showToast,
}: UsePenugasanActionsOptions) {
  const handleCreate = async (payload: TicketInput) => {
    await penugasanService.create(payload);

    showToast("Penugasan berhasil dibuat.", "success");

    await loadData();
    setCurrentPage(1);
  };

  const handleAssign = async (ticketId: string, idTeknisi: string) => {
    await penugasanService.assignTeknisi(ticketId, {
      id_teknisi: idTeknisi,
    });

    showToast("Teknisi berhasil ditetapkan.", "success");

    await loadData();
  };

  const handleUpdate = async (id: string, payload: PenugasanUpdatePayload) => {
    await penugasanService.update(id, payload);

    showToast("Penugasan berhasil diperbarui.", "success");

    await loadData();
  };

  const handleDelete = async (id: string) => {
    await penugasanService.delete(id);

    showToast("Penugasan berhasil dihapus.", "success");

    await loadData();
  };

  const handleCancel = async (ticketId: string) => {
    await penugasanService.cancel(ticketId);

    showToast("Penugasan berhasil dibatalkan.", "success");

    setCancelId(null);

    await loadData();
  };

  return {
    handleCreate,
    handleAssign,
    handleUpdate,
    handleDelete,
    handleCancel,
  };
}
