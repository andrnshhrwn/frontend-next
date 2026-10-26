// "use client";

// import React, { useMemo, useState } from "react";
// import {
//   Download,
//   Plus,
//   ArrowUpRight,
//   MapPin,
//   Layers,
//   CheckCircle2,
//   AlertTriangle,
//   RotateCcw,
// } from "lucide-react";
// import {
//   PageHeader,
//   StatCard,
//   StatusBadge,
//   SearchInput,
//   SelectDropdown,
//   Pagination,
//   ExportModal,
// } from "@/components/ui";
// import {
//   WaterMeterDetailModal,
//   WaterMeterAddModal,
//   type WaterMeterItem,
// } from "@/components/water-meter";

// const INITIAL_METERS: WaterMeterItem[] = [
//   {
//     noSeri: "WM-26-001201",
//     tahunPengadaan: 2026,
//     merk: "Itron Aquadis+",
//     dn: "DN 15 (1/2\")",
//     status: "Tersedia di Unit",
//     unitCabang: "Unit Kuningan",
//     lokasi: "Gudang Unit Kuningan",
//     detail: "Alokasi Pengadaan 2026",
//   },
//   {
//     noSeri: "WM-24-004891",
//     tahunPengadaan: 2024,
//     merk: "Linflow Multijet",
//     dn: "DN 15 (1/2\")",
//     status: "Terpasang",
//     unitCabang: "Unit Kuningan",
//     lokasi: "Bambang Setyawan",
//     detail: "PLG-KNG-089211 • Jl. Siliwangi No. 120",
//   },
//   {
//     noSeri: "WM-20-031209",
//     tahunPengadaan: 2020,
//     merk: "Bar-Meters Precision",
//     dn: "DN 20 (3/4\")",
//     status: "Rusak",
//     unitCabang: "Unit Cigugur",
//     lokasi: "Gudang Karantina Cigugur",
//     detail: "Macet / Rotor Aus • Eks: Perum Sukamulya",
//   },
//   {
//     noSeri: "WM-25-019943",
//     tahunPengadaan: 2025,
//     merk: "Onda Brass Core",
//     dn: "DN 15 (1/2\")",
//     status: "Terpasang",
//     unitCabang: "Unit Cilimus",
//     lokasi: "Dewi Anggraini",
//     detail: "PLG-CLM-067140 • Jl. Raya Bandorasa No. 14",
//   },
//   {
//     noSeri: "WM-26-001202",
//     tahunPengadaan: 2026,
//     merk: "Actaris Metron Cyble",
//     dn: "DN 25 (1\")",
//     status: "Tersedia di Unit",
//     unitCabang: "Unit Cilimus",
//     lokasi: "Gudang Unit Cilimus",
//     detail: "Alokasi Pengadaan 2026",
//   },
//   {
//     noSeri: "WM-23-077124",
//     tahunPengadaan: 2023,
//     merk: "Ningbo LXSG",
//     dn: "DN 15 (1/2\")",
//     status: "Terpasang",
//     unitCabang: "Unit Luragung",
//     lokasi: "H. Ahmad Fauzi",
//     detail: "PLG-LRG-031902 • Jl. Raya Luragung No. 45",
//   },
//   {
//     noSeri: "WM-26-001203",
//     tahunPengadaan: 2026,
//     merk: "Itron Flostar M",
//     dn: "DN 20 (3/4\")",
//     status: "Tersedia di Unit",
//     unitCabang: "Unit Ciawi",
//     lokasi: "Gudang Unit Ciawi",
//     detail: "Alokasi Pengadaan 2026",
//   },
//   {
//     noSeri: "WM-19-055102",
//     tahunPengadaan: 2019,
//     merk: "Linflow Classic",
//     dn: "DN 15 (1/2\")",
//     status: "Ditarik",
//     unitCabang: "Unit Kadugede",
//     lokasi: "Depo Retur Kadugede",
//     detail: "Kaca Pecah / Buram • Eks: Agus Supriyono",
//   },
//   {
//     noSeri: "WM-24-019944",
//     tahunPengadaan: 2024,
//     merk: "Onda Brass Core",
//     dn: "DN 15 (1/2\")",
//     status: "Terpasang",
//     unitCabang: "Unit Garawangi",
//     lokasi: "Siti Nurhaliza",
//     detail: "PLG-GRW-077192 • Jl. Raya Garawangi No. 8",
//   },
//   {
//     noSeri: "WM-26-001204",
//     tahunPengadaan: 2026,
//     merk: "Itron Aquadis+",
//     dn: "DN 15 (1/2\")",
//     status: "Tersedia di Unit",
//     unitCabang: "Unit Japara",
//     lokasi: "Gudang Unit Japara",
//     detail: "Alokasi Pengadaan 2026",
//   },
//   {
//     noSeri: "WM-25-018821",
//     tahunPengadaan: 2025,
//     merk: "Linflow Multijet",
//     dn: "DN 15 (1/2\")",
//     status: "Terpasang",
//     unitCabang: "Unit Cidahu",
//     lokasi: "Dede Suryana",
//     detail: "PLG-CDH-018821 • Desa Cieurih No. 12",
//   },
// ];

