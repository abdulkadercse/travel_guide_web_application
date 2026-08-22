"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { Container } from "@/components/shared";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  FaStar,
  FaChevronLeft,
  FaChevronRight,
  FaQuoteRight,
  FaCircleCheck,
} from "react-icons/fa6";

const testimonials = [
  {
    id: 1,
    name: "Ayman Sadiq",
    role: "Travelled to Bandarban",
    tag: "Bandarban Hill Tracts",
    date: "Oct 2024",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    comment:
      "Travla made our family trip to Bandarban simple. The stay and the transport were sorted in one evening, and everything matched what was listed.",
  },
  {
    id: 2,
    name: "Nabila Islam",
    role: "Travelled to Sreemangal",
    tag: "Sreemangal Tea Gardens",
    date: "Nov 2024",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    comment:
      "I planned a five-day tea garden tour with the trip planner and never once had to open another site. The budget estimate was close to what I actually spent.",
  },
  {
    id: 3,
    name: "Mahmud Hasan",
    role: "Travelled to Cox's Bazar",
    tag: "Cox's Bazar Beach",
    date: "Dec 2024",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    comment:
      "The reservation status updates were the best part — I knew exactly when the hotel confirmed instead of chasing a phone number.",
  },
  {
    id: 4,
    name: "Sarah Khan",
    role: "Travelled to Saint Martin",
    tag: "Coral Island",
    date: "Jan 2025",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    comment:
      "Booking ship tickets and resort in Saint Martin was seamless. Instant confirmation and super smooth checkout experience!",
  },
  {
    id: 5,
    name: "Tanvir Ahmed",
    role: "Travelled to Sajek Valley",
    tag: "Cloud Valley",
    date: "Feb 2025",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    comment:
      "The cloud views at Sajek were breathtaking! Travla recommended the perfect eco-resort with balcony views right over the valley.",
  },
  {
    id: 6,
    name: "Nusrat Jahan",
    role: "Travelled to Sylhet",
    tag: "Swamp Forest & Waterfalls",
    date: "Mar 2025",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    comment:
      "Exploring Ratargul Swamp Forest & Bisnakandi was hassle-free with Travla's local transit guide and resort recommendations.",
  },
];

export function Reviews() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [snapCount, setSnapCount] = useState(0);

  const autoplay = useRef(
    Autoplay({
      delay: 3500,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  useEffect(() => {
    if (!api) return;

    setSnapCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    api.on("reInit", () => {
      setSnapCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap());
    });

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <section id="reviews" className="section bg-gradient-to-b from-transparent via-primary/5 to-transparent" data-aos="fade-up">
      <Container className="space-y-10">
        {/* Header with Title and Nav Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" data-aos="fade-up">
          <div className="max-w-xl space-y-2">
            <p className="eyebrow">Traveller stories</p>
            <h2 className="heading">What people say after the trip</h2>
          </div>


          {/* Navigation controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => api?.scrollPrev()}
              aria-label="Previous review"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-primary active:scale-95"
            >
              <FaChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => api?.scrollNext()}
              aria-label="Next review"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-primary active:scale-95"
            >
              <FaChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <Carousel
            setApi={setApi}
            plugins={[autoplay.current]}
            opts={{
              loop: true,
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4 py-2">
              {testimonials.map((t) => (
                <CarouselItem
                  key={t.id}
                  className="pl-4 basis-full md:basis-1/2 lg:basis-1/3"
                >
                  <figure className="surface-interactive relative flex h-full flex-col justify-between overflow-hidden p-6 sm:p-7 group">
                    {/* Background Decorative Quote Mark */}
                    <FaQuoteRight className="absolute -top-2 -right-2 h-20 w-20 text-primary/5 transition-transform duration-300 group-hover:scale-110" />

                    <div>
                      {/* Top Bar: Rating & Verified Chip */}
                      <div className="flex items-center justify-between gap-2">
                        <div
                          className="flex gap-1"
                          aria-label={`Rated ${t.rating} out of 5 stars`}
                        >
                          {Array.from({ length: 5 }).map((_, i) => (
                            <FaStar
                              key={i}
                              className={`h-4 w-4 ${
                                i < t.rating
                                  ? "text-highlight fill-highlight"
                                  : "text-border"
                              }`}
                            />
                          ))}
                        </div>

                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                          <FaCircleCheck className="h-3 w-3" />
                          Verified Stay
                        </span>
                      </div>

                      {/* Comment body */}
                      <blockquote className="mt-5 text-sm leading-relaxed text-muted-foreground/90 font-normal">
                        &ldquo;{t.comment}&rdquo;
                      </blockquote>
                    </div>

                    {/* Footer: User Details */}
                    <figcaption className="mt-7 flex items-center justify-between border-t border-border/80 pt-4">
                      <div className="flex items-center gap-3.5">
                        <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/20">
                          <Image
                            src={t.avatar}
                            alt={t.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </span>
                        <div>
                          <span className="block text-sm font-semibold text-foreground">
                            {t.name}
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            {t.role}
                          </span>
                        </div>
                      </div>

                      <span className="text-[11px] font-medium text-primary/80 bg-primary-soft/40 px-2 py-1 rounded-md">
                        {t.date}
                      </span>
                    </figcaption>
                  </figure>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* Pagination Dots */}
        {snapCount > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2">
            {Array.from({ length: snapCount }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => api?.scrollTo(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                aria-current={current === idx}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  current === idx
                    ? "w-8 bg-primary"
                    : "w-2.5 bg-border hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

export default Reviews;

