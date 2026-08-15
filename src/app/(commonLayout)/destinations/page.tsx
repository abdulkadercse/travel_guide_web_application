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
import { useGetDestinationsQuery } from "@/redux/features/destination/destinationApi";
import {
  FaCompass,
  FaMapMarkerAlt,
  FaStar,
  FaSearch,
  FaSpinner,
  FaSlidersH,
  FaCalendarCheck,
  FaArrowRight,
} from "react-icons/fa";

export default function DestinationsListingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [districtFilter, setDistrictFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("POPULAR");

  // Reservation Modal State
  const [resModalOpen, setResModalOpen] = useState(false);
  const [selectedDest, setSelectedDest] = useState<any>(null);

  const queryParams: Record<string, string> = {};
  if (districtFilter && districtFilter !== "ALL") queryParams.district = districtFilter;
  if (categoryFilter && categoryFilter !== "ALL") queryParams.category = categoryFilter;
  if (searchTerm && searchTerm.trim()) queryParams.searchTerm = searchTerm.trim();

  const { data: destinationsResponse, isLoading } = useGetDestinationsQuery(
    Object.keys(queryParams).length > 0 ? queryParams : undefined
  );

  const rawDestinations: any[] = Array.isArray(destinationsResponse?.data)
    ? destinationsResponse.data
    : Array.isArray(destinationsResponse)
    ? destinationsResponse
    : [];

  // Dynamic categories and districts extracted from actual DB data
  const dbCategories = Array.from(
    new Set(rawDestinations.map((d) => d.category).filter(Boolean))
  );
  const categories = ["ALL", ...dbCategories];

  const dbDistricts = Array.from(
    new Set(rawDestinations.map((d) => d.district).filter(Boolean))
  );
  const districts = ["ALL", ...dbDistricts];

  // Client-side sorting
  const sortedDestinations = [...rawDestinations].sort((a, b) => {
    if (sortBy === "PRICE_LOW") return (a.price || 0) - (b.price || 0);
    if (sortBy === "PRICE_HIGH") return (b.price || 0) - (a.price || 0);
    if (sortBy === "RATING") return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  return (
    <div className="min-h-screen bg-background text-foreground py-10 font-sans">
      <Container className="space-y-8">
        {/* Page Hero Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 inline-flex items-center gap-2">
            <FaCompass className="h-3.5 w-3.5" /> Explore Bangladesh
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Discover Breathtaking <span className="text-indigo-500">Destinations</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            From the world's longest natural sea beach in Cox's Bazar to the misty peaks of Bandarban and lush tea gardens of Sylhet.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="p-4 sm:p-6 rounded-3xl bg-card border border-border shadow-md space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 rounded-2xl bg-background/50 text-sm font-medium"
              />
            </div>

            {/* shadcn District Selector */}
            <Select value={districtFilter} onValueChange={setDistrictFilter}>
              <SelectTrigger className="h-11 rounded-2xl bg-background/50 border-input text-xs font-semibold">
                <SelectValue placeholder="District: ALL" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d === "ALL" ? "All Districts" : `District: ${d}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* shadcn Category Selector */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-11 rounded-2xl bg-background/50 border-input text-xs font-semibold">
                <SelectValue placeholder="Category: ALL" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c === "ALL" ? "All Categories" : `Category: ${c}`}
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
                <SelectItem value="POPULAR">Sort: Most Popular</SelectItem>
                <SelectItem value="RATING">Sort: Top Rated</SelectItem>
                <SelectItem value="PRICE_LOW">Sort: Price (Low &rarr; High)</SelectItem>
                <SelectItem value="PRICE_HIGH">Sort: Price (High &rarr; Low)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quick Dynamic Category Badges */}
          <div className="flex items-center gap-2 pt-2 border-t border-border/50 overflow-x-auto pb-1 text-xs">
            <span className="text-muted-foreground flex items-center gap-1.5 shrink-0 font-bold">
              <FaSlidersH className="h-3 w-3 text-indigo-400" /> Quick Filter:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all text-xs shrink-0 cursor-pointer ${
                  categoryFilter === cat
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex justify-between items-center px-1">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Showing <span className="font-bold text-foreground">{sortedDestinations.length}</span> destinations in Bangladesh
          </p>
        </div>

        {/* Destinations Grid */}
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <FaSpinner className="h-8 w-8 animate-spin text-indigo-500" />
            <p className="text-sm font-semibold">Loading top destinations...</p>
          </div>
        ) : sortedDestinations.length === 0 ? (
          <div className="py-24 text-center rounded-3xl border border-dashed border-border bg-card/40 space-y-4">
            <FaCompass className="h-12 w-12 text-muted-foreground/30 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-foreground">No destinations found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                No spots matched your current search and filter criteria. Try resetting filters.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setDistrictFilter("ALL");
                setCategoryFilter("ALL");
              }}
              className="rounded-xl font-bold text-xs"
            >
              Reset All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedDestinations.map((dest) => (
              <div
                key={dest.id}
                className="group rounded-3xl bg-card border border-border overflow-hidden hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image Banner */}
                  <div className="relative h-56 w-full overflow-hidden bg-slate-900">
                    <Image
                      src={dest.coverImage || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"}
                      alt={dest.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Category & Rating Badges */}
                    <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                      <span className="px-3 py-1 text-[11px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-md text-indigo-300 border border-indigo-500/30 rounded-xl">
                        {dest.category}
                      </span>
                      <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl text-amber-400 font-black text-xs border border-white/10">
                        <FaStar className="h-3 w-3 fill-amber-400" />
                        <span>{dest.rating || 4.9}</span>
                      </div>
                    </div>

                    {/* Price & Location Bottom Strip */}
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-white">
                      <div>
                        <p className="text-xs text-slate-300 flex items-center gap-1 font-medium">
                          <FaMapMarkerAlt className="text-indigo-400 h-3 w-3" /> {dest.district}
                        </p>
                        <h3 className="text-base font-extrabold leading-tight mt-0.5 line-clamp-1">
                          {dest.title}
                        </h3>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Est. Cost</p>
                        <p className="text-base font-black text-emerald-400">
                          ৳{(dest.price || 2500).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {dest.description}
                    </p>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedDest(dest);
                      setResModalOpen(true);
                    }}
                    className="h-10 rounded-2xl font-bold text-xs gap-1.5 hover:bg-indigo-500/10 hover:text-indigo-400 hover:border-indigo-500/40"
                  >
                    <FaCalendarCheck className="h-3 w-3 text-indigo-400" /> Reserve
                  </Button>

                  <Button
                    asChild
                    size="sm"
                    className="h-10 rounded-2xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 gap-1.5"
                  >
                    <Link href={`/destinations/${dest.id}`}>
                      Details <FaArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Global Reservation Modal */}
        {selectedDest && (
          <ReservationModal
            isOpen={resModalOpen}
            onClose={() => {
              setResModalOpen(false);
              setSelectedDest(null);
            }}
            targetType="DESTINATION"
            targetId={selectedDest.id}
            targetName={selectedDest.title}
            pricePerUnit={selectedDest.price || 2500}
            location={selectedDest.location}
            coverImage={selectedDest.coverImage}
          />
        )}
      </Container>
    </div>
  );
}
