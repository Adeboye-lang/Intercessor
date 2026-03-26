"use client";

export type GoogleMapsLoadErrorCode =
  | "missing_api_key"
  | "script_load_failed"
  | "auth_failed"
  | "load_timeout";

export class GoogleMapsLoadError extends Error {
  code: GoogleMapsLoadErrorCode;

  constructor(code: GoogleMapsLoadErrorCode, message: string) {
    super(message);
    this.name = "GoogleMapsLoadError";
    this.code = code;
  }
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google?: any;
    __intercessorGoogleMapsPromise?: Promise<typeof window.google>;
    __intercessorGoogleMapsLoadError?: GoogleMapsLoadError;
    gm_authFailure?: () => void;
  }
}

const GOOGLE_MAPS_SCRIPT_ID = "intercessor-google-maps";
const GOOGLE_MAPS_LOAD_TIMEOUT_MS = 10000;
const GOOGLE_MAPS_READY_POLL_MS = 100;

const isGoogleMapsReady = () => Boolean(window.google?.maps?.places);

const createGoogleMapsLoadError = (
  code: GoogleMapsLoadErrorCode,
  message: string
) => new GoogleMapsLoadError(code, message);

export const getGoogleMapsLoadErrorMessage = (error: unknown) => {
  if (error instanceof GoogleMapsLoadError) {
    switch (error.code) {
      case "missing_api_key":
        return "Map unavailable because the browser Google Maps key is missing.";
      case "auth_failed":
        return "Map unavailable for this site URL. Authorize the current domain in your Google Maps browser key referrers.";
      case "load_timeout":
      case "script_load_failed":
        return "Map unavailable right now. The church list still works.";
      default:
        return error.message;
    }
  }

  return "Map unavailable right now. The church list still works.";
};

export async function loadGoogleMaps(apiKey: string) {
  if (typeof window === "undefined") {
    throw createGoogleMapsLoadError(
      "script_load_failed",
      "Google Maps can only load in the browser."
    );
  }

  if (!apiKey) {
    throw createGoogleMapsLoadError(
      "missing_api_key",
      "Google Maps API key is missing."
    );
  }

  if (isGoogleMapsReady()) {
    window.__intercessorGoogleMapsLoadError = undefined;
    return window.google;
  }

  if (window.__intercessorGoogleMapsLoadError?.code === "auth_failed") {
    throw window.__intercessorGoogleMapsLoadError;
  }

  if (window.__intercessorGoogleMapsPromise) {
    return window.__intercessorGoogleMapsPromise;
  }

  window.__intercessorGoogleMapsPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(
      GOOGLE_MAPS_SCRIPT_ID
    ) as HTMLScriptElement | null;
    const previousAuthFailure = window.gm_authFailure;
    let isSettled = false;
    const timers: {
      pollIntervalId?: number;
      timeoutId?: number;
    } = {};

    const cleanup = () => {
      if (timers.pollIntervalId) {
        window.clearInterval(timers.pollIntervalId);
      }

      if (timers.timeoutId) {
        window.clearTimeout(timers.timeoutId);
      }

      if (window.gm_authFailure === handleAuthFailure) {
        if (previousAuthFailure) {
          window.gm_authFailure = previousAuthFailure;
        } else {
          delete window.gm_authFailure;
        }
      }
    };

    const resolveOnce = () => {
      if (isSettled || !isGoogleMapsReady()) {
        return;
      }

      isSettled = true;
      cleanup();
      window.__intercessorGoogleMapsLoadError = undefined;
      resolve(window.google);
    };

    const rejectOnce = (error: GoogleMapsLoadError) => {
      if (isSettled) {
        return;
      }

      isSettled = true;
      cleanup();
      window.__intercessorGoogleMapsPromise = undefined;
      window.__intercessorGoogleMapsLoadError = error;
      reject(error);
    };

    function handleAuthFailure() {
      previousAuthFailure?.();
      rejectOnce(
        createGoogleMapsLoadError(
          "auth_failed",
          "Google Maps browser key is not authorized for this site URL."
        )
      );
    }

    window.gm_authFailure = handleAuthFailure;

    timers.pollIntervalId = window.setInterval(() => {
      resolveOnce();
    }, GOOGLE_MAPS_READY_POLL_MS);

    timers.timeoutId = window.setTimeout(() => {
      rejectOnce(
        createGoogleMapsLoadError(
          "load_timeout",
          "Google Maps did not finish loading in time."
        )
      );
    }, GOOGLE_MAPS_LOAD_TIMEOUT_MS);

    if (existingScript) {
      if (isGoogleMapsReady()) {
        resolveOnce();
        return;
      }

      existingScript.addEventListener("load", resolveOnce, { once: true });
      existingScript.addEventListener(
        "error",
        () => {
          rejectOnce(
            createGoogleMapsLoadError(
              "script_load_failed",
              "Failed to load Google Maps."
            )
          );
        },
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = resolveOnce;
    script.onerror = () => {
      rejectOnce(
        createGoogleMapsLoadError(
          "script_load_failed",
          "Failed to load Google Maps."
        )
      );
    };

    document.head.appendChild(script);
  });

  return window.__intercessorGoogleMapsPromise;
}
