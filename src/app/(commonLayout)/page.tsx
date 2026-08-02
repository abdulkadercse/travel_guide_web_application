"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { HomeSlider, defaultSlides } from "@/components/ui/home/slider";
import Container from "@/components/shared/Container";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import {
  FaCompass,
  FaMapMarkerAlt,
  FaStar,
  FaArrowRight,
  FaMoon,
  FaSun
} from "react-icons/fa";

export default function Home() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navbar Component */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 w-full space-y-12 pb-12">
        {/* Full-Width Home Slider */}
        <section className="w-full">
          <HomeSlider autoplayInterval={3500} />
        </section>

        {/* Featured Destinations Section (Inside Container) */}
        <Container>
          <section className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Popular Tourist Destinations</h2>
                <p className="text-sm text-muted-foreground">Handpicked travel spots across Bangladesh</p>
              </div>
              <Button variant="ghost" className="text-indigo-500 font-semibold" asChild>
                <Link href="/signup">View All <FaArrowRight className="ml-1 h-3 w-3" /></Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {defaultSlides.map((item, idx) => (
                <div
                  key={idx}
                  className="group relative rounded-2xl overflow-hidden bg-card border border-border shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-full text-xs text-amber-400 font-bold flex items-center gap-1">
                      <FaStar className="h-3 w-3" />
                      <span>{item.rating}</span>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h3 className="font-bold text-lg leading-snug group-hover:text-indigo-500 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <FaMapMarkerAlt className="h-3 w-3 text-indigo-500 shrink-0" />
                        {item.location}
                      </p>
                    </div>
                    <Button size="sm" className="w-full bg-secondary text-secondary-foreground hover:bg-indigo-600 hover:text-white transition-colors" asChild>
                      <Link href="/signup">Book Tour</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Container>
      </main>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}
