"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ProtectedRoute, Container } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout, selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useTheme } from "next-themes";
import UserProfileContainer from "@/components/ui/dashboard/user/profile/UserProfileContainer";
import {
  FaCompass,
  FaSun,
  FaMoon,
  FaRightFromBracket,
  FaShieldHalved,
} from "react-icons/fa6";

export default function DashboardProfilePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
  };

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  return (
    <ProtectedRoute allowedRoles={["USER", "ADMIN", "SUPER_ADMIN"]}>
      <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
        {/* Dashboard Top Header */}
        <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-md">
          <Container>
            <div className="h-16 flex items-center justify-between">
              {/* Brand Link */}
              <Link href="/" className="group flex items-center gap-2.5 shrink-0">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <FaCompass className="h-4 w-4 transition-transform duration-500 group-hover:rotate-90" />
                </span>
                <span className="text-lg font-semibold tracking-tight">
                  Travla<span className="text-primary">BD</span>
                </span>
              </Link>

              {/* Header Right Actions */}
              <div className="flex items-center gap-2.5">
                {isAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="rounded-xl text-xs font-semibold gap-1.5 border-primary/40 text-primary"
                  >
                    <Link href="/dashboard/admin">
                      <FaShieldHalved className="h-3.5 w-3.5" />
                      <span>Admin Panel</span>
                    </Link>
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="rounded-xl"
                  title="Toggle Theme"
                >
                  {mounted && theme === "dark" ? (
                    <FaSun className="h-4 w-4 text-amber-400" />
                  ) : (
                    <FaMoon className="h-4 w-4 text-slate-700" />
                  )}
                </Button>

                {user && (
                  <div className="flex items-center gap-2 pl-2 border-l border-border">
                    <Avatar src={user.avatar} fallback={user.name} className="h-8 w-8" />
                    <span className="hidden sm:block text-xs font-medium text-foreground">
                      {user.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={handleLogout}
                      className="rounded-xl text-destructive hover:bg-destructive/10"
                      title="Sign Out"
                    >
                      <FaRightFromBracket className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Container>
        </header>

        {/* User Profile Main View */}
        <main className="flex-1">
          <UserProfileContainer />
        </main>
      </div>
    </ProtectedRoute>
  );
}
