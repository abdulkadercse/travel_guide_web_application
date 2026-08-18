import { ReservationStatus, UserRole, UserStatus } from "@prisma/client";
import prisma from "@/lib/prisma";
import {
  IAdminOverview,
  ICategorySlice,
  IMonthlyPoint,
  IReservationStatusBreakdown,
} from "./stats.interface";

const MONTHS_IN_TREND = 6;
const RECENT_WINDOW_DAYS = 30;

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** Bookings that count as money in — pending and cancelled are tracked separately. */
const EARNING_STATUSES: ReservationStatus[] = [
  ReservationStatus.CONFIRMED,
  ReservationStatus.COMPLETED,
];

const monthKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}`;

const round2 = (value: number) => Math.round(value * 100) / 100;

/**
 * Builds the empty month buckets for the trend chart, oldest first, so months
 * with no activity still render as a gap instead of being skipped.
 */
const buildMonthBuckets = () => {
  const now = new Date();
  const buckets = new Map<string, IMonthlyPoint>();

  for (let offset = MONTHS_IN_TREND - 1; offset >= 0; offset--) {
    const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    buckets.set(monthKey(date), {
      label: MONTH_LABELS[date.getMonth()],
      year: date.getFullYear(),
      month: date.toISOString(),
      reservations: 0,
      revenue: 0,
      newUsers: 0,
    });
  }

  return buckets;
};

const getAdminOverviewDB = async (): Promise<IAdminOverview> => {
  const now = new Date();
  const trendStart = new Date(now.getFullYear(), now.getMonth() - (MONTHS_IN_TREND - 1), 1);
  const recentWindowStart = new Date(now.getTime() - RECENT_WINDOW_DAYS * 24 * 60 * 60 * 1000);

  const [
    users,
    admins,
    activeUsers,
    blockedUsers,
    destinations,
    featuredDestinations,
    hotels,
    restaurants,
    transportations,
    reservations,
    reviews,
    tripPlans,
    favorites,
    newUsers30d,
    newReservations30d,
    newReviews30d,
    ratingAggregate,
    fiveStarReviews,
    lowRatedReviews,
    trendReservations,
    trendUsers,
    topDestinations,
    recentReservations,
    recentUsers,
    recentReviews,
  ] = await prisma.$transaction([
    prisma.user.count(),
    prisma.user.count({ where: { role: { in: [UserRole.ADMIN, UserRole.SUPER_ADMIN] } } }),
    prisma.user.count({ where: { status: UserStatus.ACTIVE } }),
    prisma.user.count({ where: { status: UserStatus.BLOCKED } }),
    prisma.destination.count(),
    prisma.destination.count({ where: { isFeatured: true } }),
    prisma.hotel.count(),
    prisma.restaurant.count(),
    prisma.transportation.count(),
    prisma.reservation.count(),
    prisma.review.count(),
    prisma.tripPlan.count(),
    prisma.favorite.count(),
    prisma.user.count({ where: { createdAt: { gte: recentWindowStart } } }),
    prisma.reservation.count({ where: { createdAt: { gte: recentWindowStart } } }),
    prisma.review.count({ where: { createdAt: { gte: recentWindowStart } } }),
    prisma.review.aggregate({ _avg: { rating: true } }),
    prisma.review.count({ where: { rating: 5 } }),
    prisma.review.count({ where: { rating: { lte: 2 } } }),
    prisma.reservation.findMany({
      where: { createdAt: { gte: trendStart } },
      select: { createdAt: true, totalCost: true, status: true },
    }),
    prisma.user.findMany({
      where: { createdAt: { gte: trendStart } },
      select: { createdAt: true },
    }),
    prisma.destination.findMany({
      orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
      take: 5,
      select: {
        id: true,
        title: true,
        district: true,
        category: true,
        coverImage: true,
        rating: true,
        price: true,
        _count: { select: { reviews: true, favorites: true, reservations: true } },
      },
    }),
    prisma.reservation.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        status: true,
        totalCost: true,
        startDate: true,
        endDate: true,
        createdAt: true,
        user: { select: { id: true, name: true, email: true, avatar: true } },
        destination: { select: { id: true, title: true } },
        hotel: { select: { id: true, name: true } },
        restaurant: { select: { id: true, name: true } },
      },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        user: { select: { id: true, name: true, avatar: true } },
        destination: { select: { id: true, title: true } },
        hotel: { select: { id: true, name: true } },
        restaurant: { select: { id: true, name: true } },
      },
    }),
  ]);

  // Prisma's groupBy is typed on its own arguments, so these stay outside the
  // $transaction tuple where that inference is lost.
  const [reservationGroups, categoryGroups, transportTypeGroups] = await Promise.all([
    prisma.reservation.groupBy({
      by: ["status"],
      _count: { _all: true },
      _sum: { totalCost: true },
      orderBy: { status: "asc" },
    }),
    prisma.destination.groupBy({
      by: ["category"],
      _count: { _all: true },
      orderBy: { category: "asc" },
    }),
    prisma.transportation.groupBy({
      by: ["type"],
      _count: { _all: true },
      orderBy: { type: "asc" },
    }),
  ]);

  // Reservation money split, keyed off the status groups we already fetched.
  const amountFor = (statuses: ReservationStatus[]) =>
    reservationGroups
      .filter((group) => statuses.includes(group.status))
      .reduce((sum, group) => sum + (group._sum.totalCost ?? 0), 0);

  const earned = amountFor(EARNING_STATUSES);
  const pending = amountFor([ReservationStatus.PENDING]);
  const cancelled = amountFor([ReservationStatus.CANCELLED]);

  const earnedCount = reservationGroups
    .filter((group) => EARNING_STATUSES.includes(group.status))
    .reduce((sum, group) => sum + group._count._all, 0);

  // Every status is listed, in a fixed order, so the breakdown bar never
  // reshuffles as counts change.
  const statusOrder: ReservationStatus[] = [
    ReservationStatus.PENDING,
    ReservationStatus.CONFIRMED,
    ReservationStatus.COMPLETED,
    ReservationStatus.CANCELLED,
  ];

  const reservationsByStatus: IReservationStatusBreakdown[] = statusOrder.map((status) => {
    const group = reservationGroups.find((item) => item.status === status);
    return {
      status,
      count: group?._count._all ?? 0,
      amount: round2(group?._sum.totalCost ?? 0),
    };
  });

  const buckets = buildMonthBuckets();

  for (const reservation of trendReservations) {
    const bucket = buckets.get(monthKey(reservation.createdAt));
    if (!bucket) continue;
    bucket.reservations += 1;
    if (EARNING_STATUSES.includes(reservation.status)) {
      bucket.revenue += reservation.totalCost;
    }
  }

  for (const user of trendUsers) {
    const bucket = buckets.get(monthKey(user.createdAt));
    if (bucket) bucket.newUsers += 1;
  }

  const monthly = [...buckets.values()].map((point) => ({
    ...point,
    revenue: round2(point.revenue),
  }));

  const bySize = (a: ICategorySlice, b: ICategorySlice) => b.count - a.count;

  const destinationsByCategory: ICategorySlice[] = categoryGroups
    .map((group) => ({ name: group.category, count: group._count._all }))
    .sort(bySize);

  const transportationsByType: ICategorySlice[] = transportTypeGroups
    .map((group) => ({ name: group.type as string, count: group._count._all }))
    .sort(bySize);

  return {
    totals: {
      users,
      admins,
      activeUsers,
      blockedUsers,
      destinations,
      featuredDestinations,
      hotels,
      restaurants,
      transportations,
      reservations,
      reviews,
      tripPlans,
      favorites,
    },
    revenue: {
      earned: round2(earned),
      pending: round2(pending),
      cancelled: round2(cancelled),
      averageBookingValue: earnedCount ? round2(earned / earnedCount) : 0,
    },
    reservationsByStatus,
    monthly,
    ratings: {
      average: round2(ratingAggregate._avg.rating ?? 0),
      fiveStar: fiveStarReviews,
      lowRated: lowRatedReviews,
    },
    growth: {
      newUsers30d,
      newReservations30d,
      newReviews30d,
    },
    destinationsByCategory,
    transportationsByType,
    topDestinations,
    recent: {
      reservations: recentReservations,
      users: recentUsers,
      reviews: recentReviews,
    },
    generatedAt: now.toISOString(),
  };
};

export const statsService = {
  getAdminOverviewDB,
};

export default statsService;
