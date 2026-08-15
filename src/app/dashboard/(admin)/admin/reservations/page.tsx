"use client";

import React, { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { ProtectedRoute } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  useGetReservationsQuery,
  useUpdateReservationStatusMutation,
} from "@/redux/features/reservation/reservationApi";
import {
  FaCalendarCheck,
  FaSearch,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaHotel,
  FaUtensils,
  FaGlobe,
  FaUsers,
  FaCoins,
} from "react-icons/fa";

export default function AdminReservationsPage() {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: resResponse, isLoading } = useGetReservationsQuery({
    status: statusFilter !== "ALL" ? statusFilter : undefined,
  });

  const [updateReservationStatus] = useUpdateReservationStatusMutation();

  const allReservations: any[] = Array.isArray(resResponse?.data)
    ? resResponse.data
    : Array.isArray(resResponse)
    ? resResponse
    : [];

  const filteredReservations = allReservations.filter((res) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const userName = res.user?.name?.toLowerCase() || "";
    const userEmail = res.user?.email?.toLowerCase() || "";
    const targetTitle = (res.hotel?.name || res.restaurant?.name || res.destination?.title || "").toLowerCase();
    return userName.includes(term) || userEmail.includes(term) || targetTitle.includes(term);
  });

  const handleStatusChange = async (id: string, newStatus: string) => {
    const toastId = toast.loading(`Updating reservation to ${newStatus}...`);
    try {
      await updateReservationStatus({ id, status: newStatus }).unwrap();
      toast.success(`Reservation marked as ${newStatus}!`, { id: toastId });
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message || "Failed to update reservation";
      toast.error(msg, { id: toastId });
    }
  };

  const pendingCount = allReservations.filter((r) => r.status === "PENDING").length;
  const confirmedCount = allReservations.filter((r) => r.status === "CONFIRMED").length;
  const totalRevenue = allReservations
    .filter((r) => r.status === "CONFIRMED" || r.status === "COMPLETED")
    .reduce((sum, r) => sum + (r.totalCost || 0), 0);

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
      <div className="space-y-8 font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 shrink-0">
                <FaCalendarCheck className="h-5 w-5" />
              </div>
              Reservations & Bookings Control
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Inspect, confirm, and manage traveler bookings for hotels, dining spots, and destinations.
            </p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[11px] font-bold text-muted-foreground uppercase">Total Bookings</p>
              <h3 className="text-2xl font-black text-foreground mt-0.5">{allReservations.length}</h3>
            </div>
            <FaCalendarCheck className="h-6 w-6 text-indigo-500" />
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[11px] font-bold text-amber-400 uppercase">Pending Requests</p>
              <h3 className="text-2xl font-black text-amber-400 mt-0.5">{pendingCount}</h3>
            </div>
            <FaClock className="h-6 w-6 text-amber-400" />
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[11px] font-bold text-emerald-400 uppercase">Confirmed</p>
              <h3 className="text-2xl font-black text-emerald-400 mt-0.5">{confirmedCount}</h3>
            </div>
            <FaCheckCircle className="h-6 w-6 text-emerald-400" />
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[11px] font-bold text-muted-foreground uppercase">Revenue Processed</p>
              <h3 className="text-2xl font-black text-emerald-400 mt-0.5">৳{totalRevenue.toLocaleString()}</h3>
            </div>
            <FaCoins className="h-6 w-6 text-emerald-500" />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-4 rounded-2xl bg-card border border-border flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by customer name, email, or booking item..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 rounded-xl"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {["ALL", "PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"].map((st) => (
              <Button
                key={st}
                variant={statusFilter === st ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(st)}
                className={`rounded-xl text-xs font-bold ${
                  statusFilter === st ? "bg-indigo-600 text-white" : ""
                }`}
              >
                {st}
              </Button>
            ))}
          </div>
        </div>

        {/* Table View */}
        <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="py-16 flex justify-center text-muted-foreground">
              <FaSpinner className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
          ) : filteredReservations.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground space-y-2">
              <FaCalendarCheck className="h-10 w-10 text-muted-foreground/30 mx-auto" />
              <p className="font-bold text-foreground">No reservations found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-border/80">
                  <TableHead>Customer</TableHead>
                  <TableHead>Reserved Item</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Total Cost</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservations.map((item) => {
                  const targetName = item.hotel?.name || item.restaurant?.name || item.destination?.title || "Custom Service";
                  const targetType = item.hotelId ? "HOTEL" : item.restaurantId ? "RESTAURANT" : "DESTINATION";
                  const targetLocation = item.hotel?.location || item.restaurant?.location || item.destination?.location || "";

                  return (
                    <TableRow key={item.id} className="hover:bg-muted/30 border-b border-border/60">
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="relative h-9 w-9 rounded-full overflow-hidden bg-slate-800 border shrink-0">
                            <Image
                              src={item.user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                              alt={item.user?.name || "User"}
                              fill
                              sizes="36px"
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-foreground text-xs leading-tight">{item.user?.name || "Customer"}</p>
                            <p className="text-[11px] text-muted-foreground">{item.user?.email || ""}</p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 text-xs">
                            {targetType === "HOTEL" ? <FaHotel /> : targetType === "RESTAURANT" ? <FaUtensils /> : <FaGlobe />}
                          </div>
                          <div>
                            <p className="font-bold text-foreground text-xs">{targetName}</p>
                            {targetLocation && <p className="text-[10px] text-muted-foreground">{targetLocation}</p>}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="text-xs font-mono text-muted-foreground">
                        <div>{new Date(item.startDate).toLocaleDateString()}</div>
                        <div className="text-[10px] text-muted-foreground/70">&rarr; {new Date(item.endDate).toLocaleDateString()}</div>
                      </TableCell>

                      <TableCell className="font-black text-emerald-400 text-xs">
                        ৳{(item.totalCost || 0).toLocaleString()}
                      </TableCell>

                      <TableCell>
                        <span
                          className={`px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full border ${
                            item.status === "CONFIRMED"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : item.status === "CANCELLED"
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                              : item.status === "COMPLETED"
                              ? "bg-sky-500/10 text-sky-400 border-sky-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}
                        >
                          {item.status}
                        </span>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.status === "PENDING" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleStatusChange(item.id, "CONFIRMED")}
                                className="h-8 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black gap-1 cursor-pointer shadow-xs"
                              >
                                <FaCheckCircle className="h-3 w-3" /> Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(item.id, "CANCELLED")}
                                className="h-8 px-2.5 text-rose-400 hover:bg-rose-500/15 border-rose-500/30 rounded-xl text-xs font-bold gap-1 cursor-pointer"
                              >
                                <FaTimesCircle className="h-3 w-3" /> Reject
                              </Button>
                            </>
                          )}
                          {item.status === "CONFIRMED" && (
                            <div className="flex items-center gap-1.5">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(item.id, "COMPLETED")}
                                className="h-8 px-3 text-sky-400 hover:bg-sky-500/10 border-sky-500/30 rounded-xl text-xs font-bold cursor-pointer"
                              >
                                Mark Completed
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleStatusChange(item.id, "CANCELLED")}
                                className="h-8 px-2 text-rose-400 hover:bg-rose-500/10 rounded-xl text-xs font-bold cursor-pointer"
                                title="Cancel this confirmed booking"
                              >
                                Cancel
                              </Button>
                            </div>
                          )}
                          {item.status === "CANCELLED" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(item.id, "CONFIRMED")}
                              className="h-8 px-2.5 text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/30 rounded-xl text-xs font-bold cursor-pointer"
                            >
                              Re-Accept
                            </Button>
                          )}
                        </div>
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
