"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createMusic, deleteMusic, updateMusic } from "@/app/actions/resources";
import { Plus, Edit2, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { Music } from "@prisma/client";

export default function MusicClient({ initialMusic }: { initialMusic: Music[] }) {
  const router = useRouter();
  const [musicList, setMusicList] = useState<Music[]>(initialMusic);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMusic, setEditingMusic] = useState<Music | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOpenModal = (music?: Music) => {
    if (music) setEditingMusic(music);
    else setEditingMusic(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMusic(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      if (editingMusic) {
        await updateMusic(editingMusic.id, formData);
      } else {
        await createMusic(formData);
      }
      handleCloseModal();
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this track?")) {
      await deleteMusic(id);
      setMusicList(musicList.filter((m) => m.id !== id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-brand-dark mb-2">Music</h1>
          <p className="text-text-muted text-sm">Manage the music displayed on the Resources page.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-brand-dark tracking-wider text-white text-xs font-semibold uppercase px-5 py-3 rounded-full hover:bg-brand transition-colors shadow-lg"
        >
          <Plus size={16} /> Add Music
        </button>
      </div>

      <div className="bg-white border border-border-subtle rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="tracking-widest uppercase text-[10px] bg-[#F8F9F7] text-text-muted">
            <tr>
              <th className="px-6 py-4 font-semibold">Title & Artist</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {musicList.map((music) => (
              <tr key={music.id} className="hover:bg-brand/5 transition-colors group">
                <td className="px-6 py-4">
                  <p className="font-serif text-brand-dark text-base">{music.title}</p>
                  <p className="text-text-muted mt-0.5">{music.artist}</p>
                </td>
                <td className="px-6 py-4">
                  {music.isPublished ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                      <CheckCircle2 size={12} /> Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                      <XCircle size={12} /> Draft
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleOpenModal(music)}
                      aria-label="Edit music"
                      className="p-2 text-text-muted hover:text-brand-dark hover:bg-black/5 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(music.id)}
                      aria-label="Delete music"
                      className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {musicList.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-text-muted">
                  No music found. Click &quot;Add Music&quot; to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative">
            <div className="px-8 py-6 border-b border-border-subtle bg-[#F8F9F7]">
              <h2 className="text-xl font-serif text-brand-dark">
                {editingMusic ? "Edit Music" : "Add New Music"}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block ml-1">Title</label>
                  <input required name="title" placeholder="Track title" defaultValue={editingMusic?.title} className="w-full px-4 py-3 rounded-xl border border-border-subtle bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" />
                </div>
                
                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block ml-1">Artist</label>
                  <input required name="artist" placeholder="Artist name" defaultValue={editingMusic?.artist} className="w-full px-4 py-3 rounded-xl border border-border-subtle bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" />
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block ml-1">Listen Link (URL)</label>
                  <input name="link" defaultValue={editingMusic?.link || ""} className="w-full px-4 py-3 rounded-xl border border-border-subtle bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" placeholder="https://..." />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block ml-1">Cover Image URL (Optional)</label>
                <input name="coverImage" defaultValue={editingMusic?.coverImage || ""} className="w-full px-4 py-3 rounded-xl border border-border-subtle bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" placeholder="https://..." />
              </div>

              <label className="flex items-center gap-3 p-4 border border-border-subtle rounded-xl cursor-pointer hover:bg-[#F8F9F7] transition-colors">
                <input type="checkbox" name="isPublished" value="true" defaultChecked={editingMusic ? editingMusic.isPublished : true} className="w-5 h-5 rounded text-brand focus:ring-brand accent-brand" />
                <span className="text-sm font-medium text-brand-dark">Publish immediately</span>
              </label>

              <div className="pt-4 flex justify-end gap-3 border-t border-border-subtle">
                <button type="button" onClick={handleCloseModal} className="px-6 py-3 rounded-xl text-sm font-semibold text-text-muted hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="px-6 py-3 bg-brand-dark text-white rounded-xl text-sm font-semibold uppercase tracking-widest hover:bg-brand transition-all shadow-lg hover:-translate-y-0.5 disabled:opacity-50">
                  {loading ? "Saving..." : "Save Music"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
