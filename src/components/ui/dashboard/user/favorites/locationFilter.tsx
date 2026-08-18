"use client";

import React from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

export interface LocationFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedDistrict: string;
  onDistrictChange: (district: string) => void;
  districts: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  sortBy: string;
  onSortChange: (sort: string) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

/** One shared shape for the two selects, so they line up with the search field. */
const selectClass =
  "h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40";

export function LocationFilter({
  searchQuery,
  onSearchChange,
  selectedDistrict,
  onDistrictChange,
  districts,
  selectedCategory,
  onCategoryChange,
  categories,
  sortBy,
  onSortChange,
  onReset,
  hasActiveFilters,
}: LocationFilterProps) {
  return (
    <div className="surface space-y-4 p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div className="relative w-full lg:max-w-sm">
          <FaSearch className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search by name, location or district"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search saved favorites"
            className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-9 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <FaTimes className="h-3 w-3" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {districts.length > 0 && (
            <select
              value={selectedDistrict}
              onChange={(e) => onDistrictChange(e.target.value)}
              aria-label="Filter by district"
              className={selectClass}
            >
              <option value="">All districts</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          )}

          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort favorites"
            className={selectClass}
          >
            <option value="recent">Recently saved</option>
            <option value="name_asc">Name (A–Z)</option>
            <option value="name_desc">Name (Z–A)</option>
            <option value="rating_high">Highest rated</option>
            <option value="price_low">Price: low to high</option>
            <option value="price_high">Price: high to low</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-border px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <FaTimes className="h-3 w-3" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Category pills */}
      {categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
          <button
            type="button"
            onClick={() => onCategoryChange("")}
            aria-pressed={selectedCategory === ""}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              selectedCategory === ""
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            All categories
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onCategoryChange(c)}
              aria-pressed={selectedCategory === c}
              className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors ${
                selectedCategory === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LocationFilter;
