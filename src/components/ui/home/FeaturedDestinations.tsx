"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { ReservationModal } from "@/components/shared/ReservationModal";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import {
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} from "@/redux/features/favorite/favoriteApi";
import { useGetDestinationsQuery } from "@/redux/features/destination/destinationApi";
import { FaMapMarkerAlt, FaStar, FaHeart, FaSpinner } from "react-icons/fa";

export function FeaturedDestinations() {
  const user = useAppSelector(selectCurrentUser);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Booking Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const { data: destinationsResponse, isLoading } = useGetDestinationsQuery({});
  const { data: favoritesResponse } = useGetFavoritesQuery(undefined, { skip: !user });
  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();

  const allDestinations: any[] = Array.isArray(destinationsResponse?.data)
    ? destinationsResponse.data
    : Array.isArray(destinationsResponse)
    ? destinationsResponse
    : [];

  useEffect(() => {
    if (favoritesResponse?.data) {
      setFavoriteIds(favoritesResponse.data.map((f: any) => f.destinationId));
    }
  }, [favoritesResponse]);

  // Extract dynamic categories from real DB records
  const dbCategories = Array.from(
    new Set(allDestinations.map((d) => d.category).filter(Boolean))
  );
  const categories = [
    { id: "all", label: "All" },
    ...dbCategories.map((c) => ({ id: String(c).toLowerCase(), label: String(c) })),
  ];

  const handleToggleFavorite = async (destinationId: string) => {
    if (!user) {
      toast.error("Please log in to save favorites!");
      return;
    }

    const isFav = favoriteIds.includes(destinationId);
    if (isFav) {
      setFavoriteIds(favoriteIds.filter((id) => id !== destinationId));
      try {
        await removeFavorite(destinationId).unwrap();
        toast.success("Removed from saved favorites");
      } catch {
        setFavoriteIds((ids) => [...ids, destinationId]);
        toast.error("Failed to remove favorite");
      }
    } else {
      setFavoriteIds([...favoriteIds, destinationId]);
      try {
        await addFavorite(destinationId).unwrap();
        toast.success("Saved to favorites!");
      } catch {
        setFavoriteIds((ids) => ids.filter((id) => id !== destinationId));
        toast.error("Failed to save favorite");
      }
    }
  };

  const handleOpenBooking = (item: any) => {
    setSelectedItem(item);
    setBookingModalOpen(true);
  };

  const filteredDestinations = allDestinations.filter((item) => {
    if (selectedCategory === "all") return true;
    return (item.category || "").toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <section id="destinations" className="section" data-aos="fade-up">
      <Container className="space-y-9">
        <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between" data-aos="fade-up">
          <div className="max-w-xl space-y-4">
            <p className="eyebrow">Discover Bangladesh</p>
            <h2 className="heading">Places worth the journey</h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Sea beaches, heritage sites, tea gardens and hill tracks — handpicked and rated by
              travellers.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCategory(c.id)}
                className={`rounded-full border px-3.5 py-1.5 text-sm transition-all cursor-pointer ${
                  selectedCategory === c.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

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
                    <div className="h-5 w-24 bg-muted rounded-md" />
                    <div className="flex gap-2">
                      <div className="h-8 w-16 bg-muted rounded-xl" />
                      <div className="h-8 w-16 bg-muted rounded-xl" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredDestinations.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground space-y-3">
            <p className="text-base font-medium">No destinations found in this category.</p>
            <Button variant="outline" size="sm" onClick={() => setSelectedCategory("all")}>
              View All Destinations
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

            <AnimatePresence mode="popLayout">
              {filteredDestinations.map((item, idx) => {
                const isFavorite = favoriteIds.includes(item.id);

                return (
                  <motion.article
                    key={item.id}
                    layout
                    data-aos="fade-up"
                    data-aos-delay={idx * 100}

                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.22 }}
                    className="surface-interactive group flex flex-col overflow-hidden rounded-2xl"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                      <Image
                        src={
                          item.coverImage ||
                          item.images?.[0] ||
                          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                        }
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      {/* Scrim so the badges stay legible on any photo. */}
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/55 via-transparent to-stone-950/25" />

                      {item.category && (
                        <span className="chip-glass absolute left-3 top-3 px-2.5 py-1 text-xs font-medium">
                          {item.category}
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleToggleFavorite(item.id)}
                        aria-pressed={isFavorite}
                        aria-label={isFavorite ? "Remove from saved" : "Save this destination"}
                        className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all cursor-pointer ${
                          isFavorite
                            ? "bg-white text-rose-500"
                            : "bg-stone-950/35 text-white hover:scale-110 hover:bg-white hover:text-rose-500"
                        }`}
                        style={{ border: "1px solid oklch(1 0 0 / 0.22)" }}
                      >
                        <FaHeart className="h-3.5 w-3.5" />
                      </button>

                      <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 text-sm font-medium text-white">
                        <FaStar className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                        {item.rating || 4.9}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-lg font-semibold leading-snug transition-colors group-hover:text-primary">
                        <Link href={`/destinations/${item.id}`}>{item.title}</Link>
                      </h3>

                      <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <FaMapMarkerAlt className="h-3 w-3 shrink-0 text-primary" />
                        {item.location || item.district}
                      </p>

                      <div className="mt-auto flex items-end justify-between pt-5">
                        <p>
                          <span className="text-xl font-semibold tracking-tight">
                            ৳{(item.price || 2500).toLocaleString()}
                          </span>
                          <span className="text-sm text-muted-foreground"> / person</span>
                        </p>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenBooking(item)}
                            className="rounded-xl cursor-pointer"
                          >
                            Reserve
                          </Button>
                          <Button size="sm" asChild className="rounded-xl">
                            <Link href={`/destinations/${item.id}`}>Details</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </Container>

      {/* Unified Shared Reservation Modal */}
      {selectedItem && (
        <ReservationModal
          isOpen={bookingModalOpen}
          onClose={() => {
            setBookingModalOpen(false);
            setSelectedItem(null);
          }}
          targetType="DESTINATION"
          targetId={selectedItem.id}
          targetName={selectedItem.title}
          pricePerUnit={selectedItem.price || 2500}
          location={selectedItem.location || selectedItem.district}
          coverImage={selectedItem.coverImage || selectedItem.images?.[0]}
        />
      )}
    </section>
  );
}

export default FeaturedDestinations;
