"use client";

import React, { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useGetTransportationsQuery,
  useCreateTransportationMutation,
  useUpdateTransportationMutation,
  useDeleteTransportationMutation,
} from "@/redux/features/transportation/transportationApi";
import {
  FaBus,
  FaTrain,
  FaPlane,
  FaCar,
  FaPlus,
  FaSearch,
  FaSpinner,
  FaTrashAlt,
  FaEdit,
  FaMapMarkerAlt,
  FaClock,
  FaCoins,
} from "react-icons/fa";

export default function AdminTransportationPage() {
  const [routeFromFilter, setRouteFromFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const { data: transResponse, isLoading } = useGetTransportationsQuery({
    routeFrom: routeFromFilter !== "ALL" ? routeFromFilter : undefined,
    type: typeFilter !== "ALL" ? typeFilter : undefined,
  });

  const [createTransportation] = useCreateTransportationMutation();
  const [updateTransportation] = useUpdateTransportationMutation();
  const [deleteTransportation] = useDeleteTransportationMutation();

  const transportations: any[] = transResponse?.data ?? [];

  // Add Modal State
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newTransport, setNewTransport] = useState({
    type: "BUS",
    operatorName: "",
    routeFrom: "Dhaka",
    routeTo: "Cox's Bazar",
    estimatedCost: 1500,
    duration: "8h 00m",
    scheduleTime: "10:00 PM",
  });

  // Edit Modal State
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingTransport, setEditingTransport] = useState<any>(null);

  const [submitting, setSubmitting] = useState(false);

  const errorMessage = (err: unknown, fallback: string) =>
    (err as { data?: { message?: string } })?.data?.message || fallback;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTransport.operatorName) return toast.error("Please enter an operator name!");
    setSubmitting(true);
    const toastId = toast.loading("Creating transportation schedule...");
    try {
      await createTransportation({
        ...newTransport,
        estimatedCost: Number(newTransport.estimatedCost),
      }).unwrap();

      toast.success("Schedule created successfully!", { id: toastId });
      setAddDialogOpen(false);
      setNewTransport({
        type: "BUS",
        operatorName: "",
        routeFrom: "Dhaka",
        routeTo: "Cox's Bazar",
        estimatedCost: 1500,
        duration: "8h 00m",
        scheduleTime: "10:00 PM",
      });
    } catch (err: unknown) {
      toast.error(errorMessage(err, "Failed to create transportation schedule"), { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEdit = (item: any) => {
    setEditingTransport({
      id: item.id,
      type: item.type,
      operatorName: item.operatorName,
      routeFrom: item.routeFrom,
      routeTo: item.routeTo,
      estimatedCost: item.estimatedCost || 1200,
      duration: item.duration || "6h 00m",
      scheduleTime: item.scheduleTime || "08:00 AM",
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTransport) return;
    setSubmitting(true);
    const toastId = toast.loading("Updating transportation schedule...");
    try {
      await updateTransportation({
        id: editingTransport.id,
        ...editingTransport,
        estimatedCost: Number(editingTransport.estimatedCost),
      }).unwrap();

      toast.success("Schedule updated successfully!", { id: toastId });
      setEditDialogOpen(false);
      setEditingTransport(null);
    } catch (err: unknown) {
      toast.error(errorMessage(err, "Failed to update transportation schedule"), { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transport schedule?")) return;
    const toastId = toast.loading("Deleting transport schedule...");
    try {
      await deleteTransportation(id).unwrap();
      toast.success("Schedule deleted successfully", { id: toastId });
    } catch (err: unknown) {
      toast.error(errorMessage(err, "Failed to delete transport schedule"), { id: toastId });
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
                <FaBus className="h-5 w-5" />
              </div>
              Transportation & Transit Control Panel
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Add, edit, manage, and inspect intercity bus, train, flight, and car rental schedules.
            </p>
          </div>

          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger>
              <Button className="gap-2 shrink-0">
                <FaPlus className="h-3.5 w-3.5" /> Add New Transport Schedule
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-lg font-medium">Add Transport Schedule</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold">Transport Type</label>
                    <select
                      value={newTransport.type}
                      onChange={(e) => setNewTransport({ ...newTransport, type: e.target.value })}
                      className="w-full h-10 rounded-md border bg-background px-3 text-sm focus:ring-2 focus:ring-primary"
                    >
                      <option value="BUS">BUS (AC/Non-AC)</option>
                      <option value="TRAIN">TRAIN (Express)</option>
                      <option value="FLIGHT">FLIGHT (Domestic)</option>
                      <option value="CAR_RENTAL">CAR RENTAL (Private)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold">Operator / Service Name</label>
                    <Input
                      placeholder="e.g. Green Line Paribahan"
                      value={newTransport.operatorName}
                      onChange={(e) => setNewTransport({ ...newTransport, operatorName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold">Departure From</label>
                    <Input
                      placeholder="Dhaka"
                      value={newTransport.routeFrom}
                      onChange={(e) => setNewTransport({ ...newTransport, routeFrom: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold">Destination To</label>
                    <Input
                      placeholder="Cox's Bazar"
                      value={newTransport.routeTo}
                      onChange={(e) => setNewTransport({ ...newTransport, routeTo: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold">Fare Cost (BDT ৳)</label>
                    <Input
                      type="number"
                      value={newTransport.estimatedCost}
                      onChange={(e) => setNewTransport({ ...newTransport, estimatedCost: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold">Departure Time</label>
                    <Input
                      placeholder="10:00 PM"
                      value={newTransport.scheduleTime}
                      onChange={(e) => setNewTransport({ ...newTransport, scheduleTime: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold">Duration</label>
                    <Input
                      placeholder="8h 00m"
                      value={newTransport.duration}
                      onChange={(e) => setNewTransport({ ...newTransport, duration: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? <FaSpinner className="animate-spin" /> : "Save Schedule"}
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
              <p className="text-sm text-muted-foreground">Total Transit Schedules</p>
              <h3 className="text-2xl font-semibold text-foreground mt-0.5">{transportations.length}</h3>
            </div>
            <FaBus className="h-6 w-6 text-primary" />
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
            <div>
              <p className="text-sm text-muted-foreground">Transport Modes</p>
              <h3 className="text-2xl font-semibold text-primary mt-0.5">
                {new Set(transportations.map((t) => t.type)).size} Types
              </h3>
            </div>
            <FaMapMarkerAlt className="h-6 w-6 text-primary" />
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm">
            <div>
              <p className="text-sm text-muted-foreground">Average Ticket Price</p>
              <h3 className="text-2xl font-semibold text-emerald-400 mt-0.5">
                ৳{transportations.length ? Math.round(transportations.reduce((sum, t) => sum + (t.estimatedCost || 1200), 0) / transportations.length).toLocaleString() : 0}
              </h3>
            </div>
            <FaCoins className="h-6 w-6 text-emerald-500" />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-4 rounded-2xl bg-card border border-border flex flex-col sm:flex-row gap-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-10 rounded-xl border bg-background px-3 text-xs font-medium"
          >
            <option value="ALL">All Transport Modes</option>
            <option value="BUS">BUS</option>
            <option value="TRAIN">TRAIN</option>
            <option value="FLIGHT">FLIGHT</option>
            <option value="CAR_RENTAL">CAR RENTAL</option>
          </select>

          <select
            value={routeFromFilter}
            onChange={(e) => setRouteFromFilter(e.target.value)}
            className="h-10 rounded-xl border bg-background px-3 text-xs font-medium"
          >
            <option value="ALL">All Departure Cities</option>
            <option value="Dhaka">Dhaka</option>
            <option value="Chittagong">Chittagong</option>
            <option value="Sylhet">Sylhet</option>
            <option value="Cox's Bazar">Cox's Bazar</option>
          </select>
        </div>

        {/* Table View */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="py-16 flex justify-center text-muted-foreground">
              <FaSpinner className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : transportations.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground space-y-2">
              <FaBus className="h-10 w-10 text-muted-foreground/30 mx-auto" />
              <p className="font-medium text-foreground">No transport schedules found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-border/80">
                  <TableHead>Mode</TableHead>
                  <TableHead>Operator Name</TableHead>
                  <TableHead>Route (From &rarr; To)</TableHead>
                  <TableHead>Time & Duration</TableHead>
                  <TableHead>Estimated Cost</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transportations.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/30 border-b border-border/60">
                    <TableCell>
                      <span className="px-2.5 py-1 text-xs font-semibold bg-primary/10 text-primary border border-primary/20 rounded-lg inline-flex items-center gap-1.5">
                        {item.type === "TRAIN" ? <FaTrain /> : item.type === "FLIGHT" ? <FaPlane /> : item.type === "BUS" ? <FaBus /> : <FaCar />}
                        {item.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-foreground text-sm">{item.operatorName}</p>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-semibold">
                      <span className="flex items-center gap-1">
                        <FaMapMarkerAlt className="text-primary h-3 w-3" />
                        {item.routeFrom} &rarr; {item.routeTo}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FaClock className="text-amber-400 h-3 w-3" />
                        {item.scheduleTime} ({item.duration})
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold text-emerald-400 text-sm">
                      ৳{(item.estimatedCost || 1200).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenEdit(item)}
                          className="h-8 w-8 p-0 text-primary hover:text-primary hover:bg-primary/10 rounded-lg"
                          title="Edit Schedule"
                        >
                          <FaEdit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(item.id)}
                          className="h-8 w-8 p-0 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg"
                          title="Delete Schedule"
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
        {editingTransport && (
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-lg font-medium">Edit Transport Schedule</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpdate} className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold">Transport Type</label>
                    <select
                      value={editingTransport.type}
                      onChange={(e) => setEditingTransport({ ...editingTransport, type: e.target.value })}
                      className="w-full h-10 rounded-md border bg-background px-3 text-sm"
                    >
                      <option value="BUS">BUS</option>
                      <option value="TRAIN">TRAIN</option>
                      <option value="FLIGHT">FLIGHT</option>
                      <option value="CAR_RENTAL">CAR RENTAL</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold">Operator Name</label>
                    <Input
                      value={editingTransport.operatorName}
                      onChange={(e) => setEditingTransport({ ...editingTransport, operatorName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold">Departure From</label>
                    <Input
                      value={editingTransport.routeFrom}
                      onChange={(e) => setEditingTransport({ ...editingTransport, routeFrom: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold">Destination To</label>
                    <Input
                      value={editingTransport.routeTo}
                      onChange={(e) => setEditingTransport({ ...editingTransport, routeTo: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold">Fare Cost (BDT ৳)</label>
                    <Input
                      type="number"
                      value={editingTransport.estimatedCost}
                      onChange={(e) => setEditingTransport({ ...editingTransport, estimatedCost: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold">Departure Time</label>
                    <Input
                      value={editingTransport.scheduleTime}
                      onChange={(e) => setEditingTransport({ ...editingTransport, scheduleTime: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold">Duration</label>
                    <Input
                      value={editingTransport.duration}
                      onChange={(e) => setEditingTransport({ ...editingTransport, duration: e.target.value })}
                      required
                    />
                  </div>
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
