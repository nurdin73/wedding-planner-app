export function formatRupiah(amount: number): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(safeAmount);
}

export function formatCompactRupiah(amount: number): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  if (safeAmount >= 1_000_000_000) {
    return `Rp ${(safeAmount / 1_000_000_000).toFixed(1)} M`;
  }
  if (safeAmount >= 1_000_000) {
    return `Rp ${(safeAmount / 1_000_000).toFixed(1)} jt`;
  }
  return formatRupiah(safeAmount);
}

export function calculatePercentage(current: number, total: number): number {
  if (!total || total <= 0) return 0;
  const ratio = (current / total) * 100;
  return Math.min(Math.max(Math.round(ratio), 0), 100);
}
