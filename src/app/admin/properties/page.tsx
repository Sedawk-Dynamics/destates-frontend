"use client";

import { useEffect, useState } from "react";
import { Property, InsurancePlan } from "@/types";
import { getProperties, adminCreateProperty, adminUpdateProperty, adminDeleteProperty, adminFractionSplit, adminTogglePropertyDisabled, getAllAdminInsurancePlans, getAdminInsurancePlans, adminConnectInsurancePlan, adminDisconnectInsurancePlan } from "@/lib/api";
import { Plus, Pencil, Trash2, X, Split, Ban, CheckCircle, ShieldCheck, Link2, Unlink } from "lucide-react";
import toast from "react-hot-toast";
import ImageUploader from "@/components/admin/ImageUploader";
import { formatPrice } from "@/lib/utils";

const emptyForm = {
  name: "", location: "", city: "", price: 0, expectedROI: 0, monthlyYield: 0,
  area: 0, totalFractions: 100, availableFractions: 100, pricePerFraction: 10000,
  status: "AVAILABLE" as Property["status"],
  description: "", highlights: "", images: [] as string[], reraRegistered: true, readyToMove: false, type: "Residential",
  roiCalculatorEnabled: true, projectionYears: 5, capitalAppreciation: 5, rentalYieldMonths: 12,
  lockInPeriod: 0, minFractions: 1, maxFractions: 0,
};

