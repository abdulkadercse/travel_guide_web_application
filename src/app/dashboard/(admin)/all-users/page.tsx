"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ProtectedRoute, Container } from "@/components/shared";
import { Avatar } from "@/components/ui/avatar";
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
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout, selectCurrentUser } from "@/redux/features/auth/authSlice";
import {
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "@/redux/features/user/userApi";
import { useTheme } from "next-themes";
import {
  FaUsers,
  FaSearch,
  FaTrashAlt,
  FaBan,
  FaCheckCircle,
  FaShieldAlt,
  FaUserCog,
  FaSpinner,
  FaArrowLeft,
  FaSun,
  FaMoon,
  FaSignOutAlt,
  FaUserShield,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

export default function AllUsersPage() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const {
    data: usersResponse,
    isLoading: loading,
    refetch: refetchUsers,
  } = useGetAllUsersQuery(undefined);
  const [updateUser] = useUpdateUserMutation();
  const [deleteUserMutation] = useDeleteUserMutation();

  const users: any[] = usersResponse?.data ?? [];

  useEffect(() => {
    setMounted(true);
  }, []);

  const errorMessage = (err: unknown, fallback: string) =>
    (err as { data?: { message?: string } })?.data?.message || fallback;

  const handleToggleBlockUser = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "BLOCKED" ? "ACTIVE" : "BLOCKED";
    const actionText = newStatus === "BLOCKED" ? "block" : "activate";

    if (!confirm(`Are you sure you want to ${actionText} this user?`)) return;

    const toastId = toast.loading(`Updating user status to ${newStatus}...`);

    try {
      await updateUser({ id: userId, status: newStatus }).unwrap();
      toast.success(`User ${newStatus === "BLOCKED" ? "blocked" : "activated"} successfully`, {
        id: toastId,
      });
    } catch (err: unknown) {
      toast.error(errorMessage(err, "Failed to update user status"), { id: toastId });
    }
  };

  const handleChangeRole = async (userId: string, newRole: string) => {
    const toastId = toast.loading(`Updating role to ${newRole}...`);
    try {
      await updateUser({ id: userId, role: newRole }).unwrap();
      toast.success(`User role updated to ${newRole}`, { id: toastId });
    } catch (err: unknown) {
      toast.error(errorMessage(err, "Role change failed"), { id: toastId });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to permanently delete this user?")) return;

    const toastId = toast.loading("Deleting user...");
    try {
      await deleteUserMutation(userId).unwrap();
      toast.success("User deleted permanently", { id: toastId });
    } catch (err: unknown) {
      toast.error(errorMessage(err, "User deletion failed"), { id: toastId });
    }
  };

  // Filtered users calculation
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone?.includes(searchQuery);

    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchesStatus = statusFilter === "ALL" || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const activeCount = users.filter((u) => u.status === "ACTIVE").length;
  const blockedCount = users.filter((u) => u.status === "BLOCKED").length;
  const adminCount = users.filter((u) => u.role === "ADMIN" || u.role === "SUPER_ADMIN").length;

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
      <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 font-sans selection:bg-indigo-500 selection:text-white">
        {/* Header Navigation */}
        <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-background/80 border-b border-border">
          <Container>
            <div className="h-16 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" asChild className="rounded-full">
                  <Link href="/dashboard/admin">
                    <FaArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Dashboard
                  </Link>
                </Button>
                <div className="h-4 w-px bg-border" />
                <span className="text-lg font-extrabold tracking-tight flex items-center gap-2">
                  <FaUsers className="text-indigo-500 h-5 w-5" /> All Users Management
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="rounded-full h-9 w-9"
                >
                  {mounted && theme === "dark" ? (
                    <FaSun className="h-4 w-4 text-amber-400" />
                  ) : (
                    <FaMoon className="h-4 w-4 text-slate-700" />
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    dispatch(logout());
                    toast.success("Logged out successfully");
                  }}
                  className="rounded-full text-rose-400 hover:text-rose-300 border-border"
                >
                  <FaSignOutAlt className="mr-1 h-3.5 w-3.5" /> Sign Out
                </Button>
              </div>
            </div>
          </Container>
        </header>

        {/* Body Container */}
        <main className="flex-1 py-8">
          <Container className="space-y-8">
            {/* Top Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Total Users
                  </p>
                  <h3 className="text-2xl font-black text-foreground mt-1">{users.length}</h3>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
                  <FaUsers className="h-6 w-6" />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Active Accounts
                  </p>
                  <h3 className="text-2xl font-black text-emerald-400 mt-1">{activeCount}</h3>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <FaCheckCircle className="h-6 w-6" />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Blocked Users
                  </p>
                  <h3 className="text-2xl font-black text-rose-400 mt-1">{blockedCount}</h3>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <FaBan className="h-6 w-6" />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Admins & Staff
                  </p>
                  <h3 className="text-2xl font-black text-amber-400 mt-1">{adminCount}</h3>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <FaUserShield className="h-6 w-6" />
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 rounded-2xl bg-card border border-border shadow-sm space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 rounded-xl"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="h-10 rounded-xl bg-background border border-input px-3 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="ALL">All Roles</option>
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-10 rounded-xl bg-background border border-input px-3 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="ALL">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="BLOCKED">Blocked</option>
                  <option value="INACTIVE">Inactive</option>
                </select>

                <Button variant="outline" size="sm" onClick={() => refetchUsers()} className="rounded-xl h-10">
                  Refresh
                </Button>
              </div>
            </div>

            {/* Users Data Table */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
              {loading ? (
                <div className="py-16 flex justify-center text-muted-foreground">
                  <FaSpinner className="h-8 w-8 animate-spin text-indigo-500" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="py-16 text-center text-muted-foreground text-sm">
                  No users found matching your search or filters.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User Details</TableHead>
                      <TableHead>Contact Info</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar src={u.avatar} fallback={u.name} className="h-10 w-10 shrink-0" />
                            <div>
                              <p className="font-bold text-foreground leading-snug">{u.name}</p>
                              <p className="text-[10px] text-muted-foreground">
                                Joined {new Date(u.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="space-y-0.5 text-xs text-muted-foreground">
                            <p className="flex items-center gap-1">
                              <FaEnvelope className="h-3 w-3 text-indigo-500 shrink-0" />
                              <span>{u.email}</span>
                            </p>
                            {u.phone && (
                              <p className="flex items-center gap-1">
                                <FaPhone className="h-3 w-3 text-emerald-500 shrink-0" />
                                <span>{u.phone}</span>
                              </p>
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          <select
                            value={u.role}
                            onChange={(e) => handleChangeRole(u.id, e.target.value)}
                            disabled={u.id === currentUser?.id}
                            className="h-8 rounded-lg bg-background border border-input px-2 text-xs font-bold uppercase tracking-wider text-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                          >
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                            <option value="SUPER_ADMIN">SUPER ADMIN</option>
                          </select>
                        </TableCell>

                        <TableCell>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                              u.status === "ACTIVE"
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : u.status === "BLOCKED"
                                ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                                : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                            }`}
                          >
                            {u.status === "BLOCKED" ? (
                              <FaBan className="h-2.5 w-2.5" />
                            ) : (
                              <FaCheckCircle className="h-2.5 w-2.5" />
                            )}
                            {u.status}
                          </span>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            {/* Block / Unblock Toggle Button */}
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={u.id === currentUser?.id}
                              onClick={() => handleToggleBlockUser(u.id, u.status)}
                              className={`h-8 px-2.5 text-xs font-semibold rounded-lg gap-1 ${
                                u.status === "BLOCKED"
                                  ? "text-emerald-400 hover:bg-emerald-500/10"
                                  : "text-amber-400 hover:bg-amber-500/10"
                              }`}
                            >
                              {u.status === "BLOCKED" ? (
                                <>
                                  <FaCheckCircle className="h-3 w-3" /> Unblock
                                </>
                              ) : (
                                <>
                                  <FaBan className="h-3 w-3" /> Block
                                </>
                              )}
                            </Button>

                            {/* Delete User Button */}
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={u.id === currentUser?.id}
                              onClick={() => handleDeleteUser(u.id)}
                              className="h-8 w-8 p-0 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg"
                              title="Delete user"
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
          </Container>
        </main>
      </div>
    </ProtectedRoute>
  );
}
