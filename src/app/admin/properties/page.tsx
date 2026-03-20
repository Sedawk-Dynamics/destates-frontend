"use client";

import { useEffect, useState } from "react";
import { Property } from "@/types";
import { getProperties, adminCreateProperty, adminUpdateProperty, adminDeleteProperty } from "@/lib/api";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import ImageUploader from "@/components/admin/ImageUploader";

const emptyForm = {
  name: "", location: "", city: "", price: 0, expectedROI: 0, monthlyYield: 0,
  area: 0, units: 0, availableUnits: 0, status: "AVAILABLE" as Property["status"],
  description: "", highlights: "", images: [] as string[], reraRegistered: true, readyToMove: false, type: "Residential",
  roiCalculatorEnabled: true, minInvestment: 100000, maxInvestment: 0, investmentStep: 100000, projectionYears: 5,
};

export default function AdminProperties() {
  const [items, setItems] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchData = () => {
    setLoading(true);
    getProperties().then((r) => setItems(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setForm(emptyForm); setEditId(null); setShowForm(true); };

  const openEdit = (p: Property) => {
    setForm({
      name: p.name, location: p.location, city: p.city, price: p.price,
      expectedROI: p.expectedROI, monthlyYield: p.monthlyYield || 0, area: p.area,
      units: p.units, availableUnits: p.availableUnits, status: p.status,
      description: p.description, highlights: p.highlights.join(", "),
      images: [...p.images], reraRegistered: p.reraRegistered,
      readyToMove: p.readyToMove, type: p.type,
      roiCalculatorEnabled: p.roiCalculatorEnabled ?? true, minInvestment: p.minInvestment ?? 100000,
      maxInvestment: p.maxInvestment || 0, investmentStep: p.investmentStep ?? 100000,
      projectionYears: p.projectionYears ?? 5,
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
        price: Number(form.price), expectedROI: Number(form.expectedROI),
        monthlyYield: Number(form.monthlyYield) || null, area: Number(form.area),
        units: Number(form.units), availableUnits: Number(form.availableUnits),
        highlights: form.highlights.split(",").map((s) => s.trim()).filter(Boolean),
        images: form.images,
        minInvestment: Number(form.minInvestment), maxInvestment: Number(form.maxInvestment) || null,
        investmentStep: Number(form.investmentStep), projectionYears: Number(form.projectionYears),
      };
      if (editId) {
        await adminUpdateProperty(editId, data);
        toast.success("Property updated");
      } else {
        await adminCreateProperty(data);
        toast.success("Property created");
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
    if (!confirm("Delete this property?")) return;
    try {
      await adminDeleteProperty(id);
      toast.success("Property deleted");
      fetchData();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const inputClass = "w-full px-3 py-2 bg-input border border-border rounded-[var(--radius)] text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Properties</h1>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-[var(--radius)] hover:opacity-90">
          <Plus size={16} /> Add Property
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
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Price</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">ROI</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium text-foreground">{p.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.city}</td>
                    <td className="px-4 py-3 text-muted-foreground">{"\u20B9"}{(p.price / 10000000).toFixed(1)} Cr</td>
                    <td className="px-4 py-3 text-primary font-medium">{p.expectedROI}%</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        p.status === "AVAILABLE" ? "bg-green-100 text-green-700" :
                        p.status === "LIMITED" ? "bg-yellow-100 text-yellow-700" :
                        "bg-red-100 text-red-700"
                      }`}>{p.status}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors"><Pencil size={15} /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors ml-1"><Trash2 size={15} /></button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No properties found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">{editId ? "Edit" : "Add"} Property</h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Name</label>
                  <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">City</label>
                  <input className={inputClass} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1">Location</label>
                  <input className={inputClass} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Price (INR)</label>
                  <input type="number" className={inputClass} value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Expected ROI (%)</label>
                  <input type="number" step="0.1" className={inputClass} value={form.expectedROI} onChange={(e) => setForm({ ...form, expectedROI: Number(e.target.value) })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Monthly Yield (%)</label>
                  <input type="number" step="0.1" className={inputClass} value={form.monthlyYield} onChange={(e) => setForm({ ...form, monthlyYield: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Area (sq ft)</label>
                  <input type="number" className={inputClass} value={form.area} onChange={(e) => setForm({ ...form, area: Number(e.target.value) })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Total Units</label>
                  <input type="number" className={inputClass} value={form.units} onChange={(e) => setForm({ ...form, units: Number(e.target.value) })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Available Units</label>
                  <input type="number" className={inputClass} value={form.availableUnits} onChange={(e) => setForm({ ...form, availableUnits: Number(e.target.value) })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Status</label>
                  <select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })}>
                    <option value="AVAILABLE">Available</option>
                    <option value="LIMITED">Limited</option>
                    <option value="SOLD_OUT">Sold Out</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Type</label>
                  <input className={inputClass} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} required />
                </div>
                <div className="flex items-center gap-6 sm:col-span-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={form.reraRegistered} onChange={(e) => setForm({ ...form, reraRegistered: e.target.checked })} className="accent-primary" />
                    RERA Registered
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={form.readyToMove} onChange={(e) => setForm({ ...form, readyToMove: e.target.checked })} className="accent-primary" />
                    Ready to Move
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                <textarea className={inputClass} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Highlights (comma-separated)</label>
                <input className={inputClass} value={form.highlights} onChange={(e) => setForm({ ...form, highlights: e.target.value })} placeholder="RERA Registered, Swimming Pool, ..." />
              </div>
              {/* ROI Calculator Settings */}
              <div className="border border-border rounded-[var(--radius)] p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">ROI Calculator Settings</h3>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={form.roiCalculatorEnabled} onChange={(e) => setForm({ ...form, roiCalculatorEnabled: e.target.checked })} className="accent-primary" />
                    Enable Calculator
                  </label>
                </div>
                {form.roiCalculatorEnabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Min Investment (INR)</label>
                      <input type="number" className={inputClass} value={form.minInvestment} onChange={(e) => setForm({ ...form, minInvestment: Number(e.target.value) })} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Max Investment (INR, 0 = property price)</label>
                      <input type="number" className={inputClass} value={form.maxInvestment} onChange={(e) => setForm({ ...form, maxInvestment: Number(e.target.value) })} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Investment Step (INR)</label>
                      <input type="number" className={inputClass} value={form.investmentStep} onChange={(e) => setForm({ ...form, investmentStep: Number(e.target.value) })} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Projection Years</label>
                      <input type="number" min={1} max={30} className={inputClass} value={form.projectionYears} onChange={(e) => setForm({ ...form, projectionYears: Number(e.target.value) })} />
                    </div>
                  </div>
                )}
              </div>

              <ImageUploader images={form.images} onChange={(imgs) => setForm({ ...form, images: imgs })} />
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border border-border rounded-[var(--radius)] hover:bg-muted">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-[var(--radius)] hover:opacity-90 disabled:opacity-50">
                  {saving ? "Saving..." : editId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
