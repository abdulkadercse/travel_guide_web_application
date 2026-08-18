"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatBdt, formatShortDate } from "@/utils";
import { FaStar, FaMapMarkerAlt, FaSpinner, FaTrashAlt, FaHeart } from "react-icons/fa";

export interface DestinationItem {
  id: string;
  title: string;
  location: string;
  district?: string;
  category?: string;
  description?: string;
  coverImage?: string;
  images?: string[];
  price?: number;
  rating?: number;
}

export interface FavoriteItem {
  id: string;
  userId: string;
  destinationId: string;
  createdAt?: string;
  destination?: DestinationItem;
}

interface FavoritesCardProps {
  favorite: FavoriteItem;
  onRemove: (destinationId: string) => Promise<void> | void;
}

export function FavoritesCard({ favorite, onRemove }: FavoritesCardProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const dest = favorite.destination;

  if (!dest) return null;

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await onRemove(dest.id || favorite.destinationId);
    } finally {
      setIsRemoving(false);
    }
  };

  const imageSrc =
    dest.coverImage ||
    (dest.images && dest.images.length > 0 ? dest.images[0] : null) ||
    "/images/bg-travel.jpg";

  return (
    <article className="surface-interactive group flex flex-col overflow-hidden">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <Image
          src={imageSrc}
          alt={dest.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Scrim so the badges stay legible on any photo. */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/55 via-transparent to-stone-950/25" />

        {dest.category && (
          <span className="chip-glass absolute left-3 top-3 px-2.5 py-1 text-xs font-medium capitalize">
            {dest.category}
          </span>
        )}

        <span className="chip-glass absolute right-3 top-3 flex h-8 w-8 items-center justify-center">
          <FaHeart className="h-3.5 w-3.5 text-rose-400" />
        </span>

        {dest.rating !== undefined && dest.rating > 0 && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 text-sm font-medium text-white">
            <FaStar className="h-3.5 w-3.5 text-highlight" />
            {Number(dest.rating).toFixed(1)}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold leading-snug transition-colors group-hover:text-primary">
          <Link href={`/destinations/${dest.id}`}>{dest.title}</Link>
        </h3>

        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
          <FaMapMarkerAlt className="h-3 w-3 shrink-0" />
          <span className="truncate">
            {dest.location}
            {dest.district && dest.district !== dest.location ? `, ${dest.district}` : ""}
          </span>
        </p>

        {dest.description && (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {dest.description}
          </p>
        )}

        {favorite.createdAt && (
          <p className="mt-3 text-xs text-muted-foreground">
            Saved {formatShortDate(favorite.createdAt)}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <p className="min-w-0">
            {dest.price !== undefined && dest.price > 0 ? (
              <>
                <span className="text-xl font-semibold tracking-tight">
                  {formatBdt(dest.price)}
                </span>
                <span className="text-sm text-muted-foreground"> / person</span>
              </>
            ) : (
              <span className="text-sm text-muted-foreground">Price on request</span>
            )}
          </p>

          <div className="flex shrink-0 gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={handleRemove}
              disabled={isRemoving}
              aria-label={`Remove ${dest.title} from favorites`}
              title="Remove from favorites"
              className="text-muted-foreground hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400"
            >
              {isRemoving ? (
                <FaSpinner className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <FaTrashAlt className="h-3.5 w-3.5" />
              )}
            </Button>
            <Button size="sm" asChild>
              <Link href={`/destinations/${dest.id}`}>Details</Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default FavoritesCard;
