"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEvent, deleteEvent, updateEvent } from "@/app/actions/events";
import { Plus, Edit2, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { Event } from "@prisma/client";

export default function EventsClient({ initialEvents }: { initialEvents: Event[] }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOpenModal = (event?: Event) => {
    if (event) setEditingEvent(event);
    else setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, formData);
      } else {
        await createEvent(formData);
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
    if (confirm("Are you sure you want to delete this event?")) {
      await deleteEvent(id);
      router.refresh();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-brand-dark mb-2">Events & Gatherings</h1>
          <p className="text-text-muted text-sm">Manage upcoming gatherings and events.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-brand-dark tracking-wider text-white text-xs font-semibold uppercase px-5 py-3 rounded-full hover:bg-brand transition-colors shadow-lg"
        >
          <Plus size={16} /> Add Event
        </button>
      </div>

      <div className="bg-white border border-border-subtle rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="tracking-widest uppercase text-[10px] bg-[#F8F9F7] text-text-muted">
            <tr>
              <th className="px-6 py-4 font-semibold">Event Name & Location</th>
              <th className="px-6 py-4 font-semibold">Date & Time</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {initialEvents.map((event) => (
              <tr key={event.id} className="hover:bg-brand/5 transition-colors group">
                <td className="px-6 py-4">
                  <p className="font-serif text-brand-dark text-base">{event.title}</p>
                  <p className="text-text-muted mt-0.5">{event.location || "TBD"}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-text-body">{new Date(event.eventDate).toLocaleDateString()}</p>
                  <p className="text-text-muted mt-0.5">{event.time || "TBD"}</p>
                </td>
                <td className="px-6 py-4">
                  {event.isPublished ? (
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
                      onClick={() => handleOpenModal(event)}
                      aria-label="Edit event"
                      className="p-2 text-text-muted hover:text-brand-dark hover:bg-black/5 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(event.id)}
                      aria-label="Delete event"
                      className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {initialEvents.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-text-muted">
                  No events found. Click &quot;Add Event&quot; to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative my-auto">
            <div className="px-8 py-6 border-b border-border-subtle bg-[#F8F9F7]">
              <h2 className="text-xl font-serif text-brand-dark">
                {editingEvent ? "Edit Event" : "Create New Event"}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block ml-1">Event Title</label>
                <input required name="title" placeholder="Event title" defaultValue={editingEvent?.title} className="w-full px-4 py-3 rounded-xl border border-border-subtle bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block ml-1">Date</label>
                  <input required type="date" name="eventDate" placeholder="Select date" defaultValue={editingEvent ? new Date(editingEvent.eventDate).toISOString().split('T')[0] : ''} className="w-full px-4 py-3 rounded-xl border border-border-subtle bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block ml-1">Time (e.g. 6:00 PM)</label>
                  <input name="time" placeholder="6:00 PM" defaultValue={editingEvent?.time || ""} className="w-full px-4 py-3 rounded-xl border border-border-subtle bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block ml-1">Location / Address</label>
                <input name="location" placeholder="Address or venue" defaultValue={editingEvent?.location || ""} className="w-full px-4 py-3 rounded-xl border border-border-subtle bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block ml-1">Short Description</label>
                <textarea required name="description" placeholder="Event details and information" rows={3} defaultValue={editingEvent?.description} className="w-full px-4 py-3 rounded-xl border border-border-subtle bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand resize-none" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block ml-1">Registration/RSVP Link (Optional)</label>
                <input name="registrationLink" defaultValue={editingEvent?.registrationLink || ""} className="w-full px-4 py-3 rounded-xl border border-border-subtle bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" placeholder="https://..." />
              </div>

              <label className="flex items-center gap-3 p-4 border border-border-subtle rounded-xl cursor-pointer hover:bg-[#F8F9F7] transition-colors">
                <input type="checkbox" name="isPublished" value="true" defaultChecked={editingEvent ? editingEvent.isPublished : true} className="w-5 h-5 rounded text-brand focus:ring-brand accent-brand" />
                <span className="text-sm font-medium text-brand-dark">Publish publicly</span>
              </label>

              <div className="pt-4 flex justify-end gap-3 border-t border-border-subtle">
                <button type="button" onClick={handleCloseModal} className="px-6 py-3 rounded-xl text-sm font-semibold text-text-muted hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="px-6 py-3 bg-brand-dark text-white rounded-xl text-sm font-semibold uppercase tracking-widest hover:bg-brand transition-all shadow-lg hover:-translate-y-0.5 disabled:opacity-50">
                  {loading ? "Saving..." : "Save Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
