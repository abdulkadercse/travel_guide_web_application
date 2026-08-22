"use client";

import React from "react";
import Container from "@/components/shared/Container";
import { FaShieldHalved, FaRoute, FaCircleCheck, FaHeadset } from "react-icons/fa6";

const features = [
  {
    Icon: FaShieldHalved,
    title: "Verified listings",
    body: "Every hotel, restaurant and transport operator on Travla is checked before it is published.",
  },
  {
    Icon: FaRoute,
    title: "Trip planner",
    body: "Build an itinerary day by day, add notes to each stop and keep an eye on the budget.",
  },
  {
    Icon: FaCircleCheck,
    title: "Reservation requests",
    body: "Send a request and follow its status — pending, confirmed or completed — from your dashboard.",
  },
  {
    Icon: FaHeadset,
    title: "Support that answers",
    body: "A travel desk you can reach at any hour, before you leave and while you are on the road.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="section border-y border-border bg-secondary/40" data-aos="fade-up">
      <Container className="space-y-12">
        <div className="max-w-xl space-y-3" data-aos="fade-up">
          <p className="eyebrow">Why Travla</p>
          <h2 className="heading">Everything a trip needs, in one place</h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Discovery, stays, transport and planning stop being four different tabs.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ Icon, title, body }, idx) => (
            <div
              key={title}
              data-aos="fade-up"
              data-aos-delay={idx * 100}
              className="space-y-3 p-4 rounded-xl bg-card/60 border border-border/60 shadow-xs hover:border-primary/40 transition-all"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </span>
              <h3 className="text-base font-semibold">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}


export default WhyChooseUs;
