"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

interface TurnstileProps {
  onSuccess: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  className?: string;
}

export function Turnstile({ onSuccess, onError, onExpire, className = "" }: TurnstileProps) {
  const turnstileRef = useRef<any>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const { theme } = useTheme();
  const [CloudflareTurnstile, setCloudfareTurnstile] = useState<any>(null);

  // Dynamically import Turnstile only on client-side
  useEffect(() => {
    import("@marsidev/react-turnstile").then(module => {
      setCloudfareTurnstile(() => module.Turnstile);
    });
  }, []);

  if (!siteKey) {
    console.error("NEXT_PUBLIC_TURNSTILE_SITE_KEY is not defined");
    return null;
  }

  if (!CloudflareTurnstile) {
    return <div className={className}>Loading...</div>;
  }

  return (
    <div className={className}>
      <CloudflareTurnstile
        ref={turnstileRef}
        siteKey={siteKey}
        onSuccess={onSuccess}
        onError={() => {
          console.error("Turnstile error");
          onError?.();
        }}
        onExpire={() => {
          console.warn("Turnstile token expired");
          onExpire?.();
        }}
        options={{
          theme: theme === "dark" ? "dark" : "auto",
          size: "normal",
        }}
      />
    </div>
  );
}