// const CABANG_OPTIONS = [
//   "Unit Kuningan",
//   "Unit Cilimus",
//   "Unit Cigugur",
//   "Unit Ciawi",
//   "Unit Luragung",
//   "Unit Kadugede",
//   "Unit Garawangi",
//   "Unit Japara",
//   "Unit Cidahu",
// ];

// const EXPORT_COLUMNS = [
//   { id: "noSeri", label: "Nomor Seri" },
//   { id: "merk", label: "Merk Water Meter" },
//   { id: "dn", label: "Ukuran DN" },
//   { id: "tahunPengadaan", label: "Tahun Pengadaan" },
//   { id: "status", label: "Status" },
//   { id: "unitCabang", label: "Unit Cabang" },
//   { id: "lokasi", label: "Lokasi / Pelanggan" },
//   { id: "detail", label: "Keterangan" },
// ];

// export default function WaterMeterPage() {
//   const [data, setData] = useState<WaterMeterItem[]>(INITIAL_METERS);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("Semua");
//   const [cabangFilter, setCabangFilter] = useState("Semua");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 8;

//   // Modals state
//   const [detailItem, setDetailItem] = useState<WaterMeterItem | null>(null);
//   const [addModalOpen, setAddModalOpen] = useState(false);
//   const [exportModalOpen, setExportModalOpen] = useState(false);

//   // Filtered dataset
//   const filtered = useMemo(() => {
//     return data.filter((item) => {
//       const matchSearch =
//         item.noSeri.toLowerCase().includes(search.toLowerCase()) ||
//         item.merk.toLowerCase().includes(search.toLowerCase()) ||
//         item.lokasi.toLowerCase().includes(search.toLowerCase()) ||
//         item.detail.toLowerCase().includes(search.toLowerCase());

//       const matchStatus = statusFilter === "Semua" || item.status === statusFilter;
//       const matchCabang = cabangFilter === "Semua" || item.unitCabang === cabangFilter;

//       return matchSearch && matchStatus && matchCabang;
//     });
//   }, [data, search, statusFilter, cabangFilter]);

//   // Pagination slice
//   const totalPages = Math.ceil(filtered.length / itemsPerPage);
//   const paginated = useMemo(() => {
//     const start = (currentPage - 1) * itemsPerPage;
//     return filtered.slice(start, start + itemsPerPage);
//   }, [filtered, currentPage]);

//   const existingSN = useMemo(() => new Set(data.map((d) => d.noSeri)), [data]);

//   // Inventory stats
//   const stats = useMemo(() => {
//     return {
//       total: 1840,
//       tersedia: 420,
//       terpasang: 1285,
//       rusakTarik: 135,
//     };
//   }, []);

//   const handleAddItems = (newItems: WaterMeterItem[]) => {
//     setData((prev) => [...newItems, ...prev]);
//   };

//   const handleExport = ({
//     scope,
//     selectedCols,
//   }: {
//     scope: "filtered" | "all";
//     selectedCols: string[];
//   }) => {
//     const target = scope === "filtered" ? filtered : data;
//     const header = selectedCols
//       .map((c) => EXPORT_COLUMNS.find((col) => col.id === c)?.label || c)
//       .join(",");

