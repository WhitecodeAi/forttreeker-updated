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
  vehicles: string[]; // Vehicle IDs
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
  distance: number; // in km
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
  userId?: string; // For future user authentication
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
  bookingDate: string; // ISO date string
  pickupTime: string; // HH:MM format
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

export interface RideNotification {
  id: string;
  driverId: string;
  bookingId: string;
  type: 'new_booking' | 'booking_cancelled' | 'payment_received';
  message: string;
  isRead: boolean;
  createdAt: Date;
}

// Sample data for demonstration
export const driversData: Driver[] = [
  {
    id: "driver-1",
    name: "Ravi Patil",
    phone: "+91 9876543210",
    email: "ravi.patil@email.com",
    rating: 4.8,
    totalTrips: 245,
    vehicles: ["vehicle-1", "vehicle-2"],
    licenseNumber: "MH12AB1234",
    experienceYears: 8,
    languages: ["Marathi", "Hindi", "English"],
    isActive: true,
    isVerified: true,
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2024-01-20")
  },
  {
    id: "driver-2", 
    name: "Suresh Kumar",
    phone: "+91 9765432109",
    email: "suresh.kumar@email.com",
    rating: 4.6,
    totalTrips: 189,
    vehicles: ["vehicle-3"],
    licenseNumber: "MH14CD5678",
    experienceYears: 12,
    languages: ["Marathi", "Hindi"],
    isActive: true,
    isVerified: true,
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    createdAt: new Date("2022-08-10"),
    updatedAt: new Date("2024-01-18")
  },
  {
    id: "driver-3",
    name: "Amit Shinde",
    phone: "+91 9654321098",
    rating: 4.9,
    totalTrips: 312,
    vehicles: ["vehicle-4", "vehicle-5"],
    licenseNumber: "MH20EF9012",
    experienceYears: 15,
    languages: ["Marathi", "Hindi", "English"],
    isActive: true,
    isVerified: true,
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    createdAt: new Date("2021-03-25"),
    updatedAt: new Date("2024-01-22")
  }
];

export const vehiclesData: Vehicle[] = [
  {
    id: "vehicle-1",
    type: "jeep",
    name: "Mahindra Thar",
    capacity: 6,
    pricePerKm: 25,
    basePrice: 500,
    features: ["4WD", "AC", "Music System", "First Aid Kit"],
    imageUrl: "https://images.unsplash.com/photo-1544829099-b9a0c5303bff?w=400&h=300&fit=crop",
    isActive: true,
    driverId: "driver-1"
  },
  {
    id: "vehicle-2",
    type: "suv",
    name: "Toyota Innova",
    capacity: 7,
    pricePerKm: 30,
    basePrice: 700,
    features: ["AC", "Comfortable Seating", "Music System", "Water Bottles"],
    imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop",
    isActive: true,
    driverId: "driver-1"
  },
  {
    id: "vehicle-3",
    type: "taxi",
    name: "Maruti Ertiga",
    capacity: 6,
    pricePerKm: 20,
    basePrice: 400,
    features: ["AC", "Music System", "Phone Charger"],
    imageUrl: "https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?w=400&h=300&fit=crop",
    isActive: true,
    driverId: "driver-2"
  },
  {
    id: "vehicle-4",
    type: "jeep",
    name: "Force Gurkha",
    capacity: 8,
    pricePerKm: 28,
    basePrice: 600,
    features: ["4WD", "Off-road Capable", "AC", "Safety Equipment"],
    imageUrl: "https://images.unsplash.com/photo-1544829099-b9a0c5303bff?w=400&h=300&fit=crop",
    isActive: true,
    driverId: "driver-3"
  },
  {
    id: "vehicle-5",
    type: "bus",
    name: "Tempo Traveller",
    capacity: 12,
    pricePerKm: 35,
    basePrice: 1000,
    features: ["AC", "Reclining Seats", "Music System", "First Aid", "Large Luggage Space"],
    imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=300&fit=crop",
    isActive: true,
    driverId: "driver-3"
  }
];

