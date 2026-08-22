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
import { useGetHotelsQuery } from "@/redux/features/hotel/hotelApi";
import {
  FaHotel,
  FaMapMarkerAlt,
  FaStar,
  FaSearch,
  FaSpinner,
} from "react-icons/fa";

export default function HotelsListingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("RECOMMENDED");

  // Reservation Modal State
  const [resModalOpen, setResModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);

  // Fetch all hotels to dynamically compute available locations from database
  const { data: allHotelsResponse } = useGetHotelsQuery(undefined);
  const allHotelsList: any[] = Array.isArray(allHotelsResponse?.data)
    ? allHotelsResponse.data
    : Array.isArray(allHotelsResponse)
    ? allHotelsResponse
    : [];

  // Dynamically extract distinct locations and cities from database
  const rawLocations = allHotelsList.flatMap((h) => {
    if (!h.location) return [];
    const loc = h.location.trim();
    const parts = loc.split(",").map((p: string) => p.trim());
    return [parts[parts.length - 1], loc];
  });
  const uniqueLocations = Array.from(new Set(rawLocations.filter(Boolean))).sort();
  const locations = ["ALL", ...uniqueLocations];

  const queryParams: Record<string, string> = {};
  if (locationFilter && locationFilter !== "ALL") queryParams.location = locationFilter;
  if (searchTerm && searchTerm.trim()) queryParams.searchTerm = searchTerm.trim();

  const { data: hotelsResponse, isLoading } = useGetHotelsQuery(
    Object.keys(queryParams).length > 0 ? queryParams : undefined
  );

  const rawHotels: any[] = Array.isArray(hotelsResponse?.data)
    ? hotelsResponse.data
    : Array.isArray(hotelsResponse)
    ? hotelsResponse
    : [];

  const sortedHotels = [...rawHotels].sort((a, b) => {
    if (sortBy === "PRICE_LOW") return (a.pricePerNight || 0) - (b.pricePerNight || 0);
    if (sortBy === "PRICE_HIGH") return (b.pricePerNight || 0) - (a.pricePerNight || 0);
    if (sortBy === "RATING") return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  return (
    <div className="min-h-screen">
      {/* 1. Full-Width Hero Section with Luxury Resort Background Image */}
      <section className="relative h-[300px] sm:h-[380px] flex items-center justify-center overflow-hidden border-b border-border" data-aos="fade-up">
        <Image
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80"
          alt="Luxury Stays and Resorts in Bangladesh"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Dark & teal gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/65 to-stone-950/45 backdrop-blur-[0.5px]" />

        <Container className="relative z-10 text-center max-w-3xl space-y-3.5" data-aos="fade-up">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-xs">
            <FaHotel className="text-primary h-3.5 w-3.5" />
            Verified Stays, Resorts & Eco-Lodges
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white drop-shadow-md">
            Rooms With A View Worth Waking Up To
          </h1>
          <p className="text-sm sm:text-base text-white/85 max-w-2xl mx-auto leading-relaxed drop-shadow-xs">
            Oceanfront resorts in Cox&apos;s Bazar, tea estate bungalows in Sylhet, and serene cloud cottages in Bandarban & Sajek.
          </p>
        </Container>
      </section>

      {/* 2. Main Content & Listings */}
      <div className="py-8 sm:py-12">
        <Container className="space-y-8">
          {/* Filters */}
          <div className="surface space-y-4 p-4 sm:p-5 shadow-xs" data-aos="fade-up" data-aos-delay="100">


          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="relative">
              <FaSearch className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search hotels by name or location"
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

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RECOMMENDED">Recommended</SelectItem>
                <SelectItem value="RATING">Highest rated</SelectItem>
                <SelectItem value="PRICE_LOW">Price: low to high</SelectItem>
                <SelectItem value="PRICE_HIGH">Price: high to low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
            <span className="mr-1 text-sm text-muted-foreground">Location:</span>
            {locations.slice(0, 8).map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setLocationFilter(loc)}
                className={`rounded-full border px-3.5 py-1.5 text-sm transition-all ${
                  locationFilter === loc
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {loc === "ALL" ? "All" : loc}
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
        ) : sortedHotels.length === 0 ? (

          <div className="space-y-4 rounded-2xl border border-dashed border-border py-24 text-center">
            <FaHotel className="mx-auto h-10 w-10 text-muted-foreground/30" />
            <div className="space-y-1.5">
              <h3 className="text-lg font-semibold">No hotels found</h3>
              <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                Try a different location or clear the search filters.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setLocationFilter("ALL");
              }}
            >
              Reset filters
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              {sortedHotels.length} stay{sortedHotels.length === 1 ? "" : "s"}
            </p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sortedHotels.map((hotel) => (
                <article
                  key={hotel.id}
                  className="surface-interactive group flex flex-col overflow-hidden"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                    <Image
                      src={
                        hotel.coverImage ||
                        "https://images.unsplash.com/photo-1566073771259-6a8506099945"
                      }
                      alt={hotel.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:"
                    />

                    {/* Scrim so the badges stay legible on any photo. */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/55 via-transparent to-stone-950/25" />

                    <span className="chip-glass absolute left-3 top-3 px-2.5 py-1 text-xs font-medium">
                      Verified stay
                    </span>

                    <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 text-sm font-medium text-white">
                      <FaStar className="h-3.5 w-3.5 text-highlight" />
                      {hotel.rating || 4.8}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-lg font-semibold leading-snug transition-colors group-hover:text-primary">
                      <Link href={`/hotels/${hotel.id}`}>{hotel.name}</Link>
                    </h3>

                    <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <FaMapMarkerAlt className="h-3 w-3 shrink-0" />
                      {hotel.location}
                    </p>

                    {hotel.amenities && hotel.amenities.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {hotel.amenities.slice(0, 3).map((amenity: string, idx: number) => (
                          <span
                            key={idx}
                            className="rounded-md bg-secondary px-2 py-1 text-xs text-muted-foreground"
                          >
                            {amenity}
                          </span>
                        ))}
                        {hotel.amenities.length > 3 && (
                          <span className="px-1 py-1 text-xs text-muted-foreground">
                            +{hotel.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    <div className="mt-auto flex items-end justify-between pt-5">
                      <p>
                        <span className="text-xl font-semibold tracking-tight">
                          ৳{(hotel.pricePerNight || 3500).toLocaleString()}
                        </span>
                        <span className="text-sm text-muted-foreground"> / night</span>
                      </p>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedHotel(hotel);
                            setResModalOpen(true);
                          }}
                        >
                          Book
                        </Button>
                        <Button size="sm" asChild>
                          <Link href={`/hotels/${hotel.id}`}>Details</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {/* Reservation Modal */}
        {selectedHotel && (
          <ReservationModal
            isOpen={resModalOpen}
            onClose={() => {
              setResModalOpen(false);
              setSelectedHotel(null);
            }}
            targetType="HOTEL"
            targetId={selectedHotel.id}
            targetName={selectedHotel.name}
            pricePerUnit={selectedHotel.pricePerNight || 3500}
            location={selectedHotel.location}
            coverImage={selectedHotel.coverImage}
          />
        )}
      </Container>
      </div>
    </div>
  );
}

