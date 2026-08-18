"use client";

import React, { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { ProtectedRoute, ImageUploader } from "@/components/shared";
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
  useGetRestaurantsQuery,
  useCreateRestaurantMutation,
  useUpdateRestaurantMutation,
  useDeleteRestaurantMutation,
} from "@/redux/features/restaurant/restaurantApi";
import {
  FaUtensils,
  FaPlus,
  FaSearch,
  FaSpinner,
  FaTrashAlt,
  FaEdit,
  FaStar,
  FaMapMarkerAlt,
  FaCoins,
} from "react-icons/fa";

export default function AdminRestaurantsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("ALL");

  const { data: restResponse, isLoading } = useGetRestaurantsQuery({
    cuisineType: cuisineFilter !== "ALL" ? cuisineFilter : undefined,
    searchTerm: searchTerm || undefined,
  });

  const [createRestaurant] = useCreateRestaurantMutation();
  const [updateRestaurant] = useUpdateRestaurantMutation();
  const [deleteRestaurant] = useDeleteRestaurantMutation();

  const restaurants: any[] = restResponse?.data ?? [];

  // Add Modal State
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newRest, setNewRest] = useState({
    name: "",
    location: "",
    cuisineType: "Seafood & Bangladeshi",
    description: "",
    priceRange: "৳৳ - ৳৳৳",
    avgPrice: 800,
    coverImage: "",
  });

  // Edit Modal State
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingRest, setEditingRest] = useState<any>(null);

  const [submitting, setSubmitting] = useState(false);

  const errorMessage = (err: unknown, fallback: string) =>
    (err as { data?: { message?: string } })?.data?.message || fallback;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRest.coverImage) return toast.error("Please upload a cover image!");
    setSubmitting(true);
    const toastId = toast.loading("Creating restaurant...");
    try {
      await createRestaurant({
        ...newRest,
        avgPrice: Number(newRest.avgPrice),
        images: [newRest.coverImage],
      }).unwrap();

      toast.success("Restaurant created successfully!", { id: toastId });
      setAddDialogOpen(false);
      setNewRest({
        name: "",
        location: "",
        cuisineType: "Seafood & Bangladeshi",
        description: "",
        priceRange: "৳৳ - ৳৳৳",
        avgPrice: 800,
        coverImage: "",
      });
    } catch (err: unknown) {
      toast.error(errorMessage(err, "Failed to create restaurant"), { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEdit = (item: any) => {
    setEditingRest({
      id: item.id,
      name: item.name,
      location: item.location,
      cuisineType: item.cuisineType || "Seafood & Bangladeshi",
      description: item.description,
      priceRange: item.priceRange || "৳৳",
      avgPrice: item.avgPrice || 800,
      coverImage: item.coverImage,
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRest) return;
    setSubmitting(true);
    const toastId = toast.loading("Updating restaurant...");
    try {
      await updateRestaurant({
        id: editingRest.id,
        ...editingRest,
        avgPrice: Number(editingRest.avgPrice),
        images: [editingRest.coverImage],
      }).unwrap();

      toast.success("Restaurant updated successfully!", { id: toastId });
      setEditDialogOpen(false);
      setEditingRest(null);
    } catch (err: unknown) {
      toast.error(errorMessage(err, "Failed to update restaurant"), { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this restaurant?")) return;
    const toastId = toast.loading("Deleting restaurant...");
    try {
      await deleteRestaurant(id).unwrap();
      toast.success("Restaurant deleted successfully", { id: toastId });
    } catch (err: unknown) {
      toast.error(errorMessage(err, "Failed to delete restaurant"), { id: toastId });
    }
  };

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
      <div className="space-y-8 font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <FaUtensils className="h-5 w-5" />
              </div>
              Restaurants & Dining Control Panel
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Add, edit, manage, and inspect dining locations and traditional eateries across Bangladesh.
            </p>
          </div>

          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger>
              <Button className="gap-2 shrink-0">
                <FaPlus className="h-3.5 w-3.5" /> Add New Restaurant
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-lg font-medium">Add New Restaurant</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Restaurant Name</label>
                  <Input
                    placeholder="e.g. Jhaubon Seafood Restaurant"
                    value={newRest.name}
                    onChange={(e) => setNewRest({ ...newRest, name: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold">Location / Address</label>
                    <Input
                      placeholder="Cox's Bazar Sea Beach"
                      value={newRest.location}
                      onChange={(e) => setNewRest({ ...newRest, location: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold">Cuisine Type</label>
                    <Input
                      placeholder="Seafood, Traditional Biryani"
                      value={newRest.cuisineType}
                      onChange={(e) => setNewRest({ ...newRest, cuisineType: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold">Price Tier Indicator</label>
                    <Input
                      placeholder="৳৳ - ৳৳৳"
                      value={newRest.priceRange}
                      onChange={(e) => setNewRest({ ...newRest, priceRange: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold">Average Meal Cost (BDT ৳)</label>
                    <Input
                      type="number"
                      value={newRest.avgPrice}
                      onChange={(e) => setNewRest({ ...newRest, avgPrice: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold">Description</label>
                  <Textarea
                    rows={3}
                    value={newRest.description}
                    onChange={(e) => setNewRest({ ...newRest, description: e.target.value })}
                    required
                  />
                </div>

                <ImageUploader
                  label="Cover Photo Image"
                  folder="restaurants"
                  value={newRest.coverImage}
                  onChange={(url) => setNewRest({ ...newRest, coverImage: url })}
                  onRemove={() => setNewRest({ ...newRest, coverImage: "" })}
                />

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? <FaSpinner className="animate-spin" /> : "Save Restaurant"}
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
              <p className="text-sm text-muted-foreground">Total Restaurants</p>
              <h3 className="text-2xl font-semibold text-foreground mt-0.5">{restaurants.length}</h3>
            </div>
            <FaUtensils className="h-6 w-6 text-primary" />
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
            <div>
              <p className="text-sm text-muted-foreground">Cuisines Offered</p>
              <h3 className="text-2xl font-semibold text-primary mt-0.5">
                {new Set(restaurants.map((r) => r.cuisineType)).size} Types
              </h3>
            </div>
            <FaMapMarkerAlt className="h-6 w-6 text-primary" />
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
            <div>
              <p className="text-sm text-muted-foreground">Avg Meal Cost</p>
              <h3 className="text-2xl font-semibold text-emerald-400 mt-0.5">
                ৳{restaurants.length ? Math.round(restaurants.reduce((sum, r) => sum + (r.avgPrice || 800), 0) / restaurants.length).toLocaleString() : 0}
              </h3>
            </div>
            <FaCoins className="h-6 w-6 text-emerald-500" />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-4 rounded-2xl bg-card border border-border flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search restaurants by name or cuisine..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 rounded-xl"
            />
          </div>

          <select
            value={cuisineFilter}
            onChange={(e) => setCuisineFilter(e.target.value)}
            className="h-10 rounded-xl border bg-background px-3 text-xs font-medium"
          >
            <option value="ALL">All Cuisines</option>
            <option value="Seafood">Seafood</option>
            <option value="Traditional Bengali">Traditional Bengali</option>
            <option value="Biryani & Kebab">Biryani & Kebab</option>
          </select>
        </div>

        {/* Table View */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="py-16 flex justify-center text-muted-foreground">
              <FaSpinner className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : restaurants.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground space-y-2">
              <FaUtensils className="h-10 w-10 text-muted-foreground/30 mx-auto" />
              <p className="font-medium text-foreground">No restaurants found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-border/80">
                  <TableHead>Cover</TableHead>
                  <TableHead>Restaurant Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Cuisine Type</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Avg Meal Cost</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {restaurants.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/30 border-b border-border/60">
                    <TableCell>
                      <div className="relative h-12 w-16 rounded-xl overflow-hidden bg-muted border shrink-0">
                        <Image src={item.coverImage || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"} alt={item.name} fill sizes="64px" className="object-cover" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-foreground text-sm">{item.name}</p>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FaMapMarkerAlt className="text-primary h-3 w-3" />
                        {item.location}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary border border-primary/20 rounded-full">
                        {item.cuisineType || "Seafood"}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-primary">
                      <span className="flex items-center gap-1">
                        <FaStar className="fill-amber-400 h-3 w-3" /> {item.rating || 4.7}
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold text-emerald-400 text-sm">
                      ৳{(item.avgPrice || 800).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenEdit(item)}
                          className="h-8 w-8 p-0 text-primary hover:text-primary hover:bg-primary/10 rounded-lg"
                          title="Edit Restaurant"
                        >
                          <FaEdit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(item.id)}
                          className="h-8 w-8 p-0 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg"
                          title="Delete Restaurant"
                        >
                          <FaTrashAlt className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Edit Dialog */}
        {editingRest && (
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-lg font-medium">Edit Restaurant</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpdate} className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-semibold">Restaurant Name</label>
                  <Input
                    value={editingRest.name}
                    onChange={(e) => setEditingRest({ ...editingRest, name: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold">Location</label>
                    <Input
                      value={editingRest.location}
                      onChange={(e) => setEditingRest({ ...editingRest, location: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold">Cuisine Type</label>
                    <Input
                      value={editingRest.cuisineType}
                      onChange={(e) => setEditingRest({ ...editingRest, cuisineType: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold">Price Tier Indicator</label>
                    <Input
                      value={editingRest.priceRange}
                      onChange={(e) => setEditingRest({ ...editingRest, priceRange: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold">Average Meal Cost (BDT ৳)</label>
                    <Input
                      type="number"
                      value={editingRest.avgPrice}
                      onChange={(e) => setEditingRest({ ...editingRest, avgPrice: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold">Description</label>
                  <Textarea
                    rows={3}
                    value={editingRest.description}
                    onChange={(e) => setEditingRest({ ...editingRest, description: e.target.value })}
                    required
                  />
                </div>

                <ImageUploader
                  label="Cover Photo Image"
                  folder="restaurants"
                  value={editingRest.coverImage}
                  onChange={(url) => setEditingRest({ ...editingRest, coverImage: url })}
                  onRemove={() => setEditingRest({ ...editingRest, coverImage: "" })}
                />

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
