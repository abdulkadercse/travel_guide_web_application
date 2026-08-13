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
import { useCreateReservationMutation } from "@/redux/features/reservation/reservationApi";
import { FaHotel, FaStar, FaMapMarkerAlt } from "react-icons/fa";

const hotelsList = [
  {
    id: "hotel-1",
    name: "Sayeman Beach Resort",
    location: "Kolatoli Beach, Cox's Bazar",
    price: 7500,
    rating: 4.9,
    image: "/images/coxs-bazar.jpg",
    amenities: ["Ocean View", "Infinity Pool", "Free WiFi", "Breakfast Included"],
  },
  {
    id: "hotel-2",
    name: "Grand Sultan Tea Resort",
    location: "Sreemangal, Sylhet",
    price: 9200,
    rating: 4.9,
    image: "/images/bandarban.jpg",
    amenities: ["Golf Course", "Spa Center", "3 Swimming Pools", "Multi-Cuisine"],
  },
  {
    id: "hotel-3",
    name: "Hotel Nilgiri Hill Resort",
    location: "Bandarban",
    price: 5800,
    rating: 4.8,
    image: "/images/sylhet.jpg",
    amenities: ["Cloud View Balcony", "Hills Trekking", "Restaurant"],
  },
];

export function FeaturedHotels() {
  const user = useAppSelector(selectCurrentUser);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [bookingDates, setBookingDates] = useState({ start: "", end: "" });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [createReservation] = useCreateReservationMutation();

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
      await createReservation({
        hotelId: selectedHotel?.id,
        startDate: bookingDates.start,
        endDate: bookingDates.end,
        totalCost: selectedHotel?.price || 5000,
      }).unwrap();

      toast.success("Hotel reservation request submitted!", { id: toastId });
      setBookingModalOpen(false);
      setBookingDates({ start: "", end: "" });
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message || "Hotel booking failed";
      toast.error(message, { id: toastId });
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <section id="stays" className="section">
      <Container className="space-y-9">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl space-y-4">
            <p className="eyebrow">Where to stay</p>
            <h2 className="heading">Rooms with a view worth waking up to</h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Beachfront resorts, hillside lodges and city hotels, all rated by people who stayed
              there.
            </p>
          </div>

          <Button variant="outline" asChild className="self-start sm:self-auto">
            <Link href="/demo">Browse all stays</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {hotelsList.map((hotel) => (
            <article key={hotel.id} className="surface-interactive group flex flex-col overflow-hidden">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                <Image
                  src={hotel.image}
                  alt={hotel.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/50 via-transparent to-transparent" />

                <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 text-sm font-medium text-white">
                  <FaStar className="h-3.5 w-3.5 text-highlight" />
                  {hotel.rating}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-semibold leading-snug transition-colors group-hover:text-primary">
                  {hotel.name}
                </h3>

                <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <FaMapMarkerAlt className="h-3 w-3 shrink-0" />
                  {hotel.location}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {hotel.amenities.map((a: string) => (
                    <span
                      key={a}
                      className="rounded-md bg-secondary px-2 py-1 text-xs text-muted-foreground"
                    >
                      {a}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex items-end justify-between pt-5">
                  <p>
                    <span className="text-xl font-semibold tracking-tight">
                      ৳{hotel.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground"> / night</span>
                  </p>

                  <Button size="sm" onClick={() => handleOpenBooking(hotel)}>
                    Reserve
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>

      {/* Hotel Reservation Modal */}
      <Dialog open={bookingModalOpen} onOpenChange={setBookingModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request a stay</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleConfirmBooking} className="space-y-5 pt-1">
            <div className="rounded-lg border border-border bg-secondary/50 p-4 text-sm">
              <p className="font-medium">{selectedHotel?.name}</p>
              <p className="mt-0.5 text-muted-foreground">{selectedHotel?.location}</p>
              <p className="mt-2 text-muted-foreground">
                ৳{(selectedHotel?.price || 5000).toLocaleString()} per night
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="hotel-in" className="text-sm text-muted-foreground">
                  Check in
                </label>
                <Input
                  id="hotel-in"
                  type="date"
                  value={bookingDates.start}
                  onChange={(e) => setBookingDates({ ...bookingDates, start: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="hotel-out" className="text-sm text-muted-foreground">
                  Check out
                </label>
                <Input
                  id="hotel-out"
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

export default FeaturedHotels;
