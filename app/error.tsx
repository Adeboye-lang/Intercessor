"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to external service (e.g., Sentry, LogRocket)
    console.error("Application error:", error);
    
    // Example: Send to monitoring service
    // if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    //   Sentry.captureException(error);
    // }
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#3D532D] flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
            <AlertTriangle size={32} className="text-red-600" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-serif mb-4">Oops!</h1>
        <p className="text-lg text-[#3D532D]/70 mb-8">
          Something went wrong. We apologize for the inconvenience.
        </p>
        
        {error.digest && (
          <p className="text-xs text-[#3D532D]/50 font-mono mb-8 break-all">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-[#3D532D] text-[#FAF9F6] rounded-lg font-semibold hover:bg-[#2A3A1F] transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-[#C5A059] text-[#3D532D] rounded-lg font-semibold hover:bg-[#B8934A] transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
