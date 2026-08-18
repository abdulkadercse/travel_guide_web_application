"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ProtectedRoute } from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  StatTile,
  CategoryBars,
  StatusBreakdownBar,
  OverviewTrendChart,
} from "@/components/ui/dashboard/admin";
import { useGetAdminOverviewQuery } from "@/redux/features/stats/statsApi";
import { formatBdt, formatCompactNumber, formatRelativeTime } from "@/utils";
import {
  FaBus,
  FaCalendarCheck,
  FaComments,
  FaExclamationTriangle,
  FaHeart,
  FaHotel,
  FaMapMarkedAlt,
  FaRedo,
  FaRoute,
  FaShieldAlt,
  FaSpinner,
  FaStar,
  FaUsers,
  FaUtensils,
  FaWallet,
} from "react-icons/fa";

/** A reservation or review always points at exactly one of these three. */
type LinkedItem = {
  destination?: { id: string; title: string } | null;
  hotel?: { id: string; name: string } | null;
  restaurant?: { id: string; name: string } | null;
};

type RecentReservation = LinkedItem & {
  id: string;
  status: string;
  totalCost: number;
  createdAt: string;
  user?: { id: string; name: string; email: string } | null;
};

type RecentUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
};

type RecentReview = LinkedItem & {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: { id: string; name: string } | null;
};

type TopDestination = {
  id: string;
  title: string;
  district: string;
  category: string;
  coverImage: string;
  rating: number;
  price: number | null;
  _count: { reviews: number; favorites: number; reservations: number };
};

/** Shape of the aggregate payload from GET /api/v1/stats/overview. */
type Overview = {
  totals: Record<string, number>;
  revenue: { earned: number; pending: number; cancelled: number; averageBookingValue: number };
  reservationsByStatus: { status: string; count: number; amount: number }[];
  monthly: {
    label: string;
    year: number;
    month: string;
    reservations: number;
    revenue: number;
    newUsers: number;
  }[];
  ratings: { average: number; fiveStar: number; lowRated: number };
  growth: { newUsers30d: number; newReservations30d: number; newReviews30d: number };
  destinationsByCategory: { name: string; count: number }[];
  transportationsByType: { name: string; count: number }[];
  topDestinations: TopDestination[];
  recent: {
    reservations: RecentReservation[];
    users: RecentUser[];
    reviews: RecentReview[];
  };
  generatedAt: string;
};

const statusBadgeClass = (status: string) =>
  status === "CONFIRMED"
    ? "bg-primary/15 text-primary border-primary/30"
    : status === "COMPLETED"
    ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400"
    : status === "CANCELLED"
    ? "bg-rose-500/15 text-rose-600 border-rose-500/30 dark:text-rose-400"
    : "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400";

/** Reservations and reviews point at exactly one destination, hotel or restaurant. */
const linkedName = (item: LinkedItem, fallback: string) =>
  item.destination?.title || item.hotel?.name || item.restaurant?.name || fallback;

