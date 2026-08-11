"use client";

import React, { useState } from "react";
import { HomeSlider } from "@/components/ui/home/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaSearch } from "react-icons/fa";

const categories = [
  { id: "all", label: "All Spots" },
  { id: "beach", label: "Sea Beaches" },
  { id: "heritage", label: "Heritage & History" },
  { id: "mountain", label: "Cloud Mountains" },
  { id: "tea", label: "Tea Gardens" },
  { id: "forest", label: "Forest & Wildlife" },
];

export function HeroSection({
  onSearch,
}: {
  onSearch?: (query: string, category: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery, selectedCategory);
    }
  };

  return (
    <section className="w-full relative">
      <HomeSlider autoplayInterval={3500} />

      {/* Floating Search Bar Widget Over Hero */}
      <div className="max-w-4xl mx-auto px-4 -mt-10 sm:-mt-14 relative z-30">
        <form
          onSubmit={handleSearchSubmit}
          className="p-4 sm:p-5 rounded-3xl bg-card/90 backdrop-blur-xl border border-border shadow-2xl space-y-4"
        >
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="flex-1 w-full relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search destination (e.g. Cox's Bazar, Paharpur, Sylhet)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 rounded-2xl bg-background border-border text-sm"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-12 rounded-2xl bg-background border border-border px-4 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-48"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>

              <Button
                type="submit"
                className="h-12 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shrink-0 gap-2 shadow-lg shadow-indigo-600/25"
              >
                <FaSearch className="h-4 w-4" />
                <span className="hidden sm:inline">Search</span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default HeroSection;
