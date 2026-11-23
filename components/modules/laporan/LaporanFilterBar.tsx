"use client";

import { useEffect, useState } from "react";
import { Filter, MapPin, RotateCcw } from "lucide-react";

import { SelectDropdown } from "@/components/ui";
import { apiClient } from "@/services/apiClient";
import { useIsGlobalScope } from "@/lib/auth/auth-store";
import type { LaporanFilters } from "@/services/laporanService";

const ALL = "all";

interface UnitOption {
  id_unit: string;
  nama_unit: string;
}

interface Props {
  value: LaporanFilters;
  onChange: (next: LaporanFilters) => void;
  extra?: {
    key: string;
    label: string;
    options: { value: string; label: string }[];
  };
}

const dateInputClass =
  "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-pdam-primary/20";

export default function LaporanFilterBar({ value, onChange, extra }: Props) {
  const isGlobal = useIsGlobalScope();
  const [units, setUnits] = useState<UnitOption[]>([]);

  useEffect(() => {
    if (!isGlobal) return;

    apiClient
      .get<{ data: UnitOption[] }>("/unit")
      .then((res) => setUnits(res.data ?? []))
      .catch(() => setUnits([]));
  }, [isGlobal]);

  const setField = (key: string, v: string | undefined) =>
    onChange({ ...value, [key]: v || undefined, page: 1 });

  const hasFilter = Boolean(
    value.dari || value.sampai || value.id_unit || (extra && value[extra.key]),
  );

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 lg:flex-row lg:items-end">
      <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-[11px] font-semibold text-slate-600">
            Dari Tanggal
          </label>
          <input
            type="date"
            value={String(value.dari ?? "")}
            max={String(value.sampai ?? "") || undefined}
            onChange={(e) => setField("dari", e.target.value)}
            className={dateInputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-semibold text-slate-600">
            Sampai Tanggal
          </label>
          <input
            type="date"
            value={String(value.sampai ?? "")}
            min={String(value.dari ?? "") || undefined}
            onChange={(e) => setField("sampai", e.target.value)}
            className={dateInputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {isGlobal && (
          <SelectDropdown
            value={String(value.id_unit ?? ALL)}
            onChange={(v: string) =>
              setField("id_unit", v === ALL ? undefined : v)
            }
            options={[
              { value: ALL, label: "Semua Unit" },
              ...units.map((u) => ({ value: u.id_unit, label: u.nama_unit })),
            ]}
            icon={<MapPin className="h-3.5 w-3.5" />}
            className="w-full sm:w-52"
          />
        )}

        {extra && (
          <SelectDropdown
            value={String(value[extra.key] ?? ALL)}
            onChange={(v: string) =>
              setField(extra.key, v === ALL ? undefined : v)
            }
            options={[
              { value: ALL, label: `Semua ${extra.label}` },
              ...extra.options,
            ]}
            icon={<Filter className="h-3.5 w-3.5" />}
            className="w-full sm:w-52"
          />
        )}

        <button
          type="button"
          onClick={() => onChange({ page: 1, limit: value.limit })}
          disabled={!hasFilter}
          className="btn btn-sm btn-ghost border border-slate-200 bg-white font-semibold normal-case text-slate-600 hover:bg-pdam-bg disabled:opacity-50"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>
    </div>
  );
}
