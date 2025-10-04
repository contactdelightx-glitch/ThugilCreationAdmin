import { Design } from "./DesignList";
import { useEffect } from "react";
import { X, ExternalLink } from "lucide-react";

interface DesignUpdateModalProps {
  design: Design;
  onClose: () => void;
}

export default function DesignUpdateModal({
  design,
  onClose,
}: DesignUpdateModalProps) {
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

  const formatValue = (val: any) => {
    if (typeof val !== "string") return JSON.stringify(val);
    return val.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div
        className="relative flex max-h-[85vh] w-full max-w-3xl flex-col bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-[var(--color-primary-dark)] px-4 py-3">
          <div className="flex items-center gap-3">
            {design.original_image_url && (
              <img
                src={design.original_image_url}
                alt=""
                className="h-10 w-10 border border-white/30 object-cover"
              />
            )}
            <div>
              <h2 className="text-base font-semibold text-white">
                {design.name ? formatValue(design.name) : "Design Details"}
              </h2>
              <p className="text-xs text-white/70">
                {formatDate(design.created_at)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="grid grid-cols-1 gap-0 md:grid-cols-3">
            {/* Image Sidebar */}
            <div className="space-y-4 border-r border-gray-200 bg-gray-50 p-4 md:col-span-1">
              {design.original_image_url && (
                <img
                  src={design.original_image_url}
                  alt=""
                  className="h-[200px] w-full border border-gray-300 object-cover sm:h-[250px] md:aspect-square md:h-auto"
                />
              )}

              {(design.final_price || design.listing_rate) && (
                <div className="flex items-center justify-center gap-2 bg-gradient-to-br from-[var(--color-primary-dark)] to-[var(--color-primary)] p-2 text-center text-white shadow-md transition-transform hover:scale-[1.02]">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase">
                      Price:
                    </span>
                    {design.final_price && (
                      <span className="text-base font-bold tracking-tight">
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
                  className="flex w-full items-center justify-center gap-1 rounded-md bg-[var(--color-primary-dark)] px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-[var(--color-primary)]"
                >
                  <ExternalLink className="h-4 w-4" />
                  View
                </a>
              )}
            </div>

            {/* Details */}
            <div className="space-y-5 p-5 md:col-span-2">
              {/* Basic Info */}
              {(design.name ||
                design.email ||
                design.image_type ||
                design.harnessbuild) && (
                <div>
                  <div className="mb-2 border-b border-[var(--color-primary-light)] pb-1 text-xs font-bold tracking-wider text-[var(--color-primary)] uppercase">
                    Basic Information
                  </div>
                  <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                    {design.name && (
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase">
                          Name
                        </div>
                        <div className="text-sm font-medium break-words text-gray-900">
                          {formatValue(design.name)}
                        </div>
                      </div>
                    )}
                    {design.email && (
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase">
                          Email
                        </div>
                        <div className="overflow-hidden text-sm font-medium break-words text-ellipsis text-gray-900">
                          {design.email}
                        </div>
                      </div>
                    )}
                    {design.image_type && (
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase">
                          Image Type
                        </div>
                        <div className="text-sm font-medium break-words text-gray-900">
                          {formatValue(design.image_type)}
                        </div>
                      </div>
                    )}
                    {design.harnessbuild && (
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase">
                          Harness Build
                        </div>
                        <div className="text-sm font-medium break-words text-gray-900">
                          {formatValue(design.harnessbuild)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Style */}
              {(design.saree_style || design.label || design.jacquard_type) && (
                <div>
                  <div className="mb-2 border-b border-[var(--color-primary-light)] pb-1 text-xs font-bold tracking-wider text-[var(--color-primary)] uppercase">
                    Style & Design
                  </div>
                  <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                    {design.saree_style && (
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase">
                          Saree Style
                        </div>
                        <div className="text-sm font-medium break-words text-gray-900">
                          {formatValue(design.saree_style)}
                        </div>
                      </div>
                    )}
                    {design.label && (
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase">
                          Label
                        </div>
                        <div className="text-sm font-medium break-words text-gray-900">
                          {formatValue(design.label)}
                        </div>
                      </div>
                    )}
                    {design.jacquard_type && (
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase">
                          Jacquard Type
                        </div>
                        <div className="text-sm font-medium break-words text-gray-900">
                          {formatValue(design.jacquard_type)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Technical */}
              <div>
                <div className="mb-2 border-b border-[var(--color-primary-light)] pb-1 text-xs font-bold tracking-wider text-[var(--color-primary)] uppercase">
                  Technical Specifications
                </div>
                <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-3">
                  {design.cards && (
                    <div>
                      <div className="text-[10px] text-gray-400 uppercase">
                        Cards
                      </div>
                      <div className="text-sm font-medium break-words text-gray-900">
                        {design.cards}
                      </div>
                    </div>
                  )}
                  {design.hooks && (
                    <div>
                      <div className="text-[10px] text-gray-400 uppercase">
                        Hooks
                      </div>
                      <div className="text-sm font-medium break-words text-gray-900">
                        {design.hooks}
                      </div>
                    </div>
                  )}
                  {design.epi && (
                    <div>
                      <div className="text-[10px] text-gray-400 uppercase">
                        EPI
                      </div>
                      <div className="text-sm font-medium break-words text-gray-900">
                        {design.epi}
                      </div>
                    </div>
                  )}
                  {design.ppi && (
                    <div>
                      <div className="text-[10px] text-gray-400 uppercase">
                        PPI
                      </div>
                      <div className="text-sm font-medium break-words text-gray-900">
                        {design.ppi}
                      </div>
                    </div>
                  )}
                  {design.body_epi && (
                    <div>
                      <div className="text-[10px] text-gray-400 uppercase">
                        Body EPI
                      </div>
                      <div className="text-sm font-medium break-words text-gray-900">
                        {design.body_epi}
                      </div>
                    </div>
                  )}
                  {design.border_epi && (
                    <div>
                      <div className="text-[10px] text-gray-400 uppercase">
                        Border EPI
                      </div>
                      <div className="text-sm font-medium break-words text-gray-900">
                        {design.border_epi}
                      </div>
                    </div>
                  )}
                  {design.total_hooks && (
                    <div>
                      <div className="text-[10px] text-gray-400 uppercase">
                        Total Hooks
                      </div>
                      <div className="text-sm font-medium break-words text-gray-900">
                        {design.total_hooks}
                      </div>
                    </div>
                  )}
                  {design.br_hooks && (
                    <div>
                      <div className="text-[10px] text-gray-400 uppercase">
                        BR Hooks
                      </div>
                      <div className="text-sm font-medium break-words text-gray-900">
                        {design.br_hooks}
                      </div>
                    </div>
                  )}
                  {design.by_hooks && (
                    <div>
                      <div className="text-[10px] text-gray-400 uppercase">
                        BY Hooks
                      </div>
                      <div className="text-sm font-medium break-words text-gray-900">
                        {design.by_hooks}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
