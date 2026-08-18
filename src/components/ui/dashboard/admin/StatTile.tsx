"use client";

import React from "react";
import Link from "next/link";
import type { IconType } from "react-icons";

export interface StatTileProps {
  label: string;
  value: string | number;
  icon: IconType;
  /** Small qualifier under the value — "+12 in the last 30 days", etc. */
  hint?: string;
  /** Turns the whole tile into a link to the matching manage screen. */
  href?: string;
  /** Tailwind text colour for the icon; defaults to the primary teal. */
  tone?: string;
}

export function StatTile({ label, value, icon: Icon, hint, href, tone = "text-primary" }: StatTileProps) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-muted-foreground">{label}</p>
        <Icon className={`h-5 w-5 shrink-0 ${tone}`} aria-hidden />
      </div>
      <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight sm:text-3xl">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="surface block p-5 transition-colors hover:border-primary/40"
      >
        {body}
      </Link>
    );
  }

  return <div className="surface p-5">{body}</div>;
}

export default StatTile;
