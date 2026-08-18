"use client";

import React from "react";
import { formatBdt } from "@/utils";

export interface StatusSlice {
  status: string;
  count: number;
  amount: number;
}

/**
 * Status colours are reserved for status — amber waits, teal is live, emerald is
 * settled, rose is lost. Every slice is labelled too, so the bar never asks the
 * reader to decode a colour on its own.
 */
const STATUS_STYLES: Record<string, { fill: string; dot: string; label: string }> = {
  PENDING: { fill: "bg-amber-500", dot: "bg-amber-500", label: "Pending" },
  CONFIRMED: { fill: "bg-primary", dot: "bg-primary", label: "Confirmed" },
  COMPLETED: { fill: "bg-emerald-500", dot: "bg-emerald-500", label: "Completed" },
  CANCELLED: { fill: "bg-rose-500", dot: "bg-rose-500", label: "Cancelled" },
};

const fallbackStyle = { fill: "bg-muted-foreground", dot: "bg-muted-foreground", label: "Other" };

export function StatusBreakdownBar({ slices }: { slices: StatusSlice[] }) {
  const total = slices.reduce((sum, slice) => sum + slice.count, 0);
  const visible = slices.filter((slice) => slice.count > 0);

  return (
    <div className="surface flex h-full flex-col p-5 sm:p-6">
      <div>
        <h2 className="text-base font-semibold tracking-tight">Booking pipeline</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Where all {total.toLocaleString("en-US")} reservations currently stand
        </p>
      </div>

      {/* A 2px gap in the surface colour is what separates the segments — no strokes. */}
      <div className="mt-5 flex h-3 w-full gap-[2px] overflow-hidden rounded-full bg-muted">
        {visible.length === 0 ? (
          <div className="h-full w-full bg-muted" />
        ) : (
          visible.map((slice) => {
            const style = STATUS_STYLES[slice.status] ?? fallbackStyle;
            return (
              <div
                key={slice.status}
                className={`h-full ${style.fill}`}
                style={{ width: `${(slice.count / total) * 100}%` }}
                title={`${style.label}: ${slice.count}`}
              />
            );
          })
        )}
      </div>

      <dl className="mt-5 space-y-3">
        {slices.map((slice) => {
          const style = STATUS_STYLES[slice.status] ?? fallbackStyle;
          const share = total ? Math.round((slice.count / total) * 100) : 0;

          return (
            <div key={slice.status} className="flex items-center justify-between gap-3">
              <dt className="flex min-w-0 items-center gap-2 text-sm">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${style.dot}`} aria-hidden />
                <span className="truncate text-foreground">{style.label}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{share}%</span>
              </dt>
              <dd className="shrink-0 text-right">
                <span className="text-sm font-semibold tabular-nums">{slice.count}</span>
                <span className="ml-2 text-xs tabular-nums text-muted-foreground">
                  {formatBdt(slice.amount, true)}
                </span>
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}

export default StatusBreakdownBar;
