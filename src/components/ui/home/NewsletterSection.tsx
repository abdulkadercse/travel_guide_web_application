"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaPaperPlane, FaGift, FaShieldAlt, FaEnvelope } from "react-icons/fa";

export function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      return toast.error("Please provide a valid email address!");
    }
    toast.success("Thank you! You're now subscribed to exclusive travel discounts & guides.");
    setEmail("");
  };

  return (
    <section
      className="relative w-full py-10 sm:py-14 bg-gradient-to-b from-primary/15 via-primary/5 to-card border-y border-border overflow-hidden"
      data-aos="fade-up"
    >
      {/* Ambient background glows spanning the full section width */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 h-80 w-80 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <Container className="relative z-10" data-aos="zoom-in" data-aos-duration="700">
        <div className="max-w-2xl mx-auto text-center space-y-6">

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold shadow-xs">
            <FaGift className="h-3.5 w-3.5" />
            <span>Get 15% Off Your First Tour Reservation</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
            Join 25,000+ Smart Travelers Across Bangladesh
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Subscribe to the Travla Insider newsletter for handpicked weekend getaway itineraries, seasonal festival discounts, and secret local tips.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
            <div className="relative flex-1">
              <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="email"
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 h-11 rounded-xl bg-background/90 backdrop-blur-sm border-border focus:ring-1 focus:ring-primary shadow-xs"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="h-11 rounded-xl gap-2 font-semibold shadow-xs cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
            >
              <span>Subscribe</span>
              <FaPaperPlane className="h-3.5 w-3.5" />
            </Button>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <FaShieldAlt className="text-emerald-500 h-3.5 w-3.5" /> No Spam Ever
            </span>
            <span className="flex items-center gap-1.5">
              • Unsubscribe Anytime
            </span>
            <span className="flex items-center gap-1.5">
              • Weekly Curated Digests
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default NewsletterSection;
