"use client";

import React, { useState } from "react";
import { Container } from "@/components/shared";
import { FaPlus } from "react-icons/fa6";

const faqs = [
  {
    question: "How do I request a booking?",
    answer:
      "Open any destination, hotel or restaurant, pick your dates and send a reservation request. It arrives as pending, and you can follow its status from your dashboard until the host confirms it.",
  },
  {
    question: "Can I build my own itinerary?",
    answer:
      "Yes. The trip planner in your dashboard lets you create a plan, add as many destinations as you like, set a visit date and notes for each one, and track the estimated cost against your budget.",
  },
  {
    question: "Are the listings verified?",
    answer:
      "Every hotel, restaurant and transport operator is reviewed by an administrator before it appears on the site, and reviews can only be written by registered travellers.",
  },
  {
    question: "Does it cost anything to use?",
    answer:
      "Creating an account, browsing, saving favourites and planning trips are all free. You only pay the operator directly once a reservation is confirmed.",
  },
];

export function FAQSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section id="faq" className="section" data-aos="fade-up">
      <Container className="max-w-3xl">
        <div className="max-w-xl space-y-3" data-aos="fade-up">
          <p className="eyebrow">Questions</p>
          <h2 className="heading">Before you book</h2>
        </div>

        <dl className="mt-10 divide-y divide-border border-y border-border" data-aos="fade-up" data-aos-delay="100">
          {faqs.map((faq, idx) => {

            const isOpen = openFaq === idx;
            return (
              <div key={faq.question}>
                <dt>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left transition-colors hover:text-primary"
                  >
                    <span className="text-base font-medium">{faq.question}</span>
                    <FaPlus
                      className={`h-3 w-3 shrink-0 text-muted-foreground transition-transform duration-200 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    />
                  </button>
                </dt>

                {isOpen && (
                  <dd className="max-w-2xl pb-6 text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </dd>
                )}
              </div>
            );
          })}
        </dl>
      </Container>
    </section>
  );
}

export default FAQSection;
