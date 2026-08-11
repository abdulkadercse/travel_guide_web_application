"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { FaHotel, FaStar, FaMapMarkerAlt } from "react-icons/fa";

const hotelsList = [
  {
    id: "hotel-1",
    name: "Sayeman Beach Resort",
    location: "Kolatoli Beach, Cox's Bazar",
    price: 7500,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
    amenities: ["Ocean View", "Infinity Pool", "Free WiFi", "Breakfast Included"],
  },
  {
    id: "hotel-2",
    name: "Grand Sultan Tea Resort",
    location: "Sreemangal, Sylhet",
    price: 9200,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80",
    amenities: ["Golf Course", "Spa Center", "3 Swimming Pools", "Multi-Cuisine"],
  },
  {
    id: "hotel-3",
    name: "Hotel Nilgiri Hill Resort",
    location: "Bandarban",
    price: 5800,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80",
    amenities: ["Cloud View Balcony", "Hills Trekking", "Restaurant"],
  },
];

export function FeaturedHotels() {
  const user = useAppSelector(selectCurrentUser);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [bookingDates, setBookingDates] = useState({ start: "", end: "" });
  const [bookingLoading, setBookingLoading] = useState(false);

  const handleOpenBooking = (hotel: any) => {
    setSelectedHotel(hotel);
    setBookingModalOpen(true);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in first to confirm hotel stay!");
      return;
    }
    if (!bookingDates.start || !bookingDates.end) {
      toast.error("Please select stay dates");
      return;
    }

    setBookingLoading(true);
    const toastId = toast.loading("Submitting hotel reservation...");

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          hotelId: selectedHotel?.id,
          startDate: bookingDates.start,
          endDate: bookingDates.end,
          totalCost: selectedHotel?.price || 5000,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit reservation");
      }

      toast.success("Hotel reservation request submitted!", { id: toastId });
      setBookingModalOpen(false);
      setBookingDates({ start: "", end: "" });
    } catch (err: any) {
      toast.error(err.message || "Hotel booking failed", { id: toastId });
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <section className="w-full">
      <Container className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
              <FaHotel className="text-indigo-500 h-6 w-6" />
              Featured Hotels & Resorts
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Stay comfortably at top-rated resorts across Bangladesh
            </p>
          </div>
          <Button variant="ghost" className="text-indigo-400 font-semibold" asChild>
            <Link href="/demo">Browse Hotels &rarr;</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hotelsList.map((hotel) => (
            <div
              key={hotel.id}
              className="rounded-3xl overflow-hidden bg-card border border-border shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative h-48 w-full bg-slate-900">
                <Image src={hotel.image} alt={hotel.name} fill className="object-cover" />
                <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-xs text-amber-400 font-bold flex items-center gap-1">
                  <FaStar className="h-3 w-3" />
                  <span>{hotel.rating}</span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-extrabold text-lg leading-snug">{hotel.name}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <FaMapMarkerAlt className="h-3 w-3 text-indigo-500 shrink-0" />
                    {hotel.location}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {hotel.amenities.map((a, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <span className="text-base font-black text-indigo-400">
                    ৳{hotel.price} <span className="text-xs font-normal text-muted-foreground">/ night</span>
                  </span>
                  <Button
                    size="sm"
                    onClick={() => handleOpenBooking(hotel)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full"
                  >
                    Book Stay
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* Hotel Reservation Modal */}
      <Dialog open={bookingModalOpen} onOpenChange={setBookingModalOpen}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Book Stay: {selectedHotel?.name}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleConfirmBooking} className="space-y-4 pt-2">
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs space-y-1">
              <p className="font-bold text-indigo-400">Hotel Details:</p>
              <p>Location: {selectedHotel?.location}</p>
              <p>Nightly Rate: ৳{selectedHotel?.price} / night</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Check-In Date</label>
                <Input
                  type="date"
                  value={bookingDates.start}
                  onChange={(e) => setBookingDates({ ...bookingDates, start: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Check-Out Date</label>
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
                Confirm Reservation
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default FeaturedHotels;
