"use client";

import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ProtectedRoute, DatePicker } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import {
  useGetTripPlansQuery,
  useCreateTripPlanMutation,
  useDeleteTripPlanMutation,
} from "@/redux/features/tripPlan/tripPlanApi";
import {
  FaRoute,
  FaPlus,
  FaCalendarAlt,
  FaTrashAlt,
  FaSpinner,
  FaPlaneDeparture,
  FaCoins,
  FaMapMarkerAlt,
  FaArrowRight,
  FaLayerGroup,
} from "react-icons/fa";

export default function UserTripPlansPage() {
  const user = useAppSelector(selectCurrentUser);
  const { data: tripPlansResponse, isLoading } = useGetTripPlansQuery(undefined, {
    skip: !user,
  });
  const [createTripPlan] = useCreateTripPlanMutation();
  const [deleteTripPlanMutation] = useDeleteTripPlanMutation();

  const myTripPlans: any[] = tripPlansResponse?.data ?? [];

  // Modal State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPlan, setNewPlan] = useState({
    title: "",
    startDate: "",
    endDate: "",
    totalBudget: 5000,
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const errorMessage = (err: unknown, fallback: string) =>
    (err as { data?: { message?: string } })?.data?.message || fallback;

  const handleCreateTripPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlan.startDate || !newPlan.endDate) {
      toast.error("Please select valid start and end dates");
      return;
    }

    if (new Date(newPlan.endDate) < new Date(newPlan.startDate)) {
      toast.error("End date cannot be earlier than start date");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("Creating your custom trip plan...");

    try {
      await createTripPlan({
        ...newPlan,
        totalBudget: Number(newPlan.totalBudget),
      }).unwrap();

      toast.success("Custom trip plan created successfully!", { id: toastId });
      setDialogOpen(false);
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
      setSubmitting(false);
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (!confirm("Are you sure you want to delete this trip plan?")) return;

    const toastId = toast.loading("Deleting trip plan...");
    try {
      await deleteTripPlanMutation(id).unwrap();
      toast.success("Trip plan deleted successfully", { id: toastId });
    } catch (err: unknown) {
      toast.error(errorMessage(err, "Failed to delete trip plan"), { id: toastId });
    }
  };

  const totalBudgetSum = myTripPlans.reduce((sum, p) => sum + (p.totalBudget || 0), 0);

  return (
    <ProtectedRoute allowedRoles={["USER", "ADMIN", "SUPER_ADMIN"]}>
      <div className="space-y-8 font-sans">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <FaRoute className="h-5 w-5" />
              </div>
              My Custom Trip Plans
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Design personalized travel itineraries, set budget goals, and organize your trip dates.
            </p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger
              render={
                <Button className="gap-2 shrink-0">
                  <FaPlus className="h-3.5 w-3.5" /> Create Trip Plan
                </Button>
              }
            />
            <DialogContent className="max-w-md bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-lg font-medium flex items-center gap-2">
                  <FaRoute className="text-primary h-5 w-5" /> Create New Trip Plan
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleCreateTripPlan} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Trip Title</label>
                  <Input
                    placeholder="e.g. 5-Day Bandarban & Nilgiri Tour"
                    value={newPlan.title}
                    onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <DatePicker
                    label="Start Date"
                    value={newPlan.startDate}
                    onChange={(val) => setNewPlan({ ...newPlan, startDate: val })}
                    placeholder="Start date"
                    required
                  />
                  <DatePicker
                    label="End Date"
                    value={newPlan.endDate}
                    onChange={(val) => setNewPlan({ ...newPlan, endDate: val })}
                    placeholder="End date"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Estimated Total Budget (BDT ৳)</label>
                  <Input
                    type="number"
                    placeholder="10000"
                    value={newPlan.totalBudget}
                    onChange={(e) => setNewPlan({ ...newPlan, totalBudget: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Schedule Ideas & Notes</label>
                  <Textarea
                    placeholder="Packing list, destinations to visit, hotel recommendations..."
                    value={newPlan.notes}
                    onChange={(e) => setNewPlan({ ...newPlan, notes: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? <FaSpinner className="animate-spin mr-1" /> : "Save Plan"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total Itineraries</p>
              <h3 className="text-2xl font-semibold text-foreground mt-0.5">{myTripPlans.length}</h3>
            </div>
            <FaRoute className="h-6 w-6 text-primary" />
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total Planned Budget</p>
              <h3 className="text-2xl font-semibold text-emerald-400 mt-0.5">৳{totalBudgetSum.toLocaleString()}</h3>
            </div>
            <FaCoins className="h-6 w-6 text-emerald-500" />
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Planned Destinations</p>
              <h3 className="text-2xl font-semibold text-primary mt-0.5">
                {myTripPlans.reduce((sum, p) => sum + (p.items?.length || 0), 0)} Spots
              </h3>
            </div>
            <FaLayerGroup className="h-6 w-6 text-primary" />
          </div>
        </div>

        {/* Custom Trip Plans Grid */}
        <div>
          {isLoading ? (
            <div className="py-16 flex justify-center text-muted-foreground">
              <FaSpinner className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : myTripPlans.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground space-y-4 rounded-2xl border border-dashed border-border bg-card/50 p-8">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto">
                <FaPlaneDeparture className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-medium text-foreground">No Custom Trip Plans Yet</h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Start organizing your dream vacation! Add destinations, dates, and budget estimates.
                </p>
              </div>
              <Button
                onClick={() => setDialogOpen(true)}
                className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-full font-medium gap-2"
              >
                <FaPlus className="h-3.5 w-3.5" /> Create Your First Plan
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myTripPlans.map((plan) => {
                const startDateStr = new Date(plan.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
                const endDateStr = new Date(plan.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
                const itemCount = plan.items?.length || 0;

                return (
                  <div
                    key={plan.id}
                    className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between space-y-5 hover:border-primary/50 hover:shadow-md transition-all group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 h-24 w-24 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

                    <div className="space-y-3">
                      {/* Top Bar: Dates & Budget Badge */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 inline-flex items-center gap-1.5">
                          <FaCalendarAlt className="h-3 w-3" />
                          {startDateStr} &ndash; {endDateStr}
                        </span>

                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          ৳{plan.totalBudget?.toLocaleString() || 0}
                        </span>
                      </div>

                      {/* Plan Title */}
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                        {plan.title}
                      </h3>

                      {/* Notes / Itinerary Schedule */}
                      {plan.notes ? (
                        <p className="text-xs text-muted-foreground line-clamp-3 bg-muted/30 p-3 rounded-2xl border border-border/50 leading-relaxed">
                          {plan.notes}
                        </p>
                      ) : (
                        <p className="text-xs italic text-muted-foreground/60">No notes added yet.</p>
                      )}

                      {/* Destination Items Count */}
                      <div className="flex items-center gap-2 pt-1 text-xs font-semibold text-muted-foreground">
                        <FaMapMarkerAlt className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>{itemCount} Destination {itemCount === 1 ? "Spot" : "Spots"} included</span>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-border/80">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeletePlan(plan.id)}
                        className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-full h-8 w-8 p-0"
                        title="Delete Plan"
                      >
                        <FaTrashAlt className="h-3.5 w-3.5" />
                      </Button>

                      <Button
                        size="sm"
                        className="bg-primary/10 hover:bg-primary-hover text-primary hover:text-primary-foreground border border-primary/30 rounded-full font-medium text-xs gap-1.5 transition-all"
                        asChild>
                        <Link href={`/dashboard/trip-plans/${plan.id}`}>
                          <span>Edit Itinerary</span>
                          <FaArrowRight className="h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
