"use client";

import React from "react";
import {
  FaMagnifyingGlass,
  FaXmark,
} from "react-icons/fa6";

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
    <div className="space-y-3.5 rounded-2xl border border-border bg-card p-4 shadow-xs">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search saved favorites by name, location, district..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 w-full rounded-xl border border-border bg-secondary/50 pl-9 pr-4 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <FaXmark className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Sort and District Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* District Select */}
          {districts.length > 0 && (
            <div className="flex items-center gap-1.5">
              <select
                value={selectedDistrict}
                onChange={(e) => onDistrictChange(e.target.value)}
                className="h-10 rounded-xl border border-border bg-secondary/50 px-3 text-xs sm:text-sm font-medium text-foreground focus:border-primary focus:outline-none transition-colors cursor-pointer"
              >
                <option value="">All Districts</option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="hidden sm:inline text-xs text-muted-foreground font-medium">
              Sort by:
            </span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="h-10 rounded-xl border border-border bg-secondary/50 px-3 text-xs sm:text-sm font-medium text-foreground focus:border-primary focus:outline-none transition-colors cursor-pointer"
              >
                <option value="recent">Recently Added</option>
                <option value="name_asc">Name (A-Z)</option>
                <option value="name_desc">Name (Z-A)</option>
                <option value="rating_high">Highest Rated</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-border px-3 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <FaXmark className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills (if categories available) */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-0.5 scrollbar-none">
          <button
            type="button"
            onClick={() => onCategoryChange("")}
            className={`shrink-0 rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
              selectedCategory === ""
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "bg-secondary/70 text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onCategoryChange(c)}
              className={`shrink-0 rounded-lg px-3 py-1 text-xs font-semibold transition-colors capitalize ${
                selectedCategory === c
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "bg-secondary/70 text-muted-foreground hover:bg-secondary hover:text-foreground"
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
