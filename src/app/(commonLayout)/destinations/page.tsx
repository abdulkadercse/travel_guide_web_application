"use client";

import React, { useState, Suspense } from "react";
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
import { useSearchParams } from "next/navigation";
import { ReservationModal } from "@/components/shared/ReservationModal";
import { useGetDestinationsQuery } from "@/redux/features/destination/destinationApi";
import {
  FaCompass,
  FaMapMarkerAlt,
  FaStar,
  FaSearch,
  FaSpinner,
} from "react-icons/fa";

function DestinationsContent() {

  const searchParams = useSearchParams();
  const initialSearch = searchParams?.get("searchTerm") || "";
  const initialCategory = searchParams?.get("category") || "ALL";

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [districtFilter, setDistrictFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("POPULAR");

  // Sync state if URL searchParams change
  React.useEffect(() => {
    if (searchParams) {
      const q = searchParams.get("searchTerm");
      const cat = searchParams.get("category");
      if (q !== null && q !== undefined) setSearchTerm(q);
      if (cat) setCategoryFilter(cat.toUpperCase());
    }
  }, [searchParams]);

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
    <div className="min-h-screen">
      {/* 1. Full-Width Hero Section with Background Image */}
      <section className="relative h-[300px] sm:h-[380px] flex items-center justify-center overflow-hidden border-b border-border" data-aos="fade-up">
        <Image
          src="/images/bg-travel.jpg"
          alt="Explore Bangladesh Destinations"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/65 to-stone-950/45 backdrop-blur-[0.5px]" />

        <Container className="relative z-10 text-center max-w-3xl space-y-3.5" data-aos="fade-up">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-xs">
            <FaCompass className="text-primary h-3.5 w-3.5" />
            Discover 64 Districts of Bangladesh
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white drop-shadow-md">
            Places Worth The Journey
          </h1>
          <p className="text-sm sm:text-base text-white/85 max-w-2xl mx-auto leading-relaxed drop-shadow-xs">
            Sea beaches, archaeological heritage sites, rolling tea gardens and misty hill tracks — handpicked, verified and rated by travellers.
          </p>
        </Container>
      </section>

      {/* 2. Main Content & Listings */}
      <div className="py-8 sm:py-12">
        <Container className="space-y-8">
          {/* Filters */}
          <div className="surface space-y-4 p-4 sm:p-5 shadow-xs" data-aos="fade-up" data-aos-delay="100">

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
                  <div className="h-3.5 w-full bg-muted rounded-md" />
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
    </div>
  );
}

export default function DestinationsListingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-24 text-muted-foreground">
          <FaSpinner className="h-6 w-6 animate-spin text-primary" />
        </div>
      }
    >
      <DestinationsContent />
    </Suspense>
  );
}

