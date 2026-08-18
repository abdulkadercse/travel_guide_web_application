"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { useCreateUserMutation } from "@/redux/features/user/userApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FaEye,
  FaEyeSlash,
  FaCompass,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLocationDot,
  FaLock,
  FaArrowLeftLong,
  FaArrowRightLong,
  FaCircleCheck,
} from "react-icons/fa6";
import { CgSpinner } from "react-icons/cg";

const signupSchema = z
  .object({
    name: z.string().min(2, { message: "Full name must be at least 2 characters" }),
    phone: z
      .string()
      .min(7, { message: "Please enter a valid phone number" })
      .regex(/^[0-9+\s()-]+$/, { message: "Invalid phone format" }),
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Please enter a valid email" }),
    address: z.string().min(4, { message: "Address must be at least 4 characters" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
    terms: z.boolean().refine((v) => v, { message: "You must accept the terms to continue" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

/* Value props shown over the photography, so the empty half sells the signup. */
const perks = [
  "Free forever — no card needed",
  "Save every spot you fall for",
  "Book stays and transit in minutes",
];

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
        toast.success("Account created. You can sign in now.", { id: toastId });
        window.location.href = "/login";
      }
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(message, { id: toastId });
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background lg:grid lg:grid-cols-2">
      {/* Ambient wash, mirrored from the login screen. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[26rem] w-[26rem] rounded-full bg-primary-soft opacity-70 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-48 right-1/4 h-[22rem] w-[22rem] rounded-full bg-highlight-soft opacity-60 blur-3xl lg:right-0"
      />

      {/* Image side */}
      <div className="relative hidden p-3 lg:block">
        <div className="relative h-full w-full overflow-hidden rounded-3xl">
          <Image
            src="/images/bandarban.jpg"
            alt=""
            fill
            sizes="50vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-stone-950/10" />

          <div className="absolute inset-x-0 bottom-0 p-10">
            <ul className="mb-8 space-y-2.5">
              {perks.map((perk) => (
                <li key={perk} className="flex items-center gap-2.5 text-sm text-white/85">
                  <span className="chip-glass flex h-6 w-6 shrink-0 items-center justify-center">
                    <FaCircleCheck className="h-3 w-3" />
                  </span>
                  {perk}
                </li>
              ))}
            </ul>

            <blockquote>
              <p className="max-w-md text-3xl font-semibold leading-[1.15] tracking-[-0.015em] text-white">
                Save the places you love. Plan the trip once, take it as many times as you like.
              </p>
              <footer className="mt-4 flex items-center gap-2.5 text-sm text-white/75">
                <span className="chip-glass flex h-8 w-8 items-center justify-center">
                  <FaLocationDot className="h-3.5 w-3.5" />
                </span>
                Nilgiri, Bandarban
              </footer>
            </blockquote>
          </div>
        </div>
      </div>

      {/* Form side */}
      <div className="relative flex flex-col px-6 py-8 sm:px-10 lg:px-14 lg:py-10">
        <div className="mx-auto flex w-full max-w-lg items-center justify-between">
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

        <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center py-10">
          <p className="eyebrow">Join Travla</p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-[-0.015em] sm:text-4xl">
            Create your account
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Free, and it takes less than a minute. Then every district is one tap away.
          </p>

          <div className="surface mt-7 p-5 sm:p-7">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <Field
                id="name"
                label="Full name"
                placeholder="Abdul Kader"
                autoComplete="name"
                icon={FaUser}
                error={errors.name?.message}
                {...register("name")}
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  id="email"
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  icon={FaEnvelope}
                  error={errors.email?.message}
                  {...register("email")}
                />
                <Field
                  id="phone"
                  label="Phone"
                  placeholder="01700000000"
                  autoComplete="tel"
                  icon={FaPhone}
                  error={errors.phone?.message}
                  {...register("phone")}
                />
              </div>

              <Field
                id="address"
                label="Address"
                placeholder="Dhaka, Bangladesh"
                autoComplete="street-address"
                icon={FaLocationDot}
                error={errors.address?.message}
                {...register("address")}
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  id="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  icon={FaLock}
                  error={errors.password?.message}
                  reveal={showPassword}
                  onToggleReveal={() => setShowPassword(!showPassword)}
                  {...register("password")}
                />
                <Field
                  id="confirmPassword"
                  label="Confirm password"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  icon={FaLock}
                  error={errors.confirmPassword?.message}
                  reveal={showConfirm}
                  onToggleReveal={() => setShowConfirm(!showConfirm)}
                  {...register("confirmPassword")}
                />
              </div>

              <div className="space-y-1.5 rounded-xl bg-secondary/60 p-3.5">
                <div className="flex items-start gap-2.5">
                  <input
                    id="terms"
                    type="checkbox"
                    {...register("terms")}
                    className="mt-0.5 h-4 w-4 rounded border-input accent-[var(--primary)] focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <Label
                    htmlFor="terms"
                    className="cursor-pointer text-sm font-normal leading-snug text-muted-foreground"
                  >
                    I agree to the terms of service and privacy policy.
                  </Label>
                </div>
                {errors.terms && <p className="text-xs text-destructive">{errors.terms.message}</p>}
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="group h-12 w-full rounded-xl text-base"
              >
                {isLoading ? (
                  <>
                    <CgSpinner className="mr-2 h-4 w-4 animate-spin" />
                    Creating account
                  </>
                ) : (
                  <>
                    Create account
                    <FaArrowRightLong className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </Button>
            </form>
          </div>

          <p className="mt-7 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

/** A labelled input with a leading icon, optional reveal toggle and inline error
    text — keeps the long form readable and every field styled the same way. */
const Field = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Input> & {
    id: string;
    label: string;
    error?: string;
    icon?: React.ComponentType<{ className?: string }>;
    reveal?: boolean;
    onToggleReveal?: () => void;
  }
>(({ id, label, error, className, icon: Icon, reveal, onToggleReveal, ...props }, ref) => (
  <div className="space-y-1.5">
    <Label htmlFor={id}>{label}</Label>
    <div className="relative">
      {Icon && (
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
      )}
      <Input
        id={id}
        ref={ref}
        aria-invalid={Boolean(error)}
        className={`h-11 rounded-xl ${Icon ? "pl-10" : ""} ${onToggleReveal ? "pr-11" : ""} ${
          error ? "border-destructive focus-visible:ring-destructive" : ""
        } ${className ?? ""}`}
        {...props}
      />
      {onToggleReveal && (
        <button
          type="button"
          onClick={onToggleReveal}
          aria-label={reveal ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-primary"
        >
          {reveal ? <FaEyeSlash className="h-3.5 w-3.5" /> : <FaEye className="h-3.5 w-3.5" />}
        </button>
      )}
    </div>
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
));
Field.displayName = "Field";
