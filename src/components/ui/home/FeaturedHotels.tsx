"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { ReservationModal } from "@/components/shared/ReservationModal";
import { useGetHotelsQuery } from "@/redux/features/hotel/hotelApi";
import { FaStar, FaMapMarkerAlt, FaSpinner } from "react-icons/fa";

export function FeaturedHotels() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);

  const { data: hotelsResponse, isLoading } = useGetHotelsQuery({});

  const hotelsList: any[] = Array.isArray(hotelsResponse?.data)
    ? hotelsResponse.data
    : Array.isArray(hotelsResponse)
    ? hotelsResponse
    : [];

  const handleOpenBooking = (hotel: any) => {
    setSelectedHotel(hotel);
    setBookingModalOpen(true);
  };

  return (
    <section id="stays" className="section" data-aos="fade-up">
      <Container className="space-y-9">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" data-aos="fade-up">
          <div className="max-w-xl space-y-4">
            <p className="eyebrow">Where to stay</p>
            <h2 className="heading">Rooms with a view worth waking up to</h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Beachfront resorts, hillside lodges and city hotels, all rated by people who stayed
              there.
            </p>
          </div>

          <Button variant="outline" asChild className="self-start sm:self-auto rounded-xl">
            <Link href="/hotels">Browse all stays</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="surface overflow-hidden rounded-2xl animate-pulse bg-card border border-border"
              >
                <div className="aspect-[4/3] w-full bg-muted" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-3/4 bg-muted rounded-md" />
                  <div className="h-3.5 w-1/2 bg-muted rounded-md" />
                  <div className="flex gap-2 pt-1">
                    <div className="h-4 w-12 bg-muted rounded-md" />
                    <div className="h-4 w-12 bg-muted rounded-md" />
                    <div className="h-4 w-12 bg-muted rounded-md" />
                  </div>
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
        ) : hotelsList.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground space-y-3">
            <p className="text-base font-medium">No hotels found at the moment.</p>
            <Button variant="outline" size="sm" asChild>
              <Link href="/hotels">Explore Hotel Listings</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

            {hotelsList.slice(0, 3).map((hotel, idx) => (
              <article
                key={hotel.id}
                data-aos="fade-up"
                data-aos-delay={idx * 150}
                className="surface-interactive group flex flex-col overflow-hidden rounded-2xl"
              >

                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                  <Image
                    src={
                      hotel.coverImage ||
                      hotel.images?.[0] ||
                      "https://images.unsplash.com/photo-1566073771259-6a8506099945"
                    }
                    alt={hotel.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/50 via-transparent to-transparent" />

                  <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 text-sm font-medium text-white">
                    <FaStar className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                    {hotel.rating || 4.9}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-semibold leading-snug transition-colors group-hover:text-primary">
                    <Link href={`/hotels/${hotel.id}`}>{hotel.name}</Link>
                  </h3>

                  <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <FaMapMarkerAlt className="h-3 w-3 shrink-0 text-primary" />
                    {hotel.location}
                  </p>

                  {Array.isArray(hotel.amenities) && hotel.amenities.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {hotel.amenities.slice(0, 3).map((a: string) => (
                        <span
                          key={a}
                          className="rounded-md bg-secondary px-2 py-1 text-xs text-muted-foreground"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto flex items-end justify-between pt-5">
                    <p>
                      <span className="text-xl font-semibold tracking-tight">
                        ৳{(hotel.pricePerNight || hotel.price || 5000).toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground"> / night</span>
                    </p>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenBooking(hotel)}
                        className="rounded-xl cursor-pointer"
                      >
                        Reserve
                      </Button>
                      <Button size="sm" asChild className="rounded-xl">
                        <Link href={`/hotels/${hotel.id}`}>Details</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </Container>

      {/* Unified Shared Reservation Modal */}
      {selectedHotel && (
        <ReservationModal
          isOpen={bookingModalOpen}
          onClose={() => {
            setBookingModalOpen(false);
            setSelectedHotel(null);
          }}
          targetType="HOTEL"
          targetId={selectedHotel.id}
          targetName={selectedHotel.name}
          pricePerUnit={selectedHotel.pricePerNight || selectedHotel.price || 5000}
          location={selectedHotel.location}
          coverImage={selectedHotel.coverImage || selectedHotel.images?.[0]}
        />
      )}
    </section>
  );
}

export default FeaturedHotels;
