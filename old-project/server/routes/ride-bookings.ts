import { RequestHandler } from "express";
import { 
  rideBookingsStorage, 
  rideNotificationsStorage,
  fortTransportRoutesData,
  vehiclesData,
  driversData,
  RideBooking,
  rideBookingUtils
} from "../data/ride-bookings";

// GET /api/ride-bookings/routes - Get available transport routes
export const getTransportRoutes: RequestHandler = (req, res) => {
  try {
    const { fortId } = req.query;

    let routes = [...fortTransportRoutesData];

    if (fortId && !isNaN(Number(fortId))) {
      routes = routes.filter(route => route.fortId === Number(fortId));
    }

    // Filter only active routes
    routes = routes.filter(route => route.isActive);

    res.json({
      success: true,
      data: routes
    });
  } catch (error) {
    console.error('Error in getTransportRoutes:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// GET /api/ride-bookings/vehicles - Get available vehicles for a route
export const getAvailableVehicles: RequestHandler = (req, res) => {
  try {
    const { fortId, numberOfPeople = '1', date, time } = req.query;

    if (!fortId || isNaN(Number(fortId))) {
      return res.status(400).json({
        success: false,
        message: 'Valid fortId is required'
      });
    }

    const people = parseInt(numberOfPeople as string);
    const availableVehicles = rideBookingUtils.getAvailableVehicles(Number(fortId), people);

    // Get route distance for price calculation
    const route = fortTransportRoutesData.find(r => r.fortId === Number(fortId));
    const distance = route?.distance || 0;

    // Enrich vehicles with driver info and calculated prices
    const enrichedVehicles = availableVehicles.map(vehicle => {
      const driver = rideBookingUtils.getDriverByVehicle(vehicle.id);
      const totalPrice = rideBookingUtils.calculateTotalPrice(vehicle.id, distance, people);

      return {
        ...vehicle,
        driver: driver ? {
          id: driver.id,
          name: driver.name,
          rating: driver.rating,
          totalTrips: driver.totalTrips,
          experienceYears: driver.experienceYears,
          languages: driver.languages,
          profileImage: driver.profileImage
        } : null,
        calculatedPrice: totalPrice,
        priceBreakdown: {
          basePrice: vehicle.basePrice,
          distanceCharge: distance * vehicle.pricePerKm,
          distance: distance,
          discount: people >= 6 && vehicle.capacity >= 6 ? 10 : 0
        }
      };
    });

    res.json({
      success: true,
      data: enrichedVehicles,
      route: route
    });
  } catch (error) {
    console.error('Error in getAvailableVehicles:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// POST /api/ride-bookings - Create new ride booking
export const createRideBooking: RequestHandler = (req, res) => {
  try {
    const {
      customerInfo,
      fortId,
      routeId,
      vehicleId,
      pickupPointId,
      bookingDate,
      pickupTime,
      numberOfPeople,
      specialRequests
    } = req.body;

    // Validation
    if (!customerInfo?.name || !customerInfo?.phone) {
      return res.status(400).json({
        success: false,
        message: 'Customer name and phone are required'
      });
    }

    if (!fortId || !routeId || !vehicleId || !pickupPointId || !bookingDate || !pickupTime || !numberOfPeople) {
      return res.status(400).json({
        success: false,
        message: 'All booking details are required'
      });
    }

    // Validate booking time (at least 2 hours in advance)
    if (!rideBookingUtils.validateBookingTime(bookingDate, pickupTime)) {
      return res.status(400).json({
        success: false,
        message: 'Booking must be made at least 2 hours in advance'
      });
    }

    // Verify route, vehicle, and pickup point exist
    const route = fortTransportRoutesData.find(r => r.id === routeId && r.fortId === fortId);
    if (!route) {
      return res.status(400).json({
        success: false,
        message: 'Invalid route or fort'
      });
    }

    const vehicle = vehiclesData.find(v => v.id === vehicleId && v.isActive);
    if (!vehicle) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle not available'
      });
    }

    const pickupPoint = route.pickupPoints.find(p => p.id === pickupPointId);
    if (!pickupPoint) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pickup point'
      });
    }

    const driver = rideBookingUtils.getDriverByVehicle(vehicleId);
    if (!driver || !driver.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Driver not available'
      });
    }

    // Check vehicle capacity
    if (numberOfPeople > vehicle.capacity) {
      return res.status(400).json({
        success: false,
        message: `Vehicle capacity exceeded. Maximum ${vehicle.capacity} people allowed.`
      });
    }

    // Calculate total price
    const totalPrice = rideBookingUtils.calculateTotalPrice(vehicleId, route.distance, numberOfPeople);

    // Create booking
    const newBooking: RideBooking = {
      id: rideBookingUtils.generateBookingId(),
      customerInfo: {
        name: customerInfo.name.trim(),
        phone: customerInfo.phone.trim(),
        email: customerInfo.email?.trim()
      },
      fortId,
      routeId,
      vehicleId,
      driverId: driver.id,
      pickupPointId,
      bookingDate,
      pickupTime,
      numberOfPeople,
      totalPrice,
      paymentStatus: 'pending',
      bookingStatus: 'pending',
      specialRequests: specialRequests?.trim(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    rideBookingsStorage.push(newBooking);

    // Create notification for driver
    const notification = rideBookingUtils.createNotification(
      driver.id,
      newBooking.id,
      'new_booking',
      `New ride booking for ${route.fortName} on ${bookingDate} at ${pickupTime}`
    );
    rideNotificationsStorage.push(notification);

    // Return booking with enriched data
    const enrichedBooking = {
      ...newBooking,
      route,
      vehicle,
      driver: {
        id: driver.id,
        name: driver.name,
        phone: driver.phone,
        rating: driver.rating
      },
      pickupPoint
    };

    res.status(201).json({
      success: true,
      data: enrichedBooking,
      message: 'Ride booking created successfully. Driver will be notified shortly.'
    });
  } catch (error) {
    console.error('Error in createRideBooking:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// GET /api/ride-bookings - Get user's ride bookings
export const getUserRideBookings: RequestHandler = (req, res) => {
  try {
    const { phone, limit, offset = '0' } = req.query;

    let bookings = [...rideBookingsStorage];

    // Filter by phone if provided
    if (phone && typeof phone === 'string') {
      bookings = bookings.filter(booking => 
        booking.customerInfo.phone === phone
      );
    }

    // Sort by creation date (newest first)
    bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Pagination
    const startIndex = parseInt(offset as string) || 0;
    const endIndex = limit ? startIndex + parseInt(limit as string) : bookings.length;
    const paginatedBookings = bookings.slice(startIndex, endIndex);

    // Enrich bookings with additional data
    const enrichedBookings = paginatedBookings.map(booking => {
      const route = fortTransportRoutesData.find(r => r.id === booking.routeId);
      const vehicle = vehiclesData.find(v => v.id === booking.vehicleId);
      const driver = driversData.find(d => d.id === booking.driverId);
      const pickupPoint = route?.pickupPoints.find(p => p.id === booking.pickupPointId);

      return {
        ...booking,
        route: route ? { id: route.id, fortName: route.fortName, distance: route.distance } : null,
        vehicle: vehicle ? { id: vehicle.id, name: vehicle.name, type: vehicle.type } : null,
        driver: driver ? { id: driver.id, name: driver.name, phone: driver.phone, rating: driver.rating } : null,
        pickupPoint: pickupPoint ? { id: pickupPoint.id, name: pickupPoint.name, address: pickupPoint.address } : null
      };
    });

    res.json({
      success: true,
      data: enrichedBookings,
      total: bookings.length,
      page: Math.floor(startIndex / (limit ? parseInt(limit as string) : bookings.length)) + 1,
      totalPages: limit ? Math.ceil(bookings.length / parseInt(limit as string)) : 1
    });
  } catch (error) {
    console.error('Error in getUserRideBookings:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// GET /api/ride-bookings/:id - Get single ride booking
export const getRideBookingById: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;

    const booking = rideBookingsStorage.find(b => b.id === id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Ride booking not found'
      });
    }

    // Enrich with additional data
    const route = fortTransportRoutesData.find(r => r.id === booking.routeId);
    const vehicle = vehiclesData.find(v => v.id === booking.vehicleId);
    const driver = driversData.find(d => d.id === booking.driverId);
    const pickupPoint = route?.pickupPoints.find(p => p.id === booking.pickupPointId);

    const enrichedBooking = {
      ...booking,
      route,
      vehicle,
      driver: driver ? {
        id: driver.id,
        name: driver.name,
        phone: driver.phone,
        rating: driver.rating,
        experienceYears: driver.experienceYears,
        languages: driver.languages,
        profileImage: driver.profileImage
      } : null,
      pickupPoint
    };

    res.json({
      success: true,
      data: enrichedBooking
    });
  } catch (error) {
    console.error('Error in getRideBookingById:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// PATCH /api/ride-bookings/:id/status - Update booking status (for drivers)
export const updateBookingStatus: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const { status, driverId } = req.body;

    if (!['confirmed', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "confirmed" or "rejected"'
      });
    }

    const bookingIndex = rideBookingsStorage.findIndex(b => b.id === id);
    if (bookingIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Ride booking not found'
      });
    }

    const booking = rideBookingsStorage[bookingIndex];

    // Verify driver authorization
    if (booking.driverId !== driverId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this booking'
      });
    }

    // Update booking status
    rideBookingsStorage[bookingIndex] = {
      ...booking,
      bookingStatus: status as 'confirmed' | 'rejected',
      updatedAt: new Date(),
      ...(status === 'confirmed' && { confirmedAt: new Date() })
    };

    const updatedBooking = rideBookingsStorage[bookingIndex];

    res.json({
      success: true,
      data: updatedBooking,
      message: `Booking ${status} successfully`
    });
  } catch (error) {
    console.error('Error in updateBookingStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// GET /api/ride-bookings/driver/:driverId - Get driver's bookings
export const getDriverBookings: RequestHandler = (req, res) => {
  try {
    const { driverId } = req.params;
    const { status, date, limit, offset = '0' } = req.query;

    let bookings = rideBookingsStorage.filter(booking => booking.driverId === driverId);

    // Filter by status if provided
    if (status && typeof status === 'string') {
      bookings = bookings.filter(booking => booking.bookingStatus === status);
    }

    // Filter by date if provided
    if (date && typeof date === 'string') {
      bookings = bookings.filter(booking => booking.bookingDate === date);
    }

    // Sort by booking date and time
    bookings.sort((a, b) => {
      const dateA = new Date(`${a.bookingDate}T${a.pickupTime}`);
      const dateB = new Date(`${b.bookingDate}T${b.pickupTime}`);
      return dateA.getTime() - dateB.getTime();
    });

    // Pagination
    const startIndex = parseInt(offset as string) || 0;
    const endIndex = limit ? startIndex + parseInt(limit as string) : bookings.length;
    const paginatedBookings = bookings.slice(startIndex, endIndex);

    // Enrich with route and pickup point data
    const enrichedBookings = paginatedBookings.map(booking => {
      const route = fortTransportRoutesData.find(r => r.id === booking.routeId);
      const pickupPoint = route?.pickupPoints.find(p => p.id === booking.pickupPointId);

      return {
        ...booking,
        route: route ? { 
          id: route.id, 
          fortName: route.fortName, 
          distance: route.distance,
          estimatedTravelTime: route.estimatedTravelTime
        } : null,
        pickupPoint: pickupPoint ? {
          id: pickupPoint.id,
          name: pickupPoint.name,
          address: pickupPoint.address,
          landmark: pickupPoint.landmark
        } : null
      };
    });

    res.json({
      success: true,
      data: enrichedBookings,
      total: bookings.length
    });
  } catch (error) {
    console.error('Error in getDriverBookings:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// GET /api/ride-bookings/driver/:driverId/notifications - Get driver notifications
export const getDriverNotifications: RequestHandler = (req, res) => {
  try {
    const { driverId } = req.params;
    const { unreadOnly } = req.query;

    let notifications = rideNotificationsStorage.filter(notif => notif.driverId === driverId);

    if (unreadOnly === 'true') {
      notifications = notifications.filter(notif => !notif.isRead);
    }

    // Sort by creation date (newest first)
    notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({
      success: true,
      data: notifications,
      unreadCount: notifications.filter(n => !n.isRead).length
    });
  } catch (error) {
    console.error('Error in getDriverNotifications:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// PATCH /api/ride-bookings/notifications/:id/read - Mark notification as read
export const markNotificationRead: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;

    const notificationIndex = rideNotificationsStorage.findIndex(n => n.id === id);
    if (notificationIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    rideNotificationsStorage[notificationIndex].isRead = true;

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Error in markNotificationRead:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// POST /api/ride-bookings/driver/login - Driver login
export const driverLogin: RequestHandler = (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    const driver = driversData.find(d => d.phone === phone && d.isActive);
    if (!driver) {
      return res.status(401).json({
        success: false,
        message: 'Driver not found or inactive'
      });
    }

    // Return driver info (in real app, you'd return a JWT token)
    res.json({
      success: true,
      data: {
        id: driver.id,
        name: driver.name,
        phone: driver.phone,
        email: driver.email,
        rating: driver.rating,
        totalTrips: driver.totalTrips,
        experienceYears: driver.experienceYears,
        languages: driver.languages,
        profileImage: driver.profileImage
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Error in driverLogin:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// GET /api/ride-bookings/admin/stats - Get admin statistics
export const getAdminStats: RequestHandler = (req, res) => {
  try {
    const stats = {
      totalBookings: rideBookingsStorage.length,
      pendingBookings: rideBookingsStorage.filter(b => b.bookingStatus === 'pending').length,
      confirmedBookings: rideBookingsStorage.filter(b => b.bookingStatus === 'confirmed').length,
      completedBookings: rideBookingsStorage.filter(b => b.bookingStatus === 'completed').length,
      totalRevenue: rideBookingsStorage
        .filter(b => b.paymentStatus === 'paid')
        .reduce((sum, b) => sum + b.totalPrice, 0),
      activeDrivers: driversData.filter(d => d.isActive).length,
      activeVehicles: vehiclesData.filter(v => v.isActive).length,
      activeRoutes: fortTransportRoutesData.filter(r => r.isActive).length,
      bookingsByStatus: {
        pending: rideBookingsStorage.filter(b => b.bookingStatus === 'pending').length,
        confirmed: rideBookingsStorage.filter(b => b.bookingStatus === 'confirmed').length,
        rejected: rideBookingsStorage.filter(b => b.bookingStatus === 'rejected').length,
        completed: rideBookingsStorage.filter(b => b.bookingStatus === 'completed').length,
        cancelled: rideBookingsStorage.filter(b => b.bookingStatus === 'cancelled').length
      },
      vehicleTypeDistribution: vehiclesData.reduce((acc, vehicle) => {
        acc[vehicle.type] = (acc[vehicle.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error in getAdminStats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
