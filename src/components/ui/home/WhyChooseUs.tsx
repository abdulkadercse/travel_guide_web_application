"use client";

import React from "react";
import Container from "@/components/shared/Container";
import { FaShieldAlt, FaRoute, FaCheckCircle, FaHeadset } from "react-icons/fa";

export function WhyChooseUs() {
  return (
    <section className="w-full bg-slate-950/50 py-16 border-y border-border/50">
      <Container className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 inline-block">
            Why Travla BD
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Smart & Safe Travel Planning
          </h2>
          <p className="text-sm text-muted-foreground">
            We combine destination discovery, hotel bookings, transportation guides, and custom trip planning into a single platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-card border border-border shadow-md space-y-3 hover:border-indigo-500/40 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <FaShieldAlt className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg">Verified Safety</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All local guides, hotels, and transport operators undergo strict identity verification.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-card border border-border shadow-md space-y-3 hover:border-indigo-500/40 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <FaRoute className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg">Smart Trip Planner</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Easily build custom itineraries, track budget estimates, and save schedule notes.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-card border border-border shadow-md space-y-3 hover:border-indigo-500/40 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <FaCheckCircle className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg">Instant Confirmation</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Submit hotel and tour reservation requests with real-time status updates on your dashboard.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-card border border-border shadow-md space-y-3 hover:border-indigo-500/40 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <FaHeadset className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg">24/7 Travel Support</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Our dedicated travel support team is available round-the-clock to assist your journey.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default WhyChooseUs;
