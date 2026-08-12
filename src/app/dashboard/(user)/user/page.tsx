"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { ProtectedRoute, Container, AvatarUploader } from "@/components/shared";
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
import { logout, selectCurrentUser, setUser } from "@/redux/features/auth/authSlice";
import {
  useGetFavoritesQuery,
  useRemoveFavoriteMutation,
} from "@/redux/features/favorite/favoriteApi";
import { useGetReservationsQuery } from "@/redux/features/reservation/reservationApi";
import {
  useGetTripPlansQuery,
  useCreateTripPlanMutation,
} from "@/redux/features/tripPlan/tripPlanApi";
import { useTheme } from "next-themes";
import {
  FaCompass,
  FaCalendarCheck,
  FaRoute,
  FaPlus,
  FaSignOutAlt,
  FaMoon,
  FaSun,
  FaSpinner,
  FaUserCheck,
  FaPlaneDeparture,
  FaHeart,
  FaTrashAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function UserDashboardPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

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

  const myReservations: any[] = reservationsResponse?.data ?? [];
  const myTripPlans: any[] = tripPlansResponse?.data ?? [];
  const myFavorites: any[] = favoritesResponse?.data ?? [];

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

  useEffect(() => {
    setMounted(true);
  }, []);

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
    <ProtectedRoute allowedRoles={["USER", "ADMIN", "SUPER_ADMIN"]}>
      <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 font-sans selection:bg-indigo-500 selection:text-white">
        {/* User Navbar */}
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
          </Container>
        </header>

        {/* Dashboard Main Body */}
        <main className="flex-1 py-8">
          <Container className="space-y-8">
            {/* User Profile Banner & Avatar Uploader */}
            <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-md relative overflow-hidden flex flex-col sm:flex-row items-center gap-6">
              <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

              <AvatarUploader
                src={user?.avatar}
                name={user?.name}
                size="xl"
                onUploadSuccess={handleAvatarUpdateSuccess}
              />

              <div className="text-center sm:text-left space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {user?.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 uppercase tracking-wider flex items-center gap-1">
                    <FaUserCheck className="h-3 w-3" /> {user?.role}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">{user?.email}</p>
                <p className="text-xs text-muted-foreground pt-1">
                  Manage your saved favorites, trip itineraries, and hotel bookings.
                </p>
              </div>

              {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && (
                <Button className="bg-rose-600 hover:bg-rose-500 text-white rounded-full px-5 font-semibold" asChild>
                  <Link href="/dashboard/admin">Admin Panel</Link>
                </Button>
              )}
            </div>

            {/* My Saved Favorites Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                    <FaHeart className="text-rose-500 h-5 w-5" />
                    My Saved Favorites ({myFavorites.length})
                  </h2>
                  <p className="text-xs text-muted-foreground">Destinations you bookmarked for future trips</p>
                </div>
                <Button size="sm" variant="outline" className="rounded-full" asChild>
                  <Link href="/">Browse All Destinations</Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {loadingFavorites ? (
                  <div className="col-span-full py-12 flex justify-center text-muted-foreground">
                    <FaSpinner className="h-6 w-6 animate-spin text-rose-500" />
                  </div>
                ) : myFavorites.length === 0 ? (
                  <div className="col-span-full py-12 text-center text-muted-foreground text-sm space-y-2">
                    <p>No saved favorite destinations yet.</p>
                    <p className="text-xs text-muted-foreground">Click the heart icon on any destination card to bookmark it!</p>
                  </div>
                ) : (
                  myFavorites.map((fav) => (
                    <div
                      key={fav.id}
                      className="group p-4 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-between gap-4 hover:border-rose-500/40 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        {fav.destination?.coverImage && (
                          <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-slate-900 border shrink-0">
                            <Image
                              src={fav.destination.coverImage}
                              alt={fav.destination.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-sm leading-snug group-hover:text-rose-400 transition-colors">
                            {fav.destination?.title || "Saved Destination"}
                          </h3>
                          <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                            <FaMapMarkerAlt className="h-3 w-3 text-rose-500 shrink-0" />
                            {fav.destination?.location || fav.destination?.district || "Bangladesh"}
                          </p>
                          <p className="text-xs font-black text-emerald-400 mt-1">
                            ৳{fav.destination?.price || 0}
                          </p>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveFavorite(fav.destinationId)}
                        className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-full h-8 w-8 p-0 shrink-0"
                        title="Remove from favorites"
                      >
                        <FaTrashAlt className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* My Bookings & Reservations Section */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                    <FaCalendarCheck className="text-indigo-500 h-5 w-5" />
                    My Bookings & Reservations
                  </h2>
                  <p className="text-xs text-muted-foreground">Track status of your hotel and tour package bookings</p>
                </div>
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-semibold" asChild>
                  <Link href="/demo">Book New Tour</Link>
                </Button>
              </div>

              <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                {loadingReservations ? (
                  <div className="py-12 flex justify-center text-muted-foreground">
                    <FaSpinner className="h-6 w-6 animate-spin text-indigo-500" />
                  </div>
                ) : myReservations.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground text-sm space-y-2">
                    <p>No reservations found.</p>
                    <Button size="sm" variant="outline" className="rounded-full" asChild>
                      <Link href="/">Explore Destinations</Link>
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Booking Item</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Total Cost</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {myReservations.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-bold text-foreground">
                            {item.destination?.title || item.hotel?.name || "Tour Package"}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {new Date(item.startDate).toLocaleDateString()} &mdash;{" "}
                            {new Date(item.endDate).toLocaleDateString()}
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
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>

            {/* My Trip Plans Section */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                    <FaRoute className="text-indigo-500 h-5 w-5" />
                    My Custom Trip Plans
                  </h2>
                  <p className="text-xs text-muted-foreground">Personalized travel itineraries and schedule notes</p>
                </div>

                <Dialog open={planDialogOpen} onOpenChange={setPlanDialogOpen}>
                  <DialogTrigger>
                    <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-semibold gap-2">
                      <FaPlus className="h-3.5 w-3.5" /> Create Trip Plan
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md bg-card border-border">
                    <DialogHeader>
                      <DialogTitle className="text-lg font-bold">Create Personalized Trip Plan</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleCreateTripPlan} className="space-y-4 pt-2">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold">Plan Title</label>
                        <Input
                          placeholder="e.g. Summer Vacation in Cox's Bazar"
                          value={newPlan.title}
                          onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold">Start Date</label>
                          <Input
                            type="date"
                            value={newPlan.startDate}
                            onChange={(e) => setNewPlan({ ...newPlan, startDate: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold">End Date</label>
                          <Input
                            type="date"
                            value={newPlan.endDate}
                            onChange={(e) => setNewPlan({ ...newPlan, endDate: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold">Estimated Budget (BDT)</label>
                        <Input
                          type="number"
                          placeholder="5000"
                          value={newPlan.totalBudget}
                          onChange={(e) => setNewPlan({ ...newPlan, totalBudget: Number(e.target.value) })}
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold">Notes & Schedule Ideas</label>
                        <Textarea
                          placeholder="Activities, places to visit, packing list..."
                          value={newPlan.notes}
                          onChange={(e) => setNewPlan({ ...newPlan, notes: e.target.value })}
                          rows={3}
                        />
                      </div>

                      <div className="pt-2 flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setPlanDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={submittingPlan} className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold">
                          {submittingPlan ? <FaSpinner className="animate-spin mr-1" /> : "Save Plan"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {loadingTripPlans ? (
                  <div className="col-span-full py-12 flex justify-center text-muted-foreground">
                    <FaSpinner className="h-6 w-6 animate-spin text-indigo-500" />
                  </div>
                ) : myTripPlans.length === 0 ? (
                  <div className="col-span-full py-12 text-center text-muted-foreground text-sm">
                    No custom trip plans created yet. Click "Create Trip Plan" above.
                  </div>
                ) : (
                  myTripPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className="p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-lg leading-snug">{plan.title}</h3>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                            ৳{plan.totalBudget || 0}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <FaPlaneDeparture className="h-3 w-3 text-indigo-500 shrink-0" />
                          {new Date(plan.startDate).toLocaleDateString()} &mdash;{" "}
                          {new Date(plan.endDate).toLocaleDateString()}
                        </p>
                        {plan.notes && (
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-2 bg-muted/40 p-2 rounded-lg">
                            {plan.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Container>
        </main>
      </div>
    </ProtectedRoute>
  );
}
