"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { ReservationModal } from "@/components/shared/ReservationModal";
import { AddToTripPlanModal } from "@/components/shared/AddToTripPlanModal";
import {
  useGetDestinationByIdQuery,
  useGetDestinationsQuery,
} from "@/redux/features/destination/destinationApi";
import { useCreateReviewMutation } from "@/redux/features/review/reviewApi";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaStar,
  FaHeart,
  FaSpinner,
  FaCheckCircle,
  FaUser,
} from "react-icons/fa";

const highlights = [
  { title: "Guided sightseeing", detail: "Expert local guide available" },
  { title: "Scenic photography", detail: "Panoramic views and spots" },
  { title: "Flexible booking", detail: "Instant confirmation" },
];

export default function DestinationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const user = useAppSelector(selectCurrentUser);

  const { data: destResponse, isLoading } = useGetDestinationByIdQuery(id);
  const { data: relatedResponse } = useGetDestinationsQuery(undefined);
  const [createReview] = useCreateReviewMutation();

  const destination = destResponse?.data;
  const relatedDestinations: any[] = (relatedResponse?.data ?? [])
    .filter((d: any) => d.id !== id)
    .slice(0, 3);

  // Modals
  const [resModalOpen, setResModalOpen] = useState(false);
  const [tripPlanModalOpen, setTripPlanModalOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  // Review Form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const handleToggleFavorite = () => {
    setIsFavorited(!isFavorited);
    if (!isFavorited) toast.success("Added to your saved favorites!");
    else toast.success("Removed from favorites");
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("Please log in to leave a review");
    if (!reviewComment.trim()) return toast.error("Please enter a review comment");

    setSubmittingReview(true);
    const toastId = toast.loading("Submitting review...");

    try {
      await createReview({
        destinationId: id,
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

  if (!destination) {
    return (
      <div className="space-y-4 py-24 text-center">
        <h2 className="text-xl font-semibold">Destination not found</h2>
        <Button variant="outline" asChild>
          <Link href="/destinations">Back to destinations</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16">
      <Container className="space-y-12">
        {/* Back / save */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/destinations">
              <FaArrowLeft className="mr-2 h-3 w-3" /> All destinations
            </Link>
          </Button>

          <Button variant="outline" size="sm" onClick={handleToggleFavorite}>
            <FaHeart
              className={`mr-2 h-3 w-3 ${isFavorited ? "fill-rose-500 text-rose-500" : ""}`}
            />
            {isFavorited ? "Saved" : "Save"}
          </Button>
        </div>

        {/* Hero */}
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-muted">
            <Image
              src={
                destination.coverImage ||
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
              }
              alt={destination.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            {destination.category && (
              <span className="chip-glass absolute left-4 top-4 px-2.5 py-1 text-xs font-medium">
                {destination.category}
              </span>
            )}
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <FaMapMarkerAlt className="h-3 w-3 shrink-0" />
                {destination.location}, {destination.district}
              </p>

              <h1 className="heading">{destination.title}</h1>

              <p className="inline-flex items-center gap-1.5 text-sm">
                <FaStar className="h-3.5 w-3.5 text-highlight" />
                <span className="font-medium">{destination.rating || 4.8}</span>
                <span className="text-muted-foreground">· Verified experience</span>
              </p>
            </div>

            <p className="text-base leading-relaxed text-muted-foreground">
              {destination.description}
            </p>

            <div className="surface space-y-5 p-5">
              <p>
                <span className="text-3xl font-semibold tracking-tight">
                  ৳{(destination.price || 1500).toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground"> / person</span>
              </p>

              <div className="flex flex-wrap gap-2">
                <Button onClick={() => setResModalOpen(true)}>Reserve</Button>
                <Button variant="outline" onClick={() => setTripPlanModalOpen(true)}>
                  Add to trip plan
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Highlights */}
        <section className="space-y-5">
          <h2 className="text-xl font-semibold tracking-tight">What&apos;s included</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {highlights.map((h) => (
              <div key={h.title} className="surface flex items-start gap-3 p-5">
                <FaCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-medium">{h.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{h.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section className="space-y-5">
          <h2 className="text-xl font-semibold tracking-tight">Traveller reviews</h2>

          <form onSubmit={handleReviewSubmit} className="surface space-y-4 p-5">
            <div className="space-y-1.5">
              <label htmlFor="dest-rating" className="text-sm text-muted-foreground">
                Rating
              </label>
              <select
                id="dest-rating"
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value={5}>5 — Exceptional</option>
                <option value={4}>4 — Great</option>
                <option value={3}>3 — Average</option>
                <option value={2}>2 — Poor</option>
                <option value={1}>1 — Terrible</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="dest-comment" className="text-sm text-muted-foreground">
                Your experience
              </label>
              <textarea
                id="dest-comment"
                placeholder="What was the trip like?"
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

          {!destination.reviews || destination.reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No reviews yet — be the first to share your experience.
            </p>
          ) : (
            <div className="space-y-4">
              {destination.reviews.map((rev: any) => (
                <div key={rev.id} className="surface space-y-3 p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-primary">
                        <FaUser className="h-3 w-3" />
                      </span>
                      <span className="text-sm font-medium">
                        {rev.user?.name || "Verified traveller"}
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

        {/* Related */}
        {relatedDestinations.length > 0 && (
          <section className="space-y-5">
            <h2 className="text-xl font-semibold tracking-tight">You may also like</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {relatedDestinations.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/destinations/${rel.id}`}
                  className="surface-interactive group flex flex-col overflow-hidden"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                    <Image
                      src={rel.coverImage}
                      alt={rel.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-semibold leading-snug transition-colors group-hover:text-primary">
                      {rel.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      {rel.district} · ৳{rel.price?.toLocaleString() || 1500}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </Container>

      {/* Reservation Modal */}
      <ReservationModal
        isOpen={resModalOpen}
        onClose={() => setResModalOpen(false)}
        targetType="DESTINATION"
        targetId={destination.id}
        targetName={destination.title}
        pricePerUnit={destination.price || 1500}
        location={`${destination.location}, ${destination.district}`}
        coverImage={destination.coverImage}
      />

      {/* Add To Trip Plan Modal */}
      <AddToTripPlanModal
        isOpen={tripPlanModalOpen}
        onClose={() => setTripPlanModalOpen(false)}
        destinationId={destination.id}
        destinationTitle={destination.title}
      />
    </div>
  );
}
