"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FaExclamationCircle } from "react-icons/fa";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface FormSelectProps {
  label?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  containerClassName?: string;
  className?: string;
  id?: string;
}

export function FormSelect({
  label,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select an option",
  options,
  error,
  helperText,
  icon,
  disabled,
  containerClassName,
  className,
  id,
}: FormSelectProps) {
  const selectId = id || React.useId();

  return (
    <div className={cn("space-y-1.5 w-full", containerClassName)}>
      {label && (
        <Label
          htmlFor={selectId}
          className="block text-xs font-semibold text-muted-foreground"
        >
          {label}
        </Label>
      )}
      <div className="relative group flex items-center">
        {icon && (
          <div className="absolute left-3.5 z-10 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
            {icon}
          </div>
        )}
        <Select
          value={value}
          defaultValue={defaultValue}
          onValueChange={(val: string | null) => {
            if (val !== null && onValueChange) {
              onValueChange(val);
            }
          }}
          disabled={disabled}
        >
          <SelectTrigger
            id={selectId}
            className={cn(
              "w-full bg-background text-foreground text-sm rounded-xl py-2.5 border transition-all duration-200 focus:outline-none",
              icon ? "pl-10" : "pl-3.5",
              error
                ? "border-destructive focus:ring-destructive/30 text-destructive"
                : "border-input focus:ring-primary/30 focus:border-primary hover:border-primary/40",
              className
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border text-popover-foreground rounded-xl shadow-xl">
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="hover:bg-accent focus:bg-accent focus:text-primary cursor-pointer rounded-lg text-sm"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
