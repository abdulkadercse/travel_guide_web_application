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
  useGetDestinationsQuery,
  useCreateDestinationMutation,
  useUpdateDestinationMutation,
  useDeleteDestinationMutation,
} from "@/redux/features/destination/destinationApi";
import {
  FaCompass,
  FaPlus,
  FaSearch,
  FaSpinner,
  FaTrashAlt,
  FaEdit,
  FaStar,
  FaMapMarkerAlt,
  FaCoins,
  FaLayerGroup,
  FaImages,
  FaInfoCircle,
} from "react-icons/fa";

export default function AdminDestinationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const { data: destResponse, isLoading } = useGetDestinationsQuery({
    category: categoryFilter !== "ALL" ? categoryFilter : undefined,
    searchTerm: searchTerm || undefined,
  });
  const [createDestination] = useCreateDestinationMutation();
  const [updateDestination] = useUpdateDestinationMutation();
  const [deleteDestination] = useDeleteDestinationMutation();

  const destinations: any[] = destResponse?.data ?? [];

  // Add Dialog State
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newDest, setNewDest] = useState({
    title: "",
    description: "",
    location: "",
    district: "",
    category: "Beach",
    coverImage: "",
    galleryImagesInput: "",
    price: 1500,
    isFeatured: true,
  });

  // Edit Dialog State
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingDest, setEditingDest] = useState<any>(null);

  const [submitting, setSubmitting] = useState(false);

  const errorMessage = (err: unknown, fallback: string) =>
    (err as { data?: { message?: string } })?.data?.message || fallback;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDest.coverImage) return toast.error("Please provide or upload a cover image!");
    setSubmitting(true);
    const toastId = toast.loading("Creating destination...");
    try {
      const extraImages = newDest.galleryImagesInput
        .split(/[\n,]+/)
        .map((url) => url.trim())
        .filter(Boolean);

      const allImages = Array.from(new Set([newDest.coverImage, ...extraImages]));

      await createDestination({
        title: newDest.title,
        description: newDest.description,
        location: newDest.location,
        district: newDest.district,
        category: newDest.category,
        coverImage: newDest.coverImage,
        images: allImages,
        price: Number(newDest.price),
        isFeatured: Boolean(newDest.isFeatured),
      }).unwrap();

      toast.success("Destination created successfully!", { id: toastId });
      setAddDialogOpen(false);
      setNewDest({
        title: "",
        description: "",
        location: "",
        district: "",
        category: "Beach",
        coverImage: "",
        galleryImagesInput: "",
        price: 1500,
        isFeatured: true,
      });
    } catch (err: unknown) {
      toast.error(errorMessage(err, "Failed to create destination"), { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEdit = (item: any) => {
    const imagesList = Array.isArray(item.images) ? item.images : [];
    const extraImages = imagesList.filter((img: string) => img !== item.coverImage);

    setEditingDest({
      id: item.id,
      title: item.title,
      description: item.description,
      location: item.location,
      district: item.district,
      category: item.category,
      coverImage: item.coverImage,
      galleryImagesInput: extraImages.join("\n"),
      price: item.price || 1500,
      isFeatured: Boolean(item.isFeatured),
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDest) return;
    setSubmitting(true);
    const toastId = toast.loading("Updating destination...");
    try {
      const extraImages = editingDest.galleryImagesInput
        .split(/[\n,]+/)
        .map((url: string) => url.trim())
        .filter(Boolean);

      const allImages = Array.from(new Set([editingDest.coverImage, ...extraImages]));

      await updateDestination({
        id: editingDest.id,
        title: editingDest.title,
        description: editingDest.description,
        location: editingDest.location,
        district: editingDest.district,
        category: editingDest.category,
        coverImage: editingDest.coverImage,
        images: allImages,
        price: Number(editingDest.price),
        isFeatured: Boolean(editingDest.isFeatured),
      }).unwrap();

      toast.success("Destination updated successfully!", { id: toastId });
      setEditDialogOpen(false);
      setEditingDest(null);
    } catch (err: unknown) {
      toast.error(errorMessage(err, "Failed to update destination"), { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this destination?")) return;
    const toastId = toast.loading("Deleting destination...");
    try {
      await deleteDestination(id).unwrap();
      toast.success("Destination deleted successfully", { id: toastId });
    } catch (err: unknown) {
      toast.error(errorMessage(err, "Failed to delete destination"), { id: toastId });
    }
  };

  const totalValue = destinations.reduce((sum, d) => sum + (d.price || 0), 0);

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
      <div className="space-y-8 font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <FaCompass className="h-5 w-5" />
              </div>
              Destinations Control & Management
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Add, edit, manage, and inspect all tourist spot packages across Bangladesh.
            </p>
          </div>

          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger
              render={
                <Button className="gap-2 shrink-0 rounded-xl">
                  <FaPlus className="h-3.5 w-3.5" /> Add New Destination
                </Button>
              }
            />
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold flex items-center gap-2">
                  <FaCompass className="text-primary" /> Add New Tourist Destination
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleCreate} className="space-y-5 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Destination Title</label>
                  <Input
                    placeholder="e.g. Cox's Bazar Sea Beach"
                    value={newDest.title}
                    onChange={(e) => setNewDest({ ...newDest, title: e.target.value })}
                    className="rounded-xl"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">District</label>
                    <Input
                      placeholder="e.g. Cox's Bazar, Bandarban, Sylhet"
                      value={newDest.district}
                      onChange={(e) => setNewDest({ ...newDest, district: e.target.value })}
                      className="rounded-xl"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Location / Full Address</label>
                    <Input
                      placeholder="e.g. Chittagong Division"
                      value={newDest.location}
                      onChange={(e) => setNewDest({ ...newDest, location: e.target.value })}
                      className="rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Category</label>
                    <select
                      value={newDest.category}
                      onChange={(e) => setNewDest({ ...newDest, category: e.target.value })}
                      className="w-full h-10 rounded-xl border bg-background px-3 text-sm focus:ring-2 focus:ring-primary cursor-pointer"
                    >
                      <option value="Beach">Beach & Coastal</option>
                      <option value="Mountain">Mountain & Hills</option>
                      <option value="Historical">Historical & Heritage</option>
                      <option value="Eco-Tour">Eco-Tour & Forests</option>
                      <option value="Waterfall">Waterfall & Springs</option>
                      <option value="Resort">Resort & Leisure</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Entry / Tour Price (BDT ৳)</label>
                    <Input
                      type="number"
                      value={newDest.price}
                      onChange={(e) => setNewDest({ ...newDest, price: Number(e.target.value) })}
                      className="rounded-xl font-semibold"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="new-featured"
                    checked={newDest.isFeatured}
                    onChange={(e) => setNewDest({ ...newDest, isFeatured: e.target.checked })}
                    className="h-4 w-4 rounded text-primary focus:ring-primary cursor-pointer"
                  />
                  <label htmlFor="new-featured" className="text-xs font-semibold text-foreground cursor-pointer">
                    Feature on Homepage (Show in Featured Destinations carousel)
                  </label>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <FaInfoCircle className="text-primary h-3 w-3" /> Detailed Narrative Description
                    </label>
                    <span className="text-[11px] text-muted-foreground">Separate paragraphs with Enter</span>
                  </div>
                  <Textarea
                    rows={4}
                    placeholder="Describe geography, historical significance, top sights, travel tips, best season to visit..."
                    value={newDest.description}
                    onChange={(e) => setNewDest({ ...newDest, description: e.target.value })}
                    className="rounded-xl text-sm leading-relaxed"
                    required
                  />
                </div>

                {/* Cover Image */}
                <ImageUploader
                  label="Cover Showcase Image"
                  folder="destinations"
                  value={newDest.coverImage}
                  onChange={(url) => setNewDest({ ...newDest, coverImage: url })}
                  onRemove={() => setNewDest({ ...newDest, coverImage: "" })}
                />

                {/* Multiple Photos */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <FaImages className="text-primary h-3.5 w-3.5" /> Additional Gallery Photo URLs
                  </label>
                  <Textarea
                    rows={3}
                    placeholder="Paste scenic destination photo URLs (one URL per line or separated by comma)..."
                    value={newDest.galleryImagesInput}
                    onChange={(e) => setNewDest({ ...newDest, galleryImagesInput: e.target.value })}
                    className="rounded-xl text-xs font-mono"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-border">
                  <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)} className="rounded-xl">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting} className="rounded-xl">
                    {submitting ? <FaSpinner className="animate-spin mr-2" /> : "Save & Publish Destination"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
            <div>
              <p className="text-sm text-muted-foreground">Total Destinations</p>
              <h3 className="text-2xl font-semibold text-foreground mt-0.5">{destinations.length}</h3>
            </div>
            <FaCompass className="h-6 w-6 text-primary" />
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
            <div>
              <p className="text-sm text-muted-foreground">Categories</p>
              <h3 className="text-2xl font-semibold text-primary mt-0.5">
                {new Set(destinations.map((d) => d.category)).size} Types
              </h3>
            </div>
            <FaLayerGroup className="h-6 w-6 text-primary" />
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
            <div>
              <p className="text-sm text-muted-foreground">Average Rate</p>
              <h3 className="text-2xl font-semibold text-emerald-400 mt-0.5">
                ৳{destinations.length ? Math.round(totalValue / destinations.length).toLocaleString() : 0}
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
              placeholder="Search destinations by title, district or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 rounded-xl"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 rounded-xl border bg-background px-3 text-xs font-medium"
          >
            <option value="ALL">All Categories</option>
            <option value="Beach">Beach</option>
            <option value="Mountain">Mountain</option>
            <option value="Historical">Historical</option>
            <option value="Eco-Tour">Eco-Tour</option>
            <option value="Waterfall">Waterfall</option>
          </select>
        </div>

        {/* Table View */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="py-16 flex justify-center text-muted-foreground">
              <FaSpinner className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : destinations.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground space-y-2">
              <FaCompass className="h-10 w-10 text-muted-foreground/30 mx-auto" />
              <p className="font-medium text-foreground">No destinations found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-border/80">
                  <TableHead>Cover</TableHead>
                  <TableHead>Destination Title</TableHead>
                  <TableHead>District & Location</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {destinations.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/30 border-b border-border/60">
                    <TableCell>
                      <div className="relative h-12 w-16 rounded-xl overflow-hidden bg-muted border shrink-0">
                        <Image src={item.coverImage || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"} alt={item.title} fill sizes="64px" className="object-cover" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-foreground text-sm">{item.title}</p>
                      {Array.isArray(item.images) && item.images.length > 1 && (
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <FaImages className="h-2.5 w-2.5" /> {item.images.length} photos
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FaMapMarkerAlt className="text-primary h-3 w-3" />
                        {item.location}, {item.district}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary border border-primary/20 rounded-full">
                        {item.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-amber-400">
                      <span className="flex items-center gap-1">
                        <FaStar className="fill-amber-400 h-3 w-3" /> {item.rating || 4.8}
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold text-emerald-400 text-sm">
                      ৳{(item.price || 1500).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenEdit(item)}
                          className="h-8 w-8 p-0 text-primary hover:text-primary hover:bg-primary/10 rounded-lg cursor-pointer"
                          title="Edit Destination"
                        >
                          <FaEdit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(item.id)}
                          className="h-8 w-8 p-0 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                          title="Delete Destination"
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
        {editingDest && (
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold flex items-center gap-2">
                  <FaEdit className="text-primary" /> Edit Destination Details
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleUpdate} className="space-y-5 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Title</label>
                  <Input
                    value={editingDest.title}
                    onChange={(e) => setEditingDest({ ...editingDest, title: e.target.value })}
                    className="rounded-xl"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">District</label>
                    <Input
                      value={editingDest.district}
                      onChange={(e) => setEditingDest({ ...editingDest, district: e.target.value })}
                      className="rounded-xl"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Location / Address</label>
                    <Input
                      value={editingDest.location}
                      onChange={(e) => setEditingDest({ ...editingDest, location: e.target.value })}
                      className="rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Category</label>
                    <select
                      value={editingDest.category}
                      onChange={(e) => setEditingDest({ ...editingDest, category: e.target.value })}
                      className="w-full h-10 rounded-xl border bg-background px-3 text-sm cursor-pointer"
                    >
                      <option value="Beach">Beach & Coastal</option>
                      <option value="Mountain">Mountain & Hills</option>
                      <option value="Historical">Historical & Heritage</option>
                      <option value="Eco-Tour">Eco-Tour & Forests</option>
                      <option value="Waterfall">Waterfall & Springs</option>
                      <option value="Resort">Resort & Leisure</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Price (BDT ৳)</label>
                    <Input
                      type="number"
                      value={editingDest.price}
                      onChange={(e) => setEditingDest({ ...editingDest, price: Number(e.target.value) })}
                      className="rounded-xl font-semibold"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="edit-featured"
                    checked={editingDest.isFeatured}
                    onChange={(e) => setEditingDest({ ...editingDest, isFeatured: e.target.checked })}
                    className="h-4 w-4 rounded text-primary focus:ring-primary cursor-pointer"
                  />
                  <label htmlFor="edit-featured" className="text-xs font-semibold text-foreground cursor-pointer">
                    Feature on Homepage
                  </label>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <FaInfoCircle className="text-primary h-3 w-3" /> Detailed Description
                  </label>
                  <Textarea
                    rows={4}
                    value={editingDest.description}
                    onChange={(e) => setEditingDest({ ...editingDest, description: e.target.value })}
                    className="rounded-xl text-sm leading-relaxed"
                    required
                  />
                </div>

                {/* Cover Image */}
                <ImageUploader
                  label="Cover Showcase Image"
                  folder="destinations"
                  value={editingDest.coverImage}
                  onChange={(url) => setEditingDest({ ...editingDest, coverImage: url })}
                  onRemove={() => setEditingDest({ ...editingDest, coverImage: "" })}
                />

                {/* Multiple Gallery Photos */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <FaImages className="text-primary h-3.5 w-3.5" /> Additional Gallery Photo URLs
                  </label>
                  <Textarea
                    rows={3}
                    placeholder="Paste additional image URLs (one per line)..."
                    value={editingDest.galleryImagesInput}
                    onChange={(e) => setEditingDest({ ...editingDest, galleryImagesInput: e.target.value })}
                    className="rounded-xl text-xs font-mono"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-border">
                  <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)} className="rounded-xl">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting} className="rounded-xl">
                    {submitting ? <FaSpinner className="animate-spin mr-2" /> : "Save Changes"}
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
