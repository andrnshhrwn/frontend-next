"use client";

import { useState } from "react";

import { validasiService, type ValidasiBap } from "@/services/validasiService";

import { getErrorMessage } from "@/utils/validasi.utils";

export function useValidasiDetail(processing: boolean) {
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [reviewItem, setReviewItem] = useState<ValidasiBap | null>(null);

  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState("");

  const openDetail = async (id: string): Promise<void> => {
    setReviewId(id);
    setReviewItem(null);
    setDetailError("");

    try {
      setLoadingDetail(true);

      const detail = await validasiService.findById(id);

      setReviewItem(detail);
    } catch (error) {
      setDetailError(getErrorMessage(error));
    } finally {
      setLoadingDetail(false);
    }
  };

  const closeDetail = (): void => {
    if (processing) {
      return;
    }

    setReviewId(null);
    setReviewItem(null);
    setDetailError("");
  };

  const resetDetail = (): void => {
    setReviewId(null);
    setReviewItem(null);
    setDetailError("");
  };

  return {
    reviewId,
    reviewItem,
    loadingDetail,
    detailError,
    openDetail,
    closeDetail,
    resetDetail,
  };
}
