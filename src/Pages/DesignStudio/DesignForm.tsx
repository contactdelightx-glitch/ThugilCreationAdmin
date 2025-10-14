import { useState, useEffect } from "react";
import { Label, TextInput, Select, Button, Alert } from "flowbite-react";
import {
  IndianRupee,
  ImageIcon,
  Link,
  FileText,
  Tag,
  Mail,
  Layers,
  Grid,
  Hash,
  Globe,
  Package,
} from "lucide-react";

type DesignType =
  | "Butta"
  | "Pallu"
  | "Border"
  | "Embose"
  | "Brocade"
  | "Pattern"
  | "Full Set"
  | "Free Images";

const fieldConfig: Record<DesignType, string[]> = {
  Butta: ["designImageUrl", "designName", "imageType", "hooks", "cards", "ppi", "epi", "harnessbuild", "listingRate", "finalPrice", "label", "emailDropdown", "originalImageUrl"],
  Pallu: ["designImageUrl", "designName", "imageType", "hooks", "cards", "ppi", "epi", "harnessbuild", "listingRate", "finalPrice", "label", "emailDropdown", "originalImageUrl"],
  Border: ["designImageUrl", "designName", "imageType", "hooks", "cards", "ppi", "epi", "harnessbuild", "listingRate", "finalPrice", "label", "emailDropdown", "originalImageUrl"],
  Embose: ["designImageUrl", "designName", "imageType", "hooks", "cards", "ppi", "epi", "harnessbuild", "listingRate", "finalPrice", "label", "emailDropdown", "originalImageUrl"],
  Brocade: ["designImageUrl", "designName", "imageType", "hooks", "cards", "ppi", "epi", "harnessbuild", "listingRate", "finalPrice", "label", "emailDropdown", "originalImageUrl"],
  Pattern: ["designImageUrl", "designName", "imageType", "hooks", "cards", "ppi", "epi", "harnessbuild", "listingRate", "finalPrice", "label", "emailDropdown", "originalImageUrl"],
  "Full Set": ["designImageUrl", "designName", "imageType", "brHooks", "byHooks", "epiBody", "epiBorder", "ppi", "jacquard", "listingRate", "finalPrice", "label", "emailDropdown", "originalImageUrl"],
  "Free Images": ["designName", "designImageUrl", "redirectUrl"],
};

interface TextField {
  label: string;
  type: "text" | "number";
  required: true;
  icon: React.ReactNode;
}
interface SelectField {
  label: string;
  type: "select";
  options: string[];
  required: true;
  icon: React.ReactNode;
}
type FieldMetadata = TextField | SelectField;

const fieldMetadata: Record<string, FieldMetadata> = {
  designImageUrl: { label: "Design Image URL", type: "text", required: true, icon: <ImageIcon className="h-4 w-4" /> },
  hooks: { label: "Hooks", type: "text", required: true, icon: <Hash className="h-4 w-4" /> },
  imageType: { label: "Image Type", type: "select", options: ["jpg", "png", "BMP"], required: true, icon: <FileText className="h-4 w-4" /> },
  ppi: { label: "PPI", type: "number", required: true, icon: <Grid className="h-4 w-4" /> },
  designName: { label: "Design Name", type: "text", required: true, icon: <Tag className="h-4 w-4" /> },
  cards: { label: "Cards", type: "text", required: true, icon: <Layers className="h-4 w-4" /> },
  epi: { label: "EPI", type: "number", required: true, icon: <Grid className="h-4 w-4" /> },
  harnessbuild: { label: "Harnessbuild", type: "text", required: true, icon: <Package className="h-4 w-4" /> },
  listingRate: { label: "Listing Rate (₹)", type: "number", required: true, icon: <IndianRupee className="h-4 w-4" /> },
  finalPrice: { label: "Final Price (₹)", type: "number", required: true, icon: <IndianRupee className="h-4 w-4" /> },
  label: { label: "Label", type: "select", options: ["new", "sale", "featured"], required: true, icon: <Tag className="h-4 w-4" /> },
  emailDropdown: { label: "Email Dropdown", type: "select", options: JSON.parse(localStorage.getItem("emails") || "[]"), required: true, icon: <Mail className="h-4 w-4" /> },
  originalImageUrl: { label: "Original Image URL", type: "text", required: true, icon: <Link className="h-4 w-4" /> },
  brHooks: { label: "BR Hooks", type: "text", required: true, icon: <Hash className="h-4 w-4" /> },
  byHooks: { label: "BY Hooks", type: "text", required: true, icon: <Hash className="h-4 w-4" /> },
  epiBody: { label: "EPI Body", type: "number", required: true, icon: <Grid className="h-4 w-4" /> },
  epiBorder: { label: "EPI Border", type: "number", required: true, icon: <Grid className="h-4 w-4" /> },
  jacquard: { label: "Jacquard", type: "select", options: ["handloom", "powerloom", "rapier"], required: true, icon: <Globe className="h-4 w-4" /> },
  redirectUrl: { label: "Redirect URL", type: "text", required: true, icon: <Link className="h-4 w-4" /> },
};

