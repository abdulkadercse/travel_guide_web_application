"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FaEye, FaEyeSlash, FaCompass } from "react-icons/fa6";
import { FaSpinner } from "react-icons/fa";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    const toastId = toast.loading("Signing you in...");

    try {
      const res = await login({ email: data.email, password: data.password }).unwrap();

      if (res?.success && res?.data) {
        const { accessToken, refreshToken, user } = res.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));

        dispatch(setUser({ user, token: accessToken }));
        toast.success(`Welcome back, ${user.name.split(" ")[0]}`, { id: toastId });

        const isAdmin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";
        window.location.href = isAdmin ? "/dashboard/admin" : "/dashboard/user";
      }
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ||
        "Invalid credentials. Please try again.";
      toast.error(message, { id: toastId });
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Form side */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FaCompass className="h-4 w-4" />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              Travla<span className="text-primary">BD</span>
            </span>
          </Link>

          <div className="mt-10 space-y-2">
            <h1 className="text-2xl sm:text-3xl">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to pick up where you left off.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                {...register("email")}
                className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  onClick={() => toast("Password reset is coming in the next release.")}
                  className="text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  aria-invalid={Boolean(errors.password)}
                  {...register("password")}
                  className={`pr-10 ${
                    errors.password ? "border-destructive focus-visible:ring-destructive" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? <FaEyeSlash className="h-3.5 w-3.5" /> : <FaEye className="h-3.5 w-3.5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full font-bold h-11 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20"
            >
              {isSubmitting ? <FaSpinner className="animate-spin" /> : "Sign in"}
            </Button>
          </form>

          {/* Quick 1-Click Demo Login Box */}
          <div className="mt-6 p-4 rounded-2xl bg-muted/40 border border-border/80 space-y-3">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              <span>⚡ Quick Demo Logins</span>
              <span className="text-[10px] text-indigo-400 font-mono">Pass: Password123!</span>
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setValue("email", "superadmin@travla.com");
                  setValue("password", "Password123!");
                }}
                className="p-2 rounded-xl bg-card border border-border text-center hover:border-indigo-500 hover:text-indigo-400 transition-all cursor-pointer shadow-xs"
              >
                <p className="text-[11px] font-black text-foreground">Super Admin</p>
                <p className="text-[9px] text-muted-foreground">superadmin</p>
              </button>
              <button
                type="button"
                onClick={() => {
                  setValue("email", "admin@travla.com");
                  setValue("password", "Password123!");
                }}
                className="p-2 rounded-xl bg-card border border-border text-center hover:border-indigo-500 hover:text-indigo-400 transition-all cursor-pointer shadow-xs"
              >
                <p className="text-[11px] font-black text-foreground">Admin</p>
                <p className="text-[9px] text-muted-foreground">admin</p>
              </button>
              <button
                type="button"
                onClick={() => {
                  setValue("email", "ayman@travla.com");
                  setValue("password", "Password123!");
                }}
                className="p-2 rounded-xl bg-card border border-border text-center hover:border-indigo-500 hover:text-indigo-400 transition-all cursor-pointer shadow-xs"
              >
                <p className="text-[11px] font-black text-foreground">Traveler</p>
                <p className="text-[9px] text-muted-foreground">ayman</p>
              </button>
            </div>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            New to Travla?{" "}
            <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Image side */}
      <div className="relative hidden lg:block">
        <Image
          src="/images/bg-travel.jpg"
          alt=""
          fill
          sizes="50vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent" />
        <blockquote className="absolute inset-x-0 bottom-0 p-12">
          <p className="max-w-md text-2xl leading-snug text-white">
            Sixty-four districts, one country worth crossing slowly.
          </p>
          <footer className="mt-3 text-sm text-white/70">Travla BD</footer>
        </blockquote>
      </div>
    </div>
  );
}
