"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout, selectCurrentUser } from "@/redux/features/auth/authSlice";
import {
  FaSun,
  FaMoon,
  FaSignOutAlt,
  FaChevronDown,
  FaGlobe,
  FaUser,
} from "react-icons/fa";

export function DashboardThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="rounded-full text-muted-foreground cursor-pointer"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {/* Rendered from the theme class, so the icon needs no mount guard. */}
      <FaSun className="hidden h-3.5 w-3.5 dark:block" />
      <FaMoon className="h-3.5 w-3.5 dark:hidden" />
    </Button>
  );
}

export function DashboardUserMenu() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector(selectCurrentUser);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close the account menu when clicking anywhere else.
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (!user) return null;

  const handleLogout = () => {
    setOpen(false);
    dispatch(logout());
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2.5 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <Avatar src={user.avatar} fallback={user.name} className="h-7 w-7" />
        <span className="hidden max-w-[110px] truncate text-sm sm:inline-block">
          {user.name?.split(" ")[0]}
        </span>
        <FaChevronDown className="hidden h-2.5 w-2.5 text-muted-foreground sm:block" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-popover shadow-lg z-50"
        >
          <div className="border-b border-border px-3.5 py-3">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
            <span className="mt-2 inline-block rounded-full bg-primary-soft px-2 py-0.5 text-xs font-medium text-primary">
              {user.role?.replace("_", " ")}
            </span>
          </div>

          <div className="p-1.5">
            <Link
              href="/dashboard/user"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-accent"
            >
              <FaUser className="h-3.5 w-3.5 text-muted-foreground" />
              My Profile
            </Link>
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-accent"
            >
              <FaGlobe className="h-3.5 w-3.5 text-primary" />
              Main Website
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10 cursor-pointer"
            >
              <FaSignOutAlt className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
