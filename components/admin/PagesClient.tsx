"use client";

import { useState } from "react";
import { updatePageContent } from "@/app/actions/settings";
import { Save, Loader2, BookOpen } from "lucide-react";

export default function PagesClient({
  initialPages,
}: {
  initialPages: { pageKey: string; content: string }[];
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Convert array to a key-value object for easy lookup
  const pageContents = initialPages.reduce((acc, curr) => {
    acc[curr.pageKey] = curr.content;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-indigo-50 rounded-lg">
          <BookOpen className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pages Content</h2>
          <p className="text-gray-500 text-sm mt-1">
            Update static text sections across the site
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
                await updatePageContent(key, value);
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
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Home Page</h3>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hero Title
              </label>
              <input
                type="text"
                name="home_hero_title"
                defaultValue={pageContents["home_hero_title"] || ""}
                className="w-full rounded-lg border-gray-300 border p-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                placeholder="E.g., Welcome to Intercessor"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hero Subtitle
              </label>
              <textarea
                name="home_hero_subtitle"
                placeholder="Enter hero subtitle text..."
                defaultValue={pageContents["home_hero_subtitle"] || ""}
                rows={3}
                className="w-full rounded-lg border-gray-300 border p-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2">About Page</h3>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mission Statement
              </label>
              <textarea
                name="about_mission"
                placeholder="Enter mission statement..."
                defaultValue={pageContents["about_mission"] || ""}
                rows={4}
                className="w-full rounded-lg border-gray-300 border p-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vision Statement
              </label>
              <textarea
                name="about_vision"
                placeholder="Enter vision statement..."
                defaultValue={pageContents["about_vision"] || ""}
                rows={4}
                className="w-full rounded-lg border-gray-300 border p-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Resources Page Spotlights</h3>
          
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
            <h4 className="font-semibold text-gray-800 text-sm">Editor&apos;s Selection</h4>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" name="editor_selection_title" defaultValue={pageContents["editor_selection_title"] || ""} className="w-full rounded-lg border-gray-300 border p-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input type="text" name="editor_selection_subtitle" defaultValue={pageContents["editor_selection_subtitle"] || ""} className="w-full rounded-lg border-gray-300 border p-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Explanation & Bible Verses</label>
                <textarea name="editor_selection_content" defaultValue={pageContents["editor_selection_content"] || ""} rows={3} className="w-full rounded-lg border-gray-300 border p-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition" />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
            <h4 className="font-semibold text-gray-800 text-sm">Music Spotlight</h4>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" name="music_spotlight_title" defaultValue={pageContents["music_spotlight_title"] || ""} className="w-full rounded-lg border-gray-300 border p-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Artist / Subtitle</label>
                <input type="text" name="music_spotlight_subtitle" defaultValue={pageContents["music_spotlight_subtitle"] || ""} className="w-full rounded-lg border-gray-300 border p-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Explanation / Context</label>
                <textarea name="music_spotlight_content" defaultValue={pageContents["music_spotlight_content"] || ""} rows={3} className="w-full rounded-lg border-gray-300 border p-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition" />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
            <h4 className="font-semibold text-gray-800 text-sm">Playlist Commentary</h4>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Commentary / Context</label>
                <textarea name="playlist_commentary" defaultValue={pageContents["playlist_commentary"] || ""} rows={4} placeholder="A short description or commentary for the music playlist section..." className="w-full rounded-lg border-gray-300 border p-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-gray-100">
          {success && (
            <span className="text-sm text-green-600 font-medium">
              Changes saved successfully!
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
            Save Content
          </button>
        </div>
      </form>
    </div>
  );
}
