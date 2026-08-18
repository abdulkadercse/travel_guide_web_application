"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout, selectCurrentUser, selectCurrentToken } from "@/redux/features/auth/authSlice";
import {
  FaCompass,
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";

export function Navbar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const token = useAppSelector(selectCurrentToken);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close the account menu when clicking anywhere else.
  useEffect(() => {
    if (!userDropdownOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userDropdownOpen]);

  const handleLogout = () => {
    dispatch(logout());
    setUserDropdownOpen(false);
    toast.success("Logged out successfully");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Destinations", href: "/destinations" },
    { name: "Hotels & Stays", href: "/hotels" },
    { name: "Restaurants", href: "/restaurants" },
    { name: "Transportation", href: "/transportation" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const dashboardHref =
    user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"
      ? "/dashboard/admin"
      : "/dashboard/user";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-sm">
      <Container>
        <div className="flex h-16 items-center justify-between gap-6">
          {/* Brand */}
          <Link href="/" className="group flex items-center gap-2.5 shrink-0">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FaCompass className="h-4 w-4 transition-transform duration-500 group-hover:rotate-90" />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              Travla<span className="text-primary">BD</span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm transition-colors ${
                    isActive
                      ? "font-medium text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="rounded-full text-muted-foreground"
              aria-label={
                mounted && resolvedTheme === "dark"
                  ? "Switch to light theme"
                  : "Switch to dark theme"
              }
            >
              {mounted && resolvedTheme === "dark" ? (
                <FaSun className="h-3.5 w-3.5" />
              ) : (
                <FaMoon className="h-3.5 w-3.5" />
              )}
            </Button>

            {mounted && token && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2.5 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-expanded={userDropdownOpen}
                  aria-haspopup="menu"
                >
                  <Avatar src={user.avatar} fallback={user.name} className="h-7 w-7" />
                  <span className="hidden max-w-[110px] truncate text-sm sm:inline-block">
                    {user.name.split(" ")[0]}
                  </span>
                  <FaChevronDown className="hidden h-2.5 w-2.5 text-muted-foreground sm:block" />
                </button>

                {userDropdownOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-popover shadow-lg"
                  >
                    <div className="border-b border-border px-3.5 py-3">
                      <p className="truncate text-sm font-medium">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                      <span className="mt-2 inline-block rounded-full bg-primary-soft px-2 py-0.5 text-xs font-medium text-primary">
                        {user.role.replace("_", " ")}
                      </span>
                    </div>

                    <div className="p-1.5">
                      <Link
                        href={dashboardHref}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex w-full items-center rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-accent"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                      >
                        <FaSignOutAlt className="h-3.5 w-3.5" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button size="sm" asChild className="rounded-full px-4">
                  <Link href="/signup">Sign up</Link>
                </Button>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="ml-0.5 rounded-full md:hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <FaTimes className="h-4 w-4" /> : <FaBars className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-border py-3 md:hidden">
            <nav className="flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="mt-3 border-t border-border pt-3">
              {mounted && token && user ? (
                <div className="space-y-2">
                  <Link
                    href={dashboardHref}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-accent"
                  >
                    <Avatar src={user.avatar} fallback={user.name} className="h-8 w-8" />
                    <span>
                      <span className="block text-sm font-medium">{user.name}</span>
                      <span className="block text-xs text-muted-foreground">Go to dashboard</span>
                    </span>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-destructive"
                  >
                    <FaSignOutAlt className="mr-2 h-3.5 w-3.5" />
                    Sign out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      Log in
                    </Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                      Sign up
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}

export default Navbar;