export const fortTransportRoutesData: FortTransportRoute[] = [
  {
    id: "route-1",
    fortId: 2, // Sinhagad Fort
    fortName: "Sinhagad Fort",
    pickupPoints: [
      {
        id: "pickup-1",
        name: "Pune Railway Station",
        address: "Station Road, Pune",
        landmark: "Near Platform 1",
        coordinates: { latitude: 18.5284, longitude: 73.8748 },
        isPopular: true
      },
      {
        id: "pickup-2", 
        name: "Shivajinagar",
        address: "Shivajinagar Bus Stand, Pune",
        landmark: "Near FC Road",
        coordinates: { latitude: 18.5308, longitude: 73.8465 },
        isPopular: true
      },
      {
        id: "pickup-3",
        name: "Kothrud",
        address: "Kothrud Bus Stand",
        landmark: "Near University",
        coordinates: { latitude: 18.5018, longitude: 73.8225 },
        isPopular: false
      },
      {
        id: "pickup-4",
        name: "Sinhagad Road",
        address: "Sinhagad Road, Near Bharti Vidyapeeth",
        coordinates: { latitude: 18.4688, longitude: 73.8157 },
        isPopular: true
      }
    ],
    dropoffPoint: {
      name: "Sinhagad Fort Base",
      description: "Main parking area at the base of Sinhagad Fort",
      coordinates: { latitude: 18.3664, longitude: 73.7562 }
    },
    distance: 35,
    estimatedTravelTime: "1 hour 15 minutes",
    isActive: true
  },
  {
    id: "route-2",
    fortId: 1, // Rajgad Fort
    fortName: "Rajgad Fort", 
    pickupPoints: [
      {
        id: "pickup-5",
        name: "Pune Railway Station",
        address: "Station Road, Pune",
        coordinates: { latitude: 18.5284, longitude: 73.8748 },
        isPopular: true
      },
      {
        id: "pickup-6",
        name: "Katraj",
        address: "Katraj Chowk, Pune",
        coordinates: { latitude: 18.4484, longitude: 73.8610 },
        isPopular: true
      }
    ],
    dropoffPoint: {
      name: "Gunjavane Village",
      description: "Trek starting point for Rajgad Fort",
      coordinates: { latitude: 18.2462, longitude: 73.6778 }
    },
    distance: 60,
    estimatedTravelTime: "2 hours",
    isActive: true
  },
  {
    id: "route-3",
    fortId: 3, // Raigad Fort
    fortName: "Raigad Fort",
    pickupPoints: [
      {
        id: "pickup-7",
        name: "Pune Railway Station", 
        address: "Station Road, Pune",
        coordinates: { latitude: 18.5284, longitude: 73.8748 },
        isPopular: true
      },
      {
        id: "pickup-8",
        name: "Mumbai CST",
        address: "Chhatrapati Shivaji Terminus, Mumbai",
        coordinates: { latitude: 18.9398, longitude: 72.8345 },
        isPopular: true
      }
    ],
    dropoffPoint: {
      name: "Raigad Ropeway Base",
      description: "Ropeway station for Raigad Fort",
      coordinates: { latitude: 18.2356, longitude: 73.4402 }
    },
    distance: 120,
    estimatedTravelTime: "3 hours",
    isActive: true
  }
];

// In-memory storage for ride bookings
export const rideBookingsStorage: RideBooking[] = [
  {
    id: "booking-1",
    customerInfo: {
      name: "Priya Sharma",
      phone: "+91 9123456789",
      email: "priya.sharma@email.com"
    },
    fortId: 2,
    routeId: "route-1",
    vehicleId: "vehicle-1", 
    driverId: "driver-1",
    pickupPointId: "pickup-1",
    bookingDate: "2024-02-15",
    pickupTime: "07:00",
    numberOfPeople: 4,
    totalPrice: 1375, // Base price + distance charges
    paymentStatus: "paid",
    bookingStatus: "confirmed",
    specialRequests: "Please call 10 minutes before pickup",
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-11"),
    confirmedAt: new Date("2024-02-11")
  },
  {
    id: "booking-2",
    customerInfo: {
      name: "Rohit Desai",
      phone: "+91 9234567890"
    },
    fortId: 1,
    routeId: "route-2", 
    vehicleId: "vehicle-4",
    driverId: "driver-3",
    pickupPointId: "pickup-5",
    bookingDate: "2024-02-20",
    pickupTime: "06:30",
    numberOfPeople: 6,
    totalPrice: 2280,
    paymentStatus: "pending",
    bookingStatus: "pending",
    createdAt: new Date("2024-02-12"),
    updatedAt: new Date("2024-02-12")
  }
];

export const rideNotificationsStorage: RideNotification[] = [
  {
    id: "notif-1",
    driverId: "driver-3",
    bookingId: "booking-2",
    type: "new_booking",
    message: "New ride booking for Rajgad Fort on Feb 20, 2024",
    isRead: false,
    createdAt: new Date("2024-02-12")
  }
];

// Utility functions
export const rideBookingUtils = {
  generateBookingId: (): string => {
    return `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  generateNotificationId: (): string => {
    return `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  calculateTotalPrice: (vehicleId: string, distance: number, numberOfPeople: number): number => {
    const vehicle = vehiclesData.find(v => v.id === vehicleId);
    if (!vehicle) return 0;

    const distanceCharge = distance * vehicle.pricePerKm;
    const totalPrice = vehicle.basePrice + distanceCharge;
    
    // Group discount for larger vehicles
    if (numberOfPeople >= 6 && vehicle.capacity >= 6) {
      return Math.round(totalPrice * 0.9); // 10% discount
    }
    
    return totalPrice;
  },

  getAvailableVehicles: (fortId: number, numberOfPeople: number): Vehicle[] => {
    const route = fortTransportRoutesData.find(r => r.fortId === fortId);
    if (!route) return [];

    return vehiclesData.filter(vehicle => 
      vehicle.isActive && 
      vehicle.capacity >= numberOfPeople &&
      driversData.find(d => d.id === vehicle.driverId)?.isActive
    );
  },

  getDriverByVehicle: (vehicleId: string): Driver | undefined => {
    const vehicle = vehiclesData.find(v => v.id === vehicleId);
    if (!vehicle) return undefined;
    return driversData.find(d => d.id === vehicle.driverId);
  },

  createNotification: (driverId: string, bookingId: string, type: RideNotification['type'], message: string): RideNotification => {
    return {
      id: rideBookingUtils.generateNotificationId(),
      driverId,
      bookingId,
      type,
      message,
      isRead: false,
      createdAt: new Date()
    };
  },

  validateBookingTime: (bookingDate: string, pickupTime: string): boolean => {
    const booking = new Date(`${bookingDate}T${pickupTime}`);
    const now = new Date();
    const minBookingTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
    
    return booking >= minBookingTime;
  }
};
