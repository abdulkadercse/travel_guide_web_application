"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ImageSliderProps extends React.HTMLAttributes<HTMLDivElement> {
  images: { url: string; title?: string; location?: string }[] | string[];
  interval?: number;
}

const ImageSlider = React.forwardRef<HTMLDivElement, ImageSliderProps>(
  ({ images, interval = 5000, className, ...props }, ref) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);

    // Normalize images to array of objects
    const normalizedImages = React.useMemo(() => {
      return images.map((img) =>
        typeof img === "string" ? { url: img } : img
      );
    }, [images]);

    // Effect to handle the interval-based image transition
    React.useEffect(() => {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === normalizedImages.length - 1 ? 0 : prevIndex + 1
        );
      }, interval);

      // Cleanup the interval on component unmount
      return () => clearInterval(timer);
    }, [normalizedImages, interval]);

    const currentImg = normalizedImages[currentIndex];

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full h-full overflow-hidden bg-background",
          className
        )}
        {...props}
      >
        <AnimatePresence initial={false}>
          <motion.img
            key={currentIndex}
            src={currentImg.url}
            alt={currentImg.title || `Slide ${currentIndex + 1}`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Gradient Overlay & Text overlay for Bangladesh travel spots */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />

        {currentImg.title && (
          <div className="absolute bottom-10 left-6 right-6 z-10 text-white">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/80 text-[10px] font-bold uppercase tracking-wider mb-1.5 backdrop-blur-sm">
              {currentImg.location || "Bangladesh"}
            </span>
            <h3 className="text-xl font-extrabold tracking-tight drop-shadow-md">
              {currentImg.title}
            </h3>
          </div>
        )}

        {/* Pagination Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {normalizedImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                currentIndex === index
                  ? "bg-emerald-400 w-5"
                  : "bg-white/50 hover:bg-white"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    );
  }
);

ImageSlider.displayName = "ImageSlider";

export { ImageSlider };
