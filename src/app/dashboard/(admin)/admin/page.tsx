"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { ProtectedRoute, Container, ImageUploader } from "@/components/shared";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout, selectCurrentUser } from "@/redux/features/auth/authSlice";
import {
  useGetDestinationsQuery,
  useCreateDestinationMutation,
  useDeleteDestinationMutation,
} from "@/redux/features/destination/destinationApi";
import {
  useGetHotelsQuery,
  useCreateHotelMutation,
  useDeleteHotelMutation,
} from "@/redux/features/hotel/hotelApi";
import {
  useGetRestaurantsQuery,
  useCreateRestaurantMutation,
  useDeleteRestaurantMutation,
} from "@/redux/features/restaurant/restaurantApi";
import {
  useGetTransportationsQuery,
  useCreateTransportationMutation,
  useDeleteTransportationMutation,
} from "@/redux/features/transportation/transportationApi";
import {
  useGetReservationsQuery,
  useUpdateReservationStatusMutation,
} from "@/redux/features/reservation/reservationApi";
import { useTheme } from "next-themes";
import {
  FaCompass,
  FaCompass as FaGlobe,
  FaUsers,
  FaMapMarkerAlt,
  FaCalendarCheck,
  FaPlus,
  FaTrashAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaSignOutAlt,
  FaMoon,
  FaSun,
  FaShieldAlt,
  FaSpinner,
  FaHotel,
  FaUtensils,
  FaBus,
  FaPhoneAlt,
} from "react-icons/fa";

type AdminTab = "destinations" | "hotels" | "restaurants" | "transportation" | "reservations";

