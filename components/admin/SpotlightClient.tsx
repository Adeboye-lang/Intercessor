"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { createSpotlight, updateSpotlight, deleteSpotlight } from "@/app/actions/events";

type Spotlight = {
  id: string;
  type: string;
  title: string;
  description: string;
  image: string | null;
  link: string | null;
  isPublished: boolean;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export default function SpotlightClient({ initialSpotlights }: { initialSpotlights: Spotlight[] }) {
  const router = useRouter();
  const [spotlights, setSpotlights] = useState<Spotlight[]>(initialSpotlights);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpotlight, setEditingSpotlight] = useState<Spotlight | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      if (editingSpotlight) {
        await updateSpotlight(editingSpotlight.id, formData);
        setSpotlights(spotlights.map(s => s.id === editingSpotlight.id ? { 
            ...s, 
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            type: formData.get("type") as string,
            link: formData.get("link") as string,
            image: formData.get("image") as string,
        } : s));
      } else {
        await createSpotlight(formData);
        router.refresh();
      }
      setIsModalOpen(false);
      setEditingSpotlight(null);
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this feature?")) return;
    try {
      await deleteSpotlight(id);
      setSpotlights(spotlights.filter(s => s.id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-indigo-500">
          Spotlights
        </h1>
        <button
          onClick={() => {
            setEditingSpotlight(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all"
        >
          <Plus size={18} />
          Add Spotlight
        </button>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-white/5 text-gray-400 uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Link</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {spotlights.map((spot) => (
                <tr key={spot.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{spot.title}</td>
                  <td className="px-6 py-4 text-gray-400">
                    {spot.description.length > 50 ? spot.description.substring(0, 50) + "..." : spot.description}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">{spot.link}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => {
                        setEditingSpotlight(spot);
                        setIsModalOpen(true);
                      }}
                      aria-label="Edit spotlight"
                      className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors inline-block"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(spot.id)}
                      aria-label="Delete spotlight"
                      className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors inline-block ml-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {spotlights.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No active spotlights. Create one to feature on the resources page!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-xl font-semibold text-white">
                {editingSpotlight ? "Edit Spotlight" : "Add Spotlight"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                aria-label="Close dialog"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Feature Title</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingSpotlight?.title}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g. 21 Days of Fasting"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  name="description"
                  defaultValue={editingSpotlight?.description}
                  required
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                  placeholder="Short description for the homepage..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                <input
                  type="text"
                  name="type"
                  defaultValue={editingSpotlight?.type || "podcast"}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g. event, podcast"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Image URL</label>
                <input
                  type="url"
                  name="image"
                  defaultValue={editingSpotlight?.image || ""}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Action Link</label>
                <input
                  type="text"
                  name="link"
                  defaultValue={editingSpotlight?.link || ""}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="/events or https://..."
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  {editingSpotlight ? "Save Changes" : "Create Spotlight"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
