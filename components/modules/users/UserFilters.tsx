import { Search } from "lucide-react";
import type { Unit, RoleFilter } from "@/types/user.types";
import { roleFilters } from "@/utils/user.utils";

interface UserFiltersProps {
  units: Unit[];
  roleFilter: RoleFilter;
  unitFilter: string;
  search: string;
  isAdminPusat: boolean;
  onRoleChange: (role: RoleFilter) => void;
  onUnitChange: (unitId: string) => void;
  onSearchChange: (value: string) => void;
}

export default function UserFilters({
  units,
  roleFilter,
  unitFilter,
  search,
  isAdminPusat,
  onRoleChange,
  onUnitChange,
  onSearchChange,
}: UserFiltersProps) {
  return (
    <div className="card bg-white border border-slate-200/90 shadow-xs p-4">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {isAdminPusat && (
          <div className="flex flex-wrap items-center gap-2">
            {roleFilters.map((filter) => (
              <button
                type="button"
                key={filter.value}
                onClick={() => onRoleChange(filter.value)}
                className={`btn btn-xs normal-case font-semibold ${
                  roleFilter === filter.value
                    ? "bg-pdam-primary hover:bg-pdam-navy text-white border-0"
                    : "btn-ghost bg-pdam-bg border border-slate-200/80 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {isAdminPusat && (
            <select
              value={unitFilter}
              onChange={(e) => onUnitChange(e.target.value)}
              className="select select-bordered select-sm text-xs font-medium border-slate-200 bg-white"
            >
              <option value="all">Semua Unit</option>
              {units.map((unit) => (
                <option key={unit.id_unit} value={unit.id_unit}>
                  {unit.nama_unit}
                </option>
              ))}
            </select>
          )}

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari nama atau username..."
              className="input input-bordered input-sm w-full sm:w-64 pl-9 text-xs bg-pdam-bg/50 border-slate-200 focus:border-pdam-primary focus:bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
