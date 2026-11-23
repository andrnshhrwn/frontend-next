"use client";

import type { ReactNode } from "react";
import { FileText } from "lucide-react";

import { BaseModal } from "@/components/ui";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  fields: { label: string; value: ReactNode }[];
  children?: ReactNode;
}

export default function LaporanDetailModal({
  isOpen,
  onClose,
  title,
  subtitle,
  fields,
  children,
}: Props) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      icon={<FileText className="h-5 w-5" />}
      maxWidth="lg"
    >
      <div className="space-y-4 text-xs">
        <div className="grid grid-cols-1 gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.label}>
              <span className="mb-1 block text-[10px] font-semibold uppercase text-slate-400">
                {f.label}
              </span>
              <span className="font-semibold text-slate-800">{f.value}</span>
            </div>
          ))}
        </div>

        {children}

        <div className="flex justify-end border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-sm rounded-md text-slate-600"
          >
            Tutup
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
