"use client";

import React, { useState, use, useMemo } from "react";
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
  FaPhoneAlt,
  FaSpinner,
  FaCheckCircle,
  FaUser,
  FaUtensils,
  FaClock,
  FaUsers,
  FaShieldAlt,
  FaChevronRight,
  FaImages,
  FaCalendarCheck,
  FaFire,
} from "react-icons/fa";


export default function RestaurantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const user = useAppSelector(selectCurrentUser);

  const { data: restResponse, isLoading } = useGetRestaurantByIdQuery(id, {
    refetchOnMountOrArgChange: true,
  });
  const [createReview] = useCreateReviewMutation();

  const restaurant = restResponse?.data;

  // Gallery Active State
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Reservation Modal State
  const [resModalOpen, setResModalOpen] = useState(false);

  // Reservation Guest count & Meal Type
  const [guests, setGuests] = useState(2);
  const [mealTime, setMealTime] = useState("Dinner");

  // Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const galleryImages: string[] = useMemo(() => {
    if (!restaurant) return [];
    const list: string[] = [];
    if (Array.isArray(restaurant.images) && restaurant.images.length > 0) {
      list.push(...restaurant.images);
    }
    if (restaurant.coverImage && !list.includes(restaurant.coverImage)) {
      list.unshift(restaurant.coverImage);
    }
    return list.length > 0 ? list : ["/images/bg-travel.jpg"];
  }, [restaurant]);

  // Dynamic Signature Food Menu & Packages based on restaurant name/cuisine
  const foodMenu = useMemo(() => {
    if (!restaurant) return [];
    const name = (restaurant.name || "").toLowerCase();
    const cuisine = (restaurant.cuisineType || "").toLowerCase();

    if (name.includes("seafood") || name.includes("jhao") || cuisine.includes("seafood")) {
      return [
        {
          category: "Chef's Signature Catches",
          items: [
            { name: "Sizzling Rupchanda Fish Fry", price: "৳650", desc: "Whole silver pomfret marinated in coastal spices & pan-seared to crispy perfection." },
            { name: "Butter Garlic Coral Fish Platter", price: "৳580", desc: "Fresh tender coral fish steak drenched in rich garlic herb butter sauce." },
            { name: "Spicy King Crab Masala", price: "৳780", desc: "Succulent sea crab cooked in a fiery red onion, chili & mustard gravy." },
            { name: "Jumbo Bay Prawn Malai Curry", price: "৳850", desc: "Large deep-sea prawns gently simmered in creamy coconut milk." },
          ]
        },
        {
          category: "Traditional Coastal Vorta & Thalis",
          items: [
            { name: "10-Item Coastal Dry Fish (Shutki) Thali", price: "৳240", desc: "Chepa, Loitta, Chhuri, Chingri, Begun, and Tomato vorta assortment." },
            { name: "Steamed Fragrant Rice & Bengali Daal", price: "৳120", desc: "Unlimited hot steamed rice served with thick yellow lentil curry." },
            { name: "Crab Corn Soup & Fried Calamari", price: "৳340", desc: "Appetizer soup packed with shredded crab meat and crispy squid rings." },
          ]
        }
      ];
    } else if (name.includes("panshi") || name.includes("pach") || cuisine.includes("sylheti")) {
      return [
        {
          category: "Sylheti Specialties",
          items: [
            { name: "Traditional Akhni Biryani", price: "৳280", desc: "Aromatic small-grain rice cooked with tender spiced beef/mutton & secret Sylheti garam masala." },
            { name: "Spicy Duck Bhuna (Haash Bhuna)", price: "৳350", desc: "Country duck slow-cooked with whole roasted garlic cloves and black pepper." },
            { name: "Surma River Boal Fish Curry", price: "৳320", desc: "Fresh sweet-water Boal fish steak simmered in rich onion and tomato gravy." },
            { name: "Deshi Country Chicken Korma", price: "৳260", desc: "Tender free-range chicken prepared in a mild cashew and yogurt sauce." },
          ]
        },
        {
          category: "Famous 30+ Vorta Platter",
          items: [
            { name: "Special 12-Vorta Sampler", price: "৳160", desc: "Includes Mustard Ilish, Prawn, Eggplant, Mustard Leaf, and Black Cumin (Kalojeera) vortas." },
            { name: "Thick Masoor Daal with Shatkora", price: "৳110", desc: "Traditional lentil infused with the signature bitter-sweet citrus aroma of Sylhet." },
            { name: "Sweet Curd (Misti Doi) & Firni", price: "৳90", desc: "Creamy traditional clay-pot baked sweet yogurt dessert." },
          ]
        }
      ];
    } else {
      // Star Kabab / Handi / Biryani / Kebabs
      return [
        {
          category: "Mughlai & Biryani Specialties",
          items: [
            { name: "Special Mutton Kacchi Biryani", price: "৳340", desc: "Layers of premium fragrant basmati rice with fall-off-the-bone tender mutton and spiced potato." },
            { name: "Famous Mutton Chaap", price: "৳190", desc: "Slow-roasted marinated mutton ribs flattened and pan-fried with authentic Old Dhaka spices." },
            { name: "Chicken Reshmi / Boti Kebab", price: "৳220", desc: "Boneless chicken chunks marinated in cream, cheese, and grilled over red-hot charcoal." },
            { name: "Crispy Mutton Tikia & Kabab", price: "৳45", desc: "Crisp outside, melt-in-mouth spiced minced mutton patty." },
          ]
        },
        {
          category: "Bread, Drinks & Desserts",
          items: [
            { name: "Special Shahi Borhani", price: "৳75", desc: "Traditional spiced probiotic yogurt drink infused with mint, mustard, and roasted cumin." },
            { name: "Garlic Butter Naan / Rumali Roti", price: "৳60", desc: "Freshly baked clay oven naan brushed with minced garlic and melted ghee." },
            { name: "Royal Shahi Faluda & Kulfi", price: "৳130", desc: "Chilled vermicelli dessert topped with mixed fruits, sweet jelly, and ice cream." },
          ]
        }
      ];
    }
  }, [restaurant]);

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

  if (!restaurant) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-foreground">Restaurant Not Found</h2>
        <p className="text-muted-foreground text-sm max-w-sm">
          The restaurant or dining spot you are looking for might have been moved or removed.
        </p>
        <Button variant="outline" asChild className="rounded-xl">
          <Link href="/restaurants">Back to Dining Listings</Link>
        </Button>
      </div>
    );
  }

  // Parse estimated unit price
  const extractPrice = (range?: string) => {
    if (!range) return 600;
    const match = range.match(/\d[\d,]*/);
    if (match) {
      const num = parseInt(match[0].replace(/,/g, ""), 10);
      return Number.isNaN(num) || num <= 0 ? 600 : num;
    }
    return 600;
  };

  const avgCostPerPerson = extractPrice(restaurant.priceRange);

  // Split description into clean paragraphs
  const descriptionParagraphs = (restaurant.description || "")
    .split(/\n+/)
    .map((p: string) => p.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Breadcrumb Header */}
      <div className="border-b border-border/70 bg-card/50">
        <Container className="py-4 flex flex-wrap items-center justify-between gap-4">
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-foreground transition-colors font-medium">
              Home
            </Link>
            <FaChevronRight className="h-2 w-2 opacity-60" />
            <Link href="/restaurants" className="hover:text-foreground transition-colors font-medium">
              Dining & Restaurants
            </Link>
            <FaChevronRight className="h-2 w-2 opacity-60" />
            <span className="text-foreground font-semibold truncate max-w-[200px] sm:max-w-xs">
              {restaurant.name}
            </span>
          </nav>

          <Button variant="ghost" size="sm" asChild className="rounded-xl text-xs gap-1.5 font-medium">
            <Link href="/restaurants">
              <FaArrowLeft className="h-3 w-3" />
              <span>Back to Dining</span>
            </Link>
          </Button>
        </Container>
      </div>

      <Container className="pt-8 space-y-10">
        {/* Restaurant Header Section */}
        <div className="space-y-3" data-aos="fade-up">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              {restaurant.cuisineType || "Authentic Cuisine"}
            </span>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <FaStar className="h-4 w-4 text-amber-400 fill-amber-400" />
              <span>{restaurant.rating ? Number(restaurant.rating).toFixed(1) : "4.8"}</span>
              <span className="text-muted-foreground font-normal">
                ({restaurant.reviews?.length || 18} food reviews)
              </span>
            </div>
            <span className="text-xs text-muted-foreground px-2.5 py-0.5 rounded-full bg-secondary border border-border">
              {restaurant.priceRange || "৳৳ - ৳৳৳"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            {restaurant.name}
          </h1>

          <p className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
            <FaMapMarkerAlt className="h-4 w-4 text-primary shrink-0" />
            <span>{restaurant.location}</span>
          </p>
        </div>

        {/* Multi-Image Interactive Gallery */}
        <div className="space-y-4" data-aos="fade-up" data-aos-delay="100">
          {/* Main Large Showcase Photo */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-3xl border border-border bg-muted shadow-sm">
            <Image
              src={galleryImages[activeImageIndex] || galleryImages[0]}
              alt={`${restaurant.name} Photo ${activeImageIndex + 1}`}
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

        {/* 2-Column Content Layout: Left Food Menu & Details + Right Sticky Reservation Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-start">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-10">
            {/* Quick Highlights Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4" data-aos="fade-up">
              <div className="rounded-2xl border border-border bg-card p-4 text-center space-y-1">
                <FaClock className="h-5 w-5 text-primary mx-auto" />
                <p className="text-xs text-muted-foreground">Hours</p>
                <p className="text-sm font-bold text-foreground">7 AM - 12 AM</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4 text-center space-y-1">
                <FaUsers className="h-5 w-5 text-amber-500 mx-auto" />
                <p className="text-xs text-muted-foreground">Seating</p>
                <p className="text-sm font-bold text-foreground">AC Family Hall</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4 text-center space-y-1">
                <FaUtensils className="h-5 w-5 text-emerald-500 mx-auto" />
                <p className="text-xs text-muted-foreground">Service</p>
                <p className="text-sm font-bold text-foreground">Dine-in & Takeaway</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4 text-center space-y-1">
                <FaShieldAlt className="h-5 w-5 text-primary mx-auto" />
                <p className="text-xs text-muted-foreground">Hygiene</p>
                <p className="text-sm font-bold text-foreground">100% Certified</p>
              </div>
            </div>

            {/* About & Rich Description from Backend */}
            <section className="space-y-4 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs" data-aos="fade-up">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                About {restaurant.name}
              </h2>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
                {descriptionParagraphs.length > 0 ? (
                  descriptionParagraphs.map((para: string, idx: number) => (
                    <p key={idx}>{para}</p>
                  ))
                ) : (
                  <p>
                    Experience authentic culinary mastery, fresh farm & coastal ingredients, and heartwarming Bangladeshi dining at {restaurant.name}.
                  </p>
                )}
              </div>
            </section>

            {/* Food Menu & Packages Catalog */}
            <section className="space-y-6 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs" data-aos="fade-up">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <FaUtensils className="text-primary h-5 w-5" /> Signature Dishes & Menu
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    Popular food items and gourmet specialties prepared daily
                  </p>
                </div>
                <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                  Freshly Prepared
                </span>
              </div>

              <div className="space-y-8">
                {foodMenu.map((group) => (
                  <div key={group.category} className="space-y-3.5">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2 border-b border-border/70 pb-2">
                      <FaFire className="text-amber-500 h-3.5 w-3.5" />
                      {group.category}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {group.items.map((dish) => (
                        <div
                          key={dish.name}
                          className="flex flex-col justify-between p-4 rounded-2xl bg-secondary/40 border border-border/70 hover:border-primary/40 hover:bg-secondary/60 transition-all space-y-2"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <h4 className="text-sm font-bold text-foreground leading-snug">
                              {dish.name}
                            </h4>
                            <span className="text-sm font-bold text-primary shrink-0">
                              {dish.price}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                            {dish.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Diner Reviews Section */}
            <section className="space-y-6 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs" data-aos="fade-up">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    Diner Reviews & Ratings
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    Authentic feedback from food lovers who dined here
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-lg font-bold text-foreground">
                  <FaStar className="h-5 w-5 text-amber-400 fill-amber-400" />
                  <span>{restaurant.rating ? Number(restaurant.rating).toFixed(1) : "4.8"}</span>
                </div>
              </div>

              {/* Review Submission Form */}
              <form onSubmit={handleReviewSubmit} className="space-y-4 p-5 rounded-2xl bg-secondary/30 border border-border">
                <h3 className="text-sm font-semibold text-foreground">Rate & Review This Spot</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="rest-rating" className="text-xs font-semibold text-muted-foreground">
                      Your Rating
                    </label>
                    <select
                      id="rest-rating"
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                    >
                      <option value={5}>5 ★ — Outstanding Taste & Service</option>
                      <option value={4}>4 ★ — Very Good</option>
                      <option value={3}>3 ★ — Average Meal</option>
                      <option value={2}>2 ★ — Poor Experience</option>
                      <option value={1}>1 ★ — Terrible</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="rest-comment" className="text-xs font-semibold text-muted-foreground">
                    Your Review Feedback
                  </label>
                  <textarea
                    id="rest-comment"
                    placeholder="Share your experience about food quality, taste, flavor, service, and ambiance..."
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
              {!restaurant.reviews || restaurant.reviews.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm space-y-1">
                  <p>No diner reviews yet. Be the first to share your experience!</p>
                </div>
              ) : (
                <div className="space-y-4 divide-y divide-border/60">
                  {restaurant.reviews.map((rev: any) => (
                    <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-xs">
                            {rev.user?.name ? rev.user.name[0].toUpperCase() : <FaUser className="h-3 w-3" />}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {rev.user?.name || "Verified Foodie"}
                            </p>
                            <p className="text-xs text-muted-foreground">Dined recently</p>
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

          {/* Right Column (4 cols): Sticky Table Reservation Card */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-24 space-y-6" data-aos="fade-up" data-aos-delay="200">
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-lg space-y-6">
              <div className="flex items-baseline justify-between border-b border-border/80 pb-5">
                <div>
                  <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    {restaurant.priceRange || "৳400 - ৳1,600"}
                  </span>
                  <span className="text-xs text-muted-foreground block mt-0.5">Average per person</span>
                </div>
                <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Instant Table Booking
                </span>
              </div>

              {/* Guest & Meal Selectors */}
              <div className="space-y-4">
                <div className="space-y-1.5 p-3 rounded-2xl bg-secondary/40 border border-border/70">
                  <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Number of Guests
                  </label>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="h-7 w-7 rounded-lg bg-card border border-border font-bold text-xs hover:bg-muted"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold text-foreground">{guests} Person{guests > 1 ? "s" : ""}</span>
                    <button
                      type="button"
                      onClick={() => setGuests(guests + 1)}
                      className="h-7 w-7 rounded-lg bg-card border border-border font-bold text-xs hover:bg-muted"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 p-3 rounded-2xl bg-secondary/40 border border-border/70">
                  <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Meal Preference
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 pt-1">
                    {["Lunch", "Dinner", "Snacks"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setMealTime(t)}
                        className={`py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          mealTime === t
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "bg-card border border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Primary CTA */}
                <Button
                  size="lg"
                  className="w-full h-12 rounded-2xl font-bold text-sm shadow-md cursor-pointer hover:bg-primary/90 gap-2"
                  onClick={() => setResModalOpen(true)}
                >
                  <FaCalendarCheck className="h-4 w-4" />
                  <span>Reserve Table ({guests} Seats)</span>
                </Button>
              </div>

              {/* Trust Badge Guarantee */}
              <div className="space-y-2.5 pt-3 border-t border-border/80 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>Zero reservation fee, guaranteed table holding</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>Verified food hygiene & authentic recipe spots</span>
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
        targetType="RESTAURANT"
        targetId={restaurant.id}
        targetName={restaurant.name}
        pricePerUnit={avgCostPerPerson}
        location={restaurant.location}
        coverImage={galleryImages[0]}
      />
    </div>
  );
}
