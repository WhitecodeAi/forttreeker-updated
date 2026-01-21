import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Upload,
  MapPin,
  Clock,
  Users,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ContentSubmission {
  id: string;
  type: "fort-info" | "guide-contact" | "additional-info";
  title: string;
  content: string;
  submittedBy: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
}

export default function ContributeContent() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("submit");
  const [submissions, setSubmissions] = useState<ContentSubmission[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Handle URL parameters
    const tab = searchParams.get("tab");
    const fort = searchParams.get("fort");

    if (tab) {
      setActiveTab(tab);
    }

    if (fort) {
      if (tab === "book-trek") {
        setTrekEnquiry((prev) => ({ ...prev, fortName: fort }));
      } else {
        setFortInfo((prev) => ({ ...prev, fortName: fort }));
      }
    }
  }, [searchParams]);

  // Fort Information Form
  const [fortInfo, setFortInfo] = useState({
    fortName: "",
    location: "",
    description: "",
    difficulty: "",
    duration: "",
    bestTimeToVisit: "",
    entryFee: "",
    facilities: "",
    safetyTips: "",
    images: [] as File[],
  });

  // Guide Contact Form
  const [guideInfo, setGuideInfo] = useState({
    guideName: "",
    phone: "",
    email: "",
    experience: "",
    specialization: "",
    languages: "",
    rate: "",
    availability: "",
    description: "",
  });

  // Additional Information Form
  const [additionalInfo, setAdditionalInfo] = useState({
    title: "",
    category: "",
    content: "",
    relatedFort: "",
  });

  // Trek Booking Enquiry Form
  const [trekEnquiry, setTrekEnquiry] = useState({
    fortName: "",
    preferredDate: "",
    numberOfPeople: "",
    duration: "",
    customerName: "",
    phone: "",
    email: "",
    specialRequests: "",
  });

  const handleFortInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("Submitting fort info:", fortInfo);
      const formData = new FormData();
      Object.entries(fortInfo).forEach(([key, value]) => {
        if (key === "images") {
          (value as File[]).forEach((file) => formData.append("images", file));
        } else {
          formData.append(key, value as string);
        }
      });

      console.log("Sending request to /api/content/submit-fort-info");
      const response = await fetch("/api/content/submit-fort-info", {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description:
            "Fort information submitted successfully. It will be reviewed by our admin team.",
        });
        setFortInfo({
          fortName: "",
          location: "",
          description: "",
          difficulty: "",
          duration: "",
          bestTimeToVisit: "",
          entryFee: "",
          facilities: "",
          safetyTips: "",
          images: [],
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit fort information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuideContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("Submitting guide contact:", guideInfo);
      const response = await fetch("/api/content/submit-guide-contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(guideInfo),
      });

      console.log("Guide response status:", response.status);

      const data = await response.json();
      console.log("Guide response data:", data);

      if (response.ok && data.success) {
        toast({
          title: "Success",
          description:
            "Guide contact submitted successfully. It will be reviewed by our admin team.",
        });
        setGuideInfo({
          guideName: "",
          phone: "",
          email: "",
          experience: "",
          specialization: "",
          languages: "",
          rate: "",
          availability: "",
          description: "",
        });
      } else {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Guide submission error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit guide contact. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdditionalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/content/submit-additional-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(additionalInfo),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description:
            "Additional information submitted successfully. It will be reviewed by our admin team.",
        });
        setAdditionalInfo({
          title: "",
          category: "",
          content: "",
          relatedFort: "",
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Failed to submit additional information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrekEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/content/submit-trek-enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trekEnquiry),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description:
            "Trek booking enquiry sent successfully. Our team and trek organizers will contact you soon.",
        });
        setTrekEnquiry({
          fortName: "",
          preferredDate: "",
          numberOfPeople: "",
          duration: "",
          customerName: "",
          phone: "",
          email: "",
          specialRequests: "",
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit trek enquiry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-16">
        {/* Header */}
        <div className="bg-muted/50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Contribute to FortTracker
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Help fellow trekkers by sharing fort information, guide
                contacts, and additional insights. Also book your next trek
                adventure with our verified organizers.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="submit">Fort Info</TabsTrigger>
              <TabsTrigger value="guides">Guide Contacts</TabsTrigger>
              <TabsTrigger value="additional">Additional Info</TabsTrigger>
              <TabsTrigger value="book-trek">Book Trek</TabsTrigger>
            </TabsList>

            <TabsContent value="submit" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Submit Fort Information
                  </CardTitle>
                  <CardDescription>
                    Share detailed information about forts to help fellow
                    trekkers plan their adventures.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleFortInfoSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fortName">Fort Name *</Label>
                        <Input
                          id="fortName"
                          value={fortInfo.fortName}
                          onChange={(e) =>
                            setFortInfo((prev) => ({
                              ...prev,
                              fortName: e.target.value,
                            }))
                          }
                          placeholder="e.g., Rajgad Fort"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location *</Label>
                        <Input
                          id="location"
                          value={fortInfo.location}
                          onChange={(e) =>
                            setFortInfo((prev) => ({
                              ...prev,
                              location: e.target.value,
                            }))
                          }
                          placeholder="e.g., Pune, Maharashtra"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={fortInfo.description}
                        onChange={(e) =>
                          setFortInfo((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Describe the fort's history, architecture, and significance..."
                        rows={4}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="difficulty">Difficulty Level</Label>
                        <Select
                          value={fortInfo.difficulty}
                          onValueChange={(value) =>
                            setFortInfo((prev) => ({
                              ...prev,
                              difficulty: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="difficult">Difficult</SelectItem>
                            <SelectItem value="very-difficult">
                              Very Difficult
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="duration">Trek Duration</Label>
                        <Input
                          id="duration"
                          value={fortInfo.duration}
                          onChange={(e) =>
                            setFortInfo((prev) => ({
                              ...prev,
                              duration: e.target.value,
                            }))
                          }
                          placeholder="e.g., 4-5 hours"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="entryFee">Entry Fee</Label>
                        <Input
                          id="entryFee"
                          value={fortInfo.entryFee}
                          onChange={(e) =>
                            setFortInfo((prev) => ({
                              ...prev,
                              entryFee: e.target.value,
                            }))
                          }
                          placeholder="e.g., ₹50 per person"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bestTimeToVisit">
                        Best Time to Visit
                      </Label>
                      <Input
                        id="bestTimeToVisit"
                        value={fortInfo.bestTimeToVisit}
                        onChange={(e) =>
                          setFortInfo((prev) => ({
                            ...prev,
                            bestTimeToVisit: e.target.value,
                          }))
                        }
                        placeholder="e.g., October to March"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="facilities">Available Facilities</Label>
                      <Textarea
                        id="facilities"
                        value={fortInfo.facilities}
                        onChange={(e) =>
                          setFortInfo((prev) => ({
                            ...prev,
                            facilities: e.target.value,
                          }))
                        }
                        placeholder="Parking, restrooms, food stalls, water availability..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="safetyTips">Safety Tips</Label>
                      <Textarea
                        id="safetyTips"
                        value={fortInfo.safetyTips}
                        onChange={(e) =>
                          setFortInfo((prev) => ({
                            ...prev,
                            safetyTips: e.target.value,
                          }))
                        }
                        placeholder="Important safety considerations for trekkers..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="images">Upload Images (Optional)</Label>
                      <Input
                        id="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          setFortInfo((prev) => ({ ...prev, images: files }));
                        }}
                      />
                      <p className="text-sm text-muted-foreground">
                        Upload up to 5 images of the fort (JPG, PNG, max 5MB
                        each)
                      </p>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? (
                        <>
                          <Upload className="h-4 w-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Submit Fort Information
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="guides" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Submit Guide Contact
                  </CardTitle>
                  <CardDescription>
                    Help trekkers connect with reliable local guides and
                    organizers.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={handleGuideContactSubmit}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="guideName">Guide Name *</Label>
                        <Input
                          id="guideName"
                          value={guideInfo.guideName}
                          onChange={(e) =>
                            setGuideInfo((prev) => ({
                              ...prev,
                              guideName: e.target.value,
                            }))
                          }
                          placeholder="Full name of the guide"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="guidePhone">Phone Number *</Label>
                        <Input
                          id="guidePhone"
                          value={guideInfo.phone}
                          onChange={(e) =>
                            setGuideInfo((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          placeholder="+91 XXXXXXXXXX"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="guideEmail">Email (Optional)</Label>
                        <Input
                          id="guideEmail"
                          type="email"
                          value={guideInfo.email}
                          onChange={(e) =>
                            setGuideInfo((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          placeholder="guide@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="experience">Experience (Years)</Label>
                        <Input
                          id="experience"
                          value={guideInfo.experience}
                          onChange={(e) =>
                            setGuideInfo((prev) => ({
                              ...prev,
                              experience: e.target.value,
                            }))
                          }
                          placeholder="e.g., 5 years"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="specialization">Specialization</Label>
                        <Input
                          id="specialization"
                          value={guideInfo.specialization}
                          onChange={(e) =>
                            setGuideInfo((prev) => ({
                              ...prev,
                              specialization: e.target.value,
                            }))
                          }
                          placeholder="e.g., Sahyadri Forts, Western Ghats"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="languages">Languages Spoken</Label>
                        <Input
                          id="languages"
                          value={guideInfo.languages}
                          onChange={(e) =>
                            setGuideInfo((prev) => ({
                              ...prev,
                              languages: e.target.value,
                            }))
                          }
                          placeholder="e.g., Marathi, Hindi, English"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="rate">Rates (Per Day)</Label>
                        <Input
                          id="rate"
                          value={guideInfo.rate}
                          onChange={(e) =>
                            setGuideInfo((prev) => ({
                              ...prev,
                              rate: e.target.value,
                            }))
                          }
                          placeholder="e.g., ₹1500 per day"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="availability">Availability</Label>
                        <Input
                          id="availability"
                          value={guideInfo.availability}
                          onChange={(e) =>
                            setGuideInfo((prev) => ({
                              ...prev,
                              availability: e.target.value,
                            }))
                          }
                          placeholder="e.g., Weekends only"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="guideDescription">Description</Label>
                      <Textarea
                        id="guideDescription"
                        value={guideInfo.description}
                        onChange={(e) =>
                          setGuideInfo((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Brief description of services, expertise, and any additional information..."
                        rows={4}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? (
                        <>
                          <Upload className="h-4 w-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Submit Guide Contact
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="additional" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Submit Additional Information
                  </CardTitle>
                  <CardDescription>
                    Share any additional insights, tips, or information that
                    could help fellow trekkers.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={handleAdditionalInfoSubmit}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="infoTitle">Title *</Label>
                        <Input
                          id="infoTitle"
                          value={additionalInfo.title}
                          onChange={(e) =>
                            setAdditionalInfo((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          placeholder="Brief title for your information"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={additionalInfo.category}
                          onValueChange={(value) =>
                            setAdditionalInfo((prev) => ({
                              ...prev,
                              category: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="travel-tip">
                              Travel Tip
                            </SelectItem>
                            <SelectItem value="route-info">
                              Route Information
                            </SelectItem>
                            <SelectItem value="accommodation">
                              Accommodation
                            </SelectItem>
                            <SelectItem value="food">Food & Dining</SelectItem>
                            <SelectItem value="transportation">
                              Transportation
                            </SelectItem>
                            <SelectItem value="safety">
                              Safety Information
                            </SelectItem>
                            <SelectItem value="weather">
                              Weather Updates
                            </SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="relatedFort">
                        Related Fort (Optional)
                      </Label>
                      <Input
                        id="relatedFort"
                        value={additionalInfo.relatedFort}
                        onChange={(e) =>
                          setAdditionalInfo((prev) => ({
                            ...prev,
                            relatedFort: e.target.value,
                          }))
                        }
                        placeholder="If this information is specific to a particular fort"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="infoContent">Information Content *</Label>
                      <Textarea
                        id="infoContent"
                        value={additionalInfo.content}
                        onChange={(e) =>
                          setAdditionalInfo((prev) => ({
                            ...prev,
                            content: e.target.value,
                          }))
                        }
                        placeholder="Share your detailed information, tips, or insights..."
                        rows={6}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? (
                        <>
                          <Upload className="h-4 w-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Submit Additional Information
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="book-trek" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Book Trek - Send Enquiry
                  </CardTitle>
                  <CardDescription>
                    Send your trek booking enquiry to our verified organizers
                    and admin team.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={handleTrekEnquirySubmit}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="trekFortName">Fort Name *</Label>
                        <Input
                          id="trekFortName"
                          value={trekEnquiry.fortName}
                          onChange={(e) =>
                            setTrekEnquiry((prev) => ({
                              ...prev,
                              fortName: e.target.value,
                            }))
                          }
                          placeholder="Which fort would you like to trek?"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="preferredDate">Preferred Date *</Label>
                        <Input
                          id="preferredDate"
                          type="date"
                          value={trekEnquiry.preferredDate}
                          onChange={(e) =>
                            setTrekEnquiry((prev) => ({
                              ...prev,
                              preferredDate: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="numberOfPeople">
                          Number of People *
                        </Label>
                        <Input
                          id="numberOfPeople"
                          type="number"
                          min="1"
                          value={trekEnquiry.numberOfPeople}
                          onChange={(e) =>
                            setTrekEnquiry((prev) => ({
                              ...prev,
                              numberOfPeople: e.target.value,
                            }))
                          }
                          placeholder="How many people in your group?"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="trekDuration">Trek Duration</Label>
                        <Select
                          value={trekEnquiry.duration}
                          onValueChange={(value) =>
                            setTrekEnquiry((prev) => ({
                              ...prev,
                              duration: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="half-day">
                              Half Day (4-6 hours)
                            </SelectItem>
                            <SelectItem value="full-day">
                              Full Day (8-10 hours)
                            </SelectItem>
                            <SelectItem value="overnight">
                              Overnight (1-2 days)
                            </SelectItem>
                            <SelectItem value="multi-day">
                              Multi-day (3+ days)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        Contact Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="customerName">Your Name *</Label>
                          <Input
                            id="customerName"
                            value={trekEnquiry.customerName}
                            onChange={(e) =>
                              setTrekEnquiry((prev) => ({
                                ...prev,
                                customerName: e.target.value,
                              }))
                            }
                            placeholder="Full name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="customerPhone">Phone Number *</Label>
                          <Input
                            id="customerPhone"
                            value={trekEnquiry.phone}
                            onChange={(e) =>
                              setTrekEnquiry((prev) => ({
                                ...prev,
                                phone: e.target.value,
                              }))
                            }
                            placeholder="+91 XXXXXXXXXX"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="customerEmail">Email Address *</Label>
                        <Input
                          id="customerEmail"
                          type="email"
                          value={trekEnquiry.email}
                          onChange={(e) =>
                            setTrekEnquiry((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialRequests">
                        Special Requests (Optional)
                      </Label>
                      <Textarea
                        id="specialRequests"
                        value={trekEnquiry.specialRequests}
                        onChange={(e) =>
                          setTrekEnquiry((prev) => ({
                            ...prev,
                            specialRequests: e.target.value,
                          }))
                        }
                        placeholder="Any special requirements, dietary restrictions, accessibility needs, etc."
                        rows={4}
                      />
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-foreground mb-1">
                            What happens next?
                          </p>
                          <ul className="text-muted-foreground space-y-1">
                            <li>
                              • Your enquiry will be sent to our verified trek
                              organizers
                            </li>
                            <li>
                              • Our admin team will also receive your request
                            </li>
                            <li>
                              • You'll receive a confirmation call within 24
                              hours
                            </li>
                            <li>
                              • Trek organizers will provide detailed itinerary
                              and pricing
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? (
                        <>
                          <Upload className="h-4 w-4 mr-2 animate-spin" />
                          Sending Enquiry...
                        </>
                      ) : (
                        <>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Trek Booking Enquiry
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
