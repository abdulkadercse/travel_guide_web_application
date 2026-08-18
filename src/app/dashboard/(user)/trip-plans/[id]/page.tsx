"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { ProtectedRoute, DatePicker } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import {
  useGetTripPlanByIdQuery,
  useUpdateTripPlanMutation,
  useAddTripPlanItemMutation,
  useDeleteTripPlanItemMutation,
} from "@/redux/features/tripPlan/tripPlanApi";
import { useGetDestinationsQuery } from "@/redux/features/destination/destinationApi";
import {
  FaArrowLeft,
  FaRoute,
  FaCalendarAlt,
  FaCoins,
  FaPlus,
  FaTrashAlt,
  FaSpinner,
  FaMapMarkerAlt,
  FaEdit,
  FaCheck,
  FaExclamationTriangle,
} from "react-icons/fa";

export default function TripPlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: planId } = use(params);
  const user = useAppSelector(selectCurrentUser);

  const { data: planResponse, isLoading } = useGetTripPlanByIdQuery(planId, {
    skip: !planId || !user,
  });
  const { data: destinationsResponse } = useGetDestinationsQuery(undefined);

  const [updateTripPlan] = useUpdateTripPlanMutation();
  const [addTripPlanItem] = useAddTripPlanItemMutation();
  const [deleteTripPlanItem] = useDeleteTripPlanItemMutation();

  const plan = planResponse?.data;
  const destinations: any[] = destinationsResponse?.data ?? [];

  // Edit Plan Details State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    startDate: "",
    endDate: "",
    totalBudget: 0,
    notes: "",
  });

  // Add Item Modal State
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    destinationId: "",
    visitDate: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const errorMessage = (err: unknown, fallback: string) =>
    (err as { data?: { message?: string } })?.data?.message || fallback;

  const handleStartEdit = () => {
    if (!plan) return;
    setEditForm({
      title: plan.title,
      startDate: new Date(plan.startDate).toISOString().split("T")[0],
      endDate: new Date(plan.endDate).toISOString().split("T")[0],
      totalBudget: plan.totalBudget || 0,
      notes: plan.notes || "",
    });
    setIsEditing(true);
  };

  const handleSavePlanDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Updating plan details...");
    try {
      await updateTripPlan({
        id: planId,
        ...editForm,
        totalBudget: Number(editForm.totalBudget),
      }).unwrap();
      toast.success("Plan updated successfully!", { id: toastId });
      setIsEditing(false);
    } catch (err: unknown) {
      toast.error(errorMessage(err, "Failed to update plan"), { id: toastId });
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.destinationId)
      return toast.error("Please select a destination");

    setSubmitting(true);
    const toastId = toast.loading("Adding spot to itinerary...");
    try {
      await addTripPlanItem({
        id: planId,
        ...newItem,
      }).unwrap();
      toast.success("Destination spot added to itinerary!", { id: toastId });
      setItemDialogOpen(false);
      setNewItem({ destinationId: "", visitDate: "", notes: "" });
    } catch (err: unknown) {
      toast.error(errorMessage(err, "Failed to add destination"), {
        id: toastId,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("Are you sure you want to remove this spot from your plan?"))
      return;
    try {
      await deleteTripPlanItem({ planId, itemId }).unwrap();
      toast.success("Spot removed from itinerary");
    } catch (err: unknown) {
      toast.error(errorMessage(err, "Failed to remove item"));
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 flex justify-center text-muted-foreground">
        <FaSpinner className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="text-xl font-medium">Trip Plan Not Found</h2>
        <Button variant="outline" className="rounded-full" asChild>
          <Link href="/dashboard/trip-plans">Back to Trip Plans</Link>
        </Button>
      </div>
    );
  }

  const estimatedTotalCost = (plan.items || []).reduce(
    (sum: number, item: any) => sum + (item.destination?.price || 0),
    0,
  );

  const budgetExceeded = estimatedTotalCost > (plan.totalBudget || 0);

  return (
    <ProtectedRoute allowedRoles={["USER", "ADMIN", "SUPER_ADMIN"]}>
      <div className="space-y-8 font-sans">
        {/* Navigation Back Button */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full font-medium text-xs"
            asChild>
            <Link href="/dashboard/trip-plans">
              <FaArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to My Custom
              Trip Plans
            </Link>
          </Button>
        </div>

        {/* Plan Header Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border shadow-md space-y-6">
          {!isEditing ? (
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                    {plan.title}
                  </h1>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 inline-flex items-center gap-1.5">
                    <FaCalendarAlt className="h-3 w-3" />
                    {new Date(plan.startDate).toLocaleDateString()} &ndash;{" "}
                    {new Date(plan.endDate).toLocaleDateString()}
                  </span>
                </div>

                {plan.notes && (
                  <p className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-2xl border border-border/50 max-w-2xl">
                    {plan.notes}
                  </p>
                )}
              </div>

              <Button
                onClick={handleStartEdit}
                variant="outline"
                className="rounded-full font-medium text-xs gap-1.5 shrink-0"
              >
                <FaEdit className="h-3.5 w-3.5 text-primary" /> Edit Plan
                Details
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSavePlanDetails} className="space-y-4">
              <h2 className="text-lg font-medium">Edit Plan Details</h2>
              <div className="space-y-1">
                <label className="text-xs font-semibold">Title</label>
                <Input
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <DatePicker
                  label="Start Date"
                  value={editForm.startDate}
                  onChange={(val) =>
                    setEditForm({ ...editForm, startDate: val })
                  }
                  placeholder="Start date"
                  required
                />
                <DatePicker
                  label="End Date"
                  value={editForm.endDate}
                  onChange={(val) => setEditForm({ ...editForm, endDate: val })}
                  placeholder="End date"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold">Budget (BDT)</label>
                <Input
                  type="number"
                  value={editForm.totalBudget}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      totalBudget: Number(e.target.value),
                    })
                  }
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold">Notes</label>
                <Textarea
                  rows={3}
                  value={editForm.notes}
                  onChange={(e) =>
                    setEditForm({ ...editForm, notes: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="gap-1"
                >
                  <FaCheck /> Save Changes
                </Button>
              </div>
            </form>
          )}

          {/* Budget & Cost Tracker Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="p-4 rounded-2xl bg-card/60 border border-border flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Target Budget</p>
                <h3 className="text-xl font-semibold text-foreground mt-0.5">
                  ৳{plan.totalBudget?.toLocaleString() || 0}
                </h3>
              </div>
              <FaCoins className="h-6 w-6 text-emerald-500" />
            </div>

            <div className="p-4 rounded-2xl bg-card/60 border border-border flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Estimated Spots Cost
                </p>
                <h3
                  className={`text-xl font-semibold mt-0.5 ${budgetExceeded ? "text-rose-400" : "text-emerald-400"}`}
                >
                  ৳{estimatedTotalCost.toLocaleString()}
                </h3>
              </div>
              <FaCoins
                className={`h-6 w-6 ${budgetExceeded ? "text-rose-500" : "text-emerald-500"}`}
              />
            </div>

            {budgetExceeded && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 col-span-full lg:col-span-1">
                <FaExclamationTriangle className="h-6 w-6 text-rose-400 shrink-0" />
                <p className="text-xs text-rose-400 font-semibold leading-tight">
                  Budget Warning: Estimated spots cost exceeds your target
                  budget by ৳
                  {(
                    estimatedTotalCost - (plan.totalBudget || 0)
                  ).toLocaleString()}
                  !
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Itinerary Spots Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h2 className="text-xl font-medium tracking-tight">
                Itinerary Destination Spots
              </h2>
              <p className="text-xs text-muted-foreground">
                Destinations added to this trip plan
              </p>
            </div>

            <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
              <DialogTrigger>
                <Button className="gap-2">
                  <FaPlus className="h-3.5 w-3.5" /> Add Spot to Itinerary
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="text-lg font-medium">
                    Add Destination to Plan
                  </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleAddItem} className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">
                      Select Destination
                    </label>
                    <select
                      value={newItem.destinationId}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          destinationId: e.target.value,
                        })
                      }
                      className="w-full h-10 rounded-md border bg-background px-3 text-sm focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="">-- Choose a Destination --</option>
                      {destinations.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.title} ({d.district}) &mdash; ৳{d.price || 0}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <DatePicker
                      label="Visit Date (Optional)"
                      value={newItem.visitDate}
                      onChange={(val) =>
                        setNewItem({ ...newItem, visitDate: val })
                      }
                      placeholder="Select visit date"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold">
                      Spot Notes / Activities
                    </label>
                    <Textarea
                      placeholder="e.g. Visit early morning for sunrise..."
                      value={newItem.notes}
                      onChange={(e) =>
                        setNewItem({ ...newItem, notes: e.target.value })
                      }
                      rows={3}
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setItemDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting}>
                      {submitting ? (
                        <FaSpinner className="animate-spin mr-1" />
                      ) : (
                        "Add to Plan"
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* List of Itinerary Items */}
          {!plan.items || plan.items.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground space-y-3 rounded-2xl border border-dashed border-border bg-card/50 p-8">
              <FaMapMarkerAlt className="h-10 w-10 text-muted-foreground/40 mx-auto" />
              <h3 className="text-base font-medium text-foreground">
                No spots added to itinerary yet
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Click "Add Spot to Itinerary" above to include tourist
                destinations in your schedule.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plan.items.map((item: any) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-card border border-border shadow-sm flex items-start justify-between gap-4 hover:border-primary/40 transition-all"
                >
                  <div className="flex items-start gap-4">
                    {item.destination?.coverImage && (
                      <div className="relative h-16 w-20 rounded-xl overflow-hidden bg-muted border shrink-0">
                        <Image
                          src={item.destination.coverImage}
                          alt={item.destination.title}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="space-y-1">
                      <h4 className="font-medium text-base text-foreground leading-snug">
                        {item.destination?.title || "Destination"}
                      </h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <FaMapMarkerAlt className="h-3 w-3 text-primary shrink-0" />
                        {item.destination?.location ||
                          item.destination?.district}
                      </p>
                      {item.visitDate && (
                        <p className="text-xs text-primary font-semibold">
                          Visit Date:{" "}
                          {new Date(item.visitDate).toLocaleDateString()}
                        </p>
                      )}
                      {item.notes && (
                        <p className="text-xs text-muted-foreground bg-muted/30 p-2 rounded-lg mt-1">
                          {item.notes}
                        </p>
                      )}
                      <p className="text-xs font-semibold text-emerald-400 pt-1">
                        Package: ৳{item.destination?.price || 0}
                      </p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-full h-8 w-8 p-0 shrink-0"
                    title="Remove item"
                  >
                    <FaTrashAlt className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
