"use client";

import React from "react";
import Image from "next/image";
import { Container } from "@/components/shared";
import { FaStar } from "react-icons/fa6";

const testimonials = [
  {
    name: "Ayman Sadiq",
    role: "Travelled to Bandarban",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    comment:
      "Travla made our family trip to Bandarban simple. The stay and the transport were sorted in one evening, and everything matched what was listed.",
  },
  {
    name: "Nabila Islam",
    role: "Travelled to Sreemangal",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    comment:
      "I planned a five-day tea garden tour with the trip planner and never once had to open another site. The budget estimate was close to what I actually spent.",
  },
  {
    name: "Mahmud Hasan",
    role: "Travelled to Cox's Bazar",
    rating: 4,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    comment:
      "The reservation status updates were the best part — I knew exactly when the hotel confirmed instead of chasing a phone number.",
  },
];

export function Reviews() {
  return (
    <section id="reviews" className="section">
      <Container className="space-y-10">
        <div className="max-w-xl space-y-3">
          <p className="eyebrow">Traveller stories</p>
          <h2 className="heading">What people say after the trip</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="surface flex flex-col p-6">
              <div className="flex gap-0.5" aria-label={`Rated ${t.rating} out of 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar
                    key={i}
                    className={`h-3 w-3 ${i < t.rating ? "text-highlight" : "text-border"}`}
                  />
                ))}
              </div>

              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                {t.comment}
              </blockquote>

              <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-muted">
                  <Image src={t.avatar} alt="" fill sizes="36px" className="object-cover" />
                </span>
                <span>
                  <span className="block text-sm font-medium">{t.name}</span>
                  <span className="block text-xs text-muted-foreground">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default Reviews;