export default function AdminDashboardPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("destinations");

  // Queries
  const { data: destinationsResponse, isLoading: loadingDestinations } = useGetDestinationsQuery(undefined);
  const { data: hotelsResponse, isLoading: loadingHotels } = useGetHotelsQuery(undefined);
  const { data: restaurantsResponse, isLoading: loadingRestaurants } = useGetRestaurantsQuery(undefined);
  const { data: transportResponse, isLoading: loadingTransport } = useGetTransportationsQuery(undefined);
  const { data: reservationsResponse, isLoading: loadingReservations } = useGetReservationsQuery(undefined);

  // Mutations
  const [createDestination] = useCreateDestinationMutation();
  const [deleteDestinationMutation] = useDeleteDestinationMutation();
  const [createHotel] = useCreateHotelMutation();
  const [deleteHotelMutation] = useDeleteHotelMutation();
  const [createRestaurant] = useCreateRestaurantMutation();
  const [deleteRestaurantMutation] = useDeleteRestaurantMutation();
  const [createTransportation] = useCreateTransportationMutation();
  const [deleteTransportationMutation] = useDeleteTransportationMutation();
  const [updateReservationStatus] = useUpdateReservationStatusMutation();

  const destinations: any[] = destinationsResponse?.data ?? [];
  const hotels: any[] = hotelsResponse?.data ?? [];
  const restaurants: any[] = restaurantsResponse?.data ?? [];
  const transportations: any[] = transportResponse?.data ?? [];
  const reservations: any[] = reservationsResponse?.data ?? [];

  // Dialog States
  const [destDialogOpen, setDestDialogOpen] = useState(false);
  const [hotelDialogOpen, setHotelDialogOpen] = useState(false);
  const [restDialogOpen, setRestDialogOpen] = useState(false);
  const [transportDialogOpen, setTransportDialogOpen] = useState(false);

  // Form States
  const [newDest, setNewDest] = useState({
    title: "",
    description: "",
    location: "",
    district: "",
    category: "Beach",
    coverImage: "",
    price: 1500,
  });

  const [newHotel, setNewHotel] = useState({
    name: "",
    location: "",
    description: "",
    pricePerNight: 5000,
    coverImage: "",
    amenitiesInput: "Free WiFi, Pool, Breakfast",
    contactPhone: "+8801700000000",
  });

  const [newRest, setNewRest] = useState({
    name: "",
    location: "",
    cuisineType: "Seafood & Bangladeshi",
    description: "",
    priceRange: "৳৳ - ৳৳৳",
    coverImage: "",
  });

  const [newTransport, setNewTransport] = useState({
    type: "BUS",
    operatorName: "",
    routeFrom: "Dhaka",
    routeTo: "Cox's Bazar",
    estimatedCost: 1500,
    duration: "8h 00m",
    scheduleTime: "10:00 PM",
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const errorMessage = (err: unknown, fallback: string) =>
    (err as { data?: { message?: string } })?.data?.message || fallback;

  // Handlers
  const handleCreateDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDest.coverImage) return toast.error("Please upload a cover image!");
    setSubmitting(true);
    const toastId = toast.loading("Saving destination...");
    try {
      await createDestination({ ...newDest, price: Number(newDest.price) }).unwrap();
      toast.success("Destination added successfully!", { id: toastId });
      setDestDialogOpen(false);
      setNewDest({ title: "", description: "", location: "", district: "", category: "Beach", coverImage: "", price: 1500 });
    } catch (err) {
      toast.error(errorMessage(err, "Failed to create destination"), { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHotel.coverImage) return toast.error("Please upload a cover image!");
    setSubmitting(true);
    const toastId = toast.loading("Saving hotel...");
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
      toast.success("Hotel added successfully!", { id: toastId });
      setHotelDialogOpen(false);
      setNewHotel({ name: "", location: "", description: "", pricePerNight: 5000, coverImage: "", amenitiesInput: "Free WiFi, Pool, Breakfast", contactPhone: "+8801700000000" });
    } catch (err) {
      toast.error(errorMessage(err, "Failed to create hotel"), { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRest.coverImage) return toast.error("Please upload a cover image!");
    setSubmitting(true);
    const toastId = toast.loading("Saving restaurant...");
    try {
      await createRestaurant({
        ...newRest,
        images: [newRest.coverImage],
      }).unwrap();
      toast.success("Restaurant added successfully!", { id: toastId });
      setRestDialogOpen(false);
      setNewRest({ name: "", location: "", cuisineType: "Seafood & Bangladeshi", description: "", priceRange: "৳৳ - ৳৳৳", coverImage: "" });
    } catch (err) {
      toast.error(errorMessage(err, "Failed to create restaurant"), { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateTransportation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const toastId = toast.loading("Saving transportation...");
    try {
      await createTransportation({
        ...newTransport,
        estimatedCost: Number(newTransport.estimatedCost),
      }).unwrap();
      toast.success("Transportation added successfully!", { id: toastId });
      setTransportDialogOpen(false);
      setNewTransport({ type: "BUS", operatorName: "", routeFrom: "Dhaka", routeTo: "Cox's Bazar", estimatedCost: 1500, duration: "8h 00m", scheduleTime: "10:00 PM" });
    } catch (err) {
      toast.error(errorMessage(err, "Failed to create transportation"), { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteItem = async (type: AdminTab, id: string) => {
    if (!confirm(`Are you sure you want to delete this ${type.slice(0, -1)}?`)) return;
    try {
      if (type === "destinations") await deleteDestinationMutation(id).unwrap();
      if (type === "hotels") await deleteHotelMutation(id).unwrap();
      if (type === "restaurants") await deleteRestaurantMutation(id).unwrap();
      if (type === "transportation") await deleteTransportationMutation(id).unwrap();
      toast.success("Item deleted successfully");
    } catch (err) {
      toast.error(errorMessage(err, "Failed to delete item"));
    }
  };

  const handleUpdateReservationStatus = async (id: string, status: string) => {
    try {
      await updateReservationStatus({ id, status }).unwrap();
      toast.success(`Reservation ${status.toLowerCase()}`);
    } catch (err) {
      toast.error(errorMessage(err, "Failed to update status"));
    }
  };

  return (
    <div className="space-y-8">
            {/* Top Cards */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Administrator Control Center 🛡️
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Add and manage Destinations, Hotels, Restaurants, Transportation, and Booking Requests.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-5">
                <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase">Destinations</p>
                    <h3 className="text-xl font-black mt-0.5">{destinations.length}</h3>
                  </div>
                  <FaGlobe className="h-6 w-6 text-indigo-500" />
                </div>

                <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase">Hotels</p>
                    <h3 className="text-xl font-black mt-0.5">{hotels.length}</h3>
                  </div>
                  <FaHotel className="h-6 w-6 text-emerald-500" />
                </div>

                <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase">Restaurants</p>
                    <h3 className="text-xl font-black mt-0.5">{restaurants.length}</h3>
                  </div>
                  <FaUtensils className="h-6 w-6 text-amber-500" />
                </div>

                <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase">Transport</p>
                    <h3 className="text-xl font-black mt-0.5">{transportations.length}</h3>
                  </div>
                  <FaBus className="h-6 w-6 text-sky-500" />
                </div>

                <Link
                  href="/dashboard/admin/all-users"
                  className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between hover:border-indigo-500/50 transition-all col-span-2 sm:col-span-1"
                >
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase">Users</p>
                    <h3 className="text-xs font-bold text-indigo-400 mt-1">Manage Users &rarr;</h3>
                  </div>
                  <FaUsers className="h-6 w-6 text-rose-400" />
                </Link>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto border-b border-border pb-3">
              <button
                onClick={() => setActiveTab("destinations")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === "destinations"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <FaGlobe className="h-3.5 w-3.5" /> Destinations ({destinations.length})
              </button>

              <button
                onClick={() => setActiveTab("hotels")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === "hotels"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <FaHotel className="h-3.5 w-3.5" /> Hotels ({hotels.length})
              </button>

              <button
                onClick={() => setActiveTab("restaurants")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === "restaurants"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <FaUtensils className="h-3.5 w-3.5" /> Restaurants ({restaurants.length})
              </button>

              <button
                onClick={() => setActiveTab("transportation")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === "transportation"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <FaBus className="h-3.5 w-3.5" /> Transportation ({transportations.length})
              </button>

              <button
                onClick={() => setActiveTab("reservations")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === "reservations"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <FaCalendarCheck className="h-3.5 w-3.5" /> Reservations ({reservations.length})
              </button>
            </div>

            {/* Tab 1: Destinations */}
            {activeTab === "destinations" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">Manage Tourist Destinations</h2>
                  <Dialog open={destDialogOpen} onOpenChange={setDestDialogOpen}>
                    <DialogTrigger>
                      <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-semibold gap-2">
                        <FaPlus className="h-3.5 w-3.5" /> Add Destination
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-card border-border">
                      <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Add New Tourist Destination</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleCreateDestination} className="space-y-4 pt-2">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold">Title</label>
                          <Input placeholder="e.g. Cox's Bazar Sea Beach" value={newDest.title} onChange={(e) => setNewDest({ ...newDest, title: e.target.value })} required />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-semibold">District</label>
                            <Input placeholder="Cox's Bazar" value={newDest.district} onChange={(e) => setNewDest({ ...newDest, district: e.target.value })} required />
                          </div>
                          <div>
                            <label className="text-xs font-semibold">Location</label>
                            <Input placeholder="Chittagong" value={newDest.location} onChange={(e) => setNewDest({ ...newDest, location: e.target.value })} required />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-semibold">Category</label>
                            <select value={newDest.category} onChange={(e) => setNewDest({ ...newDest, category: e.target.value })} className="w-full h-10 rounded-md border bg-background px-3 text-sm">
                              <option value="Beach">Beach</option>
                              <option value="Heritage">Heritage</option>
                              <option value="Mountain">Mountain</option>
                              <option value="Nature">Nature</option>
                              <option value="Wildlife">Wildlife</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs font-semibold">Price (BDT)</label>
                            <Input type="number" value={newDest.price} onChange={(e) => setNewDest({ ...newDest, price: Number(e.target.value) })} required />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-semibold">Description</label>
                          <Textarea rows={3} value={newDest.description} onChange={(e) => setNewDest({ ...newDest, description: e.target.value })} required />
                        </div>
                        <ImageUploader label="Cover Image" folder="destinations" value={newDest.coverImage} onChange={(url) => setNewDest({ ...newDest, coverImage: url })} onRemove={() => setNewDest({ ...newDest, coverImage: "" })} />
                        <div className="flex justify-end gap-2 pt-2">
                          <Button type="button" variant="outline" onClick={() => setDestDialogOpen(false)}>Cancel</Button>
                          <Button type="submit" disabled={submitting} className="bg-indigo-600 text-white">Save</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="rounded-2xl border bg-card overflow-hidden">
                  {loadingDestinations ? <div className="py-12 flex justify-center"><FaSpinner className="animate-spin text-indigo-500 h-6 w-6" /></div> : (
                    <Table>
                      <TableHeader><TableRow><TableHead>Cover</TableHead><TableHead>Title</TableHead><TableHead>District</TableHead><TableHead>Category</TableHead><TableHead>Price</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {destinations.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell><div className="relative h-12 w-16 rounded overflow-hidden bg-slate-900"><Image src={item.coverImage} alt="" fill className="object-cover" /></div></TableCell>
                            <TableCell className="font-bold">{item.title}</TableCell>
                            <TableCell className="text-xs">{item.district}</TableCell>
                            <TableCell><span className="px-2 py-0.5 text-xs bg-indigo-500/10 text-indigo-400 rounded-full font-semibold">{item.category}</span></TableCell>
                            <TableCell className="font-bold text-emerald-400">৳{item.price}</TableCell>
                            <TableCell><Button variant="ghost" size="sm" onClick={() => handleDeleteItem("destinations", item.id)} className="text-rose-400"><FaTrashAlt /></Button></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Hotels */}
            {activeTab === "hotels" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">Manage Hotels & Resorts</h2>
                  <Dialog open={hotelDialogOpen} onOpenChange={setHotelDialogOpen}>
                    <DialogTrigger>
                      <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-semibold gap-2">
                        <FaPlus className="h-3.5 w-3.5" /> Add Hotel
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-card border-border">
                      <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Add New Hotel / Resort</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleCreateHotel} className="space-y-4 pt-2">
                        <div>
                          <label className="text-xs font-semibold">Hotel Name</label>
                          <Input placeholder="Sayeman Beach Resort" value={newHotel.name} onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })} required />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-semibold">Location</label>
                            <Input placeholder="Cox's Bazar" value={newHotel.location} onChange={(e) => setNewHotel({ ...newHotel, location: e.target.value })} required />
                          </div>
                          <div>
                            <label className="text-xs font-semibold">Price per Night (BDT)</label>
                            <Input type="number" value={newHotel.pricePerNight} onChange={(e) => setNewHotel({ ...newHotel, pricePerNight: Number(e.target.value) })} required />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-semibold">Contact Phone</label>
                            <Input value={newHotel.contactPhone} onChange={(e) => setNewHotel({ ...newHotel, contactPhone: e.target.value })} required />
                          </div>
                          <div>
                            <label className="text-xs font-semibold">Amenities (comma separated)</label>
                            <Input value={newHotel.amenitiesInput} onChange={(e) => setNewHotel({ ...newHotel, amenitiesInput: e.target.value })} required />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-semibold">Description</label>
                          <Textarea rows={3} value={newHotel.description} onChange={(e) => setNewHotel({ ...newHotel, description: e.target.value })} required />
                        </div>
                        <ImageUploader label="Cover Image" folder="hotels" value={newHotel.coverImage} onChange={(url) => setNewHotel({ ...newHotel, coverImage: url })} onRemove={() => setNewHotel({ ...newHotel, coverImage: "" })} />
                        <div className="flex justify-end gap-2 pt-2">
                          <Button type="button" variant="outline" onClick={() => setHotelDialogOpen(false)}>Cancel</Button>
                          <Button type="submit" disabled={submitting} className="bg-indigo-600 text-white">Save Hotel</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="rounded-2xl border bg-card overflow-hidden">
                  {loadingHotels ? <div className="py-12 flex justify-center"><FaSpinner className="animate-spin text-indigo-500 h-6 w-6" /></div> : (
                    <Table>
                      <TableHeader><TableRow><TableHead>Cover</TableHead><TableHead>Hotel Name</TableHead><TableHead>Location</TableHead><TableHead>Phone</TableHead><TableHead>Price/Night</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {hotels.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell><div className="relative h-12 w-16 rounded overflow-hidden bg-slate-900"><Image src={item.coverImage} alt="" fill className="object-cover" /></div></TableCell>
                            <TableCell className="font-bold">{item.name}</TableCell>
                            <TableCell className="text-xs">{item.location}</TableCell>
                            <TableCell className="text-xs font-mono">{item.contactPhone || "N/A"}</TableCell>
                            <TableCell className="font-bold text-emerald-400">৳{item.pricePerNight}</TableCell>
                            <TableCell><Button variant="ghost" size="sm" onClick={() => handleDeleteItem("hotels", item.id)} className="text-rose-400"><FaTrashAlt /></Button></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: Restaurants */}
            {activeTab === "restaurants" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">Manage Restaurants & Dining</h2>
                  <Dialog open={restDialogOpen} onOpenChange={setRestDialogOpen}>
                    <DialogTrigger>
                      <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-semibold gap-2">
                        <FaPlus className="h-3.5 w-3.5" /> Add Restaurant
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-card border-border">
                      <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Add New Restaurant</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleCreateRestaurant} className="space-y-4 pt-2">
                        <div>
                          <label className="text-xs font-semibold">Restaurant Name</label>
                          <Input placeholder="Jhao Bon Seafood Restaurant" value={newRest.name} onChange={(e) => setNewRest({ ...newRest, name: e.target.value })} required />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-semibold">Location</label>
                            <Input placeholder="Kolatoli Beach, Cox's Bazar" value={newRest.location} onChange={(e) => setNewRest({ ...newRest, location: e.target.value })} required />
                          </div>
                          <div>
                            <label className="text-xs font-semibold">Cuisine Type</label>
                            <Input placeholder="Seafood & Bangladeshi" value={newRest.cuisineType} onChange={(e) => setNewRest({ ...newRest, cuisineType: e.target.value })} required />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-semibold">Price Range Indicator</label>
                          <select value={newRest.priceRange} onChange={(e) => setNewRest({ ...newRest, priceRange: e.target.value })} className="w-full h-10 rounded-md border bg-background px-3 text-sm">
                            <option value="৳">৳ (Budget)</option>
                            <option value="৳৳">৳৳ (Moderate)</option>
                            <option value="৳৳ - ৳৳৳">৳৳ - ৳৳৳ (Mid to Premium)</option>
                            <option value="৳৳৳৳">৳৳৳৳ (Fine Dining)</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-semibold">Description</label>
                          <Textarea rows={3} value={newRest.description} onChange={(e) => setNewRest({ ...newRest, description: e.target.value })} required />
                        </div>
                        <ImageUploader label="Cover Image" folder="restaurants" value={newRest.coverImage} onChange={(url) => setNewRest({ ...newRest, coverImage: url })} onRemove={() => setNewRest({ ...newRest, coverImage: "" })} />
                        <div className="flex justify-end gap-2 pt-2">
                          <Button type="button" variant="outline" onClick={() => setRestDialogOpen(false)}>Cancel</Button>
                          <Button type="submit" disabled={submitting} className="bg-indigo-600 text-white">Save Restaurant</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="rounded-2xl border bg-card overflow-hidden">
                  {loadingRestaurants ? <div className="py-12 flex justify-center"><FaSpinner className="animate-spin text-indigo-500 h-6 w-6" /></div> : (
                    <Table>
                      <TableHeader><TableRow><TableHead>Cover</TableHead><TableHead>Restaurant Name</TableHead><TableHead>Cuisine</TableHead><TableHead>Location</TableHead><TableHead>Price Range</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {restaurants.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell><div className="relative h-12 w-16 rounded overflow-hidden bg-slate-900"><Image src={item.coverImage} alt="" fill className="object-cover" /></div></TableCell>
                            <TableCell className="font-bold">{item.name}</TableCell>
                            <TableCell className="text-xs"><span className="px-2 py-0.5 text-xs bg-amber-500/10 text-amber-400 rounded-full font-semibold">{item.cuisineType}</span></TableCell>
                            <TableCell className="text-xs">{item.location}</TableCell>
                            <TableCell className="font-bold text-emerald-400 text-xs">{item.priceRange}</TableCell>
                            <TableCell><Button variant="ghost" size="sm" onClick={() => handleDeleteItem("restaurants", item.id)} className="text-rose-400"><FaTrashAlt /></Button></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </div>
            )}

            {/* Tab 4: Transportation */}
            {activeTab === "transportation" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">Manage Transportation Schedules</h2>
                  <Dialog open={transportDialogOpen} onOpenChange={setTransportDialogOpen}>
                    <DialogTrigger>
                      <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-semibold gap-2">
                        <FaPlus className="h-3.5 w-3.5" /> Add Transport
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-card border-border">
                      <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Add New Transport Service</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleCreateTransportation} className="space-y-4 pt-2">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-semibold">Transport Type</label>
                            <select value={newTransport.type} onChange={(e) => setNewTransport({ ...newTransport, type: e.target.value })} className="w-full h-10 rounded-md border bg-background px-3 text-sm">
                              <option value="BUS">Bus</option>
                              <option value="TRAIN">Train</option>
                              <option value="FLIGHT">Flight</option>
                              <option value="CAR_RENTAL">Car Rental</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs font-semibold">Operator / Service Name</label>
                            <Input placeholder="Green Line Paribahan" value={newTransport.operatorName} onChange={(e) => setNewTransport({ ...newTransport, operatorName: e.target.value })} required />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-semibold">From City</label>
                            <Input placeholder="Dhaka" value={newTransport.routeFrom} onChange={(e) => setNewTransport({ ...newTransport, routeFrom: e.target.value })} required />
                          </div>
                          <div>
                            <label className="text-xs font-semibold">To Destination</label>
                            <Input placeholder="Cox's Bazar" value={newTransport.routeTo} onChange={(e) => setNewTransport({ ...newTransport, routeTo: e.target.value })} required />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="text-xs font-semibold">Cost (BDT)</label>
                            <Input type="number" value={newTransport.estimatedCost} onChange={(e) => setNewTransport({ ...newTransport, estimatedCost: Number(e.target.value) })} required />
                          </div>
                          <div>
                            <label className="text-xs font-semibold">Duration</label>
                            <Input placeholder="8h 30m" value={newTransport.duration} onChange={(e) => setNewTransport({ ...newTransport, duration: e.target.value })} required />
                          </div>
                          <div>
                            <label className="text-xs font-semibold">Schedule Time</label>
                            <Input placeholder="10:30 PM" value={newTransport.scheduleTime} onChange={(e) => setNewTransport({ ...newTransport, scheduleTime: e.target.value })} required />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                          <Button type="button" variant="outline" onClick={() => setTransportDialogOpen(false)}>Cancel</Button>
                          <Button type="submit" disabled={submitting} className="bg-indigo-600 text-white">Save Transport</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="rounded-2xl border bg-card overflow-hidden">
                  {loadingTransport ? <div className="py-12 flex justify-center"><FaSpinner className="animate-spin text-indigo-500 h-6 w-6" /></div> : (
                    <Table>
                      <TableHeader><TableRow><TableHead>Type</TableHead><TableHead>Operator</TableHead><TableHead>Route</TableHead><TableHead>Schedule</TableHead><TableHead>Cost</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {transportations.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell><span className="px-2.5 py-0.5 text-xs bg-sky-500/10 text-sky-400 rounded-full font-bold uppercase">{item.type}</span></TableCell>
                            <TableCell className="font-bold">{item.operatorName}</TableCell>
                            <TableCell className="text-xs">{item.routeFrom} → {item.routeTo}</TableCell>
                            <TableCell className="text-xs font-mono">{item.scheduleTime} ({item.duration})</TableCell>
                            <TableCell className="font-bold text-emerald-400">৳{item.estimatedCost}</TableCell>
                            <TableCell><Button variant="ghost" size="sm" onClick={() => handleDeleteItem("transportation", item.id)} className="text-rose-400"><FaTrashAlt /></Button></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </div>
            )}

            {/* Tab 5: Reservations */}
            {activeTab === "reservations" && (
              <div className="space-y-4">
                <div className="border-b border-border pb-2">
                  <h2 className="text-lg font-bold">Customer Reservations & Booking Requests</h2>
                  <p className="text-xs text-muted-foreground">Approve or cancel customer bookings across destinations & hotels</p>
                </div>

                <div className="rounded-2xl border bg-card overflow-hidden">
                  {loadingReservations ? <div className="py-12 flex justify-center"><FaSpinner className="animate-spin text-indigo-500 h-6 w-6" /></div> : (
                    <Table>
                      <TableHeader><TableRow><TableHead>Customer</TableHead><TableHead>Item / Target</TableHead><TableHead>Cost</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {reservations.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <p className="font-bold">{item.user?.name || "Customer"}</p>
                              <p className="text-[10px] text-muted-foreground">{item.user?.email}</p>
                            </TableCell>
                            <TableCell className="text-xs">{item.destination?.title || item.hotel?.name || item.restaurant?.name || "Booking"}</TableCell>
                            <TableCell className="font-bold text-emerald-400">৳{item.totalCost}</TableCell>
                            <TableCell>
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                item.status === "CONFIRMED" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" :
                                item.status === "CANCELLED" ? "bg-rose-500/15 text-rose-400 border border-rose-500/30" :
                                "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                              }`}>{item.status}</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                {item.status !== "CONFIRMED" && (
                                  <Button size="sm" variant="ghost" onClick={() => handleUpdateReservationStatus(item.id, "CONFIRMED")} className="text-emerald-400 hover:bg-emerald-500/10 h-8 px-2 text-xs font-semibold gap-1">
                                    <FaCheckCircle /> Approve
                                  </Button>
                                )}
                                {item.status !== "CANCELLED" && (
                                  <Button size="sm" variant="ghost" onClick={() => handleUpdateReservationStatus(item.id, "CANCELLED")} className="text-rose-400 hover:bg-rose-500/10 h-8 px-2 text-xs font-semibold gap-1">
                                    <FaTimesCircle /> Cancel
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </div>
            )}
    </div>
  );
}
