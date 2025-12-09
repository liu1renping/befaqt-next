// public env vars
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://project.com";
export const PROJECT_NAME = process.env.NEXT_PUBLIC_PROJECT_NAME ?? "Project";
export const PROJECT_LONGNAME =
  process.env.NEXT_PUBLIC_PROJECT_LONGNAME ?? "Mud Crab Traceability";
export const PROJECT_EMAIL =
  process.env.NEXT_PUBLIC_PROJECT_EMAIL ?? "admin@project.com";

// private env vars
export const MONGODB_URI =
  process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/project";
export const JWT_SECRET =
  process.env.JWT_SECRET ?? "befaqt_jwt_secret_fprhkHOyYhco";
export const JWT_NAME = process.env.JWT_NAME ?? "befaqt_jwt";

// expiration duration for JWT tokens, used signSession
export const JWT_EXPIRATION = "7d"; // 7 days
// expiration duration for JWT cookies in milliseconds, used in cookies.set
export const JWT_SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

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

export const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

export const AVATAR_MAX_BYTES = Number(2 * 1024 * 1024); // 2MB
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB per image
export const MAX_IMAGES = 6;
