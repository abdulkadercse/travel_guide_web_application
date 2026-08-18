"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { ReservationModal } from "@/components/shared/ReservationModal";
import {
  useGetTransportationByIdQuery,
  useGetTransportationsQuery,
} from "@/redux/features/transportation/transportationApi";
import {
  FaArrowLeft,
  FaBus,
  FaTrain,
  FaPlane,
  FaCar,
  FaClock,
  FaSpinner,
  FaLongArrowAltRight,
} from "react-icons/fa";

const TYPE_META = {
  BUS: { icon: FaBus, label: "AC / Non-AC Bus" },
  TRAIN: { icon: FaTrain, label: "Express Train" },
  FLIGHT: { icon: FaPlane, label: "Domestic Flight" },
  CAR_RENTAL: { icon: FaCar, label: "Private Car" },
} as const;

interface Transit {
  id: string;
  type: string;
  operatorName: string;
  routeFrom: string;
  routeTo: string;
  estimatedCost: number;
  duration: string;
  scheduleTime: string;
}

const typeMeta = (t?: string) =>
  TYPE_META[t as keyof typeof TYPE_META] ?? { icon: FaBus, label: t ?? "Transit" };

/* The API stores a departure time and a duration but no arrival time, so the
   arrival is derived rather than stored. Returns null if either is unparseable
   — better a hidden field than a confidently wrong timetable. */
function arrivalTime(scheduleTime?: string, duration?: string): string | null {
  if (!scheduleTime || !duration) return null;

  const t = scheduleTime.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  const d = duration.match(/(?:(\d+)\s*h)?\s*(?:(\d+)\s*m)?/i);
  if (!t || !d || (!d[1] && !d[2])) return null;

  let hours = Number(t[1]) % 12;
  if (t[3]?.toUpperCase() === "PM") hours += 12;
  if (!t[3]) hours = Number(t[1]) % 24;

  const total =
    hours * 60 + Number(t[2]) + Number(d[1] ?? 0) * 60 + Number(d[2] ?? 0);
  const nextDay = total >= 24 * 60;
  const mins = ((total % (24 * 60)) + 24 * 60) % (24 * 60);

  const h24 = Math.floor(mins / 60);
  const suffix = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const label = `${h12}:${String(mins % 60).padStart(2, "0")} ${suffix}`;
  return nextDay ? `${label} (+1 day)` : label;
}

