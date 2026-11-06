import { useState } from "react";

import type { Pelanggan } from "@/types/pelanggan.types";

export function usePelangganForm() {
  const [formState, setFormState] = useState<{
    open: boolean;
    id: string | null;
  }>({
    open: false,
    id: null,
  });

  const [detailId, setDetailId] = useState<string | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Pelanggan | null>(null);

  const openCreate = () => {
    setFormState({
      open: true,
      id: null,
    });
  };

  const openEdit = (customer: Pelanggan) => {
    setFormState({
      open: true,
      id: customer.id,
    });
  };

  const closeForm = () => {
    setFormState({
      open: false,
      id: null,
    });
  };

  const openDetail = (customer: Pelanggan) => {
    setDetailId(customer.id);
  };

  const closeDetail = () => {
    setDetailId(null);
  };

  const editFromDetail = (customer: Pelanggan) => {
    setDetailId(null);

    setFormState({
      open: true,
      id: customer.id,
    });
  };

  const editingCustomer = (customers: Pelanggan[]) =>
    customers.find((customer) => customer.id === formState.id) ?? null;

  const detailCustomer = (customers: Pelanggan[]) =>
    customers.find((customer) => customer.id === detailId) ?? null;

  return {
    formState,
    setFormState,
    detailId,
    importOpen,
    setImportOpen,
    deleteTarget,
    setDeleteTarget,
    openCreate,
    openEdit,
    closeForm,
    openDetail,
    closeDetail,
    editFromDetail,
    editingCustomer,
    detailCustomer,
  };
}
