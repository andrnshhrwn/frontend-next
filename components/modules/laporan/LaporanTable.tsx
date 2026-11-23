"use client";

import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

import { Pagination } from "@/components/ui";
import type { Meta } from "@/services/laporanService";

export interface Column<T> {
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface Props<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  meta?: Meta;
  loading: boolean;
  emptyText: string;
  onPageChange: (page: number) => void;
  onDetail?: (row: T) => void;
}

export default function LaporanTable<T>({
  columns,
  rows,
  rowKey,
  meta,
  loading,
  emptyText,
  onPageChange,
  onDetail,
}: Props<T>) {
  const colSpan = columns.length + (onDetail ? 1 : 0);

  const startIndex = meta ? (meta.page - 1) * meta.limit : 0;
  const endIndex = meta
    ? Math.min(startIndex + rows.length, meta.total_records)
    : 0;

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {columns.map((c) => (
                <th key={c.header} className={`px-4 py-3 ${c.className ?? ""}`}>
                  {c.header}
                </th>
              ))}
              {onDetail && <th className="px-4 py-3 text-right">Aksi</th>}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs">
            {loading && (
              <tr>
                <td
                  colSpan={colSpan}
                  className="py-12 text-center text-slate-400"
                >
                  Memuat data laporan...
                </td>
              </tr>
            )}

            {!loading &&
              rows.map((row) => (
                <tr
                  key={rowKey(row)}
                  className="transition-colors hover:bg-slate-50/60"
                >
                  {columns.map((c) => (
                    <td
                      key={c.header}
                      className={`px-4 py-3.5 align-top ${c.className ?? ""}`}
                    >
                      {c.render(row)}
                    </td>
                  ))}

                  {onDetail && (
                    <td className="px-4 py-3.5 text-right align-top">
                      <button
                        type="button"
                        onClick={() => onDetail(row)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-pdam-primary hover:text-pdam-navy hover:underline"
                      >
                        Detail
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}

            {!loading && rows.length === 0 && (
              <tr>
                <td
                  colSpan={colSpan}
                  className="py-12 text-center text-slate-400"
                >
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {meta && (
        <div className="border-t border-slate-100 p-4">
          <Pagination
            currentPage={meta.page}
            totalPages={meta.total_pages}
            totalItems={meta.total_records}
            onPageChange={onPageChange}
            startIndex={startIndex}
            endIndex={endIndex}
          />
        </div>
      )}
    </div>
  );
}
