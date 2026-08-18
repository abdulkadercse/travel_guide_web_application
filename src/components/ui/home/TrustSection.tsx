"use client";

import React from "react";
import Link from "next/link";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import {
  FaShieldHalved,
  FaCircleCheck,
  FaHeadset,
  FaLock,
  FaStar,
  FaMapLocationDot,
  FaHandshake,
  FaBolt,
} from "react-icons/fa6";

const trustPillars = [
  {
    Icon: FaShieldHalved,
    tag: "Admin Verified",
    title: "100% Verified Listings & Real Pricing",
    description:
      "Every hotel, restaurant, and transport route is administratively vetted before appearing on Travla BD. No fake photos, hidden fees, or scam markups.",
    highlight: "Zero Hidden Costs",
    accentColor: "from-primary/20 to-emerald-500/20 border-primary/30 text-primary dark:text-primary",
  },
  {
    Icon: FaStar,
    tag: "Authentic Feedback",
    title: "Genuine Community Ratings & Reviews",
    description:
      "Reviews can only be submitted by registered, authenticated travellers. Community ratings are automatically computed with real mathematical integrity.",
    highlight: "4.9/5 Average Satisfaction",
    accentColor: "from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-600 dark:text-amber-400",
  },
  {
    Icon: FaLock,
    tag: "Enterprise Security",
    title: "Bank-Grade Privacy & JWT Protection",
    description:
      "Your personal profile, reservations, and custom trip itineraries are protected by bcrypt password hashing and cryptographic JSON Web Tokens.",
    highlight: "Encrypted & Safe",
    accentColor: "from-primary/20 to-primary/20 border-primary/30 text-primary dark:text-primary",
  },
  {
    Icon: FaHeadset,
    tag: "On-the-Road Help",
    title: "24/7 Traveller Assistance & Emergency Desk",
    description:
      "Whether you need urgent route re-routing during monsoon season or stay assistance in remote hill tracts, our responsive support desk is active.",
    highlight: "Always Online",
    accentColor: "from-rose-500/20 to-pink-500/20 border-rose-500/30 text-rose-600 dark:text-rose-400",
  },
];

const guarantees = [
  {
    Icon: FaMapLocationDot,
    title: "64 Districts Covered",
    desc: "Curated travel guides across every region in Bangladesh.",
  },
  {
    Icon: FaBolt,
    title: "Live Booking Tracking",
    desc: "Instant status updates for pending, confirmed & completed trips.",
  },
  {
    Icon: FaHandshake,
    title: "Academic Quality Standard",
    desc: "Engineered under Northern University Bangladesh CSE guidelines.",
  },
  {
    Icon: FaCircleCheck,
    title: "Transparent Policies",
    desc: "Direct contact info and genuine operator credentials provided.",
  },
];

export function TrustSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24 border-y border-border bg-gradient-to-b from-secondary/40 via-background to-secondary/30">
      {/* Background Decorative Blur Spheres */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-96 w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      <Container className="space-y-12 sm:space-y-16">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center space-y-3.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary-soft px-4 py-1.5 text-xs font-semibold text-primary shadow-xs">
            <FaShieldHalved className="h-3.5 w-3.5" />
            <span>Travla BD Trust & Safety Guarantee</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-balance">
            Travel Bangladesh with Absolute Peace of Mind
          </h2>

          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground text-pretty max-w-2xl mx-auto">
            We know travel in Bangladesh can feel unpredictable. That is why every spot, hotel,
            bus route, and review on Travla BD is strictly verified to ensure safe, authentic, and
            memorable journeys.
          </p>
        </div>

        {/* 4 Premium Trust Cards (Bento-style grid) */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trustPillars.map((pillar) => (
            <div
              key={pillar.title}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl"
            >
              {/* Top Accent Line */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-primary opacity-80 transition-opacity group-hover:opacity-100" />

              <div className="space-y-4">
                {/* Header Icon + Tag */}
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary shadow-2xs transition-transform duration-300 group-hover:scale-110">
                    <pillar.Icon className="h-5 w-5" />
                  </span>
                  <span className="rounded-full border border-border bg-secondary/80 px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                    {pillar.tag}
                  </span>
                </div>

                {/* Title & Body */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    {pillar.description}
                  </p>
                </div>
              </div>

              {/* Bottom Feature Pill */}
              <div className="mt-5 pt-4 border-t border-border/60">
                <div className="inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary-soft/60 px-2.5 py-1 text-[11px] font-semibold text-primary">
                  <FaCircleCheck className="h-3 w-3" />
                  <span>{pillar.highlight}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Guarantee Highlight Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary-soft/80 via-card to-secondary/60 p-6 sm:p-8 lg:p-10 shadow-md">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
            {/* Left Narrative */}
            <div className="space-y-4 lg:col-span-7">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <FaCircleCheck className="h-4 w-4" />
                <span>Our Traveller Promise</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
                Authentic Information. Verified Stays. Zero Compromise.
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                Unlike open unmoderated portals, Travla BD operates with strict architectural and
                operational integrity. If any verified listing does not match its description on the
                ground, our support team steps in directly to assist you.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild className="rounded-xl">
                  <Link href="/about">Learn Our Mission</Link>
                </Button>
                <Button variant="outline" asChild className="rounded-xl">
                  <Link href="/our-team">Meet The Engineers</Link>
                </Button>
              </div>
            </div>

            {/* Right Trust Badges Grid */}
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:col-span-5">
              {guarantees.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3 rounded-2xl border border-border bg-card/90 p-4 shadow-2xs backdrop-blur-xs transition-colors hover:border-primary/40 hover:bg-card"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary mt-0.5">
                    <item.Icon className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">{item.title}</h4>
                    <p className="mt-0.5 text-[11px] leading-normal text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default TrustSection;
