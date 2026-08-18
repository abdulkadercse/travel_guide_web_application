"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLocationDot,
  FaShieldHalved,
  FaHeart,
  FaRoute,
  FaCompass,
  FaLock,
} from "react-icons/fa6";

interface UserProfileDetailsProps {
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    address?: string | null;
    role?: string;
    status?: string;
    isVerified?: boolean;
  };
  onOpenEdit: () => void;
}

export function UserProfileDetails({ user, onOpenEdit }: UserProfileDetailsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left Column: Personal Information */}
      <div className="lg:col-span-8 space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-border/80 pb-4">
            <div>
              <h2 className="text-lg font-medium text-foreground flex items-center gap-2">
                <FaUser className="h-4 w-4 text-primary" />
                <span>Personal Information</span>
              </h2>
              <p className="text-xs text-muted-foreground">
                Your personal details and contact profile on Travla BD
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenEdit}
              className="rounded-xl text-xs font-semibold"
            >
              Edit
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Full Name */}
            <div className="space-y-1 rounded-2xl border border-border/60 bg-secondary/30 p-4">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <FaUser className="h-3 w-3 text-primary" />
                Full Name
              </span>
              <p className="text-sm font-semibold text-foreground">{user.name}</p>
            </div>

            {/* Email Address */}
            <div className="space-y-1 rounded-2xl border border-border/60 bg-secondary/30 p-4">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <FaEnvelope className="h-3 w-3 text-primary" />
                Email Address
              </span>
              <p className="text-sm font-semibold text-foreground truncate">{user.email}</p>
            </div>

            {/* Phone Number */}
            <div className="space-y-1 rounded-2xl border border-border/60 bg-secondary/30 p-4">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <FaPhone className="h-3 w-3 text-primary" />
                Phone Number
              </span>
              <p className="text-sm font-semibold text-foreground">
                {user.phone || <span className="text-xs text-muted-foreground font-normal italic">Not provided</span>}
              </p>
            </div>

            {/* Address */}
            <div className="space-y-1 rounded-2xl border border-border/60 bg-secondary/30 p-4">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <FaLocationDot className="h-3 w-3 text-primary" />
                Address / Location
              </span>
              <p className="text-sm font-semibold text-foreground">
                {user.address || <span className="text-xs text-muted-foreground font-normal italic">Not provided</span>}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Travel Navigation Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
          <h2 className="text-base font-medium text-foreground">Quick Shortcuts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              href="/dashboard/favorites"
              className="flex items-center gap-3 rounded-2xl border border-border/80 bg-secondary/40 p-3.5 transition-all hover:bg-secondary hover:border-primary/40 hover:-translate-y-0.5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500">
                <FaHeart className="h-4 w-4 fill-rose-500" />
              </span>
              <div>
                <p className="text-xs font-medium text-foreground">My Favorites</p>
                <p className="text-xs text-muted-foreground">Saved destinations</p>
              </div>
            </Link>

            <Link
              href="/dashboard/user"
              className="flex items-center gap-3 rounded-2xl border border-border/80 bg-secondary/40 p-3.5 transition-all hover:bg-secondary hover:border-primary/40 hover:-translate-y-0.5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FaRoute className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-medium text-foreground">Trip Planner</p>
                <p className="text-xs text-muted-foreground">Manage itineraries</p>
              </div>
            </Link>

            <Link
              href="/#destinations"
              className="flex items-center gap-3 rounded-2xl border border-border/80 bg-secondary/40 p-3.5 transition-all hover:bg-secondary hover:border-primary/40 hover:-translate-y-0.5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FaCompass className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-medium text-foreground">Explore Spots</p>
                <p className="text-xs text-muted-foreground">Browse Bangladesh</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column: Account & Security */}
      <div className="lg:col-span-4 space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-5">
          <div className="border-b border-border/80 pb-4">
            <h2 className="text-base font-medium text-foreground flex items-center gap-2">
              <FaShieldHalved className="h-4 w-4 text-primary" />
              <span>Account Status</span>
            </h2>
            <p className="text-xs text-muted-foreground">Security & role privileges</p>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-border/60">
              <span className="text-muted-foreground">Account Role</span>
              <span className="font-semibold text-primary">{user.role || "USER"}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-border/60">
              <span className="text-muted-foreground">Account Status</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {user.status || "ACTIVE"}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-border/60">
              <span className="text-muted-foreground">Profile Verified</span>
              <span className="font-semibold text-foreground">
                {user.isVerified ? "Yes" : "Standard"}
              </span>
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenEdit}
                className="w-full rounded-xl text-xs font-semibold h-9"
              >
                Update Profile Info
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfileDetails;
