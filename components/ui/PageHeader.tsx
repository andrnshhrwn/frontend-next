import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeVariant?: "primary" | "navy" | "amber" | "emerald" | "slate";
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  badge,
  badgeVariant = "primary",
  children,
}: PageHeaderProps) {
  const badgeClasses = {
    primary: "bg-pdam-primary/10 text-pdam-primary border-pdam-primary/20",
    navy: "bg-pdam-navy/10 text-pdam-navy border-pdam-navy/20",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
  }[badgeVariant];

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-200">
      <div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-xl md:text-2xl font-bold text-pdam-navy tracking-tight">{title}</h1>
          {badge && (
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badgeClasses}`}
            >
              {badge}
            </span>
          )}
        </div>
        {subtitle && <p className="text-xs md:text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2 flex-wrap">{children}</div>}
    </div>
  );
}
