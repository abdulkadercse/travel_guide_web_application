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
  FaCalendarCheck,
  FaRoute,
  FaHeart,
  FaSpinner,
  FaCheckCircle,
  FaUser,
  FaPaperPlane,
} from "react-icons/fa";

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
      <div className="py-24 flex justify-center text-muted-foreground">
        <FaSpinner className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="text-xl font-bold">Destination Not Found</h2>
        <Button variant="outline" className="rounded-full" asChild>
          <Link href="/destinations">Back to Destinations</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-10 font-sans">
      <Container className="space-y-8">
        {/* Navigation Back Link */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" className="rounded-full text-xs font-bold" asChild>
            <Link href="/destinations">
              <FaArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to Destinations
            </Link>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleFavorite}
            className={`rounded-full text-xs font-bold gap-1.5 ${
              isFavorited ? "text-rose-400 border-rose-500/30 bg-rose-500/10" : "text-muted-foreground"
            }`}
          >
            <FaHeart className={`h-3.5 w-3.5 ${isFavorited ? "fill-rose-500 text-rose-500" : ""}`} />
            {isFavorited ? "Saved in Favorites" : "Save Favorite"}
          </Button>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Cover Gallery */}
          <div className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden border border-border bg-slate-900 shadow-lg">
            <Image
              src={destination.coverImage || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"}
              alt={destination.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/20">
                {destination.category}
              </span>
            </div>
          </div>

          {/* Details & Actions */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
                <FaMapMarkerAlt className="h-4 w-4" />
                <span>{destination.location}, {destination.district}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-foreground">
                {destination.title}
              </h1>

              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center gap-1 text-amber-400 text-sm font-black bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  <FaStar className="h-4 w-4 fill-amber-400" />
                  <span>{destination.rating || 4.8}</span>
                </div>
                <span className="text-xs text-muted-foreground font-semibold">
                  Verified Destination Experience
                </span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed bg-card/60 p-4 rounded-2xl border border-border">
              {destination.description}
            </p>

            {/* Price & Action Buttons */}
            <div className="p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/20 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">Package Rate</span>
                  <span className="text-3xl font-black text-emerald-400">৳{(destination.price || 1500).toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground ml-1">/ person</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Button
                  size="lg"
                  onClick={() => setResModalOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-extrabold gap-2 shadow-lg shadow-indigo-600/20"
                >
                  <FaCalendarCheck className="h-4 w-4" /> Reserve Package Now
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setTripPlanModalOpen(true)}
                  className="rounded-2xl font-extrabold gap-2 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10"
                >
                  <FaRoute className="h-4 w-4" /> Add to Trip Plan
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Highlights Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border space-y-4">
          <h2 className="text-xl font-extrabold tracking-tight">Key Destination Highlights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 flex items-center gap-3">
              <FaCheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-bold">Guided Sightseeing</p>
                <p className="text-[11px] text-muted-foreground">Expert local guide available</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 flex items-center gap-3">
              <FaCheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-bold">Scenic Photography</p>
                <p className="text-[11px] text-muted-foreground">Panoramic views & spots</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 flex items-center gap-3">
              <FaCheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-bold">Flexible Booking</p>
                <p className="text-[11px] text-muted-foreground">Instant confirmation</p>
              </div>
            </div>
          </div>
        </div>

        {/* Review & Ratings Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border space-y-6">
          <h2 className="text-xl font-extrabold tracking-tight flex items-center gap-2">
            <FaStar className="text-amber-400 h-5 w-5" /> Traveler Reviews & Feedback
          </h2>

          {/* Submit Review Form */}
          <form onSubmit={handleReviewSubmit} className="space-y-4 p-5 rounded-2xl bg-muted/30 border border-border">
            <h3 className="text-sm font-bold">Leave Your Review</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold">Rating:</span>
              <select
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                className="h-8 rounded-lg border bg-background px-2 text-xs font-bold"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5/5 Exceptional)</option>
                <option value={4}>⭐⭐⭐⭐ (4/5 Great)</option>
                <option value={3}>⭐⭐⭐ (3/5 Average)</option>
                <option value={2}>⭐⭐ (2/5 Poor)</option>
                <option value={1}>⭐ (1/5 Terible)</option>
              </select>
            </div>

            <textarea
              placeholder="Share your travel experience, photos, or tips..."
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
              {submittingReview ? <FaSpinner className="animate-spin" /> : <><FaPaperPlane /> Post Review</>}
            </Button>
          </form>

          {/* Reviews List */}
          {(!destination.reviews || destination.reviews.length === 0) ? (
            <p className="text-xs text-muted-foreground italic">No reviews submitted yet. Be the first to share your experience!</p>
          ) : (
            <div className="space-y-3">
              {destination.reviews.map((rev: any) => (
                <div key={rev.id} className="p-4 rounded-2xl bg-background border border-border/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-bold text-xs">
                        <FaUser />
                      </div>
                      <span className="text-xs font-bold">{rev.user?.name || "Verified Traveler"}</span>
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

        {/* Related Suggestions */}
        {relatedDestinations.length > 0 && (
          <div className="space-y-4 pt-4">
            <h2 className="text-xl font-extrabold tracking-tight">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedDestinations.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/destinations/${rel.id}`}
                  className="group p-4 rounded-3xl bg-card border border-border hover:border-indigo-500/50 transition-all space-y-3"
                >
                  <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-slate-900">
                    <Image src={rel.coverImage} alt={rel.title} fill sizes="300px" className="object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm group-hover:text-indigo-400 transition-colors">{rel.title}</h3>
                    <p className="text-xs text-muted-foreground">{rel.district} &bull; ৳{rel.price?.toLocaleString() || 1500}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
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
