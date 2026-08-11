"use client";

import React from "react";
import Image from "next/image";
import { Container } from "@/components/shared";
import { FaQuoteLeft } from "react-icons/fa";

const testimonials = [
    {
        name: "Ayman Sadiq",
        role: "Adventure Traveler",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        comment: "Travla BD made our family trip to Bandarban so smooth! The hotel booking and transport guide were spot on.",
    },
    {
        name: "Nabila Islam",
        role: "Solo Backpacker",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
        comment: "The custom trip planner feature allowed me to schedule my 5-day Sylhet tea garden tour without any stress. Highly recommended!",
    },
    {
        name: "Mahmud Hasan",
        role: "Photographer",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        comment: "Instant booking confirmation and verified guides. Cox's Bazar sunset tour organized by Travla was unforgettable.",
    },
];

export function Reviews() {
    return (
        <section className="w-full bg-slate-950/40 py-16 border-y border-border/50">
            <Container className="space-y-8">
                <div className="text-center max-w-xl mx-auto space-y-2">
                    <h2 className="text-3xl font-black tracking-tight">Traveler Stories & Reviews</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                        See what fellow travelers have to say about their journeys with Travla BD
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((t, idx) => (
                        <div
                            key={idx}
                            className="p-6 rounded-3xl bg-card border border-border shadow-md space-y-4 relative"
                        >
                            <FaQuoteLeft className="text-indigo-500/20 h-8 w-8 absolute top-4 right-4" />
                            <p className="text-xs text-muted-foreground leading-relaxed italic">
                                &quot;{t.comment}&quot;
                            </p>
                            <div className="flex items-center gap-3 pt-2">
                                <div className="relative h-10 w-10 rounded-full overflow-hidden border">
                                    <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-foreground">{t.name}</h4>
                                    <p className="text-[10px] text-muted-foreground">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}

export default Reviews;