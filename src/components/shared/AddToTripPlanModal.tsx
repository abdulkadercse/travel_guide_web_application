"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "./DatePicker";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser, selectCurrentToken } from "@/redux/features/auth/authSlice";
import {
  useGetTripPlansQuery,
  useAddTripPlanItemMutation,
  useCreateTripPlanMutation,
} from "@/redux/features/tripPlan/tripPlanApi";
import { FaRoute, FaPlus, FaSpinner, FaCalendarAlt, FaCheck } from "react-icons/fa";

interface AddToTripPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  destinationId: string;
  destinationTitle: string;
}

export function AddToTripPlanModal({
  isOpen,
  onClose,
  destinationId,
  destinationTitle,
}: AddToTripPlanModalProps) {
  const router = useRouter();
  const user = useAppSelector(selectCurrentUser);
  const token = useAppSelector(selectCurrentToken);

  const { data: tripPlansResponse } = useGetTripPlansQuery(undefined, {
    skip: !token || !user,
  });
  const [addTripPlanItem] = useAddTripPlanItemMutation();
  const [createTripPlan] = useCreateTripPlanMutation();

  const myTripPlans: any[] = tripPlansResponse?.data ?? [];

  const [mode, setMode] = useState<"EXISTING" | "NEW">("EXISTING");
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [visitDate, setVisitDate] = useState<Date | undefined>(undefined);
  const [itemNotes, setItemNotes] = useState("");

  // New Plan State
  const [newPlanTitle, setNewPlanTitle] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  );
  const [totalBudget, setTotalBudget] = useState(10000);
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !user) {
      toast.error("Please log in to add destinations to custom trip plans");
      router.push("/login");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("Adding to trip plan...");

    try {
      let targetPlanId = selectedPlanId;

      if (mode === "NEW") {
        if (!newPlanTitle || !startDate || !endDate) {
          toast.error("Please fill in trip title and dates");
          setSubmitting(false);
          toast.dismiss(toastId);
          return;
        }

        const created = await createTripPlan({
          title: newPlanTitle,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          totalBudget: Number(totalBudget),
        }).unwrap();

        targetPlanId = created?.data?.id || created?.id;
      }

      if (!targetPlanId) {
        toast.error("Please select a trip plan");
        setSubmitting(false);
        toast.dismiss(toastId);
        return;
      }

      await addTripPlanItem({
        id: targetPlanId,
        destinationId,
        visitDate: visitDate ? new Date(visitDate).toISOString() : undefined,
        notes: itemNotes,
      }).unwrap();

      toast.success(`Added ${destinationTitle} to your trip plan!`, { id: toastId });
      onClose();
      router.push(`/dashboard/trip-plans/${targetPlanId}`);
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message || "Failed to add to trip plan";
      toast.error(msg, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-card border-border font-sans">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <FaRoute className="text-indigo-500" />
            <span>Add "{destinationTitle}" to Custom Trip Plan</span>
          </DialogTitle>
        </DialogHeader>

        {/* Mode Selector Tabs */}
        <div className="flex rounded-xl bg-muted/40 p-1 border border-border">
          <button
            type="button"
            onClick={() => setMode("EXISTING")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === "EXISTING" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            Select Existing Plan ({myTripPlans.length})
          </button>
          <button
            type="button"
            onClick={() => setMode("NEW")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === "NEW" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            + Create New Plan
          </button>
        </div>

        <form onSubmit={handleAdd} className="space-y-4 pt-1">
          {mode === "EXISTING" ? (
            <div className="space-y-3">
              {myTripPlans.length === 0 ? (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 font-semibold space-y-2">
                  <p>You don't have any saved trip plans yet.</p>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setMode("NEW")}
                    className="bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-full"
                  >
                    Create New Trip Plan Now
                  </Button>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Select Trip Plan</label>
                  <select
                    value={selectedPlanId}
                    onChange={(e) => setSelectedPlanId(e.target.value)}
                    className="w-full h-10 rounded-md border bg-background px-3 text-sm focus:ring-2 focus:ring-indigo-500"
                    required={mode === "EXISTING"}
                  >
                    <option value="">-- Select an Itinerary --</option>
                    {myTripPlans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.title} (৳{plan.totalBudget?.toLocaleString() || 0})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <DatePicker
                  label="Planned Visit Date (Optional)"
                  date={visitDate}
                  onSelect={setVisitDate}
                  placeholder="Select visit date"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Spot Notes / Activities</label>
                <Textarea
                  placeholder="e.g. Photography, boat riding, morning trek..."
                  value={itemNotes}
                  onChange={(e) => setItemNotes(e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold">New Trip Plan Title</label>
                <Input
                  placeholder="e.g. Sylhet Tea Garden & Waterfall Tour"
                  value={newPlanTitle}
                  onChange={(e) => setNewPlanTitle(e.target.value)}
                  required={mode === "NEW"}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <DatePicker
                  label="Start Date"
                  date={startDate}
                  onSelect={setStartDate}
                  placeholder="Start date"
                />
                <DatePicker
                  label="End Date"
                  date={endDate}
                  onSelect={setEndDate}
                  minDate={startDate}
                  placeholder="End date"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Total Target Budget (BDT ৳)</label>
                <Input
                  type="number"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(Number(e.target.value))}
                  required={mode === "NEW"}
                />
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold gap-1">
              {submitting ? <FaSpinner className="animate-spin" /> : <><FaCheck /> Add to Trip Plan</>}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export default AddToTripPlanModal;
