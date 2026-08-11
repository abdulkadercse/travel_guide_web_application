"use client";

import React from "react";
import Container from "@/components/shared/Container";

export function StatsBanner() {
  return (
    <section className="w-full">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/40 border border-indigo-500/20 backdrop-blur-xl shadow-xl">
          <div className="text-center space-y-1">
            <h3 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              50+
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-muted-foreground">
              Tourist Destinations
            </p>
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              10k+
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-muted-foreground">
              Happy Travelers
            </p>
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              100+
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-muted-foreground">
              Verified Hotels
            </p>
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              4.9 ⭐
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-muted-foreground">
              Average Rating
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default StatsBanner;
