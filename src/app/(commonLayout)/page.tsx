"use client";

import React from "react";
import HeroSection from "@/components/ui/home/HeroSection";
import StatsBanner from "@/components/ui/home/StatsBanner";
import FeaturedDestinations from "@/components/ui/home/FeaturedDestinations";
import WhyChooseUs from "@/components/ui/home/WhyChooseUs";
import FeaturedHotels from "@/components/ui/home/FeaturedHotels";
import TransitRoutes from "@/components/ui/home/TransitRoutes";
import Reviews from "@/components/ui/home/Reviews";
import FAQSection from "@/components/ui/home/FAQSection";
import CtaBanner from "@/components/ui/home/CtaBanner";

export default function Home() {
  return (
    // Sections own their own vertical rhythm through the .section utility,
    // so the page itself only sets the flow.
    <main className="flex-1 overflow-x-hidden">
      <HeroSection />
      <StatsBanner />
      <FeaturedDestinations />
      <WhyChooseUs />
      <FeaturedHotels />
      <TransitRoutes />
      <Reviews />
      <FAQSection />
      <CtaBanner />
    </main>
  );
}
