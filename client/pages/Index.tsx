import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { apiService, fortHelpers, Fort } from "@/lib/api";
import { FortsStats } from "@shared/fort-api";
import {
  Mountain,
  MapPin,
  Clock,
  Star,
  Users,
  Camera,
  Compass,
  ArrowRight,
  TrendingUp,
  Shield,
  Calendar,
  Loader2,
} from "lucide-react";

export default function Index() {
  const [featuredForts, setFeaturedForts] = useState<Fort[]>([]);
  const [stats, setStats] = useState<FortsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredResponse, statsResponse] = await Promise.all([
          apiService.getFeaturedForts(),
          apiService.getFortsStats(),
        ]);

        setFeaturedForts(featuredResponse.data);
        setStats(statsResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const displayStats = stats
    ? [
        {
          label: "Forts Documented",
          value: `${stats.totalForts}+`,
          icon: Mountain,
        },
        {
          label: "Total Reviews",
          value: `${Math.floor(stats.totalReviews / 1000)}K+`,
          icon: Users,
        },
        {
          label: "Districts Covered",
          value: `${stats.totalDistricts}+`,
          icon: Compass,
        },
        {
          label: "Average Rating",
          value: stats.averageRating.toFixed(1),
          icon: Star,
        },
      ]
    : [
        { label: "Forts Documented", value: "150+", icon: Mountain },
        { label: "Active Trekkers", value: "25K+", icon: Users },
        { label: "Trek Routes", value: "300+", icon: Compass },
        { label: "Success Stories", value: "1000+", icon: Star },
      ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-blue-950 dark:via-background dark:to-green-950" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] dark:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)_50%,transparent_75%,transparent_100%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              🏔️ Discover Historic Forts
            </Badge>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6">
              Explore Maharashtra's
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400">
                Fortresses
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Embark on thrilling treks to Maharashtra's historic forts.
              Discover centuries-old architecture, breathtaking views, and rich
              Maratha heritage through carefully curated trekking experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/forts">
                <Button size="lg" className="group">
                  Start Exploring
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/trek-planner">
                <Button variant="outline" size="lg">
                  Plan Your Trek
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center text-muted-foreground">
              <p>{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {displayStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Forts */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <TrendingUp className="w-4 h-4 mr-2" />
              Most Popular
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Featured Fortress Treks
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start your adventure with these carefully selected fort treks,
              perfect for both beginners and experienced trekkers.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center text-muted-foreground">
              <p>{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredForts.map((fort) => (
                <Card
                  key={fort.id}
                  className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="relative h-48 bg-muted overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                    <div className="absolute top-4 right-4 z-20">
                      <Badge variant="secondary" className="bg-white/90">
                        <Star className="w-3 h-3 mr-1 text-yellow-500" />
                        {fortHelpers.formatRating(fort.rating)}
                      </Badge>
                    </div>
                    <div className="absolute top-4 left-4 z-20">
                      <Badge
                        className={fortHelpers.getDifficultyColor(
                          fort.difficulty,
                        )}
                      >
                        {fort.difficulty}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 z-20 text-white">
                      <h3 className="font-semibold text-lg mb-1">
                        {fort.name}
                      </h3>
                      <div className="flex items-center text-sm opacity-90">
                        <MapPin className="w-3 h-3 mr-1" />
                        {fort.location}
                      </div>
                    </div>
                    {/* Real image from API */}
                    <img
                      src={fort.images.main}
                      alt={fort.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        // Fallback to gradient if image fails to load
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    {/* Fallback gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-green-500 opacity-80 -z-10" />
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {fort.duration}
                      </div>
                      <div className="flex items-center">
                        <Mountain className="w-4 h-4 mr-1" />
                        {fortHelpers.formatElevation(fort.elevation)}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {fort.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      {fort.highlights.slice(0, 3).map((highlight, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full mr-2" />
                          {highlight}
                        </div>
                      ))}
                    </div>

                    <Link to={`/fort/${fort.id}`}>
                      <Button className="w-full group">
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Why Choose FortTracker?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your complete companion for exploring Maharashtra's historic
              fortresses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>Detailed Trek Routes</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Get comprehensive route information, difficulty levels, and
                  GPS coordinates for safe trekking.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                  <Camera className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Rich Historical Content</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Discover the fascinating stories, legends, and historical
                  significance of each fortress.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Trek Planning Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Plan your trek with weather updates, equipment lists, and
                  community recommendations.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of trekkers who have discovered Maharashtra's hidden
            gems through our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/forts">
              <Button size="lg" className="group">
                Explore All Forts
                <Mountain className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
