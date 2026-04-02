import { ApiResponse, Property, LandPlot, PGListing, User, Testimonial, ContactInquiry, DashboardStats, Investment, CreateOrderResponse, Notification, InsurancePlan, UserInsurance } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.destates.in/api";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("destates_token");
}

async function apiClient<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data;
}

// Properties
export const getProperties = () => apiClient<ApiResponse<Property[]>>("/properties");
export const getPropertyById = (id: string) => apiClient<ApiResponse<Property>>(`/properties/${id}`);

// Plots
export const getPlots = () => apiClient<ApiResponse<LandPlot[]>>("/plots");
export const getPlotById = (id: string) => apiClient<ApiResponse<LandPlot>>(`/plots/${id}`);

// PGs
export const getPGs = () => apiClient<ApiResponse<PGListing[]>>("/pgs");
export const getPGById = (id: string) => apiClient<ApiResponse<PGListing>>(`/pgs/${id}`);

// Testimonials
export const getTestimonials = () => apiClient<ApiResponse<Testimonial[]>>("/testimonials");

// Auth
export const loginApi = (email: string, password: string) =>
  apiClient<ApiResponse<{ user: User; token: string }>>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const registerApi = (data: { name: string; email: string; password: string; phone?: string }) =>
  apiClient<ApiResponse<{ user: User; token: string }>>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getMeApi = () => apiClient<ApiResponse<User>>("/auth/me");

export const updateProfileApi = (data: { name: string; phone?: string }) =>
  apiClient<ApiResponse<User>>("/auth/profile", { method: "PUT", body: JSON.stringify(data) });

export const changePasswordApi = (data: { currentPassword: string; newPassword: string }) =>
  apiClient<ApiResponse<null>>("/auth/change-password", { method: "PUT", body: JSON.stringify(data) });

