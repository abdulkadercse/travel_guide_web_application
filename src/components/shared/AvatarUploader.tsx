"use client";

import React, { useState, useRef } from "react";
import toast from "react-hot-toast";
import { FaCamera, FaSpinner } from "react-icons/fa";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useUploadImageMutation } from "@/redux/features/upload/uploadApi";

interface AvatarUploaderProps {
  src?: string | null;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  onUploadSuccess: (url: string) => void;
  disabled?: boolean;
}

export function AvatarUploader({
  src,
  name = "User",
  size = "lg",
  className,
  onUploadSuccess,
  disabled = false,
}: AvatarUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string | null | undefined>(src);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadImage] = useUploadImageMutation();

  // Dynamic avatar dimension sizing
  const sizeClasses = {
    sm: "h-12 w-12 text-xs",
    md: "h-16 w-16 text-sm",
    lg: "h-24 w-24 text-base",
    xl: "h-32 w-32 text-lg",
  }[size];

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Avatar image size must be less than 5MB");
      return;
    }

    // Instant local preview for immediate visual feedback
    const tempUrl = URL.createObjectURL(file);
    setAvatarSrc(tempUrl);
    setLoading(true);

    const toastId = toast.loading("Uploading avatar...");

    try {
      const result = await uploadImage({ file, folder: "user_avatars" }).unwrap();
      const url = result.data.url;

      setAvatarSrc(url);
      onUploadSuccess(url);
      toast.success("Avatar updated successfully!", { id: toastId });
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message || "Avatar upload failed";
      toast.error(message, { id: toastId });
      setAvatarSrc(src); // Revert to original src on error
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="relative inline-block group">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
        disabled={disabled || loading}
      />

      {/* Avatar Container with Hover Edit Overlay */}
      <div
        onClick={() => !disabled && !loading && fileInputRef.current?.click()}
        className={cn(
          "relative rounded-full cursor-pointer overflow-hidden border-2 border-border transition-colors hover:border-primary/40",
          sizeClasses,
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        title="Click to change profile picture"
      >
        <Avatar src={avatarSrc} fallback={name} className="h-full w-full border-none shadow-none" />

        {/* Loading Spinner Overlay */}
        {loading ? (
          <div className="absolute inset-0 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center text-white">
            <FaSpinner className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : (
          /* Camera Hover Overlay */
          <div className="absolute inset-0 bg-stone-950/50 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
            <FaCamera className="h-5 w-5 text-white drop-shadow-md" />
            <span className="text-xs font-medium mt-0.5">Edit</span>
          </div>
        )}
      </div>

      {/* Camera Badge Icon on bottom-right corner */}
      <button
        type="button"
        onClick={() => !disabled && !loading && fileInputRef.current?.click()}
        disabled={disabled || loading}
        className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-primary border-2 border-background text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary-hover transition-colors"
      >
        <FaCamera className="h-3 w-3" />
      </button>
    </div>
  );
}

export default AvatarUploader;
