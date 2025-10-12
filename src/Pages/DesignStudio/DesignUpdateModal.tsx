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

  const handleInputChange = (field: keyof Design, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
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
    const nonEditableFields = ["name", "email", "image_type", "saree_style", "label", "jacquard_type"];
    return currentMode === "edit" && !nonEditableFields.includes(field);
  };

  const renderField = (field: keyof Design, _label: string, value: any) => {
    if (isEditable(field)) {
      return (
        <input
          type="text"
          value={formData[field] || ""}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="w-full border border-gray-300 px-2 py-1 text-xs focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none sm:text-sm"
        />
      );
    }

    return (
      <div className="text-xs font-medium break-words text-gray-900 sm:text-sm">
        {value ? formatValue(value) : "-"}
      </div>
    );
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
                  src={design.original_image_url}
                  alt=""
                  className={`h-8 w-8 border border-white/30 object-cover sm:h-10 sm:w-10 ${isHeaderImageLoaded ? "opacity-100" : "opacity-0"}`}
                  onLoad={() => setIsHeaderImageLoaded(true)}
                  onError={() => setIsHeaderImageLoaded(true)}
                />
              </div>
            )}
            <div>
              <h2 className="text-sm font-semibold text-white sm:text-base">
                {design.name ? formatValue(design.name) : "Design Details"}
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
              {design.original_image_url && (
                <div className="relative h-[120px] w-full sm:h-[150px] md:aspect-square md:h-auto">
                  {!isSidebarImageLoaded && (
                    <div className="absolute inset-0 animate-pulse bg-[var(--color-primary-light)]" />
                  )}
                  <img
                    src={design.original_image_url}
                    alt=""
                    className={`h-full w-full border border-gray-300 object-cover ${isSidebarImageLoaded ? "opacity-100" : "opacity-0"}`}
                    onLoad={() => setIsSidebarImageLoaded(true)}
                    onError={() => setIsSidebarImageLoaded(true)}
                  />
                </div>
              )}

              <div className="flex flex-col gap-2 sm:flex-row md:flex-col">
                {(design.final_price || design.listing_rate) && (
                  <div className="flex flex-1 items-center justify-center gap-2 bg-gradient-to-br from-[var(--color-primary-dark)] to-[var(--color-primary)] p-2 text-center text-white shadow-md transition-transform hover:scale-[1.02]">
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

            <div className="space-y-3 p-3 md:col-span-2 md:space-y-5 md:p-5">
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
                        {renderField("name", "Name", design.name)}
                      </div>
                    )}
                    {design.email && (
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase">
                          Email
                        </div>
                        {renderField("email", "Email", design.email)}
                      </div>
                    )}
                    {design.image_type && (
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase">
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
                        <div className="text-[10px] text-gray-400 uppercase">
                          Harness Build
                        </div>
                        {renderField(
                          "harnessbuild",
                          "Harness Build",
                          design.harnessbuild,
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

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
                        {renderField(
                          "saree_style",
                          "Saree Style",
                          design.saree_style,
                        )}
                      </div>
                    )}
                    {design.label && (
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase">
                          Label
                        </div>
                        {renderField("label", "Label", design.label)}
                      </div>
                    )}
                    {design.jacquard_type && (
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase">
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
                        {renderField("cards", "Cards", design.cards)}
                      </div>
                    )}
                    {design.hooks && (
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase">
                          Hooks
                        </div>
                        {renderField("hooks", "Hooks", design.hooks)}
                      </div>
                    )}
                    {design.epi && (
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase">
                          EPI
                        </div>
                        {renderField("epi", "EPI", design.epi)}
                      </div>
                    )}
                    {design.ppi && (
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase">
                          PPI
                        </div>
                        {renderField("ppi", "PPI", design.ppi)}
                      </div>
                    )}
                    {design.body_epi && (
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase">
                          Body EPI
                        </div>
                        {renderField("body_epi", "Body EPI", design.body_epi)}
                      </div>
                    )}
                    {design.border_epi && (
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase">
                          Border EPI
                        </div>
                        {renderField(
                          "border_epi",
                          "Border EPI",
                          design.border_epi,
                        )}
                      </div>
                    )}
                    {design.total_hooks && (
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase">
                          Total Hooks
                        </div>
                        {renderField(
                          "total_hooks",
                          "Total Hooks",
                          design.total_hooks,
                        )}
                      </div>
                    )}
                    {design.br_hooks && (
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase">
                          BR Hooks
                        </div>
                        {renderField("br_hooks", "BR Hooks", design.br_hooks)}
                      </div>
                    )}
                    {design.by_hooks && (
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase">
                          BY Hooks
                        </div>
                        {renderField("by_hooks", "BY Hooks", design.by_hooks)}
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
              disabled={saving}
              className="inline-flex w-full justify-center items-center gap-2 rounded-md bg-[var(--color-primary)] px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[var(--color-primary-dark)] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => setCurrentMode("view")}
              className="mt-3 inline-flex w-full justify-center items-center gap-2 rounded-md bg-white px-3 py-2 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
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