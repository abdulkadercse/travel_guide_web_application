"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { ProtectedRoute, Container } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout, selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useTheme } from "next-themes";
import {
  FaCompass,
  FaHeart,
  FaSearch,
  FaTrashAlt,
  FaMapMarkerAlt,
  FaStar,
  FaSpinner,
  FaArrowLeft,
  FaSun,
  FaMoon,
  FaSignOutAlt,
} from "react-icons/fa";

export default function UserFavoritesPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Booking Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedDest, setSelectedDest] = useState<any>(null);
  const [bookingDates, setBookingDates] = useState({ start: "", end: "" });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (user?.id) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/favorites?userId=${user?.id}`);
      const data = await res.json();
      if (data.success) {
        setFavorites(data.data || []);
      }
    } catch (err) {
      console.error("Fetch favorites error:", err);
      toast.error("Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (destinationId: string) => {
    try {
      const res = await fetch(`/api/favorites?userId=${user?.id}&destinationId=${destinationId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Removed from favorites");
        fetchFavorites();
      } else {
        toast.error(data.message || "Failed to remove favorite");
      }
    } catch (err) {
      toast.error("Error removing favorite");
    }
  };

  const handleOpenBooking = (dest: any) => {
    setSelectedDest(dest);
    setBookingModalOpen(true);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !selectedDest) return;
    if (!bookingDates.start || !bookingDates.end) {
      toast.error("Please select travel dates");
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
          destinationId: selectedDest.id,
          startDate: bookingDates.start,
          endDate: bookingDates.end,
          totalCost: selectedDest.price || 2500,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Booking failed");
      }

      toast.success("Reservation request submitted!", { id: toastId });
      setBookingModalOpen(false);
      setBookingDates({ start: "", end: "" });
    } catch (err: any) {
      toast.error(err.message || "Failed to submit booking", { id: toastId });
    } finally {
      setBookingLoading(false);
    }
  };

  const filteredFavorites = favorites.filter((item) => {
    const title = item.destination?.title || "";
    const loc = item.destination?.location || "";
    const dist = item.destination?.district || "";
    const query = searchQuery.toLowerCase();
    return title.toLowerCase().includes(query) || loc.toLowerCase().includes(query) || dist.toLowerCase().includes(query);
  });

  return (
    <ProtectedRoute allowedRoles={["USER", "ADMIN", "SUPER_ADMIN"]}>
      <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 font-sans selection:bg-indigo-500 selection:text-white">
        {/* Header Navbar */}
        <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-background/80 border-b border-border">
          <Container>
            <div className="h-16 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" asChild className="rounded-full">
                  <Link href="/dashboard/user">
                    <FaArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to Dashboard
                  </Link>
                </Button>
                <div className="h-4 w-px bg-border" />
                <span className="text-lg font-extrabold tracking-tight flex items-center gap-2">
                  <FaHeart className="text-rose-500 h-5 w-5" /> Saved Favorites
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="rounded-full h-9 w-9"
                >
                  {mounted && theme === "dark" ? (
                    <FaSun className="h-4 w-4 text-amber-400" />
                  ) : (
                    <FaMoon className="h-4 w-4 text-slate-700" />
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    dispatch(logout());
                    toast.success("Logged out successfully");
                  }}
                  className="rounded-full text-rose-400 hover:text-rose-300 border-border"
                >
                  <FaSignOutAlt className="mr-1 h-3.5 w-3.5" /> Sign Out
                </Button>
              </div>
            </div>
          </Container>
        </header>

        {/* Main Body */}
        <main className="flex-1 py-8">
          <Container className="space-y-8">
            {/* Header & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
                  My Bookmarked Travel Destinations 💖
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Quick access to all tour spots you saved for future travel.
                </p>
              </div>

              <div className="relative w-full sm:w-80">
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search saved favorites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 rounded-xl"
                />
              </div>
            </div>

            {/* Favorites Grid */}
            {loading ? (
              <div className="py-20 flex justify-center text-muted-foreground">
                <FaSpinner className="h-8 w-8 animate-spin text-rose-500" />
              </div>
            ) : filteredFavorites.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <p className="text-muted-foreground font-semibold">No saved favorites found.</p>
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-6" asChild>
                  <Link href="/">Explore Tourist Spots</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFavorites.map((item) => {
                  const dest = item.destination;
                  if (!dest) return null;
                  return (
                    <div
                      key={item.id}
                      className="group relative rounded-3xl overflow-hidden bg-card border border-border shadow-lg hover:shadow-2xl hover:border-rose-500/40 transition-all duration-300 flex flex-col"
                    >
                      <div className="relative h-52 w-full bg-slate-900 overflow-hidden">
                        {dest.coverImage && (
                          <Image
                            src={dest.coverImage}
                            alt={dest.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveFavorite(dest.id)}
                          className="absolute top-3 right-3 bg-slate-950/80 hover:bg-rose-600 text-rose-400 hover:text-white rounded-full h-8 w-8 p-0 border border-white/10 backdrop-blur-md transition-all"
                          title="Remove from favorites"
                        >
                          <FaTrashAlt className="h-3.5 w-3.5" />
                        </Button>
                        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-white font-bold border border-white/10">
                          {dest.category || "Spot"}
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-1.5">
                          <h3 className="font-extrabold text-xl leading-snug group-hover:text-rose-400 transition-colors">
                            {dest.title}
                          </h3>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <FaMapMarkerAlt className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                            {dest.location} ({dest.district})
                          </p>
                        </div>

                        <div className="pt-2 border-t border-border flex items-center justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                              Package Price
                            </span>
                            <span className="text-lg font-black text-emerald-400">
                              ৳{dest.price || 0}{" "}
                              <span className="text-xs font-normal text-muted-foreground">/ person</span>
                            </span>
                          </div>

                          <Button
                            size="sm"
                            onClick={() => handleOpenBooking(dest)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-5 font-semibold shadow-md shadow-indigo-600/20"
                          >
                            Book Tour
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Container>
        </main>

        {/* Booking Dialog Modal */}
        <Dialog open={bookingModalOpen} onOpenChange={setBookingModalOpen}>
          <DialogContent className="max-w-md bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">
                Book Tour Package: {selectedDest?.title}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleConfirmBooking} className="space-y-4 pt-2">
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs space-y-1">
                <p className="font-bold text-indigo-400">Destination Details:</p>
                <p>Location: {selectedDest?.location} ({selectedDest?.district})</p>
                <p>Package Price: ৳{selectedDest?.price || 2500} / person</p>
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
      </div>
    </ProtectedRoute>
  );
}
