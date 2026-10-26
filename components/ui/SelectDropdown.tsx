import React from "react";

interface OptionItem {
  label: string;
  value: string;
}

interface SelectDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: (OptionItem | string)[];
  placeholder?: string;
  className?: string;
  icon?: React.ReactNode;
}

export function SelectDropdown({
  value,
  onChange,
  options,
  placeholder,
  className = "",
  icon,
}: SelectDropdownProps) {
  const normalizedOptions: OptionItem[] = options.map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt
  );

  return (
    <div className={`relative flex items-center ${className}`}>
      {icon && (
        <span className="absolute left-3 text-slate-400 pointer-events-none flex items-center">
          {icon}
        </span>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-white border border-slate-200 rounded-lg py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-pdam-primary/30 focus:border-pdam-primary transition cursor-pointer ${
          icon ? "pl-9 pr-8" : "pl-3 pr-8"
        }`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {normalizedOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
