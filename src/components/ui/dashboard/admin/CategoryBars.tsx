"use client";

import React from "react";

export interface CategorySlice {
  name: string;
  count: number;
}

/**
 * Magnitude comparison, so it is one hue with more-is-darker left to the bar
 * length; the rows are pre-sorted largest first by the API.
 */
export function CategoryBars({
  title,
  caption,
  slices,
  emptyLabel = "Nothing added yet.",
}: {
  title: string;
  caption?: string;
  slices: CategorySlice[];
  emptyLabel?: string;
}) {
  const max = Math.max(...slices.map((slice) => slice.count), 1);

  return (
    <div className="surface flex h-full flex-col p-5 sm:p-6">
      <div>
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        {caption && <p className="mt-0.5 text-xs text-muted-foreground">{caption}</p>}
      </div>

      {slices.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">{emptyLabel}</p>
      ) : (
        <ul className="mt-5 space-y-3">
          {slices.map((slice) => (
            <li key={slice.name} className="space-y-1.5">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate text-foreground">{slice.name}</span>
                <span className="shrink-0 font-medium tabular-nums text-muted-foreground">
                  {slice.count}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary/70"
                  style={{ width: `${(slice.count / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CategoryBars;
