import { KeyRound, Loader2, Pencil } from "lucide-react";
import type { ReactNode } from "react";
import type { User } from "@/types/user.types";
import { roleClasses, roleLabels } from "@/utils/user.utils";

function IconAction({
  tip,
  onClick,
  tone,
  children,
}: {
  tip: string;
  onClick: () => void;
  tone: "primary" | "amber";
  children: ReactNode;
}) {
  const tones = {
    primary:
      "bg-pdam-primary/10 text-pdam-primary hover:bg-pdam-primary hover:text-white",
    amber: "bg-amber-500/10 text-amber-700 hover:bg-amber-500 hover:text-white",
  };

  return (
    <div className="tooltip tooltip-left" data-tip={tip}>
      <button
        type="button"
        onClick={onClick}
        aria-label={tip}
        className={`btn btn-sm btn-square border-0 shadow-none transition-colors ${tones[tone]}`}
      >
        {children}
      </button>
    </div>
  );
}

interface UserTableProps {
  users: User[];
  totalUsers: number;
  loading: boolean;
  canManageUsers: boolean;
  onEdit: (user: User) => void;
  onChangePassword: (user: User) => void;
}

export default function UserTable({
  users,
  totalUsers,
  loading,
  canManageUsers,
  onEdit,
  onChangePassword,
}: UserTableProps) {
  const columnCount = canManageUsers ? 5 : 4;

  return (
    <div className="card bg-white border border-slate-200/90 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table table-sm w-full">
          <thead>
            <tr className="bg-pdam-bg text-pdam-navy text-[11px] uppercase tracking-wider border-b border-slate-200 font-bold">
              <th className="py-3.5 pl-5">Nama Pengguna</th>
              <th className="py-3.5">Username</th>
              <th className="py-3.5">Peran</th>
              <th className="py-3.5">Unit</th>

              {canManageUsers && (
                <th className="py-3.5 text-right pr-5">Aksi</th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs">
            {loading ? (
              <tr>
                <td colSpan={columnCount} className="py-12 text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-pdam-primary" />
                  <p className="text-slate-500 mt-2">Memuat data pengguna...</p>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={columnCount}
                  className="py-12 text-center text-slate-400"
                >
                  Tidak ada pengguna yang sesuai dengan filter.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id_user}
                  className="hover:bg-pdam-bg/60 transition-colors"
                >
                  <td className="py-4 pl-5">
                    <span className="font-bold text-pdam-navy block">
                      {user.fullname}
                    </span>
                  </td>

                  <td className="py-4">
                    <span className="font-sans text-slate-600">
                      {user.username}
                    </span>
                  </td>

                  <td className="py-4">
                    <span
                      className={`badge badge-sm border font-semibold ${roleClasses[user.role]}`}
                    >
                      {roleLabels[user.role]}
                    </span>
                  </td>

                  <td className="py-4">
                    <span className="text-slate-700">
                      {user.unit?.nama_unit ?? (
                        <span className="text-slate-400 italic">
                          Tidak terikat unit
                        </span>
                      )}
                    </span>
                  </td>

                  {canManageUsers && (
                    <td className="py-4 pr-5">
                      <div className="flex items-center justify-end gap-1.5">
                        <IconAction
                          tip="Edit pengguna"
                          tone="primary"
                          onClick={() => onEdit(user)}
                        >
                          <Pencil className="w-4 h-4" />
                        </IconAction>

                        <IconAction
                          tip="Change Password"
                          tone="amber"
                          onClick={() => onChangePassword(user)}
                        >
                          <KeyRound className="w-4 h-4" />
                        </IconAction>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-slate-200 bg-pdam-bg/50 flex justify-between items-center gap-3 text-xs text-slate-500">
        <span>
          Menampilkan {users.length} dari {totalUsers} pengguna
        </span>
      </div>
    </div>
  );
}