export default function AdminProperties() {
  const [items, setItems] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [splitModal, setSplitModal] = useState<Property | null>(null);
  const [splitForm, setSplitForm] = useState({ newTotalFractions: 0, newPricePerFraction: 0 });
  const [splitting, setSplitting] = useState(false);
  // Insurance connection
  const [insProperty, setInsProperty] = useState<Property | null>(null);
  const [connectedPlans, setConnectedPlans] = useState<InsurancePlan[]>([]);
  const [allPlans, setAllPlans] = useState<(InsurancePlan & { properties?: { id: string; name: string }[] })[]>([]);
  const [insLoading, setInsLoading] = useState(false);

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
      totalFractions: p.totalFractions, availableFractions: p.availableFractions,
      pricePerFraction: p.pricePerFraction, status: p.status,
      description: p.description, highlights: p.highlights.join(", "),
      images: [...p.images], reraRegistered: p.reraRegistered,
      readyToMove: p.readyToMove, type: p.type,
      roiCalculatorEnabled: p.roiCalculatorEnabled ?? true,
      projectionYears: p.projectionYears ?? 5,
      capitalAppreciation: p.capitalAppreciation ?? 5,
      rentalYieldMonths: p.rentalYieldMonths ?? 12,
      lockInPeriod: p.lockInPeriod ?? 0,
      minFractions: p.minFractions ?? 1,
      maxFractions: p.maxFractions || 0,
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
        totalFractions: Number(form.totalFractions), availableFractions: Number(form.availableFractions),
        pricePerFraction: Number(form.pricePerFraction),
        highlights: form.highlights.split(",").map((s) => s.trim()).filter(Boolean),
        images: form.images,
        projectionYears: Number(form.projectionYears),
        capitalAppreciation: Number(form.capitalAppreciation),
        rentalYieldMonths: Number(form.rentalYieldMonths),
        lockInPeriod: Number(form.lockInPeriod),
        minFractions: Number(form.minFractions),
        maxFractions: Number(form.maxFractions) || null,
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

  const openSplit = (p: Property) => {
    setSplitForm({ newTotalFractions: p.totalFractions, newPricePerFraction: p.pricePerFraction });
    setSplitModal(p);
  };

  const handleSplit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!splitModal) return;
    if (splitForm.newTotalFractions < 1 || splitForm.newPricePerFraction <= 0) {
      toast.error("Invalid values"); return;
    }
    if (!confirm(
      `This will split ${splitModal.name} from ${splitModal.totalFractions} fractions @ ₹${splitModal.pricePerFraction.toLocaleString("en-IN")} to ${splitForm.newTotalFractions} fractions @ ₹${splitForm.newPricePerFraction.toLocaleString("en-IN")}. All investor holdings will be automatically adjusted and notified. Continue?`
    )) return;

    setSplitting(true);
    try {
      const res = await adminFractionSplit(splitModal.id, {
        newTotalFractions: Number(splitForm.newTotalFractions),
        newPricePerFraction: Number(splitForm.newPricePerFraction),
      });
      toast.success(res.message || "Fraction split completed!");
      setSplitModal(null);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to split fractions");
    } finally {
      setSplitting(false);
    }
  };

  // Insurance connection handlers
  const openInsConnect = async (p: Property) => {
    setInsProperty(p);
    setInsLoading(true);
    try {
      const [connected, all] = await Promise.all([
        getAdminInsurancePlans(p.id),
        getAllAdminInsurancePlans(),
      ]);
      setConnectedPlans(connected.data);
      setAllPlans(all.data);
    } catch {} finally { setInsLoading(false); }
  };

  const handleConnectPlan = async (planId: string) => {
    if (!insProperty) return;
    try {
      await adminConnectInsurancePlan(planId, insProperty.id);
      toast.success("Insurance plan connected");
      const [connected, all] = await Promise.all([
        getAdminInsurancePlans(insProperty.id),
        getAllAdminInsurancePlans(),
      ]);
      setConnectedPlans(connected.data);
      setAllPlans(all.data);
    } catch (err: any) { toast.error(err.message || "Failed"); }
  };

  const handleDisconnectPlan = async (planId: string) => {
    if (!insProperty) return;
    try {
      await adminDisconnectInsurancePlan(planId, insProperty.id);
      toast.success("Insurance plan disconnected");
      const [connected, all] = await Promise.all([
        getAdminInsurancePlans(insProperty.id),
        getAllAdminInsurancePlans(),
      ]);
      setConnectedPlans(connected.data);
      setAllPlans(all.data);
    } catch (err: any) { toast.error(err.message || "Failed"); }
  };

  const handleToggleDisabled = async (p: Property) => {
    const action = p.disabled ? "enable" : "disable";
    if (!confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} "${p.name}"?${!p.disabled ? " Investors will be notified." : ""}`)) return;
    try {
      const res = await adminTogglePropertyDisabled(p.id);
      toast.success(res.message || `Property ${action}d`);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || `Failed to ${action}`);
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
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Price/Fraction</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Fractions</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">ROI</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((p) => (
                  <tr key={p.id} className={`hover:bg-muted/50 ${p.disabled ? "opacity-60" : ""}`}>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {p.name}
                      {p.disabled && <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-600">DISABLED</span>}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{p.city}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatPrice(p.pricePerFraction)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.availableFractions}/{p.totalFractions}</td>
                    <td className="px-4 py-3 text-primary font-medium">{p.expectedROI}%</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        p.disabled ? "bg-gray-100 text-gray-500" :
                        p.status === "AVAILABLE" ? "bg-green-100 text-green-700" :
                        p.status === "LIMITED" ? "bg-yellow-100 text-yellow-700" :
                        "bg-red-100 text-red-700"
                      }`}>{p.disabled ? "DISABLED" : p.status}</span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button onClick={() => openInsConnect(p)} title="Manage Insurance" className="p-1.5 text-muted-foreground hover:text-blue-500 transition-colors"><ShieldCheck size={15} /></button>
                      <button onClick={() => handleToggleDisabled(p)} title={p.disabled ? "Enable" : "Disable"} className={`p-1.5 transition-colors ml-1 ${p.disabled ? "text-green-500 hover:text-green-600" : "text-muted-foreground hover:text-red-500"}`}>
                        {p.disabled ? <CheckCircle size={15} /> : <Ban size={15} />}
                      </button>
                      <button onClick={() => openSplit(p)} title="Fraction Split" className="p-1.5 text-muted-foreground hover:text-orange-500 transition-colors ml-1"><Split size={15} /></button>
                      <button onClick={() => openEdit(p)} title="Edit" className="p-1.5 text-muted-foreground hover:text-primary transition-colors ml-1"><Pencil size={15} /></button>
                      <button onClick={() => handleDelete(p.id)} title="Delete" className="p-1.5 text-muted-foreground hover:text-destructive transition-colors ml-1"><Trash2 size={15} /></button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No properties found</td></tr>
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
                  <label className="block text-sm font-medium text-foreground mb-1">Total Property Value (INR)</label>
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
              </div>

              {/* Fractional Ownership Settings */}
              <div className="border border-primary/20 rounded-[var(--radius)] p-4 space-y-4 bg-primary/5">
                <h3 className="text-sm font-semibold text-foreground">Fractional Ownership Settings</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Total Fractions</label>
                    <input type="number" min={1} className={inputClass} value={form.totalFractions} onChange={(e) => setForm({ ...form, totalFractions: Number(e.target.value) })} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Available Fractions</label>
                    <input type="number" min={0} className={inputClass} value={form.availableFractions} onChange={(e) => setForm({ ...form, availableFractions: Number(e.target.value) })} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Price per Fraction (INR)</label>
                    <input type="number" min={1} className={inputClass} value={form.pricePerFraction} onChange={(e) => setForm({ ...form, pricePerFraction: Number(e.target.value) })} required />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Users will invest by purchasing fractions at the price per fraction you set. This is the minimum investment amount.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div className="border border-green-200 rounded-[var(--radius)] p-4 space-y-4 bg-green-50/50">
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
                      <label className="block text-sm font-medium text-foreground mb-1">Expected ROI (% p.a.)</label>
                      <input type="number" step="0.1" className={inputClass} value={form.expectedROI} onChange={(e) => setForm({ ...form, expectedROI: Number(e.target.value) })} />
                      <p className="text-[10px] text-muted-foreground mt-0.5">Annual return percentage shown to investors</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Monthly Yield (%)</label>
                      <input type="number" step="0.1" className={inputClass} value={form.monthlyYield} onChange={(e) => setForm({ ...form, monthlyYield: Number(e.target.value) })} />
                      <p className="text-[10px] text-muted-foreground mt-0.5">Monthly rental yield percentage</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Capital Appreciation (% p.a.)</label>
                      <input type="number" step="0.1" className={inputClass} value={form.capitalAppreciation} onChange={(e) => setForm({ ...form, capitalAppreciation: Number(e.target.value) })} />
                      <p className="text-[10px] text-muted-foreground mt-0.5">Annual property value growth rate</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Projection Years</label>
                      <input type="number" min={1} max={30} className={inputClass} value={form.projectionYears} onChange={(e) => setForm({ ...form, projectionYears: Number(e.target.value) })} />
                      <p className="text-[10px] text-muted-foreground mt-0.5">How many years to project returns</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Rental Yield Months</label>
                      <input type="number" min={1} max={12} className={inputClass} value={form.rentalYieldMonths} onChange={(e) => setForm({ ...form, rentalYieldMonths: Number(e.target.value) })} />
                      <p className="text-[10px] text-muted-foreground mt-0.5">Months per year rental income is received</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Lock-in Period (months)</label>
                      <input type="number" min={0} className={inputClass} value={form.lockInPeriod} onChange={(e) => setForm({ ...form, lockInPeriod: Number(e.target.value) })} />
                      <p className="text-[10px] text-muted-foreground mt-0.5">0 = no lock-in. Shown as info to investors</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Min Fractions per Purchase</label>
                      <input type="number" min={1} className={inputClass} value={form.minFractions} onChange={(e) => setForm({ ...form, minFractions: Number(e.target.value) })} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Max Fractions per User (0 = unlimited)</label>
                      <input type="number" min={0} className={inputClass} value={form.maxFractions} onChange={(e) => setForm({ ...form, maxFractions: Number(e.target.value) })} />
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

      {/* Fraction Split Modal */}
      {splitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Split size={18} className="text-orange-500" /> Fraction Split
              </h2>
              <button onClick={() => setSplitModal(null)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>

            <div className="bg-muted/50 rounded-lg p-3 mb-4 text-sm">
              <p className="font-medium text-foreground mb-1">{splitModal.name}</p>
              <p className="text-muted-foreground">
                Current: <strong>{splitModal.totalFractions}</strong> fractions @ <strong>{"\u20B9"}{splitModal.pricePerFraction.toLocaleString("en-IN")}</strong> each
              </p>
              <p className="text-muted-foreground">
                Sold: <strong>{splitModal.totalFractions - splitModal.availableFractions}</strong> fractions
              </p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4 text-xs text-orange-800">
              <strong>Warning:</strong> This will automatically adjust all existing investor holdings proportionally and send them a notification. For example, if you double the fractions (2x split), each investor&apos;s fraction count will also double.
            </div>

            <form onSubmit={handleSplit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">New Total Fractions</label>
                <input
                  type="number"
                  min={1}
                  className={inputClass}
                  value={splitForm.newTotalFractions}
                  onChange={(e) => setSplitForm({ ...splitForm, newTotalFractions: Number(e.target.value) })}
                  required
                />
                {splitForm.newTotalFractions > 0 && splitModal.totalFractions > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Split ratio: <strong>{(splitForm.newTotalFractions / splitModal.totalFractions).toFixed(2)}x</strong>
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">New Price per Fraction (INR)</label>
                <input
                  type="number"
                  min={1}
                  step="0.01"
                  className={inputClass}
                  value={splitForm.newPricePerFraction}
                  onChange={(e) => setSplitForm({ ...splitForm, newPricePerFraction: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setSplitModal(null)} className="px-4 py-2 text-sm border border-border rounded-[var(--radius)] hover:bg-muted">Cancel</button>
                <button type="submit" disabled={splitting} className="px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-[var(--radius)] hover:bg-orange-600 disabled:opacity-50">
                  {splitting ? "Splitting..." : "Execute Split"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Insurance Connection Modal */}
      {insProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <ShieldCheck size={18} className="text-blue-500" /> Insurance — {insProperty.name}
              </h2>
              <button onClick={() => setInsProperty(null)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>

            {insLoading ? (
              <div className="py-8 text-center text-muted-foreground text-sm">Loading...</div>
            ) : (
              <>
                {/* Connected Plans */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Connected Plans ({connectedPlans.length})</h3>
                  {connectedPlans.length === 0 ? (
                    <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-4 text-center">No insurance plans connected. Add from below.</p>
                  ) : (
                    <div className="space-y-2">
                      {connectedPlans.map((plan) => (
                        <div key={plan.id} className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
                          <div>
                            <p className="font-medium text-foreground text-sm">{plan.name}</p>
                            <p className="text-xs text-muted-foreground">{formatPrice(plan.monthlyPremium)}/mo — {plan.coverage.slice(0, 80)}{plan.coverage.length > 80 ? "..." : ""}</p>
                          </div>
                          <button
                            onClick={() => handleDisconnectPlan(plan.id)}
                            title="Disconnect"
                            className="text-red-400 hover:text-red-600 shrink-0 ml-2 transition-colors"
                          >
                            <Unlink size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Available Plans to Connect */}
                {(() => {
                  const connectedIds = new Set(connectedPlans.map((p) => p.id));
                  const available = allPlans.filter((p) => !connectedIds.has(p.id));
                  if (available.length === 0) return (
                    <p className="text-sm text-muted-foreground text-center">All plans are already connected or none exist. Create new plans from the <strong>Insurance</strong> panel.</p>
                  );
                  return (
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-3">Available Plans — Click to Connect</h3>
                      <div className="space-y-2">
                        {available.map((plan) => (
                          <button
                            key={plan.id}
                            onClick={() => handleConnectPlan(plan.id)}
                            className="w-full bg-card border border-border rounded-lg p-3 flex items-center justify-between hover:border-blue-300 hover:bg-blue-50/50 transition-colors text-left"
                          >
                            <div>
                              <p className="font-medium text-foreground text-sm">{plan.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatPrice(plan.monthlyPremium)}/mo
                                {plan.properties && plan.properties.length > 0 ? ` — on ${plan.properties.map(p => p.name).join(", ")}` : ""}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">{plan.coverage.slice(0, 80)}{plan.coverage.length > 80 ? "..." : ""}</p>
                            </div>
                            <Link2 size={16} className="text-blue-500 shrink-0 ml-2" />
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">
                        Connecting a plan from another property will move it to this one. Create new plans from the <strong>Insurance</strong> panel in the sidebar.
                      </p>
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
