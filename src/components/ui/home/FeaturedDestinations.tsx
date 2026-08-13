"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import {
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} from "@/redux/features/favorite/favoriteApi";
import { useCreateReservationMutation } from "@/redux/features/reservation/reservationApi";
import { FaMapMarkerAlt, FaStar, FaHeart } from "react-icons/fa";

// Short labels so the filter row stays on a single line beside the heading.
const categories = [
  { id: "all", label: "All" },
  { id: "beach", label: "Beaches" },
  { id: "heritage", label: "Heritage" },
  { id: "mountain", label: "Hills" },
  { id: "tea", label: "Tea gardens" },
  { id: "forest", label: "Wildlife" },
];

const featuredDestinations = [
  {
    id: "dest-1",
    title: "Cox's Bazar Sea Beach",
    district: "Cox's Bazar",
    location: "Chittagong Division",
    category: "beach",
    rating: 4.9,
    reviewsCount: 342,
    price: 2500,
    image: "/images/coxs-bazar.jpg",
    tag: "World's Longest Beach",
  },
  {
    id: "dest-2",
    title: "Somapura Mahavihara",
    district: "Naogaon",
    location: "Paharpur, Rajshahi",
    category: "heritage",
    rating: 4.8,
    reviewsCount: 189,
    price: 1800,
    image: "/images/paharpur.jpg",
    tag: "UNESCO World Heritage",
  },
  {
    id: "dest-3",
    title: "Nilgiri Cloud Resort",
    district: "Bandarban",
    location: "Chittagong Hill Tracts",
    category: "mountain",
    rating: 4.9,
    reviewsCount: 421,
    price: 3200,
    image: "/images/bandarban.jpg",
    tag: "High Altitude Clouds",
  },
  {
    id: "dest-4",
    title: "Sylhet Tea Gardens",
    district: "Sylhet",
    location: "Sreemangal, Sylhet",
    category: "tea",
    rating: 4.7,
    reviewsCount: 265,
    price: 2100,
    image: "/images/sylhet.jpg",
    tag: "Lush Green Hills",
  },
  {
    id: "dest-5",
    title: "Sundarbans Mangrove Forest",
    district: "Khulna",
    location: "Khulna Division",
    category: "forest",
    rating: 4.9,
    reviewsCount: 512,
    price: 4500,
    image: "/images/bg-travel.jpg",
    tag: "Royal Bengal Tigers",
  },
  {
    id: "dest-6",
    title: "Saint Martin's Coral Island",
    district: "Cox's Bazar",
    location: "Teknaf, Bay of Bengal",
    category: "beach",
    rating: 4.9,
    reviewsCount: 610,
    price: 3500,
    image: "/images/coxs-bazar.jpg",
    tag: "Crystal Clear Water",
  },
];

export function FeaturedDestinations() {
  const user = useAppSelector(selectCurrentUser);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Booking Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [bookingDates, setBookingDates] = useState({ start: "", end: "" });
  const [bookingLoading, setBookingLoading] = useState(false);

  // The server derives the user from the token, so no userId is sent.
  const { data: favoritesResponse } = useGetFavoritesQuery(undefined, { skip: !user });
  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();
  const [createReservation] = useCreateReservationMutation();

  useEffect(() => {
    if (favoritesResponse?.data) {
      setFavoriteIds(favoritesResponse.data.map((f: any) => f.destinationId));
    }
  }, [favoritesResponse]);

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

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in first to confirm booking!");
      return;
    }
    if (!bookingDates.start || !bookingDates.end) {
      toast.error("Please select travel start and end dates");
      return;
    }

    setBookingLoading(true);
    const toastId = toast.loading("Submitting booking request...");

    try {
      await createReservation({
        destinationId: selectedItem?.id,
        startDate: bookingDates.start,
        endDate: bookingDates.end,
        totalCost: selectedItem?.price || 2500,
      }).unwrap();

      toast.success("Reservation request submitted successfully!", { id: toastId });
      setBookingModalOpen(false);
      setBookingDates({ start: "", end: "" });
    } catch (err: unknown) {
      const message = (err as { data?: { message?: string } })?.data?.message || "Booking failed";
      toast.error(message, { id: toastId });
    } finally {
      setBookingLoading(false);
    }
  };

  const filteredDestinations = featuredDestinations.filter(
    (item) => selectedCategory === "all" || item.category === selectedCategory
  );

  return (
    <section id="destinations" className="section">
      <Container className="space-y-9">
        <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
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
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredDestinations.map((item) => {
              const isFavorite = favoriteIds.includes(item.id);

              return (
                <motion.article
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.22 }}
                  className="surface-interactive group flex flex-col overflow-hidden"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Scrim so the badges stay legible on any photo. */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/55 via-transparent to-stone-950/25" />

                    <span className="chip-glass absolute left-3 top-3 px-2.5 py-1 text-xs font-medium">
                      {item.tag}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleToggleFavorite(item.id)}
                      aria-pressed={isFavorite}
                      aria-label={isFavorite ? "Remove from saved" : "Save this destination"}
                      className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all ${
                        isFavorite
                          ? "bg-white text-rose-500"
                          : "bg-stone-950/35 text-white hover:scale-110 hover:bg-white hover:text-rose-500"
                      }`}
                      style={{ border: "1px solid oklch(1 0 0 / 0.22)" }}
                    >
                      <FaHeart className="h-3.5 w-3.5" />
                    </button>

                    <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 text-sm font-medium text-white">
                      <FaStar className="h-3.5 w-3.5 text-highlight" />
                      {item.rating}
                      <span className="font-normal text-white/70">({item.reviewsCount})</span>
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-lg font-semibold leading-snug transition-colors group-hover:text-primary">
                      {item.title}
                    </h3>

                    <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <FaMapMarkerAlt className="h-3 w-3 shrink-0" />
                      {item.location}
                    </p>

                    <div className="mt-auto flex items-end justify-between pt-5">
                      <p>
                        <span className="text-xl font-semibold tracking-tight">
                          ৳{item.price.toLocaleString()}
                        </span>
                        <span className="text-sm text-muted-foreground"> / person</span>
                      </p>

                      <Button size="sm" onClick={() => handleOpenBooking(item)}>
                        Reserve
                      </Button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      </Container>

      {/* Booking Dialog Modal */}
      <Dialog open={bookingModalOpen} onOpenChange={setBookingModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request a reservation</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleConfirmBooking} className="space-y-5 pt-1">
            <div className="rounded-lg border border-border bg-secondary/50 p-4 text-sm">
              <p className="font-medium">{selectedItem?.title}</p>
              <p className="mt-0.5 text-muted-foreground">
                {selectedItem?.location || selectedItem?.district}
              </p>
              <p className="mt-2 text-muted-foreground">
                ৳{(selectedItem?.price || 2500).toLocaleString()} per person
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="dest-start" className="text-sm text-muted-foreground">
                  Start date
                </label>
                <Input
                  id="dest-start"
                  type="date"
                  value={bookingDates.start}
                  onChange={(e) => setBookingDates({ ...bookingDates, start: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="dest-end" className="text-sm text-muted-foreground">
                  End date
                </label>
                <Input
                  id="dest-end"
                  type="date"
                  value={bookingDates.end}
                  onChange={(e) => setBookingDates({ ...bookingDates, end: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setBookingModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={bookingLoading}>
                {bookingLoading ? "Sending..." : "Send request"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default FeaturedDestinations;
