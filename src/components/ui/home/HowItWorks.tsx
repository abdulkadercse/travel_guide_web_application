"use client";

import React from "react";
import Link from "next/link";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { FaCompass, FaCalendarCheck, FaSuitcaseRolling, FaArrowRight, FaCheckCircle } from "react-icons/fa";

const steps = [
  {
    step: "01",
    icon: FaCompass,
    title: "Discover & Choose",
    description:
      "Browse handpicked tourist spots, seaside resorts, tea estates and authentic food spots with verified traveler reviews.",
    tag: "Find inspiration",
  },
  {
    step: "02",
    icon: FaCalendarCheck,
    title: "Plan & Reserve",
    description:
      "Set your dates, build custom day-by-day itineraries with budget estimates, and send direct reservation requests with 1-click.",
    tag: "Instant booking",
  },
  {
    step: "03",
    icon: FaSuitcaseRolling,
    title: "Pack & Enjoy",
    description:
      "Travel with peace of mind. Get real-time booking confirmation, route guidance, and 24/7 dedicated traveler support desk.",
    tag: "Worry-free trip",
  },
];

export function HowItWorks() {
  return (
    <section className="section bg-secondary/30 border-y border-border" data-aos="fade-up">
      <Container className="space-y-12">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-4" data-aos="fade-up">
          <p className="eyebrow flex items-center justify-center gap-1.5">
            <FaCheckCircle className="text-primary h-3.5 w-3.5" /> Seamless Experience
          </p>
          <h2 className="heading">How Travla Simplifies Your Journey</h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            From discovering hidden gems to booking stays and transit, plan your entire trip in three straightforward steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                data-aos="fade-up"
                data-aos-delay={index * 150}
                className="relative flex flex-col p-7 rounded-2xl bg-card border border-border/80 shadow-xs hover:shadow-md hover:border-primary/40 transition-all duration-300 group"
              >

                {/* Step badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-2xl font-black text-muted-foreground/30 group-hover:text-primary/40 transition-colors">
                    {item.step}
                  </span>
                </div>

                <div className="inline-block mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/15">
                    {item.tag}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-foreground tracking-tight mb-2">
                  {item.title}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center pt-2">
          <Button asChild size="lg" className="rounded-xl gap-2 font-semibold shadow-sm">
            <Link href="/destinations">
              <span>Start Planning Your Next Trip</span>
              <FaArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}

export default HowItWorks;
