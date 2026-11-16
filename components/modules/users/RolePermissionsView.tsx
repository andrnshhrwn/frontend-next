import {
  Building2,
  CheckCircle2,
  Minus,
  ShieldCheck,
  UserCog,
} from "lucide-react";
import type { Access } from "@/types/user.types";
import { permissionRows } from "@/utils/user.utils";

function AccessCell({ value }: { value: Access }) {
  if (value === "none") {
    return <Minus className="w-4 h-4 text-slate-300 mx-auto" />;
  }

  const map = {
    all: {
      label: "Penuh",
      cls: "border-pdam-navy/25 bg-pdam-navy/10 text-pdam-navy",
    },
    unit: {
      label: "Unit sendiri",
      cls: "border-pdam-primary/25 bg-pdam-primary/10 text-pdam-primary",
    },
    own: {
      label: "Tugas sendiri",
      cls: "border-amber-500/30 bg-amber-500/10 text-amber-700",
    },
  } as const;

  return (
    <span
      className={`badge badge-sm font-semibold border gap-1 ${map[value].cls}`}
    >
      <CheckCircle2 className="w-3 h-3" />
      {map[value].label}
    </span>
  );
}

export default function RolePermissionsView() {
  const roles = [
    {
      name: "Admin Pusat",
      scope: "Global (Pusat & seluruh cabang)",
      icon: ShieldCheck,
      cls: "bg-pdam-navy/10 text-pdam-navy",
    },
    {
      name: "Admin Cabang",
      scope: "Unit cabang terkait",
      icon: Building2,
      cls: "bg-pdam-primary/10 text-pdam-primary",
    },
    {
      name: "Teknisi",
      scope: "Hanya tugas yang ditugaskan",
      icon: UserCog,
      cls: "bg-amber-500/10 text-amber-700",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roles.map((role) => (
          <div
            key={role.name}
            className="card bg-white border border-slate-200/90 shadow-xs p-4 flex-row items-start gap-3"
          >
            <div className={`p-2 rounded-lg ${role.cls}`}>
              <role.icon className="w-5 h-5" />
            </div>

            <div>
              <p className="font-bold text-sm text-pdam-navy">{role.name}</p>
              <p className="text-[11px] text-slate-500">{role.scope}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card bg-white border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-sm w-full">
            <thead>
              <tr className="bg-pdam-bg text-pdam-navy text-[11px] uppercase tracking-wider border-b border-slate-200 font-bold">
                <th className="py-3.5 pl-5">Fitur / Hak Akses</th>
                <th className="py-3.5 text-center">Admin Pusat</th>
                <th className="py-3.5 text-center">Admin Cabang</th>
                <th className="py-3.5 text-center pr-5">Teknisi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {permissionRows.map((permission) => (
                <tr
                  key={permission.fitur}
                  className="hover:bg-pdam-bg/60 transition-colors"
                >
                  <td className="py-3.5 pl-5 font-semibold text-pdam-navy">
                    {permission.fitur}
                  </td>
                  <td className="py-3.5 text-center">
                    <AccessCell value={permission.pusat} />
                  </td>
                  <td className="py-3.5 text-center">
                    <AccessCell value={permission.cabang} />
                  </td>
                  <td className="py-3.5 text-center pr-5">
                    <AccessCell value={permission.teknisi} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-200 bg-pdam-bg/50 text-[11px] text-slate-500">
          Matriks ini merupakan gambaran hak akses aplikasi. Pembatasan akses
          sebenarnya tetap diterapkan oleh backend melalui autentikasi dan
          otorisasi.
        </div>
      </div>
    </div>
  );
}
