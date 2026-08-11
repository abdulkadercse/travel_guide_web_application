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
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
 

      {/* Main Home Sections */}
      <main className="flex-1 w-full space-y-16 sm:space-y-24 pb-16">
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


    </div>
  );
}
