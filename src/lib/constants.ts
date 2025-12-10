// public env vars
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://project.com";
export const PROJECT_NAME = process.env.NEXT_PUBLIC_PROJECT_NAME ?? "Project";
export const PROJECT_LONGNAME =
  process.env.NEXT_PUBLIC_PROJECT_LONGNAME ?? "My Project Name";
export const PROJECT_EMAIL =
  process.env.NEXT_PUBLIC_PROJECT_EMAIL ?? "admin@project.com";

// shared constants
export enum USER_STATUS {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DISABLED = "DISABLED",
}
export enum USER_ROLE {
  USER = "USER",
  FISHER = "FISHER",
  OFFICER = "OFFICER",
  ADMIN = "ADMIN",
}

export const AVATAR_MAX_BYTES = Number(2 * 1024 * 1024); // 2MB
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB per image
export const MAX_IMAGES = 6;
