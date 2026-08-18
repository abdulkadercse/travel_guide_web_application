"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { AvatarUploader, DatePicker } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StatTile } from "@/components/ui/dashboard";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectCurrentUser, setUser } from "@/redux/features/auth/authSlice";
import { useGetMeQuery } from "@/redux/features/auth/authApi";
import {
  useGetFavoritesQuery,
  useRemoveFavoriteMutation,
} from "@/redux/features/favorite/favoriteApi";
import { useGetReservationsQuery } from "@/redux/features/reservation/reservationApi";
import {
  useGetTripPlansQuery,
  useCreateTripPlanMutation,
} from "@/redux/features/tripPlan/tripPlanApi";
import { formatBdt, formatShortDate } from "@/utils";
import {
  FaArrowRight,
  FaCalendarCheck,
  FaCompass,
  FaHeart,
  FaLayerGroup,
  FaMapMarkerAlt,
  FaPlaneDeparture,
  FaPlus,
  FaRoute,
  FaSpinner,
  FaTrashAlt,
  FaWallet,
} from "react-icons/fa";

/** A reservation always points at exactly one of these three. */
type LinkedItem = {
  destination?: { id: string; title: string; district?: string } | null;
  hotel?: { id: string; name: string } | null;
  restaurant?: { id: string; name: string } | null;
};

type Reservation = LinkedItem & {
  id: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  totalCost: number;
  startDate: string;
  endDate: string;
};

type Favorite = {
  id: string;
  destinationId: string;
  destination?: {
    id: string;
    title: string;
    coverImage?: string | null;
    district?: string | null;
    location?: string | null;
    price?: number | null;
  } | null;
};

type TripPlan = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  totalBudget?: number | null;
  notes?: string | null;
  items?: { id: string }[];
};

/** Matches the badge language used on the admin overview. */
const statusBadgeClass = (status: string) =>
  status === "CONFIRMED"
    ? "bg-primary/15 text-primary border-primary/30"
    : status === "COMPLETED"
    ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400"
    : status === "CANCELLED"
    ? "bg-rose-500/15 text-rose-600 border-rose-500/30 dark:text-rose-400"
    : "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400";

const linkedName = (item: LinkedItem, fallback: string) =>
  item.destination?.title || item.hotel?.name || item.restaurant?.name || fallback;

/** Card-shaped placeholders, so the layout does not jump once data lands. */
function CardSkeleton({ count = 3, className = "h-[86px]" }: { count?: number; className?: string }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`animate-pulse rounded-2xl bg-muted ${className}`} />
      ))}
    </>
  );
}

/** Empty state shared by every section below, so they all read the same. */
function EmptyState({
  icon: Icon,
  title,
  hint,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  hint: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-muted text-muted-foreground">
        <Icon className="h-4.5 w-4.5" />
      </span>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </div>
      {action}
    </div>
  );
}

/** The heading above each section — title, caption and a "view all" affordance. */
function SectionHeader({
  icon: Icon,
  tone = "text-primary",
  title,
  caption,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tone?: string;
  title: string;
  caption: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-3">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-medium tracking-tight">
          <Icon className={`h-4 w-4 ${tone}`} /> {title}
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">{caption}</p>
      </div>
      {action}
    </div>
  );
}