//     const rows = target.map((item) => {
//       return selectedCols
//         .map((col) => {
//           const val = String((item as any)[col] ?? "");
//           return `"${val.replace(/"/g, '""')}"`;
//         })
//         .join(",");
//     });

//     const csvContent = [header, ...rows].join("\n");
//     const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `water-meter-pam-tirta-kamuning-${Date.now()}.csv`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div className="space-y-6">
//       {/* Page Header */}
//       <PageHeader
//         title="Manajemen Water Meter"
//         subtitle="Inventarisasi nomor seri, spesifikasi teknis, alokasi gudang unit cabang, dan status meteran air."
//         badge="Inventaris PAM Tirta Kamuning"
//         badgeVariant="primary"
//       >
//         <button
//           onClick={() => setExportModalOpen(true)}
//           className="btn btn-sm btn-outline border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
//         >
//           <Download className="w-3.5 h-3.5" />
//           Ekspor CSV
//         </button>
//         <button
//           onClick={() => setAddModalOpen(true)}
//           className="btn btn-sm bg-pdam-primary hover:bg-pdam-primary/90 text-white border-none shadow-xs"
//         >
//           <Plus className="w-3.5 h-3.5" />
//           Tambah Water Meter
//         </button>
//       </PageHeader>

//       {/* KPI Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard
//           title="Total Aset Fisik"
//           value={stats.total.toLocaleString("id-ID")}
//           subtext="Seluruh unit cabang & pusat"
//           icon={<Layers className="w-5 h-5" />}
//           variant="slate"
//         />
//         <StatCard
//           title="Tersedia di Unit"
//           value={stats.tersedia.toLocaleString("id-ID")}
//           subtext="Stok siap pasang di gudang unit"
//           icon={<CheckCircle2 className="w-5 h-5" />}
//           variant="primary"
//           onClick={() => setStatusFilter("Tersedia di Unit")}
//           active={statusFilter === "Tersedia di Unit"}
//         />
//         <StatCard
//           title="Terpasang Aktif"
//           value={stats.terpasang.toLocaleString("id-ID")}
//           subtext="Terhubung pada sambungan rumah"
//           icon={<MapPin className="w-5 h-5" />}
//           variant="navy"
//           onClick={() => setStatusFilter("Terpasang")}
//           active={statusFilter === "Terpasang"}
//         />
//         <StatCard
//           title="Rusak & Ditarik"
//           value={stats.rusakTarik.toLocaleString("id-ID")}
//           subtext="Gudang karantina / depo retur"
//           icon={<RotateCcw className="w-5 h-5" />}
//           variant="red"
//           onClick={() => setStatusFilter("Rusak")}
//           active={statusFilter === "Rusak"}
//         />
//       </div>

//       {/* Filter and Search Bar */}
//       <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-xs">
//         {/* Status Pill Filters */}
//         <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-slate-100">
//           {["Semua", "Tersedia di Unit", "Terpasang", "Rusak", "Ditarik"].map((st) => (
//             <button
//               key={st}
//               onClick={() => {
//                 setStatusFilter(st);
//                 setCurrentPage(1);
//               }}
//               className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${statusFilter === st
//                   ? "bg-pdam-primary text-white shadow-xs"
//                   : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
//                 }`}
//             >
//               {st}
//             </button>
//           ))}
//         </div>

//         {/* Search & Unit Cabang Dropdown */}
//         <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
//           <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto flex-1">
//             <SearchInput
//               value={search}
//               onChange={(val) => {
//                 setSearch(val);
//                 setCurrentPage(1);
//               }}
//               placeholder="Cari no. seri, merk, lokasi, atau keterangan..."
//               className="w-full sm:max-w-md"
//             />
//             <SelectDropdown
//               value={cabangFilter}
//               onChange={(c) => {
//                 setCabangFilter(c);
//                 setCurrentPage(1);
//               }}
//               options={["Semua", ...CABANG_OPTIONS]}
//               icon={<MapPin className="w-3.5 h-3.5" />}
//               className="w-full sm:w-56"
//             />
//           </div>

