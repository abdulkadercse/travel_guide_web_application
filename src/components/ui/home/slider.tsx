"use client";

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { FaLocationDot, FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa6";

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
    tagline: "The world's longest natural sand beach",
    location: "Cox's Bazar, Chittagong",
    rating: "4.9",
    reviews: "2.4k",
  },
  {
    image: "/images/bandarban.jpg",
    title: "Nilgiri Mountain Peak",
    tagline: "Wake up above the clouds",
    location: "Bandarban, Hill Tracts",
    rating: "4.9",
    reviews: "3.1k",
  },
  {
    image: "/images/paharpur.jpg",
    title: "Sompura Mahavihara",
    tagline: "A UNESCO world heritage site from the 8th century",
    location: "Paharpur, Naogaon",
    rating: "4.8",
    reviews: "1.8k",
  },
  {
    image: "/images/sylhet.jpg",
    title: "Sreemangal Tea Gardens",
    tagline: "Rolling estates, waterfalls and swamp forest",
    location: "Sreemangal, Sylhet",
    rating: "4.8",
    reviews: "2.9k",
  },
];

export function HomeSlider({
  slides = defaultSlides,
  autoplayInterval = 6000,
}: {
  slides?: SlideItem[];
  autoplayInterval?: number;
}) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  const autoplay = React.useRef(
    Autoplay({ delay: autoplayInterval, stopOnInteraction: false })
  );

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  return (
    <div className="relative">
      <Carousel
        setApi={setApi}
        plugins={[autoplay.current]}
        opts={{ loop: true }}
        className="w-full"
      >
        {/* The shared Carousel adds a -ml-4 / pl-4 gutter for multi-item rows.
            This is a single full-bleed slide, so the gutter is zeroed inline —
            class overrides lose to the component's own utilities. */}
        <CarouselContent style={{ marginLeft: 0 }}>
          {slides.map((slide, index) => (
            <CarouselItem key={slide.title} style={{ paddingLeft: 0 }}>
              <div className="relative h-[78vh] max-h-[760px] min-h-[560px] w-full">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover"
                />

                {/* Weighted to the bottom, where the copy sits. */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-stone-950/10" />

                <div className="absolute inset-x-0 bottom-0">
                  <div className="mx-auto w-full max-w-7xl px-4 pb-28 sm:px-6 sm:pb-32 lg:px-8">
                    <div className="max-w-2xl">
                      <span className="chip-glass inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium">
                        <FaLocationDot className="h-3 w-3" />
                        {slide.location}
                        <span className="mx-0.5 h-3 w-px bg-white/30" />
                        <FaStar className="h-3 w-3 text-highlight" />
                        {slide.rating}
                        <span className="text-white/70">({slide.reviews})</span>
                      </span>

                      <h1 className="display mt-5 text-white drop-shadow-sm">{slide.title}</h1>

                      <p className="mt-4 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">
                        {slide.tagline}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Controls, aligned with the container gutter */}
      <div className="pointer-events-none absolute inset-x-0 bottom-28 z-10 sm:bottom-32">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-end gap-3 px-4 sm:px-6 lg:px-8">
          <div className="pointer-events-auto flex items-center gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.title}
                onClick={() => api?.scrollTo(index)}
                aria-label={`Go to ${slide.title}`}
                aria-current={current === index}
                className={`h-1 rounded-full transition-all duration-300 ${
                  current === index ? "w-8 bg-white" : "w-4 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>

          <div className="pointer-events-auto ml-2 flex items-center gap-2">
            <button
              onClick={() => api?.scrollPrev()}
              aria-label="Previous slide"
              className="chip-glass flex h-10 w-10 items-center justify-center transition-colors hover:bg-white/25"
            >
              <FaChevronLeft className="h-3 w-3" />
            </button>
            <button
              onClick={() => api?.scrollNext()}
              aria-label="Next slide"
              className="chip-glass flex h-10 w-10 items-center justify-center transition-colors hover:bg-white/25"
            >
              <FaChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeSlider;
