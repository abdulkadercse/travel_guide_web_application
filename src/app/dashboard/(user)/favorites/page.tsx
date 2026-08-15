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
    <div className="space-y-6">
      <FavoritesContainer />
    </div>
  );
}
