"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { FaCloudUploadAlt, FaTrashAlt, FaSpinner, FaImage } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useUploadImageMutation } from "@/redux/features/upload/uploadApi";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  label?: string;
  folder?: string;
  disabled?: boolean;
}

export function ImageUploader({
  value,
  onChange,
  onRemove,
  label = "Upload Image",
  folder = "travla_uploads",
  disabled = false,
}: ImageUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadImage] = useUploadImageMutation();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    // Set local preview immediately
    const localPreviewUrl = URL.createObjectURL(file);
    setPreview(localPreviewUrl);

    setLoading(true);
    const toastId = toast.loading("Uploading image to Cloudinary...");

    try {
      const result = await uploadImage({ file, folder }).unwrap();
      const url = result.data.url;

      setPreview(url);
      onChange(url);
      toast.success("Image uploaded successfully!", { id: toastId });
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message || "Image upload failed";
      toast.error(message, { id: toastId });
      setPreview(value);
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    setPreview(undefined);
    onChange("");
    if (onRemove) onRemove();
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-foreground">
          {label}
        </label>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={disabled || loading}
      />

      {preview ? (
        <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-border shadow-md bg-card group">
          <Image
            src={preview}
            alt="Uploaded Preview"
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || loading}
              className="rounded-full bg-slate-900/80 text-white hover:bg-slate-900"
            >
              Change
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              disabled={disabled || loading}
              className="rounded-full"
            >
              <FaTrashAlt className="h-3.5 w-3.5 mr-1" /> Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !disabled && !loading && fileInputRef.current?.click()}
          className={`relative w-full h-44 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-6 text-center cursor-pointer ${
            disabled || loading
              ? "opacity-50 cursor-not-allowed border-muted"
              : "border-border hover:border-indigo-500 hover:bg-indigo-500/5"
          }`}
        >
          {loading ? (
            <div className="flex flex-col items-center gap-2 text-indigo-500">
              <FaSpinner className="h-8 w-8 animate-spin" />
              <span className="text-xs font-semibold">Uploading to Cloudinary...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
                <FaCloudUploadAlt className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  Click to upload image
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  SVG, PNG, JPG, WEBP (Max 5MB)
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
