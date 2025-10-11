import { useState, useEffect, useCallback } from "react";
import {
  Link as LinkIcon,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import { Card } from "flowbite-react";
import { getAllStoreImages } from "../../Api";

export interface StoreImage {
  id: string;
  name: string | null | undefined;
  image_url: string;
  link: string | null | undefined;
  created_at: string;
}

interface ApiResponse {
  page: number;
  limit: number;
  total: number;
  images: string[];
}

// Skeleton Loading Component
const SkeletonCard = () => (
  <Card
    className="overflow-hidden border border-gray-200 !bg-white shadow-sm"
    style={{ borderRadius: "0px" }}
  >
    <div
      className="relative h-32 w-full animate-pulse overflow-hidden bg-gradient-to-r from-[#8c1007] to-[#3e0703]"
      style={{ borderRadius: "0px" }}
    />
    <div className="p-2">
      <div className="mb-2 h-4 w-3/4 animate-pulse rounded-none bg-gray-200"></div>
      <div className="flex items-center justify-between">
        <div className="h-3 w-1/2 animate-pulse rounded-none bg-gray-200"></div>
      </div>
    </div>
  </Card>
);

export default function DigitalAssets() {
  const [images, setImages] = useState<StoreImage[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [loading, setLoading] = useState(false);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllStoreImages(currentPage - 1, itemsPerPage);
      if (!response.ok) throw new Error("Failed to fetch images");
      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        throw new Error("Server responded with non-JSON content.");
      }
      const data: ApiResponse = await response.json();
      console.log("API Response:", data);

      const storeImages: StoreImage[] = data.images.map((url, index) => {
        const fileName =
          url.split("/").pop()?.split("?")[0] || `Image ${index + 1}`;
        return {
          id: `${url}-${index}`,
          name: fileName,
          image_url: url,
          link: url,
          created_at: new Date().toISOString(),
        };
      });
      console.log("Transformed Images:", storeImages);

      setImages(storeImages);
      setTotalItems(data.total || 0);
      setTotalPages(Math.ceil((data.total || 0) / itemsPerPage) || 1);
    } catch (err) {
      console.error(err);
      setImages([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const onPageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

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

  const downloadImage = async (imageUrl: string, fileName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  if (loading && images.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div
            className="inline-block h-12 w-12 animate-spin border-4 border-solid border-[var(--color-primary)] border-r-transparent"
            style={{ borderRadius: "0px" }}
          />
          <p className="mt-2 text-gray-600">Loading digital assets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div
        className="border-b border-gray-200 bg-white px-3 py-3 sm:px-4 lg:px-6"
        style={{ borderRadius: "0px" }}
      >
        <h1 className="text-lg font-semibold text-gray-900">Digital Assets</h1>
      </div>

      {/* Main Content */}
      <div className="p-3 sm:p-4">
        {/* Skeleton Loading State */}
        {loading && images.length === 0 ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
            {Array.from({ length: itemsPerPage }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : (
          <>
            {/* Actual Images Grid */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
              {images.map((image) => (
                <Card
                  key={image.id}
                  className="overflow-hidden border border-gray-200 !bg-white shadow-sm"
                  style={{ borderRadius: "0px" }}
                >
                  <div className="group relative h-32 w-full overflow-hidden bg-gray-100">
                    <img
                      src={image.image_url}
                      alt={image.name || "Unnamed Asset"}
                      className="h-full w-full object-cover"
                      style={{ borderRadius: "0px" }}
                      onError={(e) =>
                        (e.currentTarget.src =
                          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"%3E%3Cpath strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/%3E%3C/svg%3E')
                      }
                    />
                    <div className="absolute top-1 right-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <button
                        onClick={() =>
                          downloadImage(
                            image.image_url,
                            image.name || "download",
                          )
                        }
                        className="cursor-pointer border border-gray-300 bg-white/90 p-1 shadow-sm hover:bg-white"
                        style={{ borderRadius: "0px" }}
                      >
                        <Download className="h-3 w-3 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <div className="p-2">
                    <h5 className="mb-1 truncate text-xs font-medium text-gray-900">
                      {image.name || "Unnamed Asset"}
                    </h5>
                    <div className="flex items-center justify-between">
                      {image.link &&
                      typeof image.link === "string" &&
                      image.link.trim() !== "" ? (
                        <a
                          href={image.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]"
                        >
                          <LinkIcon className="h-3 w-3" />
                          View Link
                        </a>
                      ) : (
                        <span className="text-xs text-gray-500">
                          No link available
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {images.length === 0 && !loading && (
              <div
                className="border border-gray-200 bg-white py-8 text-center"
                style={{ borderRadius: "0px" }}
              >
                <svg
                  className="mx-auto h-16 w-16 text-gray-300"
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
                <h3 className="mt-2 text-sm font-semibold text-gray-900">
                  No assets found
                </h3>
                <p className="mt-1 text-xs text-gray-600">
                  Get started by uploading your first digital asset.
                </p>
              </div>
            )}
          </>
        )}

        {/* Pagination - Same as Design List */}
        {images.length > 0 && (
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
                  assets
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
      </div>
    </div>
  );
}
