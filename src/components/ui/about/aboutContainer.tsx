"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { FaLocationDot, FaRoute, FaCircleCheck, FaUsers } from "react-icons/fa6";

const values = [
  {
    Icon: FaLocationDot,
    title: "One source, not six tabs",
    body: "Destinations, stays, restaurants and transport live together, so comparing options does not mean losing your place.",
  },
  {
    Icon: FaRoute,
    title: "Planning that survives the trip",
    body: "An itinerary you can edit day by day, with notes and a budget that updates as the plan changes.",
  },
  {
    Icon: FaCircleCheck,
    title: "Listings we stand behind",
    body: "Nothing appears on the site until an administrator has checked it, and reviews come only from registered travellers.",
  },
  {
    Icon: FaUsers,
    title: "Built for the people going",
    body: "Made for students, families and solo travellers crossing Bangladesh on a real budget.",
  },
];

const stack = [
  { label: "Interface", value: "Next.js · React · TypeScript · Tailwind CSS" },
  { label: "State & data", value: "Redux Toolkit · RTK Query" },
  { label: "Server", value: "Node.js · Express.js · REST API · JWT · Bcrypt" },
  { label: "Database", value: "PostgreSQL · Prisma ORM" },
];

export function AboutContainer() {
  return (
    <>
      {/* Intro */}
      <section className="section">
        <Container>
          <div className="max-w-2xl space-y-4">
            <p className="eyebrow">About Travla BD</p>
            <h1 className="display">
              Travel information worth trusting, in one place.
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              Planning a trip in Bangladesh usually means a dozen tabs, three phone calls and a
              screenshot folder. Travla brings destinations, hotels, restaurants, transport and
              your own itinerary into a single platform — and keeps it organised from the first
              search to the confirmed reservation.
            </p>
          </div>
        </Container>
      </section>

      {/* Photo */}
      <Container>
        <div className="relative aspect-[16/7] w-full overflow-hidden rounded-2xl border border-border">
          <Image
            src="/images/bg-travel.jpg"
            alt="Travelling across Bangladesh"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </Container>

      {/* Values */}
      <section className="section">
        <Container className="space-y-12">
          <div className="max-w-xl space-y-3">
            <p className="eyebrow">What we care about</p>
            <h2 className="heading">Four things we refuse to compromise on</h2>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
            {values.map(({ Icon, title, body }) => (
              <div key={title} className="space-y-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <h3 className="text-base">{title}</h3>
                <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Stack */}
      <section className="section border-y border-border bg-secondary/40">
        <Container className="space-y-10">
          <div className="max-w-xl space-y-3">
            <p className="eyebrow">How it is built</p>
            <h2 className="heading">A three-layer architecture</h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              The interface, the application server and the database are separate layers. The
              browser never reaches the database directly — every request passes through the REST
              API, where authentication and authorisation are enforced.
            </p>
          </div>

          <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
            {stack.map((row) => (
              <div key={row.label} className="bg-card p-6">
                <dt className="text-sm text-muted-foreground">{row.label}</dt>
                <dd className="mt-1.5 text-sm font-medium">{row.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* CTA */}
      <section className="section">
        <Container>
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-lg space-y-2">
              <h2 className="text-2xl sm:text-3xl">Start planning your next trip</h2>
              <p className="text-base text-muted-foreground">
                Create a free account to save places and build an itinerary.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/signup">Create an account</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/#destinations">Browse destinations</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

export default AboutContainer;
