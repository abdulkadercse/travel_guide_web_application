"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { FaArrowLeft, FaStar } from "react-icons/fa6";

const suggestions = [
  {
    title: "Cox's Bazar Sea Beach",
    location: "Cox's Bazar",
    rating: "4.9",
    image: "/images/coxs-bazar.jpg",
  },
  {
    title: "Somapura Mahavihara",
    location: "Paharpur, Naogaon",
    rating: "4.8",
    image: "/images/paharpur.jpg",
  },
  {
    title: "Nilgiri Hills",
    location: "Bandarban",
    rating: "4.9",
    image: "/images/bandarban.jpg",
  },
];

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="flex-1">
      <section className="section">
        <Container>
          <div className="max-w-xl space-y-4">
            <p className="eyebrow">Error 404</p>
            <h1 className="display">This page took a wrong turn</h1>
            <p className="text-base leading-relaxed text-muted-foreground">
              The page you were looking for has moved or never existed. Here are a few places
              that are definitely still there.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/">Back to home</Link>
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              <FaArrowLeft className="mr-2 h-3 w-3" />
              Go back
            </Button>
          </div>

          <div className="mt-16 space-y-6">
            <h2 className="text-lg">Popular right now</h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {suggestions.map((item) => (
                <Link
                  key={item.title}
                  href="/#destinations"
                  className="surface-interactive group flex flex-col overflow-hidden"
                >
                  <div className="relative aspect-[3/2] w-full overflow-hidden bg-muted">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>

                  <div className="flex items-start justify-between gap-3 p-5">
                    <div>
                      <h3 className="text-base leading-snug">{item.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{item.location}</p>
                    </div>
                    <span className="mt-0.5 inline-flex shrink-0 items-center gap-1 text-sm">
                      <FaStar className="h-3 w-3 text-highlight" />
                      {item.rating}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
