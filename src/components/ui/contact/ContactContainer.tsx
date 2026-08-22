"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FaUser,
  FaEnvelope,
  FaTag,
  FaPen,
  FaPaperPlane,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaHeadset,
  FaClock,
  FaShieldAlt,
  FaCheckCircle,
  FaSpinner,
  FaComments,
  FaQuestionCircle,
  FaChevronDown,
} from "react-icons/fa";

const contactFaqs = [
  {
    q: "How quickly do you reply to inquiries?",
    a: "Our support desk typically responds to all emails and message submissions within 2 to 4 business hours, and guaranteed within 24 hours.",
  },
  {
    q: "How do I check the status of my reservation?",
    a: "You can track real-time reservation updates (Pending, Confirmed, Cancelled) anytime from your User Dashboard > Reservations section.",
  },
  {
    q: "Can I cancel or reschedule a confirmed booking?",
    a: "Yes! Navigate to your reservations tab on the dashboard to request cancellation or contact our support desk directly with your reservation ID.",
  },
];

export function ContactContainer() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast.error("Please provide a valid email address");
      return;
    }
    if (!formData.subject.trim()) {
      toast.error("Please select or enter a subject");
      return;
    }
    if (!formData.message.trim()) {
      toast.error("Please write your message");
      return;
    }

    setIsSubmitting(true);

    // Simulate clean submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Thank you! Your message has been received. Our team will contact you shortly.");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* 1. Full-Width Hero Section with High-Res Background Image */}
      <section
        className="relative h-[320px] sm:h-[390px] flex items-center justify-center overflow-hidden border-b border-border"
        data-aos="fade-up"
      >
        <Image
          src="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&w=1920&q=80"
          alt="Contact Travla BD Support"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Dark & teal gradient overlay for optimal readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/70 to-stone-950/50 backdrop-blur-[0.5px]" />

        <Container className="relative z-10 text-center max-w-3xl space-y-3.5" data-aos="fade-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-semibold shadow-xs">
            <FaHeadset className="text-primary h-3.5 w-3.5" />
            24/7 Dedicated Traveler Support Desk
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white drop-shadow-md">
            We&apos;re Here to Help You
          </h1>
          <p className="text-sm sm:text-base text-white/85 max-w-2xl mx-auto leading-relaxed drop-shadow-xs">
            Have questions about tour destinations, hotel bookings, transit routes, or trip planning? Get in touch with our team anytime.
          </p>
        </Container>
      </section>

      <Container className="pt-10 space-y-12">
        {/* 2. Top Highlights 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5" data-aos="fade-up" data-aos-delay="100">
          {/* Card 1: Phone */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xs hover:border-primary/40 hover:shadow-md transition-all group">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <FaPhoneAlt className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Call Hotline</p>
                <a href="tel:+8801700000000" className="text-base font-bold text-foreground hover:text-primary transition-colors block">
                  +880 1700-000000
                </a>
                <p className="text-xs text-muted-foreground">Sat – Thu, 9:00 AM – 8:00 PM</p>
              </div>
            </div>
          </div>

          {/* Card 2: Email */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xs hover:border-primary/40 hover:shadow-md transition-all group">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <FaEnvelope className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Official Email</p>
                <a href="mailto:support@travlabd.com" className="text-base font-bold text-foreground hover:text-primary transition-colors block truncate">
                  support@travlabd.com
                </a>
                <p className="text-xs text-muted-foreground">Guaranteed response in 24h</p>
              </div>
            </div>
          </div>

          {/* Card 3: Office */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xs hover:border-primary/40 hover:shadow-md transition-all group">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <FaMapMarkerAlt className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Head Office</p>
                <p className="text-sm font-bold text-foreground leading-snug">
                  Gulshan-2, Dhaka 1212
                </p>
                <p className="text-xs text-muted-foreground">Bangladesh</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Main Form & Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Contact Form Card (7 Cols) */}
          <div className="lg:col-span-7 space-y-6" data-aos="fade-up" data-aos-delay="150">
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-xs space-y-7">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  <FaComments className="h-3 w-3" />
                  <span>Send Us a Message</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  How can we help your journey?
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Fill out the form below and our travel consultants will connect with you promptly.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="fullName" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                      Full Name <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-3.5 w-3.5" />
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder="e.g. Tanvir Ahmed"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="pl-10 h-11 rounded-xl bg-secondary/30 border-border"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                      Email Address <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-3.5 w-3.5" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="e.g. name@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10 h-11 rounded-xl bg-secondary/30 border-border"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                      Phone Number (Optional)
                    </label>
                    <div className="relative">
                      <FaPhoneAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-3.5 w-3.5" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="e.g. +880 1712-345678"
                        value={formData.phone}
                        onChange={handleChange}
                        className="pl-10 h-11 rounded-xl bg-secondary/30 border-border"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5">
                    <label htmlFor="subject" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                      Inquiry Subject <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <FaTag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-3.5 w-3.5 pointer-events-none" />
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full h-11 pl-10 pr-4 rounded-xl bg-secondary/30 border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                      >
                        <option value="" disabled className="bg-popover">Select an inquiry topic</option>
                        <option value="Destination Guidance" className="bg-popover">Destination & Tour Guidance</option>
                        <option value="Hotel Reservation" className="bg-popover">Hotel & Resort Bookings</option>
                        <option value="Restaurant Booking" className="bg-popover">Dining & Table Reservation</option>
                        <option value="Transportation Schedule" className="bg-popover">Transit & Transport Schedules</option>
                        <option value="Account & Profile" className="bg-popover">Account / Technical Issue</option>
                        <option value="Other Inquiry" className="bg-popover">Other Inquiries & Feedback</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                    Your Message <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <FaPen className="absolute top-3.5 left-3.5 text-muted-foreground h-3.5 w-3.5 pointer-events-none" />
                    <Textarea
                      id="message"
                      name="message"
                      rows={5}
                      placeholder="Please write the details of your inquiry, tour requirements, or question here..."
                      value={formData.message}
                      onChange={handleChange}
                      className="pl-10 pt-3 rounded-xl bg-secondary/30 border-border resize-y min-h-[130px]"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                  className="w-full sm:w-auto h-12 px-8 rounded-xl font-semibold gap-2 shadow-xs cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="h-4 w-4 animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <FaPaperPlane className="h-3.5 w-3.5" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Right: Map & Office Info (5 Cols) */}
          <div className="lg:col-span-5 space-y-6" data-aos="fade-up" data-aos-delay="200">
            {/* Interactive Stylized Location Map */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Visit Our Office</h3>
                  <p className="text-xs text-muted-foreground">Gulshan-2, Dhaka, Bangladesh</p>
                </div>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <FaCheckCircle className="h-3 w-3" /> Open Now
                </span>
              </div>

              {/* Map Preview Box */}
              <div className="relative h-56 w-full rounded-2xl overflow-hidden border border-border bg-muted">
                {/* Visual Map Pattern */}
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-85"
                  style={{
                    backgroundImage: `radial-gradient(var(--color-primary) 1px, transparent 1px), radial-gradient(var(--color-primary) 1px, var(--color-card) 1px)`,
                    backgroundSize: "24px 24px",
                    backgroundPosition: "0 0, 12px 12px",
                  }}
                />

                {/* Simulated Roads */}
                <svg className="absolute inset-0 w-full h-full opacity-35 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 0,50 Q 120,90 240,40 T 500,100" stroke="var(--color-primary)" strokeWidth="6" fill="none" />
                  <path d="M 60,0 Q 90,120 140,240" stroke="var(--color-border)" strokeWidth="4" fill="none" />
                  <path d="M 260,0 Q 280,120 320,240" stroke="var(--color-border)" strokeWidth="4" fill="none" />
                </svg>

                {/* Pulsating Pin */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-primary opacity-75"></span>
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                    <FaMapMarkerAlt className="h-5 w-5" />
                  </div>
                </div>

                {/* Floating Address Bar */}
                <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-card/95 backdrop-blur-md border border-border p-3 shadow-md flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">Travla BD Hub</p>
                    <p className="text-[11px] text-muted-foreground truncate">123 Travel Street, Gulshan-2, Dhaka</p>
                  </div>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-xs font-semibold text-primary hover:underline"
                  >
                    Directions &rarr;
                  </a>
                </div>
              </div>

              {/* Working Hours & Commitments */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 border border-border/70 text-xs text-muted-foreground">
                  <FaClock className="h-4 w-4 text-primary shrink-0" />
                  <span><strong>Business Hours:</strong> Sat – Thu: 9:00 AM – 8:00 PM (Friday Closed)</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 border border-border/70 text-xs text-muted-foreground">
                  <FaShieldAlt className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span><strong>Verified Operators:</strong> 100% verified hotels, guides & transport networks.</span>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-3 border-t border-border space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Connect with us</p>
                <div className="flex items-center gap-2">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors text-muted-foreground"
                    title="Facebook"
                  >
                    <FaFacebookF className="h-4 w-4" />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors text-muted-foreground"
                    title="Instagram"
                  >
                    <FaInstagram className="h-4 w-4" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors text-muted-foreground"
                    title="LinkedIn"
                  >
                    <FaLinkedinIn className="h-4 w-4" />
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors text-muted-foreground"
                    title="YouTube"
                  >
                    <FaYoutube className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Common Questions / Quick FAQ Section */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-xs space-y-6" data-aos="fade-up">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <FaQuestionCircle className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground">Common Inquiries</h3>
              <p className="text-xs text-muted-foreground">Quick answers to frequently asked support questions</p>
            </div>
          </div>

          <div className="divide-y divide-border border-y border-border">
            {contactFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={faq.q} className="py-4">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between gap-4 text-left font-semibold text-sm sm:text-base text-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <FaChevronDown
                      className={`h-3 w-3 text-muted-foreground transition-transform duration-200 shrink-0 ${
                        isOpen ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default ContactContainer;
