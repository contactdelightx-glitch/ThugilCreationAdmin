/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { X, ExternalLink, Save } from "lucide-react";
import { Design } from "./DesignList";
import { updateDesign } from "../../Api";

interface DesignUpdateModalProps {
  design: Design;
  onClose: () => void;
  mode: "view" | "edit";
  onSuccess?: (message: string) => void;
}

export default function DesignUpdateModal({
  design,
  onClose,
  mode,
  onSuccess,
}: DesignUpdateModalProps) {
  const [isHeaderImageLoaded, setIsHeaderImageLoaded] = useState(false);
  const [isSidebarImageLoaded, setIsSidebarImageLoaded] = useState(false);
  const [currentMode, setCurrentMode] = useState<"view" | "edit">(mode);
  const [formData, setFormData] = useState<Partial<Design>>(design);
  const [saving, setSaving] = useState(false);
  const [imageIndices, setImageIndices] = useState<{
    image_url: number;
    original_image_url: number;
  }>({ image_url: 0, original_image_url: 0 });
  const [priceError, setPriceError] = useState<string>("");

  // Helper function to parse multiple image URLs
  const getImageUrls = (urlString: string): string[] => {
    const urls = urlString
      .split(" ")
      .filter((url) => url && url.startsWith("https://"));
    return urls.length > 0 ? urls : [urlString];
  };

  // Carousel effect for cycling images
  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndices((prevIndices) => {
        const newIndices = { ...prevIndices };
        const imageUrls = getImageUrls(formData.image_url as string || design.image_url);
        const originalImageUrls = getImageUrls(formData.original_image_url as string || design.original_image_url);

        if (imageUrls.length > 1) {
          newIndices.image_url = (prevIndices.image_url + 1) % imageUrls.length;
        }
        if (originalImageUrls.length > 1) {
          newIndices.original_image_url = (prevIndices.original_image_url + 1) % originalImageUrls.length;
        }

        return newIndices;
      });
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [formData.image_url, formData.original_image_url, design.image_url, design.original_image_url]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Validate prices whenever they change
  useEffect(() => {
    validatePrices();
  }, [formData.final_price, formData.listing_rate]);

  const validatePrices = () => {
    const finalPrice = formData.final_price;
    const listingRate = formData.listing_rate;

    // Convert to numbers if they are strings
    const finalPriceNum = typeof finalPrice === 'string' ? parseFloat(finalPrice) : finalPrice;
    const listingRateNum = typeof listingRate === 'string' ? parseFloat(listingRate) : listingRate;

    // Check if both prices are filled
    if (finalPriceNum === undefined || finalPriceNum === null || listingRateNum === undefined || listingRateNum === null) {
      setPriceError("Both listing price and final price are required");
      return;
    }

    // Check if prices are valid numbers
    if (isNaN(finalPriceNum) || isNaN(listingRateNum) || finalPriceNum < 0 || listingRateNum < 0) {
      setPriceError("Prices must be valid positive numbers");
      return;
    }

    // Check if final price is less than or equal to listing price
    if (finalPriceNum > listingRateNum) {
      setPriceError("Final price cannot be greater than listing price");
      return;
    }

    setPriceError("");
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatValue = (val: unknown) => {
    if (typeof val !== "string") return JSON.stringify(val);
    return val.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleInputChange = (field: keyof Design, value: string) => {
    // Handle numeric fields
    if (field === "final_price" || field === "listing_rate") {
      // If value is empty string, set to undefined to clear the field
      const numericValue = value === "" ? undefined : Number(value);
      setFormData((prev) => ({
        ...prev,
        [field]: numericValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
    
    // Reset image index for the changed field
    if (field === "image_url" || field === "original_image_url") {
      setImageIndices((prev) => ({
        ...prev,
        [field]: 0,
      }));
    }
  };

  const handleSave = async () => {
    // Final validation before saving
    validatePrices();
    if (priceError) {
      if (onSuccess) {
        onSuccess("Please fix price validation errors before saving.");
      }
      return;
    }

    setSaving(true);
    try {
      const response = await updateDesign(design.id, formData);
      if (response.message && onSuccess) {
        onSuccess(response.message);
      }
      setTimeout(() => {
        setCurrentMode("view");
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Failed to update design:", error);
      if (onSuccess) {
        onSuccess("Failed to update design. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const isEditable = (field: string) => {
    const nonEditableFields = ["email", "image_type", "saree_style", "label", "jacquard_type"];
    return currentMode === "edit" && !nonEditableFields.includes(field);
  };

  const renderField = (field: keyof Design, _label: string, value: any) => {
    if (isEditable(field)) {
      if (field === "final_price" || field === "listing_rate") {
        // For price fields, use empty string when value is undefined/null
        const displayValue = formData[field] !== undefined ? formData[field] : "";
        return (
          <div>
            <input
              type="number"
              min="0"
              step="1"
              value={displayValue}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className={`w-full border px-2 py-1 text-xs focus:ring-1 focus:outline-none sm:text-sm text-[var(--color-primary-dark)] ${
                priceError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              }`}
              placeholder="Enter price"
              required
            />
          </div>
        );
      }

      return (
        <input
          type="text"
          value={formData[field] || ""}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="w-full border border-gray-300 px-2 py-1 text-xs focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none sm:text-sm text-[var(--color-primary-dark)]"
        />
      );
    }

    return (
      <div className="text-xs font-medium break-words sm:text-sm text-[var(--color-primary-dark)]">
        {value ? formatValue(value) : "-"}
      </div>
    );
  };

  const headerImageUrls = getImageUrls(formData.original_image_url as string || design.original_image_url);
  const sidebarImageUrls = getImageUrls(formData.image_url as string || design.image_url);
  const currentHeaderImageUrl = headerImageUrls[imageIndices.original_image_url] || design.original_image_url;
  const currentSidebarImageUrl = sidebarImageUrls[imageIndices.image_url] || design.image_url;

  const displayFinalPrice = formData.final_price ?? design.final_price;
  const displayListingRate = formData.listing_rate ?? design.listing_rate;

  // Check if save should be disabled
  const isSaveDisabled = () => {
    if (saving) return true;
    if (priceError) return true;
    
    // Check if both prices are filled
    const finalPrice = formData.final_price;
    const listingRate = formData.listing_rate;
    
    if (finalPrice === undefined || finalPrice === null || listingRate === undefined || listingRate === null) {
      return true;
    }

    // Convert to numbers if they are strings
    const finalPriceNum = typeof finalPrice === 'string' ? parseFloat(finalPrice) : finalPrice;
    const listingRateNum = typeof listingRate === 'string' ? parseFloat(listingRate) : listingRate;

    // Check if prices are valid numbers
    if (isNaN(finalPriceNum) || isNaN(listingRateNum) || finalPriceNum < 0 || listingRateNum < 0) {
      return true;
    }

    // Check if final price is greater than listing price
    if (finalPriceNum > listingRateNum) {
      return true;
    }

    return false;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-black/60" />

      <div
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-gray-200 bg-[var(--color-primary-dark)] px-3 py-2 sm:px-4 sm:py-3">
          <div className="flex items-center gap-2 sm:gap-3">
            {design.original_image_url && (
              <div className="relative h-8 w-8 sm:h-10 sm:w-10">
                {!isHeaderImageLoaded && (
                  <div className="absolute inset-0 animate-pulse bg-[var(--color-primary-light)]" />
                )}
                <img
                  src={currentHeaderImageUrl}
                  alt={`${design.name} - Header Image ${imageIndices.original_image_url + 1}`}
                  className={`h-8 w-8 border border-white/30 object-cover sm:h-10 sm:w-10 ${isHeaderImageLoaded ? "opacity-100" : "opacity-0"}`}
                  onLoad={() => setIsHeaderImageLoaded(true)}
                  onError={(e) => {
                    e.currentTarget.src =
                      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"%3E%3Cpath strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/%3E%3C/svg%3E';
                    setIsHeaderImageLoaded(true);
                  }}
                />
                {headerImageUrls.length > 1 && (
                  <div className="absolute bottom-0 right-0 bg-black bg-opacity-50 px-1 py-0.5 text-xs text-white">
                    {imageIndices.original_image_url + 1}/{headerImageUrls.length}
                  </div>
                )}
              </div>
            )}
            <div>
              <h2 className="text-sm font-semibold text-white sm:text-base">
                {formData.name ? formatValue(formData.name) : formatValue(design.name)}
                {currentMode === "edit" && " (Editing)"}
              </h2>
              <p className="text-xs text-white/70">
                {formatDate(design.created_at)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {currentMode === "view" && (
              <button
                onClick={() => setCurrentMode("edit")}
                className="flex h-7 w-7 cursor-pointer items-center justify-center text-white/80 transition-colors hover:bg-white/10 hover:text-white sm:h-8 sm:w-8"
              >
                <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="flex h-7 w-7 cursor-pointer items-center justify-center text-white/80 transition-colors hover:bg-white/10 hover:text-white sm:h-8 sm:w-8"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="flex flex-col md:grid md:grid-cols-3 md:gap-0">
            <div className="space-y-3 border-b border-gray-200 bg-gray-50 p-3 md:col-span-1 md:border-r md:border-b-0 md:p-4">
              {design.image_url && (
                <div className="relative h-[120px] w-full sm:h-[150px] md:aspect-square md:h-auto">
                  {!isSidebarImageLoaded && (
                    <div className="absolute inset-0 animate-pulse bg-[var(--color-primary-light)]" />
                  )}
                  <img
                    src={currentSidebarImageUrl}
                    alt={`${design.name} - Sidebar Image ${imageIndices.image_url + 1}`}
                    className={`h-full w-full border border-gray-300 object-cover ${isSidebarImageLoaded ? "opacity-100" : "opacity-0"}`}
                    onLoad={() => setIsSidebarImageLoaded(true)}
                    onError={(e) => {
                      e.currentTarget.src =
                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"%3E%3Cpath strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/%3E%3C/svg%3E';
                      setIsSidebarImageLoaded(true);
                    }}
                  />
                  {sidebarImageUrls.length > 1 && (
                    <div className="absolute bottom-0 right-0 bg-black bg-opacity-50 px-1 py-0.5 text-xs text-white">
                      {imageIndices.image_url + 1}/{sidebarImageUrls.length}
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-2 sm:flex-row md:flex-col">
                {(displayFinalPrice || displayListingRate) && (
                  <div className="flex flex-1 flex-col gap-2 bg-gradient-to-br from-[var(--color-primary-dark)] to-[var(--color-primary)] p-3 text-center text-white shadow-md">
                    <div className="space-y-1">
                      <div className="text-[10px] font-semibold uppercase opacity-80">
                        Pricing
                      </div>
                      {displayFinalPrice !== undefined && (
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-xs">Final Price:</span>
                          <span className="text-sm font-bold tracking-tight">
                            ₹{displayFinalPrice}
                          </span>
                        </div>
                      )}
                      {displayListingRate !== undefined && displayListingRate !== displayFinalPrice && (
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-xs">Listing Rate:</span>
                          <span className="text-xs line-through opacity-70">
                            ₹{displayListingRate}
                          </span>
                        </div>
                      )}
                      {displayListingRate !== undefined && displayListingRate === displayFinalPrice && (
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-xs">Price:</span>
                          <span className="text-sm font-bold tracking-tight">
                            ₹{displayFinalPrice}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {priceError && (
                      <div className="mt-1 rounded bg-red-500/20 px-2 py-1">
                        <p className="text-[10px] text-red-200">{priceError}</p>
                      </div>
                    )}
                  </div>
                )}

                {design.redirect_url && (
                  <a
                    href={design.redirect_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-1 rounded-md bg-[var(--color-primary-dark)] px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-[var(--color-primary)]"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View
                  </a>
                )}
              </div>
            </div>

            <div className="space-y-3 p-3 md:col-span-2 md:space-y-5 md:p-5">
              {/* Basic Information */}
              <div>
                <div className="mb-1 border-b border-[var(--color-primary-dark)] pb-1 text-[10px] font-bold tracking-wider text-[var(--color-primary-dark)] uppercase sm:text-xs">
                  Basic Information
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-2 sm:gap-y-3">
                  {design.name && (
                    <div>
                      <div className="text-[10px] text-[var(--color-primary-dark)] uppercase font-medium">
                        Design Name
                      </div>
                      {renderField("name", "Design Name", formData.name || design.name)}
                    </div>
                  )}
                  {design.email && (
                    <div>
                      <div className="text-[10px] text-[var(--color-primary-dark)] uppercase font-medium">
                        Email
                      </div>
                      {renderField("email", "Email", design.email)}
                    </div>
                  )}
                  {design.image_type && (
                    <div>
                      <div className="text-[10px] text-[var(--color-primary-dark)] uppercase font-medium">
                        Image Type
                      </div>
                      {renderField(
                        "image_type",
                        "Image Type",
                        design.image_type,
                      )}
                    </div>
                  )}
                  {design.harnessbuild && (
                    <div>
                      <div className="text-[10px] text-[var(--color-primary-dark)] uppercase font-medium">
                        Harness Build
                      </div>
                      {renderField(
                        "harnessbuild",
                        "Harness Build",
                        formData.harnessbuild || design.harnessbuild,
                      )}
                    </div>
                  )}
                  
                  {/* Pricing fields */}
                  {(design.listing_rate !== undefined || design.final_price !== undefined) && (
                    <div className="col-span-2">
                      <div className="text-[10px] text-[var(--color-primary-dark)] uppercase font-medium mb-2">
                        Pricing
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {design.listing_rate !== undefined && (
                          <div>
                            <div className="text-[10px] text-[var(--color-primary-dark)] uppercase font-semibold">
                              Listing Price
                            </div>
                            {renderField("listing_rate", "Listing Price", displayListingRate)}
                          </div>
                        )}
                        {design.final_price !== undefined && (
                          <div>
                            <div className="text-[10px] text-[var(--color-primary-dark)] uppercase font-semibold">
                              Final Price
                            </div>
                            {renderField("final_price", "Final Price", displayFinalPrice)}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Style & Design */}
              {(design.saree_style || design.label || design.jacquard_type) && (
                <div>
                  <div className="mb-1 border-b border-[var(--color-primary-dark)] pb-1 text-[10px] font-bold tracking-wider text-[var(--color-primary-dark)] uppercase sm:text-xs">
                    Style & Design
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-2 sm:gap-y-3">
                    {design.saree_style && (
                      <div>
                        <div className="text-[10px] text-[var(--color-primary-dark)] uppercase font-semibold">
                          Saree Style
                        </div>
                        {renderField(
                          "saree_style",
                          "Saree Style",
                          design.saree_style,
                        )}
                      </div>
                    )}
                    {design.label && (
                      <div>
                        <div className="text-[10px] text-[var(--color-primary-dark)] uppercase font-semibold">
                          Label
                        </div>
                        {renderField("label", "Label", design.label)}
                      </div>
                    )}
                    {design.jacquard_type && (
                      <div>
                        <div className="text-[10px] text-[var(--color-primary-dark)] uppercase font-semibold">
                          Jacquard Type
                        </div>
                        {renderField(
                          "jacquard_type",
                          "Jacquard Type",
                          design.jacquard_type,
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Design Information */}
              {(design.cards ||
                design.hooks ||
                design.epi ||
                design.ppi ||
                design.body_epi ||
                design.border_epi ||
                design.total_hooks ||
                design.br_hooks ||
                design.by_hooks) && (
                <div>
                  <div className="mb-1 border-b border-[var(--color-primary-dark)] pb-1 text-[10px] font-bold tracking-wider text-[var(--color-primary-dark)] uppercase sm:text-xs">
                    Design Information
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-2 sm:gap-y-3">
                    {design.cards && (
                      <div>
                        <div className="text-[10px] text-[var(--color-primary-dark)] uppercase font-semibold">
                          Cards
                        </div>
                        {renderField("cards", "Cards", formData.cards || design.cards)}
                      </div>
                    )}
                    {design.hooks && (
                      <div>
                        <div className="text-[10px] text-[var(--color-primary-dark)] uppercase font-semibold">
                          Hooks
                        </div>
                        {renderField("hooks", "Hooks", formData.hooks || design.hooks)}
                      </div>
                    )}
                    {design.epi && (
                      <div>
                        <div className="text-[10px] text-[var(--color-primary-dark)] uppercase font-semibold">
                          EPI
                        </div>
                        {renderField("epi", "EPI", formData.epi || design.epi)}
                      </div>
                    )}
                    {design.ppi && (
                      <div>
                        <div className="text-[10px] text-[var(--color-primary-dark)] uppercase font-semibold">
                          PPI
                        </div>
                        {renderField("ppi", "PPI", formData.ppi || design.ppi)}
                      </div>
                    )}
                    {design.body_epi && (
                      <div>
                        <div className="text-[10px] text-[var(--color-primary-dark)] uppercase font-semibold">
                          Body EPI
                        </div>
                        {renderField("body_epi", "Body EPI", formData.body_epi || design.body_epi)}
                      </div>
                    )}
                    {design.border_epi && (
                      <div>
                        <div className="text-[10px] text-[var(--color-primary-dark)] uppercase font-semibold">
                          Border EPI
                        </div>
                        {renderField(
                          "border_epi",
                          "Border EPI",
                          formData.border_epi || design.border_epi,
                        )}
                      </div>
                    )}
                    {design.total_hooks && (
                      <div>
                        <div className="text-[10px] text-[var(--color-primary-dark)] uppercase font-semibold">
                          Total Hooks
                        </div>
                        {renderField(
                          "total_hooks",
                          "Total Hooks",
                          formData.total_hooks || design.total_hooks,
                        )}
                      </div>
                    )}
                    {design.br_hooks && (
                      <div>
                        <div className="text-[10px] text-[var(--color-primary-dark)] uppercase font-semibold">
                          BR Hooks
                        </div>
                        {renderField("br_hooks", "BR Hooks", formData.br_hooks || design.br_hooks)}
                      </div>
                    )}
                    {design.by_hooks && (
                      <div>
                        <div className="text-[10px] text-[var(--color-primary-dark)] uppercase font-semibold">
                          BY Hooks
                        </div>
                        {renderField("by_hooks", "BY Hooks", formData.by_hooks || design.by_hooks)}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {currentMode === "edit" && (
          <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaveDisabled()}
              className="inline-flex w-full justify-center items-center gap-2 rounded-md bg-[var(--color-primary)] px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[var(--color-primary-dark)] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentMode("view");
                setPriceError("");
                setFormData(design);
              }}
              className="mt-3 inline-flex w-full justify-center items-center gap-2 rounded-md bg-white px-3 py-2 text-xs font-semibold text-[var(--color-primary-dark)] shadow-sm ring-1 ring-inset ring-gray-300 transition-all hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}