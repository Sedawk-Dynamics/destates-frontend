export interface Property {
  id: string;
  name: string;
  location: string;
  city: string;
  price: number;
  expectedROI: number;
  monthlyYield: number | null;
  area: number;
  totalFractions: number;
  availableFractions: number;
  pricePerFraction: number;
  status: "AVAILABLE" | "LIMITED" | "SOLD_OUT";
  description: string;
  highlights: string[];
  images: string[];
  reraRegistered: boolean;
  readyToMove: boolean;
  disabled: boolean;
  type: string;
  roiCalculatorEnabled: boolean;
  projectionYears: number;
  capitalAppreciation: number;
  rentalYieldMonths: number;
  lockInPeriod: number;
  minFractions: number;
  maxFractions: number | null;
}

export interface LandPlot {
  id: string;
  name: string;
  location: string;
  city: string;
  totalArea: number;
  pricePerSqft: number;
  minArea: number;
  amenities: string[];
  description: string;
  images: string[];
}

export interface PGListing {
  id: string;
  name: string;
  location: string;
  city: string;
  monthlyRent: number;
  roomType: string;
  amenities: string[];
  contactPhone: string;
  description: string;
  images: string[];
  available: boolean;
}

export interface Investment {
  id: string;
  userId: string;
  propertyId: string;
  fractions: number;
  amountPaid: number;
  pricePerFraction: number;
  status: "PENDING" | "COMPLETED" | "FAILED";
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  createdAt: string;
  property?: Property;
  insurances?: UserInsurance[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  createdAt?: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface DashboardStats {
  users: number;
  properties: number;
  plots: number;
  pgs: number;
  inquiries: number;
  investments: number;
  totalRevenue: number;
}

export interface Testimonial {
  id: string;
  name: string;
  designation: string;
  company: string;
  content: string;
  rating: number;
  avatarUrl?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface InsurancePlan {
  id: string;
  name: string;
  monthlyPremium: number;
  coverage: string;
  active: boolean;
  createdAt: string;
  properties?: { id: string; name: string; city: string }[];
}

export interface UserInsurance {
  id: string;
  userId: string;
  investmentId: string;
  insurancePlanId: string;
  amountPaid: number;
  status: "PENDING" | "ACTIVE" | "EXPIRED" | "CANCELLED";
  createdAt: string;
  insurancePlan?: InsurancePlan;
  investment?: Investment & { property?: { id: string; name: string } };
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  investmentId: string;
  key: string;
}
