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
  FaCalendarCheck,
  FaArrowRight,
  FaSlidersH,
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
    <div className="min-h-screen bg-background text-foreground py-10 font-sans">
      <Container className="space-y-8">
        {/* Page Hero Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 inline-flex items-center gap-2">
            <FaHotel className="h-3.5 w-3.5" /> Premium Stays & Resorts
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Book Top Hotels & <span className="text-indigo-500">Luxury Resorts</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Find oceanfront resorts in Cox's Bazar, tea estate bungalows in Sylhet, and mountain eco-lodges in Bandarban.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="p-4 sm:p-6 rounded-3xl bg-card border border-border shadow-md space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search hotels by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 rounded-2xl bg-background/50 text-sm font-medium"
              />
            </div>

            {/* shadcn Location Selector */}
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="h-11 rounded-2xl bg-background/50 border-input text-xs font-semibold">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc === "ALL" ? "All Locations" : loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* shadcn Sort Selector */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-11 rounded-2xl bg-background/50 border-input text-xs font-semibold">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RECOMMENDED">Sort: Recommended</SelectItem>
                <SelectItem value="RATING">Sort: Highest Rating</SelectItem>
                <SelectItem value="PRICE_LOW">Sort: Price (Low &rarr; High)</SelectItem>
                <SelectItem value="PRICE_HIGH">Sort: Price (High &rarr; Low)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quick Dynamic Location Badges */}
          <div className="flex items-center gap-2 pt-2 border-t border-border/50 overflow-x-auto pb-1 text-xs">
            <span className="text-muted-foreground flex items-center gap-1.5 shrink-0 font-bold">
              <FaSlidersH className="h-3 w-3 text-indigo-400" /> Quick Filter:
            </span>
            {locations.slice(0, 8).map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setLocationFilter(loc)}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all text-xs shrink-0 cursor-pointer ${
                  locationFilter === loc
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {loc === "ALL" ? "All" : loc}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center px-1">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Showing <span className="font-bold text-foreground">{sortedHotels.length}</span> luxury properties
          </p>
        </div>

        {/* Hotels Grid */}
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <FaSpinner className="h-8 w-8 animate-spin text-indigo-500" />
            <p className="text-sm font-semibold">Loading hotel properties...</p>
          </div>
        ) : sortedHotels.length === 0 ? (
          <div className="py-24 text-center rounded-3xl border border-dashed border-border bg-card/40 space-y-4">
            <FaHotel className="h-12 w-12 text-muted-foreground/30 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-foreground">No hotels match your search criteria</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Try selecting a different location or clearing search filters.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setLocationFilter("ALL");
              }}
              className="rounded-xl font-bold text-xs"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedHotels.map((hotel) => (
              <div
                key={hotel.id}
                className="group rounded-3xl bg-card border border-border overflow-hidden hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image Cover */}
                  <div className="relative h-56 w-full overflow-hidden bg-slate-900">
                    <Image
                      src={hotel.coverImage || "https://images.unsplash.com/photo-1566073771259-6a8506099945"}
                      alt={hotel.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                      <span className="px-3 py-1 text-[11px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-md text-emerald-300 border border-emerald-500/30 rounded-xl">
                        Verified Stay
                      </span>
                      <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl text-amber-400 font-black text-xs border border-white/10">
                        <FaStar className="h-3 w-3 fill-amber-400" />
                        <span>{hotel.rating || 4.8}</span>
                      </div>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-white">
                      <div>
                        <p className="text-xs text-slate-300 flex items-center gap-1 font-medium">
                          <FaMapMarkerAlt className="text-indigo-400 h-3 w-3" /> {hotel.location}
                        </p>
                        <h3 className="text-base font-extrabold leading-tight mt-0.5 line-clamp-1">
                          {hotel.name}
                        </h3>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Per Night</p>
                        <p className="text-base font-black text-emerald-400">
                          ৳{(hotel.pricePerNight || 3500).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Amenities and Details */}
                  <div className="p-5 space-y-3">
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {hotel.description}
                    </p>

                    {hotel.amenities && hotel.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {hotel.amenities.slice(0, 3).map((amenity: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 text-[10px] font-bold bg-muted/60 text-muted-foreground rounded-lg border border-border/50"
                          >
                            {amenity}
                          </span>
                        ))}
                        {hotel.amenities.length > 3 && (
                          <span className="px-2 py-1 text-[10px] font-bold text-indigo-400">
                            +{hotel.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedHotel(hotel);
                      setResModalOpen(true);
                    }}
                    className="h-10 rounded-2xl font-bold text-xs gap-1.5 hover:bg-indigo-500/10 hover:text-indigo-400 hover:border-indigo-500/40 cursor-pointer"
                  >
                    <FaCalendarCheck className="h-3 w-3 text-indigo-400" /> Book Room
                  </Button>

                  <Button
                    asChild
                    size="sm"
                    className="h-10 rounded-2xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 gap-1.5"
                  >
                    <Link href={`/hotels/${hotel.id}`}>
                      Details <FaArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
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
  );
}
