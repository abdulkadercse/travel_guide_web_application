"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AvatarUploader } from "@/components/shared";
import { useUpdateUserMutation } from "@/redux/features/user/userApi";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/auth/authSlice";
import { FaUserPen, FaSpinner } from "react-icons/fa6";

interface UserProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    address?: string | null;
    avatar?: string | null;
    role?: string;
    status?: string;
  };
}

export function UserProfileEditModal({
  isOpen,
  onClose,
  user,
}: UserProfileEditModalProps) {
  const dispatch = useAppDispatch();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const [formData, setFormData] = useState({
    name: user.name || "",
    phone: user.phone || "",
    address: user.address || "",
    avatar: user.avatar || "",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
        avatar: user.avatar || "",
      });
    }
  }, [isOpen, user]);

  const handleAvatarSuccess = (uploadedUrl: string) => {
    setFormData((prev) => ({ ...prev, avatar: uploadedUrl }));
    toast.success("Avatar image uploaded! Save changes to apply.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    const toastId = toast.loading("Updating your profile...");

    try {
      const payload: Record<string, string> = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
      };

      if (formData.avatar) {
        payload.avatar = formData.avatar;
      }

      const res = await updateUser({
        id: user.id,
        ...payload,
      }).unwrap();

      // Update local Redux store
      dispatch(
        setUser({
          user: {
            id: user.id,
            name: formData.name.trim(),
            email: user.email,
            role: user.role || "USER",
            status: user.status || "ACTIVE",
            avatar: formData.avatar || user.avatar || null,
          },
        })
      );

      toast.success("Profile updated successfully!", { id: toastId });
      onClose();
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to update profile";
      toast.error(msg, { id: toastId });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg rounded-3xl p-6 bg-card border-border shadow-2xl">
        <DialogHeader className="border-b border-border/80 pb-4">
          <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
            <FaUserPen className="h-4 w-4 text-primary" />
            <span>Edit Profile</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          {/* Avatar Uploader Section */}
          <div className="flex flex-col items-center justify-center space-y-2 p-3 rounded-2xl bg-secondary/30 border border-border/60">
            <span className="text-xs font-semibold text-muted-foreground">
              Profile Photo
            </span>
            <AvatarUploader
              src={formData.avatar || user.avatar}
              name={user.name}
              size="lg"
              onUploadSuccess={handleAvatarSuccess}
            />
            <span className="text-[11px] text-muted-foreground text-center">
              Click the camera icon to upload a photo (Max 5MB)
            </span>
          </div>

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Full Name <span className="text-destructive">*</span>
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g. Tanvir Ahmed"
              required
              className="rounded-xl h-10 text-xs sm:text-sm"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Phone Number
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="e.g. +880 1700-000000"
              className="rounded-xl h-10 text-xs sm:text-sm"
            />
          </div>

          {/* Residential Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Address / City
            </label>
            <Textarea
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="e.g. Dhaka, Bangladesh"
              rows={2}
              className="rounded-xl text-xs sm:text-sm resize-none"
            />
          </div>

          {/* Dialog Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/80">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isUpdating}
              className="rounded-xl text-xs font-semibold h-10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUpdating}
              className="rounded-xl text-xs font-semibold h-10 px-5 gap-2"
            >
              {isUpdating && <FaSpinner className="h-3.5 w-3.5 animate-spin" />}
              <span>{isUpdating ? "Saving..." : "Save Changes"}</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default UserProfileEditModal;
