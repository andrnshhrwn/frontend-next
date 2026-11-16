"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  pengirimanWmService,
  type PengirimanWm,
} from "@/services/pengirimanService";
import { unitService, type Unit } from "@/services/unitService";
import { merkWMService, type MerkWM } from "@/services/merkWMService";
import {
  stokWmService,
  type StokWmItem,
  type StokWmSummary,
} from "@/services/stokWmService";
import { getErrorMessage } from "@/utils/pengirimanWm.utils";

const initialStokSummary: StokWmSummary = {
  total_dikirim: 0,
  total_terpasang: 0,
  stok_tersedia: 0,
};

export function usePengirimanWmData() {
  const { loading: authLoading, isAuthenticated } = useAuth();

  const [pengirimanList, setPengirimanList] = useState<PengirimanWm[]>([]);
  const [unitList, setUnitList] = useState<Unit[]>([]);
  const [merkList, setMerkList] = useState<MerkWM[]>([]);
  const [stokWmList, setStokWmList] = useState<StokWmItem[]>([]);
  const [stokSummary, setStokSummary] =
    useState<StokWmSummary>(initialStokSummary);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const clearData = useCallback(() => {
    setPengirimanList([]);
    setUnitList([]);
    setMerkList([]);
    setStokWmList([]);
    setStokSummary(initialStokSummary);
  }, []);

  const fetchData = useCallback(async () => {
    if (authLoading || !isAuthenticated) {
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const [pengiriman, units, merks, stokResponse] = await Promise.all([
        pengirimanWmService.findAll(),
        unitService.findAll(),
        merkWMService.findAll(),
        stokWmService.getStok(),
      ]);

      setPengirimanList(pengiriman);
      setUnitList(units);
      setMerkList(merks);
      setStokWmList(stokResponse.data);
      setStokSummary(stokResponse.summary);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      clearData();
      setIsLoading(false);
      setErrorMessage("");
      return;
    }

    void fetchData();
  }, [authLoading, isAuthenticated, fetchData, clearData]);

  return {
    pengirimanList,
    unitList,
    merkList,
    stokWmList,
    stokSummary,
    isLoading,
    errorMessage,
    fetchData,
  };
}
