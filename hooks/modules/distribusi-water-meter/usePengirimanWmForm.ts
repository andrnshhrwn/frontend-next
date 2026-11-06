"use client";

import { useState } from "react";

import type { PengirimanWm } from "@/services/pengirimanService";
import type { Unit } from "@/services/unitService";
import type { MerkWM } from "@/services/merkWMService";

import type { FormDetailItem } from "@/types/pengirimanWm.types";

import {
  createDefaultFormDetail,
  createEmptyFormDetail,
  getTodayDate,
} from "@/utils/pengirimanWm.utils";

export function usePengirimanWmForm(unitList: Unit[], merkList: MerkWM[]) {
  const [formModalOpen, setFormModalOpen] = useState(false);

  const [editingPengiriman, setEditingPengiriman] =
    useState<PengirimanWm | null>(null);

  const [formNoPengiriman, setFormNoPengiriman] = useState("");
  const [formTglPengiriman, setFormTglPengiriman] = useState(getTodayDate());

  const [formUnitTujuan, setFormUnitTujuan] = useState("");
  const [formCatatan, setFormCatatan] = useState("");

  const [formDetails, setFormDetails] = useState<FormDetailItem[]>([]);

  const resetForm = () => {
    setFormNoPengiriman("");
    setFormTglPengiriman(getTodayDate());
    setFormUnitTujuan(unitList[0]?.id_unit ?? "");
    setFormCatatan("");

    setFormDetails(
      merkList.length > 0 ? [createDefaultFormDetail(merkList[0].id_merk)] : [],
    );
  };

  const openAddModal = () => {
    setEditingPengiriman(null);
    resetForm();
    setFormModalOpen(true);
  };

  const openEditModal = (item: PengirimanWm) => {
    setEditingPengiriman(item);

    setFormNoPengiriman(item.no_pengiriman);
    setFormTglPengiriman(item.tgl_pengiriman.slice(0, 10));
    setFormUnitTujuan(item.id_unit_tujuan);
    setFormCatatan(item.catatan ?? "");

    setFormDetails(
      item.details.map((detail) => ({
        id_merk: detail.id_merk,
        ukuran_dn: detail.ukuran_dn,
        jumlah: detail.jumlah,
      })),
    );

    setFormModalOpen(true);
  };

  const closeFormModal = () => {
    setFormModalOpen(false);
    setEditingPengiriman(null);
  };

  const addDetailRow = () => {
    setFormDetails((prev) => [
      ...prev,
      createEmptyFormDetail(merkList[0]?.id_merk ?? ""),
    ]);
  };

  const changeDetail = (
    index: number,
    field: keyof FormDetailItem,
    value: string | number,
  ) => {
    setFormDetails((prev) => {
      const updated = [...prev];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return updated;
    });
  };

  const removeDetailRow = (index: number) => {
    setFormDetails((prev) =>
      prev.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  return {
    formModalOpen,
    setFormModalOpen,
    editingPengiriman,
    formNoPengiriman,
    setFormNoPengiriman,
    formTglPengiriman,
    setFormTglPengiriman,
    formUnitTujuan,
    setFormUnitTujuan,
    formCatatan,
    setFormCatatan,
    formDetails,
    resetForm,
    openAddModal,
    openEditModal,
    closeFormModal,
    addDetailRow,
    changeDetail,
    removeDetailRow,
  };
}
