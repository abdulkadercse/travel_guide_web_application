"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ProtectedRoute } from "@/components/shared";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout, selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useTheme } from "next-themes";
import {
  FaCompass,
  FaUser,
  FaHeart,
  FaShieldAlt,
  FaUsers,
  FaSignOutAlt,
  FaSun,
  FaMoon,
  FaGlobe,
  FaBars,
  FaTimes,
  FaChevronRight,
  FaRoute,
  FaCalendarCheck,
  FaComments,
  FaHotel,
  FaUtensils,
  FaBus,
} from "react-icons/fa";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    router.push("/");
  };

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  const navItems = [
    {
      label: "My Profile",
      href: "/dashboard/user",
      icon: FaUser,
      roles: ["USER", "ADMIN", "SUPER_ADMIN"],
    },
    {
      label: "Custom Trip Plans",
      href: "/dashboard/trip-plans",
      icon: FaRoute,
      roles: ["USER", "ADMIN", "SUPER_ADMIN"],
    },
    {
      label: "My Reservations",
      href: "/dashboard/reservations",
      icon: FaCalendarCheck,
      roles: ["USER", "ADMIN", "SUPER_ADMIN"],
    },
    {
      label: "My Reviews",
      href: "/dashboard/reviews",
      icon: FaComments,
      roles: ["USER", "ADMIN", "SUPER_ADMIN"],
    },
    {
      label: "Saved Favorites",
      href: "/dashboard/favorites",
      icon: FaHeart,
      roles: ["USER", "ADMIN", "SUPER_ADMIN"],
    },
    {
      label: "Admin Overview",
      href: "/dashboard/admin",
      icon: FaShieldAlt,
      roles: ["ADMIN", "SUPER_ADMIN"],
      highlight: true,
    },
    {
      label: "Manage Destinations",
      href: "/dashboard/admin/destinations",
      icon: FaCompass,
      roles: ["ADMIN", "SUPER_ADMIN"],
    },
    {
      label: "Manage Hotels",
      href: "/dashboard/admin/hotels",
      icon: FaHotel,
      roles: ["ADMIN", "SUPER_ADMIN"],
    },
    {
      label: "Manage Restaurants",
      href: "/dashboard/admin/restaurants",
      icon: FaUtensils,
      roles: ["ADMIN", "SUPER_ADMIN"],
    },
    {
      label: "Manage Transportation",
      href: "/dashboard/admin/transportation",
      icon: FaBus,
      roles: ["ADMIN", "SUPER_ADMIN"],
    },
    {
      label: "All Reservations",
      href: "/dashboard/admin/reservations",
      icon: FaCalendarCheck,
      roles: ["ADMIN", "SUPER_ADMIN"],
    },
    {
      label: "Review Moderation",
      href: "/dashboard/admin/reviews",
      icon: FaComments,
      roles: ["ADMIN", "SUPER_ADMIN"],
    },
    {
      label: "User Management",
      href: "/dashboard/all-users",
      icon: FaUsers,
      roles: ["ADMIN", "SUPER_ADMIN"],
    },
  ];

  const filteredNavItems = navItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  return (
    <ProtectedRoute allowedRoles={["USER", "ADMIN", "SUPER_ADMIN"]}>
      <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300 font-sans">
        {/* Sidebar for Desktop */}
        <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-border bg-card/60 backdrop-blur-xl shrink-0 p-4 sticky top-0 h-screen z-30 overflow-hidden">
          {/* Scrollable Nav Area */}
          <div className="flex-1 overflow-y-auto pr-1.5 space-y-5 scrollbar-thin scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/40">
            {/* Logo & Brand */}
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="h-9 w-9 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 shadow-sm group-hover:scale-105 transition-transform">
                  <FaCompass className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="text-lg font-black tracking-wider text-foreground block leading-none">
                    Travla<span className="text-indigo-500">BD</span>
                  </span>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block mt-0.5">
                    Dashboard
                  </span>
                </div>
              </Link>
            </div>

            {/* User Mini Profile Card */}
            <div className="p-3 rounded-2xl bg-primary-soft/30 border border-border flex items-center gap-2.5">
              <Avatar src={user?.avatar} fallback={user?.name} className="h-9 w-9 ring-2 ring-primary/20 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-foreground truncate">{user?.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
                <span className="inline-block mt-0.5 px-2 py-0.2 rounded-full text-[8px] font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">
                  {user?.role}
                </span>
              </div>
            </div>

            {/* Sidebar Nav Links */}
            <nav className="space-y-1">
              <p className="px-2.5 text-[9px] font-bold uppercase tracking-widest text-muted-foreground pb-1">
                Navigation Menu
              </p>
              {filteredNavItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                        : item.highlight
                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-card/80 border border-transparent hover:border-border"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`h-3.5 w-3.5 ${isActive ? "text-white" : ""}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {isActive && <FaChevronRight className="h-2.5 w-2.5 text-white/80 shrink-0" />}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Bottom Controls */}
          <div className="shrink-0 pt-3 border-t border-border space-y-1.5 bg-card/60">
            <Link
              href="/"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-card border border-transparent hover:border-border transition-all"
            >
              <FaGlobe className="h-3.5 w-3.5 text-indigo-500" />
              <span>Back to Main Site</span>
            </Link>

            <div className="flex items-center justify-between px-3 py-1">
              <span className="text-[11px] font-semibold text-muted-foreground">Theme</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-7 rounded-full px-2.5 text-[11px] font-semibold"
              >
                {mounted && theme === "dark" ? (
                  <span className="flex items-center gap-1 text-amber-400"><FaSun className="h-2.5 w-2.5" /> Dark</span>
                ) : (
                  <span className="flex items-center gap-1 text-slate-700"><FaMoon className="h-2.5 w-2.5" /> Light</span>
                )}
              </Button>
            </div>

            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 cursor-pointer"
            >
              <FaSignOutAlt className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </Button>
          </div>
        </aside>

        {/* Mobile Header Bar (< 1024px) */}
        <div className="flex lg:hidden flex-col w-full min-h-screen">
          <header className="sticky top-0 z-40 h-16 border-b border-border bg-background/90 backdrop-blur-md px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="rounded-xl"
              >
                {mobileOpen ? <FaTimes className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
              </Button>
              <Link href="/" className="flex items-center gap-2">
                <FaCompass className="h-5 w-5 text-indigo-500" />
                <span className="text-lg font-extrabold tracking-wider">
                  Travla<span className="text-indigo-500">BD</span>
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <Avatar src={user?.avatar} fallback={user?.name} className="h-8 w-8" />
              <Button variant="ghost" size="icon" onClick={handleLogout} className="text-rose-400">
                <FaSignOutAlt className="h-4 w-4" />
              </Button>
            </div>
          </header>

          {/* Mobile Drawer Overlay */}
          {mobileOpen && (
            <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl p-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b">
                  <span className="text-lg font-bold">Dashboard Menu</span>
                  <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                    <FaTimes className="h-5 w-5" />
                  </Button>
                </div>

                <nav className="space-y-2">
                  {filteredNavItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold ${
                          isActive
                            ? "bg-indigo-600 text-white"
                            : "bg-card border border-border text-foreground"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="space-y-3 pt-6 border-t">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card border text-sm font-bold"
                >
                  <FaGlobe className="h-5 w-5 text-indigo-500" />
                  <span>Back to Main Website</span>
                </Link>
                <Button onClick={handleLogout} className="w-full bg-rose-600 text-white font-bold py-3 rounded-xl">
                  Sign Out
                </Button>
              </div>
            </div>
          )}

          <main className="flex-1 p-4">{children}</main>
        </div>

        {/* Main Workspace Area for Desktop */}
        <div className="hidden lg:flex flex-1 flex-col min-w-0 overflow-y-auto">
          {/* Top Bar for Desktop */}
          <header className="sticky top-0 z-20 h-16 border-b border-border bg-background/80 backdrop-blur-md px-8 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <Link href="/" className="hover:text-foreground">Home</Link>
              <span>/</span>
              <span className="text-foreground font-bold">
                {filteredNavItems.find((i) => i.href === pathname)?.label || "Dashboard"}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-muted-foreground">
                Role: <strong className="text-indigo-400">{user?.role}</strong>
              </span>
              <div className="h-4 w-px bg-border" />
              <Button size="sm" variant="outline" className="rounded-full text-xs font-bold" asChild>
                <Link href="/">Main Website &rarr;</Link>
              </Button>
            </div>
          </header>

          <main className="flex-1 p-8">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
