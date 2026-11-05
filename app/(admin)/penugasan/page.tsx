"use client";

import {
  Download,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  RotateCcw,
  CheckCircle2,
  Clock,
  Activity,
  ClipboardList,
  X,
  FileSpreadsheet,
  AlertCircle,
  UserCheck,
  MapPin,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  penugasanService,
  teknisiService,
  type Penugasan,
  type PenugasanStatus,
  type Teknisi,
} from "@/services/penugasanService";

import { apiClient, getStoredUser } from "@/services/apiClient";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type StatusFilter = "Semua" | PenugasanStatus;

interface Pelanggan {
  id_pelanggan: string;
  id_pelanggan_pdam: string;
  id_unit: string;
  nama: string;
  alamat: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface TicketInput {
  id_pelanggan: string;
  id_unit: string;
  alasan: string;
}

interface TicketView {
  id: string;
  nomorSpk: string;
  tanggal: string;
  cabang: string;
  pelanggan: string;
  idPelanggan: string;
  alamat: string;
  alasan: string;
  teknisi: string | null;
  status: PenugasanStatus;
  raw: Penugasan;
}

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

const statusLabel: Record<PenugasanStatus, string> = {
  pending: "Pending",
  proses: "Proses",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
};

const statusClass: Record<PenugasanStatus, string> = {
  pending: "border-pdam-red/30 bg-pdam-red/10 text-pdam-red",
  proses: "border-pdam-primary/30 bg-pdam-primary/10 text-pdam-primary",
  selesai: "border-pdam-navy/30 bg-pdam-navy/10 text-pdam-navy",
  dibatalkan: "border-slate-300 bg-slate-100 text-slate-500",
};

const statusFilters: {
  label: string;
  value: StatusFilter;
}[] = [
  { label: "Semua SPK", value: "Semua" },
  { label: "Pending Disposisi", value: "pending" },
  { label: "Dalam Pengerjaan", value: "proses" },
  { label: "Selesai", value: "selesai" },
  { label: "Dibatalkan", value: "dibatalkan" },
];

const labelCls = "text-[11px] font-bold text-pdam-navy uppercase mb-1 block";

const btnGhost =
  "btn btn-sm btn-ghost border border-slate-200 normal-case font-semibold text-slate-600";

const btnPrimary =
  "btn btn-sm bg-pdam-primary hover:bg-pdam-navy text-white border-0 normal-case font-semibold";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function toTicket(item: Penugasan): TicketView {
  return {
    id: item.id_penugasan,
    nomorSpk: item.nomor_spk,
    tanggal: formatDate(item.tgl_penugasan),
    cabang: item.unit?.nama_unit ?? "-",
    pelanggan: item.pelanggan?.nama ?? "-",
    idPelanggan: item.pelanggan?.id_pelanggan_pdam ?? "-",
    alamat: item.pelanggan?.alamat ?? "-",
    alasan: item.alasan,
    teknisi: item.teknisi?.fullname ?? null,
    status: item.status,
    raw: item,
  };
}

function csvCell(value: string | number) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob(["\uFEFF" + content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

/* ------------------------------------------------------------------ */
/* Modal shell                                                         */
/* ------------------------------------------------------------------ */

function Modal({
  title,
  subtitle,
  onClose,
  children,
  footer,
  wide,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="modal modal-open">
      <div
        className={`modal-box bg-white p-0 ${wide ? "max-w-2xl" : "max-w-md"}`}
      >
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-slate-200">
          <div>
            <h3 className="font-extrabold text-pdam-navy">{title}</h3>

            {subtitle && (
              <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
            )}
          </div>

          <button
            onClick={onClose}
            className="btn btn-ghost btn-xs btn-square text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5">{children}</div>

        {footer && (
          <div className="px-6 py-4 border-t border-slate-200 bg-pdam-bg/50 flex justify-end gap-2">
            {footer}
          </div>
        )}
      </div>

      <div className="modal-backdrop bg-black/40" onClick={onClose} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Export modal                                                        */
/* ------------------------------------------------------------------ */

function ExportModal({
  onClose,
  allData,
  filteredData,
}: {
  onClose: () => void;
  allData: TicketView[];
  filteredData: TicketView[];
}) {
  const [scope, setScope] = useState<"filter" | "all">("filter");

  const rows = scope === "filter" ? filteredData : allData;

  const handleExport = () => {
    const header = [
      "Nomor SPK",
      "Tanggal",
      "Unit",
      "ID Pelanggan",
      "Nama Pelanggan",
      "Alamat",
      "Alasan",
      "Teknisi",
      "Status",
    ];

    const dataRows = rows.map((item) => [
      item.nomorSpk,
      item.tanggal,
      item.cabang,
      item.idPelanggan,
      item.pelanggan,
      item.alamat,
      item.alasan,
      item.teknisi ?? "-",
      statusLabel[item.status],
    ]);

    const csv = [
      header.map(csvCell).join(","),
      ...dataRows.map((row) => row.map(csvCell).join(",")),
    ].join("\n");

    const stamp = new Date().toISOString().slice(0, 10);

    downloadFile(`penugasan-${stamp}.csv`, csv, "text/csv;charset=utf-8");

    onClose();
  };

  return (
    <Modal
      title="Export Data Penugasan"
      subtitle="Unduh daftar penugasan berdasarkan cakupan data."
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className={btnGhost}>
            Batal
          </button>

          <button
            onClick={handleExport}
            disabled={rows.length === 0}
            className={btnPrimary}
          >
            <Download className="w-4 h-4" />
            Unduh {rows.length} Penugasan
          </button>
        </>
      }
    >
      <div className="space-y-5">
        <div>
          <span className={labelCls}>Format File</span>

          <div className="flex items-center gap-2 rounded-lg border border-pdam-primary bg-pdam-primary/5 p-3">
            <FileSpreadsheet className="w-4 h-4 text-pdam-primary" />
            <span className="text-xs font-semibold text-pdam-primary">
              CSV (.csv)
            </span>
          </div>
        </div>

        <div>
          <span className={labelCls}>Cakupan Data</span>

          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                className="radio radio-xs radio-primary"
                checked={scope === "filter"}
                onChange={() => setScope("filter")}
              />
              Sesuai filter aktif ({filteredData.length} penugasan)
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                className="radio radio-xs radio-primary"
                checked={scope === "all"}
                onChange={() => setScope("all")}
              />
              Semua data yang dimuat ({allData.length} penugasan)
            </label>
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Create modal                                                        */
/* ------------------------------------------------------------------ */

function CreateTicketModal({
  onClose,
  onCreate,
  pelanggan,
  unitId,
}: {
  onClose: () => void;
  onCreate: (data: TicketInput) => Promise<void>;
  pelanggan: Pelanggan[];
  unitId: string;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Pelanggan | null>(null);
  const [alasan, setAlasan] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const results = pelanggan
    .filter(
      (item) =>
        item.nama.toLowerCase().includes(query.toLowerCase()) ||
        item.id_pelanggan_pdam.toLowerCase().includes(query.toLowerCase()),
    )
    .slice(0, 10);

  const handleSubmit = async () => {
    if (!selected) {
      setError("Pilih pelanggan terlebih dahulu.");
      return;
    }

    if (!alasan.trim()) {
      setError("Alasan penugasan wajib diisi.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await onCreate({
        id_pelanggan: selected.id_pelanggan,
        id_unit: unitId,
        alasan: alasan.trim(),
      });

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat penugasan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      wide
      title="Buat Penugasan"
      subtitle="Penugasan dibuat oleh Admin Cabang dengan status awal Pending."
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className={btnGhost}>
            Batal
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={btnPrimary}
          >
            <Plus className="w-4 h-4" />
            {submitting ? "Menyimpan..." : "Buat Penugasan"}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className={labelCls}>Pelanggan</label>

          {selected ? (
            <div className="flex items-start justify-between rounded-lg border border-pdam-primary/30 bg-pdam-primary/5 p-3">
              <div>
                <p className="text-xs font-bold text-pdam-navy">
                  {selected.nama}
                </p>

                <p className="text-[10px] font-mono text-slate-400">
                  {selected.id_pelanggan_pdam}
                </p>

                <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {selected.alamat}
                </p>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="text-[11px] font-semibold text-pdam-primary hover:underline"
              >
                Ubah
              </button>
            </div>
          ) : (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari nama atau ID pelanggan..."
                  className="input input-bordered input-sm w-full pl-9 text-xs border-slate-200 focus:border-pdam-primary"
                />
              </div>

              <ul className="mt-2 rounded-lg border border-slate-200 divide-y divide-slate-100 max-h-44 overflow-y-auto">
                {results.map((item) => (
                  <li key={item.id_pelanggan}>
                    <button
                      onClick={() => setSelected(item)}
                      className="w-full text-left px-3 py-2 hover:bg-pdam-bg transition-colors"
                    >
                      <span className="text-xs font-semibold text-pdam-navy block">
                        {item.nama}
                      </span>

                      <span className="text-[10px] text-slate-400 font-mono">
                        {item.id_pelanggan_pdam}
                      </span>
                    </button>
                  </li>
                ))}

                {results.length === 0 && (
                  <li className="px-3 py-4 text-center text-xs text-slate-400">
                    Pelanggan tidak ditemukan.
                  </li>
                )}
              </ul>
            </>
          )}
        </div>

        <div>
          <label className={labelCls}>Alasan Penugasan</label>

          <textarea
            value={alasan}
            onChange={(e) => setAlasan(e.target.value)}
            rows={3}
            maxLength={255}
            placeholder="Masukkan alasan penugasan..."
            className="textarea textarea-bordered w-full text-xs border-slate-200 focus:border-pdam-primary"
          />
        </div>

        {error && (
          <p className="text-xs text-pdam-red font-medium flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </p>
        )}
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Edit modal                                                          */
/* ------------------------------------------------------------------ */

function EditTicketModal({
  ticket,
  onClose,
  onSave,
}: {
  ticket: TicketView;
  onClose: () => void;
  onSave: (
    id: string,
    payload: {
      tgl_penugasan?: string;
      alasan?: string;
    },
  ) => Promise<void>;
}) {
  const [alasan, setAlasan] = useState(ticket.raw.alasan);
  const [tanggal, setTanggal] = useState(ticket.raw.tgl_penugasan.slice(0, 16));
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!alasan.trim()) {
      setError("Alasan penugasan wajib diisi.");
      return;
    }

    if (!tanggal) {
      setError("Tanggal penugasan wajib diisi.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await onSave(ticket.id, {
        alasan: alasan.trim(),
        tgl_penugasan: new Date(tanggal).toISOString(),
      });

      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal memperbarui penugasan.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Edit Penugasan"
      subtitle={`${ticket.nomorSpk} • ${ticket.pelanggan}`}
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className={btnGhost}>
            Batal
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={btnPrimary}
          >
            {submitting ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className={labelCls}>Tanggal Penugasan</label>
          <input
            type="datetime-local"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            className="input input-bordered input-sm w-full text-xs border-slate-200"
          />
        </div>

        <div>
          <label className={labelCls}>Alasan Penugasan</label>
          <textarea
            value={alasan}
            onChange={(e) => setAlasan(e.target.value)}
            rows={4}
            maxLength={255}
            className="textarea textarea-bordered w-full text-xs border-slate-200"
            placeholder="Masukkan alasan penugasan..."
          />
        </div>

        <p className="text-[11px] text-slate-400">
          Pelanggan dan unit tidak dapat diubah melalui formulir ini.
        </p>

        {error && (
          <p className="text-xs text-pdam-red flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </p>
        )}
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Delete modal                                                        */
/* ------------------------------------------------------------------ */

function DeleteTicketModal({
  ticket,
  onClose,
  onDelete,
}: {
  ticket: TicketView;
  onClose: () => void;
  onDelete: (id: string) => Promise<void>;
}) {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleDelete = async () => {
    setSubmitting(true);
    setError("");

    try {
      await onDelete(ticket.id);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal menghapus penugasan.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Hapus Penugasan"
      subtitle={ticket.nomorSpk}
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className={btnGhost}>
            Batal
          </button>

          <button
            onClick={handleDelete}
            disabled={submitting}
            className="btn btn-sm bg-red-600 hover:bg-red-700 text-white border-0 normal-case font-semibold"
          >
            {submitting ? "Menghapus..." : "Ya, Hapus"}
          </button>
        </>
      }
    >
      <div className="space-y-3">
        <div className="rounded-lg bg-red-50 border border-red-200 p-3">
          <div className="flex gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />

            <div>
              <p className="text-xs font-bold text-red-700">
                Konfirmasi penghapusan
              </p>

              <p className="text-xs text-red-600 mt-1">
                Anda akan menghapus penugasan untuk pelanggan{" "}
                <strong>{ticket.pelanggan}</strong>. Tindakan ini tidak dapat
                dibatalkan.
              </p>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-500">
          Penghapusan hanya diperbolehkan jika status Pending atau Dibatalkan
          dan penugasan belum memiliki BAP. Backend tetap menjadi pihak yang
          memvalidasi aturan tersebut.
        </p>

        {error && <p className="text-xs text-pdam-red">{error}</p>}
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Assign modal                                                        */
/* ------------------------------------------------------------------ */

function AssignModal({
  ticket,
  onClose,
  onAssign,
  teknisi,
}: {
  ticket: TicketView;
  onClose: () => void;
  onAssign: (id: string) => Promise<void>;
  teknisi: Teknisi[];
}) {
  const [chosen, setChosen] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAssign = async () => {
    if (!chosen) return;

    setSubmitting(true);
    setError("");

    try {
      await onAssign(chosen);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal menetapkan teknisi.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Pilih Teknisi"
      subtitle={`${ticket.nomorSpk} • ${ticket.pelanggan} • ${ticket.cabang}`}
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className={btnGhost}>
            Batal
          </button>

          <button
            onClick={handleAssign}
            disabled={!chosen || submitting}
            className={btnPrimary}
          >
            <UserCheck className="w-4 h-4" />
            {submitting ? "Menyimpan..." : "Tugaskan"}
          </button>
        </>
      }
    >
      <p className="text-[11px] text-slate-500 mb-3">
        Pilih teknisi dari unit yang sama dengan penugasan ini. Penetapan
        teknisi tidak otomatis mengubah status penugasan.
      </p>

      <ul className="space-y-2">
        {teknisi.map((item) => (
          <li key={item.id_user}>
            <label
              className={`flex items-center justify-between rounded-lg border p-3 cursor-pointer transition-colors ${
                chosen === item.id_user
                  ? "border-pdam-primary bg-pdam-primary/5"
                  : "border-slate-200 hover:bg-pdam-bg"
              }`}
            >
              <span className="flex items-center gap-3">
                <input
                  type="radio"
                  className="radio radio-xs radio-primary"
                  checked={chosen === item.id_user}
                  onChange={() => setChosen(item.id_user)}
                />

                <span className="text-xs font-semibold text-pdam-navy">
                  {item.fullname}
                </span>
              </span>

              <span className="text-[10px] text-slate-400">
                {item.username}
              </span>
            </label>
          </li>
        ))}

        {teknisi.length === 0 && (
          <li className="text-center text-xs text-slate-400 py-5">
            Tidak ada teknisi yang tersedia.
          </li>
        )}
      </ul>

      {error && <p className="text-xs text-pdam-red mt-3">{error}</p>}
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Cancel confirmation modal                                           */
/* ------------------------------------------------------------------ */

function CancelTicketModal({
  ticket,
  onClose,
  onConfirm,
}: {
  ticket: TicketView;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    setSubmitting(true);
    setError("");

    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal membatalkan penugasan.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Batalkan Penugasan"
      subtitle={ticket.nomorSpk}
      onClose={submitting ? () => {} : onClose}
      footer={
        <>
          <button onClick={onClose} disabled={submitting} className={btnGhost}>
            Kembali
          </button>

          <button
            onClick={handleConfirm}
            disabled={submitting}
            className="btn btn-sm bg-red-600 hover:bg-red-700 text-white border-0 normal-case font-semibold"
          >
            {submitting ? "Memproses..." : "Ya, Batalkan Penugasan"}
          </button>
        </>
      }
    >
      <div className="space-y-3">
        <div className="rounded-lg bg-red-50 border border-red-200 p-3">
          <div className="flex gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />

            <div>
              <p className="text-xs font-bold text-red-700">
                Konfirmasi pembatalan
              </p>

              <p className="text-xs text-red-600 mt-1">
                Apakah Anda yakin ingin membatalkan penugasan ini? Status
                penugasan akan berubah menjadi <strong>Dibatalkan</strong>.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 p-3 space-y-2">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">
              Nomor SPK
            </p>
            <p className="text-xs font-semibold text-pdam-navy">
              {ticket.nomorSpk}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">
              Pelanggan
            </p>
            <p className="text-xs font-semibold text-pdam-navy">
              {ticket.pelanggan}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">
              Unit
            </p>
            <p className="text-xs font-semibold text-pdam-navy">
              {ticket.cabang}
            </p>
          </div>
        </div>

        <p className="text-[11px] text-slate-500">
          Pembatalan tidak menghapus data SPK. Data tetap tersimpan dengan
          status Dibatalkan.
        </p>

        {error && (
          <p className="text-xs text-pdam-red flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </p>
        )}
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Detail modal                                                        */
/* ------------------------------------------------------------------ */

function DetailModal({
  ticket,
  onClose,
  onPickTeknisi,
  onRequestCancel,
  isAdminCabang,
}: {
  ticket: TicketView;
  onClose: () => void;
  onPickTeknisi: () => void;
  onRequestCancel: () => void;
  isAdminCabang: boolean;
}) {
  const Row = ({ k, v }: { k: string; v: ReactNode }) => (
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        {k}
      </p>

      <p className="text-xs font-semibold text-pdam-navy mt-0.5">{v}</p>
    </div>
  );

  const timeline = [
    {
      judul: "Penugasan dibuat",
      ket: formatDate(ticket.raw.tgl_penugasan),
    },
  ];

  if (ticket.teknisi) {
    timeline.push({
      judul: "Teknisi ditetapkan",
      ket: ticket.teknisi,
    });
  }

  if (ticket.status === "selesai") {
    timeline.push({
      judul: "Penugasan selesai",
      ket: "Status penugasan selesai",
    });
  }

  if (ticket.status === "dibatalkan") {
    timeline.push({
      judul: "Penugasan dibatalkan",
      ket: "Status penugasan dibatalkan",
    });
  }

  return (
    <Modal
      wide
      title="Detail Penugasan"
      subtitle="Informasi penugasan dan data terkait."
      onClose={onClose}
      footer={
        <>
          {isAdminCabang && ticket.status === "pending" && (
            <>
              {!ticket.teknisi && (
                <button onClick={onPickTeknisi} className={btnPrimary}>
                  <UserCheck className="w-4 h-4" />
                  Pilih Teknisi
                </button>
              )}

              <button
                onClick={onRequestCancel}
                className="btn btn-sm bg-red-600 hover:bg-red-700 text-white border-0 normal-case font-semibold"
              >
                <X className="w-4 h-4" />
                Batalkan Penugasan
              </button>
            </>
          )}

          <button onClick={onClose} className={btnGhost}>
            Tutup
          </button>
        </>
      }
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-mono font-bold text-lg text-pdam-primary">
            {ticket.nomorSpk}
          </p>

          <p className="text-[11px] text-slate-500">{ticket.tanggal}</p>
        </div>

        <span
          className={`badge badge-md font-bold border ${statusClass[ticket.status]}`}
        >
          {statusLabel[ticket.status]}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-5 border-b border-slate-200">
        <Row k="Pelanggan" v={ticket.pelanggan} />

        <Row
          k="ID Pelanggan"
          v={<span className="font-mono">{ticket.idPelanggan}</span>}
        />

        <Row k="Unit" v={ticket.cabang} />

        <div className="col-span-2 sm:col-span-3">
          <Row k="Alamat" v={ticket.alamat} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 py-5 border-b border-slate-200">
        <Row k="Alasan" v={ticket.alasan} />

        <Row
          k="Teknisi"
          v={
            ticket.teknisi ?? (
              <span className="text-slate-400">Belum ditugaskan</span>
            )
          }
        />

        <Row k="Pembuat" v={ticket.raw.pembuat?.fullname ?? "-"} />
      </div>

      <div className="pt-5">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
          Riwayat
        </p>

        <ul className="space-y-3">
          {timeline.map((item, index) => (
            <li key={index} className="flex gap-3">
              <span className="mt-1 w-2 h-2 rounded-full bg-pdam-primary shrink-0" />

              <div>
                <p className="text-xs font-semibold text-pdam-navy">
                  {item.judul}
                </p>

                <p className="text-[11px] text-slate-500">{item.ket}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function PenugasanPusatPage() {
  const currentUser = getStoredUser();

  const isAdminPusat = currentUser?.role === "admin_pusat";
  const isAdminCabang = currentUser?.role === "admin_cabang";

  // ID unit dari backend berupa UUID string.
  const unitId = currentUser?.id_unit ? String(currentUser.id_unit) : "";

  const unitName = currentUser?.nama_unit ?? "Unit";

  const [tickets, setTickets] = useState<TicketView[]>([]);
  const [pelanggan, setPelanggan] = useState<Pelanggan[]>([]);
  const [teknisi, setTeknisi] = useState<Teknisi[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingTeknisi, setLoadingTeknisi] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [cabangFilter, setCabangFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Semua");

  const [showExport, setShowExport] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [assignId, setAssignId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [cancelId, setCancelId] = useState<string | null>(null);

  const [refreshing, setRefreshing] = useState(false);

  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const editTicket = tickets.find((item) => item.id === editId) ?? null;

  const deleteTicket = tickets.find((item) => item.id === deleteId) ?? null;

  const assignTicket = tickets.find((item) => item.id === assignId) ?? null;

  const detailTicket = tickets.find((item) => item.id === detailId) ?? null;

  const cancelTicket = tickets.find((item) => item.id === cancelId) ?? null;

  /* ---------------------------------------------------------------- */
  /* Load data                                                         */
  /* ---------------------------------------------------------------- */

  const loadData = useCallback(async () => {
    if (!isAdminPusat && !isAdminCabang) {
      setError("Anda tidak memiliki akses ke halaman penugasan.");
      setLoading(false);
      return;
    }

    if (isAdminCabang && !unitId) {
      setError("Data unit pada akun Anda tidak valid.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await penugasanService.findAll();

      // Backend sudah menerapkan buildAccessScope berdasarkan role.
      // Tidak perlu melakukan filter unit lagi di frontend.
      setTickets(data.map(toTicket));

      if (isAdminCabang) {
        const pelangganResponse =
          await apiClient.get<ApiResponse<Pelanggan[]>>("/pelanggan");

        if (!pelangganResponse.success) {
          throw new Error(
            pelangganResponse.message || "Gagal mengambil data pelanggan.",
          );
        }

        const pelangganData = pelangganResponse.data ?? [];

        setPelanggan(pelangganData.filter((item) => item.id_unit === unitId));
      } else {
        setPelanggan([]);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal mengambil data penugasan.",
      );
    } finally {
      setLoading(false);
    }
  }, [isAdminPusat, isAdminCabang, unitId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  /* ---------------------------------------------------------------- */
  /* Load technicians when needed                                      */
  /* ---------------------------------------------------------------- */

  const loadTeknisi = async () => {
    if (!isAdminCabang) return;

    setLoadingTeknisi(true);
    setError("");

    try {
      const data = await teknisiService.findAll();

      setTeknisi(data.filter((item) => item.id_unit === unitId));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal mengambil data teknisi.",
      );
    } finally {
      setLoadingTeknisi(false);
    }
  };

  /* ---------------------------------------------------------------- */
  /* Filter                                                            */
  /* ---------------------------------------------------------------- */

  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return tickets.filter((item) => {
      return (
        (statusFilter === "Semua" || item.status === statusFilter) &&
        (!cabangFilter || item.cabang === cabangFilter) &&
        (!q ||
          item.id.toLowerCase().includes(q) ||
          item.nomorSpk.toLowerCase().includes(q) ||
          item.pelanggan.toLowerCase().includes(q) ||
          item.idPelanggan.toLowerCase().includes(q) ||
          item.cabang.toLowerCase().includes(q) ||
          item.alasan.toLowerCase().includes(q))
      );
    });
  }, [tickets, search, cabangFilter, statusFilter]);

  const resetFilter = () => {
    setSearch("");
    setCabangFilter("");
    setStatusFilter("Semua");
  };

  /* ---------------------------------------------------------------- */
  /* Statistics                                                        */
  /* ---------------------------------------------------------------- */

  const stats = useMemo(
    () => ({
      total: tickets.length,
      pending: tickets.filter((item) => item.status === "pending").length,
      proses: tickets.filter((item) => item.status === "proses").length,
      selesai: tickets.filter((item) => item.status === "selesai").length,
    }),
    [tickets],
  );

  const tabs = statusFilters.map((item) => ({
    ...item,
    count:
      item.value === "Semua"
        ? stats.total
        : tickets.filter((ticket) => ticket.status === item.value).length,
  }));

  const units = useMemo(
    () => [...new Set(tickets.map((item) => item.cabang))].sort(),
    [tickets],
  );

  /* ---------------------------------------------------------------- */
  /* Actions                                                           */
  /* ---------------------------------------------------------------- */

  const handleCreate = async (payload: TicketInput) => {
    await penugasanService.create(payload);
    await loadData();
  };

  const handleAssign = async (idTeknisi: string) => {
    if (!assignTicket) return;

    await penugasanService.assignTeknisi(assignTicket.id, {
      id_teknisi: idTeknisi,
    });

    await loadData();
  };

  const handleUpdate = async (
    id: string,
    payload: {
      tgl_penugasan?: string;
      alasan?: string;
    },
  ) => {
    await penugasanService.update(id, payload);
    await loadData();
  };

  const handleDelete = async (id: string) => {
    await penugasanService.delete(id);
    await loadData();
  };

  // Membatalkan penugasan melalui endpoint khusus, bukan DELETE.
  const handleCancel = async (ticketId: string) => {
    await penugasanService.cancel(ticketId);

    // Tutup modal konfirmasi.
    setCancelId(null);

    // Ambil ulang data terbaru dari backend.
    await loadData();
  };

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      await loadData();
    } finally {
      setRefreshing(false);
    }
  };

  /* ---------------------------------------------------------------- */
  /* Access control                                                     */
  /* ---------------------------------------------------------------- */

  if (!isAdminPusat && !isAdminCabang) {
    return (
      <div className="card bg-white border border-slate-200 p-6">
        <p className="text-sm font-semibold text-pdam-red">
          Anda tidak memiliki akses ke halaman ini.
        </p>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /* Render                                                            */
  /* ---------------------------------------------------------------- */

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header Title */}
      <div>
        <p className="text-xs text-slate-500 mb-1">
          <span className="font-semibold text-pdam-primary">
            PAM Tirta Kamuning
          </span>{" "}
          / Operasional /{" "}
          <span className="text-pdam-primary font-semibold">
            Penugasan Berjenjang
          </span>
        </p>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-pdam-navy">
                Manajemen Penugasan SPK
              </h1>

              <span className="badge bg-pdam-primary/10 text-pdam-primary border-pdam-primary/20 text-[10px] font-bold">
                {isAdminPusat ? "Monitoring Pusat" : unitName}
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-0.5">
              {isAdminPusat
                ? "Monitoring seluruh penugasan dari unit cabang."
                : "Kelola penugasan pelanggan dan penetapan teknisi pada unit Anda."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowExport(true)}
              className="btn btn-sm btn-ghost bg-white hover:bg-pdam-bg border border-slate-200 text-pdam-navy font-semibold normal-case shadow-xs"
            >
              <Download className="w-4 h-4 text-pdam-primary" />
              <span>Export Data (CSV)</span>
            </button>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="btn btn-sm btn-ghost bg-white hover:bg-pdam-bg border border-slate-200 text-pdam-navy font-semibold normal-case shadow-xs"
            >
              <RotateCcw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </button>

            {isAdminCabang && (
              <button
                onClick={() => setShowCreate(true)}
                className="btn btn-sm bg-pdam-primary hover:bg-pdam-navy text-white font-semibold normal-case border-0 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Buat Penugasan</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-pdam-red/30 bg-pdam-red/5 p-3 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-pdam-red mt-0.5" />

          <div className="flex-1">
            <p className="text-xs font-semibold text-pdam-red">{error}</p>
          </div>

          <button onClick={() => setError("")} className="text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4 Kartu Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-white border border-slate-200/90 shadow-xs p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Total Penugasan
              </p>

              <h3 className="text-2xl font-black text-pdam-navy tabular-nums">
                {stats.total}
              </h3>

              <p className="text-[11px] text-slate-500 mt-0.5">
                Data yang berhasil dimuat
              </p>
            </div>

            <div className="w-9 h-9 rounded-lg bg-pdam-bg flex items-center justify-center text-pdam-navy border border-slate-200/80">
              <ClipboardList className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="card bg-white border border-slate-200/90 shadow-xs p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-pdam-red uppercase tracking-wider mb-1">
                Pending
              </p>

              <h3 className="text-2xl font-black text-pdam-red tabular-nums">
                {stats.pending}
              </h3>

              <p className="text-[11px] text-pdam-red/80 mt-0.5">
                Menunggu proses berikutnya
              </p>
            </div>

            <div className="w-9 h-9 rounded-lg bg-pdam-red/10 flex items-center justify-center text-pdam-red border border-pdam-red/20">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="card bg-white border border-slate-200/90 shadow-xs p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-pdam-primary uppercase tracking-wider mb-1">
                Sedang Dikerjakan
              </p>

              <h3 className="text-2xl font-black text-pdam-primary tabular-nums">
                {stats.proses}
              </h3>

              <p className="text-[11px] text-pdam-primary/80 mt-0.5">
                Penugasan dalam proses
              </p>
            </div>

            <div className="w-9 h-9 rounded-lg bg-pdam-primary/10 flex items-center justify-center text-pdam-primary border border-pdam-primary/20">
              <Activity className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="card bg-white border border-slate-200/90 shadow-xs p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1">
                Selesai
              </p>

              <h3 className="text-2xl font-black text-emerald-700 tabular-nums">
                {stats.selesai}
              </h3>

              <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
                Penugasan selesai
              </p>
            </div>

            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-200">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Bar Pencarian */}
      <div className="card bg-white border border-slate-200/90 shadow-xs p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari ID Penugasan, Pelanggan, ID Pelanggan, Unit..."
              className="input input-bordered input-sm w-full pl-9 text-xs bg-pdam-bg/50 border-slate-200 focus:border-pdam-primary focus:bg-white"
            />
          </div>

          <select
            value={cabangFilter}
            onChange={(e) => setCabangFilter(e.target.value)}
            disabled={isAdminCabang}
            className="select select-bordered select-sm w-full text-xs font-semibold border-slate-200 bg-white text-slate-700"
          >
            <option value="">{isAdminPusat ? "Semua Unit" : unitName}</option>

            {units.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-200 gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`btn btn-sm font-medium normal-case ${
                  statusFilter === tab.value
                    ? "bg-pdam-primary hover:bg-pdam-navy text-white border-0 shadow-xs"
                    : "btn-ghost bg-pdam-bg hover:bg-slate-200 border border-slate-200/80 text-slate-700"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          <button
            onClick={resetFilter}
            className="btn btn-sm btn-ghost text-xs text-slate-400 hover:text-pdam-navy gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Tabel SPK */}
      <div className="card bg-white border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-pdam-bg/60">
          <h3 className="font-bold text-xs uppercase tracking-wider flex items-center gap-2 text-pdam-navy">
            Daftar Surat Perintah Kerja (SPK)
            <span className="badge border border-pdam-primary/30 bg-pdam-primary/10 text-pdam-primary text-[10px] font-semibold">
              Data Backend
            </span>
          </h3>

          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span>
              Menampilkan {filtered.length} dari {tickets.length} penugasan
            </span>

            <span>•</span>

            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
              Data dimuat
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table table-sm w-full">
            <thead>
              <tr className="bg-pdam-bg text-pdam-navy text-[11px] uppercase tracking-wider border-b border-slate-200 font-bold">
                <th className="py-3.5 pl-5">ID &amp; Tanggal</th>
                <th className="py-3.5">Unit</th>
                <th className="py-3.5">Pelanggan &amp; Alamat</th>
                <th className="py-3.5">Alasan</th>
                <th className="py-3.5">Teknisi</th>
                <th className="py-3.5">Status</th>
                <th className="py-3.5 text-right pr-5">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    Memuat data penugasan...
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-pdam-bg/60 transition-colors"
                  >
                    <td className="py-3.5 pl-5 font-bold">
                      <span className="text-pdam-primary font-mono block">
                        {item.nomorSpk}
                      </span>

                      <span className="text-[10px] text-slate-400 font-normal">
                        {item.tanggal}
                      </span>
                    </td>

                    <td className="py-3.5">
                      <span className="badge bg-slate-100 text-slate-700 border-slate-200 badge-sm font-bold">
                        {item.cabang}
                      </span>
                    </td>

                    <td className="py-3.5">
                      <span className="font-semibold text-pdam-navy block">
                        {item.pelanggan}
                      </span>

                      <span className="text-[10px] text-slate-500">
                        {item.alamat}
                      </span>

                      <span className="text-[10px] text-slate-400 block font-mono">
                        {item.idPelanggan}
                      </span>
                    </td>

                    <td className="py-3.5">
                      <span className="text-slate-700">{item.alasan}</span>
                    </td>

                    <td className="py-3.5">
                      {item.teknisi ? (
                        <span className="font-medium text-slate-700">
                          {item.teknisi}
                        </span>
                      ) : item.status === "pending" && isAdminCabang ? (
                        <button
                          onClick={async () => {
                            setAssignId(item.id);
                            await loadTeknisi();
                          }}
                          className="btn btn-xs btn-outline border-pdam-primary text-pdam-primary hover:bg-pdam-primary hover:text-white font-semibold normal-case"
                        >
                          + Pilih
                        </button>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    <td className="py-3.5">
                      <span
                        className={`badge badge-sm font-bold border ${statusClass[item.status]}`}
                      >
                        {statusLabel[item.status]}
                      </span>
                    </td>

                    <td className="py-3.5 text-right pr-5">
                      <div className="flex items-center justify-end gap-2">
                        {isAdminCabang && item.status === "pending" && (
                          <button
                            onClick={() => setEditId(item.id)}
                            className="text-xs font-semibold text-pdam-primary hover:text-pdam-navy hover:underline"
                          >
                            Edit
                          </button>
                        )}

                        {isAdminCabang &&
                          (item.status === "pending" ||
                            item.status === "dibatalkan") && (
                            <button
                              onClick={() => setDeleteId(item.id)}
                              className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline"
                            >
                              Hapus
                            </button>
                          )}

                        <button
                          onClick={() => setDetailId(item.id)}
                          className="text-pdam-primary hover:text-pdam-navy font-semibold hover:underline flex items-center gap-0.5"
                        >
                          Detail
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    Tidak ada penugasan yang sesuai filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <div>
            Menampilkan {filtered.length} data dari {tickets.length} penugasan.
          </div>

          <div className="join">
            <button className="join-item btn btn-sm btn-ghost" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button className="join-item btn btn-sm bg-pdam-primary text-white font-bold border-0">
              1
            </button>

            <button className="join-item btn btn-sm btn-ghost" disabled>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showExport && (
        <ExportModal
          onClose={() => setShowExport(false)}
          allData={tickets}
          filteredData={filtered}
        />
      )}

      {showCreate && isAdminCabang && (
        <CreateTicketModal
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
          pelanggan={pelanggan}
          unitId={unitId}
        />
      )}

      {assignTicket && isAdminCabang && (
        <AssignModal
          ticket={assignTicket}
          onClose={() => setAssignId(null)}
          onAssign={handleAssign}
          teknisi={loadingTeknisi ? [] : teknisi}
        />
      )}

      {detailTicket && !assignTicket && (
        <DetailModal
          ticket={detailTicket}
          onClose={() => setDetailId(null)}
          onPickTeknisi={async () => {
            setDetailId(null);
            setAssignId(detailTicket.id);
            await loadTeknisi();
          }}
          onRequestCancel={() => {
            // Tutup modal detail terlebih dahulu.
            setDetailId(null);

            // Buka modal konfirmasi pembatalan.
            setCancelId(detailTicket.id);
          }}
          isAdminCabang={isAdminCabang}
        />
      )}

      {cancelTicket && isAdminCabang && (
        <CancelTicketModal
          ticket={cancelTicket}
          onClose={() => setCancelId(null)}
          onConfirm={() => handleCancel(cancelTicket.id)}
        />
      )}

      {editTicket && isAdminCabang && (
        <EditTicketModal
          ticket={editTicket}
          onClose={() => setEditId(null)}
          onSave={handleUpdate}
        />
      )}

      {deleteTicket && isAdminCabang && (
        <DeleteTicketModal
          ticket={deleteTicket}
          onClose={() => setDeleteId(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
