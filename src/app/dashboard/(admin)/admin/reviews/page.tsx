"use client";

import React, { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { ProtectedRoute, DeleteMessage } from "@/components/shared";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useGetReviewsQuery,
  useCreateReviewMutation,
  useDeleteReviewMutation,
} from "@/redux/features/review/reviewApi";
import { useGetDestinationsQuery } from "@/redux/features/destination/destinationApi";
import { useGetHotelsQuery } from "@/redux/features/hotel/hotelApi";
import { useGetRestaurantsQuery } from "@/redux/features/restaurant/restaurantApi";
import {
  FaStar,
  FaSearch,
  FaSpinner,
  FaTrashAlt,
  FaHotel,
  FaUtensils,
  FaGlobe,
  FaComments,
  FaPlus,
} from "react-icons/fa";

export default function AdminReviewsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("ALL");

  // Add Review Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [targetType, setTargetType] = useState<"DESTINATION" | "HOTEL" | "RESTAURANT">("DESTINATION");
  const [selectedTargetId, setSelectedTargetId] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Modal State
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: reviewsResponse, isLoading } = useGetReviewsQuery({});
  const [createReview] = useCreateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  // Queries for target dropdowns
  const { data: destRes } = useGetDestinationsQuery({});
  const { data: hotelRes } = useGetHotelsQuery({});
  const { data: restRes } = useGetRestaurantsQuery({});

  const destinations: any[] = destRes?.data ?? [];
  const hotels: any[] = hotelRes?.data ?? [];
  const restaurants: any[] = restRes?.data ?? [];

  const allReviews: any[] = Array.isArray(reviewsResponse?.data)
    ? reviewsResponse.data
    : Array.isArray(reviewsResponse)
    ? reviewsResponse
    : [];

  const filteredReviews = allReviews.filter((rev) => {
    if (ratingFilter !== "ALL" && rev.rating !== Number(ratingFilter)) return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const userName = rev.user?.name?.toLowerCase() || "";
    const commentText = rev.comment?.toLowerCase() || "";
    const targetTitle = (rev.destination?.title || rev.hotel?.name || rev.restaurant?.name || "").toLowerCase();
    return userName.includes(term) || commentText.includes(term) || targetTitle.includes(term);
  });

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTargetId) {
      return toast.error("Please select an item to review!");
    }
    if (!comment.trim()) {
      return toast.error("Please enter your review feedback comment!");
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Adding new review...");
    try {
      const payload: any = {
        rating,
        comment: comment.trim(),
      };
      if (targetType === "DESTINATION") payload.destinationId = selectedTargetId;
      if (targetType === "HOTEL") payload.hotelId = selectedTargetId;
      if (targetType === "RESTAURANT") payload.restaurantId = selectedTargetId;

      await createReview(payload).unwrap();
      toast.success("Review added successfully!", { id: toastId });
      setAddModalOpen(false);
      setSelectedTargetId("");
      setComment("");
      setRating(5);
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message || "Failed to add review";
      toast.error(msg, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget?.id) return;
    setIsDeleting(true);
    const toastId = toast.loading("Deleting review...");
    try {
      await deleteReview(deleteTarget.id).unwrap();
      toast.success("Review deleted successfully!", { id: toastId });
      setDeleteTarget(null);
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message || "Failed to delete review";
      toast.error(msg, { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  const avgRating = allReviews.length
    ? (allReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / allReviews.length).toFixed(1)
    : "5.0";

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
      <div className="space-y-8 font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                <FaStar className="h-5 w-5" />
              </div>
              Reviews & Ratings Moderation
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Inspect, moderate, and add traveler reviews and feedback across destinations, hotels, and restaurants.
            </p>
          </div>

          <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
            <DialogTrigger
              render={
                <Button className="gap-2 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl shadow-xs cursor-pointer">
                  <FaPlus className="h-3.5 w-3.5" /> Add New Review
                </Button>
              }
            />
            <DialogContent className="max-w-md bg-card border-border">
              <DialogHeader className="pb-2 border-b border-border">
                <DialogTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                    <FaStar className="h-4 w-4" />
                  </div>
                  Add Platform Review
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleCreateReview} className="space-y-4 pt-2">
                {/* Target Type Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Review Category / Target</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setTargetType("DESTINATION");
                        setSelectedTargetId("");
                      }}
                      className={`flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                        targetType === "DESTINATION"
                          ? "bg-primary/10 border-primary text-primary font-semibold"
                          : "border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <FaGlobe className="h-3 w-3" /> Destination
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTargetType("HOTEL");
                        setSelectedTargetId("");
                      }}
                      className={`flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                        targetType === "HOTEL"
                          ? "bg-primary/10 border-primary text-primary font-semibold"
                          : "border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <FaHotel className="h-3 w-3" /> Hotel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTargetType("RESTAURANT");
                        setSelectedTargetId("");
                      }}
                      className={`flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                        targetType === "RESTAURANT"
                          ? "bg-primary/10 border-primary text-primary font-semibold"
                          : "border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <FaUtensils className="h-3 w-3" /> Restaurant
                    </button>
                  </div>
                </div>

                {/* Specific Item Select Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Select {targetType === "DESTINATION" ? "Destination" : targetType === "HOTEL" ? "Hotel" : "Restaurant"}
                  </label>
                  <select
                    value={selectedTargetId}
                    onChange={(e) => setSelectedTargetId(e.target.value)}
                    required
                    className="w-full h-10 px-3 rounded-xl border border-border bg-background text-foreground text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  >
                    <option value="">-- Choose Item --</option>
                    {targetType === "DESTINATION" &&
                      destinations.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.title} ({d.location})
                        </option>
                      ))}
                    {targetType === "HOTEL" &&
                      hotels.map((h) => (
                        <option key={h.id} value={h.id}>
                          {h.name} ({h.location})
                        </option>
                      ))}
                    {targetType === "RESTAURANT" &&
                      restaurants.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name} ({r.location})
                        </option>
                      ))}
                  </select>
                </div>

                {/* Interactive Star Rating */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex justify-between">
                    <span>Rating Score</span>
                    <span className="text-amber-500 font-bold">{hoverRating || rating} / 5 Stars</span>
                  </label>
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-muted/30 border border-border">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 text-xl transition-transform hover:scale-110 cursor-pointer"
                      >
                        <FaStar
                          className={`${
                            star <= (hoverRating || rating) ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Comment Textarea */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Review Feedback / Comment</label>
                  <Textarea
                    placeholder="Write honest feedback about the stay, food, service, or destination experience..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    required
                    className="rounded-xl text-xs"
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-2 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAddModalOpen(false)}
                    disabled={isSubmitting}
                    className="rounded-xl text-xs cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl text-xs gap-1.5 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="h-3.5 w-3.5 animate-spin" /> Adding...
                      </>
                    ) : (
                      <>
                        <FaPlus className="h-3.5 w-3.5" /> Submit Review
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
            <div>
              <p className="text-sm text-muted-foreground">Total Reviews</p>
              <h3 className="text-2xl font-semibold text-foreground mt-0.5">{allReviews.length}</h3>
            </div>
            <FaComments className="h-6 w-6 text-amber-500" />
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
            <div>
              <p className="text-sm text-muted-foreground">Average Platform Rating</p>
              <h3 className="text-2xl font-semibold text-amber-400 mt-0.5 flex items-center gap-1">
                <FaStar className="h-5 w-5 fill-amber-400" /> {avgRating} / 5.0
              </h3>
            </div>
            <FaStar className="h-6 w-6 text-amber-400" />
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
            <div>
              <p className="text-sm text-muted-foreground">5-Star Feedback</p>
              <h3 className="text-2xl font-semibold text-emerald-400 mt-0.5">
                {allReviews.filter((r) => r.rating === 5).length}
              </h3>
            </div>
            <FaStar className="h-6 w-6 text-emerald-400" />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-4 rounded-2xl bg-card border border-border flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by reviewer name, target item, or review comment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 rounded-xl"
            />
          </div>

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="h-10 rounded-xl border border-border bg-background px-3 text-xs font-medium text-foreground focus:outline-none"
          >
            <option value="ALL">All Star Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        {/* Table View */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="py-16 flex justify-center text-muted-foreground">
              <FaSpinner className="h-8 w-8 animate-spin text-amber-500" />
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground space-y-2">
              <FaComments className="h-10 w-10 text-muted-foreground/30 mx-auto" />
              <p className="font-medium text-foreground">No reviews found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-border/80">
                  <TableHead>Reviewer</TableHead>
                  <TableHead>Target Item</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.map((rev) => {
                  const targetName = rev.destination?.title || rev.hotel?.name || rev.restaurant?.name || "General Service";
                  const targetTypeLabel = rev.destinationId ? "Destination" : rev.hotelId ? "Hotel" : rev.restaurantId ? "Restaurant" : "Service";

                  return (
                    <TableRow key={rev.id} className="hover:bg-muted/30 border-b border-border/60">
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="relative h-8 w-8 rounded-full overflow-hidden bg-muted border shrink-0">
                            <Image
                              src={rev.user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                              alt={rev.user?.name || "User"}
                              fill
                              sizes="32px"
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-foreground text-xs leading-tight">{rev.user?.name || "Customer"}</p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 text-xs">
                            {rev.hotelId ? <FaHotel className="h-3 w-3" /> : rev.restaurantId ? <FaUtensils className="h-3 w-3" /> : <FaGlobe className="h-3 w-3" />}
                          </div>
                          <div>
                            <p className="font-medium text-foreground text-xs">{targetName}</p>
                            <span className="text-[10px] text-muted-foreground">{targetTypeLabel}</span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-1 text-amber-400 font-medium text-xs">
                          <FaStar className="fill-amber-400 h-3 w-3" />
                          <span>{rev.rating} / 5</span>
                        </div>
                      </TableCell>

                      <TableCell className="max-w-md">
                        <p className="text-xs text-foreground line-clamp-2 leading-relaxed">{rev.comment}</p>
                      </TableCell>

                      <TableCell className="text-xs font-mono text-muted-foreground">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteTarget(rev)}
                          className="h-8 w-8 p-0 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                          title="Delete Review"
                        >
                          <FaTrashAlt className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Delete Confirmation Modal using Shared DeleteMessage Component */}
        <DeleteMessage
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
          title="Delete Review"
          description="This action is permanent and cannot be undone."
          itemName={
            deleteTarget?.user?.name
              ? `the review by ${deleteTarget.user.name}`
              : "this review"
          }
        >
          {deleteTarget && (
            <div className="p-3 rounded-xl bg-muted/40 border border-border/80 space-y-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Rating:</span>
                <span className="font-semibold text-amber-400 flex items-center gap-1">
                  <FaStar className="h-3 w-3 fill-amber-400" /> {deleteTarget.rating} / 5
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Comment:</span>
                <span className="text-foreground line-clamp-1 italic max-w-[200px]">
                  &ldquo;{deleteTarget.comment}&rdquo;
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-mono text-muted-foreground">
                  {new Date(deleteTarget.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </DeleteMessage>
      </div>
    </ProtectedRoute>
  );
}
