"use client";

import React from "react";
import HeroSection from "@/components/ui/home/HeroSection";
import StatsBanner from "@/components/ui/home/StatsBanner";
import TravelCategories from "@/components/ui/home/TravelCategories";
import FeaturedDestinations from "@/components/ui/home/FeaturedDestinations";
import HowItWorks from "@/components/ui/home/HowItWorks";
import FeaturedHotels from "@/components/ui/home/FeaturedHotels";
import FeaturedRestaurants from "@/components/ui/home/FeaturedRestaurants";
import TransitRoutes from "@/components/ui/home/TransitRoutes";
import WhyChooseUs from "@/components/ui/home/WhyChooseUs";
import Reviews from "@/components/ui/home/Reviews";
import FAQSection from "@/components/ui/home/FAQSection";
import NewsletterSection from "@/components/ui/home/NewsletterSection";
import CtaBanner from "@/components/ui/home/CtaBanner";

export default function Home() {
  return (
    <main className="flex-1">
      {/* 1. Hero & Quick Search */}

      <HeroSection />

      {/* 2. Platform Statistics Highlights */}
      <StatsBanner />

      {/* 3. Browse By Travel Categories & Themes */}
      <TravelCategories />

      {/* 4. Handpicked Tourist Destinations */}
      <FeaturedDestinations />

      {/* 5. 3-Step Simple Trip Planning Workflow */}
      <HowItWorks />

      {/* 6. Verified Hotels & View Resorts */}
      <FeaturedHotels />

      {/* 7. Authentic Local Dining & Restaurants */}
      <FeaturedRestaurants />

      {/* 8. Intercity Transportation & Transit Routes */}
      <TransitRoutes />

      {/* 9. Key Benefits & Why Choose Travla */}
      <WhyChooseUs />

      {/* 10. Community Reviews & Ratings */}
      <Reviews />

      {/* 11. Frequently Asked Questions */}
      <FAQSection />

      {/* 12. Exclusive Discounts & Travel Newsletter */}
      <NewsletterSection />

      {/* 13. Final CTA Banner */}
      <CtaBanner />
    </main>
  );
}
