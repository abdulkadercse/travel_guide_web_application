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
  useGetReviewsQuery,
  useDeleteReviewMutation,
} from "@/redux/features/review/reviewApi";
import {
  FaStar,
  FaSearch,
  FaSpinner,
  FaTrashAlt,
  FaHotel,
  FaUtensils,
  FaGlobe,
  FaComments,
} from "react-icons/fa";

export default function AdminReviewsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("ALL");

  const { data: reviewsResponse, isLoading } = useGetReviewsQuery({});
  const [deleteReview] = useDeleteReviewMutation();

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
    const comment = rev.comment?.toLowerCase() || "";
    return userName.includes(term) || comment.includes(term);
  });

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

  const avgRating = allReviews.length
    ? (allReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / allReviews.length).toFixed(1)
    : "5.0";

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
      <div className="space-y-8 font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                <FaStar className="h-5 w-5" />
              </div>
              Reviews & Ratings Moderation
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Inspect traveler reviews and feedback across destinations, hotels, and restaurants.
            </p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[11px] font-bold text-muted-foreground uppercase">Total Reviews</p>
              <h3 className="text-2xl font-black text-foreground mt-0.5">{allReviews.length}</h3>
            </div>
            <FaComments className="h-6 w-6 text-amber-500" />
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[11px] font-bold text-amber-400 uppercase">Average Platform Rating</p>
              <h3 className="text-2xl font-black text-amber-400 mt-0.5 flex items-center gap-1">
                <FaStar className="h-5 w-5 fill-amber-400" /> {avgRating} / 5.0
              </h3>
            </div>
            <FaStar className="h-6 w-6 text-amber-400" />
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[11px] font-bold text-emerald-400 uppercase">5-Star Feedback</p>
              <h3 className="text-2xl font-black text-emerald-400 mt-0.5">
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
              placeholder="Search by reviewer name or review comment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 rounded-xl"
            />
          </div>

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="h-10 rounded-xl border bg-background px-3 text-xs font-bold"
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
        <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="py-16 flex justify-center text-muted-foreground">
              <FaSpinner className="h-8 w-8 animate-spin text-amber-500" />
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground space-y-2">
              <FaComments className="h-10 w-10 text-muted-foreground/30 mx-auto" />
              <p className="font-bold text-foreground">No reviews found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-border/80">
                  <TableHead>Reviewer</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.map((rev) => (
                  <TableRow key={rev.id} className="hover:bg-muted/30 border-b border-border/60">
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="relative h-8 w-8 rounded-full overflow-hidden bg-slate-800 border shrink-0">
                          <Image
                            src={rev.user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                            alt={rev.user?.name || "User"}
                            fill
                            sizes="32px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-foreground text-xs leading-tight">{rev.user?.name || "Anonymous"}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
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
                        onClick={() => handleDelete(rev.id)}
                        className="h-8 w-8 p-0 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg"
                        title="Delete Review"
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
    </ProtectedRoute>
  );
}
