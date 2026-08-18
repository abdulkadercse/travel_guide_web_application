"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("relative p-3 font-sans", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        month_caption: "flex justify-center pt-1 items-center px-1 mb-2",
        caption_label: "text-sm font-bold text-foreground",
        nav: "absolute inset-x-3 top-3 flex items-center justify-between",
        button_previous:
          "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 rounded-lg hover:bg-muted inline-flex items-center justify-center transition-colors text-foreground",
        button_next:
          "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 rounded-lg hover:bg-muted inline-flex items-center justify-center transition-colors text-foreground",
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex",
        weekday:
          "text-muted-foreground rounded-md w-9 font-semibold text-[0.8rem] text-center",
        week: "flex w-full mt-2",
        day: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day_button: cn(
          "h-9 w-9 p-0 font-normal rounded-xl hover:bg-muted inline-flex items-center justify-center transition-colors text-sm text-foreground"
        ),
        range_end: "day-range-end",
        selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground font-bold shadow-sm rounded-xl",
        today: "bg-muted rounded-xl font-bold text-foreground border border-primary/30",
        outside:
          "day-outside text-muted-foreground/40 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        disabled: "text-muted-foreground/30 opacity-40 cursor-not-allowed",
        range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <FaChevronLeft className="h-3 w-3" />
          ) : (
            <FaChevronRight className="h-3 w-3" />
          ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
