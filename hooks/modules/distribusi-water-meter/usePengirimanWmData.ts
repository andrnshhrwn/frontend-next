"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useAuthStore } from "@/lib/auth/auth-store";

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
  // Status autentikasi dari Zustand.
  const authStatus = useAuthStore((state) => state.status);

  const isAuthenticated = authStatus === "authenticated";
  const authLoading = authStatus === "idle" || authStatus === "checking";

  const [pengirimanList, setPengirimanList] = useState<PengirimanWm[]>([]);
  const [unitList, setUnitList] = useState<Unit[]>([]);
  const [merkList, setMerkList] = useState<MerkWM[]>([]);
  const [stokWmList, setStokWmList] = useState<StokWmItem[]>([]);

  const [stokSummary, setStokSummary] =
    useState<StokWmSummary>(initialStokSummary);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Mencegah request lama mengubah state setelah sesi berubah.
  const requestIdRef = useRef(0);

  // Membersihkan seluruh data.
  const clearData = useCallback(() => {
    requestIdRef.current += 1;

    setPengirimanList([]);
    setUnitList([]);
    setMerkList([]);
    setStokWmList([]);
    setStokSummary(initialStokSummary);
  }, []);

  // Mengambil seluruh data distribusi WM.
  const fetchData = useCallback(async () => {
    // Jangan mengambil data sebelum autentikasi selesai.
    if (authStatus !== "authenticated") {
      return;
    }

    const currentRequestId = ++requestIdRef.current;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const [pengiriman, units, merks, stokResponse] = await Promise.all([
        pengirimanWmService.findAll(),
        unitService.findAll(),
        merkWMService.findAll(),
        stokWmService.getStok(),
      ]);

      // Abaikan hasil request yang sudah tidak relevan.
      if (currentRequestId !== requestIdRef.current) {
        return;
      }

      setPengirimanList(pengiriman);
      setUnitList(units);
      setMerkList(merks);
      setStokWmList(stokResponse.data);
      setStokSummary(stokResponse.summary);
    } catch (error: unknown) {
      if (currentRequestId !== requestIdRef.current) {
        return;
      }

      setErrorMessage(getErrorMessage(error));
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [authStatus]);

  // Sinkronisasi data dengan status autentikasi.
  useEffect(() => {
    if (authLoading) {
      setIsLoading(true);
      return;
    }

    if (!isAuthenticated) {
      clearData();
      setIsLoading(false);

      if (authStatus === "error") {
        setErrorMessage(
          "Gagal memverifikasi sesi pengguna. Silakan muat ulang halaman atau login kembali.",
        );
      } else {
        setErrorMessage("");
      }

      return;
    }

    void fetchData();

    return () => {
      // Invalidasi request ketika effect dijalankan ulang
      // atau komponen dilepas.
      requestIdRef.current += 1;
    };
  }, [authStatus, authLoading, isAuthenticated, fetchData, clearData]);

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
