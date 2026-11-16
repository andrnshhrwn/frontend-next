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
  itemsPerPage = 10,
  startIndex,
  endIndex,
}: PaginationProps) {
  const from =
    totalItems === 0
      ? 0
      : startIndex !== undefined
        ? startIndex + 1
        : (currentPage - 1) * itemsPerPage + 1;

  const to =
    totalItems === 0
      ? 0
      : endIndex !== undefined
        ? endIndex
        : Math.min(currentPage * itemsPerPage, totalItems);

  const pages: (number | string)[] = [];

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
      <div>
        Menampilkan <span className="font-semibold text-slate-700">{from}</span>{" "}
        - <span className="font-semibold text-slate-700">{to}</span> dari{" "}
        <span className="font-semibold text-slate-700">{totalItems}</span> data
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="btn btn-xs btn-outline border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50 hover:border-slate-300"
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-1">
          {pages.map((page, index) =>
            typeof page === "number" ? (
              <button
                type="button"
                key={page}
                onClick={() => onPageChange(page)}
                aria-label={`Halaman ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
                className={`btn btn-xs ${
                  currentPage === page
                    ? "bg-pdam-primary text-white border-pdam-primary hover:bg-pdam-primary/90"
                    : "btn-ghost text-slate-600 hover:bg-slate-100"
                }`}
              >
                {page}
              </button>
            ) : (
              <span
                key={`ellipsis-${index}`}
                className="px-1 text-slate-400"
                aria-hidden="true"
              >
                ...
              </span>
            ),
          )}
        </div>

        <button
          type="button"
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
