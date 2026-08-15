"use client";

import React from "react";
import HeroSection from "@/components/ui/home/HeroSection";
import StatsBanner from "@/components/ui/home/StatsBanner";
import FeaturedDestinations from "@/components/ui/home/FeaturedDestinations";
import FeaturedHotels from "@/components/ui/home/FeaturedHotels";
import TransitRoutes from "@/components/ui/home/TransitRoutes";
import Reviews from "@/components/ui/home/Reviews";
import CtaBanner from "@/components/ui/home/CtaBanner";

export default function Home() {
  return (
    <main className="flex-1 overflow-x-hidden space-y-4">
      <HeroSection />
      <StatsBanner />
      <FeaturedDestinations />
      <FeaturedHotels />
      <TransitRoutes />
      <Reviews />
      <CtaBanner />
    </main>
  );
}
