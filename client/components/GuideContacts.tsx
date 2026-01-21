import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Phone,
  Mail,
  Star,
  MapPin,
  Users,
  Calendar,
  Clock,
  MessageCircle,
  Globe,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface GuideContact {
  id: string;
  guideName: string;
  phone: string;
  email?: string;
  experience: string;
  specialization: string;
  languages: string;
  rate: string;
  availability: string;
  description: string;
  submittedAt: string;
}

interface GuideContactsProps {
  fortName?: string;
  limit?: number;
}

export default function GuideContacts({ fortName, limit }: GuideContactsProps) {
  const [guides, setGuides] = useState<GuideContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGuides();
  }, [fortName]);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/content/approved-guides");
      const data = await response.json();

      if (data.success) {
        let guidesData = data.data || [];

        // Filter by fort specialization if fortName is provided
        if (fortName) {
          guidesData = guidesData.filter(
            (guide: GuideContact) =>
              guide.specialization
                .toLowerCase()
                .includes(fortName.toLowerCase()) ||
              guide.description.toLowerCase().includes(fortName.toLowerCase()),
          );
        }

        // Apply limit if specified
        if (limit) {
          guidesData = guidesData.slice(0, limit);
        }

        setGuides(guidesData);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error("Error fetching guides:", err);
      setError("Failed to load guide contacts");
    } finally {
      setLoading(false);
    }
  };

  const handleContactGuide = (guide: GuideContact) => {
    if (guide.phone) {
      window.open(`tel:${guide.phone}`, "_self");
    } else {
      toast({
        title: "Contact Info",
        description: `Please contact ${guide.guideName} through the details provided.`,
      });
    }
  };

  const handleEmailGuide = (guide: GuideContact) => {
    if (guide.email) {
      window.open(
        `mailto:${guide.email}?subject=Trek Booking Enquiry&body=Hi ${guide.guideName}, I'm interested in booking a trek...`,
        "_self",
      );
    } else {
      toast({
        title: "Email Not Available",
        description: "Please contact the guide via phone.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading guide contacts...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <Users className="h-8 w-8 mx-auto mb-2" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (guides.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Local Guide Contacts
          </CardTitle>
          <CardDescription>
            Connect with experienced local guides for your trek
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <Users className="h-8 w-8 mx-auto mb-2" />
            <p>No guide contacts available yet.</p>
            <p className="text-sm mt-2">
              <a href="/contribute" className="text-primary hover:underline">
                Submit guide contacts to help fellow trekkers
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Local Guide Contacts
          <Badge variant="secondary">{guides.length} available</Badge>
        </CardTitle>
        <CardDescription>
          Verified local guides and trek organizers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {guides.map((guide) => (
            <Card key={guide.id} className="border-l-4 border-l-primary/30">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Guide Info */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {guide.guideName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-lg">
                          {guide.guideName}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {guide.experience} experience
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            Verified Guide
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span>
                          <strong>Specialization:</strong>{" "}
                          {guide.specialization}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-3 w-3 text-muted-foreground" />
                        <span>
                          <strong>Languages:</strong> {guide.languages}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>
                          <strong>Availability:</strong> {guide.availability}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span>
                          <strong>Rate:</strong> {guide.rate}
                        </span>
                      </div>
                    </div>

                    {guide.description && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm text-muted-foreground">
                          {guide.description}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Contact Actions */}
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => handleContactGuide(guide)}
                      className="w-full"
                      size="sm"
                    >
                      <Phone className="h-3 w-3 mr-2" />
                      Call Now
                    </Button>

                    {guide.email && (
                      <Button
                        variant="outline"
                        onClick={() => handleEmailGuide(guide)}
                        className="w-full"
                        size="sm"
                      >
                        <Mail className="h-3 w-3 mr-2" />
                        Send Email
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      onClick={() =>
                        window.open(
                          `https://wa.me/${guide.phone.replace(/[^0-9]/g, "")}?text=Hi ${guide.guideName}, I'm interested in booking a trek...`,
                          "_blank",
                        )
                      }
                      className="w-full"
                      size="sm"
                    >
                      <MessageCircle className="h-3 w-3 mr-2" />
                      WhatsApp
                    </Button>

                    <div className="text-xs text-center text-muted-foreground mt-2">
                      Contact directly for bookings
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!limit && (
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Don't see your preferred guide?
            </p>
            <Button variant="outline" asChild>
              <a href="/contribute">
                <Users className="h-4 w-4 mr-2" />
                Submit Guide Contact
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
