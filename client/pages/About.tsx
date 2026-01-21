import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Mountain, 
  Target, 
  Users, 
  Shield, 
  Heart,
  Award,
  MapPin,
  Calendar,
  Camera,
  Compass,
  Mail,
  Phone,
  Globe
} from "lucide-react";

export default function About() {
  const features = [
    {
      icon: <Mountain className="h-8 w-8 text-blue-600" />,
      title: "Comprehensive Fort Database",
      description: "Detailed information about 150+ historic forts across Maharashtra with accurate trek routes and difficulty levels."
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: "Safety First Approach",
      description: "Safety guidelines, weather updates, and emergency contact information to ensure secure trekking experiences."
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "Community Driven",
      description: "Built by trekkers, for trekkers. Share experiences, reviews, and connect with fellow adventure enthusiasts."
    },
    {
      icon: <Compass className="h-8 w-8 text-orange-600" />,
      title: "Interactive Planning Tools",
      description: "Advanced trek planning features with gear checklists, weather forecasts, and personalized recommendations."
    }
  ];

  const team = [
    {
      name: "Rajesh Patil",
      role: "Founder & Lead Trekker",
      experience: "15+ years",
      speciality: "Historic Forts",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Priya Sharma",
      role: "Safety & Training Expert",
      experience: "10+ years",
      speciality: "Trek Safety",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Vikram Singh",
      role: "Technical Lead",
      experience: "8+ years",
      speciality: "Platform Development",
      image: "/api/placeholder/150/150"
    }
  ];

  const stats = [
    { label: "Forts Documented", value: "150+", icon: Mountain },
    { label: "Active Members", value: "25,000+", icon: Users },
    { label: "Successful Treks", value: "10,000+", icon: Award },
    { label: "Years of Experience", value: "15+", icon: Calendar }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-16">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-blue-950 dark:via-background dark:to-green-950" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Badge variant="secondary" className="mb-4">
                <Heart className="w-4 h-4 mr-2" />
                Our Story
              </Badge>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
                Connecting Trekkers with
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400">
                  Maharashtra's Heritage
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                FortTracker was born from a passion for exploring Maharashtra's magnificent forts and sharing that joy with fellow adventurers. 
                We believe every fort has a story to tell, and every trek is an opportunity to connect with history.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="outline" className="mb-4">
                  <Target className="w-4 h-4 mr-2" />
                  Our Mission
                </Badge>
                <h2 className="text-3xl font-bold text-foreground mb-6">
                  Preserving Heritage Through Adventure
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Our mission is to make Maharashtra's historic forts accessible to everyone while promoting responsible trekking practices. 
                  We aim to preserve these architectural marvels for future generations by educating trekkers about their historical significance 
                  and environmental importance.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <span className="text-muted-foreground">Promote sustainable and responsible trekking</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <span className="text-muted-foreground">Educate about historical and cultural significance</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <span className="text-muted-foreground">Build a community of responsible trekkers</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <span className="text-muted-foreground">Support local communities and guides</span>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="w-full h-96 bg-gradient-to-br from-blue-400 to-green-500 rounded-lg" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Why Choose FortTracker?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We've built comprehensive tools and resources to make your fort trekking experience safe, informative, and memorable.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="p-6">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-muted rounded-lg">
                        {feature.icon}
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Meet Our Team
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Passionate trekkers and heritage enthusiasts dedicated to bringing you the best fort exploration experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-green-500 rounded-full mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                    <p className="text-primary font-medium mb-2">{member.role}</p>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {member.experience}
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Award className="h-4 w-4" />
                        {member.speciality}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-20 bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Get In Touch
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Have questions, suggestions, or want to share your trekking experience? We'd love to hear from you!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center p-6">
                <CardContent>
                  <Mail className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Email Us</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    For general inquiries and support
                  </p>
                  <Button variant="outline" size="sm">
                    hello@forttracker.com
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardContent>
                  <Phone className="h-8 w-8 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Call Us</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Emergency support and guidance
                  </p>
                  <Button variant="outline" size="sm">
                    +91 98765 43210
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardContent>
                  <Globe className="h-8 w-8 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Follow Us</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Stay updated with latest adventures
                  </p>
                  <Button variant="outline" size="sm">
                    @forttracker
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Ready to Explore Maharashtra's Forts?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join our community of passionate trekkers and start your journey through history today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="group">
                Start Exploring
                <Mountain className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                Join Community
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
