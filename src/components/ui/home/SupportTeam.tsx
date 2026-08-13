"use client";

import Image from "next/image";
import Container from "@/components/shared/Container";
import {
  FaWhatsapp,
  FaEnvelope,
  FaPhone,
  FaHeadset,
  FaCircleCheck,
} from "react-icons/fa6";

interface SupportRep {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar?: string | null;
  initials: string;
  color: string;
  whatsapp: string;
  email: string;
  phone: string;
}

const supportTeamData: SupportRep[] = [
  {
    id: "rep-1",
    name: "Tanvir Ahmed",
    role: "Trip & Destination Support",
    description: "Get pricing, custom trip itineraries, and 64 district recommendations.",
    avatar: "/teams/174376225.jpeg",
    initials: "TA",
    color: "from-teal-500/20 to-emerald-500/20 text-teal-600 dark:text-teal-300",
    whatsapp: "https://wa.me/8801700000000",
    email: "mailto:tanvir@travlabd.com",
    phone: "tel:+8801700000000",
  },
  {
    id: "rep-2",
    name: "Md. Mamun Islam",
    role: "Hotel & Stay Support",
    description: "Check verified room availability, pricing, amenities & stay details.",
    avatar: null,
    initials: "MI",
    color: "from-blue-500/20 to-cyan-500/20 text-blue-600 dark:text-blue-300",
    whatsapp: "https://wa.me/8801800000000",
    email: "mailto:mamun@travlabd.com",
    phone: "tel:+8801800000000",
  },
  {
    id: "rep-3",
    name: "Md. Abdul Kader",
    role: "Transit & Reservation Desk",
    description: "Track reservations, bus/train schedule status and on-the-road assistance.",
    avatar: null,
    initials: "AK",
    color: "from-indigo-500/20 to-violet-500/20 text-indigo-600 dark:text-indigo-300",
    whatsapp: "https://wa.me/8801900000000",
    email: "mailto:kader@travlabd.com",
    phone: "tel:+8801900000000",
  },
];

export function SupportTeam() {
  return (
    <section className="py-14 sm:py-18 border-t border-border bg-card">
      <Container className="space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
              <FaHeadset className="h-3.5 w-3.5" />
              <span>Dedicated Support Representatives</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Need Instant Help Planning Your Trip?
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Reach out directly to our verified travel support team for instant advice, booking help, and district guidance.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 self-start md:self-auto">
            <FaCircleCheck className="h-3.5 w-3.5" />
            <span>24/7 Live Desk Active</span>
          </div>
        </div>

        {/* 3 Support Rep Cards (Matching Screenshot Layout) */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {supportTeamData.map((rep) => (
            <div
              key={rep.id}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-secondary/30 p-4.5 sm:p-5 shadow-2xs transition-all duration-300 hover:border-primary/40 hover:bg-card hover:shadow-md"
            >
              <div className="flex items-start gap-3.5">
                {/* Left Photo / Avatar */}
                <div className="relative shrink-0">
                  {rep.avatar ? (
                    <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-primary/30 shadow-xs group-hover:border-primary transition-colors">
                      <Image
                        src={rep.avatar}
                        alt={rep.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-full border-2 border-border bg-gradient-to-br ${rep.color} shadow-2xs font-bold text-sm`}
                    >
                      {rep.initials}
                    </div>
                  )}
                </div>

                {/* Right Details */}
                <div className="space-y-1 min-w-0 flex-1">
                  <h3 className="text-sm sm:text-base font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
                    {rep.role}
                  </h3>
                  <p className="text-[11px] font-semibold text-primary">
                    {rep.name}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 pt-0.5">
                    {rep.description}
                  </p>
                </div>
              </div>

              {/* Bottom Communication Buttons Row (WhatsApp, Email, Phone) */}
              <div className="mt-4 pt-3.5 border-t border-border/60 flex items-center gap-2">
                {/* WhatsApp Button */}
                <a
                  href={rep.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white shadow-2xs transition-transform hover:scale-110 hover:bg-emerald-600"
                  title={`Chat with ${rep.name} on WhatsApp`}
                >
                  <FaWhatsapp className="h-4 w-4" />
                </a>

                {/* Email Button */}
                <a
                  href={rep.email}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-white shadow-2xs transition-transform hover:scale-110 hover:bg-sky-600"
                  title={`Email ${rep.name}`}
                >
                  <FaEnvelope className="h-3.5 w-3.5" />
                </a>

                {/* Phone Call Button */}
                <a
                  href={rep.phone}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 dark:bg-slate-700 text-white shadow-2xs transition-transform hover:scale-110 hover:bg-slate-900"
                  title={`Call ${rep.name}`}
                >
                  <FaPhone className="h-3.5 w-3.5" />
                </a>

                <span className="ml-auto text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  Online Now
                </span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default SupportTeam;
