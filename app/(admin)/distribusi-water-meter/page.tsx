"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Download,
  Plus,
  ArrowUpRight,
  MapPin,
  CheckCircle2,
  Truck,
  PackageCheck,
  Calendar,
  Building2,
  FileText,
} from "lucide-react";
import {
  PageHeader,
  StatCard,
  SearchInput,
  SelectDropdown,
  Pagination,
  ExportModal,
} from "@/components/ui";

import {
  pengirimanWmService,
  type PengirimanWm,
  type CreatePengirimanWmPayload,
} from "@/services/pengirimanService";

import { unitService, type Unit } from "@/services/unitService";
import { merkWMService, type MerkWM } from "@/services/merkWMService";

// ======================================================
// TYPES
// ======================================================

export interface PengirimanDetailItem {
  id_merk: string;
  merk: string;
  ukuran_dn: string;
  jumlah: number;
}

interface FormDetailItem {
  id_merk: string;
  ukuran_dn: string;
  jumlah: number;
}

const EXPORT_COLUMNS = [
  { id: "noPengiriman", label: "No. Pengiriman" },
  { id: "tglPengiriman", label: "Tanggal" },
  { id: "unitTujuan", label: "Unit Tujuan" },
  { id: "totalWm", label: "Total WM" },
  { id: "catatan", label: "Catatan" },
];

const ITEMS_PER_PAGE = 8;

// ======================================================
// HELPERS
// ======================================================

function getTodayDate(): string {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Terjadi kesalahan yang tidak diketahui.";
}

// ======================================================
// PAGE
// ======================================================

