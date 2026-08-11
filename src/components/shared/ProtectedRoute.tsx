"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser, selectCurrentToken } from "@/redux/features/auth/authSlice";
import { FaSpinner, FaShieldAlt } from "react-icons/fa";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const user = useAppSelector(selectCurrentUser);
  const token = useAppSelector(selectCurrentToken);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // 1. Unauthenticated check
    if (!token || !user) {
      toast.error("Please log in to access this page");
      router.push("/login");
      return;
    }

    // 2. Role-based authorization check
    if (allowedRoles && allowedRoles.length > 0) {
      const userRole = user.role?.toUpperCase();
      const hasPermission = allowedRoles.some(
        (role) => role.toUpperCase() === userRole
      );

      if (!hasPermission) {
        toast.error(`Access Denied: ${user.role} role does not have permission`);
        if (userRole === "ADMIN" || userRole === "SUPER_ADMIN") {
          router.push("/dashboard/admin");
        } else {
          router.push("/dashboard/user");
        }
      }
    }
  }, [mounted, token, user, allowedRoles, router]);

  if (!mounted || !token || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground space-y-4">
        <FaSpinner className="h-10 w-10 text-indigo-500 animate-spin" />
        <p className="text-sm font-semibold text-muted-foreground animate-pulse flex items-center gap-2">
          <FaShieldAlt className="text-indigo-500" />
          Verifying security permissions...
        </p>
      </div>
    );
  }

  // Check role authorization before rendering children
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user.role?.toUpperCase();
    const hasPermission = allowedRoles.some(
      (role) => role.toUpperCase() === userRole
    );
    if (!hasPermission) return null;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
