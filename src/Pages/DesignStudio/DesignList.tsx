import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
} from "lucide-react";
import { getDesigns } from "../../Api";
import DesignUpdateModal from "./DesignUpdateModal";

export interface Design {
  id: number;
  product_id: string;
  name: string;
  cards: number;
  email: string;
  epi: number;
  final_price: string;
  harnessbuild: string;
  hooks: number;
  image_type: string;
  image_url: string;
  label: string;
  listing_rate: string;
  original_image_url: string;
  ppi: number;
  saree_style: string;
  redirect_url: string | null;
  body_epi: string | null;
  total_hooks: string | null;
  border_epi: string | null;
  jacquard_type: string | null;
  br_hooks: string | null;
  by_hooks: string | null;
  created_at: string;
}

interface PaginationResponse {
  designs: Design[];
  total: number;
  page: number;
  limit: number;
}

export default function DesignList() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);

  const fetchDesigns = async (page: number, limit: number = itemsPerPage) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDesigns(page, limit);
      if (!response.ok) throw new Error("Failed to fetch designs");
      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        throw new Error("Server responded with non-JSON content.");
      }
      const data: PaginationResponse = await response.json();
      setDesigns(data.designs || []);
      setTotalItems(data.total || 0);
      setCurrentPage(data.page || page);
      setTotalPages(Math.ceil((data.total || 0) / limit));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load designs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesigns(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  const onPageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getLabelColor = (label: string) => {
    switch (label.toLowerCase()) {
      case "new":
        return "bg-green-100 text-green-800";
      case "popular":
        return "bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]";
      case "sale":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getSareeStyleDisplay = (style: string) =>
    style.charAt(0).toUpperCase() + style.slice(1);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }
    return pages;
  };

  const handleViewDesign = (design: Design) => {
    setSelectedDesign(design);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDesign(null);
  };

  const buttonClass =
    "p-1 text-gray-600 hover:text-[var(--color-primary)] hover:bg-gray-100 transition-colors sm:p-2";
  const iconClass = "h-3 w-3 sm:h-4 sm:w-4";

  if (loading && designs.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin border-4 border-solid border-[var(--color-primary)] border-r-transparent" />
          <p className="mt-2 text-gray-600">Loading designs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-3 py-3 sm:px-4 lg:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900 sm:text-xl lg:text-2xl">
              Designs Studio
            </h1>
            <p className="mt-1 text-xs text-gray-600 sm:text-sm">
              Manage and organize all your design projects
            </p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 bg-[var(--color-primary)] px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[var(--color-primary-dark)] sm:px-4 sm:text-sm">
            <Plus className={iconClass} />
            New Design
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="border-b border-gray-200 bg-white px-3 py-2 sm:px-4 lg:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search designs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 py-2 pr-3 pl-9 text-xs focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none sm:py-2 sm:pr-4 sm:pl-10 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mx-3 mt-2 border border-red-200 bg-red-50 p-2 text-xs sm:mx-4 sm:p-3 lg:mx-6">
          <div className="flex">
            <svg
              className="h-4 w-4 flex-shrink-0 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="ml-2 text-xs text-red-800 sm:text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-2 sm:p-3 lg:p-4">
        <div className="overflow-hidden border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider whitespace-nowrap text-gray-700 uppercase sm:px-3 sm:py-3">
                    Design
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider whitespace-nowrap text-gray-700 uppercase sm:px-3 sm:py-3">
                    Product ID
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider whitespace-nowrap text-gray-700 uppercase sm:px-3 sm:py-3">
                    Style & Specs
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider whitespace-nowrap text-gray-700 uppercase sm:px-3 sm:py-3">
                    Status
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider whitespace-nowrap text-gray-700 uppercase sm:px-3 sm:py-3">
                    Pricing
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider whitespace-nowrap text-gray-700 uppercase sm:px-3 sm:py-3">
                    Created
                  </th>
                  <th className="px-2 py-2 text-right text-xs font-semibold tracking-wider whitespace-nowrap text-gray-700 uppercase sm:px-3 sm:py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {designs.map((design) => (
                  <tr
                    key={design.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-2 py-2 whitespace-nowrap sm:px-3 sm:py-3">
                      <div className="flex items-center">
                        <div className="h-8 w-8 flex-shrink-0 overflow-hidden bg-gray-100 sm:h-10 sm:w-10">
                          <img
                            src={design.image_url}
                            alt={design.name}
                            className="h-full w-full object-cover"
                            onError={(e) =>
                              (e.currentTarget.src =
                                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"%3E%3Cpath strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/%3E%3C/svg%3E')
                            }
                          />
                        </div>
                        <div className="ml-2 min-w-0 sm:ml-3">
                          <div className="max-w-[120px] truncate text-xs font-semibold text-gray-900 sm:max-w-none sm:text-sm">
                            {design.name}
                          </div>
                          <div className="max-w-[120px] truncate text-xs text-gray-500 sm:max-w-none">
                            {design.email}
                          </div>
                          <div className="mt-0.5 text-xs text-gray-400 sm:mt-1">
                            {design.cards}c • {design.hooks}h • {design.epi} EPI
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap sm:px-3 sm:py-3">
                      <div className="font-mono text-xs text-gray-600 sm:text-sm">
                        {design.product_id}
                      </div>
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap sm:px-3 sm:py-3">
                      <div className="text-xs font-semibold text-gray-900 sm:text-sm">
                        {getSareeStyleDisplay(design.saree_style)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {design.harnessbuild} • {design.ppi} PPI
                      </div>
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap sm:px-3 sm:py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold sm:px-3 sm:py-1 ${getLabelColor(design.label)}`}
                      >
                        {design.label.charAt(0).toUpperCase() +
                          design.label.slice(1)}
                      </span>
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap sm:px-3 sm:py-3">
                      <div className="text-xs font-semibold text-gray-900 sm:text-sm">
                        ₹{design.final_price}
                      </div>
                      {design.listing_rate !== design.final_price && (
                        <div className="text-xs text-gray-500 line-through">
                          ₹{design.listing_rate}
                        </div>
                      )}
                    </td>
                    <td className="px-2 py-2 text-xs whitespace-nowrap text-gray-600 sm:px-3 sm:py-3 sm:text-sm">
                      {formatDate(design.created_at)}
                    </td>
                    <td className="px-2 py-2 text-right whitespace-nowrap sm:px-3 sm:py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          className={buttonClass}
                          onClick={() => handleViewDesign(design)}
                        >
                          <Eye className={iconClass} />
                        </button>
                        <button className={buttonClass}>
                          <Edit2 className={iconClass} />
                        </button>
                        <button
                          className={`${buttonClass} hover:bg-red-100 hover:text-red-600`}
                        >
                          <Trash2 className={iconClass} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Empty State */}
        {designs.length === 0 && !loading && (
          <div className="border border-gray-200 bg-white py-8 text-center sm:py-12">
            <svg
              className="mx-auto h-16 w-16 text-gray-300 sm:h-24 sm:w-24"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              />
            </svg>
            <h3 className="mt-2 text-base font-semibold text-gray-900 sm:mt-3 sm:text-lg">
              No designs found
            </h3>
            <p className="mt-1 text-xs text-gray-600 sm:text-sm">
              Get started by creating your first design.
            </p>
            <button className="mt-3 inline-flex items-center gap-2 bg-[var(--color-primary)] px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[var(--color-primary-dark)] sm:mt-4 sm:px-4 sm:text-sm">
              <Plus className={iconClass} />
              Create Design
            </button>
          </div>
        )}
        {/* Pagination */}
        {designs.length > 0 && (
          <div className="mt-3 border border-gray-200 bg-white sm:mt-4">
            <div className="flex flex-col items-center justify-between gap-2 px-3 py-2 md:flex-row md:gap-4 md:px-4">
              <div className="flex w-full flex-col items-center gap-2 md:w-auto md:flex-row md:items-center md:gap-3">
                <div className="text-center text-xs text-gray-600 sm:text-sm md:text-left">
                  Showing{" "}
                  <span className="font-semibold text-gray-900">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-gray-900">
                    {Math.min(currentPage * itemsPerPage, totalItems)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-900">
                    {totalItems}
                  </span>{" "}
                  designs
                </div>
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="itemsPerPage"
                    className="text-xs whitespace-nowrap text-gray-600 sm:text-sm"
                  >
                    Per page:
                  </label>
                  <select
                    id="itemsPerPage"
                    value={itemsPerPage}
                    onChange={(e) =>
                      handleItemsPerPageChange(Number(e.target.value))
                    }
                    className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none sm:px-3 sm:text-sm"
                  >
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={200}>200</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-1 md:justify-end">
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:py-2 sm:text-sm"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">Previous</span>
                </button>
                <div className="flex flex-wrap items-center justify-center gap-1">
                  {getPageNumbers().map((page, index) =>
                    page === "..." ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-1 text-xs text-gray-500 sm:px-2 sm:text-sm"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => onPageChange(page as number)}
                        className={`h-8 w-8 rounded-md text-xs font-medium transition-colors sm:h-9 sm:w-9 sm:text-sm ${
                          currentPage === page
                            ? "bg-[var(--color-primary)] text-white"
                            : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                        aria-label={`Page ${page}`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                </div>
                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:py-2 sm:text-sm"
                  aria-label="Next page"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Design Update Modal */}
        {isModalOpen && selectedDesign && (
          <DesignUpdateModal
            design={selectedDesign}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
}
