/**
 * Feature Flag System
 *
 * This module provides a centralized feature flag system that's independent
 * of the IS_CLOUD flag. Features can be controlled by environment variables
 * or API key availability.
 */

import { IS_CLOUD } from "./const.js";

interface FeatureFlags {
  // Analytics Features
  webVitals: boolean;
  errorTracking: boolean;
  sessionReplay: boolean;

  // Email Features
  emailReports: boolean;
  emailSupport: boolean;

  // Geolocation Features
  enhancedGeolocation: boolean; // VPN/Crawler/ASN tracking via IPAPI

  // Integration Features
  googleSearchConsole: boolean;
  googleOAuth: boolean;
  githubOAuth: boolean;

  // UI Features
  networkSection: boolean;
  searchConsoleSection: boolean;

  // Cloud-Only Features
  stripeBilling: boolean;
  usageLimits: boolean;
  r2Storage: boolean;
}

const hasEnhancedGeolocation = (): boolean => {
  return !!process.env.IPAPI_KEY || IS_CLOUD;
};

const hasEmailSupport = (): boolean => {
  return !!process.env.RESEND_API_KEY;
};

const hasGoogleOAuth = (): boolean => {
  return !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
};

const hasGithubOAuth = (): boolean => {
  return !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);
};

const hasGoogleSearchConsole = (): boolean => {
  return hasGoogleOAuth();
};

/**
 * Feature Flags Config
 *
 * Self-hosted instances can enable features by:
 * 1. Features enabled by default (opt-out via env vars)
 * 2. Providing API keys (e.g., RESEND_API_KEY, IPAPI_KEY)
 * 3. OAuth credentials (e.g., GOOGLE_CLIENT_ID, GITHUB_CLIENT_ID)
 */
export const features: FeatureFlags = {
  // Analytics Features
  // Cloud: Always enabled
  // Self-hosted: Enabled by default (opt-out)
  webVitals: IS_CLOUD ? true : process.env.ENABLE_WEB_VITALS !== "false",
  errorTracking: IS_CLOUD ? true : process.env.ENABLE_ERROR_TRACKING !== "false",
  sessionReplay: IS_CLOUD ? true : process.env.ENABLE_SESSION_REPLAY === "true",

  // Email Features
  // Cloud: Always enabled
  // Self-hosted: Only if API key provided
  emailReports: IS_CLOUD || hasEmailSupport(),
  emailSupport: IS_CLOUD || hasEmailSupport(),

  // Geolocation Features
  // Cloud: Always enabled
  // Self-hosted: Only if IPAPI_KEY provided
  enhancedGeolocation: hasEnhancedGeolocation(),

  // Integration Features
  // Both: Only if OAuth credentials configured
  googleSearchConsole: hasGoogleSearchConsole(),
  googleOAuth: hasGoogleOAuth(),
  githubOAuth: hasGithubOAuth(),

  // UI Features
  // Cloud: Always enabled
  // Self-hosted: Enabled by default (opt-out)
  networkSection: true,
  searchConsoleSection: hasGoogleSearchConsole(),

  // Cloud-Only Features
  stripeBilling: IS_CLOUD,
  usageLimits: IS_CLOUD,
  r2Storage: IS_CLOUD && !!(process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY),
};

export const isFeatureEnabled = (feature: keyof FeatureFlags): boolean => {
  return features[feature];
};

export const getEnabledFeatures = (): string[] => {
  return Object.entries(features)
    .filter(([_, enabled]) => enabled)
    .map(([feature]) => feature);
};

export const logFeatureStatus = (logger: any): void => {
  const enabled = getEnabledFeatures();
  logger.info(
    {
      features: enabled,
      isCloud: IS_CLOUD,
      hasIPAPI: !!process.env.IPAPI_KEY,
      hasResend: !!process.env.RESEND_API_KEY,
      hasGoogleOAuth: hasGoogleOAuth(),
    },
    "Feature flags initialized"
  );
};
