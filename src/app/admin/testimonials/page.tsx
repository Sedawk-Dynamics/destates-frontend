"use client";

import { useEffect, useState } from "react";
import { Testimonial } from "@/types";
import { getAdminTestimonials, adminCreateTestimonial, adminUpdateTestimonial, adminDeleteTestimonial } from "@/lib/api";
import { Plus, Pencil, Trash2, X, Star } from "lucide-react";
import toast from "react-hot-toast";
import ImageUploader from "@/components/admin/ImageUploader";

const emptyForm = { name: "", designation: "", company: "", content: "", rating: 5, avatarUrl: "" };

export default function AdminTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchData = () => {
    setLoading(true);
    getAdminTestimonials().then((r) => setItems(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setForm(emptyForm); setEditId(null); setShowForm(true); };

  const openEdit = (t: Testimonial) => {
    setForm({
      name: t.name, designation: t.designation, company: t.company,
      content: t.content, rating: t.rating, avatarUrl: t.avatarUrl || "",
    });
    setEditId(t.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { ...form, rating: Number(form.rating), avatarUrl: form.avatarUrl || undefined };
      if (editId) {
        await adminUpdateTestimonial(editId, data);
        toast.success("Testimonial updated");
      } else {
        await adminCreateTestimonial(data);
        toast.success("Testimonial created");
      }
      setShowForm(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      await adminDeleteTestimonial(id);
      toast.success("Testimonial deleted");
      fetchData();
    } catch { toast.error("Failed to delete"); }
  };

  const inputClass = "w-full px-3 py-2 bg-input border border-border rounded-[var(--radius)] text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Testimonials</h1>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-[var(--radius)] hover:opacity-90">
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      {loading ? (
        <div className="bg-card rounded-xl border border-border p-8 text-center text-muted-foreground">Loading...</div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Designation</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Company</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Rating</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((t) => (
                  <tr key={t.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium text-foreground">{t.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{t.designation}</td>
                    <td className="px-4 py-3 text-muted-foreground">{t.company}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} size={12} className="fill-primary text-primary" />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEdit(t)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors"><Pencil size={15} /></button>
                      <button onClick={() => handleDelete(t.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors ml-1"><Trash2 size={15} /></button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No testimonials found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">{editId ? "Edit" : "Add"} Testimonial</h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-foreground mb-1">Name</label><input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
                <div><label className="block text-sm font-medium text-foreground mb-1">Company</label><input className={inputClass} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required /></div>
                <div><label className="block text-sm font-medium text-foreground mb-1">Designation</label><input className={inputClass} value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} required /></div>
                <div><label className="block text-sm font-medium text-foreground mb-1">Rating (1-5)</label><input type="number" min={1} max={5} className={inputClass} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} required /></div>
              </div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Content</label><textarea className={inputClass} rows={4} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required /></div>
              <ImageUploader
                images={form.avatarUrl ? [form.avatarUrl] : []}
                onChange={(imgs) => setForm({ ...form, avatarUrl: imgs[0] || "" })}
                multiple={false}
                label="Avatar (optional)"
              />
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border border-border rounded-[var(--radius)] hover:bg-muted">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-[var(--radius)] hover:opacity-90 disabled:opacity-50">{saving ? "Saving..." : editId ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
