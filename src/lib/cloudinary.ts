import { v2 as cloudinary } from "cloudinary";

import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} from "./constants";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export const deleteImageFromCloudinary = async (imageUrl: string) => {
  if (!imageUrl) return;

  try {
    // Extract public_id from the URL
    // URL format example: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/filename.jpg

    // Fallback for URLs without versioning or different structure if needed
    // But typically Cloudinary URLs have versioning.
    // Let's try a more robust regex that captures everything after 'upload/' and before extension

    // Example: https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg -> sample
    // Example: https://res.cloudinary.com/demo/image/upload/sample.jpg -> sample
    // Example: https://res.cloudinary.com/demo/image/upload/v1612345678/folder/subfolder/image_id.jpg -> folder/subfolder/image_id

    const parts = imageUrl.split("/upload/");
    if (parts.length < 2) return;

    // Correct approach:
    // 1. Get the part after "upload/"
    // 2. Remove version "v12345/" if present? Actually destroy method needs the public_id which INCLUDES folders but EXCLUDES extension.

    let pathPart = parts[1];
    // Remove version prefix if exists (e.g., v1234567890/)
    pathPart = pathPart.replace(/^v\d+\//, "");

    // Remove extension
    const lastDotIndex = pathPart.lastIndexOf(".");
    const publicId =
      lastDotIndex !== -1 ? pathPart.substring(0, lastDotIndex) : pathPart;

    console.log(`Deleting image from Cloudinary: ${publicId}`);

    const result = await cloudinary.uploader.destroy(publicId);
    console.log(`Deletion result for ${publicId}:`, result);
    return result;
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    // We don't throw here to avoid failing the main request (user update, etc.) just because cleanup failed
  }
};
