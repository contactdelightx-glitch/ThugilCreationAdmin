import { Search, Filter, X } from "lucide-react";
import { Design } from "./DesignList";

interface FilterState {
  searchQuery: string;
  selectedStyle: string;
  selectedJacquard: string;
  selectedLabel: string;
}

interface DesignFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  showFilters: boolean;
  onShowFiltersChange: (show: boolean) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  designs: Design[];
}

export default function DesignFilters({
  filters,
  onFilterChange,
  showFilters,
  onShowFiltersChange,
  onClearFilters,
  hasActiveFilters,
  designs,
}: DesignFiltersProps) {
  const getUniqueValues = (field: keyof Design) => {
    const values = designs.map((design) => design[field]).filter(Boolean);
    return [...new Set(values)] as string[];
  };

  const getSareeStyleDisplay = (style: string | null | undefined) => {
    if (!style) return "";
    return style.charAt(0).toUpperCase() + style.slice(1);
  };

  const handleSearchChange = (value: string) => {
    onFilterChange({ searchQuery: value });
  };

  const handleStyleChange = (value: string) => {
    onFilterChange({ selectedStyle: value });
  };

  return (
    <div className="border-b border-gray-200 bg-white px-3 py-2 sm:px-4 lg:px-6">
      <div className="flex flex-col gap-3">
        {/* Search + Filter Buttons Row */}
        <div className="flex flex-row flex-wrap items-center gap-2 sm:gap-3">
          {/* Search (not full width now) */}
          <div className="relative w-48 sm:w-60 md:w-72">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search By Design Name Only"
              value={filters.searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full border border-gray-300 py-2 pr-3 pl-9 text-xs focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none sm:text-sm"
            />
          </div>

          {/* Filter + Clear Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onShowFiltersChange(!showFilters)}
              className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs hover:bg-gray-50 sm:text-sm"
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
                className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2 py-2 text-xs hover:bg-gray-50 sm:text-sm"
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="flex flex-col gap-3 border-t border-gray-200 pt-3 sm:flex-row sm:items-center sm:gap-4 sm:border-0 sm:pt-0 lg:flex-nowrap">
            <div className="w-48 sm:w-60 md:w-72">
              <select
                value={filters.selectedStyle}
                onChange={(e) => handleStyleChange(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none sm:text-sm"
              >
                <option value="">All Styles</option>
                {getUniqueValues("saree_style").map((style) => (
                  <option key={style} value={style}>
                    {getSareeStyleDisplay(style)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
