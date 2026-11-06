"use client";

import { useCallback, useEffect, useState } from "react";

import {
  pengirimanWmService,
  type PengirimanWm,
} from "@/services/pengirimanService";

import { unitService, type Unit } from "@/services/unitService";
import { merkWMService, type MerkWM } from "@/services/merkWMService";
import { pelangganService, type Pelanggan } from "@/services/pelangganService";

import { getErrorMessage } from "@/utils/pengirimanWm.utils";

export function usePengirimanWmData() {
  const [pengirimanList, setPengirimanList] = useState<PengirimanWm[]>([]);
  const [unitList, setUnitList] = useState<Unit[]>([]);
  const [merkList, setMerkList] = useState<MerkWM[]>([]);
  const [pelangganList, setPelangganList] = useState<Pelanggan[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const [pengiriman, units, merks, pelanggan] = await Promise.all([
        pengirimanWmService.findAll(),
        unitService.findAll(),
        merkWMService.findAll(),
        pelangganService.findAll(),
      ]);

      setPengirimanList(pengiriman);
      setUnitList(units);
      setMerkList(merks);
      setPelangganList(pelanggan);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return {
    pengirimanList,
    unitList,
    merkList,
    pelangganList,
    isLoading,
    errorMessage,
    fetchData,
  };
}
