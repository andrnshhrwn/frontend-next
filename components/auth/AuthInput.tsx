"use client";

import type { ReactNode } from "react";

interface AuthInputProps {
  id: string;
  name: string;
  label: string;
  type: string;
  value: string;
  placeholder: string;
  autoComplete: string;
  icon: ReactNode;
  disabled?: boolean;
  required?: boolean;
  trailing?: ReactNode;
  onChange: (value: string) => void;
}

export default function AuthInput({
  id,
  name,
  label,
  type,
  value,
  placeholder,
  autoComplete,
  icon,
  disabled = false,
  required = true,
  trailing,
  onChange,
}: AuthInputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-gray-700"
      >
        {label}
      </label>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-gray-400">
          {icon}
        </div>

        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          required={required}
          className={`w-full rounded-md border border-gray-200 bg-white py-3.5 pl-12 ${
            trailing ? "pr-12" : "pr-4"
          } text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60`}
        />

        {trailing && (
          <div className="absolute inset-y-0 right-4 flex items-center justify-center">
            {trailing}
          </div>
        )}
      </div>
    </div>
  );
}
