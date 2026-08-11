"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser, selectCurrentToken } from "@/redux/features/auth/authSlice";
import { FaSpinner } from "react-icons/fa";

export default function DashboardRootPage() {
  const router = useRouter();
  const user = useAppSelector(selectCurrentUser);
  const token = useAppSelector(selectCurrentToken);

  useEffect(() => {
    if (!token || !user) {
      router.push("/login");
      return;
    }

    const role = user.role?.toUpperCase();
    if (role === "ADMIN" || role === "SUPER_ADMIN") {
      router.push("/dashboard/admin");
    } else {
      router.push("/dashboard/user");
    }
  }, [user, token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground animate-pulse">
        <FaSpinner className="h-5 w-5 text-indigo-500 animate-spin" />
        Redirecting to your dashboard...
      </div>
    </div>
  );
}
