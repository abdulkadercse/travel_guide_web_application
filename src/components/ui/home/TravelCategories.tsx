"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Container from "@/components/shared/Container";
import { FaCompass, FaArrowRight, FaUmbrellaBeach, FaMountain, FaLeaf, FaLandmark, FaTree, FaWater } from "react-icons/fa";

const categoriesList = [
  {
    title: "Beaches & Islands",
    description: "Coral reefs, sunset shores & world's longest golden sands.",
    icon: FaUmbrellaBeach,
    count: "12+ Spots",
    category: "Beach",
    image: "/images/coxs-bazar.jpg",
  },
  {
    title: "Hills & Cloud Peaks",
    description: "Misty valleys, tribal trails & high-altitude panoramic camps.",
    icon: FaMountain,
    count: "18+ Spots",
    category: "Mountain",
    image: "/images/bandarban.jpg",
  },
  {
    title: "Tea Gardens & Rain Forests",
    description: "Endless rolling green slopes & lush birdwatching canopies.",
    icon: FaLeaf,
    count: "9+ Spots",
    category: "Tea",
    image: "/images/sylhet.jpg",
  },
  {
    title: "Heritage & Archaeological",
    description: "Ancient Buddhist viharas, medieval mosques & zamindar palaces.",
    icon: FaLandmark,
    count: "15+ Spots",
    category: "Heritage",
    image: "/images/paharpur.jpg",
  },
  {
    title: "Mangrove & Wildlife",
    description: "Royal Bengal Tiger habitats, deer sanctuaries & creek safari.",
    icon: FaTree,
    count: "6+ Spots",
    category: "Forest",
    image: "/images/bg-travel.jpg",
  },
  {
    title: "Wetlands & River Havens",
    description: "Floating guava markets, serene haors & houseboating adventures.",
    icon: FaWater,
    count: "8+ Spots",
    category: "River",
    image: "/images/coxs-bazar.jpg",
  },
];

export function TravelCategories() {
  return (
    <section className="section bg-muted/20 border-y border-border" data-aos="fade-up">
      <Container className="space-y-9">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" data-aos="fade-up">
          <div className="max-w-xl space-y-3">
            <p className="eyebrow flex items-center gap-1.5">
              <FaCompass className="text-primary h-3.5 w-3.5" /> Curated Experiences
            </p>
            <h2 className="heading">Explore by Travel Passion</h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Whether you crave mountain heights, soothing coastal waves, or rich historic wonders, start your journey here.
            </p>
          </div>

          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group self-start sm:self-auto"
          >
            <span>All Categories</span>
            <FaArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesList.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.title}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <Link
                  href={`/destinations?category=${cat.category}`}
                  className="group relative block overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/40"
                >

                  <div className="relative h-44 w-full overflow-hidden bg-muted">
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-transparent" />
                    
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-medium bg-stone-950/60 backdrop-blur-md text-white border border-white/10">
                      {cat.count}
                    </span>

                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <div className="h-8 w-8 rounded-xl bg-primary/90 text-primary-foreground flex items-center justify-center shadow-xs">
                        <Icon className="h-4 w-4" />
                      </div>
                      <h3 className="text-base font-semibold text-white tracking-tight">
                        {cat.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-4 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground line-clamp-1 leading-relaxed">
                      {cat.description}
                    </p>
                    <span className="text-primary shrink-0 text-xs font-semibold flex items-center gap-1 group-hover:underline">
                      Explore &rarr;
                    </span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}


export default TravelCategories;
