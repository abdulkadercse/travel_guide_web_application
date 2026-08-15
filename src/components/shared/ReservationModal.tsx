"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser, selectCurrentToken } from "@/redux/features/auth/authSlice";
import { useCreateReservationMutation } from "@/redux/features/reservation/reservationApi";
import { FaCalendarAlt, FaUsers, FaCoins, FaSpinner, FaHotel, FaMapMarkerAlt, FaUtensils, FaGlobe } from "react-icons/fa";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: "DESTINATION" | "HOTEL" | "RESTAURANT" | "TRANSPORTATION";
  targetId: string;
  targetName: string;
  pricePerUnit: number;
  location?: string;
  coverImage?: string;
}

export function ReservationModal({
  isOpen,
  onClose,
  targetType,
  targetId,
  targetName,
  pricePerUnit,
  location,
  coverImage,
}: ReservationModalProps) {
  const router = useRouter();
  const user = useAppSelector(selectCurrentUser);
  const token = useAppSelector(selectCurrentToken);
  const [createReservation] = useCreateReservationMutation();

  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
  );
  const [guestCount, setGuestCount] = useState(1);
  const [specialRequests, setSpecialRequests] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Calculate estimated total cost
  let days = 1;
  if (startDate && endDate) {
    const s = startDate.getTime();
    const e = endDate.getTime();
    if (e > s) {
      days = Math.max(1, Math.ceil((e - s) / (1000 * 60 * 60 * 24)));
    }
  }
  const totalCost = (pricePerUnit || 1000) * days * (guestCount || 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !user) {
      toast.error("Please log in to submit a reservation request");
      router.push("/login");
      return;
    }

    if (!startDate || !endDate) {
      toast.error("Please select both check-in and check-out dates");
      return;
    }

    if (endDate < startDate) {
      toast.error("Check-out date cannot be before check-in date");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("Submitting your reservation request...");

    try {
      const payload: any = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalCost,
      };

      if (targetType === "HOTEL") payload.hotelId = targetId;
      else if (targetType === "RESTAURANT") payload.restaurantId = targetId;
      else payload.destinationId = targetId;

      await createReservation(payload).unwrap();

      toast.success("Reservation request submitted successfully! Track status in your Dashboard.", {
        id: toastId,
      });
      onClose();
      router.push("/dashboard/reservations");
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message || "Failed to submit reservation";
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
            {targetType === "HOTEL" ? <FaHotel className="text-indigo-500" /> : targetType === "RESTAURANT" ? <FaUtensils className="text-indigo-500" /> : <FaGlobe className="text-indigo-500" />}
            <span>Reserve {targetName}</span>
          </DialogTitle>
        </DialogHeader>

        {coverImage && (
          <div className="relative h-32 w-full rounded-2xl overflow-hidden border border-border">
            <Image src={coverImage} alt={targetName} fill sizes="400px" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-3 flex flex-col justify-end">
              <p className="text-white font-bold text-sm leading-tight">{targetName}</p>
              {location && (
                <p className="text-slate-300 text-xs flex items-center gap-1">
                  <FaMapMarkerAlt className="text-indigo-400 h-3 w-3" /> {location}
                </p>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold flex items-center gap-1 text-muted-foreground">
                <FaCalendarAlt className="h-3 w-3 text-indigo-500" /> Check-in Date
              </label>
              <DatePicker
                date={startDate}
                onSelect={setStartDate}
                placeholder="Check-in date"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold flex items-center gap-1 text-muted-foreground">
                <FaCalendarAlt className="h-3 w-3 text-indigo-500" /> Check-out Date
              </label>
              <DatePicker
                date={endDate}
                onSelect={setEndDate}
                minDate={startDate}
                placeholder="Check-out date"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold flex items-center gap-1 text-muted-foreground">
                <FaUsers className="h-3 w-3 text-indigo-500" /> Guests / Persons
              </label>
              <Input
                type="number"
                min={1}
                max={20}
                value={guestCount}
                onChange={(e) => setGuestCount(Math.max(1, Number(e.target.value)))}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold flex items-center gap-1 text-muted-foreground">
                <FaCoins className="h-3 w-3 text-emerald-500" /> Rate / Unit
              </label>
              <Input
                value={`৳${pricePerUnit?.toLocaleString() || 0}`}
                disabled
                className="bg-muted/40 font-bold text-emerald-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">
              Special Requests (Optional)
            </label>
            <Textarea
              placeholder="e.g. High floor ocean view room, early check-in, dietary preferences..."
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              rows={2}
            />
          </div>

          {/* Pricing Estimation Summary */}
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Duration & Units</span>
              <span>{days} {days === 1 ? "day/night" : "days/nights"} &times; {guestCount} {guestCount === 1 ? "guest" : "guests"}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-black text-foreground pt-1 border-t border-border/40">
              <span>Estimated Total:</span>
              <span className="text-emerald-400 text-base">৳{totalCost.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md shadow-indigo-600/30 gap-2"
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin" /> Submitting...
                </>
              ) : (
                "Confirm & Reserve"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
