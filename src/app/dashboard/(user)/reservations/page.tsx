"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
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
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import {
  useGetReservationsQuery,
  useUpdateReservationStatusMutation,
} from "@/redux/features/reservation/reservationApi";
import {
  FaCalendarCheck,
  FaMapMarkerAlt,
  FaSpinner,
  FaTimesCircle,
  FaHotel,
  FaGlobe,
  FaUtensils,
  FaClock,
} from "react-icons/fa";

export default function UserReservationsPage() {
  const user = useAppSelector(selectCurrentUser);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const { data: reservationsResponse, isLoading } = useGetReservationsQuery(
    undefined,
    { skip: !user }
  );
  const [updateReservationStatus] = useUpdateReservationStatusMutation();

  const myReservations: any[] = reservationsResponse?.data ?? [];

  const handleCancelReservation = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this pending reservation request?")) return;

    const toastId = toast.loading("Cancelling reservation...");
    try {
      await updateReservationStatus({ id, status: "CANCELLED" }).unwrap();
      toast.success("Reservation request cancelled successfully", { id: toastId });
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message || "Failed to cancel reservation";
      toast.error(msg, { id: toastId });
    }
  };

  const filteredReservations = myReservations.filter((r) => {
    if (statusFilter === "ALL") return true;
    return r.status === statusFilter;
  });

  const pendingCount = myReservations.filter((r) => r.status === "PENDING").length;
  const confirmedCount = myReservations.filter((r) => r.status === "CONFIRMED").length;

  return (
    <ProtectedRoute allowedRoles={["USER", "ADMIN", "SUPER_ADMIN"]}>
      <div className="space-y-8 font-sans">
        {/* Top Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <FaCalendarCheck className="h-5 w-5" />
              </div>
              My Bookings & Reservations
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Track reservation request statuses for your stays, tours, and dining arrangements.
            </p>
          </div>

          <Button className="shrink-0" asChild>
            <Link href="/destinations">Explore New Destinations</Link>
          </Button>
        </div>

        {/* Stats Bar & Filter Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total Bookings</p>
              <h3 className="text-2xl font-semibold text-foreground mt-0.5">{myReservations.length}</h3>
            </div>
            <FaCalendarCheck className="h-6 w-6 text-primary" />
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Confirmed Stays</p>
              <h3 className="text-2xl font-semibold text-emerald-400 mt-0.5">{confirmedCount}</h3>
            </div>
            <FaHotel className="h-6 w-6 text-emerald-500" />
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Pending Approvals</p>
              <h3 className="text-2xl font-semibold text-amber-400 mt-0.5">{pendingCount}</h3>
            </div>
            <FaClock className="h-6 w-6 text-amber-500" />
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-border">
          {["ALL", "PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all shrink-0 ${
                statusFilter === tab
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "ALL" ? `All Requests (${myReservations.length})` : `${tab} (${myReservations.filter((r) => r.status === tab).length})`}
            </button>
          ))}
        </div>

        {/* Table of Reservations */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="py-16 flex justify-center text-muted-foreground">
              <FaSpinner className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredReservations.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground space-y-3">
              <FaCalendarCheck className="h-12 w-12 text-muted-foreground/40 mx-auto" />
              <h3 className="text-base font-medium text-foreground">No reservation requests found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                You haven't requested any hotel or tour reservations under this filter yet.
              </p>
              <Button variant="outline" className="rounded-full font-semibold" asChild>
                <Link href="/destinations">Browse Stays & Packages</Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-border/80">
                  <TableHead>Target Service</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date Range</TableHead>
                  <TableHead>Total Cost</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservations.map((item) => {
                  const targetName =
                    item.destination?.title ||
                    item.hotel?.name ||
                    item.restaurant?.name ||
                    "Custom Booking";
                  const coverImage =
                    item.destination?.coverImage ||
                    item.hotel?.coverImage ||
                    item.restaurant?.coverImage;
                  const location =
                    item.destination?.location ||
                    item.hotel?.location ||
                    item.restaurant?.location ||
                    "Bangladesh";
                  const typeLabel = item.hotel
                    ? "Hotel Stay"
                    : item.restaurant
                    ? "Dining Request"
                    : "Tour Package";

                  return (
                    <TableRow key={item.id} className="hover:bg-muted/30 border-b border-border/60">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {coverImage ? (
                            <div className="relative h-12 w-16 rounded-xl overflow-hidden bg-muted border shrink-0">
                              <Image
                                src={coverImage}
                                alt={targetName}
                                fill
                                sizes="64px"
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                              <FaHotel className="h-6 w-6" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-foreground text-sm leading-snug">{targetName}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <FaMapMarkerAlt className="h-3 w-3 text-primary shrink-0" />
                              {location}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/20 inline-flex items-center gap-1">
                          {item.hotel ? <FaHotel className="h-3 w-3" /> : item.restaurant ? <FaUtensils className="h-3 w-3" /> : <FaGlobe className="h-3 w-3" />}
                          {typeLabel}
                        </span>
                      </TableCell>

                      <TableCell className="text-xs text-muted-foreground font-mono">
                        {new Date(item.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        <span className="mx-1 font-sans text-muted-foreground/60">&rarr;</span>
                        {new Date(item.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </TableCell>

                      <TableCell className="font-semibold text-emerald-400 text-sm">
                        ৳{item.totalCost?.toLocaleString() || 0}
                      </TableCell>

                      <TableCell>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 ${
                            item.status === "CONFIRMED"
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : item.status === "CANCELLED"
                              ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                              : item.status === "COMPLETED"
                              ? "bg-primary/15 text-primary border border-primary/30"
                              : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            item.status === "CONFIRMED" ? "bg-emerald-400" : item.status === "CANCELLED" ? "bg-rose-400" : "bg-amber-400"
                          }`} />
                          {item.status}
                        </span>
                      </TableCell>

                      <TableCell className="text-right">
                        {item.status === "PENDING" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancelReservation(item.id)}
                            className="rounded-full text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border-rose-500/30 text-xs font-medium gap-1"
                          >
                            <FaTimesCircle className="h-3.5 w-3.5" /> Cancel Request
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
