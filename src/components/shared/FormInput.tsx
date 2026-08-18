"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FaExclamationCircle } from "react-icons/fa";

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  containerClassName?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      rightElement,
      className,
      containerClassName,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || React.useId();

    return (
      <div className={cn("space-y-1.5 w-full", containerClassName)}>
        {label && (
          <Label
            htmlFor={inputId}
            className="block text-xs font-semibold text-muted-foreground"
          >
            {label}
          </Label>
        )}
        <div className="relative group flex items-center">
          {icon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              {icon}
            </div>
          )}
          <Input
            id={inputId}
            ref={ref}
            className={cn(
              "w-full bg-background text-foreground placeholder:text-muted-foreground text-sm rounded-xl py-2.5 border transition-all duration-200 focus:outline-none",
              icon ? "pl-10" : "pl-3.5",
              rightElement ? "pr-10" : "pr-3.5",
              error
                ? "border-destructive focus-visible:ring-destructive/30"
                : "border-input focus-visible:ring-primary/30 focus-visible:border-primary hover:border-primary/40",
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3.5 flex items-center text-muted-foreground">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-destructive mt-1 flex items-center gap-1">
            <FaExclamationCircle className="h-3.5 w-3.5 inline shrink-0" />
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-xs text-muted-foreground mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
