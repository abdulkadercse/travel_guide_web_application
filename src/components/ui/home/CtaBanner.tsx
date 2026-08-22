"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";

export function CtaBanner() {
  return (
    <section className="relative w-full overflow-hidden border-y border-border py-16 sm:py-24" data-aos="fade-up">
      {/* Full-bleed background image covering the entire width & height */}
      <Image
        src="/images/bg-travel.jpg"
        alt="Travel Bangladesh"
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
      
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-stone-950/70 backdrop-blur-[1px]" />

      <Container className="relative z-10">
        <div className="mx-auto max-w-2xl text-center space-y-6" data-aos="zoom-in" data-aos-duration="600">
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Start Your Journey
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Where are you going next?
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-white/80 max-w-xl mx-auto">
              Create a free account to save the places you like, build custom itineraries, and start planning your dream trip today.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild className="rounded-xl bg-white text-stone-950 hover:bg-white/90 font-semibold shadow-md px-6 cursor-pointer">
              <Link href="/signup">Create an account</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="rounded-xl border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm px-6 cursor-pointer"
            >
              <Link href="/destinations">Browse destinations</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default CtaBanner;
