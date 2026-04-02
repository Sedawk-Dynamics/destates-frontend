"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { updateProfileApi, changePasswordApi } from "@/lib/api";
import { User as UserIcon, Mail, Phone, Shield, Calendar, Lock, Save } from "lucide-react";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, isAuthenticated, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // Sync form when user loads
  useState(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || "");
    }
  });

  if (!isAuthenticated || !user) {
    return (
      <div className="py-20 text-center">
        <div className="max-w-md mx-auto px-4">
          <UserIcon size={64} className="text-muted-foreground/30 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Please Login</h1>
          <p className="text-muted-foreground mb-6">You need to be logged in to view your profile.</p>
          <Button href="/">Go to Home</Button>
        </div>
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    try {
      const res = await updateProfileApi({ name: name.trim(), phone: phone.trim() || undefined });
      updateUser(res.data);
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setChangingPassword(true);
    try {
      await changePasswordApi({ currentPassword, newPassword });
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 bg-input border border-border rounded-[var(--radius)] text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <div className="py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">My Profile</h1>

        {/* Profile Info Card */}
        <div className="bg-card rounded-xl border border-border p-6 mb-6">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                <span className="flex items-center gap-1"><Mail size={13} /> {user.email}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  user.role === "ADMIN" ? "bg-primary/10 text-primary" : "bg-green-100 text-green-700"
                }`}>
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield size={15} className="text-primary shrink-0" />
              <span>Role: <strong className="text-foreground">{user.role === "ADMIN" ? "Administrator" : "Investor"}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone size={15} className="text-primary shrink-0" />
              <span>Phone: <strong className="text-foreground">{user.phone || "Not set"}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar size={15} className="text-primary shrink-0" />
              <span>Joined: <strong className="text-foreground">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
              </strong></span>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="bg-card rounded-xl border border-border p-6 mb-6">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <UserIcon size={18} className="text-primary" /> Edit Profile
          </h3>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
              <input
                className={inputClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email</label>
              <input
                className={`${inputClass} opacity-60 cursor-not-allowed`}
                value={user.email}
                disabled
              />
              <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Phone Number</label>
              <input
                className={inputClass}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-[var(--radius)] hover:opacity-90 disabled:opacity-50"
              >
                <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Lock size={18} className="text-primary" /> Change Password
          </h3>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Current Password</label>
              <input
                type="password"
                className={inputClass}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">New Password</label>
              <input
                type="password"
                className={inputClass}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 6 characters"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Confirm New Password</label>
              <input
                type="password"
                className={inputClass}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={changingPassword}
                className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-sm font-semibold rounded-[var(--radius)] hover:opacity-90 disabled:opacity-50"
              >
                <Lock size={16} /> {changingPassword ? "Changing..." : "Change Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
