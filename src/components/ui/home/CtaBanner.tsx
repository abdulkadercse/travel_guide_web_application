"use client";

import React from "react";
import Link from "next/link";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";

export function CtaBanner() {
  return (
    <section className="w-full">
      <Container>
        <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 text-white overflow-hidden shadow-2xl text-center space-y-6">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-2 relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
              Ready to Discover Bangladesh?
            </h2>
            <p className="text-indigo-100 text-sm sm:text-base">
              Join thousands of happy travelers today. Book tour packages or create your custom trip itinerary.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
            <Button
              size="lg"
              className="bg-white text-indigo-900 hover:bg-slate-100 rounded-full font-extrabold px-8 shadow-xl"
              asChild
            >
              <Link href="/signup">Get Started Free</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10 rounded-full font-semibold px-8"
              asChild
            >
              <Link href="/demo">View Tour Packages</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default CtaBanner;
