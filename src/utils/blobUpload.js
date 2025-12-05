import { put } from "@vercel/blob";

/**
 * Upload an image file to Vercel Blob Storage using the official SDK
 * @param {File} file - The image file to upload
 * @returns {Promise<{success: boolean, blobUrl: string, error?: string}>}
 */
export const uploadImageToBlob = async (file) => {
  if (!file) {
    return {
      success: false,
      error: "No file provided",
    };
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    return {
      success: false,
      error: "File must be an image",
    };
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return {
      success: false,
      error: "File size must be less than 5MB",
    };
  }

  try {
    // Generate a unique filename with timestamp
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 9);
    const filename = `${timestamp}-${randomStr}-${file.name}`;

    console.log("Starting blob upload:", filename);

    // Upload using Vercel Blob SDK
    const blob = await put(`/product_images/${filename}`, file, {
      access: "public",
      token: import.meta.env.VITE_BLOB_READ_WRITE_TOKEN,
    });

    console.log("Image uploaded successfully:", blob.url);

    return {
      success: true,
      blobUrl: blob.url,
    };
  } catch (error) {
    console.error("Error uploading to Vercel Blob:", error);
    return {
      success: false,
      error:
        error.message ||
        "Failed to upload image. Check your VERCEL_BLOB_READ_WRITE_TOKEN",
    };
  }
};

/**
 * Upload image and return blob URL
 * Simplified wrapper for direct usage in components
 * @param {File} file - The image file
 * @returns {Promise<string|null>} - Returns blob URL or null on error
 */
export const uploadImageGetUrl = async (file) => {
  const result = await uploadImageToBlob(file);

  if (result.success) {
    return result.blobUrl;
  } else {
    console.error("Image upload failed:", result.error);
    return null;
  }
};

/**
 * Get information about the Vercel Blob token status
 * @returns {Promise<{configured: boolean, message: string}>}
 */
export const checkBlobConfiguration = async () => {
  const token = import.meta.env.VITE_BLOB_READ_WRITE_TOKEN;

  if (!token) {
    return {
      configured: false,
      message:
        "VITE_VERCEL_BLOB_READ_WRITE_TOKEN environment variable is not set",
    };
  }

  return {
    configured: true,
    message: "Vercel Blob is properly configured",
  };
};
