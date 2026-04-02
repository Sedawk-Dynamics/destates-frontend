"use client";

import { useEffect, useState } from "react";
import { InsurancePlan, Property } from "@/types";
import { getProperties, getAllAdminInsurancePlans, adminCreateInsurancePlan, adminUpdateInsurancePlan, adminDeleteInsurancePlan, adminConnectInsurancePlan, adminDisconnectInsurancePlan } from "@/lib/api";
import { Plus, Pencil, Trash2, X, ShieldCheck, Link2, Unlink, Building } from "lucide-react";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils";

type PlanWithProperties = InsurancePlan & { properties?: { id: string; name: string; city: string }[] };

export default function AdminInsurance() {
  const [plans, setPlans] = useState<PlanWithProperties[]>([]);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", monthlyPremium: 0, coverage: "" });
  const [saving, setSaving] = useState(false);
  // Detail/connect modal
  const [selectedPlan, setSelectedPlan] = useState<PlanWithProperties | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [plansRes, propsRes] = await Promise.all([
        getAllAdminInsurancePlans(),
        getProperties(),
      ]);
      setPlans(plansRes.data);
      setAllProperties(propsRes.data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setForm({ name: "", monthlyPremium: 0, coverage: "" });
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (plan: PlanWithProperties) => {
    setForm({ name: plan.name, monthlyPremium: plan.monthlyPremium, coverage: plan.coverage });
    setEditId(plan.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { name: form.name, monthlyPremium: Number(form.monthlyPremium), coverage: form.coverage };
      if (editId) {
        await adminUpdateInsurancePlan(editId, data);
        toast.success("Plan updated");
      } else {
        await adminCreateInsurancePlan(data);
        toast.success("Plan created");
      }
      setShowForm(false);
      fetchData();
    } catch (err: any) { toast.error(err.message || "Failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this insurance plan?")) return;
    try {
      await adminDeleteInsurancePlan(id);
      toast.success("Deleted");
      setSelectedPlan(null);
      fetchData();
    } catch { toast.error("Failed to delete"); }
  };

  const handleConnect = async (propertyId: string) => {
    if (!selectedPlan) return;
    try {
      await adminConnectInsurancePlan(selectedPlan.id, propertyId);
      toast.success("Connected");
      const res = await getAllAdminInsurancePlans();
      setPlans(res.data);
      setSelectedPlan(res.data.find((p: PlanWithProperties) => p.id === selectedPlan.id) || null);
    } catch (err: any) { toast.error(err.message || "Failed"); }
  };

  const handleDisconnect = async (propertyId: string) => {
    if (!selectedPlan) return;
    try {
      await adminDisconnectInsurancePlan(selectedPlan.id, propertyId);
      toast.success("Disconnected");
      const res = await getAllAdminInsurancePlans();
      setPlans(res.data);
      setSelectedPlan(res.data.find((p: PlanWithProperties) => p.id === selectedPlan.id) || null);
    } catch (err: any) { toast.error(err.message || "Failed"); }
  };

  const inputClass = "w-full px-3 py-2 bg-input border border-border rounded-[var(--radius)] text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Insurance Plans</h1>
          <p className="text-sm text-muted-foreground mt-1">Create plans and click on them to connect to properties.</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-[var(--radius)] hover:bg-blue-600">
          <Plus size={16} /> Add Insurance
        </button>
      </div>

      {loading ? (
        <div className="bg-card rounded-xl border border-border p-8 text-center text-muted-foreground">Loading...</div>
      ) : plans.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center text-muted-foreground">
          No insurance plans yet. Click &quot;Add Insurance&quot; to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const connCount = plan.properties?.length || 0;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className="bg-card rounded-xl border border-border p-5 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-blue-500" />
                    <span className="font-bold text-foreground">{plan.name}</span>
                  </div>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => openEdit(plan)} className="p-1 text-muted-foreground hover:text-primary"><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(plan.id)} className="p-1 text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                  </div>
                </div>
                <p className="text-2xl font-bold text-primary">{formatPrice(plan.monthlyPremium)}<span className="text-xs font-normal text-muted-foreground">/mo</span></p>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{plan.coverage}</p>
                <div className="mt-4 pt-3 border-t border-border flex items-center gap-2 text-xs">
                  <Building size={13} className={connCount > 0 ? "text-blue-500" : "text-muted-foreground"} />
                  {connCount > 0 ? (
                    <span className="text-foreground">
                      Connected to <strong>{connCount}</strong> {connCount === 1 ? "property" : "properties"}
                    </span>
                  ) : (
                    <span className="text-orange-500">Not connected to any property</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Plan Detail / Connect Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <ShieldCheck size={20} className="text-blue-500" /> {selectedPlan.name}
              </h2>
              <button onClick={() => setSelectedPlan(null)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 mb-5">
              <p className="text-2xl font-bold text-primary">{formatPrice(selectedPlan.monthlyPremium)}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{selectedPlan.coverage}</p>
            </div>

            {/* Connected Properties */}
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">Connected Properties ({selectedPlan.properties?.length || 0})</h3>
              {(!selectedPlan.properties || selectedPlan.properties.length === 0) ? (
                <p className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-3 text-center">No properties connected yet.</p>
              ) : (
                <div className="space-y-2">
                  {selectedPlan.properties.map((prop) => (
                    <div key={prop.id} className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground text-sm">{prop.name}</p>
                        <p className="text-xs text-muted-foreground">{prop.city}</p>
                      </div>
                      <button
                        onClick={() => handleDisconnect(prop.id)}
                        title="Disconnect"
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Unlink size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Available Properties to Connect */}
            {(() => {
              const connectedIds = new Set(selectedPlan.properties?.map((p) => p.id) || []);
              const available = allProperties.filter((p) => !connectedIds.has(p.id));
              if (available.length === 0) return (
                <p className="text-sm text-muted-foreground text-center">All properties are already connected.</p>
              );
              return (
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">Connect to Property</h3>
                  <div className="space-y-2">
                    {available.map((prop) => (
                      <button
                        key={prop.id}
                        onClick={() => handleConnect(prop.id)}
                        className="w-full bg-card border border-border rounded-lg px-4 py-3 flex items-center justify-between hover:border-blue-300 hover:bg-blue-50/50 transition-colors text-left"
                      >
                        <div>
                          <p className="font-medium text-foreground text-sm">{prop.name}</p>
                          <p className="text-xs text-muted-foreground">{prop.city}</p>
                        </div>
                        <Link2 size={16} className="text-blue-500 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <ShieldCheck size={20} className="text-blue-500" /> {editId ? "Edit" : "Create"} Plan
              </h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Plan Name</label>
                <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Basic, Standard, Premium" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Monthly Premium (INR)</label>
                <input type="number" min={1} className={inputClass} value={form.monthlyPremium} onChange={(e) => setForm({ ...form, monthlyPremium: Number(e.target.value) })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Coverage Description</label>
                <textarea className={inputClass} rows={3} value={form.coverage} onChange={(e) => setForm({ ...form, coverage: e.target.value })} placeholder="Structural damage, fire, flooding..." required />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border border-border rounded-[var(--radius)] hover:bg-muted">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-[var(--radius)] hover:bg-blue-600 disabled:opacity-50">
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
