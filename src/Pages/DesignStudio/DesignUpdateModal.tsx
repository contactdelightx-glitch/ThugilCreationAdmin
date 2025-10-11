import { useState, useEffect } from "react";
import { X, ExternalLink } from "lucide-react";
import { Design } from "./DesignList";

interface DesignUpdateModalProps {
  design: Design;
  onClose: () => void;
}

export default function DesignUpdateModal({
  design,
  onClose,
}: DesignUpdateModalProps) {
  const [isHeaderImageLoaded, setIsHeaderImageLoaded] = useState(false);
  const [isSidebarImageLoaded, setIsSidebarImageLoaded] = useState(false);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const formatValue = (val: unknown) => {
    if (typeof val !== "string") return JSON.stringify(val);
    return val.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Remove onClick from background overlay */}
      <div className="absolute inset-0 bg-black/60" />

      <div
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-[var(--color-primary-dark)] px-3 py-2 sm:px-4 sm:py-3">
          <div className="flex items-center gap-2 sm:gap-3">
            {design.original_image_url && (
              <div className="relative h-8 w-8 sm:h-10 sm:w-10">
                {!isHeaderImageLoaded && (
                  <div className="absolute inset-0 animate-pulse bg-[var(--color-primary-light)]" />
                )}
                <img
                  src={design.original_image_url}
                  alt=""
                  className={`h-8 w-8 border border-white/30 object-cover sm:h-10 sm:w-10 ${isHeaderImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setIsHeaderImageLoaded(true)}
                  onError={() => setIsHeaderImageLoaded(true)}
                />
              </div>
            )}
            <div>
              <h2 className="text-sm font-semibold text-white sm:text-base">
                {design.name ? formatValue(design.name) : "Design Details"}
              </h2>
              <p className="text-xs text-white/70">
                {formatDate(design.created_at)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 cursor-pointer items-center justify-center text-white/80 transition-colors hover:bg-white/10 hover:text-white sm:h-8 sm:w-8"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto">
          {/* Mobile Layout - Single Column */}
          <div className="flex flex-col md:grid md:grid-cols-3 md:gap-0">
            {/* Image Section - Mobile First */}
            <div className="space-y-3 border-b border-gray-200 bg-gray-50 p-3 md:col-span-1 md:border-b-0 md:border-r md:p-4">
              {design.original_image_url && (
                <div className="relative h-[120px] w-full sm:h-[150px] md:aspect-square md:h-auto">
                  {!isSidebarImageLoaded && (
                    <div className="absolute inset-0 animate-pulse bg-[var(--color-primary-light)]" />
                  )}
                  <img
                    src={design.original_image_url}
                    alt=""
                    className={`h-full w-full border border-gray-300 object-cover ${isSidebarImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setIsSidebarImageLoaded(true)}
                    onError={() => setIsSidebarImageLoaded(true)}
                  />
                </div>
              )}

              {/* Price and Action Buttons - Mobile Layout */}
              <div className="flex flex-col gap-2 sm:flex-row md:flex-col">
                {(design.final_price || design.listing_rate) && (
                  <div className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-br from-[var(--color-primary-dark)] to-[var(--color-primary)] p-2 text-center text-white shadow-md transition-transform hover:scale-[1.02]">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold uppercase">
                        Price:
                      </span>
                      {design.final_price && (
                        <span className="text-sm font-bold tracking-tight sm:text-base">
                          ₹{design.final_price}
                        </span>
                      )}
                      {design.listing_rate &&
                        design.listing_rate !== design.final_price && (
                          <span className="text-[8px] line-through opacity-70">
                            ₹{design.listing_rate}
                          </span>
                        )}
                    </div>
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

            {/* Details Section */}
            <div className="space-y-3 p-3 md:col-span-2 md:p-5 md:space-y-5">
              {/* Basic Information - 2 columns on mobile */}
              {(design.name ||
                design.email ||
                design.image_type ||
                design.harnessbuild) && (
                <div>
                  <div className="mb-1 border-b border-[var(--color-primary-light)] pb-1 text-[10px] font-bold tracking-wider text-[var(--color-primary)] uppercase sm:text-xs">
                    Basic Information
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-2 sm:gap-y-3">
                    {design.name && (
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase">
                          Name
                        </div>
                        <div className="text-xs font-medium break-words text-gray-900 sm:text-sm">
                          {formatValue(design.name)}
                        </div>
                      </div>
                    )}
                    {design.email && (
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase">
                          Email
                        </div>
                        <div className="overflow-hidden text-xs font-medium break-words text-ellipsis text-gray-900 sm:text-sm">
                          {design.email}
                        </div>
                      </div>
                    )}
                    {design.image_type && (
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase">
                          Image Type
                        </div>
                        <div className="text-xs font-medium break-words text-gray-900 sm:text-sm">
                          {formatValue(design.image_type)}
                        </div>
                      </div>
                    )}
                    {design.harnessbuild && (
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase">
                          Harness Build
                        </div>
                        <div className="text-xs font-medium break-words text-gray-900 sm:text-sm">
                          {formatValue(design.harnessbuild)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Style & Design - 2 columns on mobile */}
              {(design.saree_style || design.label || design.jacquard_type) && (
                <div>
                  <div className="mb-1 border-b border-[var(--color-primary-light)] pb-1 text-[10px] font-bold tracking-wider text-[var(--color-primary)] uppercase sm:text-xs">
                    Style & Design
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-2 sm:gap-y-3">
                    {design.saree_style && (
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase">
                          Saree Style
                        </div>
                        <div className="text-xs font-medium break-words text-gray-900 sm:text-sm">
                          {formatValue(design.saree_style)}
                        </div>
                      </div>
                    )}
                    {design.label && (
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase">
                          Label
                        </div>
                        <div className="text-xs font-medium break-words text-gray-900 sm:text-sm">
                          {design.label ? formatValue(design.label) : "None"}
                        </div>
                      </div>
                    )}
                    {design.jacquard_type && (
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase">
                          Jacquard Type
                        </div>
                        <div className="text-xs font-medium break-words text-gray-900 sm:text-sm">
                          {formatValue(design.jacquard_type)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Design Information - 2 columns on mobile (replaced Technical Specifications) */}
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
                  <div className="mb-1 border-b border-[var(--color-primary-light)] pb-1 text-[10px] font-bold tracking-wider text-[var(--color-primary)] uppercase sm:text-xs">
                    Design Information
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-2 sm:gap-y-3">
                    {design.cards && (
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase">
                          Cards
                        </div>
                        <div className="text-xs font-medium break-words text-gray-900 sm:text-sm">
                          {design.cards}
                        </div>
                      </div>
                    )}
                    {design.hooks && (
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase">
                          Hooks
                        </div>
                        <div className="text-xs font-medium break-words text-gray-900 sm:text-sm">
                          {design.hooks}
                        </div>
                      </div>
                    )}
                    {design.epi && (
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase">
                          EPI
                        </div>
                        <div className="text-xs font-medium break-words text-gray-900 sm:text-sm">
                          {design.epi}
                        </div>
                      </div>
                    )}
                    {design.ppi && (
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase">
                          PPI
                        </div>
                        <div className="text-xs font-medium break-words text-gray-900 sm:text-sm">
                          {design.ppi}
                        </div>
                      </div>
                    )}
                    {design.body_epi && (
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase">
                          Body EPI
                        </div>
                        <div className="text-xs font-medium break-words text-gray-900 sm:text-sm">
                          {design.body_epi}
                        </div>
                      </div>
                    )}
                    {design.border_epi && (
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase">
                          Border EPI
                        </div>
                        <div className="text-xs font-medium break-words text-gray-900 sm:text-sm">
                          {design.border_epi}
                        </div>
                      </div>
                    )}
                    {design.total_hooks && (
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase">
                          Total Hooks
                        </div>
                        <div className="text-xs font-medium break-words text-gray-900 sm:text-sm">
                          {design.total_hooks}
                        </div>
                      </div>
                    )}
                    {design.br_hooks && (
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase">
                          BR Hooks
                        </div>
                        <div className="text-xs font-medium break-words text-gray-900 sm:text-sm">
                          {design.br_hooks}
                        </div>
                      </div>
                    )}
                    {design.by_hooks && (
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase">
                          BY Hooks
                        </div>
                        <div className="text-xs font-medium break-words text-gray-900 sm:text-sm">
                          {design.by_hooks}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}