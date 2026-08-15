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
    price: 1500,
  });

  // Edit Dialog State
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingDest, setEditingDest] = useState<any>(null);

  const [submitting, setSubmitting] = useState(false);

  const errorMessage = (err: unknown, fallback: string) =>
    (err as { data?: { message?: string } })?.data?.message || fallback;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDest.coverImage) return toast.error("Please upload a cover image!");
    setSubmitting(true);
    const toastId = toast.loading("Creating destination...");
    try {
      await createDestination({
        ...newDest,
        price: Number(newDest.price),
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
        price: 1500,
      });
    } catch (err: unknown) {
      toast.error(errorMessage(err, "Failed to create destination"), { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEdit = (item: any) => {
    setEditingDest({
      id: item.id,
      title: item.title,
      description: item.description,
      location: item.location,
      district: item.district,
      category: item.category,
      coverImage: item.coverImage,
      price: item.price || 1500,
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDest) return;
    setSubmitting(true);
    const toastId = toast.loading("Updating destination...");
    try {
      await updateDestination({
        id: editingDest.id,
        ...editingDest,
        price: Number(editingDest.price),
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
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 shrink-0">
                <FaCompass className="h-5 w-5" />
              </div>
              Destinations Control & Management
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Add, edit, manage, and inspect all tourist spot packages across Bangladesh.
            </p>
          </div>

          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger>
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold shadow-md shadow-indigo-600/20 gap-2 shrink-0">
                <FaPlus className="h-3.5 w-3.5" /> Add New Destination
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">Add New Tourist Destination</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Destination Title</label>
                  <Input
                    placeholder="e.g. Cox's Bazar Sea Beach"
                    value={newDest.title}
                    onChange={(e) => setNewDest({ ...newDest, title: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold">District</label>
                    <Input
                      placeholder="Cox's Bazar"
                      value={newDest.district}
                      onChange={(e) => setNewDest({ ...newDest, district: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold">Location / Address</label>
                    <Input
                      placeholder="Chittagong Division"
                      value={newDest.location}
                      onChange={(e) => setNewDest({ ...newDest, location: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold">Category</label>
                    <select
                      value={newDest.category}
                      onChange={(e) => setNewDest({ ...newDest, category: e.target.value })}
                      className="w-full h-10 rounded-md border bg-background px-3 text-sm focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Beach">Beach</option>
                      <option value="Mountain">Mountain</option>
                      <option value="Historical">Historical</option>
                      <option value="Eco-Tour">Eco-Tour</option>
                      <option value="Waterfall">Waterfall</option>
                      <option value="Resort">Resort</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold">Package Price (BDT ৳)</label>
                    <Input
                      type="number"
                      value={newDest.price}
                      onChange={(e) => setNewDest({ ...newDest, price: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold">Description</label>
                  <Textarea
                    rows={3}
                    value={newDest.description}
                    onChange={(e) => setNewDest({ ...newDest, description: e.target.value })}
                    required
                  />
                </div>

                <ImageUploader
                  label="Cover Photo Image"
                  folder="destinations"
                  value={newDest.coverImage}
                  onChange={(url) => setNewDest({ ...newDest, coverImage: url })}
                  onRemove={() => setNewDest({ ...newDest, coverImage: "" })}
                />

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting} className="bg-indigo-600 text-white font-bold">
                    {submitting ? <FaSpinner className="animate-spin" /> : "Save Destination"}
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
              <p className="text-[11px] font-bold text-muted-foreground uppercase">Total Destinations</p>
              <h3 className="text-2xl font-black text-foreground mt-0.5">{destinations.length}</h3>
            </div>
            <FaCompass className="h-6 w-6 text-indigo-500" />
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[11px] font-bold text-muted-foreground uppercase">Categories</p>
              <h3 className="text-2xl font-black text-indigo-400 mt-0.5">
                {new Set(destinations.map((d) => d.category)).size} Types
              </h3>
            </div>
            <FaLayerGroup className="h-6 w-6 text-indigo-400" />
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[11px] font-bold text-muted-foreground uppercase">Average Rate</p>
              <h3 className="text-2xl font-black text-emerald-400 mt-0.5">
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
            className="h-10 rounded-xl border bg-background px-3 text-xs font-bold"
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
        <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="py-16 flex justify-center text-muted-foreground">
              <FaSpinner className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
          ) : destinations.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground space-y-2">
              <FaCompass className="h-10 w-10 text-muted-foreground/30 mx-auto" />
              <p className="font-bold text-foreground">No destinations found</p>
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
                      <div className="relative h-12 w-16 rounded-xl overflow-hidden bg-slate-900 border shrink-0">
                        <Image src={item.coverImage || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"} alt={item.title} fill sizes="64px" className="object-cover" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-bold text-foreground text-sm">{item.title}</p>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FaMapMarkerAlt className="text-indigo-400 h-3 w-3" />
                        {item.location}, {item.district}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                        {item.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-bold text-amber-400">
                      <span className="flex items-center gap-1">
                        <FaStar className="fill-amber-400 h-3 w-3" /> {item.rating || 4.8}
                      </span>
                    </TableCell>
                    <TableCell className="font-black text-emerald-400 text-sm">
                      ৳{(item.price || 1500).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenEdit(item)}
                          className="h-8 w-8 p-0 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg"
                          title="Edit Destination"
                        >
                          <FaEdit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(item.id)}
                          className="h-8 w-8 p-0 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg"
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
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">Edit Destination</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpdate} className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-semibold">Title</label>
                  <Input
                    value={editingDest.title}
                    onChange={(e) => setEditingDest({ ...editingDest, title: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold">District</label>
                    <Input
                      value={editingDest.district}
                      onChange={(e) => setEditingDest({ ...editingDest, district: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold">Location</label>
                    <Input
                      value={editingDest.location}
                      onChange={(e) => setEditingDest({ ...editingDest, location: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold">Category</label>
                    <select
                      value={editingDest.category}
                      onChange={(e) => setEditingDest({ ...editingDest, category: e.target.value })}
                      className="w-full h-10 rounded-md border bg-background px-3 text-sm"
                    >
                      <option value="Beach">Beach</option>
                      <option value="Mountain">Mountain</option>
                      <option value="Historical">Historical</option>
                      <option value="Eco-Tour">Eco-Tour</option>
                      <option value="Waterfall">Waterfall</option>
                      <option value="Resort">Resort</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold">Price (BDT ৳)</label>
                    <Input
                      type="number"
                      value={editingDest.price}
                      onChange={(e) => setEditingDest({ ...editingDest, price: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold">Description</label>
                  <Textarea
                    rows={3}
                    value={editingDest.description}
                    onChange={(e) => setEditingDest({ ...editingDest, description: e.target.value })}
                    required
                  />
                </div>

                <ImageUploader
                  label="Cover Photo Image"
                  folder="destinations"
                  value={editingDest.coverImage}
                  onChange={(url) => setEditingDest({ ...editingDest, coverImage: url })}
                  onRemove={() => setEditingDest({ ...editingDest, coverImage: "" })}
                />

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting} className="bg-indigo-600 text-white font-bold">
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
