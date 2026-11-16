"use client";

import { useState } from "react";
import { AlertCircle, Check, Loader2, UserPlus } from "lucide-react";
import { BaseModal } from "@/components/ui";
import { useAuth } from "@/components/providers/AuthProvider";
import type { User, Unit, UserRole, UserSavePayload } from "@/types/user.types";
import {
  btnGhost,
  btnPrimary,
  inputCls,
  labelCls,
  selectCls,
  getErrorMessage,
} from "@/utils/user.utils";

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
  children: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <BaseModal
      isOpen={true}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      maxWidth={wide ? "2xl" : "md"}
    >
      <div>
        {children}

        {footer && (
          <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
            {footer}
          </div>
        )}
      </div>
    </BaseModal>
  );
}

interface UserFormModalProps {
  editing: User | null;
  units: Unit[];
  onClose: () => void;
  onSave: (payload: UserSavePayload, isNew: boolean) => Promise<void>;
}

export default function UserFormModal({
  editing,
  units,
  onClose,
  onSave,
}: UserFormModalProps) {
  const { hasRole } = useAuth();

  const isAdminPusat = hasRole("admin_pusat");
  const isAdminCabang = hasRole("admin_cabang");

  const isEdit = Boolean(editing);

  // Semua Hooks harus dipanggil sebelum conditional return.
  const [fullname, setFullname] = useState(editing?.fullname ?? "");
  const [username, setUsername] = useState(editing?.username ?? "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(editing?.role ?? "admin_cabang");
  const [idUnit, setIdUnit] = useState(editing?.id_unit ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  const handleSubmit = async () => {
    if (loading) return;

    setError("");

    const normalizedFullname = fullname.trim();
    const normalizedUsername = username.trim();

    if (!normalizedFullname) {
      setError("Nama lengkap wajib diisi.");
      return;
    }

    if (normalizedFullname.length > 100) {
      setError("Nama lengkap maksimal 100 karakter.");
      return;
    }

    if (!normalizedUsername) {
      setError("Username wajib diisi.");
      return;
    }

    if (normalizedUsername.length < 3) {
      setError("Username minimal 3 karakter.");
      return;
    }

    if (normalizedUsername.length > 50) {
      setError("Username maksimal 50 karakter.");
      return;
    }

    if (!/^[a-zA-Z0-9._-]+$/.test(normalizedUsername)) {
      setError(
        "Username hanya boleh menggunakan huruf, angka, titik, garis bawah, dan tanda hubung.",
      );
      return;
    }

    if (!isEdit && password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }

    if (!isEdit && new TextEncoder().encode(password).length > 72) {
      setError("Password maksimal 72 byte.");
      return;
    }

    // Unit hanya dapat ditentukan oleh Admin Pusat.
    if (isAdminPusat && role !== "admin_pusat") {
      if (!idUnit) {
        setError("Unit wajib dipilih untuk peran ini.");
        return;
      }

      const selectedUnitExists = units.some((unit) => unit.id_unit === idUnit);

      if (!selectedUnitExists) {
        setError("Unit yang dipilih tidak valid.");
        return;
      }
    }

    let payload: UserSavePayload;

    if (isEdit) {
      payload = {
        fullname: normalizedFullname,
        username: normalizedUsername,
        role,
        id_unit: role === "admin_pusat" ? null : idUnit,
      };
    } else if (isAdminCabang) {
      // Hook hanya mengambil fullname, username, dan password
      // sebelum mengirim request ke endpoint khusus teknisi.
      payload = {
        fullname: normalizedFullname,
        username: normalizedUsername,
        password,
        role: "teknisi",
        id_unit: null,
      };
    } else {
      payload = {
        fullname: normalizedFullname,
        username: normalizedUsername,
        password,
        role,
        id_unit: role === "admin_pusat" ? null : idUnit,
      };
    }

    try {
      setLoading(true);

      await onSave(payload, !isEdit);

      // Tutup modal setelah penyimpanan berhasil.
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Pembatasan akses dilakukan setelah semua Hooks dipanggil.
  if (!isAdminPusat && !isAdminCabang) {
    return null;
  }

  // Admin Cabang hanya boleh membuat teknisi.
  if (isEdit && !isAdminPusat) {
    return null;
  }

  return (
    <Modal
      wide={isAdminPusat}
      title={isEdit ? "Edit Pengguna" : "Tambah Pengguna Baru"}
      subtitle={
        isEdit
          ? "Perbarui informasi dan hak akses pengguna."
          : isAdminCabang
            ? "Buat akun teknisi untuk unit cabang Anda."
            : "Buat akun pengguna baru pada sistem PAM Tirta Kamuning."
      }
      onClose={handleClose}
      footer={
        <>
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className={btnGhost}
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              loading ||
              !fullname.trim() ||
              !username.trim() ||
              (!isEdit && !password)
            }
            className={btnPrimary}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isEdit ? (
              <Check className="h-4 w-4" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}

            {loading
              ? "Menyimpan..."
              : isEdit
                ? "Simpan Perubahan"
                : "Tambah Pengguna"}
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelCls}>Nama Lengkap</label>
          <input
            className={inputCls}
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            placeholder="Contoh: Agung Pratama"
            maxLength={100}
            autoComplete="name"
            disabled={loading}
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelCls}>Username</label>
          <input
            className={`${inputCls} font-sans`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="contoh: agung.pratama"
            minLength={3}
            maxLength={50}
            autoComplete="username"
            disabled={loading}
            required
          />
          <p className="mt-1 text-[10px] text-slate-400">
            Gunakan huruf, angka, titik, garis bawah, atau tanda hubung.
          </p>
        </div>

        {isAdminPusat && (
          <div>
            <label className={labelCls}>Peran</label>
            <select
              className={selectCls}
              value={role}
              onChange={(e) => {
                const nextRole = e.target.value as UserRole;

                setRole(nextRole);

                if (nextRole === "admin_pusat") {
                  setIdUnit("");
                }
              }}
              disabled={loading}
            >
              <option value="admin_pusat">Admin Pusat</option>
              <option value="admin_cabang">Admin Cabang</option>
              <option value="teknisi">Teknisi</option>
            </select>
          </div>
        )}

        {isAdminPusat && (
          <div>
            <label className={labelCls}>Unit</label>
            <select
              className={selectCls}
              value={idUnit}
              disabled={loading || role === "admin_pusat"}
              onChange={(e) => setIdUnit(e.target.value)}
            >
              <option value="">
                {role === "admin_pusat"
                  ? "Tidak menggunakan unit"
                  : "Pilih unit"}
              </option>

              {units.map((unit) => (
                <option key={unit.id_unit} value={unit.id_unit}>
                  {unit.nama_unit}
                </option>
              ))}
            </select>
          </div>
        )}

        {isAdminCabang && !isEdit && (
          <div className="sm:col-span-2 rounded-lg border border-blue-200 bg-blue-50 p-3">
            <p className="text-sm font-semibold text-blue-800">
              Peran: Teknisi
            </p>
            <p className="mt-1 text-xs text-blue-700">
              Akun teknisi akan otomatis ditempatkan pada unit cabang Anda. Unit
              tidak dapat dipilih atau diubah melalui form ini.
            </p>
          </div>
        )}

        {!isEdit && (
          <div className="sm:col-span-2">
            <label className={labelCls}>Password Awal</label>
            <input
              className={`${inputCls} font-sans`}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
              autoComplete="new-password"
              disabled={loading}
              required
            />
            <p className="mt-1 text-[10px] text-slate-400">
              Password akan di-hash oleh backend sebelum disimpan.
            </p>
          </div>
        )}

        {error && (
          <p className="sm:col-span-2 flex items-center gap-1 text-xs font-medium text-pdam-red">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {error}
          </p>
        )}
      </div>
    </Modal>
  );
}
