import { useState } from "react";

export function usePenugasanModals() {
  const [showExport, setShowExport] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const [assignId, setAssignId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return {
    showExport,
    setShowExport,
    showCreate,
    setShowCreate,
    assignId,
    setAssignId,
    detailId,
    setDetailId,
    cancelId,
    setCancelId,
    editId,
    setEditId,
    deleteId,
    setDeleteId,
  };
}
