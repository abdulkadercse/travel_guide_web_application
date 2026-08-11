"use client";

import React from "react";
import Link from "next/link";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { FaBus, FaTrain, FaPlane, FaCar } from "react-icons/fa";

const transportationRoutes = [
  {
    type: "BUS",
    icon: FaBus,
    operator: "Green Line Paribahan",
    route: "Dhaka ➔ Cox's Bazar",
    duration: "9 hours",
    price: 1500,
    tag: "AC Scania Sleeper",
  },
  {
    type: "TRAIN",
    icon: FaTrain,
    operator: "Bangladesh Railway",
    route: "Dhaka ➔ Sylhet (Parabat Express)",
    duration: "6.5 hours",
    price: 650,
    tag: "Snigdha AC Chair",
  },
  {
    type: "FLIGHT",
    icon: FaPlane,
    operator: "US-Bangla Airlines",
    route: "Dhaka ➔ Cox's Bazar Airport",
    duration: "55 mins",
    price: 4200,
    tag: "Direct Flight",
  },
  {
    type: "CAR",
    icon: FaCar,
    operator: "Travla Private Car Rental",
    route: "Chittagong ➔ Bandarban Hills",
    duration: "2.5 hours",
    price: 3500,
    tag: "Chauffeur Included",
  },
];

export function TransitRoutes() {
  return (
    <section className="w-full bg-slate-950/30 py-12 border-y border-border/40">
      <Container className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
              <FaBus className="text-indigo-500 h-6 w-6" />
              Popular Transit & Travel Routes
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Compare inter-city buses, express trains, flights, and car rentals across Bangladesh
            </p>
          </div>
          <Button variant="ghost" className="text-indigo-400 font-semibold" asChild>
            <Link href="/demo">View All Routes &rarr;</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {transportationRoutes.map((route, idx) => {
            const IconComponent = route.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between space-y-4 hover:border-indigo-500/40 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                      {route.tag}
                    </span>
                    <div className="h-8 w-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <IconComponent className="h-4 w-4" />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base leading-snug">{route.route}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{route.operator}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-semibold">
                    ⏱️ {route.duration}
                  </span>
                  <span className="text-base font-black text-emerald-400">
                    ৳{route.price}
                  </span>
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
