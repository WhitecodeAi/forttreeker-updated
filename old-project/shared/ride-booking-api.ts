// Ride booking data structures
export interface Vehicle {
  id: string;
  type: 'jeep' | 'taxi' | 'suv' | 'bus';
  name: string;
  capacity: number;
  pricePerKm: number;
  basePrice: number;
  features: string[];
  imageUrl?: string;
  isActive: boolean;
  driverId: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email?: string;
  rating: number;
  totalTrips: number;
  vehicles: string[];
  licenseNumber: string;
  experienceYears: number;
  languages: string[];
  isActive: boolean;
  isVerified: boolean;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FortTransportRoute {
  id: string;
  fortId: number;
  fortName: string;
  pickupPoints: PickupPoint[];
  dropoffPoint: {
    name: string;
    description: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  distance: number;
  estimatedTravelTime: string;
  isActive: boolean;
}

export interface PickupPoint {
  id: string;
  name: string;
  address: string;
  landmark?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  isPopular: boolean;
}

export interface RideBooking {
  id: string;
  userId?: string;
  customerInfo: {
    name: string;
    phone: string;
    email?: string;
  };
  fortId: number;
  routeId: string;
  vehicleId: string;
  driverId: string;
  pickupPointId: string;
  bookingDate: string;
  pickupTime: string;
  numberOfPeople: number;
  totalPrice: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  bookingStatus: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
  confirmedAt?: Date;
  completedAt?: Date;
}

export interface EnrichedVehicle extends Vehicle {
  driver: {
    id: string;
    name: string;
    rating: number;
    totalTrips: number;
    experienceYears: number;
    languages: string[];
    profileImage?: string;
  } | null;
  calculatedPrice: number;
  priceBreakdown: {
    basePrice: number;
    distanceCharge: number;
    distance: number;
    discount: number;
  };
}

export interface EnrichedRideBooking extends RideBooking {
  route?: {
    id: string;
    fortName: string;
    distance: number;
    estimatedTravelTime?: string;
  } | null;
  vehicle?: {
    id: string;
    name: string;
    type: string;
  } | null;
  driver?: {
    id: string;
    name: string;
    phone: string;
    rating: number;
    experienceYears?: number;
    languages?: string[];
    profileImage?: string;
  } | null;
  pickupPoint?: {
    id: string;
    name: string;
    address: string;
    landmark?: string;
  } | null;
}

export interface RideNotification {
  id: string;
  driverId: string;
  bookingId: string;
  type: 'new_booking' | 'booking_cancelled' | 'payment_received';
  message: string;
  isRead: boolean;
  createdAt: Date;
}

// API Response types
export interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  total: number;
  page: number;
  totalPages: number;
}

// Ride booking API responses
export interface TransportRoutesResponse extends APIResponse<FortTransportRoute[]> {}
export interface AvailableVehiclesResponse extends APIResponse<EnrichedVehicle[]> {
  route?: FortTransportRoute;
}
export interface RideBookingResponse extends APIResponse<EnrichedRideBooking> {}
export interface RideBookingsResponse extends PaginatedResponse<EnrichedRideBooking> {}

// Admin statistics
export interface AdminStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  totalRevenue: number;
  activeDrivers: number;
  activeVehicles: number;
  activeRoutes: number;
  bookingsByStatus: {
    pending: number;
    confirmed: number;
    rejected: number;
    completed: number;
    cancelled: number;
  };
  vehicleTypeDistribution: Record<string, number>;
}

export interface AdminStatsResponse extends APIResponse<AdminStats> {}

// Notifications response
export interface NotificationsResponse extends APIResponse<RideNotification[]> {
  unreadCount: number;
}

// Create ride booking request
export interface CreateRideBookingRequest {
  customerInfo: {
    name: string;
    phone: string;
    email?: string;
  };
  fortId: number;
  routeId: string;
  vehicleId: string;
  pickupPointId: string;
  bookingDate: string;
  pickupTime: string;
  numberOfPeople: number;
  specialRequests?: string;
}

// Query parameters
export interface VehiclesQueryParams {
  fortId: number;
  numberOfPeople?: number;
  date?: string;
  time?: string;
}

export interface BookingsQueryParams {
  phone?: string;
  status?: string;
  date?: string;
  limit?: number;
  offset?: number;
}

// API endpoints
export const RIDE_BOOKING_API_ENDPOINTS = {
  ROUTES: '/api/ride-bookings/routes',
  VEHICLES: '/api/ride-bookings/vehicles',
  BOOKINGS: '/api/ride-bookings',
  BOOKING_BY_ID: (id: string) => `/api/ride-bookings/${id}`,
  UPDATE_STATUS: (id: string) => `/api/ride-bookings/${id}/status`,
  DRIVER_BOOKINGS: (driverId: string) => `/api/ride-bookings/driver/${driverId}`,
  DRIVER_NOTIFICATIONS: (driverId: string) => `/api/ride-bookings/driver/${driverId}/notifications`,
  MARK_NOTIFICATION_READ: (id: string) => `/api/ride-bookings/notifications/${id}/read`,
  ADMIN_STATS: '/api/ride-bookings/admin/stats'
} as const;

// Vehicle type options
export const VEHICLE_TYPE_OPTIONS = [
  { value: 'jeep', label: 'Jeep', icon: '🚙' },
  { value: 'taxi', label: 'Taxi', icon: '🚕' },
  { value: 'suv', label: 'SUV', icon: '🚙' },
  { value: 'bus', label: 'Bus', icon: '🚌' }
] as const;

// Booking status options
export const BOOKING_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'confirmed', label: 'Confirmed', color: 'green' },
  { value: 'rejected', label: 'Rejected', color: 'red' },
  { value: 'completed', label: 'Completed', color: 'blue' },
  { value: 'cancelled', label: 'Cancelled', color: 'gray' }
] as const;

// Payment status options
export const PAYMENT_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'paid', label: 'Paid', color: 'green' },
  { value: 'failed', label: 'Failed', color: 'red' },
  { value: 'refunded', label: 'Refunded', color: 'blue' }
] as const;

// Time slots for pickup
export const PICKUP_TIME_SLOTS = [
  '05:00', '05:30', '06:00', '06:30', '07:00', '07:30',
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00'
] as const;
