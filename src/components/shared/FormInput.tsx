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
            className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
          >
            {label}
          </Label>
        )}
        <div className="relative group flex items-center">
          {icon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
              {icon}
            </div>
          )}
          <Input
            id={inputId}
            ref={ref}
            className={cn(
              "w-full bg-slate-950/60 text-slate-100 placeholder:text-slate-500 text-sm rounded-xl py-2.5 border transition-all duration-200 focus:outline-none",
              icon ? "pl-10" : "pl-3.5",
              rightElement ? "pr-10" : "pr-3.5",
              error
                ? "border-rose-500/80 focus-visible:ring-rose-500/30 border-rose-500"
                : "border-slate-800 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500 hover:border-slate-700",
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3.5 flex items-center text-slate-500">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
            <FaExclamationCircle className="h-3.5 w-3.5 inline shrink-0" />
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-xs text-slate-400 mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
