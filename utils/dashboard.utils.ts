export function formatDashboardPeriod(period: string): string {
  const [year, month] = period.split("-").map(Number);

  if (!year || !month || month < 1 || month > 12) {
    return period;
  }

  return new Date(year, month - 1, 1).toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });
}

export function formatDashboardNumber(value: number): string {
  return value.toLocaleString("id-ID");
}

export function calculateDashboardPercentage(
  value: number,
  total: number,
): number {
  if (total <= 0) return 0;

  return Math.round((value / total) * 100);
}

export function clampDashboardPercentage(value: number): number {
  return Math.max(0, Math.min(value, 100));
}
