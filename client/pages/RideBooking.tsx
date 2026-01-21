import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  rideBookingAPI,
  rideBookingHelpers,
  FortTransportRoute,
  EnrichedVehicle,
  EnrichedRideBooking,
  CreateRideBookingRequest
} from "@/lib/ride-booking-api";
import { PICKUP_TIME_SLOTS } from "@shared/ride-booking-api";
import {
  Car,
  Users,
  MapPin,
  Clock,
  IndianRupee,
  Phone,
  Mail,
  User,
  Calendar,
  Loader2,
  CheckCircle,
  Star
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function RideBooking() {
  const [routes, setRoutes] = useState<FortTransportRoute[]>([]);
  const [vehicles, setVehicles] = useState<EnrichedVehicle[]>([]);
  const [userBookings, setUserBookings] = useState<EnrichedRideBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [vehicleLoading, setVehicleLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  
  const [selectedFort, setSelectedFort] = useState<number | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<FortTransportRoute | null>(null);
  
  const [bookingForm, setBookingForm] = useState({
    customerInfo: {
      name: '',
      phone: '',
      email: ''
    },
    selectedVehicle: '',
    pickupPoint: '',
    bookingDate: '',
    pickupTime: '',
    numberOfPeople: 1,
    specialRequests: ''
  });

  useEffect(() => {
    fetchRoutes();
    fetchUserBookings();
  }, []);

  useEffect(() => {
    if (selectedFort && bookingForm.numberOfPeople) {
      fetchVehicles();
    }
  }, [selectedFort, bookingForm.numberOfPeople]);

  const fetchRoutes = async () => {
    try {
      const response = await fetch('/api/ride-bookings/routes');
      const data = await response.json();

      if (data.success) {
        setRoutes(data.data);
      } else {
        throw new Error(data.message || 'Failed to load routes');
      }
    } catch (error) {
      console.error('Error fetching routes:', error);
      toast({
        title: "Error",
        description: "Failed to load transport routes: " + (error as Error).message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    if (!selectedFort) return;

    try {
      setVehicleLoading(true);
      const params = new URLSearchParams({
        fortId: selectedFort.toString(),
        numberOfPeople: bookingForm.numberOfPeople.toString()
      });

      const response = await fetch(`/api/ride-bookings/vehicles?${params}`);
      const data = await response.json();

      if (data.success) {
        setVehicles(data.data);
      } else {
        throw new Error(data.message || 'Failed to load vehicles');
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast({
        title: "Error",
        description: "Failed to load available vehicles",
        variant: "destructive"
      });
    } finally {
      setVehicleLoading(false);
    }
  };

  const fetchUserBookings = async () => {
    try {
      const response = await fetch('/api/ride-bookings?limit=10');
      const data = await response.json();

      if (data.success) {
        setUserBookings(data.data);
      }
    } catch (error) {
      console.error('Error fetching user bookings:', error);
    }
  };

  const handleFortSelection = (fortId: number) => {
    setSelectedFort(fortId);
    const route = routes.find(r => r.fortId === fortId);
    setSelectedRoute(route || null);
    setBookingForm(prev => ({ ...prev, selectedVehicle: '', pickupPoint: '' }));
  };

  const createBooking = async () => {
    try {
      if (!selectedRoute || !bookingForm.customerInfo.name || !bookingForm.customerInfo.phone || 
          !bookingForm.selectedVehicle || !bookingForm.pickupPoint || !bookingForm.bookingDate || 
          !bookingForm.pickupTime) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      setBookingLoading(true);
      
      const request: CreateRideBookingRequest = {
        customerInfo: bookingForm.customerInfo,
        fortId: selectedRoute.fortId,
        routeId: selectedRoute.id,
        vehicleId: bookingForm.selectedVehicle,
        pickupPointId: bookingForm.pickupPoint,
        bookingDate: bookingForm.bookingDate,
        pickupTime: bookingForm.pickupTime,
        numberOfPeople: bookingForm.numberOfPeople,
        specialRequests: bookingForm.specialRequests
      };

      const response = await fetch('/api/ride-bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to create booking');
      }
      
      toast({
        title: "Success",
        description: "Ride booking created successfully! Driver will be notified.",
        variant: "default"
      });

      // Reset form and refresh bookings
      setBookingForm({
        customerInfo: { name: '', phone: '', email: '' },
        selectedVehicle: '',
        pickupPoint: '',
        bookingDate: '',
        pickupTime: '',
        numberOfPeople: 1,
        specialRequests: ''
      });
      setSelectedFort(null);
      setSelectedRoute(null);
      fetchUserBookings();
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-16 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading ride booking...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-16">
        {/* Header */}
        <div className="bg-muted/50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Book Your Ride
            </h1>
            <p className="text-lg text-muted-foreground">
              Book transportation with local drivers to reach your favorite forts conveniently
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Select Fort */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Step 1: Select Destination Fort
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {routes.map(route => (
                      <Card 
                        key={route.id}
                        className={`cursor-pointer transition-colors ${
                          selectedFort === route.fortId ? 'ring-2 ring-primary' : 'hover:bg-muted/50'
                        }`}
                        onClick={() => handleFortSelection(route.fortId)}
                      >
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">{route.fortName}</h3>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {route.distance} km • {route.estimatedTravelTime}
                            </div>
                            <div className="flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              {route.pickupPoints.length} pickup points
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Step 2: Customer Details */}
              {selectedRoute && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Step 2: Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Full Name *</Label>
                        <Input
                          value={bookingForm.customerInfo.name}
                          onChange={(e) => setBookingForm(prev => ({
                            ...prev,
                            customerInfo: { ...prev.customerInfo, name: e.target.value }
                          }))}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <Label>Phone Number *</Label>
                        <Input
                          value={bookingForm.customerInfo.phone}
                          onChange={(e) => setBookingForm(prev => ({
                            ...prev,
                            customerInfo: { ...prev.customerInfo, phone: e.target.value }
                          }))}
                          placeholder="+91 9876543210"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Email (Optional)</Label>
                      <Input
                        type="email"
                        value={bookingForm.customerInfo.email}
                        onChange={(e) => setBookingForm(prev => ({
                          ...prev,
                          customerInfo: { ...prev.customerInfo, email: e.target.value }
                        }))}
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Booking Details */}
              {selectedRoute && bookingForm.customerInfo.name && bookingForm.customerInfo.phone && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Step 3: Booking Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Number of People</Label>
                        <Select
                          value={bookingForm.numberOfPeople.toString()}
                          onValueChange={(value) => setBookingForm(prev => ({
                            ...prev,
                            numberOfPeople: parseInt(value)
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} {num === 1 ? 'person' : 'people'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Booking Date</Label>
                        <Input
                          type="date"
                          value={bookingForm.bookingDate}
                          onChange={(e) => setBookingForm(prev => ({
                            ...prev,
                            bookingDate: e.target.value
                          }))}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <Label>Pickup Time</Label>
                        <Select
                          value={bookingForm.pickupTime}
                          onValueChange={(value) => setBookingForm(prev => ({
                            ...prev,
                            pickupTime: value
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            {PICKUP_TIME_SLOTS.map(slot => (
                              <SelectItem key={slot} value={slot}>
                                {slot}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Pickup Point</Label>
                      <Select
                        value={bookingForm.pickupPoint}
                        onValueChange={(value) => setBookingForm(prev => ({
                          ...prev,
                          pickupPoint: value
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select pickup point" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedRoute.pickupPoints.map(point => (
                            <SelectItem key={point.id} value={point.id}>
                              {point.name} - {point.address}
                              {point.isPopular && <Badge className="ml-2" variant="secondary">Popular</Badge>}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Special Requests (Optional)</Label>
                      <Textarea
                        value={bookingForm.specialRequests}
                        onChange={(e) => setBookingForm(prev => ({
                          ...prev,
                          specialRequests: e.target.value
                        }))}
                        placeholder="Any special requirements or requests..."
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 4: Vehicle Selection */}
              {selectedRoute && bookingForm.numberOfPeople && bookingForm.bookingDate && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Car className="h-5 w-5" />
                      Step 4: Choose Vehicle
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {vehicleLoading ? (
                      <div className="text-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                        <p className="text-muted-foreground">Loading available vehicles...</p>
                      </div>
                    ) : vehicles.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Car className="h-8 w-8 mx-auto mb-2" />
                        <p>No vehicles available for the selected criteria</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {vehicles.map(vehicle => (
                          <Card 
                            key={vehicle.id}
                            className={`cursor-pointer transition-colors ${
                              bookingForm.selectedVehicle === vehicle.id ? 'ring-2 ring-primary' : 'hover:bg-muted/50'
                            }`}
                            onClick={() => setBookingForm(prev => ({
                              ...prev,
                              selectedVehicle: vehicle.id
                            }))}
                          >
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold">{vehicle.name}</h3>
                                <Badge variant="outline" className="capitalize">
                                  {vehicle.type}
                                </Badge>
                              </div>
                              
                              <div className="space-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center justify-between">
                                  <span className="flex items-center">
                                    <Users className="h-3 w-3 mr-1" />
                                    Capacity: {vehicle.capacity} people
                                  </span>
                                  <span className="flex items-center">
                                    <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                                    {vehicle.driver?.rating}/5
                                  </span>
                                </div>
                                
                                <div className="text-xs">
                                  Driver: {vehicle.driver?.name} ({vehicle.driver?.experienceYears} years exp)
                                </div>
                                
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {vehicle.features.slice(0, 3).map(feature => (
                                    <Badge key={feature} variant="secondary" className="text-xs">
                                      {feature}
                                    </Badge>
                                  ))}
                                </div>
                                
                                <div className="border-t pt-2 mt-2">
                                  <div className="flex justify-between items-center font-semibold text-foreground">
                                    <span>Total Price:</span>
                                    <span className="text-lg">
                                      {rideBookingHelpers.formatPrice(vehicle.calculatedPrice)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Final Booking Button */}
              {bookingForm.selectedVehicle && (
                <Card>
                  <CardContent className="p-6">
                    <Button 
                      onClick={createBooking}
                      disabled={bookingLoading}
                      className="w-full"
                      size="lg"
                    >
                      {bookingLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating Booking...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Confirm Booking
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar - User Bookings */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Bookings</CardTitle>
                  <CardDescription>
                    Recent ride bookings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {userBookings.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      <Car className="h-6 w-6 mx-auto mb-2" />
                      <p className="text-sm">No bookings yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {userBookings.slice(0, 3).map(booking => (
                        <Card key={booking.id} className="border-l-4 border-l-primary/20">
                          <CardContent className="p-3">
                            <div className="text-sm">
                              <div className="font-medium">{booking.route?.fortName}</div>
                              <div className="text-muted-foreground">
                                {rideBookingHelpers.formatDateTime(booking.bookingDate, booking.pickupTime)}
                              </div>
                              <div className="flex justify-between items-center mt-2">
                                <Badge className={rideBookingHelpers.getBookingStatusColor(booking.bookingStatus)}>
                                  {booking.bookingStatus}
                                </Badge>
                                <span className="font-medium">
                                  {rideBookingHelpers.formatPrice(booking.totalPrice)}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
