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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/Navigation";
import {
  Users,
  MapPin,
  Calendar,
  Clock,
  Star,
  MessageCircle,
  UserPlus,
  Filter,
  Search,
  Plus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TrekGroup {
  id: number;
  title: string;
  description: string;
  fortName: string;
  organizer: {
    name: string;
    avatar?: string;
    rating: number;
    completedTreks: number;
  };
  trekDate: string;
  duration: string;
  difficulty: "Easy" | "Moderate" | "Difficult" | "Expert";
  maxParticipants: number;
  currentParticipants: number;
  meetingPoint: string;
  cost: number;
  included: string[];
  requirements: string[];
  status: "open" | "full" | "closed";
  createdAt: string;
  tags: string[];
}

export default function TrekGroups() {
  const [groups, setGroups] = useState<TrekGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [selectedChatGroup, setSelectedChatGroup] = useState<number | null>(null);
  const [openChatDialog, setOpenChatDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fortName: "",
    trekDate: "",
    duration: "",
    difficulty: "Moderate" as const,
    maxParticipants: 10,
    meetingPoint: "",
    cost: 0,
    included: "",
    requirements: "",
    tags: "",
  });

  useEffect(() => {
    fetchTrekGroups();
  }, []);

  const fetchTrekGroups = async () => {
    try {
      const response = await fetch("/api/trek-groups/trek-groups");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setGroups(data.groups);
        } else {
          // Use sample data if no groups exist
          setSampleGroups();
        }
      } else {
        setSampleGroups();
      }
    } catch (error) {
      console.error("Error fetching trek groups:", error);
      setSampleGroups();
    } finally {
      setLoading(false);
    }
  };

  const setSampleGroups = () => {
    setGroups([
      {
        id: 1,
        title: "Rajgad Fort Night Trek Adventure",
        description:
          "Join us for an exciting night trek to Rajgad Fort. Experience the fort under moonlight and catch the beautiful sunrise from the top. Perfect for intermediate trekkers looking for a thrilling adventure.",
        fortName: "Rajgad Fort",
        organizer: {
          name: "Anil Jadhav",
          rating: 4.8,
          completedTreks: 45,
        },
        trekDate: "2024-03-15",
        duration: "1 Night, 2 Days",
        difficulty: "Moderate",
        maxParticipants: 15,
        currentParticipants: 8,
        meetingPoint: "Pune Railway Station",
        cost: 1200,
        included: ["Transportation", "Guide", "Breakfast", "First Aid"],
        requirements: [
          "Good fitness level",
          "Trekking shoes",
          "Headlamp",
          "Water bottle",
        ],
        status: "open",
        createdAt: "2024-02-20T10:00:00Z",
        tags: ["Night Trek", "Sunrise", "Historical"],
      },
      {
        id: 2,
        title: "Sinhagad Fort Family Trek",
        description:
          "Perfect family trek to Sinhagad Fort. Suitable for all age groups including children and elderly. Enjoy local food and learn about Maratha history.",
        fortName: "Sinhagad Fort",
        organizer: {
          name: "Priya Sharma",
          rating: 4.9,
          completedTreks: 32,
        },
        trekDate: "2024-03-22",
        duration: "1 Day",
        difficulty: "Easy",
        maxParticipants: 20,
        currentParticipants: 12,
        meetingPoint: "Sinhagad Base Village",
        cost: 800,
        included: ["Guide", "Lunch", "Entry fees", "Photos"],
        requirements: [
          "Comfortable walking shoes",
          "Water bottle",
          "Sun protection",
        ],
        status: "open",
        createdAt: "2024-02-18T14:30:00Z",
        tags: ["Family Friendly", "Historical", "Food"],
      },
      {
        id: 3,
        title: "Harishchandragad Advanced Trek",
        description:
          "Challenging trek to Harishchandragad fort for experienced trekkers. Experience the famous Konkan Kada cliff and temple caves. Overnight camping under stars.",
        fortName: "Harishchandragad Fort",
        organizer: {
          name: "Vikram Desai",
          rating: 4.7,
          completedTreks: 67,
        },
        trekDate: "2024-03-28",
        duration: "2 Days, 1 Night",
        difficulty: "Difficult",
        maxParticipants: 12,
        currentParticipants: 12,
        meetingPoint: "Khireshwar Village",
        cost: 1800,
        included: ["Guide", "Camping equipment", "Meals", "Safety gear"],
        requirements: [
          "High fitness level",
          "Trekking experience",
          "Personal medications",
        ],
        status: "full",
        createdAt: "2024-02-15T09:00:00Z",
        tags: ["Advanced", "Camping", "Cliff Views"],
      },
    ]);
  };

  const joinGroup = async (groupId: number) => {
    try {
      const response = await fetch(`/api/trek-groups/${groupId}/join`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        // Refresh groups data
        fetchTrekGroups();
      } else {
        // Handle error or redirect to login
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Error joining group:", error);
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingGroup(true);

    try {
      const response = await fetch("/api/trek-groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          fortName: formData.fortName,
          trekDate: formData.trekDate,
          duration: formData.duration,
          difficulty: formData.difficulty,
          maxParticipants: parseInt(formData.maxParticipants.toString()),
          meetingPoint: formData.meetingPoint,
          cost: parseFloat(formData.cost.toString()),
          included: formData.included
            .split("\n")
            .map((item) => item.trim())
            .filter((item) => item),
          requirements: formData.requirements
            .split("\n")
            .map((item) => item.trim())
            .filter((item) => item),
          tags: formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Reset form and close dialog
          setFormData({
            title: "",
            description: "",
            fortName: "",
            trekDate: "",
            duration: "",
            difficulty: "Moderate",
            maxParticipants: 10,
            meetingPoint: "",
            cost: 0,
            included: "",
            requirements: "",
            tags: "",
          });
          setOpenCreateDialog(false);
          // Refresh groups
          fetchTrekGroups();
        }
      } else if (response.status === 401) {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Error creating trek group:", error);
    } finally {
      setCreatingGroup(false);
    }
  };

  const handleFormChange = (
    field: string,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const filteredGroups = groups.filter((group) => {
    const matchesSearch =
      group.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.fortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.organizer.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDifficulty =
      filterDifficulty === "all" || group.difficulty === filterDifficulty;
    const matchesStatus =
      filterStatus === "all" || group.status === filterStatus;

    return matchesSearch && matchesDifficulty && matchesStatus;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Moderate":
        return "bg-yellow-100 text-yellow-800";
      case "Difficult":
        return "bg-orange-100 text-orange-800";
      case "Expert":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800";
      case "full":
        return "bg-red-100 text-red-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Trek Groups
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Join fellow trekkers for amazing adventures. Discover organized
              treks, meet new people, and explore Maharashtra's beautiful forts
              together.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by fort name, organizer, or title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select
              value={filterDifficulty}
              onValueChange={setFilterDifficulty}
            >
              <SelectTrigger>
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Moderate">Moderate</SelectItem>
                <SelectItem value="Difficult">Difficult</SelectItem>
                <SelectItem value="Expert">Expert</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="full">Full</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Available Trek Groups ({filteredGroups.length})
            </h2>
            <p className="text-gray-600">Find your next adventure partner</p>
          </div>
          <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Trek Group</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new trek group and start
                  organizing adventures!
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateGroup} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Group Title *</Label>
                    <input
                      id="title"
                      type="text"
                      placeholder="e.g., Rajgad Night Trek"
                      value={formData.title}
                      onChange={(e) =>
                        handleFormChange("title", e.target.value)
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fortName">Fort Name *</Label>
                    <input
                      id="fortName"
                      type="text"
                      placeholder="e.g., Rajgad Fort"
                      value={formData.fortName}
                      onChange={(e) =>
                        handleFormChange("fortName", e.target.value)
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your trek group..."
                    value={formData.description}
                    onChange={(e) =>
                      handleFormChange("description", e.target.value)
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="trekDate">Trek Date *</Label>
                    <input
                      id="trekDate"
                      type="date"
                      value={formData.trekDate}
                      onChange={(e) =>
                        handleFormChange("trekDate", e.target.value)
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration *</Label>
                    <input
                      id="duration"
                      type="text"
                      placeholder="e.g., 1 Day or 2 Days, 1 Night"
                      value={formData.duration}
                      onChange={(e) =>
                        handleFormChange("duration", e.target.value)
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="difficulty">Difficulty *</Label>
                    <select
                      id="difficulty"
                      value={formData.difficulty}
                      onChange={(e) =>
                        handleFormChange("difficulty", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Difficult">Difficult</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="maxParticipants">Max Participants *</Label>
                    <input
                      id="maxParticipants"
                      type="number"
                      min="1"
                      value={formData.maxParticipants}
                      onChange={(e) =>
                        handleFormChange("maxParticipants", parseInt(e.target.value) || 0)
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cost">Cost (₹) *</Label>
                    <input
                      id="cost"
                      type="number"
                      min="0"
                      step="100"
                      value={formData.cost}
                      onChange={(e) =>
                        handleFormChange("cost", parseFloat(e.target.value) || 0)
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="meetingPoint">Meeting Point *</Label>
                  <input
                    id="meetingPoint"
                    type="text"
                    placeholder="e.g., Pune Railway Station"
                    value={formData.meetingPoint}
                    onChange={(e) =>
                      handleFormChange("meetingPoint", e.target.value)
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500"
                  />
                </div>

                <div>
                  <Label htmlFor="included">Included Items (one per line)</Label>
                  <Textarea
                    id="included"
                    placeholder="e.g., Transportation&#10;Guide&#10;Breakfast&#10;First Aid"
                    value={formData.included}
                    onChange={(e) =>
                      handleFormChange("included", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="requirements">
                    Requirements (one per line)
                  </Label>
                  <Textarea
                    id="requirements"
                    placeholder="e.g., Good fitness level&#10;Trekking shoes&#10;Water bottle"
                    value={formData.requirements}
                    onChange={(e) =>
                      handleFormChange("requirements", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <input
                    id="tags"
                    type="text"
                    placeholder="e.g., Night Trek, Sunrise, Historical"
                    value={formData.tags}
                    onChange={(e) => handleFormChange("tags", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpenCreateDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600"
                    disabled={creatingGroup}
                  >
                    {creatingGroup ? "Creating..." : "Create Group"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Groups Grid */}
        <div className="grid gap-6">
          {filteredGroups.map((group) => (
            <Card
              key={group.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl">{group.title}</CardTitle>
                      <Badge className={getStatusColor(group.status)}>
                        {group.status.toUpperCase()}
                      </Badge>
                    </div>
                    <CardDescription className="text-base">
                      {group.description}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-600">
                      ₹{group.cost}
                    </div>
                    <div className="text-sm text-gray-500">per person</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {/* Trek Details */}
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-orange-500" />
                      <span className="font-medium">{group.fortName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-orange-500" />
                      <span>
                        {new Date(group.trekDate).toLocaleDateString("en-IN", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <span>{group.duration}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-orange-500" />
                      <span>
                        {group.currentParticipants}/{group.maxParticipants}{" "}
                        participants
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full"
                          style={{
                            width: `${(group.currentParticipants / group.maxParticipants) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Badge className={getDifficultyColor(group.difficulty)}>
                        {group.difficulty}
                      </Badge>
                      {group.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Organizer Info */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar>
                          <AvatarFallback>
                            {group.organizer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {group.organizer.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Trek Organizer
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span>{group.organizer.rating}</span>
                        </div>
                        <div>
                          {group.organizer.completedTreks} treks completed
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button
                        className="flex-1"
                        disabled={
                          group.status === "full" || group.status === "closed"
                        }
                        onClick={() => joinGroup(group.id)}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        {group.status === "full" ? "Full" : "Join Group"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedChatGroup(group.id);
                          setOpenChatDialog(true);
                        }}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Chat
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Expandable Details */}
                <div className="mt-4 pt-4 border-t">
                  <details className="group">
                    <summary className="cursor-pointer text-sm font-medium text-orange-600 hover:text-orange-700">
                      View Details & Requirements
                    </summary>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium mb-2">Included:</h4>
                        <ul className="space-y-1">
                          {group.included.map((item, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-green-500 rounded-full" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Requirements:</h4>
                        <ul className="space-y-1">
                          {group.requirements.map((item, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-orange-500 rounded-full" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className="font-medium">Meeting Point: </span>
                      <span>{group.meetingPoint}</span>
                    </div>
                  </details>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredGroups.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No trek groups found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or create a new group
            </p>
            <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your Group
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        )}

        {/* Chat Dialog */}
        <Dialog open={openChatDialog} onOpenChange={setOpenChatDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Group Chat</DialogTitle>
              <DialogDescription>
                Chat with members of group #{selectedChatGroup}
              </DialogDescription>
            </DialogHeader>
            <div className="py-8 text-center text-gray-500">
              <p>Chat feature coming soon!</p>
              <p className="text-sm mt-2">
                You'll be able to message with other group members here.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
