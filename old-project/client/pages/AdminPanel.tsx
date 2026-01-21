import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import SiteContentManagement from "@/components/SiteContentManagement";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CheckCircle,
  XCircle,
  Clock,
  Users,
  MapPin,
  Phone,
  Mail,
  RefreshCw,
  Eye,
  MessageSquare,
  Calendar,
  AlertCircle,
  FileText,
  Star,
  Loader2,
  Trash2,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ContentSubmission {
  id: string;
  type: "fort-info" | "guide-contact" | "additional-info" | "trek-enquiry";
  title: string;
  content: any;
  submittedBy: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  adminNotes?: string;
}

interface AdminStats {
  totalSubmissions: number;
  pendingApproval: number;
  approvedContent: number;
  rejectedContent: number;
  trekEnquiries: number;
  guideContacts: number;
}

export default function AdminPanel() {
  const [submissions, setSubmissions] = useState<ContentSubmission[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
    search: "",
  });
  const [selectedSubmission, setSelectedSubmission] =
    useState<ContentSubmission | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [approvedForts, setApprovedForts] = useState<any[]>([]);
  const [editingFort, setEditingFort] = useState<any | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});
  const [newImages, setNewImages] = useState<File[]>([]);

  useEffect(() => {
    fetchSubmissions();
    fetchStats();
    fetchApprovedForts();
  }, []);

  // Update filters when tab changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      status:
        activeTab === "pending"
          ? "pending"
          : activeTab === "approved"
            ? "approved"
            : activeTab === "rejected"
              ? "rejected"
              : activeTab === "enquiries"
                ? "all"
                : "all",
      type: activeTab === "enquiries" ? "trek-enquiry" : "all",
    }));
  }, [activeTab]);

  // Refetch when filters change
  useEffect(() => {
    fetchSubmissions();
  }, [filters.status, filters.type]);

  const fetchApprovedForts = async () => {
    try {
      const response = await fetch("/api/content/approved-forts");
      const data = await response.json();
      if (data.success) {
        setApprovedForts(data.data);
      }
    } catch (error) {
      console.error("Error fetching approved forts:", error);
    }
  };

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.type !== "all") queryParams.append("type", filters.type);
      if (filters.status !== "all")
        queryParams.append("status", filters.status);

      const response = await fetch(
        `/api/content/admin/content-submissions?${queryParams}`,
      );
      const data = await response.json();

      if (data.success) {
        setSubmissions(data.data || []);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast({
        title: "Error",
        description: "Failed to load submissions.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/content/admin/content-stats");
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleApproval = async (
    submissionId: string,
    action: "approved" | "rejected",
    notes?: string,
  ) => {
    try {
      setActionLoading(submissionId);

      const response = await fetch(
        `/api/content/admin/content-submissions/${submissionId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: action,
            adminNotes: notes,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: `Content ${action} successfully.`,
        });

        // Refresh data
        await fetchSubmissions();
        await fetchStats();
        setSelectedSubmission(null);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error updating submission:", error);
      toast({
        title: "Error",
        description: "Failed to update submission.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditFort = (fort: any) => {
    setEditingFort(fort);
    setEditFormData({
      fortName: fort.fortName,
      location: fort.location,
      description: fort.description,
      difficulty: fort.difficulty,
      duration: fort.duration,
      bestTimeToVisit: fort.bestTimeToVisit,
      entryFee: fort.entryFee,
      facilities: fort.facilities,
      safetyTips: fort.safetyTips,
    });
    setNewImages([]);
  };

  const handleSaveFortEdit = async () => {
    if (!editingFort) return;

    try {
      setEditLoading(true);

      // Create FormData for the request
      const formData = new FormData();

      // Add text fields
      Object.keys(editFormData).forEach((key) => {
        formData.append(key, editFormData[key]);
      });

      // Add new images
      newImages.forEach((image) => {
        formData.append("images", image);
      });

      const response = await fetch(
        `/api/content/approved-forts/${editingFort.id}`,
        {
          method: "PUT",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update fort");
      }

      toast({
        title: "Success",
        description: "Fort updated successfully",
      });

      // Refresh data
      fetchSubmissions();
      fetchStats();
      fetchApprovedForts();
      setEditingFort(null);

      // Broadcast event to refresh explore page if it's open
      window.dispatchEvent(new CustomEvent("fortUpdated"));
    } catch (error) {
      console.error("Error updating fort:", error);
      toast({
        title: "Error",
        description: "Failed to update fort",
        variant: "destructive",
      });
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteFort = async (fortId: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this fort? This will remove it from the explore page and database.",
      )
    ) {
      return;
    }

    try {
      setDeleteLoading(fortId);
      const response = await fetch(`/api/content/approved-forts/${fortId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete fort");
      }

      toast({
        title: "Success",
        description: "Fort deleted successfully",
      });

      // Refresh data
      fetchSubmissions();
      fetchStats();
      fetchApprovedForts();

      // Broadcast event to refresh explore page if it's open
      window.dispatchEvent(new CustomEvent("fortDeleted"));
    } catch (error) {
      console.error("Error deleting fort:", error);
      toast({
        title: "Error",
        description: "Failed to delete fort",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredSubmissions = submissions.filter((submission) => {
    if (filters.type !== "all" && submission.type !== filters.type)
      return false;
    if (filters.status !== "all" && submission.status !== filters.status)
      return false;
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        submission.title.toLowerCase().includes(searchTerm) ||
        submission.submittedBy.toLowerCase().includes(searchTerm) ||
        JSON.stringify(submission.content).toLowerCase().includes(searchTerm)
      );
    }
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Format content for better readability
  const formatContent = (content: any, type: string) => {
    if (typeof content === "string") {
      try {
        content = JSON.parse(content);
      } catch {
        return content;
      }
    }

    switch (type) {
      case "fort-info":
        return (
          <div className="space-y-2 text-sm">
            <div>
              <strong>Fort Name:</strong> {content.fortName}
            </div>
            <div>
              <strong>Location:</strong> {content.location}
            </div>
            <div>
              <strong>Difficulty:</strong> {content.difficulty}
            </div>
            <div>
              <strong>Duration:</strong> {content.duration}
            </div>
            <div>
              <strong>Best Time to Visit:</strong> {content.bestTimeToVisit}
            </div>
            <div>
              <strong>Entry Fee:</strong> {content.entryFee}
            </div>
            <div>
              <strong>Description:</strong> {content.description}
            </div>
            <div>
              <strong>Facilities:</strong> {content.facilities}
            </div>
            <div>
              <strong>Safety Tips:</strong> {content.safetyTips}
            </div>
            {content.images && content.images.length > 0 && (
              <div>
                <strong>Images:</strong> {content.images.length} uploaded
              </div>
            )}
          </div>
        );

      case "guide-contact":
        return (
          <div className="space-y-2 text-sm">
            <div>
              <strong>Guide Name:</strong> {content.guideName}
            </div>
            <div>
              <strong>Phone:</strong> {content.phone}
            </div>
            <div>
              <strong>Email:</strong> {content.email}
            </div>
            <div>
              <strong>Experience:</strong> {content.experience}
            </div>
            <div>
              <strong>Specialization:</strong> {content.specialization}
            </div>
            <div>
              <strong>Languages:</strong> {content.languages}
            </div>
            <div>
              <strong>Rate:</strong> {content.rate}
            </div>
            <div>
              <strong>Availability:</strong> {content.availability}
            </div>
            <div>
              <strong>Description:</strong> {content.description}
            </div>
          </div>
        );

      case "additional-info":
        return (
          <div className="space-y-2 text-sm">
            <div>
              <strong>Title:</strong> {content.title}
            </div>
            <div>
              <strong>Category:</strong> {content.category}
            </div>
            <div>
              <strong>Related Fort:</strong> {content.relatedFort}
            </div>
            <div>
              <strong>Content:</strong> {content.content}
            </div>
          </div>
        );

      case "trek-enquiry":
        return (
          <div className="space-y-2 text-sm">
            <div>
              <strong>Fort Name:</strong> {content.fortName}
            </div>
            <div>
              <strong>Customer:</strong> {content.customerName}
            </div>
            <div>
              <strong>Phone:</strong> {content.phone}
            </div>
            <div>
              <strong>Email:</strong> {content.email}
            </div>
            <div>
              <strong>Preferred Date:</strong> {content.preferredDate}
            </div>
            <div>
              <strong>Number of People:</strong> {content.numberOfPeople}
            </div>
            <div>
              <strong>Duration:</strong> {content.duration}
            </div>
            <div>
              <strong>Special Requests:</strong> {content.specialRequests}
            </div>
          </div>
        );

      default:
        return (
          <pre className="text-xs bg-gray-100 p-2 rounded whitespace-pre-wrap">
            {JSON.stringify(content, null, 2)}
          </pre>
        );
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "fort-info":
        return <MapPin className="h-4 w-4" />;
      case "guide-contact":
        return <Users className="h-4 w-4" />;
      case "additional-info":
        return <FileText className="h-4 w-4" />;
      case "trek-enquiry":
        return <Calendar className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderContentPreview = (submission: ContentSubmission) => {
    const content = submission.content;

    switch (submission.type) {
      case "fort-info":
        return (
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">
              {content.fortName} - {content.location}
            </div>
          </div>
        );
      case "guide-contact":
        return (
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">
              {content.guideName} - {content.experience} experience
            </div>
          </div>
        );
      case "additional-info":
        return (
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">
              {content.category} - {content.relatedFort || "General"}
            </div>
          </div>
        );
      case "trek-enquiry":
        return (
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">
              {content.fortName} - {content.numberOfPeople} people on{" "}
              {content.preferredDate}
            </div>
          </div>
        );
      default:
        return (
          <div className="text-sm text-muted-foreground">
            Content preview not available
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-16 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading admin panel...</p>
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
                  Admin Panel
                </h1>
                <p className="text-lg text-muted-foreground">
                  Moderate user-submitted content and manage trek enquiries
                </p>
              </div>
              <Button
                onClick={() => {
                  fetchSubmissions();
                  fetchStats();
                }}
                variant="outline"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Statistics Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total
                      </p>
                      <p className="text-2xl font-bold">
                        {stats.totalSubmissions}
                      </p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Pending
                      </p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {stats.pendingApproval}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Approved
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {stats.approvedContent}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Rejected
                      </p>
                      <p className="text-2xl font-bold text-red-600">
                        {stats.rejectedContent}
                      </p>
                    </div>
                    <XCircle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Enquiries
                      </p>
                      <p className="text-2xl font-bold text-purple-600">
                        {stats.trekEnquiries}
                      </p>
                    </div>
                    <Calendar className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Guides
                      </p>
                      <p className="text-2xl font-bold text-orange-600">
                        {stats.guideContacts}
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="pending">Pending Approval</TabsTrigger>
              <TabsTrigger value="approved">Approved Content</TabsTrigger>
              <TabsTrigger value="rejected">Rejected Content</TabsTrigger>
              <TabsTrigger value="enquiries">Trek Enquiries</TabsTrigger>
              <TabsTrigger value="site-content">Site Content</TabsTrigger>
            </TabsList>

            <TabsContent
              value={activeTab}
              className="space-y-6"
              style={{
                display: activeTab === "site-content" ? "none" : "block",
              }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Content Submissions</CardTitle>
                      <CardDescription>
                        Review and moderate user-submitted content
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">
                      {filteredSubmissions.length} items
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Filters */}
                  <div className="flex gap-4 mb-6">
                    <div className="flex-1">
                      <Input
                        placeholder="Search submissions..."
                        value={filters.search}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            search: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <Select
                      value={filters.type}
                      onValueChange={(value) =>
                        setFilters((prev) => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="fort-info">
                          Fort Information
                        </SelectItem>
                        <SelectItem value="guide-contact">
                          Guide Contacts
                        </SelectItem>
                        <SelectItem value="additional-info">
                          Additional Info
                        </SelectItem>
                        <SelectItem value="trek-enquiry">
                          Trek Enquiries
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={filters.status}
                      onValueChange={(value) =>
                        setFilters((prev) => ({ ...prev, status: value }))
                      }
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Submissions List */}
                  <div className="space-y-4">
                    {filteredSubmissions.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="h-8 w-8 mx-auto mb-2" />
                        <p>No submissions found</p>
                      </div>
                    ) : (
                      filteredSubmissions.map((submission) => (
                        <Card
                          key={submission.id}
                          className="border-l-4 border-l-primary/20"
                        >
                          <CardContent className="p-4">
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                              {/* Submission Info */}
                              <div className="lg:col-span-2">
                                <div className="flex items-center gap-2 mb-2">
                                  {getTypeIcon(submission.type)}
                                  <h4 className="font-semibold">
                                    {submission.title}
                                  </h4>
                                  <Badge
                                    className={getStatusColor(
                                      submission.status,
                                    )}
                                  >
                                    {submission.status}
                                  </Badge>
                                </div>
                                <div className="text-sm text-muted-foreground mb-3">
                                  Submitted by{" "}
                                  <strong>{submission.submittedBy}</strong> on{" "}
                                  {formatDate(submission.submittedAt)}
                                </div>
                                {renderContentPreview(submission)}
                              </div>

                              {/* Actions */}
                              <div className="lg:col-span-2">
                                <div className="flex flex-col gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      setSelectedSubmission(submission)
                                    }
                                    className="w-full"
                                  >
                                    <Eye className="h-3 w-3 mr-2" />
                                    View Details
                                  </Button>

                                  {submission.status === "pending" && (
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        onClick={() =>
                                          handleApproval(
                                            submission.id,
                                            "approved",
                                          )
                                        }
                                        disabled={
                                          actionLoading === submission.id
                                        }
                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                      >
                                        {actionLoading === submission.id ? (
                                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                        ) : (
                                          <CheckCircle className="h-3 w-3 mr-1" />
                                        )}
                                        Approve
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() =>
                                          handleApproval(
                                            submission.id,
                                            "rejected",
                                          )
                                        }
                                        disabled={
                                          actionLoading === submission.id
                                        }
                                        className="flex-1"
                                      >
                                        <XCircle className="h-3 w-3 mr-1" />
                                        Reject
                                      </Button>
                                    </div>
                                  )}

                                  {submission.status === "approved" &&
                                    submission.type === "fort-info" &&
                                    (() => {
                                      // Find the corresponding approved fort by submission_id
                                      const approvedFort = approvedForts.find(
                                        (fort) =>
                                          fort.submission_id ===
                                          parseInt(submission.id),
                                      );

                                      if (!approvedFort) return null;

                                      return (
                                        <div className="space-y-2">
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                              handleEditFort(approvedFort)
                                            }
                                            disabled={editLoading}
                                            className="w-full"
                                          >
                                            <FileText className="h-3 w-3 mr-1" />
                                            Edit Fort
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() =>
                                              handleDeleteFort(approvedFort.id)
                                            }
                                            disabled={deleteLoading !== null}
                                            className="w-full"
                                          >
                                            {deleteLoading ===
                                            approvedFort.id ? (
                                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                            ) : (
                                              <Trash2 className="h-3 w-3 mr-1" />
                                            )}
                                            Delete Fort
                                          </Button>
                                        </div>
                                      );
                                    })()}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Site Content Management Tab */}
            <TabsContent value="site-content" className="space-y-6">
              <SiteContentManagement />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Detailed View Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(selectedSubmission.type)}
                  <CardTitle>{selectedSubmission.title}</CardTitle>
                  <Badge className={getStatusColor(selectedSubmission.status)}>
                    {selectedSubmission.status}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedSubmission(null)}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                Submitted by {selectedSubmission.submittedBy} on{" "}
                {formatDate(selectedSubmission.submittedAt)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Content Details:</h4>
                <div className="bg-muted p-3 rounded">
                  {formatContent(
                    selectedSubmission.content,
                    selectedSubmission.type,
                  )}
                </div>
              </div>

              {selectedSubmission.adminNotes && (
                <div>
                  <h4 className="font-semibold mb-2">Admin Notes:</h4>
                  <p className="text-sm bg-muted p-3 rounded">
                    {selectedSubmission.adminNotes}
                  </p>
                </div>
              )}

              {selectedSubmission.status === "pending" && (
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() =>
                      handleApproval(selectedSubmission.id, "approved")
                    }
                    disabled={actionLoading === selectedSubmission.id}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {actionLoading === selectedSubmission.id ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() =>
                      handleApproval(selectedSubmission.id, "rejected")
                    }
                    disabled={actionLoading === selectedSubmission.id}
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Fort Modal */}
      {editingFort && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Edit Fort: {editingFort.fortName}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingFort(null)}
                  disabled={editLoading}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Fort Name</label>
                  <Input
                    value={editFormData.fortName || ""}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        fortName: e.target.value,
                      }))
                    }
                    disabled={editLoading}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    value={editFormData.location || ""}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    disabled={editLoading}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Difficulty</label>
                  <Select
                    value={editFormData.difficulty || ""}
                    onValueChange={(value) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        difficulty: value,
                      }))
                    }
                    disabled={editLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="difficult">Difficult</SelectItem>
                      <SelectItem value="extreme">Extreme</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Duration</label>
                  <Input
                    value={editFormData.duration || ""}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        duration: e.target.value,
                      }))
                    }
                    disabled={editLoading}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Best Time to Visit
                  </label>
                  <Input
                    value={editFormData.bestTimeToVisit || ""}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        bestTimeToVisit: e.target.value,
                      }))
                    }
                    disabled={editLoading}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Entry Fee</label>
                  <Input
                    value={editFormData.entryFee || ""}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        entryFee: e.target.value,
                      }))
                    }
                    disabled={editLoading}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={editFormData.description || ""}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  disabled={editLoading}
                  rows={4}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Facilities</label>
                <Textarea
                  value={editFormData.facilities || ""}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      facilities: e.target.value,
                    }))
                  }
                  disabled={editLoading}
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Safety Tips</label>
                <Textarea
                  value={editFormData.safetyTips || ""}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      safetyTips: e.target.value,
                    }))
                  }
                  disabled={editLoading}
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Add New Images</label>
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      setNewImages(Array.from(files));
                    }
                  }}
                  disabled={editLoading}
                />
                {newImages.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {newImages.length} new image(s) selected
                  </p>
                )}
              </div>

              {editingFort.images && editingFort.images.length > 0 && (
                <div>
                  <label className="text-sm font-medium">Current Images</label>
                  <p className="text-sm text-muted-foreground">
                    {editingFort.images.length} existing image(s)
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleSaveFortEdit}
                  disabled={editLoading}
                  className="flex-1"
                >
                  {editLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingFort(null)}
                  disabled={editLoading}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
