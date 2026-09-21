"use client";

import { useEffect, useRef } from "react";
import api from "@/lib/api";

interface GoogleSignInButtonProps {
  text?: "continue_with" | "signin_with" | "signup_with";
  onSuccess: (user: any) => void;
  onError: (error: string) => void;
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
let gisInitialized = false;

export default function GoogleSignInButton({
  text = "continue_with",
  onSuccess,
  onError,
}: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const renderedRef = useRef(false);

  useEffect(() => {
    let intervalId: number | undefined;

    const mountGoogleButton = () => {
      const google = (window as any).google;
      if (!google?.accounts?.id || !containerRef.current) {
        return false;
      }

      if (!gisInitialized) {
        if (process.env.NODE_ENV === "development") {
          console.log("[Google Auth] Initializing GIS with Client ID:", GOOGLE_CLIENT_ID);
        }
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          ux_mode: "popup",
          callback: async (response: { credential?: string }) => {
            if (process.env.NODE_ENV === "development") {
              console.log("[Google Auth] GIS callback invoked. Credential present:", !!response.credential);
            }
            if (!response.credential) {
              onError("Google did not return a valid credential.");
              return;
            }

            try {
              if (process.env.NODE_ENV === "development") {
                console.log("[Google Auth] Posting payload to /auth/google...");
              }
              const res = await api.post("/auth/google", {
                credential: response.credential,
              });
              if (process.env.NODE_ENV === "development") {
                console.log("[Google Auth] Backend response status:", res.status);
              }
              const data = res.data;
              const user = data?.user || data?.data?.user;
              if (user) {
                onSuccess(user);
              } else {
                console.error("INVALID OAUTH RESPONSE CONTRACT", data);
                onError("Google authentication succeeded, but returned an invalid response.");
              }
            } catch (err: any) {
              if (process.env.NODE_ENV === "development") {
                console.error("[Google Auth] Post request failed:", err);
              }
              onError(err.response?.data?.message || "Google authentication failed");
            }
          },
        });
        gisInitialized = true;
      }

      if (!renderedRef.current) {
        containerRef.current.replaceChildren();
        google.accounts.id.renderButton(containerRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: text,
          shape: "rectangular",
          // Removed hardcoded width: 350, let it adapt or CSS handle it
        });
        if (process.env.NODE_ENV === "development") {
          console.log("[Google Auth] Google button rendered successfully in container");
        }
        renderedRef.current = true;
      }
      return true;
    };

    if (!mountGoogleButton()) {
      intervalId = window.setInterval(() => {
        if (mountGoogleButton()) {
          window.clearInterval(intervalId);
        }
      }, 200);
    }

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [text, onSuccess, onError]);

  return (
    <div 
      ref={containerRef} 
      className="w-full flex justify-center min-h-[50px] rounded-[inherit] overflow-hidden [&>div]:!max-w-full [&>div]:!w-full [&_iframe]:!max-w-full [&_iframe]:!w-full [&_iframe]:!rounded-[inherit]" 
    />
  );
}
