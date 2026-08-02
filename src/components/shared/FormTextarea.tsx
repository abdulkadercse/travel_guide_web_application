"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FaExclamationCircle } from "react-icons/fa";

export interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  maxLength?: number;
  showCharCount?: boolean;
  containerClassName?: string;
}

export const FormTextarea = React.forwardRef<
  HTMLTextAreaElement,
  FormTextareaProps
>(
  (
    {
      label,
      error,
      helperText,
      maxLength,
      showCharCount = false,
      containerClassName,
      className,
      id,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const textareaId = id || React.useId();
    const charCount = typeof value === "string" ? value.length : 0;

    return (
      <div className={cn("space-y-1.5 w-full", containerClassName)}>
        <div className="flex items-center justify-between">
          {label && (
            <Label
              htmlFor={textareaId}
              className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
            >
              {label}
            </Label>
          )}
          {showCharCount && maxLength && (
            <span className="text-xs text-slate-500 font-mono">
              {charCount}/{maxLength}
            </span>
          )}
        </div>
        <Textarea
          id={textareaId}
          ref={ref}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          className={cn(
            "w-full bg-slate-950/60 text-slate-100 placeholder:text-slate-500 text-sm rounded-xl p-3.5 border transition-all duration-200 focus:outline-none min-h-[100px]",
            error
              ? "border-rose-500/80 focus-visible:ring-rose-500/30 border-rose-500"
              : "border-slate-800 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500 hover:border-slate-700",
            className
          )}
          {...props}
        />
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

FormTextarea.displayName = "FormTextarea";
