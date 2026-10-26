import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage?: number;
  startIndex?: number;
  endIndex?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  startIndex,
  endIndex,
}: PaginationProps) {
  const from = startIndex !== undefined ? startIndex + 1 : (currentPage - 1) * 10 + 1;
  const to = endIndex !== undefined ? endIndex : Math.min(currentPage * 10, totalItems);

  // Generate page numbers
  const pages: (number | string)[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
      <div>
        Menampilkan{" "}
        <span className="font-semibold text-slate-700">
          {totalItems === 0 ? 0 : from}
        </span>{" "}
        -{" "}
        <span className="font-semibold text-slate-700">
          {totalItems === 0 ? 0 : to}
        </span>{" "}
        dari <span className="font-semibold text-slate-700">{totalItems}</span> data
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="btn btn-xs btn-outline border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50 hover:border-slate-300"
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-1">
          {pages.map((p, idx) =>
            typeof p === "number" ? (
              <button
                key={idx}
                onClick={() => onPageChange(p)}
                className={`btn btn-xs ${
                  currentPage === p
                    ? "bg-pdam-primary text-white border-pdam-primary hover:bg-pdam-primary/90"
                    : "btn-ghost text-slate-600 hover:bg-slate-100"
                }`}
              >
                {p}
              </button>
            ) : (
              <span key={idx} className="px-1 text-slate-400">
                ...
              </span>
            )
          )}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || totalPages === 0}
          className="btn btn-xs btn-outline border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50 hover:border-slate-300"
          aria-label="Halaman berikutnya"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
