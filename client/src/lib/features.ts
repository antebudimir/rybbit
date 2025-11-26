/**
 * Client-Side Feature Flags
 *
 * This module provides feature flags for the client app.
 * Feature availability is determined by server config passed via env vars.
 */

import { IS_CLOUD } from "./const";

interface ClientFeatureFlags {
  // Analytics Features
  webVitals: boolean;
  errorTracking: boolean;
  sessionReplay: boolean;

  // Integration Features
  googleSearchConsole: boolean;
  googleOAuth: boolean;
  githubOAuth: boolean;

  // UI Features
  networkSection: boolean;
  searchConsoleSection: boolean;
  networkFilters: boolean; // VPN/Crawler/ASN filters

  // Cloud-Only Features
  stripeBilling: boolean;
  usageLimits: boolean;
}

/**
 * Feature Flags Config for Client
 *
 * Features are enabled based on:
 * 1. Default enablement for self-hosted
 * 2. Cloud status
 * 3. Explicit environment variables
 */
export const features: ClientFeatureFlags = {
  // Analytics Features
  // Cloud: Always enabled (subscription-gated in UI)
  // Self-hosted: Enabled by default (opt-out)
  webVitals: IS_CLOUD ? true : process.env.NEXT_PUBLIC_ENABLE_WEB_VITALS !== "false",
  errorTracking: IS_CLOUD ? true : process.env.NEXT_PUBLIC_ENABLE_ERROR_TRACKING !== "false",
  sessionReplay: IS_CLOUD ? true : process.env.NEXT_PUBLIC_ENABLE_SESSION_REPLAY === "true",

  // Integration Features
  // Cloud: Always enabled
  // Self-hosted: Enabled by default (opt-out)
  googleSearchConsole: IS_CLOUD ? true : process.env.NEXT_PUBLIC_ENABLE_GSC !== "false",
  googleOAuth: IS_CLOUD ? true : process.env.NEXT_PUBLIC_ENABLE_GOOGLE_OAUTH !== "false",
  githubOAuth: IS_CLOUD ? true : process.env.NEXT_PUBLIC_ENABLE_GITHUB_OAUTH !== "false",

  // UI Features
  // Cloud: Always enabled
  // Self-hosted: Enabled by default (opt-out)
  networkSection: true,
  searchConsoleSection: IS_CLOUD ? true : process.env.NEXT_PUBLIC_ENABLE_GSC !== "false",
  networkFilters: true,

  // Cloud-Only Features
  stripeBilling: IS_CLOUD,
  usageLimits: IS_CLOUD,
};

export const isFeatureEnabled = (feature: keyof ClientFeatureFlags): boolean => {
  return features[feature];
};

export const getEnabledFeatures = (): string[] => {
  return Object.entries(features)
    .filter(([_, enabled]) => enabled)
    .map(([feature]) => feature);
};

export const logFeatureStatus = (): void => {
  if (process.env.NODE_ENV === "development") {
    console.log("Client Feature Flags:", {
      enabled: getEnabledFeatures(),
      isCloud: IS_CLOUD,
    });
  }
};
