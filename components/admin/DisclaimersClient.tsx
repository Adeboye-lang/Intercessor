"use client";

import { useState } from "react";
import { updateDisclaimer, deleteDisclaimer, getAllDisclaimers, createDisclaimer } from "@/app/actions/disclaimers";
import { Edit2, Trash2, CheckCircle2, AlertCircle, Plus } from "lucide-react";
import { SiteSetting } from "@prisma/client";
import { MANAGED_SITE_SETTING_KEY_OPTIONS } from "@/lib/public-site-content";

export default function DisclaimersClient({ initialDisclaimers }: { initialDisclaimers: SiteSetting[] }) {
  const [disclaimers, setDisclaimers] = useState<SiteSetting[]>(initialDisclaimers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDisclaimer, setEditingDisclaimer] = useState<SiteSetting | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleOpenModal = (disclaimer?: SiteSetting) => {
    if (disclaimer) setEditingDisclaimer(disclaimer);
    else setEditingDisclaimer(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDisclaimer(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData(e.currentTarget);
      
      if (editingDisclaimer) {
        await updateDisclaimer(editingDisclaimer.key, formData);
        setMessage({ type: "success", text: "Entry updated successfully!" });
      } else {
        await createDisclaimer(formData);
        setMessage({ type: "success", text: "Entry created successfully!" });
      }

      // Refetch disclaimers
      const updated = await getAllDisclaimers();
      setDisclaimers(updated);
      handleCloseModal();
    } catch (error) {
      setMessage({ 
        type: "error", 
        text: error instanceof Error ? error.message : "An error occurred" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (key: string) => {
    if (confirm("Are you sure you want to delete this entry? This action cannot be undone.")) {
      try {
        await deleteDisclaimer(key);
        setDisclaimers(disclaimers.filter((d) => d.key !== key));
        setMessage({ type: "success", text: "Entry deleted successfully!" });
      } catch (error) {
        setMessage({ 
          type: "error", 
          text: error instanceof Error ? error.message : "Failed to delete entry" 
        });
      }
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-6 border-b border-[#3D532D]/10">
        <div className="w-full md:w-auto">
          <h1 className="text-2xl md:text-3xl font-serif text-[#3D532D] mb-2">Disclaimers &amp; Legal</h1>
          <p className="text-[#3D532D]/70 text-sm">Manage the shared footer disclaimer plus the privacy and terms content visible to users.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#3D532D] text-brand-bg rounded-lg text-sm font-semibold uppercase tracking-wider hover:bg-[#2A3A1F] transition-colors whitespace-nowrap"
        >
          <Plus size={16} />
          Add Entry
        </button>
      </div>

      {message && (
        <div className={`mb-6 px-6 py-4 rounded-lg flex items-center gap-3 ${
          message.type === "success" 
            ? "bg-green-50 border border-green-200 text-green-700" 
            : "bg-red-50 border border-red-200 text-red-700"
        }`}>
          {message.type === "success" ? (
            <CheckCircle2 size={18} className="shrink-0" />
          ) : (
            <AlertCircle size={18} className="shrink-0" />
          )}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {disclaimers.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-[#3D532D]/20 rounded-lg p-12 text-center">
            <p className="text-[#3D532D]/60 mb-4">No disclaimer or legal entries found yet. Add one to get started.</p>
          </div>
        ) : (
          disclaimers.map((disclaimer) => (
            <div 
              key={disclaimer.key}
              className="bg-white border border-[#3D532D]/10 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-[#3D532D]/50 uppercase tracking-widest mb-1 break-all">
                    {disclaimer.key}
                  </p>
                  {disclaimer.description && (
                    <p className="text-sm text-[#3D532D]/70">{disclaimer.description}</p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenModal(disclaimer)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#3D532D] text-brand-bg rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#2A3A1F] transition-colors"
                  >
                    <Edit2 size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(disclaimer.key)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="bg-[#F4F5F0] rounded-md p-4 max-h-24 overflow-y-auto">
                <p className="text-sm text-[#3D532D] leading-relaxed whitespace-pre-wrap wrap-break-word">
                  {disclaimer.value}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-6 md:px-8 py-6 border-b border-[#3D532D]/10 bg-brand-bg">
              <h2 className="text-xl md:text-2xl font-serif text-[#3D532D]">
                {editingDisclaimer ? "Edit Entry" : "New Entry"}
              </h2>
              <p className="text-sm text-[#3D532D]/70 mt-1">
                {editingDisclaimer?.key || "Create a new disclaimer or legal entry"}
              </p>
            </div>

            {/* Form */}
            <form 
              id="disclaimer-form"
              onSubmit={handleSubmit} 
              className="flex-1 overflow-y-auto px-6 md:px-8 py-6 space-y-6"
            >
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#3D532D] uppercase tracking-wider">
                  Key <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  list="managed-site-setting-key-options"
                  name="key"
                  disabled={!!editingDisclaimer}
                  defaultValue={editingDisclaimer?.key || ""}
                  placeholder="e.g., disclaimer_footer"
                  className="w-full px-4 py-3 rounded-lg border border-[#3D532D]/20 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <datalist id="managed-site-setting-key-options">
                  {MANAGED_SITE_SETTING_KEY_OPTIONS.map((keyOption) => (
                    <option key={keyOption} value={keyOption} />
                  ))}
                </datalist>
                <p className="text-xs text-[#3D532D]/60 italic">Use one of the supported keys: disclaimer_footer, legal_privacy_policy, or legal_terms_of_service.</p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#3D532D] uppercase tracking-wider">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  defaultValue={editingDisclaimer?.description || ""}
                  placeholder="Brief description of this disclaimer"
                  className="w-full px-4 py-3 rounded-lg border border-[#3D532D]/20 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#3D532D] uppercase tracking-wider">
                  Content <span className="text-red-600">*</span>
                </label>
                <textarea
                  name="content"
                  required
                  defaultValue={editingDisclaimer?.value || ""}
                  placeholder="Enter the content text..."
                  rows={8}
                  className="w-full px-4 py-3 rounded-lg border border-[#3D532D]/20 text-sm font-serif focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand resize-none"
                />
                <p className="text-xs text-[#3D532D]/60 italic">This text will be displayed to users on the relevant public page or footer section.</p>
              </div>
            </form>

            {/* Footer */}
            <div className="px-6 md:px-8 py-4 border-t border-[#3D532D]/10 bg-brand-bg flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-6 py-2.5 rounded-lg text-sm font-semibold text-[#3D532D] hover:bg-[#3D532D]/5 transition-colors order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="disclaimer-form"
                disabled={loading}
                className="px-6 py-2.5 rounded-lg text-sm font-semibold text-brand-bg bg-[#3D532D] hover:bg-[#2A3A1F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider order-1 sm:order-2"
              >
                {loading ? "Saving..." : "Save Entry"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
