"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Container from "@/components/shared/Container";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FaCompass,
  FaMapMarkerAlt,
  FaSearch,
  FaArrowLeft,
  FaHome,
  FaRoute,
  FaStar,
  FaExclamationTriangle,
  FaPlaneDeparture
} from "react-icons/fa";

const suggestedDestinations = [
  {
    title: "Cox's Bazar Beach",
    location: "Chittagong Division",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    href: "/signup",
  },
  {
    title: "Somapura Mahavihara",
    location: "Paharpur, Naogaon",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=600&q=80",
    href: "/signup",
  },
  {
    title: "Nilgiri Cloud Resort",
    location: "Bandarban",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
    href: "/signup",
  },
  {
    title: "Sylhet Tea Gardens",
    location: "Sylhet Division",
    rating: "4.7",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
    href: "/signup",
  },
];

export default function NotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/demo?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header Navbar */}
      <Navbar />

      {/* Main 404 Hero Section */}
      <main className="flex-1 flex flex-col justify-center py-12 md:py-20 relative overflow-hidden">
        {/* Background Glowing Gradient Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

        <Container className="relative z-10 space-y-12">
          {/* Central 404 Header Area */}
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Animated Compass Icon Illustration */}
            <div className="relative inline-flex items-center justify-center mb-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 p-8 blur-xl"
              />
              
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative h-28 w-28 sm:h-36 sm:w-36 rounded-3xl bg-slate-900/80 border border-indigo-500/30 shadow-2xl backdrop-blur-xl flex items-center justify-center text-indigo-400 group"
              >
                <motion.div
                  animate={{ rotate: [0, 45, -30, 15, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <FaCompass className="h-16 w-16 sm:h-20 sm:w-20 text-indigo-500 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                </motion.div>
                <div className="absolute -top-2 -right-2 bg-rose-500 text-white p-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                  <FaExclamationTriangle className="h-3 w-3" />
                  <span>404</span>
                </div>
              </motion.div>
            </div>

            {/* Glowing 404 Title */}
            <div className="space-y-2">
              <span className="text-xs uppercase font-extrabold tracking-widest px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 inline-block">
                Lost Off The Map
              </span>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
                Oops! Destination{" "}
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
                  Not Found
                </span>
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
                Looks like you&apos;ve wandered off the guided trail! The page or tour package you are looking for has been moved, renamed, or doesn&apos;t exist.
              </p>
            </div>

            {/* Destination Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="max-w-md mx-auto flex items-center gap-2 p-1.5 rounded-full bg-card border border-border shadow-lg focus-within:border-indigo-500/80 transition-all"
            >
              <div className="pl-3.5 text-muted-foreground">
                <FaSearch className="h-4 w-4" />
              </div>
              <Input
                type="text"
                placeholder="Search destinations (e.g. Cox's Bazar, Sylhet)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-none shadow-none focus-visible:ring-0 bg-transparent text-sm"
              />
              <Button
                type="submit"
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-5 font-semibold shrink-0"
              >
                Explore
              </Button>
            </form>

            {/* Quick Action Navigation Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="rounded-full px-5 font-semibold gap-2 border-border hover:bg-accent"
              >
                <FaArrowLeft className="h-3.5 w-3.5" />
                Go Back
              </Button>

              <Button
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-6 font-semibold gap-2 shadow-lg shadow-indigo-600/25"
                asChild
              >
                <Link href="/">
                  <FaHome className="h-4 w-4" />
                  Return Home
                </Link>
              </Button>

              <Button
                variant="secondary"
                className="rounded-full px-5 font-semibold gap-2 bg-secondary hover:bg-indigo-600 hover:text-white transition-colors"
                asChild
              >
                <Link href="/demo">
                  <FaRoute className="h-3.5 w-3.5" />
                  View Tour Packages
                </Link>
              </Button>
            </div>
          </div>

          {/* Recommended Destinations Cards Section */}
          <div className="pt-8 space-y-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
                  <FaPlaneDeparture className="text-indigo-500 h-5 w-5" />
                  Popular Destinations You Might Like
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Get back on track by exploring top travel spots across Bangladesh
                </p>
              </div>
              <Button variant="ghost" size="sm" className="text-indigo-400 font-semibold" asChild>
                <Link href="/demo">Browse All</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {suggestedDestinations.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="group relative rounded-2xl overflow-hidden bg-card border border-border shadow-md hover:shadow-xl hover:border-indigo-500/50 transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-slate-950/75 backdrop-blur-md px-2.5 py-1 rounded-full text-xs text-amber-400 font-bold flex items-center gap-1">
                      <FaStar className="h-3 w-3" />
                      <span>{item.rating}</span>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h3 className="font-bold text-base leading-snug group-hover:text-indigo-500 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <FaMapMarkerAlt className="h-3 w-3 text-indigo-500 shrink-0" />
                        {item.location}
                      </p>
                    </div>
                    <div className="pt-2 flex items-center text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform">
                      Explore Tour &rarr;
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </main>

      {/* Bottom Footer */}
      <Footer />
    </div>
  );
}
