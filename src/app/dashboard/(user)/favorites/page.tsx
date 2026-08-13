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
import FavoritesContainer from "@/components/ui/dashboard/user/favorites/favoritesContainer";
import {
  FaHeart,
  FaArrowLeft,
  FaSun,
  FaMoon,
  FaRightFromBracket,
} from "react-icons/fa6";

export default function UserFavoritesPage() {
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

  return (
    <ProtectedRoute allowedRoles={["USER", "ADMIN", "SUPER_ADMIN"]}>
      <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-md">
          <Container>
            <div className="h-16 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="rounded-xl text-xs font-semibold"
                >
                  <Link href="/dashboard/user">
                    <FaArrowLeft className="mr-1.5 h-3.5 w-3.5 text-primary" /> Back to Dashboard
                  </Link>
                </Button>
                <div className="h-4 w-px bg-border" />
                <span className="text-base font-bold tracking-tight flex items-center gap-2">
                  <FaHeart className="text-amber-500 fill-amber-500 h-4 w-4" />
                  <span>Favorites</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
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

        {/* Main Content: Favorites Container */}
        <main className="flex-1">
          <FavoritesContainer />
        </main>
      </div>
    </ProtectedRoute>
  );
}
