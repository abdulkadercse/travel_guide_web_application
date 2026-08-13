"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";

export function CtaBanner() {
  return (
    <section className="pb-20 sm:pb-24">
      <Container>
        <div className="relative overflow-hidden rounded-2xl border border-border">
          <Image
            src="/images/bg-travel.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-stone-950/60" />

          <div className="relative px-6 py-16 text-center sm:px-12 sm:py-20">
            <div className="mx-auto max-w-xl space-y-4">
              <h2 className="heading text-white">Where are you going next?</h2>
              <p className="text-base leading-relaxed text-white/80">
                Create a free account to save the places you like and start planning the trip.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" asChild className="bg-white text-stone-900 hover:bg-white/90">
                <Link href="/signup">Create an account</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/#destinations">Browse destinations</Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default CtaBanner;
