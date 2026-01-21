import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Bell,
  Car,
  Users,
  Calendar,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Star,
  Route
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function SimpleDriverDashboard() {
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Default driver info
  const driver = {
    id: "driver-1",
    name: "Ravi Patil",
    phone: "+91 9876543210",
    rating: 4.8,
    totalTrips: 245,
    experienceYears: 8,
    languages: ["Marathi", "Hindi", "English"],
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  };

  useEffect(() => {
    fetchDriverData();
  }, []);

  const fetchDriverData = async () => {
    try {
      // Fetch driver bookings
      const response = await fetch('/api/ride-bookings/driver/driver-1');
      const bookingsData = await response.json();
      
      // Fetch driver notifications  
      const notifResponse = await fetch('/api/ride-bookings/driver/driver-1/notifications');
      const notifData = await notifResponse.json();
      
      if (bookingsData.success) {
        setBookings(bookingsData.data || []);
      }
      
      if (notifData.success) {
        setNotifications(notifData.data || []);
      }
    } catch (error) {
      console.error('Error fetching driver data:', error);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await fetchDriverData();
      toast({
        title: "Success",
        description: "Data refreshed successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh data.",
        variant: "destructive"
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleBookingAction = async (bookingId: string, action: 'confirmed' | 'rejected') => {
    try {
      const response = await fetch(`/api/ride-bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: action,
          driverId: 'driver-1'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: `Booking ${action} successfully`
        });
        fetchDriverData(); // Refresh data
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      toast({
        title: "Error",
        description: "Failed to update booking",
        variant: "destructive"
      });
    }
  };

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const pendingBookings = bookings.filter(b => b.bookingStatus === 'pending');
  const confirmedBookings = bookings.filter(b => b.bookingStatus === 'confirmed');
  const totalEarnings = bookings
    .filter(b => b.bookingStatus === 'completed' && b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-16">
        {/* Header */}
        <div className="bg-muted/50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={driver.profileImage} alt={driver.name} />
                  <AvatarFallback>
                    {driver.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    Welcome, {driver.name}
                  </h1>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center text-muted-foreground">
                      <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                      <span>{driver.rating}/5 Rating</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Route className="h-4 w-4 mr-1" />
                      <span>{driver.totalTrips} Trips</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {unreadNotifications.length > 0 && (
                  <Badge variant="destructive" className="animate-pulse">
                    {unreadNotifications.length} New
                  </Badge>
                )}
                <Button 
                  onClick={refreshData} 
                  disabled={refreshing}
                  variant="outline"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending Requests</p>
                    <p className="text-2xl font-bold text-yellow-600">{pendingBookings.length}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Confirmed Trips</p>
                    <p className="text-2xl font-bold text-green-600">{confirmedBookings.length}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                    <p className="text-2xl font-bold">₹{totalEarnings}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Notifications</p>
                    <p className="text-2xl font-bold text-blue-600">{unreadNotifications.length}</p>
                  </div>
                  <Bell className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bookings Section */}
          <Card>
            <CardHeader>
              <CardTitle>My Ride Bookings</CardTitle>
              <CardDescription>
                Manage your upcoming and past ride bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Car className="h-8 w-8 mx-auto mb-2" />
                  <p>No bookings found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map(booking => (
                    <Card key={booking.id} className="border-l-4 border-l-primary/20">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                          {/* Trip Info */}
                          <div>
                            <h4 className="font-semibold text-lg mb-2">{booking.route?.fortName || 'Fort Trip'}</h4>
                            <div className="space-y-1">
                              <div className="flex items-center text-sm">
                                <Calendar className="h-3 w-3 mr-1" />
                                {booking.bookingDate} at {booking.pickupTime}
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Users className="h-3 w-3 mr-1" />
                                {booking.numberOfPeople} people
                              </div>
                            </div>
                          </div>

                          {/* Customer Info */}
                          <div>
                            <h4 className="font-semibold text-sm mb-2">Customer Details</h4>
                            <div className="space-y-1">
                              <div className="text-sm">{booking.customerInfo?.name}</div>
                              <div className="text-sm text-muted-foreground">{booking.customerInfo?.phone}</div>
                            </div>
                          </div>

                          {/* Status & Actions */}
                          <div>
                            <div className="flex flex-col gap-2 mb-3">
                              <Badge variant={booking.bookingStatus === 'pending' ? 'default' : 'secondary'}>
                                {booking.bookingStatus}
                              </Badge>
                              <div className="text-lg font-bold">₹{booking.totalPrice}</div>
                            </div>
                            
                            {booking.bookingStatus === 'pending' && (
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  onClick={() => handleBookingAction(booking.id, 'confirmed')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Accept
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleBookingAction(booking.id, 'rejected')}
                                >
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            )}
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
  );
}