export interface DesignFormData {
  [key: string]: string | number;
}

interface DesignFormProps {
  onSubmit: (data: DesignFormData) => Promise<void>;
}

const extractUrls = (input: string): string[] => {
  if (!input) return [];
  return input
    .split(/[\s,\n]+/)
    .map(url => url.trim())
    .filter(url => url && (url.startsWith('http://') || url.startsWith('https://')));
};

const DesignForm = ({ onSubmit }: DesignFormProps) => {
  const [designType, setDesignType] = useState<DesignType>("Butta");
  const [formData, setFormData] = useState<DesignFormData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize emailDropdown with single email if only one exists
  useEffect(() => {
    const emails = JSON.parse(localStorage.getItem("emails") || "[]");
    if (emails.length === 1 && fieldConfig[designType].includes("emailDropdown")) {
      setFormData((prev) => ({ ...prev, emailDropdown: emails[0] }));
    }
  }, [designType]);

  const validatePriceFields = (currentData: DesignFormData) => {
    const listingRate = Number(currentData.listingRate);
    const finalPrice = Number(currentData.finalPrice);

    const hasPriceFields =
      fieldConfig[designType].includes("listingRate") &&
      fieldConfig[designType].includes("finalPrice");

    if (!hasPriceFields) return {};

    const newErrors: Record<string, string> = {};

    if (isNaN(listingRate) || listingRate <= 0) {
      newErrors.listingRate = "Must be a positive number";
    }
    if (isNaN(finalPrice) || finalPrice <= 0) {
      newErrors.finalPrice = "Must be a positive number";
    }
    if (!isNaN(listingRate) && !isNaN(finalPrice) && finalPrice > listingRate) {
      newErrors.finalPrice = "Cannot be greater than Listing Rate";
    }

    return newErrors;
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      if (field === "listingRate" || field === "finalPrice") {
        const priceErrors = validatePriceFields(newData);
        setErrors((prevErrors) => {
          const updated = { ...prevErrors };
          delete updated.listingRate;
          delete updated.finalPrice;
          if (priceErrors.listingRate) updated.listingRate = priceErrors.listingRate;
          if (priceErrors.finalPrice) updated.finalPrice = priceErrors.finalPrice;
          return updated;
        });
      }

      return newData;
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = { ...errors };

    const requiredFields = fieldConfig[designType];
    for (const field of requiredFields) {
      if (field === "listingRate" || field === "finalPrice") continue;

      const value = formData[field];
      if (value === undefined || value === "" || (typeof value === "number" && isNaN(value))) {
        newErrors[field] = `${fieldMetadata[field]?.label || field} is required.`;
      } else {
        delete newErrors[field];
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await onSubmit({ designType, email: formData.emailDropdown, ...formData });
      setFormData({});
      setDesignType("Butta");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (fieldName: string) => {
    const meta = fieldMetadata[fieldName];
    if (!meta) return null;
    const value = formData[fieldName] ?? "";

    const isImageUrlField = fieldName === "designImageUrl" || fieldName === "originalImageUrl";
    const urls = isImageUrlField && typeof value === "string" ? extractUrls(value) : [];

    if (meta.type === "select") {
      const isEmailDropdown = fieldName === "emailDropdown";
      const emailOptions = isEmailDropdown ? JSON.parse(localStorage.getItem("emails") || "[]") : (meta as SelectField).options;
      const isDisabled = isEmailDropdown && emailOptions.length === 1;

      return (
        <>
          <Select
            id={fieldName}
            value={isEmailDropdown && emailOptions.length === 1 ? emailOptions[0] : (value as string)}
            onChange={(e) => handleInputChange(fieldName, e.target.value)}
            required
            disabled={isDisabled}
            className="text-black"
            style={{
              borderRadius: "0px",
              backgroundColor: "#fff0c4",
              color: "#000000",
              padding: "8px 12px",
              fontSize: "15px",
              border: "1px solid #d1d5db",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            {!isDisabled && <option value="">Select {meta.label.replace(" (₹)", "")}</option>}
            {emailOptions.map((option: string) => (
              <option key={option} value={option} className="text-black">
                {option}
              </option>
            ))}
          </Select>
          {errors[fieldName] && (
            <p className="mt-1 text-xs text-red-600">{errors[fieldName]}</p>
          )}
        </>
      );
    }

    return (
      <div className="relative">
        <TextInput
          id={fieldName}
          type={meta.type === "number" ? "number" : "text"}
          value={value as string}
          onChange={(e) =>
            handleInputChange(
              fieldName,
              meta.type === "number" ? (e.target.value === "" ? NaN : Number(e.target.value)) : e.target.value
            )
          }
          placeholder={`Enter ${meta.label.toLowerCase().replace(" (₹)", "")}`}
          required
          className="text-black"
          style={{
            borderRadius: "0px",
            backgroundColor: "#fff0c4",
            color: "#000000",
            padding: "8px 12px",
            fontSize: "15px",
            border: "1px solid #d1d5db",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          }}
        />
        {isImageUrlField && typeof value === "string" && (
          <div className="mt-1 text-xs text-gray-600 flex items-center gap-1">
            <ImageIcon className="h-3 w-3" />
            {urls.length} image link{urls.length !== 1 ? "s" : ""} detected
          </div>
        )}
        {errors[fieldName] && (
          <p className="mt-1 text-xs text-red-600">{errors[fieldName]}</p>
        )}
      </div>
    );
  };

  const fields = fieldConfig[designType];
  const midPoint = Math.ceil(fields.length / 2);
  const firstColumnFields = fields.slice(0, midPoint);
  const secondColumnFields = fields.slice(midPoint);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-5">
        <Label
          htmlFor="designType"
          className="flex items-center gap-2 text-base font-semibold mb-2"
          style={{ color: "#000000" }}
        >
          <Tag className="h-4 w-4" />
          Design Type
        </Label>
        <Select
          id="designType"
          value={designType}
          onChange={(e) => setDesignType(e.target.value as DesignType)}
          required
          className="text-black"
          style={{
            borderRadius: "0px",
            backgroundColor: "#fff0c4",
            color: "#000000",
            padding: "8px 12px",
            fontSize: "15px",
            border: "1px solid #d1d5db",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          }}
        >
          {Object.keys(fieldConfig).map((type) => (
            <option key={type} value={type} className="text-black">
              {type}
            </option>
          ))}
        </Select>
      </div>

      {Object.keys(errors).length > 0 && (
        <Alert color="failure" className="mb-4">
          Please fix the errors below before submitting.
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-4">
          {firstColumnFields.map((field) => {
            const meta = fieldMetadata[field];
            return (
              <div key={field} className="space-y-1.5">
                <Label
                  htmlFor={field}
                  className="flex items-center gap-2 text-sm font-medium"
                  style={{ color: "#000000" }}
                >
                  {meta?.icon}
                  {meta?.label} *
                </Label>
                {renderField(field)}
              </div>
            );
          })}
        </div>

        <div className="space-y-4">
          {secondColumnFields.map((field) => {
            const meta = fieldMetadata[field];
            return (
              <div key={field} className="space-y-1.5">
                <Label
                  htmlFor={field}
                  className="flex items-center gap-2 text-sm font-medium"
                  style={{ color: "#000000" }}
                >
                  {meta?.icon}
                  {meta?.label} *
                </Label>
                {renderField(field)}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 pt-4">
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-2.5 text-base font-semibold text-white transition-all duration-300 hover:opacity-95"
          style={{
            backgroundColor: "var(--color-primary)",
            borderRadius: "0px",
            border: "1px solid var(--color-primary-dark)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {isSubmitting ? "Submitting..." : "Submit Design"}
        </Button>
      </div>

      <style>{`
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
        .flowbite-react-select select {
          padding: 8px 12px !important;
        }
      `}</style>
    </div>
  );
};

export default DesignForm;