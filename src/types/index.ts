export interface Property {
  id: string;
  name: string;
  location: string;
  city: string;
  price: number;
  expectedROI: number;
  monthlyYield: number | null;
  area: number;
  units: number;
  availableUnits: number;
  status: "AVAILABLE" | "LIMITED" | "SOLD_OUT";
  description: string;
  highlights: string[];
  images: string[];
  reraRegistered: boolean;
  readyToMove: boolean;
  type: string;
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

export interface CartItem {
  id: string;
  itemType: "PROPERTY" | "PLOT";
  itemId: string;
  quantity: number;
  selectedArea?: number;
  details?: Property | LandPlot;
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
