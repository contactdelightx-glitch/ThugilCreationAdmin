// Define environment variable type for VITE_API_BASE_URL
const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL;

// Interface for the response from the presigned URL API
interface PresignedUrlResponse {
  success: boolean;
  url?: string;
  error?: string;
}

// Define the s3Service object with typed methods
export const s3Service = {
  // Get presigned download URL from backend
  async getPresignedDownloadUrl(
    key: string,
    filename: string = "download",
  ): Promise<string> {
    try {
      // Don't encode the key here - let the backend handle it properly
      const response = await fetch(
        `${API_BASE_URL}/presigned/download?key=${key}&filename=${encodeURIComponent(filename)}`,
      );

      if (!response.ok) {
        throw new Error(`Failed to get download URL: ${response.statusText}`);
      }

      const data: PresignedUrlResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to generate download URL");
      }

      return data.url!;
    } catch (error: unknown) {
      console.error("Error getting pre-signed URL:", error);
      throw error;
    }
  },

  // Download file using presigned URL - FIXED VERSION
  async downloadFile(
    key: string,
    filename: string = "download",
  ): Promise<boolean> {
    try {
      const presignedUrl: string = await this.getPresignedDownloadUrl(
        key,
        filename,
      );

      // Method 1: Fetch and create blob (recommended for forcing download)
      const response: Response = await fetch(presignedUrl);
      const blob: Blob = await response.blob();

      // Create a temporary anchor element to trigger download
      const a: HTMLAnchorElement = document.createElement("a");
      const url: string = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = filename;
      a.style.display = "none";

      document.body.appendChild(a);
      a.click();

      // Cleanup
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error: unknown) {
      console.error("Error downloading file:", error);
      throw error;
    }
  },

  // Alternative method: Direct download without blob (if above doesn't work)
  async downloadFileDirect(
    key: string,
    filename: string = "download",
  ): Promise<boolean> {
    try {
      const presignedUrl: string = await this.getPresignedDownloadUrl(
        key,
        filename,
      );

      // Create a temporary anchor element
      const a: HTMLAnchorElement = document.createElement("a");
      a.href = presignedUrl;
      a.download = filename;
      a.target = "_blank"; // Open in new tab if download attribute not supported
      a.style.display = "none";

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      return true;
    } catch (error: unknown) {
      console.error("Error downloading file:", error);
      throw error;
    }
  },

  // Extract S3 key from full URL (helper function)
  extractS3Key(imageUrl: string | null): string | null {
    if (!imageUrl) return null;

    // If it's a full S3 URL, extract the key
    if (imageUrl.includes(".amazonaws.com/")) {
      const urlParts: string[] = imageUrl.split(".amazonaws.com/");
      if (urlParts.length > 1) {
        // Return the key exactly as it appears in the URL
        return urlParts[1];
      }
    }

    // If it's already just the key, return as is
    return imageUrl;
  },

  // Get filename from key or URL
  getFilenameFromKey(key: string | null): string {
    if (!key) return "download";

    // Extract filename from key (last part after /)
    const parts: string[] = key.split("/");
    let filename: string = parts[parts.length - 1] || "download";

    // Decode any encoded characters in the filename
    try {
      filename = decodeURIComponent(filename);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e: unknown) {
      console.warn("Could not decode filename:", filename);
    }

    return filename;
  },
};

export default s3Service;
