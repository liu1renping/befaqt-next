// public env vars
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://company.com";
export const COMPANY_NAME = process.env.NEXT_PUBLIC_COMPANY_NAME ?? "Company";
export const COMPANY_LONGNAME =
  process.env.NEXT_PUBLIC_COMPANY_LONGNAME ?? "Company Long Name";
export const COMPANY_DESCRIPTION =
  process.env.NEXT_PUBLIC_COMPANY_DESCRIPTION ?? "company description";
export const COMPANY_EMAIL =
  process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? "admin@company.com";

// cloudinary env vars
export const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
export const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "";
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY ?? "";
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET ?? "";

// shared constants
export enum USER_STATUS {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DISABLED = "DISABLED",
}
export enum USER_ROLE {
  USER = "USER",
  SELLER = "SELLER",
  BUYER = "BUYER",
  ADMIN = "ADMIN",
}
export enum PRODUCT_UNIT {
  KG = "kg",
  BOX = "box",
  PIECE = "piece",
}

export const MAX_AVATAR_SIZE = Number(2 * 1024 * 1024); // 2MB
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB per image
export const MAX_IMAGES = 6;
