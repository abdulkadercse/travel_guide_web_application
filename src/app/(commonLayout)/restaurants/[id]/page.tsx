"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { ReservationModal } from "@/components/shared/ReservationModal";
import { useGetRestaurantByIdQuery } from "@/redux/features/restaurant/restaurantApi";
import { useCreateReviewMutation } from "@/redux/features/review/reviewApi";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaStar,
  FaSpinner,
  FaUser,
} from "react-icons/fa";

export default function RestaurantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const user = useAppSelector(selectCurrentUser);

  const { data: restResponse, isLoading } = useGetRestaurantByIdQuery(id);
  const [createReview] = useCreateReviewMutation();

  const restaurant = restResponse?.data;

  // Reservation Modal State
  const [resModalOpen, setResModalOpen] = useState(false);

  // Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("Please log in to leave a review");
    if (!reviewComment.trim()) return toast.error("Please enter a review comment");

    setSubmittingReview(true);
    const toastId = toast.loading("Submitting restaurant review...");

    try {
      await createReview({
        restaurantId: id,
        rating: Number(reviewRating),
        comment: reviewComment,
      }).unwrap();

      toast.success("Review submitted successfully!", { id: toastId });
      setReviewComment("");
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message || "Failed to submit review";
      toast.error(msg, { id: toastId });
    } finally {
      setSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-24 text-muted-foreground">
        <FaSpinner className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="space-y-4 py-24 text-center">
        <h2 className="text-xl font-semibold">Restaurant not found</h2>
        <Button variant="outline" asChild>
          <Link href="/restaurants">Back to restaurants</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16">
      <Container className="space-y-12">
        <Button variant="ghost" size="sm" className="-ml-2" asChild>
          <Link href="/restaurants">
            <FaArrowLeft className="mr-2 h-3 w-3" /> All restaurants
          </Link>
        </Button>

        {/* Hero */}
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-muted">
            <Image
              src={
                restaurant.coverImage ||
                "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
              }
              alt={restaurant.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            <span className="chip-glass absolute left-4 top-4 px-2.5 py-1 text-xs font-medium">
              {restaurant.cuisineType || "Seafood"}
            </span>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <FaMapMarkerAlt className="h-3 w-3 shrink-0" />
                {restaurant.location}
              </p>

              <h1 className="heading">{restaurant.name}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="inline-flex items-center gap-1.5">
                  <FaStar className="h-3.5 w-3.5 text-highlight" />
                  <span className="font-medium">{restaurant.rating || 4.7}</span>
                </span>
                <span className="text-muted-foreground">
                  Price range {restaurant.priceRange || "৳৳"}
                </span>
              </div>
            </div>

            <p className="text-base leading-relaxed text-muted-foreground">
              {restaurant.description}
            </p>

            <div className="surface space-y-5 p-5">
              <p>
                <span className="text-3xl font-semibold tracking-tight">
                  ৳{(restaurant.avgPrice || 800).toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground"> / person</span>
              </p>

              <Button className="w-full" onClick={() => setResModalOpen(true)}>
                Reserve a table
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <section className="space-y-5">
          <h2 className="text-xl font-semibold tracking-tight">Diner reviews</h2>

          <form onSubmit={handleReviewSubmit} className="surface space-y-4 p-5">
            <div className="space-y-1.5">
              <label htmlFor="rest-rating" className="text-sm text-muted-foreground">
                Rating
              </label>
              <select
                id="rest-rating"
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value={5}>5 — Delicious</option>
                <option value={4}>4 — Great</option>
                <option value={3}>3 — Average</option>
                <option value={2}>2 — Poor</option>
                <option value={1}>1 — Terrible</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="rest-comment" className="text-sm text-muted-foreground">
                Your meal
              </label>
              <textarea
                id="rest-comment"
                placeholder="Taste, ambiance, service…"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <Button type="submit" size="sm" disabled={submittingReview}>
              {submittingReview ? "Posting…" : "Post review"}
            </Button>
          </form>

          {!restaurant.reviews || restaurant.reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">No diner reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {restaurant.reviews.map((rev: any) => (
                <div key={rev.id} className="surface space-y-3 p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-primary">
                        <FaUser className="h-3 w-3" />
                      </span>
                      <span className="text-sm font-medium">
                        {rev.user?.name || "Verified diner"}
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1.5 text-sm">
                      <FaStar className="h-3.5 w-3.5 text-highlight" />
                      {rev.rating}
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed text-muted-foreground">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </Container>

      {/* Reservation Modal */}
      <ReservationModal
        isOpen={resModalOpen}
        onClose={() => setResModalOpen(false)}
        targetType="RESTAURANT"
        targetId={restaurant.id}
        targetName={restaurant.name}
        pricePerUnit={restaurant.avgPrice || 800}
        location={restaurant.location}
        coverImage={restaurant.coverImage}
      />
    </div>
  );
}
