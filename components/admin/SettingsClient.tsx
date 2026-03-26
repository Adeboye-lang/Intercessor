"use client";

import { useState } from "react";
import { updateSetting } from "@/app/actions/settings";
import { Save, Loader2, Settings2 } from "lucide-react";

export default function SettingsClient({
  initialSettings,
}: {
  initialSettings: { key: string; value: string }[];
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Convert array to a key-value object for easy lookup
  const settings = initialSettings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-indigo-50 rounded-lg">
          <Settings2 className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Site Settings</h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage global configuration and platform details
          </p>
        </div>
      </div>

      <form
        action={async (formData) => {
          setIsSubmitting(true);
          setSuccess(false);
          try {
            for (const [key, value] of formData.entries()) {
              if (typeof value === "string") {
                await updateSetting(key, value);
              }
            }
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
          } finally {
            setIsSubmitting(false);
          }
        }}
        className="space-y-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
      >
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2">General</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Name
              </label>
              <input
                type="text"
                name="site_name"
                placeholder="Intercessor"
                defaultValue={settings["site_name"] || ""}
                className="w-full rounded-lg border-gray-300 border p-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                name="contact_email"
                placeholder="info@example.com"
                defaultValue={settings["contact_email"] || ""}
                className="w-full rounded-lg border-gray-300 border p-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                name="contact_phone"
                placeholder="+1 (555) 000-0000"
                defaultValue={settings["contact_phone"] || ""}
                className="w-full rounded-lg border-gray-300 border p-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram URL
              </label>
              <input
                type="url"
                name="social_instagram"
                placeholder="https://instagram.com/..."
                defaultValue={settings["social_instagram"] || ""}
                className="w-full rounded-lg border-gray-300 border p-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Twitter/X URL
              </label>
              <input
                type="url"
                name="social_twitter"
                placeholder="https://twitter.com/..."
                defaultValue={settings["social_twitter"] || ""}
                className="w-full rounded-lg border-gray-300 border p-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                YouTube URL
              </label>
              <input
                type="url"
                name="social_youtube"
                placeholder="https://youtube.com/..."
                defaultValue={settings["social_youtube"] || ""}
                className="w-full rounded-lg border-gray-300 border p-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-gray-100">
          {success && (
            <span className="text-sm text-green-600 font-medium">
              Settings saved successfully!
            </span>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition font-medium ml-auto"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