//           {(search || statusFilter !== "Semua" || cabangFilter !== "Semua") && (
//             <button
//               onClick={() => {
//                 setSearch("");
//                 setStatusFilter("Semua");
//                 setCabangFilter("Semua");
//                 setCurrentPage(1);
//               }}
//               className="text-xs text-slate-500 hover:text-pdam-primary font-medium underline shrink-0"
//             >
//               Reset Filter
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Data Table */}
//       <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
//                 <th className="py-3 px-4">No. Seri / Pengadaan</th>
//                 <th className="py-3 px-4">Unit Cabang</th>
//                 <th className="py-3 px-4">Merk & Ukuran</th>
//                 <th className="py-3 px-4">Status</th>
//                 <th className="py-3 px-4">Lokasi / Pelanggan</th>
//                 <th className="py-3 px-4 text-right">Aksi</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100 text-xs">
//               {paginated.map((item) => (
//                 <tr key={item.noSeri} className="hover:bg-slate-50/60 transition-colors">
//                   <td className="py-3.5 px-4">
//                     <span className="font-mono font-bold text-pdam-primary block">
//                       {item.noSeri}
//                     </span>
//                     <span className="text-[10px] text-slate-400 font-normal">
//                       Pengadaan {item.tahunPengadaan}
//                     </span>
//                   </td>
//                   <td className="py-3.5 px-4 font-semibold text-slate-800">
//                     <span className="inline-block bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded text-[11px] font-medium">
//                       {item.unitCabang}
//                     </span>
//                   </td>
//                   <td className="py-3.5 px-4">
//                     <span className="font-semibold text-slate-800 block">{item.merk}</span>
//                     <span className="text-[11px] font-mono text-slate-500">{item.dn}</span>
//                   </td>
//                   <td className="py-3.5 px-4">
//                     <StatusBadge status={item.status} size="sm" />
//                   </td>
//                   <td className="py-3.5 px-4">
//                     <span className="font-semibold text-slate-800 block">{item.lokasi}</span>
//                     <span className="text-[11px] text-slate-500 truncate max-w-xs block">
//                       {item.detail}
//                     </span>
//                   </td>
//                   <td className="py-3.5 px-4 text-right">
//                     <button
//                       onClick={() => setDetailItem(item)}
//                       className="text-pdam-primary hover:text-pdam-navy font-semibold hover:underline inline-flex items-center gap-1 text-xs"
//                     >
//                       Detail <ArrowUpRight className="w-3.5 h-3.5" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}

//               {paginated.length === 0 && (
//                 <tr>
//                   <td colSpan={6} className="py-12 text-center text-slate-400">
//                     Tidak ada data water meter yang sesuai dengan kriteria filter.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="p-4">
//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             totalItems={filtered.length}
//             onPageChange={setCurrentPage}
//             startIndex={(currentPage - 1) * itemsPerPage}
//             endIndex={Math.min(currentPage * itemsPerPage, filtered.length)}
//           />
//         </div>
//       </div>

//       {/* Modals */}
//       <WaterMeterDetailModal item={detailItem} onClose={() => setDetailItem(null)} />

//       <WaterMeterAddModal
//         isOpen={addModalOpen}
//         onClose={() => setAddModalOpen(false)}
//         onAdd={handleAddItems}
//         existingSN={existingSN}
//         unitAktif="Unit Kuningan"
//       />

//       <ExportModal
//         isOpen={exportModalOpen}
//         onClose={() => setExportModalOpen(false)}
//         columns={EXPORT_COLUMNS}
//         totalFiltered={filtered.length}
//         totalAll={data.length}
//         onExport={handleExport}
//       />
//     </div>
//   );
// }
"use client";

import React, { useMemo, useState } from "react";
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

// Model Data Catatan Pengiriman Berjenjang (Header-Detail)
export interface PengirimanDetailItem {
  idMerk: number;
  merk: string;
  ukuranDn: string;
  jumlah: number;
}

export interface PengirimanWMItem {
  idPengiriman: number;
  noPengiriman: string;
  tglPengiriman: string;
  unitTujuan: string;
  totalWm: number;
  catatan: string;
  details: PengirimanDetailItem[];
}

