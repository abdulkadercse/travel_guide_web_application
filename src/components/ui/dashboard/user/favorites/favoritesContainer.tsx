"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { FavoritesCard, FavoriteItem } from "./favoritesCard";
import { LocationFilter } from "./locationFilter";
import {
  useGetFavoritesQuery,
  useRemoveFavoriteMutation,
} from "@/redux/features/favorite/favoriteApi";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import {
  FaHeart,
  FaArrowRight,
  FaRegHeart,
} from "react-icons/fa6";

export function FavoritesContainer() {
  const user = useAppSelector(selectCurrentUser);

  const { data: favoritesResponse, isLoading, isError } = useGetFavoritesQuery(
    undefined,
    { skip: !user }
  );
  const [removeFavorite] = useRemoveFavoriteMutation();

  const favorites: FavoriteItem[] = useMemo(() => {
    return favoritesResponse?.data ?? [];
  }, [favoritesResponse]);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  // Extract unique districts and categories
  const districts = useMemo(() => {
    const set = new Set<string>();
    favorites.forEach((f) => {
      if (f.destination?.district) set.add(f.destination.district);
    });
    return Array.from(set).sort();
  }, [favorites]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    favorites.forEach((f) => {
      if (f.destination?.category) set.add(f.destination.category);
    });
    return Array.from(set).sort();
  }, [favorites]);

  const hasActiveFilters =
    searchQuery !== "" || selectedDistrict !== "" || selectedCategory !== "" || sortBy !== "recent";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedDistrict("");
    setSelectedCategory("");
    setSortBy("recent");
  };

  const handleRemove = async (destinationId: string) => {
    try {
      await removeFavorite(destinationId).unwrap();
      toast.success("Removed from favorites");
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to remove favorite";
      toast.error(msg);
    }
  };

  // Filter and sort favorites
  const filteredFavorites = useMemo(() => {
    let result = [...favorites];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((f) => {
        const title = f.destination?.title?.toLowerCase() || "";
        const loc = f.destination?.location?.toLowerCase() || "";
        const dist = f.destination?.district?.toLowerCase() || "";
        const desc = f.destination?.description?.toLowerCase() || "";
        return (
          title.includes(q) || loc.includes(q) || dist.includes(q) || desc.includes(q)
        );
      });
    }

    // District filter
    if (selectedDistrict) {
      result = result.filter(
        (f) => f.destination?.district === selectedDistrict
      );
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter(
        (f) => f.destination?.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "name_asc") {
        return (a.destination?.title || "").localeCompare(b.destination?.title || "");
      }
      if (sortBy === "name_desc") {
        return (b.destination?.title || "").localeCompare(a.destination?.title || "");
      }
      if (sortBy === "rating_high") {
        return (Number(b.destination?.rating) || 0) - (Number(a.destination?.rating) || 0);
      }
      if (sortBy === "price_low") {
        return (Number(a.destination?.price) || 0) - (Number(b.destination?.price) || 0);
      }
      if (sortBy === "price_high") {
        return (Number(b.destination?.price) || 0) - (Number(a.destination?.price) || 0);
      }
      // Default: recent (by createdAt or array index)
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    return result;
  }, [favorites, searchQuery, selectedDistrict, selectedCategory, sortBy]);

  return (
    <div className="py-8 sm:py-10 space-y-8">
      <Container className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between border-b border-border/80 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <FaHeart className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              <span>Saved Places</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
              My Favorites
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Your saved destinations, scenic spots, and places you love across Bangladesh.
            </p>
          </div>

          {favorites.length > 0 && (
            <div className="text-xs sm:text-sm font-medium text-muted-foreground">
              Showing{" "}
              <span className="font-bold text-foreground">
                {filteredFavorites.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-foreground">
                {favorites.length}
              </span>{" "}
              favorites
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-border bg-card overflow-hidden shadow-xs"
              >
                <div className="aspect-[16/10] bg-secondary/80" />
                <div className="p-4.5 space-y-3">
                  <div className="h-4 bg-secondary/80 rounded-md w-3/4" />
                  <div className="h-3 bg-secondary/80 rounded-md w-1/2" />
                  <div className="h-3 bg-secondary/80 rounded-md w-full" />
                  <div className="pt-2 flex gap-2">
                    <div className="h-9 bg-secondary/80 rounded-xl flex-1" />
                    <div className="h-9 w-9 bg-secondary/80 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State: No favorites saved yet */}
        {!isLoading && favorites.length === 0 && (
          <div className="rounded-3xl border border-border bg-card p-8 sm:p-12 text-center shadow-xs max-w-2xl mx-auto space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-500">
              <FaRegHeart className="h-8 w-8 text-amber-500" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                No saved favorites yet
              </h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Explore destinations across Bangladesh and click the heart icon to save your favorite spots right here!
              </p>
            </div>
            <div className="pt-2">
              <Button asChild className="rounded-xl px-6">
                <Link href="/#destinations" className="flex items-center gap-2">
                  <span>Explore Destinations</span>
                  <FaArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Filter and Favorites Grid */}
        {!isLoading && favorites.length > 0 && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <LocationFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedDistrict={selectedDistrict}
              onDistrictChange={setSelectedDistrict}
              districts={districts}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              categories={categories}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onReset={handleResetFilters}
              hasActiveFilters={hasActiveFilters}
            />

            {/* Filter returned 0 results */}
            {filteredFavorites.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card p-10 text-center space-y-3">
                <p className="text-base font-semibold text-foreground">
                  No favorites match your search or filter criteria
                </p>
                <p className="text-xs text-muted-foreground">
                  Try adjusting your keywords or clearing the active filters.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="rounded-xl"
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              /* Favorites Grid */
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredFavorites.map((fav) => (
                  <FavoritesCard
                    key={fav.id || fav.destinationId}
                    favorite={fav}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}

export default FavoritesContainer;
