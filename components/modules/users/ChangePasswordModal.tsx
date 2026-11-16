import { useState } from "react";
import { AlertCircle, KeyRound, Loader2 } from "lucide-react";
import { BaseModal } from "@/components/ui";
import type { User } from "@/types/user.types";
import {
  btnGhost,
  btnPrimary,
  inputCls,
  labelCls,
  getErrorMessage,
} from "@/utils/user.utils";

interface ChangePasswordModalProps {
  user: User;
  onClose: () => void;
  onSave: (password: string) => Promise<void>;
}

export default function ChangePasswordModal({
  user,
  onClose,
  onSave,
}: ChangePasswordModalProps) {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  const handleSubmit = async () => {
    setError("");

    if (password.length < 8) {
      setError("Password baru minimal 8 karakter.");
      return;
    }

    if (new TextEncoder().encode(password).length > 72) {
      setError("Password maksimal 72 byte.");
      return;
    }

    if (password !== confirmation) {
      setError("Konfirmasi password tidak sama.");
      return;
    }

    try {
      setLoading(true);
      await onSave(password);
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal
      isOpen={true}
      onClose={handleClose}
      title="Ubah Password"
      subtitle={`${user.fullname} • ${user.username}`}
      maxWidth="md"
    >
      <div>
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              Password akun pengguna akan diganti. Pengguna harus menggunakan
              password baru saat login berikutnya.
            </p>
          </div>

          <div>
            <label className={labelCls}>Password Baru</label>
            <input
              className={inputCls}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
              autoComplete="new-password"
              minLength={8}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className={labelCls}>Konfirmasi Password Baru</label>
            <input
              className={inputCls}
              type={showPassword ? "text" : "password"}
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder="Masukkan ulang password baru"
              autoComplete="new-password"
              minLength={8}
              required
              disabled={loading}
            />
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600">
            <input
              type="checkbox"
              className="checkbox checkbox-xs checkbox-primary"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              disabled={loading}
            />
            Tampilkan password
          </label>

          {error && (
            <p className="flex items-center gap-1 text-xs font-medium text-pdam-red">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {error}
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
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
            disabled={loading || !password || !confirmation}
            className={btnPrimary}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <KeyRound className="h-4 w-4" />
            )}
            {loading ? "Menyimpan..." : "Ubah Password"}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
