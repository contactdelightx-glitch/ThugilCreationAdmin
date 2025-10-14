import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { getImagesByEmail, deleteImageByIdAndEmail } from "../../Api";

export interface StoreImage {
  id: string;
  name: string | null | undefined;
  image_url: string;
  link: string | null | undefined;
  created_at: string;
  filename?: string;
}

interface ApiResponse {
  emailid: string;
  total: number;
  images: {
    id: number;
    url: string;
    filename: string;
    uploaded_at: string;
  }[];
}

interface ImagesSectionProps {
  onImageDeleted?: () => void;
}

const SkeletonCard = () => (
  <div
    className="overflow-hidden bg-white shadow-sm"
    style={{ borderRadius: "0" }}
  >
    <div
      className="relative h-32 w-full animate-pulse overflow-hidden bg-gray-200"
      style={{ borderRadius: "0" }}
    />
    <div className="p-2">
      <div className="mb-2 h-4 w-3/4 animate-pulse rounded-none bg-gray-200"></div>
      <div className="h-3 w-1/2 animate-pulse rounded-none bg-gray-200"></div>
    </div>
  </div>
);

const ImagesSection = ({ onImageDeleted }: ImagesSectionProps) => {
  const [images, setImages] = useState<StoreImage[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(48);
  const [loading, setLoading] = useState(false);
  const [copiedImageId, setCopiedImageId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Get email from token in localStorage
  const getEmailFromToken = (): string | null => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;

      // Decode JWT token to get email
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.email || payload.sub || null;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const email = getEmailFromToken();
      if (!email) {
        throw new Error("User email not found. Please login again.");
      }

      const data: ApiResponse = await getImagesByEmail(email);

      const storeImages: StoreImage[] = data.images
        .map((image) => ({
          id: image.id.toString(),
          name: image.filename,
          image_url: image.url,
          link: image.url,
          filename: image.filename,
          created_at: image.uploaded_at,
        }))
        .reverse();

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
  }, [itemsPerPage]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const onPageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      if (currentPage > 2) pages.push(currentPage - 1);
      pages.push(currentPage);
      if (currentPage < totalPages - 1) pages.push(currentPage + 1);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return [...new Set(pages)];
  };

  const copyImageLink = async (imageUrl: string, imageId: string) => {
    try {
      await navigator.clipboard.writeText(imageUrl);
      setCopiedImageId(imageId);
      setTimeout(() => setCopiedImageId(null), 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const handleDeleteImage = async (image: StoreImage) => {
    if (
      confirm(
        `Are you sure you want to delete the image "${image.name || "Unnamed Asset"}"? This action cannot be undone.`,
      )
    ) {
      setDeleting(true);
      try {
        const email = getEmailFromToken();
        if (!email) {
          throw new Error("User email not found. Please login again.");
        }

        await deleteImageByIdAndEmail(parseInt(image.id), email);
        await fetchImages();
        if (onImageDeleted) {
          onImageDeleted(); // Notify parent component to refresh
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert(
          error instanceof Error ? error.message : "Failed to delete image",
        );
      } finally {
        setDeleting(false);
      }
    }
  };

  // Calculate paginated images
  const getPaginatedImages = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return images.slice(startIndex, endIndex);
  };

  const paginatedImages = getPaginatedImages();

  return (
    <div
      className="flex h-full flex-col bg-white p-2 sm:p-2"
      style={{ borderRadius: "0" }}
    >
      {/* Header */}
      <h2
        className="mb-2 text-xl font-bold sm:p-0"
        style={{ color: "var(--color-primary-dark)", borderRadius: "0" }}
      >
        Your Digital Assets
      </h2>

      {/* Scrollable Image Grid - Takes remaining space */}
      <div className="flex-1 overflow-y-auto pr-2">
        {loading && images.length === 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : paginatedImages.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {paginatedImages.map((image) => (
              <div
                key={image.id}
                className="group relative cursor-pointer overflow-hidden bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
                style={{ borderRadius: "0" }}
              >
                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteImage(image);
                  }}
                  disabled={deleting}
                  className="absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center bg-red-500 text-white opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ borderRadius: "0" }}
                  title="Delete image"
                >
                  <Trash2 className="h-3 w-3" />
                </button>

                {/* Image Content */}
                <div
                  onClick={() => copyImageLink(image.image_url, image.id)}
                  className="aspect-square w-full overflow-hidden bg-gray-50"
                  style={{ borderRadius: "0" }}
                >
                  <div className="group/image relative h-full w-full overflow-hidden">
                    <img
                      src={image.image_url}
                      alt={image.name || "Unnamed Asset"}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover/image:scale-110"
                      style={{ borderRadius: "0" }}
                      onError={(e) =>
                        (e.currentTarget.src =
                          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"%3E%3Cpath strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/%3E%3C/svg%3E')
                      }
                    />
                  </div>
                </div>
                <div className="p-2" style={{ borderRadius: "0" }}>
                  <h5 className="mb-1 truncate text-xs font-semibold text-gray-900">
                    {image.name || "Unnamed Asset"}
                  </h5>
                  <span
                    className="text-xs font-medium"
                    style={{
                      color:
                        copiedImageId === image.id
                          ? "var(--color-primary)"
                          : "#6b7280",
                    }}
                  >
                    {copiedImageId === image.id ? "Copied!" : "copy"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <div
              className="flex h-full flex-col items-center justify-center text-center"
              style={{ borderRadius: "0" }}
            >
              <div
                className="mb-4 flex h-20 w-20 items-center justify-center"
                style={{
                  backgroundColor: "var(--color-primary-light)",
                  borderRadius: "0",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-10 w-10"
                  style={{ color: "var(--color-primary)" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
              </div>
              <h3
                className="text-xl font-bold"
                style={{ color: "var(--color-primary-dark)" }}
              >
                No assets found
              </h3>
              <p
                className="mt-2 text-sm"
                style={{ color: "var(--color-primary)" }}
              >
                Get started by uploading your first digital asset.
              </p>
            </div>
          )
        )}
      </div>

      {/* Fixed Pagination at Bottom */}
      {images.length > 0 && (
        <div
          className="mt-3 border-t border-gray-200 pt-3"
          style={{ borderRadius: "0" }}
        >
          <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
            <div className="text-xs text-gray-600">
              Showing{" "}
              <span
                className="font-semibold"
                style={{ color: "var(--color-primary-dark)" }}
              >
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span
                className="font-semibold"
                style={{ color: "var(--color-primary-dark)" }}
              >
                {Math.min(currentPage * itemsPerPage, totalItems)}
              </span>{" "}
              of{" "}
              <span
                className="font-semibold"
                style={{ color: "var(--color-primary-dark)" }}
              >
                {totalItems}
              </span>{" "}
              assets
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 bg-white px-2 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                style={{ borderRadius: "0" }}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Prev</span>
              </button>

              <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) =>
                  page === "..." ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-1.5 text-xs text-gray-500"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => onPageChange(page as number)}
                      className={`h-8 w-8 text-xs font-medium transition-colors ${
                        currentPage === page
                          ? "bg-[var(--color-primary)] text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                      style={{ borderRadius: "0" }}
                    >
                      {page}
                    </button>
                  ),
                )}
              </div>

              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 bg-white px-2 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                style={{ borderRadius: "0" }}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagesSection;
