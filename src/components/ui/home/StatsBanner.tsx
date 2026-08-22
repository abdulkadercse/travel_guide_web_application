"use client";

import React from "react";
import Container from "@/components/shared/Container";

const stats = [
  { value: "50+", label: "Destinations" },
  { value: "10k+", label: "Travellers" },
  { value: "100+", label: "Verified stays" },
  { value: "4.9", label: "Average rating" },
];

export function StatsBanner() {
  return (
    <section className="pt-6 sm:pt-8 pb-2" data-aos="fade-up" data-aos-duration="600">
      <Container>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              className="bg-card px-6 py-7 text-center"
              data-aos="fade-up"
              data-aos-delay={idx * 100}
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd className="text-3xl font-semibold tracking-tight sm:text-4xl">{stat.value}</dd>
              <p className="mt-1.5 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}


export default StatsBanner;
