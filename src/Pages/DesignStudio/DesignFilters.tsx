import { Filter, X } from "lucide-react";
import { Design } from "./DesignList";

interface FilterState {
  searchQuery: string;
  selectedStyle: string;
}

interface DesignFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  showFilters: boolean;
  onShowFiltersChange: (show: boolean) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  designs: Design[];
  availableSareeStyles: string[];
  loadingStyles: boolean;
}

export default function DesignFilters({
  filters,
  onFilterChange,
  showFilters,
  onShowFiltersChange,
  onClearFilters,
  hasActiveFilters,
  availableSareeStyles,
  loadingStyles,
}: DesignFiltersProps) {
  return (
    <div className="border-b border-gray-200 bg-white px-3 py-3 sm:px-4 lg:px-6">
      <div className="flex flex-col gap-3">
        {/* Search and Filter Toggle */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search designs by name..."
                value={filters.searchQuery}
                onChange={(e) =>
                  onFilterChange({ searchQuery: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-500 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none"
              />
              {filters.searchQuery && (
                <button
                  onClick={() => onFilterChange({ searchQuery: "" })}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => onShowFiltersChange(!showFilters)}
              className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                hasActiveFilters
                  ? "border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-primary)] text-xs text-white">
                  !
                </span>
              )}
            </button>

            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 gap-3 border-t border-gray-200 pt-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* Saree Style Filter - Uses API data */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Saree Style
              </label>
              <select
                value={filters.selectedStyle}
                onChange={(e) =>
                  onFilterChange({ selectedStyle: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none"
              >
                <option value="">All Styles</option>
                {loadingStyles ? (
                  <option disabled>Loading styles...</option>
                ) : (
                  availableSareeStyles.map((style) => (
                    <option key={style} value={style}>
                      {style}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Active Filters Summary */}
            <div className="flex items-end">
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-1">
                  <span className="text-xs font-medium text-gray-600">Active filters:</span>
                  {filters.selectedStyle && (
                    <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
                      Style: {filters.selectedStyle}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}