import { Lock } from "lucide-react";

interface UserSecurityPolicyProps {
  isAdminPusat: boolean;
  isAdminCabang: boolean;
}

export default function UserSecurityPolicy({
  isAdminPusat,
  isAdminCabang,
}: UserSecurityPolicyProps) {
  if (!isAdminPusat && !isAdminCabang) return null;

  return (
    <div className="card bg-pdam-primary/5 border border-pdam-primary/20 p-4">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-pdam-primary/10 text-pdam-primary shrink-0">
          <Lock className="w-4 h-4" />
        </div>

        <div>
          <h4 className="font-bold text-xs text-pdam-navy">
            Kebijakan Keamanan Akun
          </h4>

          {isAdminPusat && (
            <p className="text-xs text-slate-600 mt-1">
              Admin Pusat memiliki kewenangan untuk mengelola seluruh akun
              pengguna, termasuk membuat, melihat, memperbarui data, dan
              mengubah password akun.
            </p>
          )}

          {isAdminCabang && (
            <p className="text-xs text-slate-600 mt-1">
              Admin Cabang hanya dapat melihat dan menambahkan akun teknisi pada
              unitnya sendiri. Pengubahan data akun dan password pengguna tidak
              tersedia untuk peran ini.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
