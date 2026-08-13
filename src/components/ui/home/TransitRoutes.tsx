"use client";

import React from "react";
import Link from "next/link";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { FaBus, FaTrain, FaPlane, FaCar, FaClock } from "react-icons/fa6";

const transportationRoutes = [
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

export function TransitRoutes() {
  return (
    <section id="transport" className="section border-y border-border bg-secondary/40">
      <Container className="space-y-9">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl space-y-3">
            <p className="eyebrow">Getting around</p>
            <h2 className="heading">Buses, trains, flights and cars</h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Compare operators, travel time and fares before you commit to a route.
            </p>
          </div>

          <Button variant="ghost" size="sm" asChild className="self-start sm:self-auto">
            <Link href="/demo">See all routes →</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {transportationRoutes.map((route) => {
            const Icon = route.icon;
            return (
              <div
                key={`${route.operator}-${route.to}`}
                className="surface-interactive flex flex-col p-5"
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
      </Container>
    </section>
  );
}

export default TransitRoutes;
