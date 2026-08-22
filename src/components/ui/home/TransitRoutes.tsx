"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { useGetTransportationsQuery } from "@/redux/features/transportation/transportationApi";
import { FaBus, FaTrain, FaPlane, FaCar, FaClock } from "react-icons/fa6";

const defaultRoutes = [
  {
    icon: FaBus,
    operator: "Green Line Paribahan",
    from: "Dhaka",
    to: "Cox's Bazar",
    duration: "9h 00m",
    price: 1500,
    tag: "AC sleeper",
  },
  {
    icon: FaTrain,
    operator: "Parabat Express",
    from: "Dhaka",
    to: "Sylhet",
    duration: "6h 30m",
    price: 650,
    tag: "Snigdha AC",
  },
  {
    icon: FaPlane,
    operator: "US-Bangla Airlines",
    from: "Dhaka",
    to: "Cox's Bazar",
    duration: "55m",
    price: 4200,
    tag: "Direct",
  },
  {
    icon: FaCar,
    operator: "Travla Car Rental",
    from: "Chittagong",
    to: "Bandarban",
    duration: "2h 30m",
    price: 3500,
    tag: "With driver",
  },
];

interface IRouteDisplay {
  icon: any;
  operator: string;
  from: string;
  to: string;
  duration: string;
  price: number;
  tag: string;
}

export function TransitRoutes() {
  const { data: transitResponse, isLoading } = useGetTransportationsQuery({});

  const displayRoutes: IRouteDisplay[] = useMemo(() => {
    const raw = Array.isArray(transitResponse?.data)
      ? transitResponse.data
      : Array.isArray(transitResponse)
      ? transitResponse
      : [];

    if (raw.length === 0) return defaultRoutes;

    return raw.slice(0, 4).map((item: any) => {
      let icon = FaBus;
      if (item.type === "TRAIN") icon = FaTrain;
      if (item.type === "FLIGHT") icon = FaPlane;
      if (item.type === "CAR_RENTAL") icon = FaCar;

      return {
        icon,
        operator: item.operatorName || "Express Transit",
        from: item.routeFrom || "Dhaka",
        to: item.routeTo || "Chittagong",
        duration: item.duration || "4h 30m",
        price: item.estimatedCost || 1200,
        tag: item.type || "AC Coach",
      };
    });
  }, [transitResponse]);


  return (
    <section id="transport" className="section border-y border-border bg-secondary/40" data-aos="fade-up">
      <Container className="space-y-9">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" data-aos="fade-up">
          <div className="max-w-xl space-y-3">
            <p className="eyebrow">Getting around</p>
            <h2 className="heading">Buses, trains, flights and cars</h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Compare operators, travel time and fares before you commit to a route.
            </p>
          </div>

          <Button variant="outline" asChild className="self-start sm:self-auto rounded-xl">
            <Link href="/transportation">Search all routes</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="surface p-5 rounded-2xl animate-pulse bg-card border border-border space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="h-9 w-9 bg-muted rounded-lg" />
                  <div className="h-5 w-16 bg-muted rounded-full" />
                </div>
                <div className="h-5 w-3/4 bg-muted rounded-md" />
                <div className="h-4 w-1/2 bg-muted rounded-md" />
                <div className="pt-4 flex items-center justify-between border-t border-border/60">
                  <div className="h-4 w-16 bg-muted rounded-md" />
                  <div className="h-5 w-14 bg-muted rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {displayRoutes.map((route, idx) => {
              const Icon = route.icon;
              return (
                <div
                  key={`${route.operator}-${idx}`}
                  data-aos="fade-up"
                  data-aos-delay={idx * 100}
                  className="surface group flex flex-col justify-between p-5 rounded-2xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                      {route.tag}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base leading-snug">
                    {route.from} <span className="text-muted-foreground">→</span> {route.to}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{route.operator}</p>

                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm">
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <FaClock className="h-3 w-3" />
                      {route.duration}
                    </span>
                    <span className="font-medium">৳{route.price.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}

export default TransitRoutes;
