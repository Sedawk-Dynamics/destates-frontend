"use client";

import { useEffect, useState } from "react";
import { PGListing } from "@/types";
import { getPGs, adminCreatePG, adminUpdatePG, adminDeletePG } from "@/lib/api";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import ImageUploader from "@/components/admin/ImageUploader";

const emptyForm = {
  name: "", location: "", city: "", monthlyRent: 0, roomType: "Single",
  contactPhone: "", description: "", amenities: "", images: [] as string[], available: true,
};

export default function AdminPGs() {
  const [items, setItems] = useState<PGListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchData = () => {
    setLoading(true);
    getPGs().then((r) => setItems(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setForm(emptyForm); setEditId(null); setShowForm(true); };

  const openEdit = (p: PGListing) => {
    setForm({
      name: p.name, location: p.location, city: p.city, monthlyRent: p.monthlyRent,
      roomType: p.roomType, contactPhone: p.contactPhone, description: p.description,
      amenities: p.amenities.join(", "), images: [...p.images], available: p.available,
    });
    setEditId(p.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        ...form, monthlyRent: Number(form.monthlyRent),
        amenities: form.amenities.split(",").map((s) => s.trim()).filter(Boolean),
        images: form.images,
      };
      if (editId) {
        await adminUpdatePG(editId, data);
        toast.success("PG listing updated");
      } else {
        await adminCreatePG(data);
        toast.success("PG listing created");
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
    if (!confirm("Delete this PG listing?")) return;
    try {
      await adminDeletePG(id);
      toast.success("PG listing deleted");
      fetchData();
    } catch { toast.error("Failed to delete"); }
  };

  const inputClass = "w-full px-3 py-2 bg-input border border-border rounded-[var(--radius)] text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">PG Listings</h1>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-[var(--radius)] hover:opacity-90">
          <Plus size={16} /> Add PG
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
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">City</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Rent</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Room Type</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Available</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium text-foreground">{p.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.city}</td>
                    <td className="px-4 py-3 text-primary font-medium">{"\u20B9"}{p.monthlyRent.toLocaleString()}/mo</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.roomType}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {p.available ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors"><Pencil size={15} /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors ml-1"><Trash2 size={15} /></button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No PG listings found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">{editId ? "Edit" : "Add"} PG Listing</h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-foreground mb-1">Name</label><input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
                <div><label className="block text-sm font-medium text-foreground mb-1">City</label><input className={inputClass} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required /></div>
                <div className="sm:col-span-2"><label className="block text-sm font-medium text-foreground mb-1">Location</label><input className={inputClass} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required /></div>
                <div><label className="block text-sm font-medium text-foreground mb-1">Monthly Rent</label><input type="number" className={inputClass} value={form.monthlyRent} onChange={(e) => setForm({ ...form, monthlyRent: Number(e.target.value) })} required /></div>
                <div><label className="block text-sm font-medium text-foreground mb-1">Room Type</label>
                  <select className={inputClass} value={form.roomType} onChange={(e) => setForm({ ...form, roomType: e.target.value })}>
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Triple">Triple</option>
                  </select>
                </div>
                <div><label className="block text-sm font-medium text-foreground mb-1">Contact Phone</label><input className={inputClass} value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} required /></div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-sm pt-6">
                    <input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} className="accent-primary" />
                    Available
                  </label>
                </div>
              </div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Description</label><textarea className={inputClass} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Amenities (comma-separated)</label><input className={inputClass} value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} /></div>
              <ImageUploader images={form.images} onChange={(imgs) => setForm({ ...form, images: imgs })} />
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
