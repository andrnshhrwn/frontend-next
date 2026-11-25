"use client";

import { useEffect, useState } from "react";
import {
  Download,
  Filter,
  LoaderCircle,
  MapPin,
  RotateCcw,
} from "lucide-react";

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
  onExport: () => void;
  exporting: boolean;
  extra?: {
    key: string;
    label: string;
    options: { value: string; label: string }[];
  };
}

const labelClass = "mb-1 block text-[11px] font-semibold text-slate-600";

const dateInputClass =
  "w-full min-w-0 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-pdam-primary/20";

export default function LaporanFilterBar({
  value,
  onChange,
  onExport,
  exporting,
  extra,
}: Props) {
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

  const handleReset = () => {
    onChange({ page: 1, limit: value.limit });
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-3 sm:p-4 xl:flex-row xl:items-end">
      {/* Field filter: 1 kolom (mobile) -> 2 kolom (sm) -> menyesuaikan lebar (lg+) */}
      <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(11rem,1fr))]">
        <div className="min-w-0">
          <label className={labelClass}>Dari Tanggal</label>
          <input
            type="date"
            value={String(value.dari ?? "")}
            max={String(value.sampai ?? "") || undefined}
            onChange={(e) => setField("dari", e.target.value)}
            className={dateInputClass}
          />
        </div>

        <div className="min-w-0">
          <label className={labelClass}>Sampai Tanggal</label>
          <input
            type="date"
            value={String(value.sampai ?? "")}
            min={String(value.dari ?? "") || undefined}
            onChange={(e) => setField("sampai", e.target.value)}
            className={dateInputClass}
          />
        </div>

        {isGlobal && (
          <div className="min-w-0">
            <label className={labelClass}>Unit</label>
            <SelectDropdown
              value={String(value.id_unit ?? ALL)}
              onChange={(v: string) =>
                setField("id_unit", v === ALL ? undefined : v)
              }
              options={[
                { value: ALL, label: "Semua Unit" },
                ...units.map((u) => ({
                  value: u.id_unit,
                  label: u.nama_unit,
                })),
              ]}
              icon={<MapPin className="h-3.5 w-3.5" />}
              className="w-full"
            />
          </div>
        )}

        {extra && (
          <div className="min-w-0">
            <label className={labelClass}>{extra.label}</label>
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
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Aksi: 2 tombol sama lebar (mobile) -> rata kanan (sm+) */}
      <div className="grid grid-cols-2 gap-2 sm:flex sm:justify-end xl:shrink-0">
        <button
          type="button"
          onClick={handleReset}
          disabled={!hasFilter || exporting}
          className="btn btn-sm btn-ghost w-full border border-slate-200 bg-white font-semibold normal-case text-slate-600 hover:bg-pdam-bg disabled:opacity-50 sm:w-auto"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>

        <button
          type="button"
          onClick={onExport}
          disabled={exporting}
          className="btn btn-sm w-full bg-pdam-primary font-semibold normal-case text-white hover:bg-pdam-primary/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {exporting ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {exporting ? "Memproses..." : "Export Excel"}
        </button>
      </div>
    </div>
  );
}
