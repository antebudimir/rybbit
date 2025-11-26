export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL === "http://localhost:3001"
    ? "http://localhost:3001/api"
    : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`;
export const IS_CLOUD = process.env.NEXT_PUBLIC_CLOUD === "true";

// Turnstile is enabled if:
// 1. Explicitly set to true via NEXT_PUBLIC_ENABLE_TURNSTILE, OR
// 2. IS_CLOUD is true AND NEXT_PUBLIC_ENABLE_TURNSTILE is not explicitly set to false
export const ENABLE_TURNSTILE =
  process.env.NEXT_PUBLIC_ENABLE_TURNSTILE === "true" ||
  (IS_CLOUD && process.env.NEXT_PUBLIC_ENABLE_TURNSTILE !== "false");

// Time constants
export const MINUTES_IN_24_HOURS = 24 * 60; // 1440 minutes

export const DEMO_HOSTNAME = "demo.rybbit.com";

export const FREE_SITE_LIMIT = 1;
export const STANDARD_SITE_LIMIT = 5;
export const PRO_SITE_LIMIT = 100;

export const STANDARD_TEAM_LIMIT = 3;
export const PRO_TEAM_LIMIT = 10;
