"use client";

import React, { useState } from "react";
import Container from "@/components/shared/Container";
import { UserProfileHeader } from "./UserProfileHeader";
import { UserProfileDetails } from "./UserProfileDetails";
import { UserProfileEditModal } from "./UserProfileEditModal";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useGetMeQuery } from "@/redux/features/auth/authApi";
import { useGetFavoritesQuery } from "@/redux/features/favorite/favoriteApi";
import { useGetTripPlansQuery } from "@/redux/features/tripPlan/tripPlanApi";
import { useGetReservationsQuery } from "@/redux/features/reservation/reservationApi";

export function UserProfileContainer() {
  const localUser = useAppSelector(selectCurrentUser);
  const { data: meResponse } = useGetMeQuery(undefined, { skip: !localUser });

  // Merge latest server profile with local user state
  const currentUser = meResponse?.data || localUser;

  // Real data counts for user stats
  const { data: favsRes } = useGetFavoritesQuery(undefined, {
    skip: !localUser,
  });
  const { data: plansRes } = useGetTripPlansQuery(undefined, {
    skip: !localUser,
  });
  const { data: resvRes } = useGetReservationsQuery(undefined, {
    skip: !localUser,
  });

  const stats = {
    favoritesCount: favsRes?.data?.length || 0,
    tripPlansCount: plansRes?.data?.length || 0,
    reservationsCount: resvRes?.data?.length || 0,
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!currentUser) {
    return (
      <div className="py-12">
        <Container>
          <div className="animate-pulse space-y-6">
            <div className="h-44 rounded-2xl bg-secondary/80" />
            <div className="h-64 rounded-2xl bg-secondary/80" />
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-10 space-y-8">
      <Container className="space-y-8 max-w-6xl">
        {/* User Profile Header */}
        <UserProfileHeader
          user={currentUser}
          stats={stats}
          onOpenEdit={() => setIsEditModalOpen(true)}
        />

        {/* User Profile Details & Shortcuts */}
        <UserProfileDetails
          user={currentUser}
          onOpenEdit={() => setIsEditModalOpen(true)}
        />

        {/* Edit Profile Modal */}
        <UserProfileEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          user={currentUser}
        />
      </Container>
    </div>
  );
}

export default UserProfileContainer;
