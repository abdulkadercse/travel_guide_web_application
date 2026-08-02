"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { FormInput, FormSelect, FormTextarea } from "@/components/shared";
import {
  FaUser,
  FaEnvelope,
  FaCompass,
  FaGlobe,
  FaCheckCircle,
  FaArrowRight,
  FaMagic
} from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";

const demoSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  travelDestination: z.string().min(1, { message: "Please select a travel destination" }),
  travelType: z.string().min(1, { message: "Please select a travel type" }),
  specialNotes: z
    .string()
    .min(10, { message: "Special notes must be at least 10 characters" })
    .max(300, { message: "Special notes cannot exceed 300 characters" }),
});

type DemoFormData = z.infer<typeof demoSchema>;

export default function DemoPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<DemoFormData | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<DemoFormData>({
    resolver: zodResolver(demoSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      travelDestination: "",
      travelType: "",
      specialNotes: "",
    },
  });

  const notesValue = watch("specialNotes", "");

  const onSubmit = async (data: DemoFormData) => {
    setIsSubmitting(true);
    setSuccessData(null);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setSuccessData(data);
    setIsSubmitting(false);
  };

  const destinationOptions = [
    { label: "Paris, France", value: "paris" },
    { label: "Tokyo, Japan", value: "tokyo" },
    { label: "Bali, Indonesia", value: "bali" },
    { label: "Santorini, Greece", value: "santorini" },
    { label: "Swiss Alps, Switzerland", value: "swiss_alps" },
  ];

  const travelTypeOptions = [
    { label: "Solo Traveler", value: "solo" },
    { label: "Couple / Honeymoon", value: "couple" },
    { label: "Family Vacation", value: "family" },
    { label: "Adventure / Backpacking", value: "adventure" },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 relative overflow-hidden font-sans py-12 px-4 sm:px-6 flex flex-col items-center justify-center">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-indigo-600/30 to-purple-600/30 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-cyan-600/20 to-blue-700/30 blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <FaMagic className="h-3.5 w-3.5" />
            <span>React Icons & Shared Components</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Travel Planner Form
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-md">
            Demonstration of reusable <span className="text-indigo-400 font-semibold">FormInput</span>, <span className="text-indigo-400 font-semibold">FormSelect</span>, and <span className="text-indigo-400 font-semibold">FormTextarea</span> powered by <span className="text-indigo-400 font-semibold">react-icons</span>.
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-black/50 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

          {successData && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-start gap-3 animate-in fade-in duration-300">
              <FaCheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Form Submitted Successfully!</p>
                <p className="text-xs text-emerald-400/80 mt-1">
                  Destination: {successData.travelDestination} | Type: {successData.travelType}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            
            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Full Name"
                placeholder="John Doe"
                icon={<FaUser className="h-4 w-4" />}
                error={errors.fullName?.message}
                {...register("fullName")}
              />

              <FormInput
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                icon={<FaEnvelope className="h-4 w-4" />}
                error={errors.email?.message}
                {...register("email")}
              />
            </div>

            {/* Selects Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Controller
                name="travelDestination"
                control={control}
                render={({ field }) => (
                  <FormSelect
                    label="Destination"
                    placeholder="Choose Destination"
                    icon={<FaCompass className="h-4 w-4" />}
                    options={destinationOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    error={errors.travelDestination?.message}
                  />
                )}
              />

              <Controller
                name="travelType"
                control={control}
                render={({ field }) => (
                  <FormSelect
                    label="Travel Style"
                    placeholder="Choose Travel Style"
                    icon={<FaGlobe className="h-4 w-4" />}
                    options={travelTypeOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    error={errors.travelType?.message}
                  />
                )}
              />
            </div>

            {/* Textarea */}
            <FormTextarea
              label="Special Requests / Notes"
              placeholder="Tell us about your preferences, budget, or dietary needs..."
              rows={4}
              maxLength={300}
              showCharCount
              value={notesValue}
              error={errors.specialNotes?.message}
              helperText="Share any specific requirements for your trip."
              {...register("specialNotes")}
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 p-[1px] font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-indigo-500/40 active:scale-[0.99] disabled:opacity-70"
            >
              <div className="w-full bg-slate-950/20 group-hover:bg-transparent rounded-[11px] py-3.5 px-4 flex items-center justify-center gap-2 text-sm font-semibold transition-colors">
                {isSubmitting ? (
                  <>
                    <CgSpinner className="h-4 w-4 animate-spin text-white" />
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Travel Plan</span>
                    <FaArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </div>
            </button>
          </form>
        </div>

        {/* Navigation Footer */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-400">
          <Link href="/login" className="hover:text-indigo-400 transition-colors">
            &larr; Login Page
          </Link>
          <span>•</span>
          <Link href="/signup" className="hover:text-indigo-400 transition-colors">
            Sign Up Page &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
