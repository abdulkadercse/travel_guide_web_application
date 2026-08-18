"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { ProtectedRoute } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import {
  useGetReviewsQuery,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} from "@/redux/features/review/reviewApi";
import {
  FaStar,
  FaTrashAlt,
  FaEdit,
  FaSpinner,
  FaComments,
  FaQuoteLeft,
} from "react-icons/fa";

export default function UserReviewsPage() {
  const user = useAppSelector(selectCurrentUser);

  const { data: reviewsResponse, isLoading } = useGetReviewsQuery(
    user?.id ? { userId: user.id } : undefined,
    { skip: !user?.id }
  );

  const [updateReview] = useUpdateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const reviews: any[] = Array.isArray(reviewsResponse?.data)
    ? reviewsResponse.data
    : Array.isArray(reviewsResponse)
    ? reviewsResponse
    : [];

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleOpenEdit = (rev: any) => {
    setEditingReview({
      id: rev.id,
      comment: rev.comment,
      rating: rev.rating,
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;
    setSubmitting(true);
    const toastId = toast.loading("Updating your review...");
    try {
      await updateReview({
        id: editingReview.id,
        comment: editingReview.comment,
        rating: Number(editingReview.rating),
      }).unwrap();

      toast.success("Review updated successfully!", { id: toastId });
      setEditDialogOpen(false);
      setEditingReview(null);
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message || "Failed to update review";
      toast.error(msg, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    const toastId = toast.loading("Deleting review...");
    try {
      await deleteReview(id).unwrap();
      toast.success("Review deleted successfully", { id: toastId });
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message || "Failed to delete review";
      toast.error(msg, { id: toastId });
    }
  };

  return (
    <ProtectedRoute allowedRoles={["USER", "ADMIN", "SUPER_ADMIN"]}>
      <div className="space-y-8 font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                <FaComments className="h-5 w-5" />
              </div>
              My Reviews & Ratings
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              View and manage the feedback and star ratings you have shared for Bangladesh travel spots.
            </p>
          </div>
        </div>

        {/* Reviews List */}
        {isLoading ? (
          <div className="py-20 flex justify-center text-muted-foreground">
            <FaSpinner className="h-8 w-8 animate-spin text-amber-500" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-20 text-center rounded-2xl border border-dashed border-border bg-card/40 space-y-3">
            <FaComments className="h-12 w-12 text-muted-foreground/30 mx-auto" />
            <h3 className="text-lg font-medium text-foreground">No reviews posted yet</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Visit any destination, hotel, or restaurant page to leave your rating and experience!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-2xl bg-card border border-border space-y-4 hover:border-amber-500/30 transition-all shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400 font-semibold text-sm">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <FaStar
                          key={idx}
                          className={`h-3.5 w-3.5 ${
                            idx < rev.rating ? "fill-amber-400" : "text-muted-foreground/40"
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-xs">{rev.rating}.0</span>
                    </div>

                    <span className="text-xs font-mono text-muted-foreground">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="relative pl-3 border-l-2 border-amber-500/30">
                    <FaQuoteLeft className="h-3 w-3 text-amber-500/40 mb-1" />
                    <p className="text-xs text-foreground leading-relaxed italic">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleOpenEdit(rev)}
                    className="h-8 px-2.5 text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-xl font-medium gap-1"
                  >
                    <FaEdit className="h-3 w-3" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(rev.id)}
                    className="h-8 px-2.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl font-medium gap-1"
                  >
                    <FaTrashAlt className="h-3 w-3" /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Review Dialog */}
        {editingReview && (
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="max-w-md bg-card border-border font-sans">
              <DialogHeader>
                <DialogTitle className="text-lg font-medium">Edit Review</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpdate} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Rating (1 to 5 Stars)</label>
                  <select
                    value={editingReview.rating}
                    onChange={(e) => setEditingReview({ ...editingReview, rating: Number(e.target.value) })}
                    className="w-full h-10 rounded-xl border bg-background px-3 text-sm"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 - Outstanding)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                    <option value={3}>⭐⭐⭐ (3 - Average)</option>
                    <option value={2}>⭐⭐ (2 - Below Average)</option>
                    <option value={1}>⭐ (1 - Poor)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Comment</label>
                  <Textarea
                    rows={4}
                    value={editingReview.comment}
                    onChange={(e) => setEditingReview({ ...editingReview, comment: e.target.value })}
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? <FaSpinner className="animate-spin" /> : "Save Changes"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </ProtectedRoute>
  );
}
