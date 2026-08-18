"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { useAppSelector } from "@/redux/hooks";
import {
  selectCurrentUser,
  selectCurrentToken,
} from "@/redux/features/auth/authSlice";
import { useCreateReservationMutation } from "@/redux/features/reservation/reservationApi";
import {
  FaCalendarAlt,
  FaSpinner,
  FaHotel,
  FaMapMarkerAlt,
  FaUtensils,
  FaGlobe,
  FaBus,
  FaMinus,
  FaPlus,
  FaShieldAlt,
  FaTimes,
  FaUserFriends,
  FaPen,
} from "react-icons/fa";

/* One shared shape for every section label, stepper and embedded picker, so the
 three field groups line up instead of each inventing its own spacing. */
const LABEL =
  "flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase";
const STEPPER =
  "flex h-8 w-8 items-center justify-center rounded-full border border-input text-foreground transition hover:border-primary hover:bg-primary-soft hover:text-primary disabled:pointer-events-none disabled:opacity-30";
const PICKER =
  "h-9 w-full rounded-none border-0 bg-transparent px-3.5 text-sm shadow-none hover:bg-accent/60";

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

/* Wording and iconography per target, so the same modal reads naturally
 whether you are booking a hotel room or a seat on a coach. */
const TARGET_COPY = {
  HOTEL: {
    icon: FaHotel,
    label: "Hotel",
    unit: "night",
    units: "nights",
    people: "guest",
    peoples: "guests",
  },
  RESTAURANT: {
    icon: FaUtensils,
    label: "Restaurant",
    unit: "day",
    units: "days",
    people: "diner",
    peoples: "diners",
  },
  TRANSPORTATION: {
    icon: FaBus,
    label: "Transport",
    unit: "day",
    units: "days",
    people: "passenger",
    peoples: "passengers",
  },
  DESTINATION: {
    icon: FaGlobe,
    label: "Destination",
    unit: "day",
    units: "days",
    people: "traveller",
    peoples: "travellers",
  },
} as const;

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
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  );
  const [guestCount, setGuestCount] = useState(1);
  const [specialRequests, setSpecialRequests] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const copy = TARGET_COPY[targetType] ?? TARGET_COPY.DESTINATION;
  const TargetIcon = copy.icon;

  // Calculate estimated total cost
  let days = 1;
  if (startDate && endDate) {
    const s = startDate.getTime();
    const e = endDate.getTime();
    if (e > s) {
      days = Math.max(1, Math.ceil((e - s) / (1000 * 60 * 60 * 24)));
    }
  }
  const rate = pricePerUnit || 1000;
  const totalCost = rate * days * (guestCount || 1);
  const money = (n: number) => `৳${n.toLocaleString()}`;

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

      toast.success(
        "Reservation request submitted successfully! Track status in your Dashboard.",
        {
          id: toastId,
        },
      );
      onClose();
      router.push("/dashboard/reservations");
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to submit reservation";
      toast.error(msg, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="w-full gap-0 overflow-hidden rounded-2xl border-0 bg-card p-0 font-sans shadow-lg ring-1 ring-foreground/10 sm:max-w-lg"
      >
        {/* ── Hero: the photo carries the identity, the form stays quiet below ── */}
        <div className="relative h-44 w-full shrink-0 overflow-hidden bg-primary">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={targetName}
              fill
              sizes="(max-width: 640px) 100vw, 512px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(120%_110%_at_15%_0%,var(--primary-hover),var(--primary))]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5" />

          {/* Top row: category chip + close */}
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold tracking-wide text-white uppercase ring-1 ring-white/25 backdrop-blur-md">
              <TargetIcon className="h-3 w-3" />
              {copy.label}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white ring-1 ring-white/25 backdrop-blur-md transition hover:bg-black/50 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            >
              <FaTimes className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Bottom row: name + location, with the nightly rate as a pill */}
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
            <div className="min-w-0">
              <DialogTitle className="truncate font-heading text-xl leading-tight font-medium text-white">
                {targetName}
              </DialogTitle>
              {location && (
                <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-white/75">
                  <FaMapMarkerAlt className="h-3 w-3 shrink-0" />
                  {location}
                </p>
              )}
            </div>
            <div className="shrink-0 rounded-xl bg-white/15 px-3 py-1.5 text-right ring-1 ring-white/25 backdrop-blur-md">
              <p className="text-sm leading-none font-medium text-white">
                {money(rate)}
              </p>
              <p className="mt-1 text-xs leading-none text-white/70">
                per {copy.unit}
              </p>
            </div>
          </div>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-col">
          <div className="max-h-[calc(100vh-24rem)] min-h-0 space-y-5 overflow-y-auto p-5">
            {/* Dates read as one range, not two unrelated fields — so the two
            pickers share a single frame with a hairline between them. */}
            <div>
              <div className="mb-1.5 flex items-baseline justify-between">
                <span className={LABEL}>
                  <FaCalendarAlt className="h-3 w-3 text-primary" /> Your dates
                </span>
                <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs font-semibold text-primary">
                  {days} {days === 1 ? copy.unit : copy.units}
                </span>
              </div>
              <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-input bg-background">
                <div className="border-r border-input">
                  <p className="px-3.5 pt-2.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Check-in
                  </p>
                  <DatePicker
                    date={startDate}
                    onSelect={setStartDate}
                    placeholder="Select date"
                    showIcon={false}
                    dateFormat="d MMM yyyy"
                    className={PICKER}
                  />
                </div>
                <div>
                  <p className="px-3.5 pt-2.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Check-out
                  </p>
                  <DatePicker
                    date={endDate}
                    onSelect={setEndDate}
                    minDate={startDate}
                    placeholder="Select date"
                    showIcon={false}
                    dateFormat="d MMM yyyy"
                    className={PICKER}
                  />
                </div>
              </div>
            </div>

            {/* Stepper reads better than a bare number field — one tap per guest. */}
            <div>
              <span className={`${LABEL} mb-1.5`}>
                <FaUserFriends className="h-3 w-3 text-primary" />{" "}
                {copy.peoples}
              </span>
              <div className="flex items-center justify-between rounded-xl border border-input bg-background py-2 pr-2 pl-3.5">
                <span className="text-sm">
                  <span className="font-semibold tabular-nums">
                    {guestCount}
                  </span>{" "}
                  <span className="text-muted-foreground">
                    {guestCount === 1 ? copy.people : copy.peoples}
                  </span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setGuestCount((c) => Math.max(1, c - 1))}
                    disabled={guestCount <= 1}
                    aria-label={`Remove one ${copy.people}`}
                    className={STEPPER}
                  >
                    <FaMinus className="h-2.5 w-2.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setGuestCount((c) => Math.min(20, c + 1))}
                    disabled={guestCount >= 20}
                    aria-label={`Add one ${copy.people}`}
                    className={STEPPER}
                  >
                    <FaPlus className="h-2.5 w-2.5" />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <span className={`${LABEL} mb-1.5`}>
                <FaPen className="h-3 w-3 text-primary" /> Special requests
                <span className="font-normal normal-case opacity-70">
                  optional
                </span>
              </span>
              <Textarea
                placeholder="High floor, early check-in, dietary preferences…"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                rows={2}
                className="resize-none rounded-xl border-input bg-background px-3.5 py-2.5"
              />
            </div>

            {/* Price breakdown — every multiplier visible, total last. */}
            <div className="rounded-xl border border-primary/15 bg-primary-soft/60 p-4">
              <div className="flex items-baseline justify-between text-xs text-muted-foreground">
                <span>
                  {money(rate)} × {days} {days === 1 ? copy.unit : copy.units} ×{" "}
                  {guestCount} {guestCount === 1 ? copy.people : copy.peoples}
                </span>
                <span className="tabular-nums">{money(totalCost)}</span>
              </div>
              <div className="mt-3 flex items-baseline justify-between border-t border-primary/15 pt-3">
                <span className="text-sm font-semibold text-foreground">
                  Estimated total
                </span>
                <span className="font-heading text-xl font-medium text-primary tabular-nums">
                  {money(totalCost)}
                </span>
              </div>
              <p className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                <FaShieldAlt className="h-2.5 w-2.5 text-primary" />
                Request only — nothing is charged until a host confirms.
              </p>
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="flex shrink-0 items-center gap-3 border-t border-border bg-muted/40 p-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 gap-2 font-semibold"
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin" /> Submitting…
                </>
              ) : (
                <>Request reservation · {money(totalCost)}</>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
