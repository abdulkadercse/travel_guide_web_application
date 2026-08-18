"use client";

import React, { useState } from "react";
import { formatBdt, formatCompactNumber, niceCeiling } from "@/utils";

export interface TrendPoint {
  label: string;
  year: number;
  month: string;
  reservations: number;
  revenue: number;
  newUsers: number;
}

type Metric = "reservations" | "revenue" | "newUsers";

const METRICS: { key: Metric; label: string; caption: string }[] = [
  { key: "reservations", label: "Bookings", caption: "Bookings created per month" },
  { key: "revenue", label: "Revenue", caption: "Confirmed & completed booking value per month" },
  { key: "newUsers", label: "New users", caption: "Accounts registered per month" },
];

/**
 * One metric at a time on a single axis — a bookings/revenue pair on two scales
 * would be a dual-axis chart, which is unreadable. The toggle swaps the series
 * instead, and the hover card still carries all three numbers for the month.
 */
export function OverviewTrendChart({ points }: { points: TrendPoint[] }) {
  const [metric, setMetric] = useState<Metric>("reservations");
  const active = METRICS.find((item) => item.key === metric)!;

  const values = points.map((point) => point[metric]);
  const max = niceCeiling(Math.max(...values, 0));
  const ticks = [max, max / 2, 0];

  /** Counts are whole numbers, so an odd axis midpoint is left unlabelled
      rather than rounded into a value the gridline does not sit on. */
  const formatTick = (value: number) => {
    if (metric === "revenue") return formatBdt(value, true);
    return Number.isInteger(value) ? formatCompactNumber(value) : "";
  };

  const peakIndex = values.indexOf(Math.max(...values));
  const hasData = values.some((value) => value > 0);

  return (
    <div className="surface p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight">Last 6 months</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">{active.caption}</p>
        </div>

        <div
          role="tablist"
          aria-label="Trend metric"
          className="flex shrink-0 items-center gap-1 rounded-full border border-border bg-muted/50 p-1"
        >
          {METRICS.map((item) => (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={metric === item.key}
              onClick={() => setMetric(item.key)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                metric === item.key
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        {/* Y axis ticks carry the values the bars are not directly labelled with. */}
        <div className="flex h-52 w-14 shrink-0 flex-col justify-between pb-6 text-right text-[11px] tabular-nums text-muted-foreground">
          {ticks.map((tick, index) => (
            <span key={index}>{formatTick(tick)}</span>
          ))}
        </div>

        <div className="relative flex-1">
          {/* Hairline gridlines, one step off the surface and deliberately quiet. */}
          <div className="absolute inset-x-0 top-0 bottom-6 flex flex-col justify-between">
            {ticks.map((_, index) => (
              <div key={index} className="h-px w-full bg-border" />
            ))}
          </div>

          <div className="relative flex h-52 items-end gap-2 pb-6 sm:gap-4">
            {points.map((point, index) => {
              const value = point[metric];
              const height = max > 0 ? (value / max) * 100 : 0;

              return (
                <div key={point.month} className="group relative flex h-full flex-1 flex-col justify-end">
                  <div className="flex w-full justify-center">
                    <div
                      className={`w-full max-w-[24px] rounded-t-[4px] transition-colors ${
                        index === peakIndex && hasData
                          ? "bg-primary"
                          : "bg-primary/45 group-hover:bg-primary"
                      }`}
                      style={{ height: `${Math.max(height, value > 0 ? 2 : 0)}%` }}
                    />
                  </div>

                  {/* Month label sits under the baseline. */}
                  <span className="absolute inset-x-0 -bottom-6 text-center text-[11px] text-muted-foreground">
                    {point.label}
                  </span>

                  {/* Hover card: all three measures, so switching tabs is never
                      required just to read one month. */}
                  <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden w-40 -translate-x-1/2 rounded-xl border border-border bg-popover p-3 text-left shadow-md group-hover:block">
                    <p className="text-xs font-semibold text-popover-foreground">
                      {point.label} {point.year}
                    </p>
                    <dl className="mt-2 space-y-1 text-[11px]">
                      <div className="flex items-center justify-between gap-3">
                        <dt className="text-muted-foreground">Bookings</dt>
                        <dd className="font-medium tabular-nums">{point.reservations}</dd>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <dt className="text-muted-foreground">Revenue</dt>
                        <dd className="font-medium tabular-nums">{formatBdt(point.revenue)}</dd>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <dt className="text-muted-foreground">New users</dt>
                        <dd className="font-medium tabular-nums">{point.newUsers}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {!hasData && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          No activity recorded in this period yet.
        </p>
      )}
    </div>
  );
}

export default OverviewTrendChart;