export default function UserDashboardPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);

  // The token-scoped profile carries fields the cached login payload does not
  // (member since, phone, verification), so it takes priority when it arrives.
  const { data: meResponse } = useGetMeQuery(undefined, { skip: !user });
  const profile = meResponse?.data ?? user;

  // All three lists are scoped to the logged-in user by the server, from the token.
  const { data: reservationsResponse, isLoading: loadingReservations } = useGetReservationsQuery(
    undefined,
    { skip: !user }
  );
  const { data: tripPlansResponse, isLoading: loadingTripPlans } = useGetTripPlansQuery(undefined, {
    skip: !user,
  });
  const { data: favoritesResponse, isLoading: loadingFavorites } = useGetFavoritesQuery(undefined, {
    skip: !user,
  });
  const [removeFavorite] = useRemoveFavoriteMutation();
  const [createTripPlan] = useCreateTripPlanMutation();

  const myReservations: Reservation[] = reservationsResponse?.data ?? [];
  const myTripPlans: TripPlan[] = tripPlansResponse?.data ?? [];
  const myFavorites: Favorite[] = favoritesResponse?.data ?? [];

  // Trip Plan Modal State
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [newPlan, setNewPlan] = useState({
    title: "",
    startDate: "",
    endDate: "",
    totalBudget: 5000,
    notes: "",
  });
  const [submittingPlan, setSubmittingPlan] = useState(false);

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  const firstName = profile?.name?.trim().split(" ")[0] || "traveller";

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-GB", { month: "long", year: "numeric" })
    : null;

  // Headline numbers, all derived from the three lists already fetched above.
  const confirmedCount = myReservations.filter((r) => r.status === "CONFIRMED").length;
  const pendingCount = myReservations.filter((r) => r.status === "PENDING").length;
  const totalSpent = myReservations
    .filter((r) => r.status === "CONFIRMED" || r.status === "COMPLETED")
    .reduce((sum, r) => sum + (r.totalCost || 0), 0);
  const upcomingPlans = myTripPlans.filter((p) => new Date(p.endDate) >= new Date()).length;

  // Anything still ahead of today first — that is what a traveller opens this for.
  const sortedReservations = [...myReservations].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  const errorMessage = (err: unknown, fallback: string) =>
    (err as { data?: { message?: string } })?.data?.message || fallback;

  const handleRemoveFavorite = async (destinationId: string) => {
    try {
      await removeFavorite(destinationId).unwrap();
      toast.success("Removed from saved favorites");
    } catch (err: unknown) {
      toast.error(errorMessage(err, "Error removing favorite"));
    }
  };

  const handleAvatarUpdateSuccess = (newUrl: string) => {
    if (user) {
      const updatedUser = { ...user, avatar: newUrl };
      const token = localStorage.getItem("accessToken") || "";
      dispatch(setUser({ user: updatedUser, token }));
      toast.success("Profile avatar updated successfully!");
    }
  };

  const handleCreateTripPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setSubmittingPlan(true);
    const toastId = toast.loading("Creating trip plan...");

    try {
      await createTripPlan({
        ...newPlan,
        totalBudget: Number(newPlan.totalBudget),
      }).unwrap();

      toast.success("Trip plan created successfully!", { id: toastId });
      setPlanDialogOpen(false);
      setNewPlan({
        title: "",
        startDate: "",
        endDate: "",
        totalBudget: 5000,
        notes: "",
      });
    } catch (err: unknown) {
      toast.error(errorMessage(err, "Failed to create trip plan"), { id: toastId });
    } finally {
      setSubmittingPlan(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Page header */}
      <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-semibold tracking-tight sm:text-3xl">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
              <FaCompass className="h-5 w-5" />
            </span>
            Welcome back, {firstName}
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Your saved places, bookings and itineraries across Travla BD, in one place.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <Button variant="outline" size="sm" className="rounded-full" asChild>
              <Link href="/dashboard/admin">Admin panel</Link>
            </Button>
          )}
          <Button size="sm" className="gap-2 rounded-full" asChild>
            <Link href="/">
              Explore destinations <FaArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Identity card: teal banner, then the avatar breaking across it. */}
      <section className="surface overflow-hidden">
        <div className="relative h-24 bg-gradient-to-r from-primary via-primary to-primary-hover sm:h-28">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.28),transparent_65%)]" />
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>

        <div className="flex flex-col items-center gap-4 px-6 pb-6 text-center sm:flex-row sm:items-end sm:gap-5 sm:text-left">
          <div className="-mt-14 shrink-0 rounded-full ring-4 ring-card sm:-mt-16">
            <AvatarUploader
              src={profile?.avatar}
              name={profile?.name}
              size="lg"
              onUploadSuccess={handleAvatarUpdateSuccess}
            />
          </div>

          <div className="min-w-0 flex-1 space-y-1.5 pt-1 sm:pb-1">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{profile?.name}</h2>
              <span className="rounded-full border border-primary/30 bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary">
                {profile?.role === "USER" ? "Traveller" : profile?.role}
              </span>
              {profile?.status && (
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                    profile.status === "ACTIVE"
                      ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      : "border-rose-500/30 bg-rose-500/15 text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {profile.status}
                </span>
              )}
            </div>

            <p className="truncate text-xs text-muted-foreground sm:text-sm">{profile?.email}</p>
            <p className="text-xs text-muted-foreground">
              {memberSince ? `Member since ${memberSince} · ` : ""}Tap the avatar to change your
              photo
            </p>
          </div>
        </div>
      </section>

      {/* Headline numbers */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Saved favourites"
          value={myFavorites.length}
          icon={FaHeart}
          tone="text-rose-500"
          href="/dashboard/favorites"
          hint="Destinations bookmarked for later"
        />
        <StatTile
          label="Bookings"
          value={myReservations.length}
          icon={FaCalendarCheck}
          href="/dashboard/reservations"
          hint={`${confirmedCount} confirmed · ${pendingCount} awaiting approval`}
        />
        <StatTile
          label="Trip plans"
          value={myTripPlans.length}
          icon={FaRoute}
          href="/dashboard/trip-plans"
          hint={`${upcomingPlans} still ahead of today`}
        />
        <StatTile
          label="Total spent"
          value={formatBdt(totalSpent, true)}
          icon={FaWallet}
          tone="text-emerald-500"
          hint="Across confirmed and completed bookings"
        />
      </div>

      {/* Bookings */}
      <section className="space-y-4">
        <SectionHeader
          icon={FaCalendarCheck}
          title="My bookings"
          caption="The status of your hotel, tour and dining reservations"
          action={
            <Link
              href="/dashboard/reservations"
              className="text-xs font-medium text-primary hover:underline"
            >
              View all
            </Link>
          }
        />

        <div className="surface overflow-hidden">
          {loadingReservations ? (
            <div className="space-y-3 p-5">
              <CardSkeleton count={4} className="h-10" />
            </div>
          ) : sortedReservations.length === 0 ? (
            <EmptyState
              icon={FaCalendarCheck}
              title="No bookings yet"
              hint="Reserve a stay, tour or table and it will show up here."
              action={
                <Button size="sm" variant="outline" className="rounded-full" asChild>
                  <Link href="/">Browse destinations</Link>
                </Button>
              }
            />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedReservations.slice(0, 5).map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {linkedName(item, "Tour package")}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatShortDate(item.startDate)} &mdash; {formatShortDate(item.endDate)}
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium tabular-nums">
                        {formatBdt(item.totalCost)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${statusBadgeClass(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {sortedReservations.length > 5 && (
                <div className="border-t border-border px-5 py-3 text-center">
                  <Link
                    href="/dashboard/reservations"
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    View the remaining {sortedReservations.length - 5} bookings
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Favourites + trip plans, side by side on wide screens */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        {/* Saved favourites */}
        <section className="space-y-4">
          <SectionHeader
            icon={FaHeart}
            tone="text-rose-500"
            title={`Saved favourites${myFavorites.length ? ` (${myFavorites.length})` : ""}`}
            caption="Destinations you bookmarked for a future trip"
            action={
              <Link
                href="/dashboard/favorites"
                className="text-xs font-medium text-primary hover:underline"
              >
                View all
              </Link>
            }
          />

          {loadingFavorites ? (
            <div className="space-y-3">
              <CardSkeleton count={3} />
            </div>
          ) : myFavorites.length === 0 ? (
            <div className="surface">
              <EmptyState
                icon={FaHeart}
                title="Nothing saved yet"
                hint="Tap the heart on any destination card to bookmark it."
                action={
                  <Button size="sm" variant="outline" className="rounded-full" asChild>
                    <Link href="/">Find a destination</Link>
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="space-y-3">
              {myFavorites.slice(0, 4).map((fav) => (
                <div
                  key={fav.id}
                  className="surface group flex items-center gap-4 p-3 transition-colors hover:border-rose-500/40"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                    {fav.destination?.coverImage ? (
                      <Image
                        src={fav.destination.coverImage}
                        alt={fav.destination.title}
                        fill
                        sizes="64px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <FaMapMarkerAlt className="h-4 w-4" />
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-medium">
                      {fav.destination?.title || "Saved destination"}
                    </h3>
                    <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                      <FaMapMarkerAlt className="h-3 w-3 shrink-0 text-rose-500" />
                      {fav.destination?.location || fav.destination?.district || "Bangladesh"}
                    </p>
                    <p className="mt-1 text-xs font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                      {formatBdt(fav.destination?.price || 0)}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveFavorite(fav.destinationId)}
                    className="h-8 w-8 shrink-0 rounded-full p-0 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500"
                    title="Remove from favourites"
                  >
                    <FaTrashAlt className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Trip plans */}
        <section className="space-y-4">
          <SectionHeader
            icon={FaRoute}
            title="My trip plans"
            caption="Personal itineraries, budgets and schedule notes"
            action={
              <Dialog open={planDialogOpen} onOpenChange={setPlanDialogOpen}>
                <DialogTrigger
                  render={
                    <Button size="sm" className="gap-2 rounded-full">
                      <FaPlus className="h-3 w-3" /> New plan
                    </Button>
                  }
                />

                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-base font-semibold">
                      Create a trip plan
                    </DialogTitle>
                  </DialogHeader>

                  <form onSubmit={handleCreateTripPlan} className="space-y-4 pt-1">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Plan title</label>
                      <Input
                        placeholder="e.g. Summer vacation in Cox's Bazar"
                        value={newPlan.title}
                        onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <DatePicker
                        label="Start date"
                        value={newPlan.startDate}
                        onChange={(val) => setNewPlan({ ...newPlan, startDate: val })}
                        placeholder="Start date"
                        required
                      />
                      <DatePicker
                        label="End date"
                        value={newPlan.endDate}
                        onChange={(val) => setNewPlan({ ...newPlan, endDate: val })}
                        placeholder="End date"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">
                        Estimated budget (BDT)
                      </label>
                      <Input
                        type="number"
                        min={0}
                        placeholder="5000"
                        value={newPlan.totalBudget}
                        onChange={(e) =>
                          setNewPlan({ ...newPlan, totalBudget: Number(e.target.value) })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">
                        Notes &amp; schedule ideas
                      </label>
                      <Textarea
                        placeholder="Activities, places to visit, packing list..."
                        value={newPlan.notes}
                        onChange={(e) => setNewPlan({ ...newPlan, notes: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setPlanDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={submittingPlan} className="gap-2">
                        {submittingPlan && <FaSpinner className="h-3 w-3 animate-spin" />}
                        Save plan
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            }
          />

          {loadingTripPlans ? (
            <div className="space-y-3">
              <CardSkeleton count={3} />
            </div>
          ) : myTripPlans.length === 0 ? (
            <div className="surface">
              <EmptyState
                icon={FaRoute}
                title="No trip plans yet"
                hint='Use "New plan" above to sketch your next itinerary.'
              />
            </div>
          ) : (
            <div className="space-y-3">
              {myTripPlans.slice(0, 4).map((plan) => (
                <Link
                  key={plan.id}
                  href={`/dashboard/trip-plans/${plan.id}`}
                  className="surface block p-4 transition-colors hover:border-primary/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="truncate text-sm font-medium">{plan.title}</h3>
                    <span className="shrink-0 rounded-full border border-primary/30 bg-primary/15 px-2.5 py-0.5 text-xs font-medium tabular-nums text-primary">
                      {formatBdt(plan.totalBudget || 0)}
                    </span>
                  </div>

                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <FaPlaneDeparture className="h-3 w-3 shrink-0 text-primary" />
                    {formatShortDate(plan.startDate)} &mdash; {formatShortDate(plan.endDate)}
                  </p>

                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <FaLayerGroup className="h-3 w-3 shrink-0 text-primary" />
                      {plan.items?.length || 0} stop{(plan.items?.length || 0) === 1 ? "" : "s"}
                    </span>
                    {plan.notes && <span className="truncate">{plan.notes}</span>}
                  </div>
                </Link>
              ))}

              {myTripPlans.length > 4 && (
                <Link
                  href="/dashboard/trip-plans"
                  className="block py-1 text-center text-xs font-medium text-primary hover:underline"
                >
                  View all {myTripPlans.length} trip plans
                </Link>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
