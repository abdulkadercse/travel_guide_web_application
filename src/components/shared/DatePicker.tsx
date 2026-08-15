"use client";

import * as React from "react";
import { format, parseISO } from "date-fns";
import { FaCalendarAlt } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface DatePickerProps {
  date?: Date | string;
  onSelect?: (date: Date | undefined) => void;
  value?: string | Date;
  onChange?: (dateString: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  label?: string;
  error?: string;
  required?: boolean;
}

export function DatePicker({
  date,
  onSelect,
  value,
  onChange,
  placeholder = "Pick a date",
  className,
  disabled = false,
  minDate,
  maxDate,
  label,
  error,
  required,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Normalize selected date from either `date` or `value` prop
  const activeDateValue = date ?? value;
  const selectedDate = React.useMemo(() => {
    if (!activeDateValue) return undefined;
    if (activeDateValue instanceof Date) return activeDateValue;
    if (typeof activeDateValue === "string" && activeDateValue.trim() !== "") {
      try {
        const parsed = parseISO(activeDateValue);
        return isNaN(parsed.getTime()) ? new Date(activeDateValue) : parsed;
      } catch {
        return undefined;
      }
    }
    return undefined;
  }, [activeDateValue]);

  const handleSelectDate = (newDate: Date | undefined) => {
    if (onSelect) {
      onSelect(newDate);
    }
    if (onChange) {
      onChange(newDate ? format(newDate, "yyyy-MM-dd") : "");
    }
    setOpen(false);
  };

  return (
    <div className="w-full space-y-1.5 font-sans">
      {label && (
        <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
          <FaCalendarAlt className="h-3 w-3 text-indigo-500" />
          {label}
          {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-medium h-11 px-3.5 rounded-2xl border border-input bg-card/60 hover:bg-muted/40 transition-all text-sm focus-visible:ring-2 focus-visible:ring-indigo-500 shadow-sm",
              !selectedDate && "text-muted-foreground font-normal",
              error && "border-rose-500 focus-visible:ring-rose-500",
              className
            )}
          >
            <FaCalendarAlt className="mr-2.5 h-4 w-4 text-indigo-500 shrink-0" />
            {selectedDate ? (
              <span className="text-foreground font-semibold">
                {format(selectedDate, "PPP")}
              </span>
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 bg-card border-border shadow-2xl rounded-2xl z-[100]"
          align="start"
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelectDate}
            disabled={(d) => {
              if (minDate && d < minDate) return true;
              if (maxDate && d > maxDate) return true;
              return false;
            }}
          />
        </PopoverContent>
      </Popover>

      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  );
}

export default DatePicker;
