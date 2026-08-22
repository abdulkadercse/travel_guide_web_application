"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { StatTile } from "@/components/ui/dashboard";
import { FavoritesCard, FavoriteItem } from "./favoritesCard";
import { LocationFilter } from "./locationFilter";
import { DeleteMessage } from "@/components/shared/DeleteMessage";
import {
  useGetFavoritesQuery,
  useRemoveFavoriteMutation,
} from "@/redux/features/favorite/favoriteApi";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import {
  FaArrowRight,
  FaHeart,
  FaLayerGroup,
  FaLocationDot,
  FaRegHeart,
  FaStar,
  FaTriangleExclamation,
} from "react-icons/fa6";


/** Card-shaped placeholder, so the grid does not jump once the data lands. */
function CardSkeleton() {
  return (
    <div className="surface animate-pulse overflow-hidden">
      <div className="aspect-[4/3] w-full bg-muted" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-3/4 rounded-md bg-muted" />
        <div className="h-3.5 w-1/2 rounded-md bg-muted" />
        <div className="h-3.5 w-full rounded-md bg-muted" />
        <div className="flex items-center justify-between pt-3">
          <div className="h-6 w-24 rounded-md bg-muted" />
          <div className="h-8 w-24 rounded-md bg-muted" />
        </div>
      </div>
    </div>
  );
}

/** The one empty/error shape used by every state below, so they all read alike. */
function EmptyState({
  icon: Icon,
  title,
  hint,
  action,
  tone = "text-muted-foreground",
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  hint: string;
  action?: React.ReactNode;
  tone?: string;
}) {
  return (
    <div className="surface flex flex-col items-center gap-3 px-6 py-14 text-center">
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-muted ${tone}`}
      >
        <Icon className="h-4.5 w-4.5" />
      </span>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">{hint}</p>
      </div>
      {action}
    </div>
  );
}

export function FavoritesContainer() {
  const user = useAppSelector(selectCurrentUser);

  const { data: favoritesResponse, isLoading, isError } = useGetFavoritesQuery(
    undefined,
    { skip: !user }
  );
  const [removeFavorite] = useRemoveFavoriteMutation();

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [favoriteToDelete, setFavoriteToDelete] = useState<FavoriteItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  /** Average of the rated destinations only — unrated ones would drag it to zero. */
  const averageRating = useMemo(() => {
    const rated = favorites
      .map((f) => Number(f.destination?.rating) || 0)
      .filter((r) => r > 0);
    if (rated.length === 0) return null;
    return rated.reduce((sum, r) => sum + r, 0) / rated.length;
  }, [favorites]);

  const hasActiveFilters =
    searchQuery !== "" || selectedDistrict !== "" || selectedCategory !== "" || sortBy !== "recent";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedDistrict("");
    setSelectedCategory("");
    setSortBy("recent");
  };

  const handleRequestDelete = (item: FavoriteItem) => {
    setFavoriteToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!favoriteToDelete) return;
    const destId = favoriteToDelete.destinationId || favoriteToDelete.destination?.id;
    if (!destId) return;

    setIsDeleting(true);
    try {
      await removeFavorite(destId).unwrap();
      toast.success("Removed from saved favorites");
      setDeleteModalOpen(false);
      setFavoriteToDelete(null);
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to remove favorite";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
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
    <div className="space-y-8 font-sans">
      {/* Page header — same shape as the dashboard overview screen. */}
      <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-semibold tracking-tight sm:text-3xl">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-500">
              <FaHeart className="h-4.5 w-4.5" />
            </span>
            Saved favorites
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            The destinations, scenic spots and places you bookmarked across Bangladesh.
          </p>
        </div>

        <Button size="sm" className="gap-2 rounded-full" asChild>
          <Link href="/destinations">
            Explore destinations <FaArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </div>

      {/* Headline numbers */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Saved places"
          value={favorites.length}
          icon={FaHeart}
          tone="text-rose-500"
          hint="Destinations bookmarked for later"
        />
        <StatTile
          label="Districts covered"
          value={districts.length}
          icon={FaLocationDot}
          hint={districts.length > 0 ? districts.slice(0, 3).join(", ") : "Nothing saved yet"}
        />
        <StatTile
          label="Categories"
          value={categories.length}
          icon={FaLayerGroup}
          hint="Beaches, hills, heritage and more"
        />
        <StatTile
          label="Average rating"
          value={averageRating ? averageRating.toFixed(1) : "—"}
          icon={FaStar}
          tone="text-highlight"
          hint="Across the rated places you saved"
        />
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Request failed */}
      {!isLoading && isError && (
        <EmptyState
          icon={FaTriangleExclamation}
          tone="text-rose-500"
          title="We could not load your favorites"
          hint="Something went wrong on our side. Refresh the page and try again in a moment."
        />
      )}

      {/* Nothing saved yet */}
      {!isLoading && !isError && favorites.length === 0 && (
        <EmptyState
          icon={FaRegHeart}
          tone="text-rose-500"
          title="No saved favorites yet"
          hint="Browse destinations across Bangladesh and tap the heart icon to keep the ones you love right here."
          action={
            <Button size="sm" variant="outline" className="rounded-full" asChild>
              <Link href="/destinations">Browse destinations</Link>
            </Button>
          }
        />
      )}

      {/* Filter bar and grid */}
      {!isLoading && !isError && favorites.length > 0 && (
        <section className="space-y-4">
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

          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">{filteredFavorites.length}</span> of{" "}
            <span className="font-medium text-foreground">{favorites.length}</span> saved place
            {favorites.length === 1 ? "" : "s"}
          </p>

          {filteredFavorites.length === 0 ? (
            <EmptyState
              icon={FaRegHeart}
              title="Nothing matches these filters"
              hint="Try different keywords, or clear the filters to see everything you saved."
              action={
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full"
                  onClick={handleResetFilters}
                >
                  Clear all filters
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredFavorites.map((fav) => (
                <FavoritesCard
                  key={fav.id || fav.destinationId}
                  favorite={fav}
                  onRequestDelete={handleRequestDelete}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Delete Confirmation Modal */}
      {favoriteToDelete && (
        <DeleteMessage
          isOpen={deleteModalOpen}
          onClose={() => {
            if (!isDeleting) {
              setDeleteModalOpen(false);
              setFavoriteToDelete(null);
            }
          }}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
          title="Remove from Saved Favorites"
          itemName={favoriteToDelete.destination?.title || "this destination"}
          description="Are you sure you want to remove this place from your saved list?"
          confirmText="Yes, Remove"
          cancelText="Keep"
        >
          {favoriteToDelete.destination && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-border mt-2">
              <div className="relative h-12 w-12 rounded-lg overflow-hidden shrink-0 bg-muted">
                <Image
                  src={
                    favoriteToDelete.destination.coverImage ||
                    favoriteToDelete.destination.images?.[0] ||
                    "/images/bg-travel.jpg"
                  }
                  alt={favoriteToDelete.destination.title}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm truncate text-foreground">
                  {favoriteToDelete.destination.title}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <FaLocationDot className="h-2.5 w-2.5 text-primary shrink-0" />
                  <span className="truncate">
                    {favoriteToDelete.destination.location}
                    {favoriteToDelete.destination.district
                      ? `, ${favoriteToDelete.destination.district}`
                      : ""}
                  </span>
                </p>
              </div>
            </div>
          )}
        </DeleteMessage>
      )}
    </div>
  );
}


export default FavoritesContainer;