// Mock Data Initial Catatan Pengiriman dari Pusat
const INITIAL_PENGIRIMAN: PengirimanWMItem[] = [
  {
    idPengiriman: 1,
    noPengiriman: "SHIP/2026/10/001",
    tglPengiriman: "2026-10-16",
    unitTujuan: "Unit Kuningan",
    totalWm: 500,
    catatan: "Pengiriman stok WM Triwulan IV untuk Unit Kuningan",
    details: [
      { idMerk: 1, merk: "Itron Aquadis+", ukuranDn: "DN 15 (1/2\")", jumlah: 300 },
      { idMerk: 2, merk: "Linflow Multijet", ukuranDn: "DN 15 (1/2\")", jumlah: 200 },
    ],
  },
  {
    idPengiriman: 2,
    noPengiriman: "SHIP/2026/10/002",
    tglPengiriman: "2026-10-12",
    unitTujuan: "Unit Cilimus",
    totalWm: 350,
    catatan: "Pengalokasian cadangan ganti meter tua Unit Cilimus",
    details: [
      { idMerk: 1, merk: "Itron Aquadis+", ukuranDn: "DN 15 (1/2\")", jumlah: 150 },
      { idMerk: 3, merk: "Onda Brass Core", ukuranDn: "DN 15 (1/2\")", jumlah: 200 },
    ],
  },
  {
    idPengiriman: 3,
    noPengiriman: "SHIP/2026/09/015",
    tglPengiriman: "2026-09-28",
    unitTujuan: "Unit Cigugur",
    totalWm: 200,
    catatan: "Pengiriman tambahan stok rutin",
    details: [
      { idMerk: 2, merk: "Linflow Multijet", ukuranDn: "DN 15 (1/2\")", jumlah: 200 },
    ],
  },
];

const CABANG_OPTIONS = [
  "Unit Kuningan",
  "Unit Cilimus",
  "Unit Cigugur",
  "Unit Ciawi",
  "Unit Luragung",
  "Unit Kadugede",
  "Unit Garawangi",
  "Unit Japara",
  "Unit Cidahu",
];

const EXPORT_COLUMNS = [
  { id: "noPengiriman", label: "No. Pengiriman" },
  { id: "tglPengiriman", label: "Tanggal" },
  { id: "unitTujuan", label: "Unit Tujuan" },
  { id: "totalWm", label: "Total WM" },
  { id: "catatan", label: "Catatan" },
];

