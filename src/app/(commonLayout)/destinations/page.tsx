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
    <div className="py-12 sm:py-16">
      <Container className="space-y-9">
        {/* Page header */}
        <div className="max-w-xl space-y-4">
          <p className="eyebrow">Explore Bangladesh</p>
          <h1 className="heading">Places worth the journey</h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Sea beaches, heritage sites, tea gardens and hill tracks — handpicked and rated by
            travellers.
          </p>
        </div>

        {/* Filters */}
        <div className="surface space-y-4 p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <FaSearch className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search destinations"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={districtFilter} onValueChange={setDistrictFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All districts" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d === "ALL" ? "All districts" : d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c === "ALL" ? "All categories" : c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="POPULAR">Most popular</SelectItem>
                <SelectItem value="RATING">Top rated</SelectItem>
                <SelectItem value="PRICE_LOW">Price: low to high</SelectItem>
                <SelectItem value="PRICE_HIGH">Price: high to low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
            <span className="mr-1 text-sm text-muted-foreground">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`rounded-full border px-3.5 py-1.5 text-sm transition-all ${
                  categoryFilter === cat
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {cat === "ALL" ? "All" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
            <FaSpinner className="h-6 w-6 animate-spin" />
            <p className="text-sm">Loading destinations…</p>
          </div>
        ) : sortedDestinations.length === 0 ? (
          <div className="space-y-4 rounded-2xl border border-dashed border-border py-24 text-center">
            <FaCompass className="mx-auto h-10 w-10 text-muted-foreground/30" />
            <div className="space-y-1.5">
              <h3 className="text-lg font-semibold">No destinations found</h3>
              <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                Nothing matched your search. Try clearing the filters.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setDistrictFilter("ALL");
                setCategoryFilter("ALL");
              }}
            >
              Reset filters
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              {sortedDestinations.length} destination
              {sortedDestinations.length === 1 ? "" : "s"}
            </p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sortedDestinations.map((dest) => (
                <article
                  key={dest.id}
                  className="surface-interactive group flex flex-col overflow-hidden"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                    <Image
                      src={
                        dest.coverImage ||
                        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                      }
                      alt={dest.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:"
                    />

                    {/* Scrim so the badges stay legible on any photo. */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/55 via-transparent to-stone-950/25" />

                    {dest.category && (
                      <span className="chip-glass absolute left-3 top-3 px-2.5 py-1 text-xs font-medium">
                        {dest.category}
                      </span>
                    )}

                    <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 text-sm font-medium text-white">
                      <FaStar className="h-3.5 w-3.5 text-highlight" />
                      {dest.rating || 4.9}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-lg font-semibold leading-snug transition-colors group-hover:text-primary">
                      <Link href={`/destinations/${dest.id}`}>{dest.title}</Link>
                    </h3>

                    <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <FaMapMarkerAlt className="h-3 w-3 shrink-0" />
                      {dest.district}
                    </p>

                    {dest.description && (
                      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {dest.description}
                      </p>
                    )}

                    <div className="mt-auto flex items-end justify-between pt-5">
                      <p>
                        <span className="text-xl font-semibold tracking-tight">
                          ৳{(dest.price || 2500).toLocaleString()}
                        </span>
                        <span className="text-sm text-muted-foreground"> / person</span>
                      </p>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedDest(dest);
                            setResModalOpen(true);
                          }}
                        >
                          Reserve
                        </Button>
                        <Button size="sm" asChild>
                          <Link href={`/destinations/${dest.id}`}>Details</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
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
