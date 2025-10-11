import { useEffect, useState } from "react";
import ImagesSection from "./ImagesSection";
import DesignForm, { DesignFormData } from "./DesignForm";
import { createDesign } from "../../Api";
import { Toast } from "flowbite-react";
import { HiExclamation } from "react-icons/hi";

const NewDesign = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formResetKey, setFormResetKey] = useState(0);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--color-primary-dark", "#3e0703");
    root.style.setProperty("--color-primary", "#8c1007");
    root.style.setProperty("--color-primary-light", "#fff0c4");
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleFormSubmit = async (data: DesignFormData) => {
    try {
      const response = await createDesign(data);
      if (response.ok) {
        const result = await response.json();
        setSuccessMessage(result.message || "Design created successfully");
        setFormResetKey(prev => prev + 1);
      } else {
        console.error("API error:", await response.text());
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white lg:h-screen lg:overflow-hidden">
      {successMessage && (
        <div className="animate-fade-in fixed top-5 right-5 z-50">
          <Toast className="flex items-center rounded-none border-l-4 border-l-[var(--color-primary-light)] bg-white p-2 shadow-2xl">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]">
              <HiExclamation className="h-4 w-4" />
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

      <div className="bg-white px-4 py-2">
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ color: "var(--color-primary-dark)" }}
            >
              New Design
            </h1>
            <p className="text-sm" style={{ color: "var(--color-primary)" }}>
              Create and manage your design assets
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div
          className="grid h-full grid-cols-1 gap-6 p-4 lg:grid-cols-2"
          style={{ borderColor: "var(--color-primary-dark)" }}
        >
          <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="flex-1 overflow-y-auto p-4">
              <DesignForm
                key={formResetKey}
                onSubmit={handleFormSubmit}
              />
            </div>
          </div>
          <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="flex-1 overflow-hidden">
              <ImagesSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewDesign;