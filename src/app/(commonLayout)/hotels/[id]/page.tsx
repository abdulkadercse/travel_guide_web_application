"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { ReservationModal } from "@/components/shared/ReservationModal";
import { useGetHotelByIdQuery } from "@/redux/features/hotel/hotelApi";
import { useCreateReviewMutation } from "@/redux/features/review/reviewApi";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaStar,
  FaPhoneAlt,
  FaSpinner,
  FaCheckCircle,
  FaUser,
} from "react-icons/fa";

export default function HotelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const user = useAppSelector(selectCurrentUser);

  const { data: hotelResponse, isLoading } = useGetHotelByIdQuery(id);
  const [createReview] = useCreateReviewMutation();

  const hotel = hotelResponse?.data;

  // Reservation Modal State
  const [resModalOpen, setResModalOpen] = useState(false);

  // Review Form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("Please log in to submit a hotel review");
    if (!reviewComment.trim()) return toast.error("Please enter a review comment");

    setSubmittingReview(true);
    const toastId = toast.loading("Submitting hotel review...");

    try {
      await createReview({
        hotelId: id,
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

  if (!hotel) {
    return (
      <div className="space-y-4 py-24 text-center">
        <h2 className="text-xl font-semibold">Hotel not found</h2>
        <Button variant="outline" asChild>
          <Link href="/hotels">Back to hotels</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16">
      <Container className="space-y-12">
        <Button variant="ghost" size="sm" className="-ml-2" asChild>
          <Link href="/hotels">
            <FaArrowLeft className="mr-2 h-3 w-3" /> All stays
          </Link>
        </Button>

        {/* Hero */}
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-muted">
            <Image
              src={hotel.coverImage || "https://images.unsplash.com/photo-1566073771259-6a8506099945"}
              alt={hotel.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <FaMapMarkerAlt className="h-3 w-3 shrink-0" />
                {hotel.location}
              </p>

              <h1 className="heading">{hotel.name}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="inline-flex items-center gap-1.5">
                  <FaStar className="h-3.5 w-3.5 text-highlight" />
                  <span className="font-medium">{hotel.rating || 4.9}</span>
                </span>

                {hotel.contactPhone && (
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <FaPhoneAlt className="h-3 w-3" /> {hotel.contactPhone}
                  </span>
                )}
              </div>
            </div>

            <p className="text-base leading-relaxed text-muted-foreground">{hotel.description}</p>

            <div className="surface space-y-5 p-5">
              <p>
                <span className="text-3xl font-semibold tracking-tight">
                  ৳{(hotel.pricePerNight || 3500).toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground"> / night</span>
              </p>

              <Button className="w-full" onClick={() => setResModalOpen(true)}>
                Reserve a room
              </Button>
            </div>
          </div>
        </div>

        {/* Amenities */}
        {hotel.amenities && hotel.amenities.length > 0 && (
          <section className="space-y-5">
            <h2 className="text-xl font-semibold tracking-tight">Amenities</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {hotel.amenities.map((am: string, idx: number) => (
                <div key={idx} className="surface flex items-center gap-2.5 p-4">
                  <FaCheckCircle className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <span className="text-sm">{am}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Reviews */}
        <section className="space-y-5">
          <h2 className="text-xl font-semibold tracking-tight">Guest reviews</h2>

          <form onSubmit={handleReviewSubmit} className="surface space-y-4 p-5">
            <div className="space-y-1.5">
              <label htmlFor="hotel-rating" className="text-sm text-muted-foreground">
                Rating
              </label>
              <select
                id="hotel-rating"
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value={5}>5 — Excellent</option>
                <option value={4}>4 — Very good</option>
                <option value={3}>3 — Average</option>
                <option value={2}>2 — Poor</option>
                <option value={1}>1 — Terrible</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="hotel-comment" className="text-sm text-muted-foreground">
                Your stay
              </label>
              <textarea
                id="hotel-comment"
                placeholder="Room quality, service, breakfast…"
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

          {!hotel.reviews || hotel.reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">No guest reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {hotel.reviews.map((rev: any) => (
                <div key={rev.id} className="surface space-y-3 p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-primary">
                        <FaUser className="h-3 w-3" />
                      </span>
                      <span className="text-sm font-medium">
                        {rev.user?.name || "Verified guest"}
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
        targetType="HOTEL"
        targetId={hotel.id}
        targetName={hotel.name}
        pricePerUnit={hotel.pricePerNight || 3500}
        location={hotel.location}
        coverImage={hotel.coverImage}
      />
    </div>
  );
}
