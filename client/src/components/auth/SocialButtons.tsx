"use client";

import { Button } from "@/components/ui/button";
import { SiGoogle, SiGithub } from "@icons-pack/react-simple-icons";
import { authClient } from "@/lib/auth";
import { IS_CLOUD } from "@/lib/const";
import { features } from "@/lib/features";

interface SocialButtonsProps {
  onError: (error: string) => void;
  callbackURL?: string;
  mode?: "signin" | "signup";
  className?: string;
}

export function SocialButtons({ onError, callbackURL, mode = "signin", className = "" }: SocialButtonsProps) {
  // Show social buttons if in cloud mode OR if OAuth features are enabled for self-hosted
  if (!IS_CLOUD && !features.googleOAuth && !features.githubOAuth) return null;

  const handleSocialAuth = async (provider: "google" | "github" | "twitter") => {
    try {
      await authClient.signIn.social({
        provider,
        ...(callbackURL && mode !== "signup" ? { callbackURL } : {}),
        // For signup flow, new users should be redirected to the same callbackURL
        ...(mode === "signup" && callbackURL ? { newUserCallbackURL: callbackURL } : {}),
      });
    } catch (error) {
      onError(String(error));
    }
  };

  return (
    <>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="text-muted-foreground">Or continue with</span>
      </div>

      <div className={`flex flex-col gap-2 ${className}`}>
        {(IS_CLOUD || features.googleOAuth) && (
          <Button type="button" onClick={() => handleSocialAuth("google")}>
            <SiGoogle />
            Google
          </Button>
        )}
        {(IS_CLOUD || features.githubOAuth) && (
          <Button type="button" onClick={() => handleSocialAuth("github")}>
            <SiGithub />
            GitHub
          </Button>
        )}
      </div>
    </>
  );
}