export default function WaterMeterPage() {
  const [activeTab, setActiveTab] = useState<"stok" | "pengiriman">("stok");
  const [pengirimanList, setPengirimanList] = useState<PengirimanWMItem[]>(INITIAL_PENGIRIMAN);
  const [search, setSearch] = useState("");
  const [cabangFilter, setCabangFilter] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals state
  const [addPengirimanOpen, setAddPengirimanOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [selectedPengiriman, setSelectedPengiriman] = useState<PengirimanWMItem | null>(null);

  // Form State Catatan Pengiriman Berjenjang Baru (Pusat)
  const [formNoPengiriman, setFormNoPengiriman] = useState("");
  const [formTglPengiriman, setFormTglPengiriman] = useState("2026-10-16");
  const [formUnitTujuan, setFormUnitTujuan] = useState("Unit Kuningan");
  const [formCatatan, setFormCatatan] = useState("");
  const [formDetails, setFormDetails] = useState<PengirimanDetailItem[]>([
    { idMerk: 1, merk: "Itron Aquadis+", ukuranDn: "DN 15 (1/2\")", jumlah: 100 },
  ]);

  // Total perhitungan pengiriman
  const totalPengirimanWM = useMemo(() => {
    return pengirimanList.reduce((acc, curr) => acc + curr.totalWm, 0);
  }, [pengirimanList]);

  // Filtered dataset pengiriman
  const filteredPengiriman = useMemo(() => {
    return pengirimanList.filter((item) => {
      const matchSearch =
        item.noPengiriman.toLowerCase().includes(search.toLowerCase()) ||
        item.unitTujuan.toLowerCase().includes(search.toLowerCase()) ||
        item.catatan.toLowerCase().includes(search.toLowerCase());

      const matchCabang = cabangFilter === "Semua" || item.unitTujuan === cabangFilter;

      return matchSearch && matchCabang;
    });
  }, [pengirimanList, search, cabangFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredPengiriman.length / itemsPerPage);
  const paginatedPengiriman = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPengiriman.slice(start, start + itemsPerPage);
  }, [filteredPengiriman, currentPage]);

  // Handle Tambah Detail Merk pada Form Pengiriman
  const handleAddDetailRow = () => {
    setFormDetails((prev) => [
      ...prev,
      { idMerk: 1, merk: "Itron Aquadis+", ukuranDn: "DN 15 (1/2\")", jumlah: 50 },
    ]);
  };

  const handleDetailChange = (index: number, field: keyof PengirimanDetailItem, value: any) => {
    setFormDetails((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleRemoveDetailRow = (index: number) => {
    setFormDetails((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit Catatan Pengiriman dari Pusat (Langsung Catat)
  const handleSubmitPengiriman = (e: React.FormEvent) => {
    e.preventDefault();
    const totalWm = formDetails.reduce((sum, item) => sum + Number(item.jumlah || 0), 0);

    const newItem: PengirimanWMItem = {
      idPengiriman: Date.now(),
      noPengiriman: formNoPengiriman || `SHIP/2026/10/${Math.floor(100 + Math.random() * 900)}`,
      tglPengiriman: formTglPengiriman,
      unitTujuan: formUnitTujuan,
      totalWm,
      catatan: formCatatan,
      details: formDetails,
    };

    setPengirimanList((prev) => [newItem, ...prev]);
    setAddPengirimanOpen(false);
    // Reset Form
    setFormNoPengiriman("");
    setFormCatatan("");
    setFormDetails([{ idMerk: 1, merk: "Itron Aquadis+", ukuranDn: "DN 15 (1/2\")", jumlah: 100 }]);
  };

  // Handle Ekspor CSV
  const handleExport = ({
    scope,
    selectedCols,
  }: {
    scope: "filtered" | "all";
    selectedCols: string[];
  }) => {
    const target = scope === "filtered" ? filteredPengiriman : pengirimanList;
    const header = selectedCols
      .map((c) => EXPORT_COLUMNS.find((col) => col.id === c)?.label || c)
      .join(",");

    const rows = target.map((item) => {
      return selectedCols
        .map((col) => {
          const val = String((item as any)[col] ?? "");
          return `"${val.replace(/"/g, '""')}"`;
        })
        .join(",");
    });

    const csvContent = [header, ...rows].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `catatan-pengiriman-wm-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
          className="btn btn-sm btn-outline border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
        >
          <Download className="w-3.5 h-3.5" />
          Ekspor CSV
        </button>
        <button
          onClick={() => setAddPengirimanOpen(true)}
          className="btn btn-sm bg-pdam-primary hover:bg-pdam-primary/90 text-white border-none shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          Catat Pengiriman WM (Pusat)
        </button>
      </PageHeader>

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
          value={(totalPengirimanWM - 680).toLocaleString("id-ID")}
          subtext="Siap untuk penugasan penggantian"
          icon={<PackageCheck className="w-5 h-5" />}
          variant="primary"
        />
        <StatCard
          title="Terpasang di Pelanggan"
          value="680"
          subtext="Telah divalidasi BAP oleh Pusat"
          icon={<CheckCircle2 className="w-5 h-5" />}
          variant="navy"
        />
        <StatCard
          title="Unit Cabang Penerima"
          value="9 Cabang"
          subtext="Seluruh unit kerja aktif"
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

      {/* TAB 1: MONITORING STOK UNIT CABANG */}
      {activeTab === "stok" && (
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
              options={["Semua", ...CABANG_OPTIONS]}
              icon={<MapPin className="w-3.5 h-3.5" />}
              className="w-full sm:w-56"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CABANG_OPTIONS.filter((c) => cabangFilter === "Semua" || c === cabangFilter).map(
              (cabang) => {
                const totalDikirim = pengirimanList
                  .filter((p) => p.unitTujuan === cabang)
                  .reduce((sum, item) => sum + item.totalWm, 0);

                return (
                  <div
                    key={cabang}
                    className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                          Unit Cabang
                        </span>
                        <h4 className="text-base font-bold text-slate-800">{cabang}</h4>
                      </div>
                      <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                        {totalDikirim} WM Dikirim
                      </span>
                    </div>

                    <div className="border-t border-slate-100 pt-3 space-y-2">
                      <div className="text-xs font-semibold text-slate-600">
                        Rincian Pengiriman per Merk:
                      </div>
                      {pengirimanList
                        .filter((p) => p.unitTujuan === cabang)
                        .flatMap((p) => p.details)
                        .map((det, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center text-xs bg-slate-50 p-2 rounded border border-slate-100"
                          >
                            <span className="font-medium text-slate-700">{det.merk}</span>
                            <span className="font-mono font-bold text-pdam-primary">
                              {det.jumlah} Unit
                            </span>
                          </div>
                        ))}
                      {totalDikirim === 0 && (
                        <div className="text-xs text-slate-400 italic">Belum ada catatan pengiriman.</div>
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CATATAN RIWAYAT PENGIRIMAN (BERJENJANG) */}
      {activeTab === "pengiriman" && (
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
              options={["Semua", ...CABANG_OPTIONS]}
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
                  <tr key={item.idPengiriman} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-pdam-primary block">
                        {item.noPengiriman}
                      </span>
                      <span className="text-[10px] text-slate-400 inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {item.tglPengiriman}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      <span className="inline-block bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded text-[11px] font-medium">
                        {item.unitTujuan}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {item.totalWm} Unit
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        {item.details.map((d, idx) => (
                          <div key={idx} className="text-[11px] text-slate-600">
                            • <span className="font-semibold">{d.merk}</span>: {d.jumlah} Unit
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
                    <td colSpan={6} className="py-12 text-center text-slate-400">
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
              startIndex={(currentPage - 1) * itemsPerPage}
              endIndex={Math.min(currentPage * itemsPerPage, filteredPengiriman.length)}
            />
          </div>
        </div>
      )}

      {/* MODAL INPUT CATATAN PENGIRIMAN BERJENJANG (PUSAT) */}
      {addPengirimanOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="font-bold text-slate-800 text-base">
                  Catat Pengiriman Water Meter (Pusat)
                </h3>
                <p className="text-xs text-slate-500">
                  Input catatan pengiriman ke unit cabang secara berjenjang per merk.
                </p>
              </div>
              <button
                onClick={() => setAddPengirimanOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitPengiriman} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
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
                >
                  {CABANG_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
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
                        value={detail.merk}
                        onChange={(e) => handleDetailChange(index, "merk", e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded focus:outline-none"
                      >
                        <option value="Itron Aquadis+">Itron Aquadis+</option>
                        <option value="Linflow Multijet">Linflow Multijet</option>
                        <option value="Onda Brass Core">Onda Brass Core</option>
                        <option value="Actaris Metron Cyble">Actaris Metron Cyble</option>
                      </select>
                    </div>
                    <div className="w-32">
                      <input
                        type="number"
                        placeholder="Jumlah"
                        value={detail.jumlah}
                        onChange={(e) =>
                          handleDetailChange(index, "jumlah", Number(e.target.value))
                        }
                        className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded font-mono font-bold focus:outline-none"
                        min="1"
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
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan</label>
                <textarea
                  rows={2}
                  placeholder="Catatan pengiriman..."
                  value={formCatatan}
                  onChange={(e) => setFormCatatan(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pdam-primary/20"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddPengirimanOpen(false)}
                  className="btn btn-sm btn-ghost text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-sm bg-pdam-primary hover:bg-pdam-primary/90 text-white border-none"
                >
                  Simpan Catatan Pengiriman
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
                    {selectedPengiriman.noPengiriman}
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
                    {selectedPengiriman.tglPengiriman}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Unit Cabang Tujuan
                  </span>
                  <span className="font-semibold text-slate-800">
                    {selectedPengiriman.unitTujuan}
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
                      {selectedPengiriman.details.map((d, i) => (
                        <tr key={i}>
                          <td className="py-2 px-3 font-medium text-slate-800">{d.merk}</td>
                          <td className="py-2 px-3 font-mono text-slate-500">{d.ukuranDn}</td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-pdam-primary">
                            {d.jumlah} Unit
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
                          {selectedPengiriman.totalWm} Unit
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block font-bold mb-1">Catatan Pengiriman:</span>
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