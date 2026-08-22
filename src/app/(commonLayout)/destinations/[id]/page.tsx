"use client";

import React, { useState, use, useMemo } from "react";
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
import { formatBdt } from "@/utils";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaStar,
  FaHeart,
  FaSpinner,
  FaCheckCircle,
  FaUser,
  FaImages,
  FaChevronRight,
  FaCalendarAlt,
  FaShieldAlt,
  FaCompass,
  FaCamera,
  FaRoute,
} from "react-icons/fa";

export default function DestinationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const user = useAppSelector(selectCurrentUser);

  const { data: destResponse, isLoading } = useGetDestinationByIdQuery(id, {
    refetchOnMountOrArgChange: true,
  });
  const { data: relatedResponse } = useGetDestinationsQuery(undefined);
  const [createReview] = useCreateReviewMutation();

  const destination = destResponse?.data;
  const relatedDestinations: any[] = (relatedResponse?.data ?? [])
    .filter((d: any) => d.id !== id)
    .slice(0, 3);

  // Gallery Active State
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Modals
  const [resModalOpen, setResModalOpen] = useState(false);
  const [tripPlanModalOpen, setTripPlanModalOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  // Persons / Tour count
  const [persons, setPersons] = useState(2);

  // Review Form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const galleryImages: string[] = useMemo(() => {
    if (!destination) return [];
    const list: string[] = [];
    if (Array.isArray(destination.images) && destination.images.length > 0) {
      list.push(...destination.images);
    }
    if (destination.coverImage && !list.includes(destination.coverImage)) {
      list.unshift(destination.coverImage);
    }
    return list.length > 0 ? list : ["/images/bg-travel.jpg"];
  }, [destination]);

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
      <div className="min-h-screen py-16">
        <Container className="space-y-8 animate-pulse">
          <div className="h-6 w-32 bg-muted rounded-md" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <div className="aspect-[16/10] w-full bg-muted rounded-3xl" />
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-[4/3] bg-muted rounded-2xl" />
                ))}
              </div>
            </div>
            <div className="lg:col-span-4 h-96 bg-muted rounded-3xl" />
          </div>
        </Container>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-foreground">Destination Not Found</h2>
        <p className="text-muted-foreground text-sm max-w-sm">
          The tourist spot you are looking for might have been moved or removed.
        </p>
        <Button variant="outline" asChild className="rounded-xl">
          <Link href="/destinations">Back to All Destinations</Link>
        </Button>
      </div>
    );
  }

  const pricePerPerson = Number(destination.price) || 1500;
  const estimatedTotal = pricePerPerson * persons;

  const descriptionParagraphs = (destination.description || "")
    .split(/\n+/)
    .map((p: string) => p.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Breadcrumbs */}
      <div className="border-b border-border/70 bg-card/50">
        <Container className="py-4 flex flex-wrap items-center justify-between gap-4">
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-foreground transition-colors font-medium">
              Home
            </Link>
            <FaChevronRight className="h-2 w-2 opacity-60" />
            <Link href="/destinations" className="hover:text-foreground transition-colors font-medium">
              Destinations
            </Link>
            <FaChevronRight className="h-2 w-2 opacity-60" />
            <span className="text-foreground font-semibold truncate max-w-[200px] sm:max-w-xs">
              {destination.title}
            </span>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleToggleFavorite} className="rounded-xl text-xs gap-1.5 font-medium">
              <FaHeart className={`h-3 w-3 ${isFavorited ? "fill-rose-500 text-rose-500" : ""}`} />
              <span>{isFavorited ? "Saved" : "Save Favorite"}</span>
            </Button>
            <Button variant="ghost" size="sm" asChild className="rounded-xl text-xs gap-1.5 font-medium">
              <Link href="/destinations">
                <FaArrowLeft className="h-3 w-3" />
                <span>All Spots</span>
              </Link>
            </Button>
          </div>
        </Container>
      </div>

      <Container className="pt-8 space-y-10">
        {/* Destination Header */}
        <div className="space-y-3" data-aos="fade-up">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              {destination.category || "Tour Package"}
            </span>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <FaStar className="h-4 w-4 text-amber-400 fill-amber-400" />
              <span>{destination.rating ? Number(destination.rating).toFixed(1) : "4.8"}</span>
              <span className="text-muted-foreground font-normal">
                ({destination.reviews?.length || 24} traveler reviews)
              </span>
            </div>
            {destination.isFeatured && (
              <span className="text-xs font-semibold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                ★ Top Featured Spot
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            {destination.title}
          </h1>

          <p className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
            <FaMapMarkerAlt className="h-4 w-4 text-primary shrink-0" />
            <span>{destination.location}, {destination.district}</span>
          </p>
        </div>

        {/* Multi-Image Interactive Gallery */}
        <div className="space-y-4" data-aos="fade-up" data-aos-delay="100">
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-3xl border border-border bg-muted shadow-sm">
            <Image
              src={galleryImages[activeImageIndex] || galleryImages[0]}
              alt={`${destination.title} Photo ${activeImageIndex + 1}`}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="object-cover transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent pointer-events-none" />

            {/* Photo Counter Badge */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-950/75 backdrop-blur-md border border-white/15 text-white text-xs font-semibold shadow-md">
              <FaImages className="h-3.5 w-3.5 text-primary" />
              <span>Photo {activeImageIndex + 1} of {galleryImages.length}</span>
            </div>
          </div>

          {/* Thumbnail Strip */}
          {galleryImages.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 sm:gap-4">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative aspect-[4/3] w-full overflow-hidden rounded-2xl border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? "border-primary ring-2 ring-primary/30 scale-[1.02] shadow-md"
                      : "border-border/80 opacity-75 hover:opacity-100 hover:border-primary/50"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    sizes="20vw"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-start">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-10">
            {/* Quick Highlights Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4" data-aos="fade-up">
              <div className="rounded-2xl border border-border bg-card p-4 text-center space-y-1">
                <FaCompass className="h-5 w-5 text-primary mx-auto" />
                <p className="text-xs text-muted-foreground">Category</p>
                <p className="text-sm font-bold text-foreground">{destination.category}</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4 text-center space-y-1">
                <FaRoute className="h-5 w-5 text-amber-500 mx-auto" />
                <p className="text-xs text-muted-foreground">District</p>
                <p className="text-sm font-bold text-foreground truncate">{destination.district}</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4 text-center space-y-1">
                <FaCamera className="h-5 w-5 text-emerald-500 mx-auto" />
                <p className="text-xs text-muted-foreground">Sightseeing</p>
                <p className="text-sm font-bold text-foreground">Top Rated</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4 text-center space-y-1">
                <FaShieldAlt className="h-5 w-5 text-primary mx-auto" />
                <p className="text-xs text-muted-foreground">Guidance</p>
                <p className="text-sm font-bold text-foreground">Verified Spot</p>
              </div>
            </div>

            {/* About & Narrative Description */}
            <section className="space-y-4 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs" data-aos="fade-up">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                About {destination.title}
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
                {descriptionParagraphs.length > 0 ? (
                  descriptionParagraphs.map((para: string, idx: number) => (
                    <p key={idx}>{para}</p>
                  ))
                ) : (
                  <p>
                    Immerse yourself in breathtaking landscapes, cultural heritage, and natural beauty at {destination.title}.
                  </p>
                )}
              </div>
            </section>

            {/* Travel Tips & What to Expect */}
            <section className="space-y-4 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs" data-aos="fade-up">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Visitor Highlights & Travel Tips
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-muted-foreground">
                <div className="space-y-1.5 p-4 rounded-2xl bg-secondary/30 border border-border/60">
                  <p className="font-semibold text-foreground">Best Season to Visit</p>
                  <p>October through March offers pleasant weather, clear skies, and calm sea tides or scenic hill views.</p>
                </div>
                <div className="space-y-1.5 p-4 rounded-2xl bg-secondary/30 border border-border/60">
                  <p className="font-semibold text-foreground">Photography & Sights</p>
                  <p>Golden hour sunrises and sunsets provide breathtaking panoramic views for landscape photography.</p>
                </div>
                <div className="space-y-1.5 p-4 rounded-2xl bg-secondary/30 border border-border/60">
                  <p className="font-semibold text-foreground">Local Transportation</p>
                  <p>Local CNG auto-rickshaws, Chander Gari 4x4s, and rental tourist vehicles available near entry points.</p>
                </div>
                <div className="space-y-1.5 p-4 rounded-2xl bg-secondary/30 border border-border/60">
                  <p className="font-semibold text-foreground">Eco Guidelines</p>
                  <p>Please keep the surrounding natural environment clean and avoid plastic littering on trails and beaches.</p>
                </div>
              </div>
            </section>

            {/* Traveler Reviews Section */}
            <section className="space-y-6 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs" data-aos="fade-up">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    Traveler Reviews & Experiences
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    Real feedback from travelers who explored this destination
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-lg font-bold text-foreground">
                  <FaStar className="h-5 w-5 text-amber-400 fill-amber-400" />
                  <span>{destination.rating ? Number(destination.rating).toFixed(1) : "4.8"}</span>
                </div>
              </div>

              {/* Review Submission Form */}
              <form onSubmit={handleReviewSubmit} className="space-y-4 p-5 rounded-2xl bg-secondary/30 border border-border">
                <h3 className="text-sm font-semibold text-foreground">Share Your Experience</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="dest-rating" className="text-xs font-semibold text-muted-foreground">
                      Your Rating
                    </label>
                    <select
                      id="dest-rating"
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                    >
                      <option value={5}>5 ★ — Outstanding Experience</option>
                      <option value={4}>4 ★ — Very Good Trip</option>
                      <option value={3}>3 ★ — Average</option>
                      <option value={2}>2 ★ — Not Satisfied</option>
                      <option value={1}>1 ★ — Poor</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="dest-comment" className="text-xs font-semibold text-muted-foreground">
                    Your Review Feedback
                  </label>
                  <textarea
                    id="dest-comment"
                    placeholder="Share helpful tips about views, local spots, travel route, photography, and overall experience..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-border bg-background p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-y"
                    required
                  />
                </div>

                <Button type="submit" size="sm" disabled={submittingReview} className="rounded-xl text-xs font-semibold">
                  {submittingReview ? "Submitting..." : "Post Verified Review"}
                </Button>
              </form>

              {/* Reviews List */}
              {!destination.reviews || destination.reviews.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm space-y-1">
                  <p>No traveler reviews yet. Be the first to share your experience!</p>
                </div>
              ) : (
                <div className="space-y-4 divide-y divide-border/60">
                  {destination.reviews.map((rev: any) => (
                    <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-xs">
                            {rev.user?.name ? rev.user.name[0].toUpperCase() : <FaUser className="h-3 w-3" />}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {rev.user?.name || "Travel Explorer"}
                            </p>
                            <p className="text-xs text-muted-foreground">Visited recently</p>
                          </div>
                        </div>

                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                          <FaStar className="h-3 w-3 fill-amber-400" />
                          {rev.rating || 5}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground pl-11">
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right Column (4 cols): Sticky Tour Booking & Trip Planner Box */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-24 space-y-6" data-aos="fade-up" data-aos-delay="200">
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-lg space-y-6">
              <div className="flex items-baseline justify-between border-b border-border/80 pb-5">
                <div>
                  <span className="text-3xl font-bold tracking-tight text-foreground">
                    {formatBdt(pricePerPerson)}
                  </span>
                  <span className="text-xs text-muted-foreground"> / person</span>
                </div>
                <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Instant Confirmation
                </span>
              </div>

              {/* Persons Counter */}
              <div className="space-y-4">
                <div className="space-y-1.5 p-3 rounded-2xl bg-secondary/40 border border-border/70">
                  <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Number of Travelers
                  </label>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setPersons(Math.max(1, persons - 1))}
                      className="h-7 w-7 rounded-lg bg-card border border-border font-bold text-xs hover:bg-muted"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold text-foreground">{persons} Person{persons > 1 ? "s" : ""}</span>
                    <button
                      type="button"
                      onClick={() => setPersons(persons + 1)}
                      className="h-7 w-7 rounded-lg bg-card border border-border font-bold text-xs hover:bg-muted"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Subtotal Calculation breakdown */}
                <div className="space-y-2 pt-2 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>{formatBdt(pricePerPerson)} × {persons} person{persons > 1 ? "s" : ""}</span>
                    <span className="font-semibold text-foreground">{formatBdt(estimatedTotal)}</span>
                  </div>
                  <div className="flex justify-between border-t border-border/80 pt-2 text-sm font-bold text-foreground">
                    <span>Total Estimated Tour Cost</span>
                    <span className="text-primary">{formatBdt(estimatedTotal)}</span>
                  </div>
                </div>

                {/* Primary CTA Buttons */}
                <Button
                  size="lg"
                  className="w-full h-12 rounded-2xl font-bold text-sm shadow-md cursor-pointer hover:bg-primary/90"
                  onClick={() => setResModalOpen(true)}
                >
                  Book Tour Package
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-11 rounded-2xl text-xs font-semibold gap-2 border-border cursor-pointer hover:bg-secondary"
                  onClick={() => setTripPlanModalOpen(true)}
                >
                  <FaCalendarAlt className="h-3 w-3 text-primary" />
                  <span>Add to Custom Trip Plan</span>
                </Button>
              </div>

              {/* Trust Badge Guarantee */}
              <div className="space-y-2.5 pt-3 border-t border-border/80 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>Verified local guides & tour spot entry passes</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>100% Secure reservation voucher</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Reservation & Trip Plan Modals */}
      <ReservationModal
        isOpen={resModalOpen}
        onClose={() => setResModalOpen(false)}
        targetType="DESTINATION"
        targetId={destination.id}
        targetName={destination.title}
        pricePerUnit={pricePerPerson}
        location={`${destination.location}, ${destination.district}`}
        coverImage={galleryImages[0]}
      />

      <AddToTripPlanModal
        isOpen={tripPlanModalOpen}
        onClose={() => setTripPlanModalOpen(false)}
        destinationId={destination.id}
        destinationTitle={destination.title}
      />
    </div>
  );
}