export default function TransportationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [resModalOpen, setResModalOpen] = useState(false);

  const { data: response, isLoading } = useGetTransportationByIdQuery(id);
  const transit: Transit | undefined = response?.data;

  // Alternatives on the same corridor, so a traveller can compare without
  // going back to the search page.
  const { data: sameRoute } = useGetTransportationsQuery(
    transit ? { routeFrom: transit.routeFrom, routeTo: transit.routeTo } : undefined,
    { skip: !transit }
  );
  const alternatives: Transit[] = (
    Array.isArray(sameRoute?.data) ? (sameRoute.data as Transit[]) : []
  ).filter((s) => s.id !== id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-24 text-muted-foreground">
        <FaSpinner className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!transit) {
    return (
      <div className="space-y-4 py-24 text-center">
        <h2 className="text-xl font-semibold">Route not found</h2>
        <p className="text-sm text-muted-foreground">
          This transit route may have been removed from the schedule.
        </p>
        <Button variant="outline" asChild>
          <Link href="/transportation">Back to routes</Link>
        </Button>
      </div>
    );
  }

  const meta = typeMeta(transit.type);
  const Icon = meta.icon;
  const arrival = arrivalTime(transit.scheduleTime, transit.duration);
  const fare = transit.estimatedCost ?? 0;

  return (
    <div className="py-12 sm:py-16">
      <Container className="space-y-8">
        <Button variant="ghost" size="sm" className="-ml-2" asChild>
          <Link href="/transportation">
            <FaArrowLeft className="mr-2 h-3 w-3" /> All routes
          </Link>
        </Button>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* ── Journey ── */}
          <div className="space-y-6 lg:col-span-2">
            <div className="surface space-y-6 p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h1 className="truncate heading">
                    {transit.operatorName}
                  </h1>
                  <span className="text-sm text-muted-foreground">
                    {meta.label}
                  </span>
                </div>
              </div>

              {/* Route timeline — the one thing a traveller checks first. */}
              <div className="rounded-xl border border-border bg-secondary/40 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                      Departs
                    </p>
                    <p className="mt-0.5 truncate text-lg font-semibold">{transit.routeFrom}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <FaClock className="h-3 w-3" /> {transit.scheduleTime || "—"}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col items-center px-2">
                    <span className="text-xs text-muted-foreground">
                      {transit.duration || "—"}
                    </span>
                    <div className="my-1.5 flex w-16 items-center sm:w-28">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span className="h-[2px] flex-1 bg-primary/30" />
                      <FaLongArrowAltRight className="h-3 w-3 shrink-0 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Direct
                    </span>
                  </div>

                  <div className="min-w-0 text-right">
                    <p className="text-xs text-muted-foreground">
                      Arrives
                    </p>
                    <p className="mt-0.5 truncate text-lg font-semibold">{transit.routeTo}</p>
                    {arrival && (
                      <p className="mt-1 flex items-center justify-end gap-1.5 text-sm text-muted-foreground">
                        <FaClock className="h-3 w-3" /> {arrival}
                      </p>
                    )}
                  </div>
                </div>
                {arrival && (
                  <p className="mt-4 border-t border-border pt-3 text-sm text-muted-foreground">
                    Arrival time is estimated from the departure time and journey duration.
                  </p>
                )}
              </div>

              {/* Everything the record actually holds, in one scannable grid. */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "Mode", value: meta.label },
                  { label: "Operator", value: transit.operatorName },
                  { label: "Departure", value: transit.scheduleTime || "—" },
                  { label: "Duration", value: transit.duration || "—" },
                ].map((f) => (
                  <div key={f.label} className="rounded-xl border border-border bg-secondary/40 p-4">
                    <p className="text-xs text-muted-foreground">
                      {f.label}
                    </p>
                    <p className="mt-1 text-sm break-words">{f.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Alternatives on the same corridor ── */}
            {alternatives.length > 0 && (
              <div className="surface space-y-5 p-6 sm:p-8">
                <h2 className="text-lg font-semibold tracking-tight">
                  Other options: {transit.routeFrom} →{" "}
                  {transit.routeTo}
                </h2>
                <div className="space-y-3">
                  {alternatives.map((alt) => {
                    const AltIcon = typeMeta(alt.type).icon;
                    return (
                      <Link
                        key={alt.id}
                        href={`/transportation/${alt.id}`}
                        className="flex items-center justify-between gap-3 rounded-xl border border-border p-4 transition-colors hover:border-primary/40 hover:bg-secondary/50"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                            <AltIcon className="h-3.5 w-3.5" />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{alt.operatorName}</p>
                            <p className="text-sm text-muted-foreground">
                              {alt.scheduleTime} · {alt.duration}
                            </p>
                          </div>
                        </div>
                        <span className="shrink-0 text-sm font-medium tabular-nums">
                          ৳{alt.estimatedCost?.toLocaleString()}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ── Fare & booking ── */}
          <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <div className="surface space-y-5 p-6">
              <div>
                <span className="block text-sm text-muted-foreground">
                  Estimated fare
                </span>
                <span className="text-3xl font-semibold tracking-tight tabular-nums">
                  ৳{fare.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground"> / passenger</span>
              </div>

              <Button
                size="lg"
                onClick={() => setResModalOpen(true)}
                className="w-full"
              >
                Book this ticket
              </Button>

              <p className="text-sm leading-relaxed text-muted-foreground">
                Sending a request — an operator confirms your seat before anything is charged.
              </p>
            </div>

            <div className="surface space-y-3 p-6">
              <h3 className="text-sm font-semibold">
                Good to know
              </h3>
              <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                <li>• Reach the counter at least 30 minutes before departure.</li>
                <li>• Carry a photo ID matching the name on your booking.</li>
                <li>• Fares are estimates and can change with season and seat class.</li>
                <li>• Departure times follow the operator&apos;s published schedule.</li>
              </ul>
            </div>
          </div>
        </div>
      </Container>

      <ReservationModal
        isOpen={resModalOpen}
        onClose={() => setResModalOpen(false)}
        targetType="TRANSPORTATION"
        targetId={transit.id}
        targetName={`${transit.operatorName} (${transit.routeFrom} → ${transit.routeTo})`}
        pricePerUnit={fare || 1500}
        location={`${transit.routeFrom} → ${transit.routeTo}`}
      />
    </div>
  );
}
