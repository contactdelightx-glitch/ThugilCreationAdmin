import { useState } from "react";
import { HiX, HiUpload, HiPhotograph } from "react-icons/hi";
import { uploadImage } from "../../Api";

interface AddImagePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onImagesAdded: (images: File[]) => void;
}

const AddImagePopup = ({ isOpen, onClose, onImagesAdded }: AddImagePopupProps) => {
  const [singleImage, setSingleImage] = useState<File | null>(null);
  const [multipleImages, setMultipleImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Get email from token in localStorage
  const getEmailFromToken = (): string | null => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      // Decode JWT token to get email
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.email || payload.sub || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const handleSingleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSingleImage(file);
    }
  };

  const handleMultipleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setMultipleImages(Array.from(files));
    }
  };

  const handleSubmit = async () => {
    const allImages = [];
    if (singleImage) allImages.push(singleImage);
    allImages.push(...multipleImages);
    
    if (allImages.length > 0) {
      setIsUploading(true);
      setUploadProgress(0);
      
      try {
        const email = getEmailFromToken();
        if (!email) {
          throw new Error("User email not found. Please login again.");
        }

        // Upload images sequentially to track progress
        for (let i = 0; i < allImages.length; i++) {
          await uploadImage(allImages[i], email);
          setUploadProgress(((i + 1) / allImages.length) * 100);
        }
        
        onImagesAdded(allImages);
        resetForm();
        onClose();
      } catch (error) {
        console.error('Upload error:', error);
        alert(error instanceof Error ? error.message : 'Failed to upload images');
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    }
  };

  const resetForm = () => {
    setSingleImage(null);
    setMultipleImages([]);
  };

  const handleClose = () => {
    if (!isUploading) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div 
        className="bg-white w-11/12 max-w-4xl mx-auto rounded-none border border-[var(--color-primary-dark)]"
        style={{ borderRadius: "0px" }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 border-b border-[var(--color-primary-dark)]"
          style={{ backgroundColor: "var(--color-primary-dark)" }}
        >
          <h2 className="text-xl font-bold text-white">Add New Images</h2>
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="text-white hover:text-[var(--color-primary-light)] transition-colors disabled:opacity-50"
          >
            <HiX className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isUploading && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-[var(--color-primary-dark)] mb-2">
                <span>Uploading images...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-[var(--color-primary-light)] rounded-none h-2">
                <div 
                  className="bg-[var(--color-primary)] h-2 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Single Image Upload Column */}
            <div className="border border-[var(--color-primary)] p-4 rounded-none">
              <h3 className="text-lg font-semibold mb-4 text-[var(--color-primary-dark)] flex items-center gap-2">
                <HiPhotograph className="h-5 w-5" />
                Single Image Upload
              </h3>
              
              <div className="border-2 border-dashed border-[var(--color-primary-light)] p-6 text-center rounded-none hover:bg-[var(--color-primary-light)] transition-colors cursor-pointer">
                <input
                  type="file"
                  id="single-upload"
                  accept="image/*"
                  onChange={handleSingleImageUpload}
                  className="hidden"
                  disabled={isUploading}
                />
                <label htmlFor="single-upload" className={`cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <HiUpload className="h-8 w-8 mx-auto mb-2 text-[var(--color-primary)]" />
                  <p className="text-sm text-[var(--color-primary-dark)]">
                    Click to upload single image
                  </p>
                  <p className="text-xs text-[var(--color-primary)] mt-1">
                    PNG, JPG, JPEG up to 10MB
                  </p>
                </label>
              </div>

              {singleImage && (
                <div className="mt-4 p-3 bg-[var(--color-primary-light)] rounded-none">
                  <p className="text-sm text-[var(--color-primary-dark)] font-medium">
                    Selected: {singleImage.name}
                  </p>
                  <p className="text-xs text-[var(--color-primary)]">
                    Size: {(singleImage.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}
            </div>

            {/* Multiple Image Upload Column */}
            <div className="border border-[var(--color-primary)] p-4 rounded-none">
              <h3 className="text-lg font-semibold mb-4 text-[var(--color-primary-dark)] flex items-center gap-2">
                <HiPhotograph className="h-5 w-5" />
                Multiple Image Upload
              </h3>
              
              <div className="border-2 border-dashed border-[var(--color-primary-light)] p-6 text-center rounded-none hover:bg-[var(--color-primary-light)] transition-colors cursor-pointer">
                <input
                  type="file"
                  id="multiple-upload"
                  accept="image/*"
                  multiple
                  onChange={handleMultipleImageUpload}
                  className="hidden"
                  disabled={isUploading}
                />
                <label htmlFor="multiple-upload" className={`cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <HiUpload className="h-8 w-8 mx-auto mb-2 text-[var(--color-primary)]" />
                  <p className="text-sm text-[var(--color-primary-dark)]">
                    Click to upload multiple images
                  </p>
                  <p className="text-xs text-[var(--color-primary)] mt-1">
                    Select multiple PNG, JPG, JPEG files
                  </p>
                </label>
              </div>

              {multipleImages.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-[var(--color-primary-dark)]">
                    Selected {multipleImages.length} image(s):
                  </p>
                  <div className="max-h-32 overflow-y-auto">
                    {multipleImages.map((file, index) => (
                      <div
                        key={index}
                        className="p-2 bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] text-xs rounded-none mb-1"
                      >
                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--color-primary-light)]">
            <button
              onClick={handleClose}
              disabled={isUploading}
              className="px-6 py-2 border border-[var(--color-primary)] text-[var(--color-primary)] bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-none font-medium"
              style={{ borderRadius: "0px" }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={(!singleImage && multipleImages.length === 0) || isUploading}
              className="px-6 py-2 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors rounded-none font-medium"
              style={{ borderRadius: "0px" }}
            >
              {isUploading ? 'Uploading...' : 'Add Images'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddImagePopup;