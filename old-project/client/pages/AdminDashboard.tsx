import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  rideBookingAPI, 
  rideBookingHelpers,
  EnrichedRideBooking
} from "@/lib/ride-booking-api";
import { AdminStats } from "@shared/ride-booking-api";
import { 
  DollarSign,
  Users,
  Car,
  Route,
  Calendar,
  Phone,
  Mail,
  Loader2,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  IndianRupee,
  MapPin,
  Star,
  AlertTriangle
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [bookings, setBookings] = useState<EnrichedRideBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    date: '',
    search: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsResponse, bookingsResponse] = await Promise.all([
        fetch('/api/ride-bookings/admin/stats'),
        fetch('/api/ride-bookings?limit=50')
      ]);

      const [statsData, bookingsData] = await Promise.all([
        statsResponse.json(),
        bookingsResponse.json()
      ]);

      if (statsData.success) {
        setStats(statsData.data);
      }

      if (bookingsData.success) {
        setBookings(bookingsData.data);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await fetchData();
      toast({
        title: "Success",
        description: "Dashboard data refreshed successfully."
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to refresh data.",
        variant: "destructive"
      });
    } finally {
      setRefreshing(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filters.status !== 'all' && booking.bookingStatus !== filters.status) {
      return false;
    }
    
    if (filters.date && booking.bookingDate !== filters.date) {
      return false;
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        booking.customerInfo.name.toLowerCase().includes(searchTerm) ||
        booking.customerInfo.phone.includes(searchTerm) ||
        booking.route?.fortName.toLowerCase().includes(searchTerm) ||
        booking.vehicle?.name.toLowerCase().includes(searchTerm)
      );
    }
    
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-16 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-16 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchData} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-4">
                  Admin Dashboard
                </h1>
                <p className="text-lg text-muted-foreground">
                  Manage ride bookings, drivers, and vehicles
                </p>
              </div>
              <Button 
                onClick={refreshData} 
                disabled={refreshing}
                variant="outline"
              >
                {refreshing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Refresh
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Statistics Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                      <p className="text-2xl font-bold">{rideBookingHelpers.formatPrice(stats.totalRevenue)}</p>
                    </div>
                    <IndianRupee className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                      <p className="text-2xl font-bold">{stats.totalBookings}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Drivers</p>
                      <p className="text-2xl font-bold">{stats.activeDrivers}</p>
                    </div>
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Vehicles</p>
                      <p className="text-2xl font-bold">{stats.activeVehicles}</p>
                    </div>
                    <Car className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <Tabs defaultValue="bookings" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="bookings">Ride Bookings</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="bookings" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Ride Bookings</CardTitle>
                      <CardDescription>
                        Manage and monitor all ride bookings
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">
                      {filteredBookings.length} of {bookings.length} bookings
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Filters */}
                  <div className="flex gap-4 mb-6">
                    <div className="flex-1">
                      <Input
                        placeholder="Search by name, phone, fort, or vehicle..."
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                      />
                    </div>
                    <Select 
                      value={filters.status} 
                      onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="date"
                      value={filters.date}
                      onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
                      className="w-40"
                    />
                  </div>

                  {/* Bookings List */}
                  <div className="space-y-4">
                    {filteredBookings.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Calendar className="h-8 w-8 mx-auto mb-2" />
                        <p>No bookings found matching your filters</p>
                      </div>
                    ) : (
                      filteredBookings.map(booking => (
                        <Card key={booking.id} className="border-l-4 border-l-primary/20">
                          <CardContent className="p-4">
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                              {/* Customer Info */}
                              <div>
                                <h4 className="font-semibold text-sm mb-1">Customer</h4>
                                <div className="space-y-1">
                                  <div className="flex items-center text-sm">
                                    <Users className="h-3 w-3 mr-1" />
                                    {booking.customerInfo.name}
                                  </div>
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <Phone className="h-3 w-3 mr-1" />
                                    {booking.customerInfo.phone}
                                  </div>
                                  {booking.customerInfo.email && (
                                    <div className="flex items-center text-sm text-muted-foreground">
                                      <Mail className="h-3 w-3 mr-1" />
                                      {booking.customerInfo.email}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Trip Details */}
                              <div>
                                <h4 className="font-semibold text-sm mb-1">Trip Details</h4>
                                <div className="space-y-1">
                                  <div className="flex items-center text-sm">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {booking.route?.fortName}
                                  </div>
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {rideBookingHelpers.formatDateTime(booking.bookingDate, booking.pickupTime)}
                                  </div>
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <Users className="h-3 w-3 mr-1" />
                                    {booking.numberOfPeople} people
                                  </div>
                                </div>
                              </div>

                              {/* Vehicle & Driver */}
                              <div>
                                <h4 className="font-semibold text-sm mb-1">Vehicle & Driver</h4>
                                <div className="space-y-1">
                                  <div className="flex items-center text-sm">
                                    <Car className="h-3 w-3 mr-1" />
                                    {booking.vehicle?.name}
                                  </div>
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <Users className="h-3 w-3 mr-1" />
                                    {booking.driver?.name}
                                  </div>
                                  {booking.driver?.rating && (
                                    <div className="flex items-center text-sm text-muted-foreground">
                                      <Star className="h-3 w-3 mr-1" />
                                      {booking.driver.rating}/5
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Status & Price */}
                              <div>
                                <h4 className="font-semibold text-sm mb-1">Status & Payment</h4>
                                <div className="space-y-2">
                                  <div className="flex flex-col gap-1">
                                    <Badge className={rideBookingHelpers.getBookingStatusColor(booking.bookingStatus)}>
                                      {booking.bookingStatus}
                                    </Badge>
                                    <Badge className={rideBookingHelpers.getPaymentStatusColor(booking.paymentStatus)}>
                                      {booking.paymentStatus}
                                    </Badge>
                                  </div>
                                  <div className="text-lg font-bold">
                                    {rideBookingHelpers.formatPrice(booking.totalPrice)}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Special Requests */}
                            {booking.specialRequests && (
                              <div className="mt-3 pt-3 border-t">
                                <h5 className="font-medium text-sm mb-1">Special Requests</h5>
                                <p className="text-sm text-muted-foreground">{booking.specialRequests}</p>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="mt-3 pt-3 border-t flex gap-2">
                              <Button size="sm" variant="outline">
                                View Details
                              </Button>
                              {booking.bookingStatus === 'pending' && (
                                <>
                                  <Button size="sm" variant="outline" className="text-green-600">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Confirm
                                  </Button>
                                  <Button size="sm" variant="outline" className="text-red-600">
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Reject
                                  </Button>
                                </>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              {stats && (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Booking Status Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {Object.entries(stats.bookingsByStatus).map(([status, count]) => (
                            <div key={status} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge className={rideBookingHelpers.getBookingStatusColor(status)}>
                                  {status}
                                </Badge>
                              </div>
                              <span className="font-medium">{count}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Vehicle Type Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {Object.entries(stats.vehicleTypeDistribution).map(([type, count]) => (
                            <div key={type} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span>{rideBookingHelpers.getVehicleTypeIcon(type)}</span>
                                <span className="capitalize">{type}</span>
                              </div>
                              <span className="font-medium">{count}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Pending Bookings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-yellow-600">
                          {stats.pendingBookings}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Require immediate attention
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Confirmed Bookings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-green-600">
                          {stats.confirmedBookings}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Ready for travel
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Completed Bookings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-blue-600">
                          {stats.completedBookings}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Successfully finished
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dashboard Settings</CardTitle>
                  <CardDescription>
                    Configure dashboard preferences and system settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center py-8 text-muted-foreground">
                      <Car className="h-8 w-8 mx-auto mb-2" />
                      <p>Settings panel coming soon...</p>
                      <p className="text-sm">Contact system administrator for configuration changes.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
