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
  FaCalendarCheck,
  FaPhoneAlt,
  FaSpinner,
  FaCheckCircle,
  FaUser,
  FaPaperPlane,
  FaHotel,
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
      <div className="py-24 flex justify-center text-muted-foreground">
        <FaSpinner className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="text-xl font-bold">Hotel Not Found</h2>
        <Button variant="outline" className="rounded-full" asChild>
          <Link href="/hotels">Back to Hotels</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-10 font-sans">
      <Container className="space-y-8">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" className="rounded-full text-xs font-bold" asChild>
            <Link href="/hotels">
              <FaArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to Hotels & Stays
            </Link>
          </Button>
        </div>

        {/* Hero Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden border border-border bg-slate-900 shadow-lg">
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
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
                <FaMapMarkerAlt className="h-4 w-4" />
                <span>{hotel.location}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-foreground">
                {hotel.name}
              </h1>

              <div className="flex items-center gap-4 pt-1">
                <div className="flex items-center gap-1 text-amber-400 text-sm font-black bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  <FaStar className="h-4 w-4 fill-amber-400" />
                  <span>{hotel.rating || 4.9} / 5.0</span>
                </div>

                {hotel.contactPhone && (
                  <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5 bg-muted/40 px-3 py-1 rounded-full">
                    <FaPhoneAlt className="h-3 w-3 text-indigo-400" /> {hotel.contactPhone}
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed bg-card/60 p-4 rounded-2xl border border-border">
              {hotel.description}
            </p>

            {/* Price & Booking CTA */}
            <div className="p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/20 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">Nightly Rate</span>
                  <span className="text-3xl font-black text-emerald-400">৳{(hotel.pricePerNight || 3500).toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground ml-1">/ night</span>
                </div>
              </div>

              <Button
                size="lg"
                onClick={() => setResModalOpen(true)}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-extrabold gap-2 shadow-lg shadow-indigo-600/20"
              >
                <FaCalendarCheck className="h-4 w-4" /> Reserve Room Now
              </Button>
            </div>
          </div>
        </div>

        {/* Amenities Section */}
        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border space-y-4">
            <h2 className="text-xl font-extrabold tracking-tight flex items-center gap-2">
              <FaHotel className="text-indigo-500" /> Hotel Amenities & Facilities
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {hotel.amenities.map((am: string, idx: number) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-muted/30 border border-border/60 flex items-center gap-2.5">
                  <FaCheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-bold text-foreground">{am}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border space-y-6">
          <h2 className="text-xl font-extrabold tracking-tight flex items-center gap-2">
            <FaStar className="text-amber-400 h-5 w-5" /> Guest Reviews
          </h2>

          <form onSubmit={handleReviewSubmit} className="space-y-4 p-5 rounded-2xl bg-muted/30 border border-border">
            <h3 className="text-sm font-bold">Write a Guest Review</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold">Rating:</span>
              <select
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                className="h-8 rounded-lg border bg-background px-2 text-xs font-bold"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5/5 Excellent)</option>
                <option value={4}>⭐⭐⭐⭐ (4/5 Very Good)</option>
                <option value={3}>⭐⭐⭐ (3/5 Average)</option>
              </select>
            </div>

            <textarea
              placeholder="Tell us about your room quality, service, and breakfast experience..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />

            <Button
              type="submit"
              disabled={submittingReview}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-full text-xs gap-1.5"
            >
              {submittingReview ? <FaSpinner className="animate-spin" /> : <><FaPaperPlane /> Submit Review</>}
            </Button>
          </form>

          {(!hotel.reviews || hotel.reviews.length === 0) ? (
            <p className="text-xs text-muted-foreground italic">No guest reviews submitted yet.</p>
          ) : (
            <div className="space-y-3">
              {hotel.reviews.map((rev: any) => (
                <div key={rev.id} className="p-4 rounded-2xl bg-background border border-border/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-bold text-xs">
                        <FaUser />
                      </div>
                      <span className="text-xs font-bold">{rev.user?.name || "Verified Guest"}</span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                      <FaStar className="h-3 w-3 fill-amber-400" />
                      <span>{rev.rating}/5</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed pl-10">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
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
