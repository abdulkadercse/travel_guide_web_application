"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { ReservationModal } from "@/components/shared/ReservationModal";
import { useGetRestaurantsQuery } from "@/redux/features/restaurant/restaurantApi";
import {
  FaUtensils,
  FaStar,
  FaMapMarkerAlt,
  FaSpinner,
  FaArrowRight,
  FaCalendarCheck,
  FaHeart,
} from "react-icons/fa";

export function FeaturedRestaurants() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [selectedCuisine, setSelectedCuisine] = useState<string>("ALL");

  const { data: restResponse, isLoading } = useGetRestaurantsQuery({});

  const restaurantsList: any[] = useMemo(() => {
    if (Array.isArray(restResponse?.data)) return restResponse.data;
    if (Array.isArray(restResponse)) return restResponse;
    return [];
  }, [restResponse]);

  // Extract clean distinct cuisines from database records (splitting combined types like "Seafood & Bangladeshi")
  const dynamicCuisines = useMemo(() => {
    const types = new Set<string>();
    restaurantsList.forEach((r) => {
      if (r.cuisineType && typeof r.cuisineType === "string") {
        // Split by &, /, comma, or "Traditional"
        const parts = r.cuisineType
          .replace(/Traditional\s+/i, "")
          .split(/[&,/]/)
          .map((p: string) => p.trim())
          .filter(Boolean);

        parts.forEach((p: string) => {
          if (p.length > 2) types.add(p);
        });
      }
    });
    return ["ALL", ...Array.from(types).slice(0, 6)];
  }, [restaurantsList]);

  // Filter restaurants by selected cuisine tab using flexible matching
  const filteredRestaurants = useMemo(() => {
    if (selectedCuisine === "ALL") return restaurantsList;
    return restaurantsList.filter(
      (r) =>
        r.cuisineType &&
        r.cuisineType.toLowerCase().includes(selectedCuisine.toLowerCase())
    );
  }, [restaurantsList, selectedCuisine]);

  const handleOpenBooking = (item: any) => {
    setSelectedRestaurant(item);
    setBookingModalOpen(true);
  };

  // Helper to extract a representative unit cost from price range string (e.g. "৳500 - ৳1500" -> 500)
  const extractUnitCost = (priceRange?: string) => {
    if (!priceRange) return 500;
    const match = priceRange.match(/\d[\d,]*/);
    if (match) {
      const num = parseInt(match[0].replace(/,/g, ""), 10);
      return Number.isNaN(num) || num <= 0 ? 500 : num;
    }
    return 500;
  };

  // Format price range for nice display
  const formatPriceDisplay = (priceRange?: string) => {
    if (!priceRange) return "৳400 - ৳1,500";
    if (priceRange.includes("৳৳৳")) return "৳800 - ৳2,500";
    if (priceRange.includes("৳৳")) return "৳350 - ৳1,200";
    if (priceRange.includes("৳")) return "৳150 - ৳500";
    return priceRange;
  };

  return (
    <section id="dining" className="section bg-card/60 border-y border-border" data-aos="fade-up">
      <Container className="space-y-9">
        {/* Header & Dynamic Cuisine Tabs */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between" data-aos="fade-up">
          <div className="max-w-xl space-y-3">
            <p className="eyebrow flex items-center gap-1.5">
              <FaUtensils className="text-primary h-3.5 w-3.5" /> Culinary Journeys
            </p>
            <h2 className="heading">Taste the Authentic Flavors</h2>
            <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
              From fresh coastal seafood in Cox&apos;s Bazar to traditional Old Dhaka Biryani and Sreemangal tea cafes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Dynamic Cuisine Filter Tabs from real DB items */}
            {dynamicCuisines.length > 1 && (
              <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-secondary/60 border border-border">
                {dynamicCuisines.map((cuisine) => (
                  <button
                    key={cuisine}
                    type="button"
                    onClick={() => setSelectedCuisine(cuisine)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      selectedCuisine === cuisine
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-card/60"
                    }`}
                  >
                    {cuisine === "ALL" ? "All Cuisines" : cuisine}
                  </button>
                ))}
              </div>
            )}

            <Button variant="outline" asChild className="rounded-xl shrink-0">
              <Link href="/restaurants" className="gap-2">
                <span>View All Dining</span>
                <FaArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Content State */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
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
        ) : filteredRestaurants.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground space-y-3 bg-secondary/20 rounded-2xl border border-dashed border-border p-8">
            <FaUtensils className="h-10 w-10 text-muted-foreground/40 mx-auto" />
            <p className="text-base font-medium">No restaurants found under &quot;{selectedCuisine}&quot; cuisine.</p>
            <Button variant="outline" size="sm" onClick={() => setSelectedCuisine("ALL")} className="rounded-xl">
              Show All Cuisines
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

            <AnimatePresence mode="popLayout">
              {filteredRestaurants.map((item, idx) => (
                <motion.article
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  data-aos="fade-up"
                  data-aos-delay={idx * 80}
                  className="surface-interactive group flex flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-xs hover:border-primary/40 transition-all duration-300"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                    <Image
                      src={
                        item.coverImage ||
                        item.images?.[0] ||
                        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
                      }
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent" />

                    {item.cuisineType && (
                      <span className="chip-glass absolute left-3 top-3 px-2.5 py-1 text-xs font-semibold">
                        {item.cuisineType}
                      </span>
                    )}

                    <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                      <FaStar className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                      {item.rating ? Number(item.rating).toFixed(1) : "4.8"}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5 space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold leading-snug transition-colors group-hover:text-primary line-clamp-1">
                        <Link href={`/restaurants/${item.id}`}>{item.name}</Link>
                      </h3>

                      <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <FaMapMarkerAlt className="h-3 w-3 shrink-0 text-primary" />
                        <span className="truncate">{item.location}</span>
                      </p>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {item.description || "Authentic culinary dishes prepared fresh with regional flavors & farm ingredients."}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/70">
                      <div>
                        <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground block">
                          Avg. Range
                        </span>
                        <span className="text-sm font-bold tracking-tight text-foreground">
                          {formatPriceDisplay(item.priceRange)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenBooking(item)}
                          className="rounded-xl gap-1.5 font-medium cursor-pointer text-xs h-9 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                        >
                          <FaCalendarCheck className="h-3 w-3" />
                          <span>Reserve</span>
                        </Button>
                        <Button size="sm" asChild className="rounded-xl text-xs h-9">
                          <Link href={`/restaurants/${item.id}`}>Menu</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}
      </Container>

      {/* Unified Shared Reservation Modal */}
      {selectedRestaurant && (
        <ReservationModal
          isOpen={bookingModalOpen}
          onClose={() => {
            setBookingModalOpen(false);
            setSelectedRestaurant(null);
          }}
          targetType="RESTAURANT"
          targetId={selectedRestaurant.id}
          targetName={selectedRestaurant.name}
          pricePerUnit={extractUnitCost(selectedRestaurant.priceRange)}
          location={selectedRestaurant.location}
          coverImage={selectedRestaurant.coverImage || selectedRestaurant.images?.[0]}
        />
      )}
    </section>
  );
}

export default FeaturedRestaurants;
