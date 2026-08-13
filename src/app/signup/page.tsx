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
import { FaEye, FaEyeSlash, FaCompass } from "react-icons/fa6";
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

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Image side */}
      <div className="relative hidden lg:block">
        <Image
          src="/images/bandarban.jpg"
          alt=""
          fill
          sizes="50vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent" />
        <blockquote className="absolute inset-x-0 bottom-0 p-12">
          <p className="max-w-md text-2xl leading-snug text-white">
            Save the places you love. Plan the trip once, take it as many times as you like.
          </p>
          <footer className="mt-3 text-sm text-white/70">Nilgiri, Bandarban</footer>
        </blockquote>
      </div>

      {/* Form side */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FaCompass className="h-4 w-4" />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              Travla<span className="text-primary">BD</span>
            </span>
          </Link>

          <div className="mt-10 space-y-2">
            <h1 className="text-2xl sm:text-3xl">Create your account</h1>
            <p className="text-sm text-muted-foreground">
              Free, and it takes less than a minute.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
            <Field
              id="name"
              label="Full name"
              placeholder="Abdul Kader"
              autoComplete="name"
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
                error={errors.email?.message}
                {...register("email")}
              />
              <Field
                id="phone"
                label="Phone"
                placeholder="01700000000"
                autoComplete="tel"
                error={errors.phone?.message}
                {...register("phone")}
              />
            </div>

            <Field
              id="address"
              label="Address"
              placeholder="Dhaka, Bangladesh"
              autoComplete="street-address"
              error={errors.address?.message}
              {...register("address")}
            />

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
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

            <Field
              id="confirmPassword"
              label="Confirm password"
              type="password"
              placeholder="Repeat your password"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />

            <div className="space-y-1.5">
              <div className="flex items-start gap-2.5">
                <input
                  id="terms"
                  type="checkbox"
                  {...register("terms")}
                  className="mt-0.5 h-4 w-4 rounded border-input text-primary focus-visible:ring-2 focus-visible:ring-ring"
                />
                <Label htmlFor="terms" className="cursor-pointer text-sm font-normal leading-snug text-muted-foreground">
                  I agree to the terms of service and privacy policy.
                </Label>
              </div>
              {errors.terms && <p className="text-xs text-destructive">{errors.terms.message}</p>}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <CgSpinner className="mr-2 h-4 w-4 animate-spin" />
                  Creating account
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <p className="mt-8 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/** A labelled input with inline error text — keeps the long form readable. */
const Field = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Input> & { id: string; label: string; error?: string }
>(({ id, label, error, className, ...props }, ref) => (
  <div className="space-y-1.5">
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      ref={ref}
      aria-invalid={Boolean(error)}
      className={`${error ? "border-destructive focus-visible:ring-destructive" : ""} ${
        className ?? ""
      }`}
      {...props}
    />
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
));
Field.displayName = "Field";