// Investments
export const createInvestmentOrder = (data: { propertyId: string; fractions: number }) =>
  apiClient<ApiResponse<CreateOrderResponse>>("/investments/create-order", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const verifyInvestmentPayment = (data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) =>
  apiClient<ApiResponse<Investment>>("/investments/verify-payment", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getMyInvestments = () =>
  apiClient<ApiResponse<Investment[]>>("/investments/my");

// Notifications
export const getNotifications = () =>
  apiClient<ApiResponse<Notification[]>>("/notifications");

export const getUnreadNotificationCount = () =>
  apiClient<ApiResponse<{ count: number }>>("/notifications/unread-count");

export const markNotificationRead = (id: string) =>
  apiClient<ApiResponse<null>>(`/notifications/${id}/read`, { method: "PUT" });

export const markAllNotificationsRead = () =>
  apiClient<ApiResponse<null>>("/notifications/read-all", { method: "PUT" });

// Insurance
export const getInsurancePlans = (propertyId: string) =>
  apiClient<ApiResponse<InsurancePlan[]>>(`/insurance/plans/${propertyId}`);

export const createInsuranceOrder = (data: { investmentId: string; insurancePlanId: string }) =>
  apiClient<ApiResponse<CreateOrderResponse>>("/insurance/create-order", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const verifyInsurancePayment = (data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) =>
  apiClient<ApiResponse<UserInsurance>>("/insurance/verify-payment", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getMyInsurances = () =>
  apiClient<ApiResponse<UserInsurance[]>>("/insurance/my");

// Contact
export const submitContact = (data: { name: string; email: string; phone?: string; subject: string; message: string }) =>
  apiClient<ApiResponse<null>>("/contact", { method: "POST", body: JSON.stringify(data) });

// Admin APIs
export const getAdminStats = () => apiClient<ApiResponse<DashboardStats>>("/admin/stats");
export const getAdminUsers = () => apiClient<ApiResponse<User[]>>("/admin/users");
export const getAdminInquiries = () => apiClient<ApiResponse<ContactInquiry[]>>("/admin/inquiries");
export const getAdminInvestments = () => apiClient<ApiResponse<any[]>>("/admin/investments");

export const adminFractionSplit = (id: string, data: { newTotalFractions: number; newPricePerFraction: number }) =>
  apiClient<ApiResponse<Property>>(`/admin/properties/${id}/fraction-split`, { method: "PUT", body: JSON.stringify(data) });

// Admin Insurance Plans
export const getAllAdminInsurancePlans = () =>
  apiClient<ApiResponse<(InsurancePlan & { property?: { id: string; name: string; city: string } })[]>>("/admin/insurance-plans");
export const getAdminInsurancePlans = (propertyId: string) =>
  apiClient<ApiResponse<InsurancePlan[]>>(`/admin/insurance-plans/${propertyId}`);
export const adminCreateInsurancePlan = (data: Partial<InsurancePlan>) =>
  apiClient<ApiResponse<InsurancePlan>>("/admin/insurance-plans", { method: "POST", body: JSON.stringify(data) });
export const adminUpdateInsurancePlan = (id: string, data: Partial<InsurancePlan>) =>
  apiClient<ApiResponse<InsurancePlan>>(`/admin/insurance-plans/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const adminDeleteInsurancePlan = (id: string) =>
  apiClient<ApiResponse<null>>(`/admin/insurance-plans/${id}`, { method: "DELETE" });
export const adminConnectInsurancePlan = (planId: string, propertyId: string) =>
  apiClient<ApiResponse<null>>("/admin/insurance-plans/connect", { method: "POST", body: JSON.stringify({ planId, propertyId }) });
export const adminDisconnectInsurancePlan = (planId: string, propertyId: string) =>
  apiClient<ApiResponse<null>>("/admin/insurance-plans/disconnect", { method: "POST", body: JSON.stringify({ planId, propertyId }) });

export const adminTogglePropertyDisabled = (id: string) =>
  apiClient<ApiResponse<Property>>(`/admin/properties/${id}/toggle-disabled`, { method: "PUT" });

// Admin Properties
export const adminCreateProperty = (data: Partial<Property>) =>
  apiClient<ApiResponse<Property>>("/admin/properties", { method: "POST", body: JSON.stringify(data) });
export const adminUpdateProperty = (id: string, data: Partial<Property>) =>
  apiClient<ApiResponse<Property>>(`/admin/properties/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const adminDeleteProperty = (id: string) =>
  apiClient<ApiResponse<null>>(`/admin/properties/${id}`, { method: "DELETE" });

// Admin Plots
export const adminCreatePlot = (data: Partial<LandPlot>) =>
  apiClient<ApiResponse<LandPlot>>("/admin/plots", { method: "POST", body: JSON.stringify(data) });
export const adminUpdatePlot = (id: string, data: Partial<LandPlot>) =>
  apiClient<ApiResponse<LandPlot>>(`/admin/plots/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const adminDeletePlot = (id: string) =>
  apiClient<ApiResponse<null>>(`/admin/plots/${id}`, { method: "DELETE" });

// Admin PGs
export const adminCreatePG = (data: Partial<PGListing>) =>
  apiClient<ApiResponse<PGListing>>("/admin/pgs", { method: "POST", body: JSON.stringify(data) });
export const adminUpdatePG = (id: string, data: Partial<PGListing>) =>
  apiClient<ApiResponse<PGListing>>(`/admin/pgs/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const adminDeletePG = (id: string) =>
  apiClient<ApiResponse<null>>(`/admin/pgs/${id}`, { method: "DELETE" });

// Admin Testimonials
export const getAdminTestimonials = () => apiClient<ApiResponse<Testimonial[]>>("/admin/testimonials");
export const adminCreateTestimonial = (data: Partial<Testimonial>) =>
  apiClient<ApiResponse<Testimonial>>("/admin/testimonials", { method: "POST", body: JSON.stringify(data) });
export const adminUpdateTestimonial = (id: string, data: Partial<Testimonial>) =>
  apiClient<ApiResponse<Testimonial>>(`/admin/testimonials/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const adminDeleteTestimonial = (id: string) =>
  apiClient<ApiResponse<null>>(`/admin/testimonials/${id}`, { method: "DELETE" });

// Upload
export const uploadImage = async (file: File): Promise<string> => {
  const token = getToken();
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(`${API_BASE}/upload/image`, {
    method: "POST",
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Upload failed");
  return data.data.url;
};

export const uploadImages = async (files: File[]): Promise<string[]> => {
  const token = getToken();
  const formData = new FormData();
  files.forEach((f) => formData.append("images", f));
  const res = await fetch(`${API_BASE}/upload/images`, {
    method: "POST",
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Upload failed");
  return data.data.urls;
};
