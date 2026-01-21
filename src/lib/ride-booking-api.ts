import { 
  FortTransportRoute,
  EnrichedVehicle,
  RideBooking,
  EnrichedRideBooking,
  RideNotification,
  TransportRoutesResponse,
  AvailableVehiclesResponse,
  RideBookingResponse,
  RideBookingsResponse,
  NotificationsResponse,
  AdminStatsResponse,
  CreateRideBookingRequest,
  VehiclesQueryParams,
  BookingsQueryParams,
  RIDE_BOOKING_API_ENDPOINTS
} from '@shared/ride-booking-api';

class RideBookingAPIService {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || '';
  }

  private async fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response received:', text.substring(0, 200) + '...');
        throw new Error('Server returned non-JSON response. Please check server configuration.');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      if (error instanceof SyntaxError && error.message.includes('Unexpected token')) {
        console.error('JSON parsing error - likely received HTML instead of JSON');
        throw new Error('API connection error: Server returned HTML instead of JSON. Please refresh the page.');
      }
      console.error('Ride Booking API Error:', error);
      throw error;
    }
  }

  // Get transport routes for forts
  async getTransportRoutes(fortId?: number): Promise<TransportRoutesResponse> {
    const searchParams = new URLSearchParams();
    if (fortId) {
      searchParams.append('fortId', fortId.toString());
    }

    const queryString = searchParams.toString();
    const url = queryString ? `${RIDE_BOOKING_API_ENDPOINTS.ROUTES}?${queryString}` : RIDE_BOOKING_API_ENDPOINTS.ROUTES;
    
    return this.fetchAPI<TransportRoutesResponse>(url);
  }

  // Get available vehicles for a fort
  async getAvailableVehicles(params: VehiclesQueryParams): Promise<AvailableVehiclesResponse> {
    const searchParams = new URLSearchParams();
    
    searchParams.append('fortId', params.fortId.toString());
    if (params.numberOfPeople) {
      searchParams.append('numberOfPeople', params.numberOfPeople.toString());
    }
    if (params.date) {
      searchParams.append('date', params.date);
    }
    if (params.time) {
      searchParams.append('time', params.time);
    }

    return this.fetchAPI<AvailableVehiclesResponse>(
      `${RIDE_BOOKING_API_ENDPOINTS.VEHICLES}?${searchParams.toString()}`
    );
  }

  // Create a new ride booking
  async createRideBooking(bookingData: CreateRideBookingRequest): Promise<RideBookingResponse> {
    return this.fetchAPI<RideBookingResponse>(RIDE_BOOKING_API_ENDPOINTS.BOOKINGS, {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  // Get user's ride bookings
  async getUserRideBookings(params?: BookingsQueryParams): Promise<RideBookingsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const url = queryString ? `${RIDE_BOOKING_API_ENDPOINTS.BOOKINGS}?${queryString}` : RIDE_BOOKING_API_ENDPOINTS.BOOKINGS;
    
    return this.fetchAPI<RideBookingsResponse>(url);
  }

  // Get single ride booking by ID
  async getRideBookingById(id: string): Promise<RideBookingResponse> {
    return this.fetchAPI<RideBookingResponse>(RIDE_BOOKING_API_ENDPOINTS.BOOKING_BY_ID(id));
  }

  // Update booking status (for drivers)
  async updateBookingStatus(id: string, status: 'confirmed' | 'rejected', driverId: string): Promise<RideBookingResponse> {
    return this.fetchAPI<RideBookingResponse>(RIDE_BOOKING_API_ENDPOINTS.UPDATE_STATUS(id), {
      method: 'PATCH',
      body: JSON.stringify({ status, driverId }),
    });
  }

  // Get driver's bookings
  async getDriverBookings(driverId: string, params?: BookingsQueryParams): Promise<RideBookingsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const url = queryString ? 
      `${RIDE_BOOKING_API_ENDPOINTS.DRIVER_BOOKINGS(driverId)}?${queryString}` : 
      RIDE_BOOKING_API_ENDPOINTS.DRIVER_BOOKINGS(driverId);
    
    return this.fetchAPI<RideBookingsResponse>(url);
  }

  // Get driver notifications
  async getDriverNotifications(driverId: string, unreadOnly: boolean = false): Promise<NotificationsResponse> {
    const searchParams = new URLSearchParams();
    if (unreadOnly) {
      searchParams.append('unreadOnly', 'true');
    }

    const queryString = searchParams.toString();
    const url = queryString ? 
      `${RIDE_BOOKING_API_ENDPOINTS.DRIVER_NOTIFICATIONS(driverId)}?${queryString}` : 
      RIDE_BOOKING_API_ENDPOINTS.DRIVER_NOTIFICATIONS(driverId);
    
    return this.fetchAPI<NotificationsResponse>(url);
  }

  // Mark notification as read
  async markNotificationRead(id: string): Promise<{ success: boolean; message: string }> {
    return this.fetchAPI<{ success: boolean; message: string }>(
      RIDE_BOOKING_API_ENDPOINTS.MARK_NOTIFICATION_READ(id), 
      { method: 'PATCH' }
    );
  }

  // Get admin statistics
  async getAdminStats(): Promise<AdminStatsResponse> {
    return this.fetchAPI<AdminStatsResponse>(RIDE_BOOKING_API_ENDPOINTS.ADMIN_STATS);
  }
}

export const rideBookingAPI = new RideBookingAPIService();

// Utility functions for ride booking operations
export const rideBookingHelpers = {
  getVehicleTypeIcon: (type: string) => {
    switch (type) {
      case 'jeep': return '🚙';
      case 'taxi': return '🚕';
      case 'suv': return '🚙';
      case 'bus': return '🚌';
      default: return '🚗';
    }
  },

  getBookingStatusColor: (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  },

  getPaymentStatusColor: (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'refunded': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  },

  formatPrice: (price: number) => {
    return `₹${price.toLocaleString()}`;
  },

  formatTime: (time: string) => {
    return time;
  },

  formatDate: (date: string) => {
    return new Date(date).toLocaleDateString();
  },

  formatDateTime: (date: string, time: string) => {
    return `${rideBookingHelpers.formatDate(date)} at ${rideBookingHelpers.formatTime(time)}`;
  },

  generateTimeSlots: (startHour: number = 5, endHour: number = 18) => {
    const slots = [];
    for (let hour = startHour; hour <= endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < endHour) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return slots;
  },

  validateBookingTime: (date: string, time: string) => {
    const bookingDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    const minBookingTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
    
    return bookingDateTime >= minBookingTime;
  },

  isValidPhoneNumber: (phone: string) => {
    // Simple Indian phone number validation
    const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  },

  formatPhoneNumber: (phone: string) => {
    // Format phone number to +91 XXXXX XXXXX
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    if (cleaned.length === 12 && cleaned.startsWith('91')) {
      return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
    }
    return phone;
  }
};

export type { 
  FortTransportRoute, 
  EnrichedVehicle, 
  RideBooking, 
  EnrichedRideBooking, 
  CreateRideBookingRequest,
  VehiclesQueryParams,
  BookingsQueryParams
};
