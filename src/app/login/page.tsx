"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import {
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardAction,
  GlassCardContent,
  GlassCardFooter,
} from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaGoogle,
  FaCheckCircle,
  FaExclamationCircle,
  FaCompass
} from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setAuthError(null);
    setAuthSuccess(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (data.email === "error@example.com") {
        throw new Error("Invalid credentials. Please check your email and password.");
      }

      setAuthSuccess(true);
      console.log("Logged in successfully:", data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setAuthError(err.message);
      } else {
        setAuthError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[url('/images/bg-travel.jpg')] bg-cover bg-center w-full min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
      {/* Background Dark Overlay Filter */}
      <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[2px]" />

      <GlassCard className="w-full max-w-md relative z-10 shadow-2xl border-white/15 bg-slate-900/60 backdrop-blur-xl">
        {/* Top Highlight line */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

        <GlassCardHeader>
          <div className="flex items-center gap-2 mb-2">
            <FaCompass className="h-6 w-6 text-indigo-400 animate-pulse" />
            <span className="text-xl font-bold tracking-wider text-white">Travla</span>
          </div>
          <GlassCardTitle className="text-2xl font-bold">Login to your account</GlassCardTitle>
          <GlassCardDescription className="text-slate-300">
            Enter your email below to login to your account
          </GlassCardDescription>
          <GlassCardAction>
            <Button variant="link" className="text-indigo-400 hover:text-indigo-300 p-0" asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </GlassCardAction>
        </GlassCardHeader>

        <GlassCardContent>
          {/* Success Banner */}
          {authSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-2">
              <FaCheckCircle className="h-4 w-4 shrink-0" />
              <span>Authentication successful! Welcome back.</span>
            </div>
          )}

          {/* Error Banner */}
          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-sm flex items-center gap-2">
              <FaExclamationCircle className="h-4 w-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="flex flex-col gap-4">
              {/* Email Field */}
              <div className="grid gap-1.5">
                <Label htmlFor="email" className="text-slate-200 font-semibold">Email</Label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    autoComplete="email"
                    {...register("email")}
                    className={`pl-9 bg-slate-950/60 text-white placeholder:text-slate-400 border-slate-800 focus-visible:ring-indigo-500 ${
                      errors.email ? "border-rose-500 focus-visible:ring-rose-500" : ""
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-rose-400 flex items-center gap-1 mt-0.5">
                    <FaExclamationCircle className="h-3 w-3" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="grid gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-200 font-semibold">Password</Label>
                  <a
                    href="#forgot-password"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Forgot password flow triggered.");
                    }}
                    className="text-xs text-indigo-400 underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    {...register("password")}
                    className={`pl-9 pr-10 bg-slate-950/60 text-white placeholder:text-slate-400 border-slate-800 focus-visible:ring-indigo-500 ${
                      errors.password ? "border-rose-500 focus-visible:ring-rose-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 focus:outline-none"
                  >
                    {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-rose-400 flex items-center gap-1 mt-0.5">
                    <FaExclamationCircle className="h-3 w-3" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  id="rememberMe"
                  type="checkbox"
                  {...register("rememberMe")}
                  className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
                />
                <Label htmlFor="rememberMe" className="text-xs text-slate-300 cursor-pointer">
                  Remember me for 30 days
                </Label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-indigo-500/20"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <CgSpinner className="h-4 w-4 animate-spin" />
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </GlassCardContent>

        <GlassCardFooter className="flex-col gap-3">
          <div className="relative w-full my-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-2 text-slate-400 font-medium">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => alert("Google Sign in simulated")}
            className="w-full bg-slate-950/40 border-slate-800 text-white hover:bg-slate-800/60 font-medium"
          >
            <FaGoogle className="mr-2 h-4 w-4 text-rose-500" />
            Login with Google
          </Button>
        </GlassCardFooter>
      </GlassCard>
    </div>
  );
}
