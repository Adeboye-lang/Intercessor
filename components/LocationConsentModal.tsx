"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X } from "lucide-react";

interface LocationConsentModalProps {
  isOpen: boolean;
  onAllow: () => void;
  onDeny: () => void;
  isLoading?: boolean;
}

export function LocationConsentModal({
  isOpen,
  onAllow,
  onDeny,
  isLoading = false,
}: LocationConsentModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onDeny}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full border-2 border-brand">
              {/* Header */}
              <div className="bg-linear-to-r from-[#3D532D] to-[#2a3a1f] p-6 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-brand p-2 rounded-lg">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-serif font-bold text-white">
                    Share Your Location
                  </h2>
                </div>
                <button
                  onClick={onDeny}
                  className="text-white hover:text-brand transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <p className="text-[#3D532D] font-sans">
                  Allow Intercessor to access your location to find churches near you?
                </p>
                <p className="text-[#3D532D]/70 text-sm font-sans">
                  We&rsquo;ll use your location to show local churches and prayer communities in your area. Your location is only used for this search.
                </p>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={onDeny}
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 border-2 border-[#3D532D]/30 text-[#3D532D] hover:border-[#3D532D] rounded-lg font-semibold transition-all disabled:opacity-50"
                  >
                    Not Now
                  </button>
                  <button
                    onClick={onAllow}
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 bg-linear-to-r from-[#3D532D] to-[#2a3a1f] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-brand/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-brand rounded-full animate-spin" />
                        Locating...
                      </>
                    ) : (
                      <>
                        <MapPin className="w-4 h-4" />
                        Allow Location
                      </>
                    )}
                  </button>
                </div>

                {/* Alternative */}
                <p className="text-center text-xs text-[#3D532D]/60 pt-2 font-sans">
                  or use the address search above to find churches manually
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