export default function DistribusiWaterMeterPage() {
  const [activeTab, setActiveTab] = useState<"stok" | "pengiriman">("stok");

  // Data dari backend
  const [pengirimanList, setPengirimanList] = useState<PengirimanWm[]>([]);
  const [unitList, setUnitList] = useState<Unit[]>([]);
  const [merkList, setMerkList] = useState<MerkWM[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Filter dan pagination
  const [search, setSearch] = useState("");
  const [cabangFilter, setCabangFilter] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal
  const [addPengirimanOpen, setAddPengirimanOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [selectedPengiriman, setSelectedPengiriman] =
    useState<PengirimanWm | null>(null);

  // Form pengiriman
  const [formNoPengiriman, setFormNoPengiriman] = useState("");
  const [formTglPengiriman, setFormTglPengiriman] = useState(getTodayDate());
  const [formUnitTujuan, setFormUnitTujuan] = useState("");
  const [formCatatan, setFormCatatan] = useState("");

  const [formDetails, setFormDetails] = useState<FormDetailItem[]>([]);

  // ======================================================
  // FETCH DATA BACKEND
  // ======================================================

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const [pengiriman, units, merks] = await Promise.all([
        pengirimanWmService.findAll(),
        unitService.findAll(),
        merkWMService.findAll(),
      ]);

      setPengirimanList(pengiriman);
      setUnitList(units);
      setMerkList(merks);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  // Set unit default setelah data unit tersedia.
  useEffect(() => {
    if (!formUnitTujuan && unitList.length > 0) {
      setFormUnitTujuan(unitList[0].id_unit);
    }
  }, [unitList, formUnitTujuan]);

  // ======================================================
  // TOTAL PERHITUNGAN PENGIRIMAN
  // ======================================================

  const totalPengirimanWM = useMemo(() => {
    return pengirimanList.reduce((acc, curr) => acc + curr.total_wm, 0);
  }, [pengirimanList]);

  // ======================================================
  // FILTERED DATASET PENGIRIMAN
  // ======================================================

  const filteredPengiriman = useMemo(() => {
    return pengirimanList.filter((item) => {
      const namaUnit = item.unit_tujuan?.nama_unit ?? "";
      const catatan = item.catatan ?? "";

      const matchSearch =
        item.no_pengiriman.toLowerCase().includes(search.toLowerCase()) ||
        namaUnit.toLowerCase().includes(search.toLowerCase()) ||
        catatan.toLowerCase().includes(search.toLowerCase());

      const matchCabang = cabangFilter === "Semua" || namaUnit === cabangFilter;

      return matchSearch && matchCabang;
    });
  }, [pengirimanList, search, cabangFilter]);

  // ======================================================
  // FILTER UNIT
  // ======================================================

  const filteredUnit = useMemo(() => {
    return unitList.filter((unit) => {
      const matchSearch = unit.nama_unit
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchCabang =
        cabangFilter === "Semua" || unit.nama_unit === cabangFilter;

      return matchSearch && matchCabang;
    });
  }, [unitList, search, cabangFilter]);

  // ======================================================
  // PAGINATION
  // ======================================================

  const totalPages = Math.ceil(filteredPengiriman.length / ITEMS_PER_PAGE);

  const paginatedPengiriman = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;

    return filteredPengiriman.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPengiriman, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, cabangFilter]);

  // ======================================================
  // HANDLE TAMBAH DETAIL MERK
  // ======================================================

  const handleAddDetailRow = () => {
    setFormDetails((prev) => [
      ...prev,
      {
        id_merk: merkList[0]?.id_merk ?? "",
        ukuran_dn: 'DN 15 (1/2")',
        jumlah: 50,
      },
    ]);
  };

  const handleDetailChange = (
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

  const handleRemoveDetailRow = (index: number) => {
    setFormDetails((prev) => prev.filter((_, i) => i !== index));
  };

  // ======================================================
  // RESET FORM
  // ======================================================

  const resetForm = () => {
    setFormNoPengiriman("");
    setFormTglPengiriman(getTodayDate());
    setFormUnitTujuan(unitList[0]?.id_unit ?? "");
    setFormCatatan("");

    setFormDetails(
      merkList.length > 0
        ? [
            {
              id_merk: merkList[0].id_merk,
              ukuran_dn: 'DN 15 (1/2")',
              jumlah: 100,
            },
          ]
        : [],
    );
  };

  const handleOpenAddModal = () => {
    resetForm();
    setErrorMessage("");
    setAddPengirimanOpen(true);
  };

  // ======================================================
  // SUBMIT CATATAN PENGIRIMAN
  // ======================================================

  const handleSubmitPengiriman = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formUnitTujuan) {
      setErrorMessage("Silakan pilih unit tujuan.");
      return;
    }

    if (formDetails.length === 0) {
      setErrorMessage("Minimal harus ada satu rincian WM.");
      return;
    }

    const invalidDetail = formDetails.some(
      (item) =>
        !item.id_merk ||
        !item.ukuran_dn.trim() ||
        !Number.isInteger(Number(item.jumlah)) ||
        Number(item.jumlah) <= 0,
    );

    if (invalidDetail) {
      setErrorMessage(
        "Pastikan merk, ukuran DN, dan jumlah WM sudah diisi dengan benar.",
      );
      return;
    }

    const payload: CreatePengirimanWmPayload = {
      no_pengiriman: formNoPengiriman.trim(),
      tgl_pengiriman: formTglPengiriman,
      id_unit_tujuan: formUnitTujuan,
      catatan: formCatatan.trim() || null,
      details: formDetails.map((item) => ({
        id_merk: item.id_merk,
        ukuran_dn: item.ukuran_dn.trim(),
        jumlah: Number(item.jumlah),
      })),
    };

    setIsSaving(true);

    try {
      await pengirimanWmService.create(payload);

      setAddPengirimanOpen(false);
      resetForm();

      await fetchData();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  // ======================================================
  // EKSPOR CSV
  // ======================================================

  const handleExport = ({
    scope,
    selectedCols,
  }: {
    scope: "filtered" | "all";
    selectedCols: string[];
  }) => {
    const target = scope === "filtered" ? filteredPengiriman : pengirimanList;

    const header = selectedCols
      .map(
        (column) =>
          EXPORT_COLUMNS.find((col) => col.id === column)?.label || column,
      )
      .join(",");

    const rows = target.map((item) => {
      return selectedCols
        .map((column) => {
          let value: string | number = "";

          switch (column) {
            case "noPengiriman":
              value = item.no_pengiriman;
              break;

            case "tglPengiriman":
              value = item.tgl_pengiriman;
              break;

            case "unitTujuan":
              value = item.unit_tujuan?.nama_unit ?? "";
              break;

            case "totalWm":
              value = item.total_wm;
              break;

            case "catatan":
              value = item.catatan ?? "";
              break;
          }

          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(",");
    });

    const csvContent = [header, ...rows].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `catatan-pengiriman-wm-${Date.now()}.csv`;
    a.click();

    URL.revokeObjectURL(url);
  };

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Monitoring & Pengiriman Water Meter"
        subtitle="Pencatatan pengiriman Water Meter dari Pusat ke Cabang dan monitoring ketersediaan stok unit secara real-time."
        badge="PAM Tirta Kamuning - Pusat"
        badgeVariant="primary"
      >
        <button
          onClick={() => setExportModalOpen(true)}
          disabled={pengirimanList.length === 0}
          className="btn btn-sm btn-outline border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5" />
          Ekspor CSV
        </button>

        <button
          onClick={handleOpenAddModal}
          disabled={unitList.length === 0 || merkList.length === 0}
          className="btn btn-sm bg-pdam-primary hover:bg-pdam-primary/90 text-white border-none shadow-xs disabled:opacity-50"
        >
          <Plus className="w-3.5 h-3.5" />
          Catat Pengiriman WM (Pusat)
        </button>
      </PageHeader>

      {/* Error Fetch Data */}
      {errorMessage && !addPengirimanOpen && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700 flex justify-between items-center gap-3">
          <span>{errorMessage}</span>

          <button
            type="button"
            onClick={() => void fetchData()}
            className="font-semibold hover:underline"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* KPI Stats Monitoring */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total WM Dikirim Pusat"
          value={totalPengirimanWM.toLocaleString("id-ID")}
          subtext="Akumulasi pengiriman ke seluruh cabang"
          icon={<Truck className="w-5 h-5" />}
          variant="slate"
        />

        <StatCard
          title="Tersedia di Unit (Sisa Stok)"
          value="-"
          subtext="Belum tersedia dari data backend"
          icon={<PackageCheck className="w-5 h-5" />}
          variant="primary"
        />

        <StatCard
          title="Terpasang di Pelanggan"
          value="-"
          subtext="Menunggu data validasi BAP"
          icon={<CheckCircle2 className="w-5 h-5" />}
          variant="navy"
        />

        <StatCard
          title="Unit Cabang Penerima"
          value={`${unitList.length} Cabang`}
          subtext="Jumlah unit terdaftar"
          icon={<Building2 className="w-5 h-5" />}
          variant="slate"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 flex gap-4">
        <button
          onClick={() => setActiveTab("stok")}
          className={`pb-3 px-1 text-sm font-semibold transition border-b-2 ${
            activeTab === "stok"
              ? "border-pdam-primary text-pdam-primary"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Monitoring Ketersediaan Stok Unit
        </button>

        <button
          onClick={() => setActiveTab("pengiriman")}
          className={`pb-3 px-1 text-sm font-semibold transition border-b-2 ${
            activeTab === "pengiriman"
              ? "border-pdam-primary text-pdam-primary"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Catatan Riwayat Pengiriman (Pusat)
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 text-center text-sm text-slate-500">
          Memuat data pengiriman WM...
        </div>
      )}

      {/* TAB 1: MONITORING STOK UNIT CABANG */}
      {!isLoading && activeTab === "stok" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Cari unit cabang..."
              className="w-full sm:max-w-md"
            />

            <SelectDropdown
              value={cabangFilter}
              onChange={setCabangFilter}
              options={["Semua", ...unitList.map((unit) => unit.nama_unit)]}
              icon={<MapPin className="w-3.5 h-3.5" />}
              className="w-full sm:w-56"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUnit.map((unit) => {
              const unitPengiriman = pengirimanList.filter(
                (item) => item.id_unit_tujuan === unit.id_unit,
              );

              const totalDikirim = unitPengiriman.reduce(
                (sum, item) => sum + item.total_wm,
                0,
              );

              return (
                <div
                  key={unit.id_unit}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                        Unit Cabang
                      </span>

                      <h4 className="text-base font-bold text-slate-800">
                        {unit.nama_unit}
                      </h4>
                    </div>

                    <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                      {totalDikirim.toLocaleString("id-ID")} WM Dikirim
                    </span>
                  </div>

                  <div className="border-t border-slate-100 pt-3 space-y-2">
                    <div className="text-xs font-semibold text-slate-600">
                      Rincian Pengiriman per Merk:
                    </div>

                    {unitPengiriman
                      .flatMap((item) => item.details)
                      .map((detail, idx) => (
                        <div
                          key={`${detail.id_detail}-${idx}`}
                          className="flex justify-between items-center text-xs bg-slate-50 p-2 rounded border border-slate-100"
                        >
                          <span className="font-medium text-slate-700">
                            {detail.merk.merk_wm}
                          </span>

                          <span className="font-mono font-bold text-pdam-primary">
                            {detail.jumlah.toLocaleString("id-ID")} Unit
                          </span>
                        </div>
                      ))}

                    {totalDikirim === 0 && (
                      <div className="text-xs text-slate-400 italic">
                        Belum ada catatan pengiriman.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredUnit.length === 0 && (
              <div className="col-span-full bg-white rounded-xl border border-slate-200 p-8 text-center text-sm text-slate-400">
                Tidak ada unit cabang yang ditemukan.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CATATAN RIWAYAT PENGIRIMAN */}
      {!isLoading && activeTab === "pengiriman" && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Cari no. pengiriman, unit tujuan, atau catatan..."
              className="w-full sm:max-w-md"
            />

            <SelectDropdown
              value={cabangFilter}
              onChange={setCabangFilter}
              options={["Semua", ...unitList.map((unit) => unit.nama_unit)]}
              icon={<MapPin className="w-3.5 h-3.5" />}
              className="w-full sm:w-56"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">No. Pengiriman & Tanggal</th>
                  <th className="py-3 px-4">Unit Tujuan</th>
                  <th className="py-3 px-4">Total Pengiriman</th>
                  <th className="py-3 px-4">Rincian Merk & Jumlah</th>
                  <th className="py-3 px-4">Catatan</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-xs">
                {paginatedPengiriman.map((item) => (
                  <tr
                    key={item.id_pengiriman}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-pdam-primary block">
                        {item.no_pengiriman}
                      </span>

                      <span className="text-[10px] text-slate-400 inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.tgl_pengiriman}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      <span className="inline-block bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded text-[11px] font-medium">
                        {item.unit_tujuan?.nama_unit ?? "-"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {item.total_wm.toLocaleString("id-ID")} Unit
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        {item.details.map((detail) => (
                          <div
                            key={detail.id_detail}
                            className="text-[11px] text-slate-600"
                          >
                            •{" "}
                            <span className="font-semibold">
                              {detail.merk.merk_wm}
                            </span>
                            : {detail.jumlah.toLocaleString("id-ID")} Unit
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                      {item.catatan || "-"}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedPengiriman(item)}
                        className="text-pdam-primary hover:text-pdam-navy font-semibold hover:underline inline-flex items-center gap-1 text-xs"
                      >
                        Detail <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}

                {paginatedPengiriman.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-12 text-center text-slate-400"
                    >
                      Tidak ada catatan pengiriman yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-100">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredPengiriman.length}
              onPageChange={setCurrentPage}
              startIndex={(currentPage - 1) * ITEMS_PER_PAGE}
              endIndex={Math.min(
                currentPage * ITEMS_PER_PAGE,
                filteredPengiriman.length,
              )}
            />
          </div>
        </div>
      )}

      {/* MODAL INPUT CATATAN PENGIRIMAN */}
      {addPengirimanOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="font-bold text-slate-800 text-base">
                  Catat Pengiriman Water Meter (Pusat)
                </h3>

                <p className="text-xs text-slate-500">
                  Input catatan pengiriman ke unit cabang secara berjenjang per
                  merk.
                </p>
              </div>

              <button
                onClick={() => setAddPengirimanOpen(false)}
                disabled={isSaving}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmitPengiriman}
              className="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
            >
              {errorMessage && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    No. Pengiriman
                  </label>

                  <input
                    type="text"
                    placeholder="Contoh: SHIP/2026/10/001"
                    value={formNoPengiriman}
                    onChange={(e) => setFormNoPengiriman(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pdam-primary/20"
                    maxLength={50}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Pengiriman
                  </label>

                  <input
                    type="date"
                    value={formTglPengiriman}
                    onChange={(e) => setFormTglPengiriman(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pdam-primary/20"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Unit Cabang Tujuan
                </label>

                <select
                  value={formUnitTujuan}
                  onChange={(e) => setFormUnitTujuan(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pdam-primary/20"
                  required
                >
                  <option value="">Pilih Unit Tujuan</option>

                  {unitList.map((unit) => (
                    <option key={unit.id_unit} value={unit.id_unit}>
                      {unit.nama_unit}
                    </option>
                  ))}
                </select>
              </div>

              {/* SECTION DETAIL MERK BERJENJANG */}
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-slate-800">
                    Rincian Jumlah berdasarkan Merk WM
                  </label>

                  <button
                    type="button"
                    onClick={handleAddDetailRow}
                    className="text-xs text-pdam-primary font-semibold hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Tambah Merk
                  </button>
                </div>

                {formDetails.map((detail, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200"
                  >
                    <div className="flex-1">
                      <select
                        value={detail.id_merk}
                        onChange={(e) =>
                          handleDetailChange(index, "id_merk", e.target.value)
                        }
                        className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded focus:outline-none"
                        required
                      >
                        <option value="">Pilih Merk WM</option>

                        {merkList.map((merk) => (
                          <option key={merk.id_merk} value={merk.id_merk}>
                            {merk.merk_wm}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-32">
                      <input
                        type="text"
                        placeholder="Ukuran DN"
                        value={detail.ukuran_dn}
                        onChange={(e) =>
                          handleDetailChange(index, "ukuran_dn", e.target.value)
                        }
                        maxLength={20}
                        className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded font-mono focus:outline-none"
                        required
                      />
                    </div>

                    <div className="w-32">
                      <input
                        type="number"
                        placeholder="Jumlah"
                        value={detail.jumlah}
                        onChange={(e) =>
                          handleDetailChange(
                            index,
                            "jumlah",
                            Number(e.target.value),
                          )
                        }
                        className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded font-mono font-bold focus:outline-none"
                        min="1"
                        step="1"
                        required
                      />
                    </div>

                    {formDetails.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveDetailRow(index)}
                        className="text-red-500 hover:text-red-700 text-xs font-bold px-1"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}

                {formDetails.length === 0 && (
                  <p className="text-xs text-slate-400 italic">
                    Belum ada rincian WM. Klik Tambah Merk untuk menambahkan.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan
                </label>

                <textarea
                  rows={2}
                  placeholder="Catatan pengiriman..."
                  value={formCatatan}
                  onChange={(e) => setFormCatatan(e.target.value)}
                  maxLength={5000}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pdam-primary/20"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddPengirimanOpen(false)}
                  disabled={isSaving}
                  className="btn btn-sm btn-ghost text-slate-600"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn btn-sm bg-pdam-primary hover:bg-pdam-primary/90 text-white border-none disabled:opacity-50"
                >
                  {isSaving ? "Menyimpan..." : "Simpan Catatan Pengiriman"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DETAIL CATATAN PENGIRIMAN */}
      {selectedPengiriman && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-pdam-primary" />

                <div>
                  <h3 className="font-bold text-slate-800 text-sm">
                    Detail Pengiriman Water Meter
                  </h3>

                  <p className="text-[11px] font-mono text-slate-500">
                    {selectedPengiriman.no_pengiriman}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPengiriman(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Tanggal Pengiriman
                  </span>

                  <span className="font-semibold text-slate-800">
                    {selectedPengiriman.tgl_pengiriman}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Unit Cabang Tujuan
                  </span>

                  <span className="font-semibold text-slate-800">
                    {selectedPengiriman.unit_tujuan?.nama_unit ?? "-"}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block font-bold mb-2">
                  Rincian Breakdown Merk & Ukuran:
                </span>

                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-[10px] font-bold text-slate-600 uppercase">
                        <th className="py-2 px-3">Merk Water Meter</th>
                        <th className="py-2 px-3">Ukuran DN</th>
                        <th className="py-2 px-3 text-right">Jumlah</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {selectedPengiriman.details.map((detail) => (
                        <tr key={detail.id_detail}>
                          <td className="py-2 px-3 font-medium text-slate-800">
                            {detail.merk.merk_wm}
                          </td>

                          <td className="py-2 px-3 font-mono text-slate-500">
                            {detail.ukuran_dn}
                          </td>

                          <td className="py-2 px-3 text-right font-mono font-bold text-pdam-primary">
                            {detail.jumlah.toLocaleString("id-ID")} Unit
                          </td>
                        </tr>
                      ))}
                    </tbody>

                    <tfoot>
                      <tr className="bg-slate-50 font-bold text-slate-900 border-t border-slate-200">
                        <td colSpan={2} className="py-2.5 px-3 text-right">
                          Total Akumulasi:
                        </td>

                        <td className="py-2.5 px-3 text-right font-mono text-pdam-primary">
                          {selectedPengiriman.total_wm.toLocaleString("id-ID")}{" "}
                          Unit
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block font-bold mb-1">
                  Catatan Pengiriman:
                </span>

                <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-slate-600 italic">
                  {selectedPengiriman.catatan || "Tidak ada catatan khusus."}
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedPengiriman(null)}
                  className="btn btn-sm bg-slate-800 hover:bg-slate-900 text-white border-none"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        columns={EXPORT_COLUMNS}
        totalFiltered={filteredPengiriman.length}
        totalAll={pengirimanList.length}
        onExport={handleExport}
      />
    </div>
  );
}
