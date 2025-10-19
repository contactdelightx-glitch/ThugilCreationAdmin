import { useState, useEffect, useCallback } from "react";
import { Edit2, Trash2, Eye } from "lucide-react";
import { Toast } from "flowbite-react";
import { getTodaysDesigns, deleteDesign } from "../../Api";
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
  label: string | null | undefined;
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

interface TodaysDesignsResponse {
  total: number;
  designs: Design[];
}

export default function RecentAdded() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit">("view");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [designToDelete, setDesignToDelete] = useState<Design | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [imageIndices, setImageIndices] = useState<Record<number, number>>({});

  // Helper function to parse multiple image URLs
  const getImageUrls = (urlString: string): string[] => {
    const urls = urlString
      .split(" ")
      .filter((url) => url && url.startsWith("https://"));
    return urls.length > 0 ? urls : [urlString];
  };

  // Initialize image indices for all designs
  useEffect(() => {
    setImageIndices((prev) => {
      const newIndices: Record<number, number> = {};
      designs.forEach((design) => {
        newIndices[design.id] = prev[design.id] ?? 0;
      });
      return newIndices;
    });
  }, [designs]);

  // Carousel effect for cycling images
  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndices((prevIndices) => {
        const newIndices = { ...prevIndices };
        designs.forEach((design) => {
          const imageUrls = getImageUrls(design.image_url);
          if (imageUrls.length > 1) {
            newIndices[design.id] =
              (prevIndices[design.id] ?? 0 + 1) % imageUrls.length;
          }
        });
        return newIndices;
      });
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [designs]);

  const fetchDesigns = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getTodaysDesigns();
      if (!response.ok) throw new Error("Failed to fetch today's designs");
      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        throw new Error("Server responded with non-JSON content.");
      }
      const data: TodaysDesignsResponse = await response.json();
      if (data && Array.isArray(data.designs)) {
        setDesigns(data.designs);
      } else {
        setDesigns([]);
      }
    } catch {
      setDesigns([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDesigns();
  }, [fetchDesigns]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getLabelColor = (label: string | null | undefined) => {
    if (!label) return "bg-gray-100 text-gray-600";
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

  const getSareeStyleDisplay = (style: string | null | undefined) => {
    if (!style) return "";
    return style.charAt(0).toUpperCase() + style.slice(1);
  };

  const handleViewDesign = (design: Design) => {
    setSelectedDesign(design);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleEditDesign = (design: Design) => {
    setSelectedDesign(design);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleDeleteDesign = (design: Design) => {
    setDesignToDelete(design);
    setIsDeleteModalOpen(true);
  };

  const handleEditSuccess = (message: string) => {
    setSuccessMessage(message);
    fetchDesigns(); // Refresh the list
  };

  const confirmDelete = async () => {
    if (!designToDelete) return;

    setDeleting(true);
    try {
      const response = await deleteDesign(designToDelete.id);
      if (response.message) {
        setSuccessMessage(response.message);
      } else {
        setSuccessMessage("Design deleted successfully!");
      }
      setDesigns((prev) =>
        prev.filter((design) => design.id !== designToDelete.id),
      );
      setIsDeleteModalOpen(false);
      setDesignToDelete(null);
    } catch (error) {
      console.error("Failed to delete design:", error);
      setSuccessMessage("Failed to delete design. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDesign(null);
    setModalMode("view");
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDesignToDelete(null);
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
      {successMessage && (
        <div className="animate-fade-in fixed top-5 right-5 z-50">
          <Toast className="flex items-center rounded-none border-l-4 border-l-[var(--color-primary-light)] bg-white p-2 shadow-2xl">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="mx-2 flex-1 text-sm font-semibold text-[var(--color-primary-light)]">
              {successMessage}
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="flex h-6 w-6 items-center justify-center text-[var(--color-primary-light)] hover:text-white"
            >
              <span className="sr-only">Close</span>
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </Toast>
        </div>
      )}

      <div className="border-b border-gray-200 bg-white px-3 py-3 sm:px-4 lg:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900 sm:text-xl lg:text-2xl">
              Recent Added Designs
            </h1>
            <p className="mt-1 text-xs text-gray-600 sm:text-sm">
              View and manage designs added today
            </p>
          </div>
        </div>
      </div>

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
                {designs.map((design) => {
                  const imageUrls = getImageUrls(design.image_url);
                  const currentImageIndex = imageIndices[design.id] ?? 0;
                  const currentImageUrl =
                    imageUrls[currentImageIndex] || design.image_url;

                  return (
                    <tr
                      key={design.id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="px-2 py-2 whitespace-nowrap sm:px-3 sm:py-3">
                        <div className="flex items-center">
                          <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden bg-gray-100 sm:h-10 sm:w-10">
                            <img
                              src={currentImageUrl}
                              alt={`${design.name} - Image ${currentImageIndex + 1}`}
                              className="h-full w-full object-cover transition-opacity duration-500"
                              onError={(e) =>
                                (e.currentTarget.src =
                                  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"%3E%3Cpath strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/%3E%3C/svg%3E')
                              }
                            />
                            {imageUrls.length > 1 && (
                              <div className="bg-opacity-50 absolute right-0 bottom-0 bg-black px-1 py-0.5 text-xs text-white">
                                {currentImageIndex + 1}/{imageUrls.length}
                              </div>
                            )}
                          </div>
                          <div className="ml-2 min-w-0 sm:ml-3">
                            <div className="max-w-[120px] truncate text-xs font-semibold text-gray-900 sm:max-w-none sm:text-sm">
                              {design.name}
                            </div>
                            <div className="max-w-[120px] truncate text-xs text-gray-500 sm:max-w-none">
                              {design.email}
                            </div>
                            <div className="mt-0.5 text-xs text-gray-400 sm:mt-1">
                              {design.cards}c • {design.hooks}h • {design.epi}{" "}
                              EPI
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
                          {design.label
                            ? design.label.charAt(0).toUpperCase() +
                              design.label.slice(1)
                            : "None"}
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
                            className={`${buttonClass} cursor-pointer`}
                            onClick={() => handleViewDesign(design)}
                          >
                            <Eye className={iconClass} />
                          </button>
                          <button
                            className={`${buttonClass} cursor-pointer`}
                            onClick={() => handleEditDesign(design)}
                          >
                            <Edit2 className={iconClass} />
                          </button>
                          <button
                            className={`${buttonClass} cursor-pointer hover:bg-red-100 hover:text-red-600`}
                            onClick={() => handleDeleteDesign(design)}
                          >
                            <Trash2 className={iconClass} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
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
              No Recent Added Designs
            </h3>
            <p className="mt-1 text-xs text-gray-600 sm:text-sm">
              Get started by creating your first design.
            </p>
          </div>
        )}
        {isModalOpen && selectedDesign && (
          <DesignUpdateModal
            design={selectedDesign}
            onClose={handleCloseModal}
            mode={modalMode}
            onSuccess={handleEditSuccess}
          />
        )}

        {isDeleteModalOpen && designToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-none bg-white shadow-xl">
              <div className="rounded-none p-6">
                <h3 className="mb-2 rounded-none text-lg font-semibold text-gray-900">
                  Delete Design
                </h3>
                <p className="mb-4 rounded-none text-sm text-gray-600">
                  Are you sure you want to delete the design "
                  {designToDelete.name}"? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3 rounded-none">
                  <button
                    onClick={handleCloseDeleteModal}
                    className="rounded-none border border-[var(--color-primary)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={deleting}
                    className="rounded-none border border-transparent bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
