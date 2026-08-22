"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReservationModal } from "@/components/shared/ReservationModal";
import { useGetRestaurantsQuery } from "@/redux/features/restaurant/restaurantApi";
import {
  FaUtensils,
  FaMapMarkerAlt,
  FaStar,
  FaSearch,
  FaSpinner,
} from "react-icons/fa";

export default function RestaurantsListingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("ALL");
  const [cuisineFilter, setCuisineFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("RECOMMENDED");

  // Reservation Modal State
  const [resModalOpen, setResModalOpen] = useState(false);
  const [selectedRest, setSelectedRest] = useState<any>(null);

  // Fetch full dataset to dynamically compute all available cuisines and locations
  const { data: allRestaurantsResponse } = useGetRestaurantsQuery(undefined);
  const allRestaurantsList: any[] = Array.isArray(allRestaurantsResponse?.data)
    ? allRestaurantsResponse.data
    : Array.isArray(allRestaurantsResponse)
    ? allRestaurantsResponse
    : [];

  const rawCuisines = allRestaurantsList.map((r) => r.cuisineType?.trim()).filter(Boolean);
  const cuisines = ["ALL", ...Array.from(new Set(rawCuisines)).sort()];

  const rawLocations = allRestaurantsList.flatMap((r) => {
    if (!r.location) return [];
    const loc = r.location.trim();
    const parts = loc.split(",").map((p: string) => p.trim());
    return [parts[parts.length - 1], loc];
  });
  const uniqueLocations = Array.from(new Set(rawLocations.filter(Boolean))).sort();
  const locations = ["ALL", ...uniqueLocations];

  const queryParams: Record<string, string> = {};
  if (locationFilter && locationFilter !== "ALL") queryParams.location = locationFilter;
  if (cuisineFilter && cuisineFilter !== "ALL") queryParams.cuisineType = cuisineFilter;
  if (searchTerm && searchTerm.trim()) queryParams.searchTerm = searchTerm.trim();

  const { data: restaurantsResponse, isLoading } = useGetRestaurantsQuery(
    Object.keys(queryParams).length > 0 ? queryParams : undefined
  );

  const rawRestaurants: any[] = Array.isArray(restaurantsResponse?.data)
    ? restaurantsResponse.data
    : Array.isArray(restaurantsResponse)
    ? restaurantsResponse
    : [];

  const sortedRestaurants = [...rawRestaurants].sort((a, b) => {
    if (sortBy === "RATING") return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  return (
    <div className="min-h-screen">
      {/* 1. Full-Width Hero Section with Culinary Background Image */}
      <section className="relative h-[300px] sm:h-[380px] flex items-center justify-center overflow-hidden border-b border-border" data-aos="fade-up">
        <Image
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1920&q=80"
          alt="Authentic Dining & Restaurants in Bangladesh"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/65 to-stone-950/45 backdrop-blur-[0.5px]" />

        <Container className="relative z-10 text-center max-w-3xl space-y-3.5" data-aos="fade-up">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-xs">
            <FaUtensils className="text-primary h-3.5 w-3.5" />
            Culinary Journeys & Authentic Dining
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white drop-shadow-md">
            Tables Worth Booking Ahead
          </h1>
          <p className="text-sm sm:text-base text-white/85 max-w-2xl mx-auto leading-relaxed drop-shadow-xs">
            Old Dhaka kacchi, fresh seafood on Cox&apos;s Bazar beach, and traditional Sylheti vorta thalis — verified and rated by food enthusiasts.
          </p>
        </Container>
      </section>

      {/* 2. Main Content & Listings */}
      <div className="py-8 sm:py-12">
        <Container className="space-y-8">
          {/* Filters */}
          <div className="surface space-y-4 p-4 sm:p-5 shadow-xs" data-aos="fade-up" data-aos-delay="100">


          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <FaSearch className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search restaurants"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All locations" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc === "ALL" ? "All locations" : loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All cuisines" />
              </SelectTrigger>
              <SelectContent>
                {cuisines.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c === "ALL" ? "All cuisines" : c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RECOMMENDED">Recommended</SelectItem>
                <SelectItem value="RATING">Highest rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
            <span className="mr-1 text-sm text-muted-foreground">Cuisine:</span>
            {cuisines.slice(0, 8).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCuisineFilter(c)}
                className={`rounded-full border px-3.5 py-1.5 text-sm transition-all ${
                  cuisineFilter === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {c === "ALL" ? "All" : c}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="surface overflow-hidden rounded-2xl animate-pulse bg-card border border-border"
              >
                <div className="aspect-[4/3] w-full bg-muted" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-3/4 bg-muted rounded-md" />
                  <div className="h-3.5 w-1/2 bg-muted rounded-md" />
                  <div className="h-3.5 w-full bg-muted rounded-md" />
                  <div className="pt-4 flex items-center justify-between border-t border-border/60">
                    <div className="h-5 w-20 bg-muted rounded-md" />
                    <div className="flex gap-2">
                      <div className="h-8 w-18 bg-muted rounded-xl" />
                      <div className="h-8 w-14 bg-muted rounded-xl" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : sortedRestaurants.length === 0 ? (

          <div className="space-y-4 rounded-2xl border border-dashed border-border py-24 text-center">
            <FaUtensils className="mx-auto h-10 w-10 text-muted-foreground/30" />
            <div className="space-y-1.5">
              <h3 className="text-lg font-semibold">No restaurants found</h3>
              <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                Try a different cuisine or clear the search filters.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setLocationFilter("ALL");
                setCuisineFilter("ALL");
              }}
            >
              Reset filters
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              {sortedRestaurants.length} restaurant
              {sortedRestaurants.length === 1 ? "" : "s"}
            </p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sortedRestaurants.map((rest) => (
                <article
                  key={rest.id}
                  className="surface-interactive group flex flex-col overflow-hidden"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                    <Image
                      src={
                        rest.coverImage ||
                        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5"
                      }
                      alt={rest.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:"
                    />

                    {/* Scrim so the badges stay legible on any photo. */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/55 via-transparent to-stone-950/25" />

                    {rest.cuisineType && (
                      <span className="chip-glass absolute left-3 top-3 px-2.5 py-1 text-xs font-medium">
                        {rest.cuisineType}
                      </span>
                    )}

                    <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 text-sm font-medium text-white">
                      <FaStar className="h-3.5 w-3.5 text-highlight" />
                      {rest.rating || 4.8}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-lg font-semibold leading-snug transition-colors group-hover:text-primary">
                      <Link href={`/restaurants/${rest.id}`}>{rest.name}</Link>
                    </h3>

                    <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <FaMapMarkerAlt className="h-3 w-3 shrink-0" />
                      {rest.location}
                    </p>

                    {rest.description && (
                      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {rest.description}
                      </p>
                    )}

                    <div className="mt-auto flex items-end justify-between pt-5">
                      <p>
                        <span className="text-xl font-semibold tracking-tight">
                          {rest.priceRange || "৳৳"}
                        </span>
                        <span className="text-sm text-muted-foreground"> price range</span>
                      </p>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedRest(rest);
                            setResModalOpen(true);
                          }}
                        >
                          Reserve
                        </Button>
                        <Button size="sm" asChild>
                          <Link href={`/restaurants/${rest.id}`}>Details</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {/* Global Reservation Modal */}
        {selectedRest && (
          <ReservationModal
            isOpen={resModalOpen}
            onClose={() => {
              setResModalOpen(false);
              setSelectedRest(null);
            }}
            targetType="RESTAURANT"
            targetId={selectedRest.id}
            targetName={selectedRest.name}
            pricePerUnit={selectedRest.avgPrice || 1200}
            location={selectedRest.location}
            coverImage={selectedRest.coverImage}
          />
        )}
      </Container>
      </div>
    </div>
  );
}

