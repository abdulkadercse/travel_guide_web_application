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
import { FaMapMarkerAlt, FaStar, FaHeart } from "react-icons/fa";

const categories = [
  { id: "all", label: "All Spots" },
  { id: "beach", label: "Sea Beaches" },
  { id: "heritage", label: "Heritage & History" },
  { id: "mountain", label: "Cloud Mountains" },
  { id: "tea", label: "Tea Gardens" },
  { id: "forest", label: "Forest & Wildlife" },
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
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1511497584788-876761465586?auto=format&fit=crop&w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80",
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

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/favorites?userId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setFavoriteIds(data.data.map((f: any) => f.destinationId));
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const handleToggleFavorite = async (destinationId: string) => {
    if (!user) {
      toast.error("Please log in to save favorites!");
      return;
    }

    const isFav = favoriteIds.includes(destinationId);
    if (isFav) {
      setFavoriteIds(favoriteIds.filter((id) => id !== destinationId));
      try {
        await fetch(`/api/favorites?userId=${user.id}&destinationId=${destinationId}`, {
          method: "DELETE",
        });
        toast.success("Removed from saved favorites");
      } catch {
        toast.error("Failed to remove favorite");
      }
    } else {
      setFavoriteIds([...favoriteIds, destinationId]);
      try {
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, destinationId }),
        });
        toast.success("Saved to favorites!");
      } catch {
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
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          destinationId: selectedItem?.id,
          startDate: bookingDates.start,
          endDate: bookingDates.end,
          totalCost: selectedItem?.price || 2500,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit booking");
      }

      toast.success("Reservation request submitted successfully!", { id: toastId });
      setBookingModalOpen(false);
      setBookingDates({ start: "", end: "" });
    } catch (err: any) {
      toast.error(err.message || "Booking failed", { id: toastId });
    } finally {
      setBookingLoading(false);
    }
  };

  const filteredDestinations = featuredDestinations.filter(
    (item) => selectedCategory === "all" || item.category === selectedCategory
  );

  return (
    <section className="w-full">
      <Container className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 inline-block">
              Discover Bangladesh
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Top Handpicked Destinations
            </h2>
            <p className="text-sm text-muted-foreground">
              Explore breathtaking sea beaches, historical heritage sites, tea gardens & hill resorts
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCategory(c.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                  selectedCategory === c.id
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : "bg-card text-muted-foreground border border-border hover:border-indigo-500/50 hover:text-foreground"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredDestinations.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative rounded-3xl overflow-hidden bg-card border border-border shadow-lg hover:shadow-2xl hover:border-indigo-500/50 transition-all duration-300 flex flex-col"
              >
                <div className="relative h-56 w-full overflow-hidden bg-slate-900">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-white font-bold border border-white/10">
                    {item.tag}
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleFavorite(item.id)}
                      className={`h-8 w-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                        favoriteIds.includes(item.id)
                          ? "bg-rose-600 text-white shadow-lg shadow-rose-600/40"
                          : "bg-slate-950/80 text-slate-300 hover:text-rose-400 border border-white/10"
                      }`}
                      title={favoriteIds.includes(item.id) ? "Remove from favorites" : "Save to favorites"}
                    >
                      <FaHeart className="h-3.5 w-3.5" />
                    </button>
                    <div className="bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-xs text-amber-400 font-bold flex items-center gap-1 border border-white/10">
                      <FaStar className="h-3 w-3" />
                      <span>{item.rating}</span>
                      <span className="text-slate-400 text-[10px]">({item.reviewsCount})</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="font-extrabold text-xl leading-snug group-hover:text-indigo-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <FaMapMarkerAlt className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                      {item.location} ({item.district})
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                        Starting From
                      </span>
                      <span className="text-lg font-black text-indigo-400">
                        ৳{item.price}{" "}
                        <span className="text-xs font-normal text-muted-foreground">/ person</span>
                      </span>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleOpenBooking(item)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-5 font-semibold shadow-md shadow-indigo-600/20"
                    >
                      Book Tour
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Container>

      {/* Booking Dialog Modal */}
      <Dialog open={bookingModalOpen} onOpenChange={setBookingModalOpen}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Book Tour / Stay: {selectedItem?.title}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleConfirmBooking} className="space-y-4 pt-2">
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs space-y-1">
              <p className="font-bold text-indigo-400">Destination Details:</p>
              <p>Location: {selectedItem?.location || selectedItem?.district}</p>
              <p>Price: ৳{selectedItem?.price || 2500} / person</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Start Date</label>
                <Input
                  type="date"
                  value={bookingDates.start}
                  onChange={(e) => setBookingDates({ ...bookingDates, start: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">End Date</label>
                <Input
                  type="date"
                  value={bookingDates.end}
                  onChange={(e) => setBookingDates({ ...bookingDates, end: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setBookingModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={bookingLoading} className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold">
                Confirm Booking
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default FeaturedDestinations;
