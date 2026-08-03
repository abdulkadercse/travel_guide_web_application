"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useCreateUserMutation } from "@/redux/features/user/userApi";
import { ImageSlider } from "@/components/ui/image-slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCompass,
  FaGoogle
} from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";

// Localized images of Bangladesh Travel Spots saved in public/images
const bdTravelImages = [
  {
    url: "/images/paharpur.jpg",
    title: "Sompura Mahavihara",
    location: "Paharpur, Naogaon",
  },
  {
    url: "/images/coxs-bazar.jpg",
    title: "Cox's Bazar Sea Beach",
    location: "Cox's Bazar, Bangladesh",
  },
  {
    url: "/images/bandarban.jpg",
    title: "Nilgiri Mountain Range",
    location: "Bandarban",
  },
  {
    url: "/images/sylhet.jpg",
    title: "Lush Green Tea Gardens",
    location: "Sylhet",
  },
];

// Zod schema with password matching validation
const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Full name must be at least 2 characters" }),
    phone: z
      .string()
      .min(7, { message: "Please enter a valid phone number" })
      .regex(/^[0-9+\s()-]+$/, { message: "Invalid phone format" }),
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Please enter a valid email" }),
    address: z
      .string()
      .min(4, { message: "Address must be at least 4 characters" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm password" }),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept terms",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [createUser, { isLoading }] = useCreateUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    const toastId = toast.loading("Creating your account...");

    try {
      const res = await createUser({
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        password: data.password,
      }).unwrap();

      if (res?.success) {
        toast.success("Account created successfully! Redirecting to login...", { id: toastId });

        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.message || "Registration failed. Please try again.";
      toast.error(errorMessage, { id: toastId });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 120,
        damping: 14,
      },
    },
  };

  return (
    <div className="bg-[url('/images/bg-travel.jpg')] bg-cover bg-center w-full min-h-screen flex items-center justify-center p-3 sm:p-6 font-sans relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Background Dark Overlay Filter */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]" />

      <motion.div
        className="w-full max-w-5xl bg-slate-900/70 backdrop-blur-xl border border-white/15 rounded-2xl overflow-hidden shadow-2xl shadow-black/80 grid grid-cols-1 lg:grid-cols-12 min-h-[640px] relative z-10"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Top Highlight border line */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

        {/* Left Side: Bangladesh Travel Spots Image Slider (5 Cols on LG) */}
        <div className="hidden lg:block lg:col-span-5 relative overflow-hidden">
          <ImageSlider images={bdTravelImages} interval={4500} />
          {/* Top Logo Badge */}
          <div className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-slate-950/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 shadow-lg">
            <FaCompass className="h-4 w-4 text-emerald-400 animate-pulse" />
            <span className="text-sm font-bold tracking-wide text-white">Travla BD</span>
          </div>
        </div>

        {/* Right Side: Sign Up Form (7 Cols on LG) */}
        <div className="lg:col-span-7 w-full flex flex-col justify-center p-5 sm:p-8">
          <motion.div
            className="w-full max-w-lg mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="mb-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Create Account
                </h1>
                <span className="text-xs text-slate-400">
                  Already a member?{" "}
                  <Link href="/login" className="text-indigo-400 font-semibold hover:underline">
                    Log in
                  </Link>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Explore Bangladesh&apos;s finest travel destinations with Travla
              </p>
            </motion.div>

            {/* Form */}
            <motion.form variants={itemVariants} onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
              
              {/* Grid: Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <Label htmlFor="name" className="text-xs text-slate-300 font-semibold">Full Name</Label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      {...register("name")}
                      className={`h-8 text-xs pl-8 bg-slate-950/60 border-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:ring-indigo-500 ${errors.name ? "border-rose-500" : ""}`}
                    />
                  </div>
                  {errors.name && <p className="text-[10px] text-rose-400 mt-0.5">{errors.name.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="phone" className="text-xs text-slate-300 font-semibold">Phone Number</Label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+880 1700-000000"
                      {...register("phone")}
                      className={`h-8 text-xs pl-8 bg-slate-950/60 border-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:ring-indigo-500 ${errors.phone ? "border-rose-500" : ""}`}
                    />
                  </div>
                  {errors.phone && <p className="text-[10px] text-rose-400 mt-0.5">{errors.phone.message}</p>}
                </div>
              </div>

              {/* Grid: Email & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-xs text-slate-300 font-semibold">Email Address</Label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      {...register("email")}
                      className={`h-8 text-xs pl-8 bg-slate-950/60 border-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:ring-indigo-500 ${errors.email ? "border-rose-500" : ""}`}
                    />
                  </div>
                  {errors.email && <p className="text-[10px] text-rose-400 mt-0.5">{errors.email.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="address" className="text-xs text-slate-300 font-semibold">Address</Label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                    <Input
                      id="address"
                      type="text"
                      placeholder="Dhaka, Bangladesh"
                      {...register("address")}
                      className={`h-8 text-xs pl-8 bg-slate-950/60 border-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:ring-indigo-500 ${errors.address ? "border-rose-500" : ""}`}
                    />
                  </div>
                  {errors.address && <p className="text-[10px] text-rose-400 mt-0.5">{errors.address.message}</p>}
                </div>
              </div>

              {/* Grid: Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <Label htmlFor="password" className="text-xs text-slate-300 font-semibold">Password</Label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("password")}
                      className={`h-8 text-xs pl-8 pr-8 bg-slate-950/60 border-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:ring-indigo-500 ${errors.password ? "border-rose-500" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.password && <p className="text-[10px] text-rose-400 mt-0.5">{errors.password.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="confirmPassword" className="text-xs text-slate-300 font-semibold">Confirm Password</Label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("confirmPassword")}
                      className={`h-8 text-xs pl-8 pr-8 bg-slate-950/60 border-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:ring-indigo-500 ${errors.confirmPassword ? "border-rose-500" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-[10px] text-rose-400 mt-0.5">{errors.confirmPassword.message}</p>}
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("terms")}
                    className="h-3.5 w-3.5 rounded border-slate-800 bg-slate-950 text-indigo-500 focus:ring-indigo-500/20"
                  />
                  <span className="text-[11px] text-slate-400">
                    I agree to the <a href="#terms" onClick={(e) => e.preventDefault()} className="text-indigo-400 hover:underline">Terms & Conditions</a>
                  </span>
                </label>
                {errors.terms && <p className="text-[10px] text-rose-400 mt-0.5">{errors.terms.message}</p>}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-9 text-xs bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-indigo-500/20 transition-all mt-1"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <CgSpinner className="h-3.5 w-3.5 animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </Button>
            </motion.form>

            {/* Divider */}
            <motion.div variants={itemVariants} className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                <span className="bg-slate-900 px-2 text-slate-500 font-medium">Or continue with</span>
              </div>
            </motion.div>

            {/* Google Signup Button at Bottom */}
            <motion.div variants={itemVariants}>
              <Button
                type="button"
                variant="outline"
                onClick={() => toast("Google Sign up coming soon!", { icon: "🚀" })}
                className="w-full h-8 text-xs bg-slate-950/40 border-slate-800 text-slate-200 hover:bg-slate-800 hover:text-white font-medium"
              >
                <FaGoogle className="mr-2 h-3.5 w-3.5 text-rose-500" />
                Sign up with Google
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
