"use client";

import React, { useState, use, useMemo } from "react";
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
import { formatBdt } from "@/utils";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaStar,
  FaPhoneAlt,
  FaSpinner,
  FaCheckCircle,
  FaUser,
  FaWifi,
  FaSwimmingPool,
  FaUtensils,
  FaSpa,
  FaShieldAlt,
  FaClock,
  FaCalendarAlt,
  FaConciergeBell,
  FaChevronRight,
  FaImages,
} from "react-icons/fa";

export default function HotelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const user = useAppSelector(selectCurrentUser);

  const { data: hotelResponse, isLoading } = useGetHotelByIdQuery(id, {
    refetchOnMountOrArgChange: true,
  });
  const [createReview] = useCreateReviewMutation();


  const hotel = hotelResponse?.data;

  // Multi-Image Gallery Active State
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Reservation Modal State
  const [resModalOpen, setResModalOpen] = useState(false);

  // Nights & Guests Calculation for Summary
  const [nights, setNights] = useState(1);
  const [guests, setGuests] = useState(2);

  // Review Form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const galleryImages: string[] = useMemo(() => {
    if (!hotel) return [];
    const list: string[] = [];
    if (Array.isArray(hotel.images) && hotel.images.length > 0) {
      list.push(...hotel.images);
    }
    if (hotel.coverImage && !list.includes(hotel.coverImage)) {
      list.unshift(hotel.coverImage);
    }
    return list.length > 0 ? list : ["/images/bg-travel.jpg"];
  }, [hotel]);

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

  if (!hotel) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-foreground">Hotel Not Found</h2>
        <p className="text-muted-foreground text-sm max-w-sm">
          The hotel or resort you are looking for might have been moved or removed.
        </p>
        <Button variant="outline" asChild className="rounded-xl">
          <Link href="/hotels">Back to All Stays</Link>
        </Button>
      </div>
    );
  }

  const pricePerNight = Number(hotel.pricePerNight) || 3500;
  const estimatedTotal = pricePerNight * nights;

  // Split description into clean paragraphs
  const descriptionParagraphs = (hotel.description || "")
    .split(/\n+/)
    .map((p: string) => p.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Breadcrumb & Top Bar */}
      <div className="border-b border-border/70 bg-card/50">
        <Container className="py-4 flex flex-wrap items-center justify-between gap-4">
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-foreground transition-colors font-medium">
              Home
            </Link>
            <FaChevronRight className="h-2 w-2 opacity-60" />
            <Link href="/hotels" className="hover:text-foreground transition-colors font-medium">
              Hotels & Resorts
            </Link>
            <FaChevronRight className="h-2 w-2 opacity-60" />
            <span className="text-foreground font-semibold truncate max-w-[200px] sm:max-w-xs">
              {hotel.name}
            </span>
          </nav>

          <Button variant="ghost" size="sm" asChild className="rounded-xl text-xs gap-1.5 font-medium">
            <Link href="/hotels">
              <FaArrowLeft className="h-3 w-3" />
              <span>Back to Listings</span>
            </Link>
          </Button>
        </Container>
      </div>

      <Container className="pt-8 space-y-10">
        {/* Hotel Header Section */}
        <div className="space-y-3" data-aos="fade-up">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              Verified Stay
            </span>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <FaStar className="h-4 w-4 text-amber-400 fill-amber-400" />
              <span>{hotel.rating ? Number(hotel.rating).toFixed(1) : "4.9"}</span>
              <span className="text-muted-foreground font-normal">
                ({hotel.reviews?.length || 12} guest reviews)
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            {hotel.name}
          </h1>

          <p className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
            <FaMapMarkerAlt className="h-4 w-4 text-primary shrink-0" />
            <span>{hotel.location}</span>
          </p>
        </div>

        {/* Main Multi-Image Interactive Gallery */}
        <div className="space-y-4" data-aos="fade-up" data-aos-delay="100">
          {/* Main Large Showcase Photo */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-3xl border border-border bg-muted shadow-sm">
            <Image
              src={galleryImages[activeImageIndex] || galleryImages[0]}
              alt={`${hotel.name} Photo ${activeImageIndex + 1}`}
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

          {/* Thumbnail Gallery Strip */}
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

        {/* 2-Column Content Layout: Left Details + Right Sticky Booking Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-start">
          {/* Left Column (8 cols): Overview, Description, Amenities, Policies, Reviews */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-10">
            {/* Quick Highlights Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4" data-aos="fade-up">
              <div className="rounded-2xl border border-border bg-card p-4 text-center space-y-1">
                <FaClock className="h-5 w-5 text-primary mx-auto" />
                <p className="text-xs text-muted-foreground">Check-in</p>
                <p className="text-sm font-bold text-foreground">12:00 PM</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4 text-center space-y-1">
                <FaClock className="h-5 w-5 text-amber-500 mx-auto" />
                <p className="text-xs text-muted-foreground">Check-out</p>
                <p className="text-sm font-bold text-foreground">11:00 AM</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4 text-center space-y-1">
                <FaConciergeBell className="h-5 w-5 text-emerald-500 mx-auto" />
                <p className="text-xs text-muted-foreground">Front Desk</p>
                <p className="text-sm font-bold text-foreground">24/7 Active</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4 text-center space-y-1">
                <FaShieldAlt className="h-5 w-5 text-primary mx-auto" />
                <p className="text-xs text-muted-foreground">Cancellation</p>
                <p className="text-sm font-bold text-foreground">Flexible</p>
              </div>
            </div>

            {/* About & Rich Description from Backend */}
            <section className="space-y-4 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs" data-aos="fade-up">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                About {hotel.name}
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
                {descriptionParagraphs.length > 0 ? (
                  descriptionParagraphs.map((para: string, idx: number) => (
                    <p key={idx}>{para}</p>
                  ))
                ) : (
                  <p>
                    Experience world-class luxury, exceptional room comfort, and picturesque surroundings at {hotel.name}. Perfect for vacations, family trips, and romantic getaways.
                  </p>
                )}
              </div>
            </section>

            {/* Amenities Grid */}
            {hotel.amenities && hotel.amenities.length > 0 && (
              <section className="space-y-5 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs" data-aos="fade-up">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    Featured Amenities & Facilities
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Everything you need for a comfortable, worry-free stay
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
                  {hotel.amenities.map((am: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3.5 rounded-2xl bg-secondary/40 border border-border/80 text-sm font-medium text-foreground"
                    >
                      <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <FaCheckCircle className="h-4 w-4" />
                      </div>
                      <span>{am}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* House Rules & Policies */}
            <section className="space-y-4 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs" data-aos="fade-up">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Stay Policies & Guidelines
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-muted-foreground">
                <div className="space-y-1.5 p-4 rounded-2xl bg-secondary/30 border border-border/60">
                  <p className="font-semibold text-foreground">Identification</p>
                  <p>Valid National ID (NID) or Passport required upon check-in for all adult guests.</p>
                </div>
                <div className="space-y-1.5 p-4 rounded-2xl bg-secondary/30 border border-border/60">
                  <p className="font-semibold text-foreground">Breakfast Service</p>
                  <p>Complimentary breakfast is served daily between 7:30 AM to 10:30 AM at the main dining hall.</p>
                </div>
                <div className="space-y-1.5 p-4 rounded-2xl bg-secondary/30 border border-border/60">
                  <p className="font-semibold text-foreground">Child & Extra Bedding</p>
                  <p>Children under 5 stay free with existing bedding. Extra rollout beds available upon request.</p>
                </div>
                <div className="space-y-1.5 p-4 rounded-2xl bg-secondary/30 border border-border/60">
                  <p className="font-semibold text-foreground">Payment & Security</p>
                  <p>All major credit/debit cards, bKash, and cash accepted. 100% verified booking guarantees.</p>
                </div>
              </div>
            </section>

            {/* Guest Reviews Section */}
            <section className="space-y-6 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs" data-aos="fade-up">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    Guest Reviews & Ratings
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    Authentic feedback from verified travelers who stayed here
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-lg font-bold text-foreground">
                  <FaStar className="h-5 w-5 text-amber-400 fill-amber-400" />
                  <span>{hotel.rating ? Number(hotel.rating).toFixed(1) : "4.9"}</span>
                </div>
              </div>

              {/* Review Submission Form */}
              <form onSubmit={handleReviewSubmit} className="space-y-4 p-5 rounded-2xl bg-secondary/30 border border-border">
                <h3 className="text-sm font-semibold text-foreground">Leave a Review</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="hotel-rating" className="text-xs font-semibold text-muted-foreground">
                      Your Rating
                    </label>
                    <select
                      id="hotel-rating"
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                    >
                      <option value={5}>5 ★ — Exceptional & Luxury</option>
                      <option value={4}>4 ★ — Very Good</option>
                      <option value={3}>3 ★ — Average Stay</option>
                      <option value={2}>2 ★ — Poor Experience</option>
                      <option value={1}>1 ★ — Terrible</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="hotel-comment" className="text-xs font-semibold text-muted-foreground">
                    Your Review Feedback
                  </label>
                  <textarea
                    id="hotel-comment"
                    placeholder="Share your experience about room quality, sea/hill view, staff service, breakfast, and amenities..."
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
              {!hotel.reviews || hotel.reviews.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm space-y-1">
                  <p>No guest reviews yet. Be the first to share your experience!</p>
                </div>
              ) : (
                <div className="space-y-4 divide-y divide-border/60">
                  {hotel.reviews.map((rev: any) => (
                    <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-xs">
                            {rev.user?.name ? rev.user.name[0].toUpperCase() : <FaUser className="h-3 w-3" />}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {rev.user?.name || "Verified Traveler"}
                            </p>
                            <p className="text-xs text-muted-foreground">Stayed recently</p>
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

          {/* Right Column (4 cols): Sticky Reservation & Contact Summary */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-24 space-y-6" data-aos="fade-up" data-aos-delay="200">
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-lg space-y-6">
              <div className="flex items-baseline justify-between border-b border-border/80 pb-5">
                <div>
                  <span className="text-3xl font-bold tracking-tight text-foreground">
                    {formatBdt(pricePerNight)}
                  </span>
                  <span className="text-xs text-muted-foreground"> / night</span>
                </div>
                <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Best Rate Guaranteed
                </span>
              </div>

              {/* Night & Guest Selectors */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5 p-3 rounded-2xl bg-secondary/40 border border-border/70">
                    <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Duration
                    </label>
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setNights(Math.max(1, nights - 1))}
                        className="h-7 w-7 rounded-lg bg-card border border-border font-bold text-xs hover:bg-muted"
                      >
                        -
                      </button>
                      <span className="text-sm font-bold text-foreground">{nights} Night{nights > 1 ? "s" : ""}</span>
                      <button
                        type="button"
                        onClick={() => setNights(nights + 1)}
                        className="h-7 w-7 rounded-lg bg-card border border-border font-bold text-xs hover:bg-muted"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5 p-3 rounded-2xl bg-secondary/40 border border-border/70">
                    <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Guests
                    </label>
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        className="h-7 w-7 rounded-lg bg-card border border-border font-bold text-xs hover:bg-muted"
                      >
                        -
                      </button>
                      <span className="text-sm font-bold text-foreground">{guests} Guest{guests > 1 ? "s" : ""}</span>
                      <button
                        type="button"
                        onClick={() => setGuests(guests + 1)}
                        className="h-7 w-7 rounded-lg bg-card border border-border font-bold text-xs hover:bg-muted"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subtotal Calculation breakdown */}
                <div className="space-y-2 pt-3 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>{formatBdt(pricePerNight)} × {nights} night{nights > 1 ? "s" : ""}</span>
                    <span className="font-semibold text-foreground">{formatBdt(estimatedTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes & Service Fees</span>
                    <span className="font-semibold text-emerald-500">Included</span>
                  </div>
                  <div className="flex justify-between border-t border-border/80 pt-2 text-sm font-bold text-foreground">
                    <span>Total Estimate</span>
                    <span className="text-primary">{formatBdt(estimatedTotal)}</span>
                  </div>
                </div>

                {/* Primary CTA */}
                <Button
                  size="lg"
                  className="w-full h-12 rounded-2xl font-bold text-sm shadow-md cursor-pointer hover:bg-primary/90"
                  onClick={() => setResModalOpen(true)}
                >
                  Reserve Your Stay Now
                </Button>

                {hotel.contactPhone && (
                  <Button
                    variant="outline"
                    asChild
                    className="w-full h-11 rounded-2xl text-xs font-semibold gap-2 border-border"
                  >
                    <a href={`tel:${hotel.contactPhone}`}>
                      <FaPhoneAlt className="h-3 w-3 text-primary" />
                      <span>Call Hotel: {hotel.contactPhone}</span>
                    </a>
                  </Button>
                )}
              </div>

              {/* Trust Badge Guarantee */}
              <div className="space-y-2.5 pt-3 border-t border-border/80 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>Instant confirmation & booking voucher</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>Secure SSL reservation checkouts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Global Reservation Modal */}
      <ReservationModal
        isOpen={resModalOpen}
        onClose={() => setResModalOpen(false)}
        targetType="HOTEL"
        targetId={hotel.id}
        targetName={hotel.name}
        pricePerUnit={pricePerNight}
        location={hotel.location}
        coverImage={galleryImages[0]}
      />
    </div>
  );
}