export default function AdminOverviewPage() {
  const { data, isLoading, isFetching, isError, error, refetch } = useGetAdminOverviewQuery(
    undefined,
    { refetchOnMountOrArgChange: true }
  );

  const overview: Overview | undefined = data?.data;

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
      <div className="space-y-8 font-sans">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2.5 text-2xl font-semibold tracking-tight sm:text-3xl">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                <FaShieldAlt className="h-5 w-5" />
              </span>
              Platform Overview
            </h1>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              Everything happening across Travla BD — bookings, revenue, catalogue and community, in
              one place.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {overview && (
              <span className="hidden text-xs text-muted-foreground sm:inline">
                Updated {formatRelativeTime(overview.generatedAt)}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-full"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <FaRedo className={`h-3 w-3 ${isFetching ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center gap-3 py-24 text-muted-foreground">
            <FaSpinner className="h-6 w-6 animate-spin text-primary" />
            <p className="text-sm">Gathering platform statistics…</p>
          </div>
        ) : isError || !overview ? (
          <div className="surface flex flex-col items-center gap-3 p-12 text-center">
            <FaExclamationTriangle className="h-7 w-7 text-amber-500" />
            <div>
              <h2 className="text-base font-semibold">Could not load the overview</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {(error as { data?: { message?: string } })?.data?.message ||
                  "Something went wrong while fetching platform statistics."}
              </p>
            </div>
            <Button size="sm" onClick={() => refetch()} className="rounded-full">
              Try again
            </Button>
          </div>
        ) : (
          <>
            {/* Headline numbers */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatTile
                label="Revenue earned"
                value={formatBdt(overview.revenue.earned, true)}
                icon={FaWallet}
                tone="text-emerald-500"
                hint={`${formatBdt(overview.revenue.pending, true)} still pending approval`}
              />
              <StatTile
                label="Total bookings"
                value={formatCompactNumber(overview.totals.reservations)}
                icon={FaCalendarCheck}
                href="/dashboard/admin/reservations"
                hint={`+${overview.growth.newReservations30d} in the last 30 days`}
              />
              <StatTile
                label="Registered travellers"
                value={formatCompactNumber(overview.totals.users)}
                icon={FaUsers}
                tone="text-rose-500"
                href="/dashboard/all-users"
                hint={`+${overview.growth.newUsers30d} in the last 30 days`}
              />
              <StatTile
                label="Average rating"
                value={overview.ratings.average ? `${overview.ratings.average} / 5` : "—"}
                icon={FaStar}
                tone="text-amber-500"
                href="/dashboard/admin/reviews"
                hint={`${formatCompactNumber(overview.totals.reviews)} reviews · ${
                  overview.ratings.fiveStar
                } five-star`}
              />
            </div>

            {/* Trend + pipeline */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <OverviewTrendChart points={overview.monthly} />
              </div>
              <StatusBreakdownBar slices={overview.reservationsByStatus} />
            </div>

            {/* Catalogue */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h2 className="text-lg font-medium tracking-tight">Catalogue</h2>
                  <p className="text-xs text-muted-foreground">
                    Everything travellers can browse and book
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatTile
                  label="Destinations"
                  value={overview.totals.destinations}
                  icon={FaMapMarkedAlt}
                  href="/dashboard/admin/destinations"
                  hint={`${overview.totals.featuredDestinations} featured on the home page`}
                />
                <StatTile
                  label="Hotels"
                  value={overview.totals.hotels}
                  icon={FaHotel}
                  tone="text-emerald-500"
                  href="/dashboard/admin/hotels"
                  hint="Stays available for reservation"
                />
                <StatTile
                  label="Restaurants"
                  value={overview.totals.restaurants}
                  icon={FaUtensils}
                  tone="text-amber-500"
                  href="/dashboard/admin/restaurants"
                  hint="Dining listings across districts"
                />
                <StatTile
                  label="Transport routes"
                  value={overview.totals.transportations}
                  icon={FaBus}
                  href="/dashboard/admin/transportation"
                  hint="Bus, train, flight and rental options"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <CategoryBars
                  title="Destinations by category"
                  caption="Where the catalogue is deep and where it is thin"
                  slices={overview.destinationsByCategory}
                  emptyLabel="No destinations added yet."
                />
                <CategoryBars
                  title="Transport by type"
                  caption="Coverage across the four transport modes"
                  slices={overview.transportationsByType}
                  emptyLabel="No transport routes added yet."
                />
              </div>
            </section>

            {/* Community */}
            <section className="space-y-4">
              <div className="border-b border-border pb-3">
                <h2 className="text-lg font-medium tracking-tight">Community</h2>
                <p className="text-xs text-muted-foreground">
                  Who is on the platform and what they are planning
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatTile
                  label="Active accounts"
                  value={formatCompactNumber(overview.totals.activeUsers)}
                  icon={FaUsers}
                  href="/dashboard/all-users"
                  hint={`${overview.totals.blockedUsers} blocked · ${overview.totals.admins} admins`}
                />
                <StatTile
                  label="Trip plans"
                  value={formatCompactNumber(overview.totals.tripPlans)}
                  icon={FaRoute}
                  hint="Itineraries travellers built themselves"
                />
                <StatTile
                  label="Saved favourites"
                  value={formatCompactNumber(overview.totals.favorites)}
                  icon={FaHeart}
                  tone="text-rose-500"
                  hint="Destinations bookmarked for later"
                />
                <StatTile
                  label="Low ratings"
                  value={overview.ratings.lowRated}
                  icon={FaComments}
                  tone="text-amber-500"
                  href="/dashboard/admin/reviews"
                  hint="Reviews at 2 stars or below — worth a look"
                />
              </div>
            </section>

            {/* Recent activity */}
            <section className="space-y-4">
              <div className="border-b border-border pb-3">
                <h2 className="text-lg font-medium tracking-tight">Recent activity</h2>
                <p className="text-xs text-muted-foreground">The latest movement across the platform</p>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {/* Latest bookings */}
                <div className="surface flex flex-col p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="flex items-center gap-2 text-sm font-semibold">
                      <FaCalendarCheck className="h-4 w-4 text-primary" /> Latest bookings
                    </h3>
                    <Link
                      href="/dashboard/admin/reservations"
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      View all
                    </Link>
                  </div>

                  {overview.recent.reservations.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">No bookings yet.</p>
                  ) : (
                    <ul className="mt-4 space-y-3">
                      {overview.recent.reservations.map((item) => (
                        <li key={item.id} className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{linkedName(item, "Booking")}</p>
                            <p className="truncate text-xs text-muted-foreground">
                              {item.user?.name} · {formatRelativeTime(item.createdAt)}
                            </p>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="text-sm font-medium tabular-nums">
                              {formatBdt(item.totalCost, true)}
                            </p>
                            <span
                              className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusBadgeClass(
                                item.status
                              )}`}
                            >
                              {item.status}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Newest members */}
                <div className="surface flex flex-col p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="flex items-center gap-2 text-sm font-semibold">
                      <FaUsers className="h-4 w-4 text-rose-500" /> Newest members
                    </h3>
                    <Link
                      href="/dashboard/all-users"
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Manage
                    </Link>
                  </div>

                  {overview.recent.users.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      No registrations yet.
                    </p>
                  ) : (
                    <ul className="mt-4 space-y-3">
                      {overview.recent.users.map((member) => (
                        <li key={member.id} className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{member.name}</p>
                            <p className="truncate text-xs text-muted-foreground">{member.email}</p>
                          </div>
                          <div className="shrink-0 text-right">
                            <span className="rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                              {member.role}
                            </span>
                            <p className="mt-1 text-[11px] text-muted-foreground">
                              {formatRelativeTime(member.createdAt)}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Latest reviews */}
                <div className="surface flex flex-col p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="flex items-center gap-2 text-sm font-semibold">
                      <FaComments className="h-4 w-4 text-amber-500" /> Latest reviews
                    </h3>
                    <Link
                      href="/dashboard/admin/reviews"
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Moderate
                    </Link>
                  </div>

                  {overview.recent.reviews.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">No reviews yet.</p>
                  ) : (
                    <ul className="mt-4 space-y-3">
                      {overview.recent.reviews.map((review) => (
                        <li key={review.id} className="space-y-1">
                          <div className="flex items-center justify-between gap-3">
                            <p className="truncate text-sm font-medium">{linkedName(review, "Platform")}</p>
                            <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-amber-500">
                              <FaStar className="h-3 w-3" /> {review.rating}
                            </span>
                          </div>
                          <p className="line-clamp-2 text-xs text-muted-foreground">{review.comment}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {review.user?.name} · {formatRelativeTime(review.createdAt)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </section>

            {/* Top destinations */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h2 className="text-lg font-medium tracking-tight">Top rated destinations</h2>
                  <p className="text-xs text-muted-foreground">
                    Highest rated listings and the engagement behind them
                  </p>
                </div>
                <Button size="sm" variant="outline" className="rounded-full" asChild>
                  <Link href="/dashboard/admin/destinations">Manage destinations</Link>
                </Button>
              </div>

              <div className="surface overflow-hidden">
                {overview.topDestinations.length === 0 ? (
                  <p className="py-12 text-center text-sm text-muted-foreground">
                    No destinations added yet.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Destination</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead>Reviews</TableHead>
                          <TableHead>Favourites</TableHead>
                          <TableHead>Bookings</TableHead>
                          <TableHead>Price</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {overview.topDestinations.map((destination) => (
                          <TableRow key={destination.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                {destination.coverImage && (
                                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                                    <Image
                                      src={destination.coverImage}
                                      alt={destination.title}
                                      fill
                                      sizes="40px"
                                      className="object-cover"
                                    />
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-medium">{destination.title}</p>
                                  <p className="truncate text-xs text-muted-foreground">
                                    {destination.district}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {destination.category}
                            </TableCell>
                            <TableCell>
                              <span className="flex items-center gap-1 text-xs font-medium text-amber-500">
                                <FaStar className="h-3 w-3" /> {destination.rating?.toFixed(1)}
                              </span>
                            </TableCell>
                            <TableCell className="text-xs tabular-nums">
                              {destination._count?.reviews ?? 0}
                            </TableCell>
                            <TableCell className="text-xs tabular-nums">
                              {destination._count?.favorites ?? 0}
                            </TableCell>
                            <TableCell className="text-xs tabular-nums">
                              {destination._count?.reservations ?? 0}
                            </TableCell>
                            <TableCell className="text-xs font-medium tabular-nums">
                              {formatBdt(destination.price || 0)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
