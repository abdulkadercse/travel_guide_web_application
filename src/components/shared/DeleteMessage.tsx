"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaExclamationTriangle, FaTrashAlt, FaSpinner } from "react-icons/fa";

export interface DeleteMessageProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
  title?: string;
  itemName?: string;
  message?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  children?: React.ReactNode;
}

export const DeleteMessage: React.FC<DeleteMessageProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title = "Delete Item",
  itemName,
  message,
  description = "This action is permanent and cannot be undone.",
  confirmText = "Confirm Delete",
  cancelText = "Cancel",
  children,
}) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isLoading) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader className="gap-3 sm:text-left">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shrink-0">
              <FaExclamationTriangle className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-semibold text-foreground">
                {title}
              </DialogTitle>
              {description && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {description}
                </p>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 py-2 text-xs">
          {message ? (
            <p className="text-muted-foreground leading-relaxed">{message}</p>
          ) : itemName ? (
            <p className="text-muted-foreground leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">{itemName}</span>?
            </p>
          ) : (
            <p className="text-muted-foreground leading-relaxed">
              Are you sure you want to delete this record?
            </p>
          )}

          {children}
        </div>

        <DialogFooter className="gap-2 sm:gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl text-xs cursor-pointer"
          >
            {cancelText}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold gap-1.5 cursor-pointer shadow-xs"
          >
            {isLoading ? (
              <>
                <FaSpinner className="h-3.5 w-3.5 animate-spin" /> Deleting...
              </>
            ) : (
              <>
                <FaTrashAlt className="h-3.5 w-3.5" /> {confirmText}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMessage;
