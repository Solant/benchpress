export function formatOps(ops: number | null | undefined): string {
  if (ops == null) return '—';
  if (ops >= 1_000_000) return `${(ops / 1_000_000).toFixed(2)}M`;
  if (ops >= 1_000) return `${(ops / 1_000).toFixed(2)}K`;
  return `${ops.toFixed(0)}`;
}

export function formatMs(ms: number | null | undefined): string {
  if (ms == null) return '—';
  if (ms >= 1) return `${ms.toFixed(2)} ms`;
  if (ms >= 0.001) return `${(ms * 1_000).toFixed(2)} µs`;
  return `${(ms * 1_000_000).toFixed(2)} ns`;
}

export function formatPercentage(value: number | null | undefined): string {
  return `${(value ?? 0).toFixed(2)}%`;
}
