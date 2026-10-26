import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  variant?: "primary" | "navy" | "emerald" | "amber" | "red" | "slate";
  onClick?: () => void;
  className?: string;
  active?: boolean;
}

export function StatCard({
  title,
  value,
  subtext,
  icon,
  variant = "primary",
  onClick,
  className = "",
  active = false,
}: StatCardProps) {
  const variantStyles = {
    primary: {
      card: "border-pdam-primary/20 hover:border-pdam-primary/50",
      iconBg: "bg-pdam-primary/10 text-pdam-primary",
      active: "ring-2 ring-pdam-primary bg-pdam-primary/5",
    },
    navy: {
      card: "border-pdam-navy/20 hover:border-pdam-navy/50",
      iconBg: "bg-pdam-navy/10 text-pdam-navy",
      active: "ring-2 ring-pdam-navy bg-pdam-navy/5",
    },
    emerald: {
      card: "border-emerald-200 hover:border-emerald-400",
      iconBg: "bg-emerald-50 text-emerald-600",
      active: "ring-2 ring-emerald-500 bg-emerald-50/40",
    },
    amber: {
      card: "border-amber-200 hover:border-amber-400",
      iconBg: "bg-amber-50 text-amber-600",
      active: "ring-2 ring-amber-500 bg-amber-50/40",
    },
    red: {
      card: "border-rose-200 hover:border-rose-400",
      iconBg: "bg-rose-50 text-rose-600",
      active: "ring-2 ring-rose-500 bg-rose-50/40",
    },
    slate: {
      card: "border-slate-200 hover:border-slate-300",
      iconBg: "bg-slate-100 text-slate-600",
      active: "ring-2 ring-slate-400 bg-slate-50",
    },
  }[variant];

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border p-4 shadow-xs transition-all ${variantStyles.card} ${
        active ? variantStyles.active : ""
      } ${onClick ? "cursor-pointer select-none" : ""} ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 truncate">
            {title}
          </p>
          <p className="text-2xl font-bold text-pdam-navy mt-1 tracking-tight">{value}</p>
          {subtext && <p className="text-[11px] text-slate-400 mt-0.5 truncate">{subtext}</p>}
        </div>
        {icon && (
          <div className={`p-2.5 rounded-lg shrink-0 flex items-center justify-center ${variantStyles.iconBg}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
