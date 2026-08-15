"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { HomeSlider } from "@/components/ui/home/slider";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { FaMagnifyingGlass, FaLocationDot, FaCalendar } from "react-icons/fa6";

const categories = [
  { id: "all", label: "All spots" },
  { id: "beach", label: "Sea beaches" },
  { id: "heritage", label: "Heritage" },
  { id: "mountain", label: "Hills" },
  { id: "tea", label: "Tea gardens" },
  { id: "forest", label: "Forest & wildlife" },
];

export function HeroSection({
  onSearch,
}: {
  onSearch?: (query: string, category: string) => void;
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [when, setWhen] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/destinations?searchTerm=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push("/destinations");
    }
  };

  return (
    <section className="relative">
      {/* Full-bleed photography carries the hero; the copy sits on top of it. */}
      <HomeSlider autoplayInterval={6000} />

      {/* Search panel overlaps the bottom edge of the image. */}
      <Container className="relative z-20 -mt-14 sm:-mt-16">
        <form
          onSubmit={handleSearchSubmit}
          className="rounded-2xl border border-border bg-card p-2.5 sm:p-3"
          style={{ boxShadow: "var(--shadow-lg)" }}
        >
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
            <label className="flex flex-1 items-center gap-3 rounded-xl px-4 py-3 transition-colors focus-within:bg-secondary/70 hover:bg-secondary/50">
              <FaLocationDot className="h-4 w-4 shrink-0 text-primary" />
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-medium text-foreground">Where</span>
                <input
                  type="text"
                  placeholder="Cox's Bazar, Bandarban, Sylhet…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </span>
            </label>

            <span className="hidden h-10 w-px shrink-0 bg-border lg:block" />

            <label className="flex flex-1 items-center gap-3 rounded-xl px-4 py-3 transition-colors focus-within:bg-secondary/70 hover:bg-secondary/50">
              <FaCalendar className="h-4 w-4 shrink-0 text-primary" />
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-medium text-foreground">When</span>
                <input
                  type="date"
                  value={when}
                  onChange={(e) => setWhen(e.target.value)}
                  className="w-full bg-transparent text-sm text-foreground focus:outline-none"
                />
              </span>
            </label>

            <span className="hidden h-10 w-px shrink-0 bg-border lg:block" />

            <label className="flex flex-1 items-center gap-3 rounded-xl px-4 py-3 transition-colors focus-within:bg-secondary/70 hover:bg-secondary/50">
              <FaMagnifyingGlass className="h-4 w-4 shrink-0 text-primary" />
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-medium text-foreground">What kind of trip</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full cursor-pointer bg-transparent text-sm text-foreground focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </span>
            </label>

            <Button type="submit" size="lg" className="h-14 shrink-0 rounded-xl px-8 text-base">
              <FaMagnifyingGlass className="mr-2 h-3.5 w-3.5" />
              Search
            </Button>
          </div>
        </form>

        {/* Quick category chips */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-sm text-muted-foreground">Popular:</span>
          {categories.slice(1).map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.id)}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition-all ${
                selectedCategory === c.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default HeroSection;
