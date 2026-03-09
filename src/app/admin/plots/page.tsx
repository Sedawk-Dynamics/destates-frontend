"use client";

import { useEffect, useState } from "react";
import { LandPlot } from "@/types";
import { getPlots, adminCreatePlot, adminUpdatePlot, adminDeletePlot } from "@/lib/api";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import ImageUploader from "@/components/admin/ImageUploader";

const emptyForm = {
  name: "", location: "", city: "", totalArea: 0, pricePerSqft: 0,
  minArea: 0, description: "", amenities: "", images: [] as string[],
};

export default function AdminPlots() {
  const [items, setItems] = useState<LandPlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchData = () => {
    setLoading(true);
    getPlots().then((r) => setItems(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setForm(emptyForm); setEditId(null); setShowForm(true); };

  const openEdit = (p: LandPlot) => {
    setForm({
      name: p.name, location: p.location, city: p.city, totalArea: p.totalArea,
      pricePerSqft: p.pricePerSqft, minArea: p.minArea, description: p.description,
      amenities: p.amenities.join(", "), images: [...p.images],
    });
    setEditId(p.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        ...form,
        totalArea: Number(form.totalArea), pricePerSqft: Number(form.pricePerSqft),
        minArea: Number(form.minArea),
        amenities: form.amenities.split(",").map((s) => s.trim()).filter(Boolean),
        images: form.images,
      };
      if (editId) {
        await adminUpdatePlot(editId, data);
        toast.success("Plot updated");
      } else {
        await adminCreatePlot(data);
        toast.success("Plot created");
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
    if (!confirm("Delete this plot?")) return;
    try {
      await adminDeletePlot(id);
      toast.success("Plot deleted");
      fetchData();
    } catch { toast.error("Failed to delete"); }
  };

  const inputClass = "w-full px-3 py-2 bg-input border border-border rounded-[var(--radius)] text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Land Plots</h1>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-[var(--radius)] hover:opacity-90">
          <Plus size={16} /> Add Plot
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
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Total Area</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Price/sqft</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Min Area</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium text-foreground">{p.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.city}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.totalArea.toLocaleString()} sqft</td>
                    <td className="px-4 py-3 text-primary font-medium">{"\u20B9"}{p.pricePerSqft.toLocaleString()}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.minArea} sqft</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors"><Pencil size={15} /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors ml-1"><Trash2 size={15} /></button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No plots found</td></tr>
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
              <h2 className="text-xl font-bold text-foreground">{editId ? "Edit" : "Add"} Plot</h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-foreground mb-1">Name</label><input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
                <div><label className="block text-sm font-medium text-foreground mb-1">City</label><input className={inputClass} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required /></div>
                <div className="sm:col-span-2"><label className="block text-sm font-medium text-foreground mb-1">Location</label><input className={inputClass} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required /></div>
                <div><label className="block text-sm font-medium text-foreground mb-1">Total Area (sqft)</label><input type="number" className={inputClass} value={form.totalArea} onChange={(e) => setForm({ ...form, totalArea: Number(e.target.value) })} required /></div>
                <div><label className="block text-sm font-medium text-foreground mb-1">Price per sqft</label><input type="number" className={inputClass} value={form.pricePerSqft} onChange={(e) => setForm({ ...form, pricePerSqft: Number(e.target.value) })} required /></div>
                <div><label className="block text-sm font-medium text-foreground mb-1">Min Area (sqft)</label><input type="number" className={inputClass} value={form.minArea} onChange={(e) => setForm({ ...form, minArea: Number(e.target.value) })} required /></div>
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
