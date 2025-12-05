import { put } from "@vercel/blob";

/**
 * Get the Vercel Blob token based on environment
 * Development: Uses VITE_BLOB_READ_WRITE_TOKEN
 * Production: Uses VERCEL_BLOB_READ_WRITE_TOKEN (Vercel automatically makes it available)
 */
const getBlobToken = () => {
  // Check if running on Vercel (production)
  const isVercelEnv = process.env.VERCEL === "1" || import.meta.env.PROD;

  // In development, use VITE_ prefixed variable
  // In production on Vercel, the token is automatically available
  const token = import.meta.env.VITE_BLOB_READ_WRITE_TOKEN;

  console.log("Environment check:", {
    isVercelEnv,
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD,
    tokenExists: !!token,
  });

  return token;
};

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

    // Get token from environment - automatically handles dev and production
    const token = getBlobToken();

    if (!token) {
      throw new Error(
        "Vercel Blob token not configured. " +
          "Development: Set VITE_BLOB_READ_WRITE_TOKEN in .env. " +
          "Production: Set VERCEL_BLOB_READ_WRITE_TOKEN in Vercel environment variables."
      );
    }

    // Upload using Vercel Blob SDK
    const blob = await put(`/product_images/${filename}`, file, {
      access: "public",
      token: token,
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
  const token = getBlobToken();

  if (!token) {
    return {
      configured: false,
      message: import.meta.env.DEV
        ? "Development: VITE_BLOB_READ_WRITE_TOKEN is not set in .env file"
        : "Production: VERCEL_BLOB_READ_WRITE_TOKEN is not configured in Vercel environment variables",
    };
  }

  return {
    configured: true,
    message: "Vercel Blob is properly configured",
  };
};
