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
  useGetHotelsQuery,
  useCreateHotelMutation,
  useUpdateHotelMutation,
  useDeleteHotelMutation,
} from "@/redux/features/hotel/hotelApi";
import {
  FaHotel,
  FaPlus,
  FaSearch,
  FaSpinner,
  FaTrashAlt,
  FaEdit,
  FaStar,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaCoins,
} from "react-icons/fa";

export default function AdminHotelsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("ALL");

  const { data: hotelsResponse, isLoading } = useGetHotelsQuery({
    location: locationFilter !== "ALL" ? locationFilter : undefined,
    searchTerm: searchTerm || undefined,
  });

  const [createHotel] = useCreateHotelMutation();
  const [updateHotel] = useUpdateHotelMutation();
  const [deleteHotel] = useDeleteHotelMutation();

  const hotels: any[] = hotelsResponse?.data ?? [];

  // Add Modal State
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newHotel, setNewHotel] = useState({
    name: "",
    location: "",
    description: "",
    pricePerNight: 5000,
    coverImage: "",
    amenitiesInput: "Free WiFi, Swimming Pool, Breakfast",
    contactPhone: "+8801700000000",
  });

  // Edit Modal State
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<any>(null);

  const [submitting, setSubmitting] = useState(false);

  const errorMessage = (err: unknown, fallback: string) =>
    (err as { data?: { message?: string } })?.data?.message || fallback;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHotel.coverImage) return toast.error("Please upload a cover image!");
    setSubmitting(true);
    const toastId = toast.loading("Creating hotel...");
    try {
      const amenities = newHotel.amenitiesInput.split(",").map((a) => a.trim()).filter(Boolean);
      await createHotel({
        name: newHotel.name,
        location: newHotel.location,
        description: newHotel.description,
        pricePerNight: Number(newHotel.pricePerNight),
        coverImage: newHotel.coverImage,
        images: [newHotel.coverImage],
        amenities,
        contactPhone: newHotel.contactPhone,
      }).unwrap();

      toast.success("Hotel created successfully!", { id: toastId });
      setAddDialogOpen(false);
      setNewHotel({
        name: "",
        location: "",
        description: "",
        pricePerNight: 5000,
        coverImage: "",
        amenitiesInput: "Free WiFi, Swimming Pool, Breakfast",
        contactPhone: "+8801700000000",
      });
    } catch (err: unknown) {
      toast.error(errorMessage(err, "Failed to create hotel"), { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEdit = (item: any) => {
    setEditingHotel({
      id: item.id,
      name: item.name,
      location: item.location,
      description: item.description,
      pricePerNight: item.pricePerNight || 3500,
      coverImage: item.coverImage,
      amenitiesInput: (item.amenities || []).join(", "),
      contactPhone: item.contactPhone || "+8801700000000",
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHotel) return;
    setSubmitting(true);
    const toastId = toast.loading("Updating hotel...");
    try {
      const amenities = editingHotel.amenitiesInput.split(",").map((a: string) => a.trim()).filter(Boolean);
      await updateHotel({
        id: editingHotel.id,
        name: editingHotel.name,
        location: editingHotel.location,
        description: editingHotel.description,
        pricePerNight: Number(editingHotel.pricePerNight),
        coverImage: editingHotel.coverImage,
        images: [editingHotel.coverImage],
        amenities,
        contactPhone: editingHotel.contactPhone,
      }).unwrap();

      toast.success("Hotel updated successfully!", { id: toastId });
      setEditDialogOpen(false);
      setEditingHotel(null);
    } catch (err: unknown) {
      toast.error(errorMessage(err, "Failed to update hotel"), { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hotel?")) return;
    const toastId = toast.loading("Deleting hotel...");
    try {
      await deleteHotel(id).unwrap();
      toast.success("Hotel deleted successfully", { id: toastId });
    } catch (err: unknown) {
      toast.error(errorMessage(err, "Failed to delete hotel"), { id: toastId });
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
                <FaHotel className="h-5 w-5" />
              </div>
              Hotels & Resorts Control Panel
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Add, edit, manage, and inspect all hotel rooms, resorts, and lodging properties.
            </p>
          </div>

          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger
              render={
                <Button className="gap-2 shrink-0">
                  <FaPlus className="h-3.5 w-3.5" /> Add New Hotel
                </Button>
              }
            />
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-lg font-medium">Add New Hotel / Resort</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Hotel Name</label>
                  <Input
                    placeholder="e.g. Sayeman Beach Resort"
                    value={newHotel.name}
                    onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold">Location / Address</label>
                    <Input
                      placeholder="Cox's Bazar"
                      value={newHotel.location}
                      onChange={(e) => setNewHotel({ ...newHotel, location: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold">Price per Night (BDT ৳)</label>
                    <Input
                      type="number"
                      value={newHotel.pricePerNight}
                      onChange={(e) => setNewHotel({ ...newHotel, pricePerNight: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold">Contact Phone Number</label>
                    <Input
                      value={newHotel.contactPhone}
                      onChange={(e) => setNewHotel({ ...newHotel, contactPhone: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold">Amenities (Comma Separated)</label>
                    <Input
                      value={newHotel.amenitiesInput}
                      onChange={(e) => setNewHotel({ ...newHotel, amenitiesInput: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold">Description</label>
                  <Textarea
                    rows={3}
                    value={newHotel.description}
                    onChange={(e) => setNewHotel({ ...newHotel, description: e.target.value })}
                    required
                  />
                </div>

                <ImageUploader
                  label="Cover Photo Image"
                  folder="hotels"
                  value={newHotel.coverImage}
                  onChange={(url) => setNewHotel({ ...newHotel, coverImage: url })}
                  onRemove={() => setNewHotel({ ...newHotel, coverImage: "" })}
                />

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? <FaSpinner className="animate-spin" /> : "Save Hotel"}
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
              <p className="text-sm text-muted-foreground">Total Hotel Properties</p>
              <h3 className="text-2xl font-semibold text-foreground mt-0.5">{hotels.length}</h3>
            </div>
            <FaHotel className="h-6 w-6 text-primary" />
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
            <div>
              <p className="text-sm text-muted-foreground">Locations</p>
              <h3 className="text-2xl font-semibold text-primary mt-0.5">
                {new Set(hotels.map((h) => h.location)).size} Cities
              </h3>
            </div>
            <FaMapMarkerAlt className="h-6 w-6 text-primary" />
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
            <div>
              <p className="text-sm text-muted-foreground">Avg Nightly Rate</p>
              <h3 className="text-2xl font-semibold text-emerald-400 mt-0.5">
                ৳{hotels.length ? Math.round(hotels.reduce((sum, h) => sum + (h.pricePerNight || 0), 0) / hotels.length).toLocaleString() : 0}
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
              placeholder="Search hotels by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 rounded-xl"
            />
          </div>

          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="h-10 rounded-xl border bg-background px-3 text-xs font-medium"
          >
            <option value="ALL">All Locations</option>
            <option value="Cox's Bazar">Cox's Bazar</option>
            <option value="Sylhet">Sylhet</option>
            <option value="Bandarban">Bandarban</option>
            <option value="Dhaka">Dhaka</option>
            <option value="Chittagong">Chittagong</option>
          </select>
        </div>

        {/* Table View */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="py-16 flex justify-center text-muted-foreground">
              <FaSpinner className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : hotels.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground space-y-2">
              <FaHotel className="h-10 w-10 text-muted-foreground/30 mx-auto" />
              <p className="font-medium text-foreground">No hotel properties found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-border/80">
                  <TableHead>Cover</TableHead>
                  <TableHead>Hotel Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Contact Phone</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Rate / Night</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hotels.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/30 border-b border-border/60">
                    <TableCell>
                      <div className="relative h-12 w-16 rounded-xl overflow-hidden bg-muted border shrink-0">
                        <Image src={item.coverImage || "https://images.unsplash.com/photo-1566073771259-6a8506099945"} alt={item.name} fill sizes="64px" className="object-cover" />
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
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FaPhoneAlt className="text-primary h-3 w-3" />
                        {item.contactPhone || "+8801700000000"}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-amber-400">
                      <span className="flex items-center gap-1">
                        <FaStar className="fill-amber-400 h-3 w-3" /> {item.rating || 4.9}
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold text-emerald-400 text-sm">
                      ৳{(item.pricePerNight || 3500).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenEdit(item)}
                          className="h-8 w-8 p-0 text-primary hover:text-primary hover:bg-primary/10 rounded-lg"
                          title="Edit Hotel"
                        >
                          <FaEdit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(item.id)}
                          className="h-8 w-8 p-0 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg"
                          title="Delete Hotel"
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
        {editingHotel && (
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-lg font-medium">Edit Hotel / Resort</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpdate} className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-semibold">Hotel Name</label>
                  <Input
                    value={editingHotel.name}
                    onChange={(e) => setEditingHotel({ ...editingHotel, name: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold">Location</label>
                    <Input
                      value={editingHotel.location}
                      onChange={(e) => setEditingHotel({ ...editingHotel, location: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold">Price per Night (BDT ৳)</label>
                    <Input
                      type="number"
                      value={editingHotel.pricePerNight}
                      onChange={(e) => setEditingHotel({ ...editingHotel, pricePerNight: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold">Contact Phone</label>
                    <Input
                      value={editingHotel.contactPhone}
                      onChange={(e) => setEditingHotel({ ...editingHotel, contactPhone: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold">Amenities (Comma Separated)</label>
                    <Input
                      value={editingHotel.amenitiesInput}
                      onChange={(e) => setEditingHotel({ ...editingHotel, amenitiesInput: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold">Description</label>
                  <Textarea
                    rows={3}
                    value={editingHotel.description}
                    onChange={(e) => setEditingHotel({ ...editingHotel, description: e.target.value })}
                    required
                  />
                </div>

                <ImageUploader
                  label="Cover Photo Image"
                  folder="hotels"
                  value={editingHotel.coverImage}
                  onChange={(url) => setEditingHotel({ ...editingHotel, coverImage: url })}
                  onRemove={() => setEditingHotel({ ...editingHotel, coverImage: "" })}
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
