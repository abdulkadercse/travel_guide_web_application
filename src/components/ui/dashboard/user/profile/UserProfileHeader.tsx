"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  FaUserPen,
  FaShieldHalved,
  FaCalendarDays,
  FaHeart,
  FaRoute,
  FaSuitcaseRolling,
  FaCircleCheck,
} from "react-icons/fa6";

interface UserProfileHeaderProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
    role?: string;
    status?: string;
    createdAt?: string;
  };
  stats: {
    favoritesCount: number;
    tripPlansCount: number;
    reservationsCount: number;
  };
  onOpenEdit: () => void;
}

export function UserProfileHeader({
  user,
  stats,
  onOpenEdit,
}: UserProfileHeaderProps) {
  const memberDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Recently";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
      {/* Top Graphic Banner */}
      <div className="relative h-36 sm:h-44 w-full bg-gradient-to-r from-primary via-primary-hover to-primary-hover overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.3),transparent_70%)]" />
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* User Info Bar */}
      <div className="relative px-6 pb-6 pt-0">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-16 sm:-mt-20">
          {/* Avatar and Identity */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
            <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-full border-4 border-card bg-card shadow-md overflow-hidden">
              <Avatar
                src={user.avatar}
                fallback={user.name}
                className="h-full w-full text-2xl font-medium"
              />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-medium tracking-tight text-foreground">
                  {user.name}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-md bg-primary-soft px-2 py-0.5 text-xs font-semibold text-primary">
                  <FaCircleCheck className="h-3 w-3" />
                  <span>{user.role || "Traveller"}</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground">{user.email}</p>
              
              <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-muted-foreground pt-0.5">
                <span className="flex items-center gap-1">
                  <FaCalendarDays className="h-3 w-3 text-primary" />
                  <span>Member since {memberDate}</span>
                </span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  {user.status || "ACTIVE"}
                </span>
              </div>
            </div>
          </div>

          {/* Edit Profile Action */}
          <div className="flex justify-center sm:justify-end">
            <Button
              onClick={onOpenEdit}
              className="rounded-xl shadow-xs gap-2 text-xs sm:text-sm font-semibold h-10 px-5"
            >
              <FaUserPen className="h-3.5 w-3.5" />
              <span>Edit Profile</span>
            </Button>
          </div>
        </div>

        {/* User Summary Stats Tiles */}
        <div className="grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-border/70">
          <div className="rounded-xl border border-border/80 bg-secondary/50 p-3 text-center sm:text-left transition-colors hover:bg-secondary/70">
            <div className="flex items-center justify-center sm:justify-between text-muted-foreground">
              <span className="text-xs font-medium hidden sm:inline">Saved Places</span>
              <FaHeart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
            </div>
            <p className="text-xl sm:text-2xl font-medium text-foreground mt-1">
              {stats.favoritesCount}
            </p>
            <p className="text-xs text-muted-foreground sm:hidden">Favorites</p>
          </div>

          <div className="rounded-xl border border-border/80 bg-secondary/50 p-3 text-center sm:text-left transition-colors hover:bg-secondary/70">
            <div className="flex items-center justify-center sm:justify-between text-muted-foreground">
              <span className="text-xs font-medium hidden sm:inline">Trip Plans</span>
              <FaRoute className="h-3.5 w-3.5 text-primary" />
            </div>
            <p className="text-xl sm:text-2xl font-medium text-foreground mt-1">
              {stats.tripPlansCount}
            </p>
            <p className="text-xs text-muted-foreground sm:hidden">Trip Plans</p>
          </div>

          <div className="rounded-xl border border-border/80 bg-secondary/50 p-3 text-center sm:text-left transition-colors hover:bg-secondary/70">
            <div className="flex items-center justify-center sm:justify-between text-muted-foreground">
              <span className="text-xs font-medium hidden sm:inline">Reservations</span>
              <FaSuitcaseRolling className="h-3.5 w-3.5 text-primary" />
            </div>
            <p className="text-xl sm:text-2xl font-medium text-foreground mt-1">
              {stats.reservationsCount}
            </p>
            <p className="text-xs text-muted-foreground sm:hidden">Bookings</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfileHeader;
