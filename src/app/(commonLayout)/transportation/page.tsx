"use client";

import React, { useState } from "react";
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
  FaMapMarkerAlt,
  FaClock,
  FaExchangeAlt,
  FaSpinner,
  FaCalendarCheck,
} from "react-icons/fa";

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
    <div className="min-h-screen bg-background text-foreground py-10 font-sans">
      <Container className="space-y-8">
        {/* Page Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest bg-sky-500/10 text-sky-400 border border-sky-500/20 inline-flex items-center gap-2">
            <FaBus className="h-3.5 w-3.5" /> Intercity Transit Finder
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Book Bus, Train & <span className="text-sky-500">Flight Tickets</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Search live transport schedules across Bangladesh. Book Green Line AC Buses, Cox's Bazar Express Trains, and domestic flights.
          </p>
        </div>

        {/* Route Finder Form */}
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-lg space-y-6">
          {/* Transport Type Tabs */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 border-b border-border">
            {[
              { id: "ALL", label: "All Modes", icon: FaBus },
              { id: "BUS", label: "AC/Non-AC Bus", icon: FaBus },
              { id: "TRAIN", label: "Express Train", icon: FaTrain },
              { id: "FLIGHT", label: "Domestic Flight", icon: FaPlane },
              { id: "CAR_RENTAL", label: "Private Car", icon: FaCar },
            ].map((t) => {
              const Icon = t.icon;
              const isActive = typeFilter === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTypeFilter(t.id)}
                  className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-sky-600 text-white shadow-md shadow-sky-600/20 scale-105"
                      : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            {/* From Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                <FaMapMarkerAlt className="text-sky-500 h-3 w-3" /> Departure From
              </label>
              <Select value={routeFrom} onValueChange={setRouteFrom}>
                <SelectTrigger className="h-11 rounded-2xl bg-background/50 border-input text-xs font-semibold">
                  <SelectValue placeholder="All Departure Cities" />
                </SelectTrigger>
                <SelectContent>
                  {allFromCities.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c === "ALL" ? "All Departure Cities" : c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Swap indicator */}
            <div className="hidden sm:flex justify-center pt-5">
              <div className="h-10 w-10 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground border border-border">
                <FaExchangeAlt className="h-4 w-4" />
              </div>
            </div>

            {/* To Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                <FaMapMarkerAlt className="text-rose-500 h-3 w-3" /> Destination To
              </label>
              <Select value={routeTo} onValueChange={setRouteTo}>
                <SelectTrigger className="h-11 rounded-2xl bg-background/50 border-input text-xs font-semibold">
                  <SelectValue placeholder="All Destination Cities" />
                </SelectTrigger>
                <SelectContent>
                  {allToCities.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c === "ALL" ? "All Destination Cities" : c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Schedule Results */}
        {isLoading ? (
          <div className="py-24 flex justify-center text-muted-foreground">
            <FaSpinner className="h-8 w-8 animate-spin text-sky-500" />
          </div>
        ) : schedules.length === 0 ? (
          <div className="py-24 text-center rounded-3xl border border-dashed border-border bg-card/40 space-y-4">
            <FaBus className="h-12 w-12 text-muted-foreground/30 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-foreground">No transit routes found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                No routes match your origin/destination search. Try resetting filters.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setRouteFrom("ALL");
                setRouteTo("ALL");
                setTypeFilter("ALL");
              }}
              className="rounded-xl font-bold text-xs"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schedules.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-3xl bg-card border border-border flex flex-col justify-between hover:border-sky-500/40 hover:shadow-lg transition-all space-y-4"
              >
                <div className="space-y-4">
                  {/* Top Operator Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
                        {item.type === "BUS" ? (
                          <FaBus className="h-4 w-4" />
                        ) : item.type === "TRAIN" ? (
                          <FaTrain className="h-4 w-4" />
                        ) : item.type === "FLIGHT" ? (
                          <FaPlane className="h-4 w-4" />
                        ) : (
                          <FaCar className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-foreground text-sm leading-tight">
                          {item.operatorName}
                        </h4>
                        <span className="text-[10px] font-black uppercase tracking-wider text-sky-400">
                          {item.type}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase">Fare</p>
                      <p className="text-lg font-black text-emerald-400">
                        ৳{item.price?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Route Timeline */}
                  <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/40 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <p className="font-extrabold text-foreground">{item.routeFrom}</p>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <FaClock className="h-2.5 w-2.5 text-sky-400" /> {item.departureTime || "08:00 AM"}
                      </p>
                    </div>

                    <div className="flex flex-col items-center px-4">
                      <span className="text-[10px] font-bold text-muted-foreground">
                        {item.duration || "6h 30m"}
                      </span>
                      <div className="w-16 h-[2px] bg-sky-500/30 relative my-1">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-sky-500" />
                      </div>
                    </div>

                    <div className="text-right space-y-0.5">
                      <p className="font-extrabold text-foreground">{item.routeTo}</p>
                      <p className="text-[11px] text-muted-foreground flex items-center justify-end gap-1">
                        <FaClock className="h-2.5 w-2.5 text-emerald-400" /> {item.arrivalTime || "02:30 PM"}
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setSelectedTransit(item);
                    setResModalOpen(true);
                  }}
                  className="w-full h-10 rounded-2xl font-bold text-xs bg-sky-600 hover:bg-sky-500 text-white gap-2 shadow-md shadow-sky-600/20"
                >
                  <FaCalendarCheck className="h-3 w-3" /> Book Ticket
                </Button>
              </div>
            ))}
          </div>
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
            pricePerUnit={selectedTransit.price || 1500}
            location={`${selectedTransit.routeFrom} to ${selectedTransit.routeTo}`}
          />
        )}
      </Container>
    </div>
  );
}
