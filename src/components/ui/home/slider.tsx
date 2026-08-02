"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { FaMapMarkerAlt, FaStar, FaArrowRight } from "react-icons/fa";
import Container from "@/components/shared/Container";

export interface SlideItem {
  image: string;
  title: string;
  tagline: string;
  location: string;
  rating: string;
  reviews: string;
}

export const defaultSlides: SlideItem[] = [
  {
    image: "/images/coxs-bazar.jpg",
    title: "Cox's Bazar Sea Beach",
    tagline: "World's Longest Natural Sand Beach",
    location: "Cox's Bazar, Chittagong",
    rating: "4.9",
    reviews: "2.4k",
  },
  {
    image: "/images/paharpur.jpg",
    title: "Sompura Mahavihara",
    tagline: "UNESCO World Heritage Archaeological Site",
    location: "Paharpur, Naogaon",
    rating: "4.8",
    reviews: "1.8k",
  },
  {
    image: "/images/bandarban.jpg",
    title: "Nilgiri Mountain Peak",
    tagline: "Touch the Clouds at High Altitudes",
    location: "Bandarban, Hill Tracts",
    rating: "4.95",
    reviews: "3.1k",
  },
  {
    image: "/images/sylhet.jpg",
    title: "Lush Green Tea Gardens",
    tagline: "Serene Waterfalls & Swamp Forests",
    location: "Sreemangal, Sylhet",
    rating: "4.85",
    reviews: "2.9k",
  },
];

interface HomeSliderProps {
  slides?: SlideItem[];
  autoplayInterval?: number;
  className?: string;
}

export function HomeSlider({
  slides = defaultSlides,
  autoplayInterval = 3500,
  className = "",
}: HomeSliderProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  // Autoplay plugin configuration
  const autoplayPlugin = React.useRef(
    Autoplay({ delay: autoplayInterval, stopOnInteraction: false })
  );

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <Carousel
        setApi={setApi}
        plugins={[autoplayPlugin.current]}
        opts={{ loop: true }}
        className="w-full h-[400px] sm:h-[480px] lg:h-[500px]"
      >
        <CarouselContent className="h-[400px] sm:h-[480px] lg:h-[500px] ml-0">
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="relative h-full w-full pl-0">
              {/* Full Width Background Image */}
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === 0}
                className="object-cover w-full h-full"
              />

              {/* Full Width Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Content Aligned Inside Container */}
              <Container className="relative h-full flex flex-col justify-end pb-10 sm:pb-12 z-10">
                <div className="max-w-2xl space-y-3.5 text-white">
                  {/* Location Badge */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-600/80 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-white border border-white/20 shadow-lg">
                    <FaMapMarkerAlt className="h-3 w-3 text-cyan-300" />
                    <span>{slide.location}</span>
                  </div>

                  {/* Title & Tagline */}
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight drop-shadow-lg text-white">
                    {slide.title}
                  </h1>
                  <p className="text-base sm:text-xl text-slate-200 font-medium max-w-xl">
                    {slide.tagline}
                  </p>

                  {/* Rating & Reviews */}
                  <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-300 pt-1">
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                      <FaStar className="h-4 w-4 fill-current" />
                      <span>{slide.rating}</span>
                    </div>
                    <span>•</span>
                    <span>{slide.reviews} Traveler Reviews</span>
                  </div>

                  {/* CTA Action Buttons */}
                  <div className="flex items-center gap-3.5 pt-4">
                    <Button
                      size="lg"
                      className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/40 font-semibold px-6"
                      asChild
                    >
                      <Link href="/signup">
                        Book Tour Package
                        <FaArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="bg-slate-950/60 border-white/25 text-white hover:bg-slate-900/90 rounded-xl backdrop-blur-md font-medium px-6"
                      asChild
                    >
                      <Link href="/demo">Explore Features</Link>
                    </Button>
                  </div>
                </div>
              </Container>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows inside Container boundaries */}
        <Container className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-20 pointer-events-none flex justify-between">
          <CarouselPrevious className="static translate-y-0 pointer-events-auto h-11 w-11 rounded-full bg-slate-950/60 border-white/20 text-white hover:bg-slate-900 hover:text-white backdrop-blur-md shadow-xl" />
          <CarouselNext className="static translate-y-0 pointer-events-auto h-11 w-11 rounded-full bg-slate-950/60 border-white/20 text-white hover:bg-slate-900 hover:text-white backdrop-blur-md shadow-xl" />
        </Container>
      </Carousel>

      {/* Pagination Dots & Counter Aligned inside Container */}
      <Container className="absolute bottom-6 inset-x-0 z-20 pointer-events-none flex justify-end">
        <div className="pointer-events-auto flex items-center gap-2 bg-slate-950/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-white text-xs shadow-xl">
          <span>{current + 1}</span>
          <span className="opacity-50">/</span>
          <span>{count}</span>
          <div className="flex gap-1.5 ml-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => api?.scrollTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  current === i ? "w-5 bg-indigo-400" : "w-2 bg-white/40"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default HomeSlider;
