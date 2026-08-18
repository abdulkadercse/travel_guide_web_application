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
import {
  FaEye,
  FaEyeSlash,
  FaCompass,
  FaEnvelope,
  FaLock,
  FaArrowLeftLong,
  FaArrowRightLong,
  FaCrown,
  FaUserShield,
  FaUser,
  FaStar,
  FaLocationDot,
} from "react-icons/fa6";
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

const DEMO_PASSWORD = "Password123!";

/* One row per seeded demo account, so the buttons stay data-driven. */
const demoAccounts = [
  { label: "Super Admin", email: "superadmin@travla.com", icon: FaCrown },
  { label: "Admin", email: "admin@travla.com", icon: FaUserShield },
  { label: "Traveler", email: "ayman@travla.com", icon: FaUser },
] as const;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [filledDemo, setFilledDemo] = useState<string | null>(null);
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

  const busy = isSubmitting || isLoading;

  const fillDemo = (email: string) => {
    setValue("email", email, { shouldValidate: true });
    setValue("password", DEMO_PASSWORD, { shouldValidate: true });
    setFilledDemo(email);
  };

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
    <main className="relative min-h-screen overflow-hidden bg-background lg:grid lg:grid-cols-2">
      {/* Ambient teal wash — keeps the space around the form from reading flat. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 h-[26rem] w-[26rem] rounded-full bg-primary-soft opacity-70 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-48 left-1/4 h-[22rem] w-[22rem] rounded-full bg-highlight-soft opacity-60 blur-3xl lg:left-0"
      />

      {/* Form side */}
      <div className="relative flex flex-col px-6 py-8 sm:px-10 lg:px-14 lg:py-10">
        <div className="mx-auto flex w-full max-w-md items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <FaCompass className="h-4 w-4" />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              Travla<span className="text-primary">BD</span>
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <FaArrowLeftLong className="h-3 w-3" />
            Back home
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <p className="eyebrow">Welcome back</p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-[-0.015em] sm:text-4xl">
            Sign in to keep exploring
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Your saved spots, bookings and trip plans are waiting exactly where you left them.
          </p>

          <div className="surface mt-7 p-5 sm:p-7">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <FaEnvelope className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    aria-invalid={Boolean(errors.email)}
                    {...register("email")}
                    className={`h-11 rounded-xl pl-10 ${
                      errors.email ? "border-destructive focus-visible:ring-destructive" : ""
                    }`}
                  />
                </div>
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
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
                  <FaLock className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    aria-invalid={Boolean(errors.password)}
                    {...register("password")}
                    className={`h-11 rounded-xl pl-10 pr-11 ${
                      errors.password ? "border-destructive focus-visible:ring-destructive" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-primary"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-3.5 w-3.5" />
                    ) : (
                      <FaEye className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={busy}
                className="group h-12 w-full rounded-xl text-base"
              >
                {busy ? (
                  <FaSpinner className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Sign in
                    <FaArrowRightLong className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </Button>
            </form>

            {/* Quick 1-click demo logins */}
            <div className="mt-6">
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Or try a demo account
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2.5">
                {demoAccounts.map(({ label, email, icon: Icon }) => {
                  const active = filledDemo === email;
                  return (
                    <button
                      key={email}
                      type="button"
                      onClick={() => fillDemo(email)}
                      className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition-all hover:-translate-y-0.5 ${
                        active
                          ? "border-primary bg-primary-soft text-primary"
                          : "border-border bg-card text-foreground hover:border-primary/40 hover:text-primary"
                      }`}
                    >
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                          active
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-xs font-medium leading-tight">{label}</span>
                    </button>
                  );
                })}
              </div>

              <p className="mt-3 text-center text-xs text-muted-foreground">
                All demo accounts use{" "}
                <span className="font-mono text-foreground">{DEMO_PASSWORD}</span>
              </p>
            </div>
          </div>

          <p className="mt-7 text-center text-sm text-muted-foreground">
            New to Travla?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Image side */}
      <div className="relative hidden p-3 lg:block">
        <div className="relative h-full w-full overflow-hidden rounded-3xl">
          <Image
            src="/images/bg-travel.jpg"
            alt=""
            fill
            sizes="50vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/25 to-stone-950/10" />

          {/* Glass chips: small proof points laid over the photography. */}
          <div className="absolute inset-x-0 top-0 flex flex-wrap items-center gap-2 p-8">
            <span className="chip-glass inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium">
              <FaLocationDot className="h-3 w-3" />
              64 districts mapped
            </span>
            <span className="chip-glass inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium">
              <FaStar className="h-3 w-3 text-highlight" />
              4.8 traveller rating
            </span>
          </div>

          <blockquote className="absolute inset-x-0 bottom-0 p-10">
            <p className="max-w-md text-3xl font-semibold leading-[1.15] tracking-[-0.015em] text-white">
              Sixty-four districts, one country worth crossing slowly.
            </p>
            <footer className="mt-4 flex items-center gap-2.5 text-sm text-white/75">
              <span className="chip-glass flex h-8 w-8 items-center justify-center">
                <FaCompass className="h-3.5 w-3.5" />
              </span>
              Travla BD
            </footer>
          </blockquote>
        </div>
      </div>
    </main>
  );
}
