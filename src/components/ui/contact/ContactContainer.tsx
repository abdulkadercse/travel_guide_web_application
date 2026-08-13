"use client";

import React, { useState } from "react";
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
  FaPhone,
  FaLocationDot,
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaYoutube,
  FaHeadset,
  FaClock,
  FaShieldHalved,
  FaHeart,
  FaChevronRight,
  FaSpinner,
} from "react-icons/fa6";

export function ContactContainer() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      toast.error("Please enter a valid email address");
      return;
    }
    if (!formData.subject.trim()) {
      toast.error("Please enter a subject");
      return;
    }
    if (!formData.message.trim()) {
      toast.error("Please write your message");
      return;
    }

    setIsSubmitting(true);

    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(
        "Thank you! Your message has been sent. We will get back to you shortly."
      );
      setFormData({
        fullName: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <Container className="space-y-10 sm:space-y-12">
        {/* Breadcrumb Navigation */}
        <nav
          className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground"
          aria-label="Breadcrumb"
        >
          <Link
            href="/"
            className="transition-colors hover:text-foreground font-medium"
          >
            Home
          </Link>
          <FaChevronRight className="h-2.5 w-2.5 text-muted-foreground/60" />
          <span className="text-foreground font-semibold">Contact</span>
        </nav>

        {/* Top Header Section with Illustration */}
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden rounded-3xl bg-card border border-border p-6 sm:p-10 shadow-xs">
          <div className="max-w-2xl space-y-3 z-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
              Contact Us
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              We&apos;d love to hear from you! Whether you have a question, need
              help planning your trip, or want to share feedback, our team is
              here for you.
            </p>
          </div>

          {/* Decorative Headset Graphics (matching reference design style) */}
          <div className="relative self-end md:self-center shrink-0 z-10 flex items-center gap-3">
            {/* Dashed flight path decoration */}
            <div className="hidden sm:block absolute -left-20 top-2 pointer-events-none opacity-80">
              <svg width="100" height="40" viewBox="0 0 100 40" fill="none">
                <path
                  d="M10 30 Q 50 0 90 20"
                  stroke="var(--color-primary)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  fill="none"
                />
                <circle cx="10" cy="30" r="3" fill="var(--color-primary)" />
              </svg>
            </div>

            <div className="relative flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-3xl bg-primary-soft/80 border border-primary/20 shadow-inner">
              <FaHeadset className="h-12 w-12 sm:h-14 sm:w-14 text-primary animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
              </span>
            </div>
          </div>

          {/* Subtle Background Glow */}
          <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        </div>

        {/* Main Content Grid: Left Form Card + Right Info Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Card + Support Badges */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            {/* Form Card */}
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-9 shadow-sm space-y-7">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                  Send Us a Message
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Fill out the form below and we will respond to your inquiry within 24 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label
                      htmlFor="fullName"
                      className="block text-xs font-semibold text-foreground uppercase tracking-wider"
                    >
                      Full Name <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                        <FaUser className="h-4 w-4" />
                      </div>
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="pl-10 h-11 rounded-xl bg-background border-input focus-visible:ring-primary"
                        required
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-xs font-semibold text-foreground uppercase tracking-wider"
                    >
                      Email Address <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                        <FaEnvelope className="h-4 w-4" />
                      </div>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10 h-11 rounded-xl bg-background border-input focus-visible:ring-primary"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label
                    htmlFor="subject"
                    className="block text-xs font-semibold text-foreground uppercase tracking-wider"
                  >
                    Subject <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                      <FaTag className="h-4 w-4" />
                    </div>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="Enter subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="pl-10 h-11 rounded-xl bg-background border-input focus-visible:ring-primary"
                      required
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="block text-xs font-semibold text-foreground uppercase tracking-wider"
                  >
                    Message <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute top-3.5 left-3.5 flex items-center pointer-events-none text-muted-foreground">
                      <FaPen className="h-4 w-4" />
                    </div>
                    <Textarea
                      id="message"
                      name="message"
                      rows={5}
                      placeholder="Write your message here..."
                      value={formData.message}
                      onChange={handleChange}
                      className="pl-10 pt-3 rounded-xl bg-background border-input focus-visible:ring-primary resize-y min-h-[120px]"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 px-7 rounded-xl font-semibold bg-primary hover:bg-primary-hover text-primary-foreground transition-all shadow-md flex items-center gap-2.5 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="h-4 w-4 animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <FaPaperPlane className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {/* Bottom Support Features Row (Matching bottom of reference image) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-3xl border border-border/80 bg-primary-soft/40 dark:bg-primary-soft/20 p-5 sm:p-6 shadow-2xs">
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  <FaClock className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-foreground">24/7 Support</h4>
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    We&apos;re here to help you anytime, anywhere.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary border border-primary/20">
                  <FaShieldHalved className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-foreground">Fast Response</h4>
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    Our team responds to all inquiries within 24 hours.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <FaHeart className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-foreground">
                    Travel with Confidence
                  </h4>
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    Trusted by thousands of travelers worldwide.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Info Card + Interactive Map */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-sm space-y-7">
              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                  Get in Touch
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  You can reach us through any of the following channels. We&apos;ll get back to you as soon as possible.
                </p>
              </div>

              {/* Channels List */}
              <div className="space-y-5">
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary border border-primary/20 shadow-2xs">
                    <FaPhone className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Phone
                    </h3>
                    <p className="text-sm font-semibold text-primary">
                      +880 1700-000000
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Sat - Thu 9:00 AM - 8:00 PM
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary border border-primary/20 shadow-2xs">
                    <FaEnvelope className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Email
                    </h3>
                    <a
                      href="mailto:support@travlabd.com"
                      className="text-sm font-semibold text-primary hover:underline block"
                    >
                      support@travlabd.com
                    </a>
                    <p className="text-xs text-muted-foreground">
                      We reply within 24 hours
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary border border-primary/20 shadow-2xs">
                    <FaLocationDot className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Address
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-foreground leading-relaxed">
                      123 Travel Street, Gulshan-2, Dhaka 1212, Bangladesh
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Follow */}
              <div className="pt-4 border-t border-border/70 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Follow Us
                </h3>
                <div className="flex items-center gap-2.5">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                  >
                    <FaFacebookF className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                  >
                    <FaInstagram className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href="https://x.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X (Twitter)"
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                  >
                    <FaXTwitter className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                  >
                    <FaYoutube className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              {/* Interactive Visual Map Container */}
              <div className="relative overflow-hidden rounded-2xl border border-border h-48 bg-slate-900/10 dark:bg-slate-900/40 group">
                {/* Visual Map Grid Pattern */}
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-85 transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: `radial-gradient(var(--color-primary) 0.75px, transparent 0.75px), radial-gradient(var(--color-primary) 0.75px, var(--color-card) 0.75px)`,
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 0, 10px 10px",
                  }}
                />

                {/* Map Roads & Water Simulation Lines */}
                <svg
                  className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M 0,30 Q 100,60 200,20 T 400,80"
                    stroke="var(--color-primary)"
                    strokeWidth="6"
                    fill="none"
                  />
                  <path
                    d="M 50,0 Q 80,100 120,200"
                    stroke="var(--color-border)"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    d="M 220,0 Q 250,100 280,200"
                    stroke="var(--color-border)"
                    strokeWidth="5"
                    fill="none"
                  />
                </svg>

                {/* Pulsating Map Pin */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="relative flex h-10 w-10 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60"></span>
                    <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                      <FaLocationDot className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                {/* Floating Office Address Badge */}
                <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-card/95 backdrop-blur-md border border-border p-2.5 shadow-md flex items-center gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <FaLocationDot className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-foreground truncate">
                      Travla BD Office
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      123 Travel Street, Gulshan-2, Dhaka 1212
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default ContactContainer;
