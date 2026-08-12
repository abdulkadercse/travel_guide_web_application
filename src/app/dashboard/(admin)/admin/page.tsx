"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { ProtectedRoute, Container, ImageUploader } from "@/components/shared";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout, selectCurrentUser } from "@/redux/features/auth/authSlice";
import {
  useGetDestinationsQuery,
  useCreateDestinationMutation,
  useDeleteDestinationMutation,
} from "@/redux/features/destination/destinationApi";
import {
  useGetReservationsQuery,
  useUpdateReservationStatusMutation,
} from "@/redux/features/reservation/reservationApi";
import { useTheme } from "next-themes";
import {
  FaCompass,
  FaCompass as FaGlobe,
  FaUsers,
  FaMapMarkerAlt,
  FaCalendarCheck,
  FaPlus,
  FaTrashAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaSignOutAlt,
  FaMoon,
  FaSun,
  FaShieldAlt,
  FaSpinner,
  FaStar,
} from "react-icons/fa";

export default function AdminDashboardPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Data comes from the Express API through RTK Query
  const { data: destinationsResponse, isLoading: loadingDestinations } =
    useGetDestinationsQuery(undefined);
  const { data: reservationsResponse, isLoading: loadingReservations } =
    useGetReservationsQuery(undefined);
  const [createDestination] = useCreateDestinationMutation();
  const [deleteDestinationMutation] = useDeleteDestinationMutation();
  const [updateReservationStatus] = useUpdateReservationStatusMutation();

  const destinations: any[] = destinationsResponse?.data ?? [];
  const reservations: any[] = reservationsResponse?.data ?? [];

  // New Destination Form state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newDest, setNewDest] = useState({
    title: "",
    description: "",
    location: "",
    district: "",
    category: "Beach",
    coverImage: "",
    price: 1500,
  });
  const [submittingDest, setSubmittingDest] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const errorMessage = (err: unknown, fallback: string) =>
    (err as { data?: { message?: string } })?.data?.message || fallback;

  const handleCreateDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDest.coverImage) {
      toast.error("Please upload a cover image first!");
      return;
    }

    setSubmittingDest(true);
    const toastId = toast.loading("Saving destination...");

    try {
      await createDestination({
        ...newDest,
        price: Number(newDest.price),
      }).unwrap();

      toast.success("Destination added successfully!", { id: toastId });
      setDialogOpen(false);
      setNewDest({
        title: "",
        description: "",
        location: "",
        district: "",
        category: "Beach",
        coverImage: "",
        price: 1500,
      });
    } catch (err: unknown) {
      toast.error(errorMessage(err, "Failed to create destination"), { id: toastId });
    } finally {
      setSubmittingDest(false);
    }
  };

  const handleDeleteDestination = async (id: string) => {
    if (!confirm("Are you sure you want to delete this destination?")) return;

    try {
      await deleteDestinationMutation(id).unwrap();
      toast.success("Destination deleted");
    } catch (err: unknown) {
      toast.error(errorMessage(err, "Error deleting destination"));
    }
  };

  const handleUpdateReservationStatus = async (id: string, status: string) => {
    try {
      await updateReservationStatus({ id, status }).unwrap();
      toast.success(`Reservation ${status.toLowerCase()}`);
    } catch (err: unknown) {
      toast.error(errorMessage(err, "Failed to update status"));
    }
  };

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
      <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 font-sans selection:bg-indigo-500 selection:text-white">
        {/* Admin Header Navbar */}
        <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-background/80 border-b border-border">
          <Container>
            <div className="h-16 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="h-9 w-9 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
                  <FaCompass className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold tracking-wider text-foreground">
                  Travla<span className="text-indigo-500">BD</span>
                </span>
                <span className="ml-2 px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest bg-rose-500/15 text-rose-400 border border-rose-500/30 rounded-full flex items-center gap-1">
                  <FaShieldAlt className="h-2.5 w-2.5" /> Admin Panel
                </span>
              </Link>

              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="rounded-full h-9 w-9"
                >
                  {mounted && theme === "dark" ? (
                    <FaSun className="h-4 w-4 text-amber-400" />
                  ) : (
                    <FaMoon className="h-4 w-4 text-slate-700" />
                  )}
                </Button>

                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="hidden sm:inline-block text-muted-foreground">
                    Logged as <strong className="text-foreground">{user?.name}</strong>
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      dispatch(logout());
                      toast.success("Logged out successfully");
                    }}
                    className="rounded-full text-rose-400 hover:text-rose-300 border-border"
                  >
                    <FaSignOutAlt className="mr-1 h-3.5 w-3.5" /> Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </header>

        {/* Dashboard Main Content */}
        <main className="flex-1 py-8">
          <Container className="space-y-8">
            {/* Top Welcome & Analytics Summary Cards */}
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Administrator Control Center 🛡️
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Manage tourist destinations, reservation requests, and platform content.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Destinations
                    </p>
                    <h3 className="text-2xl font-black text-foreground mt-1">
                      {destinations.length}
                    </h3>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
                    <FaGlobe className="h-6 w-6" />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Reservations
                    </p>
                    <h3 className="text-2xl font-black text-foreground mt-1">
                      {reservations.length}
                    </h3>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <FaCalendarCheck className="h-6 w-6" />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Pending Approvals
                    </p>
                    <h3 className="text-2xl font-black text-amber-500 mt-1">
                      {reservations.filter((r) => r.status === "PENDING").length}
                    </h3>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                    <FaCalendarCheck className="h-6 w-6" />
                  </div>
                </div>

                <Link
                  href="/dashboard/admin/all-users"
                  className="p-5 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-between hover:border-indigo-500/50 transition-all group"
                >
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      User Management
                    </p>
                    <h3 className="text-sm font-bold text-indigo-400 mt-1 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Manage All Users &rarr;
                    </h3>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                    <FaUsers className="h-6 w-6" />
                  </div>
                </Link>
              </div>
            </div>

            {/* Destinations Management Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Tourist Destinations</h2>
                  <p className="text-xs text-muted-foreground">Add and manage travel spots across Bangladesh</p>
                </div>

                {/* Add New Destination Dialog Modal */}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger>
                    <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-semibold gap-2 shadow-md shadow-indigo-600/20">
                      <FaPlus className="h-3.5 w-3.5" /> Add Destination
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-card border-border">
                    <DialogHeader>
                      <DialogTitle className="text-lg font-bold">Add New Tourist Destination</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleCreateDestination} className="space-y-4 pt-2">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold">Destination Title</label>
                        <Input
                          placeholder="e.g. Cox's Bazar Sea Beach"
                          value={newDest.title}
                          onChange={(e) => setNewDest({ ...newDest, title: e.target.value })}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold">District</label>
                          <Input
                            placeholder="e.g. Cox's Bazar"
                            value={newDest.district}
                            onChange={(e) => setNewDest({ ...newDest, district: e.target.value })}
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold">Location / Division</label>
                          <Input
                            placeholder="e.g. Chittagong Division"
                            value={newDest.location}
                            onChange={(e) => setNewDest({ ...newDest, location: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold">Category</label>
                          <select
                            value={newDest.category}
                            onChange={(e) => setNewDest({ ...newDest, category: e.target.value })}
                            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <option value="Beach">Beach</option>
                            <option value="Heritage">Heritage & History</option>
                            <option value="Mountain">Mountain & Hill Resort</option>
                            <option value="Tea Garden">Tea Garden</option>
                            <option value="Forest">Forest & Wildlife</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold">Estimated Package Price (BDT)</label>
                          <Input
                            type="number"
                            placeholder="1500"
                            value={newDest.price}
                            onChange={(e) => setNewDest({ ...newDest, price: Number(e.target.value) })}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold">Description</label>
                        <Textarea
                          placeholder="Describe the tourist attraction, activities, and travel highlights..."
                          value={newDest.description}
                          onChange={(e) => setNewDest({ ...newDest, description: e.target.value })}
                          rows={3}
                          required
                        />
                      </div>

                      {/* Integrated Cloudinary Image Uploader */}
                      <ImageUploader
                        label="Destination Cover Image (Cloudinary)"
                        folder="destinations"
                        value={newDest.coverImage}
                        onChange={(url) => setNewDest({ ...newDest, coverImage: url })}
                        onRemove={() => setNewDest({ ...newDest, coverImage: "" })}
                      />

                      <div className="pt-2 flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={submittingDest} className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold">
                          {submittingDest ? <FaSpinner className="animate-spin mr-1" /> : "Save Destination"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Table of Destinations */}
              <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                {loadingDestinations ? (
                  <div className="py-12 flex justify-center text-muted-foreground">
                    <FaSpinner className="h-6 w-6 animate-spin text-indigo-500" />
                  </div>
                ) : destinations.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground text-sm">
                    No destinations created yet. Click "Add Destination" above.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cover</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>District</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {destinations.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="relative h-12 w-16 rounded-lg overflow-hidden bg-slate-900 border">
                              <Image src={item.coverImage} alt={item.title} fill className="object-cover" />
                            </div>
                          </TableCell>
                          <TableCell className="font-bold text-foreground">
                            {item.title}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs">
                            <span className="flex items-center gap-1">
                              <FaMapMarkerAlt className="text-indigo-500 h-3 w-3" /> {item.district}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                              {item.category}
                            </span>
                          </TableCell>
                          <TableCell className="font-bold text-emerald-400">
                            ৳{item.price || 0}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteDestination(item.id)}
                              className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-full h-8 w-8 p-0"
                              title="Delete destination"
                            >
                              <FaTrashAlt className="h-3.5 w-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>

            {/* Reservations Management Section */}
            <div className="space-y-4 pt-4">
              <div className="border-b border-border pb-4">
                <h2 className="text-xl font-bold tracking-tight">Customer Reservations & Booking Requests</h2>
                <p className="text-xs text-muted-foreground">Approve or cancel user booking requests</p>
              </div>

              <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                {loadingReservations ? (
                  <div className="py-12 flex justify-center text-muted-foreground">
                    <FaSpinner className="h-6 w-6 animate-spin text-indigo-500" />
                  </div>
                ) : reservations.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground text-sm">
                    No customer reservations submitted yet.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Destination / Item</TableHead>
                        <TableHead>Cost</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reservations.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <p className="font-bold text-foreground">{item.user?.name || "Customer"}</p>
                            <p className="text-[10px] text-muted-foreground">{item.user?.email}</p>
                          </TableCell>
                          <TableCell className="text-xs">
                            {item.destination?.title || item.hotel?.name || "Tour Booking"}
                          </TableCell>
                          <TableCell className="font-bold text-emerald-400 text-xs">
                            ৳{item.totalCost}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                item.status === "CONFIRMED"
                                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                  : item.status === "CANCELLED"
                                  ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                                  : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                              }`}
                            >
                              {item.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {item.status !== "CONFIRMED" && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleUpdateReservationStatus(item.id, "CONFIRMED")}
                                  className="text-emerald-400 hover:bg-emerald-500/10 h-8 px-2 text-xs font-semibold gap-1"
                                >
                                  <FaCheckCircle className="h-3.5 w-3.5" /> Approve
                                </Button>
                              )}
                              {item.status !== "CANCELLED" && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleUpdateReservationStatus(item.id, "CANCELLED")}
                                  className="text-rose-400 hover:bg-rose-500/10 h-8 px-2 text-xs font-semibold gap-1"
                                >
                                  <FaTimesCircle className="h-3.5 w-3.5" /> Cancel
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>
          </Container>
        </main>
      </div>
    </ProtectedRoute>
  );
}
