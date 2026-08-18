"use client";

import React, { useState } from "react";
import Link from "next/link";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReservationModal } from "@/components/shared/ReservationModal";
import { useGetTransportationsQuery } from "@/redux/features/transportation/transportationApi";
import {
  FaBus,
  FaTrain,
  FaPlane,
  FaCar,
  FaClock,
  FaSpinner,
} from "react-icons/fa";

const transportTypes = [
  { id: "ALL", label: "All modes", icon: FaBus },
  { id: "BUS", label: "Bus", icon: FaBus },
  { id: "TRAIN", label: "Train", icon: FaTrain },
  { id: "FLIGHT", label: "Flight", icon: FaPlane },
  { id: "CAR_RENTAL", label: "Private car", icon: FaCar },
];

export default function TransportationPage() {
  const [routeFrom, setRouteFrom] = useState("ALL");
  const [routeTo, setRouteTo] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  // Reservation Modal
  const [resModalOpen, setResModalOpen] = useState(false);
  const [selectedTransit, setSelectedTransit] = useState<any>(null);

  const queryParams: Record<string, string> = {};
  if (routeFrom && routeFrom !== "ALL") queryParams.routeFrom = routeFrom;
  if (routeTo && routeTo !== "ALL") queryParams.routeTo = routeTo;
  if (typeFilter && typeFilter !== "ALL") queryParams.type = typeFilter;

  const { data: scheduleResponse, isLoading } = useGetTransportationsQuery(
    Object.keys(queryParams).length > 0 ? queryParams : undefined
  );

  const schedules: any[] = Array.isArray(scheduleResponse?.data)
    ? scheduleResponse.data
    : Array.isArray(scheduleResponse)
    ? scheduleResponse
    : [];

  // Dynamic city lists extracted from current DB entries
  const fromCities = Array.from(
    new Set(schedules.map((s) => s.routeFrom).filter(Boolean))
  );
  const toCities = Array.from(
    new Set(schedules.map((s) => s.routeTo).filter(Boolean))
  );

  const allFromCities = ["ALL", ...fromCities];
  const allToCities = ["ALL", ...toCities];

  return (
    <div className="py-12 sm:py-16">
      <Container className="space-y-9">
        {/* Page header */}
        <div className="max-w-xl space-y-4">
          <p className="eyebrow">Getting around</p>
          <h1 className="heading">Routes that actually run today</h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Live intercity schedules across Bangladesh — AC coaches, express trains and domestic
            flights.
          </p>
        </div>

        {/* Route finder */}
        <div className="surface space-y-5 p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            {transportTypes.map((t) => {
              const Icon = t.icon;
              const isActive = typeFilter === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTypeFilter(t.id)}
                  className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-all ${
                    isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-3 border-t border-border pt-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">Leaving from</label>
              <Select value={routeFrom} onValueChange={setRouteFrom}>
                <SelectTrigger>
                  <SelectValue placeholder="Anywhere" />
                </SelectTrigger>
                <SelectContent>
                  {allFromCities.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c === "ALL" ? "Anywhere" : c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">Going to</label>
              <Select value={routeTo} onValueChange={setRouteTo}>
                <SelectTrigger>
                  <SelectValue placeholder="Anywhere" />
                </SelectTrigger>
                <SelectContent>
                  {allToCities.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c === "ALL" ? "Anywhere" : c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Schedule Results */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
            <FaSpinner className="h-6 w-6 animate-spin" />
            <p className="text-sm">Loading routes…</p>
          </div>
        ) : schedules.length === 0 ? (
          <div className="space-y-4 rounded-2xl border border-dashed border-border py-24 text-center">
            <FaBus className="mx-auto h-10 w-10 text-muted-foreground/30" />
            <div className="space-y-1.5">
              <h3 className="text-lg font-semibold">No routes found</h3>
              <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                Nothing runs between those cities right now. Try clearing the filters.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setRouteFrom("ALL");
                setRouteTo("ALL");
                setTypeFilter("ALL");
              }}
            >
              Reset filters
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              {schedules.length} route{schedules.length === 1 ? "" : "s"}
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {schedules.map((item) => {
                const Icon =
                  item.type === "TRAIN"
                    ? FaTrain
                    : item.type === "FLIGHT"
                    ? FaPlane
                    : item.type === "CAR_RENTAL"
                    ? FaCar
                    : FaBus;

                return (
                  <div key={item.id} className="surface-interactive flex flex-col p-5">
                    <div className="flex items-center justify-between">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                        {item.type}
                      </span>
                    </div>

                    <h3 className="mt-4 text-base leading-snug">
                      {item.routeFrom} <span className="text-muted-foreground">→</span>{" "}
                      {item.routeTo}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{item.operatorName}</p>

                    <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm">
                      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                        <FaClock className="h-3 w-3" />
                        {item.duration || item.scheduleTime || "—"}
                      </span>
                      <span className="font-medium">
                        ৳{item.estimatedCost?.toLocaleString() ?? 0}
                      </span>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href={`/transportation/${item.id}`}>Details</Link>
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setSelectedTransit(item);
                          setResModalOpen(true);
                        }}
                      >
                        Book
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Global Reservation Modal */}
        {selectedTransit && (
          <ReservationModal
            isOpen={resModalOpen}
            onClose={() => {
              setResModalOpen(false);
              setSelectedTransit(null);
            }}
            targetType="TRANSPORTATION"
            targetId={selectedTransit.id}
            targetName={`${selectedTransit.operatorName} (${selectedTransit.routeFrom} -> ${selectedTransit.routeTo})`}
            pricePerUnit={selectedTransit.estimatedCost || 1500}
            location={`${selectedTransit.routeFrom} to ${selectedTransit.routeTo}`}
          />
        )}
      </Container>
    </div>
  );
}
