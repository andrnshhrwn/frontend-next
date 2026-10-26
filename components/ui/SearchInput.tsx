import React from "react";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Cari data...",
  className = "",
  autoFocus = false,
}: SearchInputProps) {
  return (
    <div className={`relative flex items-center min-w-[200px] ${className}`}>
      <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-8 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pdam-primary/30 focus:border-pdam-primary transition"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 transition"
          aria-label="Hapus pencarian"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
