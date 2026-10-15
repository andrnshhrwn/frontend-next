"use client";

import { Download, Plus, Search, Pencil, Trash2, X, Gauge } from "lucide-react";
import { useState } from "react";

// Sesuai tabel `merk_wm` (id_merk INT AI, merk_wm VARCHAR(50), wm_digit INT)
interface MerkWM {
  id_merk: number;
  merk_wm: string;
  wm_digit: number;
  jumlahWM: number; // hasil agregasi water_meter.id_merk (read-only)
}

const initialData: MerkWM[] = [
  { id_merk: 1, merk_wm: "Itron", wm_digit: 5, jumlahWM: 1820 },
  { id_merk: 2, merk_wm: "Sensus", wm_digit: 5, jumlahWM: 1240 },
  { id_merk: 3, merk_wm: "Zenner", wm_digit: 5, jumlahWM: 960 },
  { id_merk: 4, merk_wm: "Amico", wm_digit: 4, jumlahWM: 540 },
  { id_merk: 5, merk_wm: "Bestar", wm_digit: 4, jumlahWM: 260 },
];

export default function DataMerkWMPage() {
  const [data, setData] = useState<MerkWM[]>(initialData);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<MerkWM | null>(null);
  const [form, setForm] = useState({ merk_wm: "", wm_digit: "" });
  const [error, setError] = useState("");

  const filtered = data.filter((m) =>
    m.merk_wm.toLowerCase().includes(search.toLowerCase())
  );

  const totalWM = data.reduce((a, b) => a + b.jumlahWM, 0);

  const openAdd = () => {
    setEditing(null);
    setForm({ merk_wm: "", wm_digit: "" });
    setError("");
    setModalOpen(true);
  };

  const openEdit = (m: MerkWM) => {
    setEditing(m);
    setForm({ merk_wm: m.merk_wm, wm_digit: String(m.wm_digit) });
    setError("");
    setModalOpen(true);
  };

  const handleSave = () => {
    const nama = form.merk_wm.trim();
    const digit = Number(form.wm_digit);
    if (!nama) return setError("Nama merk wajib diisi.");
    if (nama.length > 50) return setError("Nama merk maksimal 50 karakter.");
    if (!Number.isInteger(digit) || digit < 1)
      return setError("Jumlah digit harus berupa bilangan bulat positif.");
    if (data.some((m) => m.merk_wm.toLowerCase() === nama.toLowerCase() && m.id_merk !== editing?.id_merk))
      return setError("Merk water meter sudah terdaftar.");

    if (editing) {
      setData((d) =>
        d.map((m) =>
          m.id_merk === editing.id_merk ? { ...m, merk_wm: nama, wm_digit: digit } : m
        )
      );
    } else {
      const nextId = Math.max(0, ...data.map((m) => m.id_merk)) + 1;
      setData((d) => [...d, { id_merk: nextId, merk_wm: nama, wm_digit: digit, jumlahWM: 0 }]);
    }
    setModalOpen(false);
  };

  const handleDelete = (m: MerkWM) => {
    if (m.jumlahWM > 0) return;
    setData((d) => d.filter((x) => x.id_merk !== m.id_merk));
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div>
        <p className="text-xs text-slate-500 mb-1">
          PDAM Tirta / Master Data /{" "}
          <span className="text-pdam-primary font-semibold">Data Merk Water Meter</span>
        </p>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-pdam-navy">
              Manajemen Merk Water Meter
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola daftar merk WM beserta jumlah digit angka pada dial meteran.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-sm btn-ghost bg-white hover:bg-pdam-bg border border-slate-200 text-pdam-navy font-semibold normal-case shadow-xs">
              <Download className="w-4 h-4 text-pdam-primary" />
              <span>Export Data Merk</span>
            </button>
            <button
              onClick={openAdd}
              className="btn btn-sm bg-pdam-primary hover:bg-pdam-navy text-white font-semibold normal-case border-0 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Merk Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card bg-white border border-slate-200/90 shadow-xs p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              TOTAL MERK TERDAFTAR
            </p>
            <div className="p-1.5 rounded-md bg-pdam-primary/10 text-pdam-primary">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-pdam-navy tabular-nums">
              {data.length}
            </span>
            <span className="text-xs font-bold text-slate-500">Merk</span>
          </div>
        </div>
        <div className="card bg-white border border-slate-200/90 shadow-xs p-4">
          <p className="text-[10px] font-bold text-pdam-primary uppercase tracking-wider mb-1">
            TOTAL WM TERDATA
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-pdam-primary tabular-nums">
              {totalWM.toLocaleString("id-ID")}
            </span>
            <span className="text-xs font-bold text-pdam-primary">Unit</span>
          </div>
        </div>
      </div>

      {/* Search + Tabel */}
      <div className="card bg-white border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari merk water meter..."
              className="input input-bordered input-sm w-full pl-9 text-xs bg-pdam-bg/50 border-slate-200 focus:border-pdam-primary focus:bg-white"
            />
          </div>
          <span className="text-xs text-slate-500">
            Menampilkan {filtered.length} dari {data.length} merk
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="table table-sm w-full">
            <thead>
              <tr className="bg-pdam-bg text-pdam-navy text-[11px] uppercase tracking-wider border-b border-slate-200 font-bold">
                <th className="py-3.5 pl-5">ID</th>
                <th className="py-3.5">MERK WATER METER</th>
                <th className="py-3.5">JUMLAH DIGIT</th>
                <th className="py-3.5 text-right">UNIT WM TERDATA</th>
                <th className="py-3.5 text-right pr-5">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((m) => (
                <tr key={m.id_merk} className="hover:bg-pdam-bg/60 transition-colors">
                  <td className="py-3.5 pl-5 font-mono text-slate-400">
                    MRK-{String(m.id_merk).padStart(3, "0")}
                  </td>
                  <td className="py-3.5 font-bold text-pdam-navy">{m.merk_wm}</td>
                  <td className="py-3.5">
                    <span className="badge badge-sm border border-pdam-primary/25 bg-pdam-primary/10 text-pdam-primary font-bold">
                      {m.wm_digit} Digit
                    </span>
                  </td>
                  <td className="py-3.5 text-right tabular-nums text-slate-600">
                    {m.jumlahWM.toLocaleString("id-ID")}
                  </td>
                  <td className="py-3.5 pr-5">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => openEdit(m)}
                        className="text-pdam-primary font-semibold hover:text-pdam-navy hover:underline inline-flex items-center gap-1"
                      >
                        <Pencil className="w-3 h-3" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(m)}
                        disabled={m.jumlahWM > 0}
                        title={
                          m.jumlahWM > 0
                            ? "Tidak dapat dihapus: masih dipakai data water meter"
                            : "Hapus merk"
                        }
                        className="text-slate-400 font-semibold hover:text-pdam-red hover:underline inline-flex items-center gap-1 disabled:opacity-40 disabled:no-underline disabled:hover:text-slate-400 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-3 h-3" /> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-400">
                    Data merk tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah / Edit */}
      {modalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-pdam-navy">
                {editing ? "Edit Merk Water Meter" : "Tambah Merk Baru"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="btn btn-ghost btn-xs btn-square text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <label className="form-control w-full">
                <span className="text-[11px] font-bold text-pdam-navy uppercase mb-1">
                  Nama Merk
                </span>
                <input
                  type="text"
                  value={form.merk_wm}
                  maxLength={50}
                  onChange={(e) => setForm({ ...form, merk_wm: e.target.value })}
                  placeholder="contoh: Itron"
                  className="input input-bordered input-sm w-full text-xs border-slate-200"
                />
              </label>
              <label className="form-control w-full">
                <span className="text-[11px] font-bold text-pdam-navy uppercase mb-1">
                  Jumlah Digit
                </span>
                <input
                  type="number"
                  min={1}
                  value={form.wm_digit}
                  onChange={(e) => setForm({ ...form, wm_digit: e.target.value })}
                  placeholder="contoh: 5"
                  className="input input-bordered input-sm w-full text-xs border-slate-200"
                />
                <span className="text-[10px] text-slate-400 mt-1">
                  Dipakai untuk validasi input stand meter oleh teknisi.
                </span>
              </label>
              {error && <p className="text-xs text-pdam-red font-medium">{error}</p>}
            </div>

            <div className="modal-action">
              <button
                onClick={() => setModalOpen(false)}
                className="btn btn-sm btn-ghost border border-slate-200 normal-case font-semibold text-slate-600"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="btn btn-sm bg-pdam-primary hover:bg-pdam-navy text-white border-0 normal-case font-semibold"
              >
                Simpan
              </button>
            </div>
          </div>
          <div className="modal-backdrop bg-black/40" onClick={() => setModalOpen(false)} />
        </div>
      )}
    </div>
  );
}
