// General utility functions directory
// Add custom project helpers here when needed.

/** 1284 -> "1,284", 12900 -> "12.9K", 4200000 -> "4.2M". */
export const formatCompactNumber = (value: number): string => {
  if (!Number.isFinite(value)) return "0";
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (abs >= 10_000) return `${(value / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return Math.round(value).toLocaleString("en-US");
};

/** Money is always shown in BDT across the product. */
export const formatBdt = (value: number, compact = false): string =>
  `৳${compact ? formatCompactNumber(value) : Math.round(value || 0).toLocaleString("en-US")}`;

/** "3 Mar 2026" — short, unambiguous, and stable between server and client. */
export const formatShortDate = (value: string | Date): string =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

/** "2h ago" / "5d ago" for activity feeds, falling back to a date past a month. */
export const formatRelativeTime = (value: string | Date): string => {
  const date = new Date(value);
  const seconds = Math.round((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
  return formatShortDate(date);
};

/**
 * Rounds a chart's upper bound up to a clean 1 / 2 / 5 × 10^n value, so axis
 * ticks land on readable numbers instead of the raw maximum.
 */
export const niceCeiling = (value: number): number => {
  if (value <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const normalized = value / magnitude;
  const step = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return step * magnitude;
};
