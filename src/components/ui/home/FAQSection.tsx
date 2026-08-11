"use client";

import React, { useState } from "react";
import { Container } from "@/components/shared";
import { FaChevronDown } from "react-icons/fa";

const faqs = [
  {
    question: "How do I book a tour or hotel on Travla BD?",
    answer: "Simply browse through our destinations or tour packages, click 'Book Tour', select your dates, and confirm your reservation.",
  },
  {
    question: "Can I customize my trip schedule?",
    answer: "Yes! Use our User Dashboard 'Trip Planner' tool to add multiple destinations, calculate estimated budget, and save trip notes.",
  },
  {
    question: "Are local guides verified for safety?",
    answer: "100% yes. All registered guides and transport operators undergo strict identity verification before listing.",
  },
];

export function FAQSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section className="w-full">
      <Container className="max-w-3xl space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black tracking-tight">Frequently Asked Questions</h2>
          <p className="text-xs text-muted-foreground">
            Everything you need to know about planning trips with Travla BD
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-border bg-card overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left font-bold text-sm flex items-center justify-between hover:text-indigo-400 transition-colors"
              >
                <span>{faq.question}</span>
                <FaChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    openFaq === idx ? "rotate-180 text-indigo-400" : ""
                  }`}
                />
              </button>

              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs text-muted-foreground leading-relaxed border-t border-border/50 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default FAQSection;