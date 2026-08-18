"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FaHeart,
  FaTrashCan,
  FaLocationDot,
  FaStar,
  FaSpinner,
} from "react-icons/fa6";

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

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
      {/* Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-secondary/50">
        <Image
          src={imageSrc}
          alt={dest.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

        {/* Top-Right Favorite Amber Badge */}
        <div className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-rose-500 shadow-md transition-transform hover:scale-110">
          <FaHeart className="h-4 w-4 text-rose-500 fill-rose-500" />
        </div>

        {/* Top-Left Category Badge */}
        {dest.category && (
          <div className="absolute top-3 left-3 rounded-full border border-white/20 bg-black/40 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-md">
            {dest.category}
          </div>
        )}

        {/* Bottom-Left Price or Rating */}
        <div className="absolute bottom-2.5 left-3 flex items-center gap-2">
          {dest.rating !== undefined && dest.rating > 0 && (
            <span className="inline-flex items-center gap-1 rounded-md bg-black/50 px-2 py-0.5 text-xs font-semibold text-amber-300 backdrop-blur-xs">
              <FaStar className="h-3 w-3" />
              <span>{Number(dest.rating).toFixed(1)}</span>
            </span>
          )}
          {dest.price !== undefined && dest.price > 0 && (
            <span className="rounded-md bg-primary/90 px-2 py-0.5 text-xs font-semibold text-primary-foreground backdrop-blur-xs">
              ৳{dest.price.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-4.5 space-y-3">
        <div className="space-y-1.5">
          <h3 className="text-base font-medium tracking-tight text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {dest.title}
          </h3>

          <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground line-clamp-1">
            <FaLocationDot className="h-3 w-3 shrink-0 text-primary" />
            <span>
              {dest.location}
              {dest.district && `, ${dest.district}`}
            </span>
          </p>

          {dest.description && (
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 text-pretty pt-0.5">
              {dest.description}
            </p>
          )}
        </div>

        {/* Action Buttons Footer */}
        <div className="flex items-center gap-2 pt-2 border-t border-border/60">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="flex-1 rounded-xl border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-colors h-9 text-xs font-semibold"
          >
            <Link href={`/destinations/${dest.id}`}>View Details</Link>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleRemove}
            disabled={isRemoving}
            className="h-9 w-9 shrink-0 rounded-xl border-border text-rose-500 hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-600 transition-colors"
            title="Remove from favorites">
            {isRemoving ? (
              <FaSpinner className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <FaTrashCan className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FavoritesCard;
