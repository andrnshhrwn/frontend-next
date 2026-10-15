"use client";

import { Download, Plus, Search, Pencil, Trash2, X, Tags } from "lucide-react";
import { useState } from "react";

// Sesuai tabel `tipe_tarif` (id_tarif VARCHAR(20), nama_tarif VARCHAR(100))
interface Tarif {
  id_tarif: string;
  nama_tarif: string;
  jumlahPelanggan: number; // hasil agregasi pelanggan.id_tarif (read-only)
}

const initialData: Tarif[] = [
  { id_tarif: "1B", nama_tarif: "Gol. 1B - Sosial Khusus", jumlahPelanggan: 112 },
  { id_tarif: "2A", nama_tarif: "Gol. 2A - Rumah Tangga", jumlahPelanggan: 3480 },
  { id_tarif: "2B", nama_tarif: "Gol. 2B - Rumah Tangga Mampu", jumlahPelanggan: 760 },
  { id_tarif: "3A", nama_tarif: "Gol. 3A - Niaga Kecil", jumlahPelanggan: 395 },
  { id_tarif: "IND", nama_tarif: "Gol. Industri Khusus", jumlahPelanggan: 73 },
];

export default function DataTarifPage() {
  const [data, setData] = useState<Tarif[]>(initialData);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Tarif | null>(null);
  const [form, setForm] = useState({ id_tarif: "", nama_tarif: "" });
  const [error, setError] = useState("");

  const filtered = data.filter(
    (t) =>
      t.id_tarif.toLowerCase().includes(search.toLowerCase()) ||
      t.nama_tarif.toLowerCase().includes(search.toLowerCase())
  );

  const totalPelanggan = data.reduce((a, b) => a + b.jumlahPelanggan, 0);

  const openAdd = () => {
    setEditing(null);
    setForm({ id_tarif: "", nama_tarif: "" });
    setError("");
    setModalOpen(true);
  };

  const openEdit = (t: Tarif) => {
    setEditing(t);
    setForm({ id_tarif: t.id_tarif, nama_tarif: t.nama_tarif });
    setError("");
    setModalOpen(true);
  };

  const handleSave = () => {
    const id = form.id_tarif.trim();
    const nama = form.nama_tarif.trim();
    if (!id || !nama) return setError("Kode dan nama tarif wajib diisi.");
    if (id.length > 20) return setError("Kode tarif maksimal 20 karakter.");
    if (nama.length > 100) return setError("Nama tarif maksimal 100 karakter.");
    if (!editing && data.some((t) => t.id_tarif === id))
      return setError("Kode tarif sudah digunakan.");

    if (editing) {
      setData((d) =>
        d.map((t) => (t.id_tarif === editing.id_tarif ? { ...t, nama_tarif: nama } : t))
      );
    } else {
      setData((d) => [...d, { id_tarif: id, nama_tarif: nama, jumlahPelanggan: 0 }]);
    }
    setModalOpen(false);
  };

  const handleDelete = (t: Tarif) => {
    if (t.jumlahPelanggan > 0) return;
    setData((d) => d.filter((x) => x.id_tarif !== t.id_tarif));
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div>
        <p className="text-xs text-slate-500 mb-1">
          PDAM Tirta / Master Data /{" "}
          <span className="text-pdam-primary font-semibold">Data Tarif</span>
        </p>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-pdam-navy">
              Manajemen Data Tarif
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola golongan tipe tarif yang digunakan untuk klasifikasi pelanggan.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-sm btn-ghost bg-white hover:bg-pdam-bg border border-slate-200 text-pdam-navy font-semibold normal-case shadow-xs">
              <Download className="w-4 h-4 text-pdam-primary" />
              <span>Export Data Tarif</span>
            </button>
            <button
              onClick={openAdd}
              className="btn btn-sm bg-pdam-primary hover:bg-pdam-navy text-white font-semibold normal-case border-0 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Tarif Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card bg-white border border-slate-200/90 shadow-xs p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              TOTAL GOLONGAN TARIF
            </p>
            <div className="p-1.5 rounded-md bg-pdam-primary/10 text-pdam-primary">
              <Tags className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-pdam-navy tabular-nums">
              {data.length}
            </span>
            <span className="text-xs font-bold text-slate-500">Golongan</span>
          </div>
        </div>
        <div className="card bg-white border border-slate-200/90 shadow-xs p-4">
          <p className="text-[10px] font-bold text-pdam-primary uppercase tracking-wider mb-1">
            PELANGGAN TERKLASIFIKASI
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-pdam-primary tabular-nums">
              {totalPelanggan.toLocaleString("id-ID")}
            </span>
            <span className="text-xs font-bold text-pdam-primary">SR</span>
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
              placeholder="Cari kode atau nama tarif..."
              className="input input-bordered input-sm w-full pl-9 text-xs bg-pdam-bg/50 border-slate-200 focus:border-pdam-primary focus:bg-white"
            />
          </div>
          <span className="text-xs text-slate-500">
            Menampilkan {filtered.length} dari {data.length} golongan tarif
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="table table-sm w-full">
            <thead>
              <tr className="bg-pdam-bg text-pdam-navy text-[11px] uppercase tracking-wider border-b border-slate-200 font-bold">
                <th className="py-3.5 pl-5">KODE TARIF</th>
                <th className="py-3.5">NAMA TARIF</th>
                <th className="py-3.5 text-right">JUMLAH PELANGGAN</th>
                <th className="py-3.5 text-right pr-5">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((t) => (
                <tr key={t.id_tarif} className="hover:bg-pdam-bg/60 transition-colors">
                  <td className="py-3.5 pl-5">
                    <span className="badge badge-sm border border-pdam-primary/25 bg-pdam-primary/10 text-pdam-primary font-bold font-mono">
                      {t.id_tarif}
                    </span>
                  </td>
                  <td className="py-3.5 font-bold text-pdam-navy">{t.nama_tarif}</td>
                  <td className="py-3.5 text-right tabular-nums text-slate-600">
                    {t.jumlahPelanggan.toLocaleString("id-ID")}
                  </td>
                  <td className="py-3.5 pr-5">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => openEdit(t)}
                        className="text-pdam-primary font-semibold hover:text-pdam-navy hover:underline inline-flex items-center gap-1"
                      >
                        <Pencil className="w-3 h-3" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(t)}
                        disabled={t.jumlahPelanggan > 0}
                        title={
                          t.jumlahPelanggan > 0
                            ? "Tidak dapat dihapus: masih dipakai pelanggan"
                            : "Hapus tarif"
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
                  <td colSpan={4} className="py-10 text-center text-slate-400">
                    Data tarif tidak ditemukan.
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
                {editing ? "Edit Tarif" : "Tambah Tarif Baru"}
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
                  Kode Tarif
                </span>
                <input
                  type="text"
                  value={form.id_tarif}
                  disabled={!!editing}
                  maxLength={20}
                  onChange={(e) => setForm({ ...form, id_tarif: e.target.value })}
                  placeholder="contoh: 2A"
                  className="input input-bordered input-sm w-full text-xs font-mono border-slate-200 disabled:bg-pdam-bg"
                />
              </label>
              <label className="form-control w-full">
                <span className="text-[11px] font-bold text-pdam-navy uppercase mb-1">
                  Nama Tarif
                </span>
                <input
                  type="text"
                  value={form.nama_tarif}
                  maxLength={100}
                  onChange={(e) => setForm({ ...form, nama_tarif: e.target.value })}
                  placeholder="contoh: Gol. 2A - Rumah Tangga"
                  className="input input-bordered input-sm w-full text-xs border-slate-200"
                />
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
