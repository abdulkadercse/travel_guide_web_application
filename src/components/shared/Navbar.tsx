"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import {
  FaCompass,
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaSearch,
  FaPhoneAlt
} from "react-icons/fa";

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Destinations", href: "/#destinations" },
    { name: "Tour Packages", href: "/demo" },
    { name: "Sign Up", href: "/signup" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-background/80 border-b border-border transition-colors duration-300">
      <Container>
        <div className="h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-9 w-9 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <FaCompass className="h-5 w-5 group-hover:rotate-45 transition-transform duration-300" />
            </div>
            <span className="text-xl font-bold tracking-wider text-foreground">
              Travla<span className="text-indigo-500">BD</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors duration-200 ${
                    isActive
                      ? "text-indigo-500 font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action Controls */}
          <div className="flex items-center gap-2.5">
            {/* Theme Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full h-9 w-9"
              title="Toggle Light/Dark Theme"
            >
              {theme === "dark" ? (
                <FaSun className="h-4 w-4 text-amber-400" />
              ) : (
                <FaMoon className="h-4 w-4 text-slate-700" />
              )}
              <span className="sr-only">Toggle Theme</span>
            </Button>

            {/* Log In Button */}
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hidden sm:inline-flex font-semibold"
            >
              <Link href="/login">Log In</Link>
            </Button>

            {/* Sign Up CTA */}
            <Button
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-4 font-semibold shadow-md shadow-indigo-600/20"
              asChild
            >
              <Link href="/signup">Sign Up</Link>
            </Button>

            {/* Mobile Hamburger Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden rounded-lg h-9 w-9"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <FaTimes className="h-5 w-5" />
              ) : (
                <FaBars className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 px-2 space-y-3 bg-background/95 backdrop-blur-xl animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="pt-2 border-t border-border flex flex-col gap-2">
              <Button variant="outline" className="w-full justify-center" asChild>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  Log In
                </Link>
              </Button>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}

export default Navbar;