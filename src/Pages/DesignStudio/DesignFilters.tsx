import { Search, Filter, X } from "lucide-react";
import { Design } from "./DesignList";

interface FilterState {
  searchQuery: string;
  selectedStyle: string;
  selectedJacquard: string;
  selectedLabel: string;
  epiFilter: string;
  ppiFilter: string;
  hooksFilter: string;
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

  const handleJacquardChange = (value: string) => {
    onFilterChange({ selectedJacquard: value });
  };

  const handleLabelChange = (value: string) => {
    onFilterChange({ selectedLabel: value });
  };

  const handleEpiChange = (value: string) => {
    onFilterChange({ epiFilter: value });
  };

  const handlePpiChange = (value: string) => {
    onFilterChange({ ppiFilter: value });
  };

  const handleHooksChange = (value: string) => {
    onFilterChange({ hooksFilter: value });
  };

  return (
    <div className="border-b border-gray-200 bg-white px-3 py-2 sm:px-4 lg:px-6">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, product ID, or email..."
              value={filters.searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full border border-gray-300 py-2 pr-3 pl-9 text-xs focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none sm:py-2 sm:pr-4 sm:pl-10 sm:text-sm"
            />
          </div>
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

        {showFilters && (
          <div className="grid grid-cols-1 gap-3 border-t border-gray-200 pt-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                Saree Style
              </label>
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

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                Jacquard Type
              </label>
              <select
                value={filters.selectedJacquard}
                onChange={(e) => handleJacquardChange(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none sm:text-sm"
              >
                <option value="">All Types</option>
                {getUniqueValues("jacquard_type").map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                Label
              </label>
              <select
                value={filters.selectedLabel}
                onChange={(e) => handleLabelChange(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none sm:text-sm"
              >
                <option value="">All Labels</option>
                {getUniqueValues("label").map((label) => (
                  <option key={label} value={label}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                EPI
              </label>
              <input
                type="number"
                placeholder="Filter by EPI"
                value={filters.epiFilter}
                onChange={(e) => handleEpiChange(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none sm:text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                PPI
              </label>
              <input
                type="number"
                placeholder="Filter by PPI"
                value={filters.ppiFilter}
                onChange={(e) => handlePpiChange(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none sm:text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                Hooks
              </label>
              <input
                type="number"
                placeholder="Filter by hooks"
                value={filters.hooksFilter}
                onChange={(e) => handleHooksChange(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none sm:text-sm"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
