export interface ContentSubmission {
  id: string;
  type: "fort-info" | "guide-contact" | "additional-info" | "trek-enquiry";
  title: string;
  content: any;
  submittedBy: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface FortInfoSubmission {
  fortName: string;
  location: string;
  description: string;
  difficulty: string;
  duration: string;
  bestTimeToVisit: string;
  entryFee: string;
  facilities: string;
  safetyTips: string;
  images?: string[];
}

export interface GuideContactSubmission {
  guideName: string;
  phone: string;
  email?: string;
  experience: string;
  specialization: string;
  languages: string;
  rate: string;
  availability: string;
  description: string;
}

export interface AdditionalInfoSubmission {
  title: string;
  category: string;
  content: string;
  relatedFort?: string;
}

export interface TrekEnquirySubmission {
  fortName: string;
  preferredDate: string;
  numberOfPeople: string;
  duration: string;
  customerName: string;
  phone: string;
  email: string;
  specialRequests?: string;
}

export interface AdminStats {
  totalSubmissions: number;
  pendingApproval: number;
  approvedContent: number;
  rejectedContent: number;
  trekEnquiries: number;
  guideContacts: number;
}

// Mock data for content submissions
export const contentSubmissions: ContentSubmission[] = [
  {
    id: "sub-1",
    type: "fort-info",
    title: "Rajgad Fort Information",
    content: {
      fortName: "Rajgad Fort",
      location: "Pune, Maharashtra",
      description:
        "Rajgad is a hill fort situated in the Pune district of Maharashtra, India. Formerly known as Murumdev, the fort was the capital of the Maratha Empire under the rule of Chhatrapati Shivaji Maharaj for almost 26 years.",
      difficulty: "moderate",
      duration: "5-6 hours",
      bestTimeToVisit: "October to March",
      entryFee: "Free",
      facilities:
        "Parking available at base village, basic food stalls, water points along the trail",
      safetyTips:
        "Carry enough water, wear proper trekking shoes, avoid during monsoon due to slippery rocks",
      images: [],
    },
    submittedBy: "Priya Sharma",
    submittedAt: "2024-01-15T10:30:00.000Z",
    status: "pending",
  },
  {
    id: "sub-2",
    type: "guide-contact",
    title: "Experienced Trek Guide - Anil Jadhav",
    content: {
      guideName: "Anil Jadhav",
      phone: "+91 9876543210",
      email: "anil.jadhav@example.com",
      experience: "8 years",
      specialization: "Sahyadri Range, Western Ghats",
      languages: "Marathi, Hindi, English",
      rate: "₹1500 per day",
      availability: "Weekends and holidays",
      description:
        "Certified trekking guide with extensive knowledge of Sahyadri forts. Specializes in historical storytelling and safe trekking practices.",
    },
    submittedBy: "Rajesh Kumar",
    submittedAt: "2024-01-14T15:45:00.000Z",
    status: "approved",
    adminNotes: "Verified credentials and experience",
    reviewedBy: "Admin",
    reviewedAt: "2024-01-15T09:00:00.000Z",
  },
  {
    id: "sub-3",
    type: "additional-info",
    title: "Best Photography Spots at Lohagad",
    content: {
      title: "Best Photography Spots at Lohagad",
      category: "travel-tip",
      content:
        "The top of Lohagad offers spectacular sunrise views. Best spots include the main citadel ruins, the cannon point, and the cliff edges overlooking the Sahyadri ranges. Early morning (5-7 AM) provides the best lighting conditions.",
      relatedFort: "Lohagad Fort",
    },
    submittedBy: "Sneha Photography",
    submittedAt: "2024-01-13T08:20:00.000Z",
    status: "pending",
  },
  {
    id: "sub-4",
    type: "trek-enquiry",
    title: "Trek Booking for Sinhagad Fort",
    content: {
      fortName: "Sinhagad Fort",
      preferredDate: "2024-02-15",
      numberOfPeople: "6",
      duration: "full-day",
      customerName: "Amit Patil",
      phone: "+91 9123456789",
      email: "amit.patil@example.com",
      specialRequests: "Need vegetarian meal arrangements and first aid kit",
    },
    submittedBy: "Amit Patil",
    submittedAt: "2024-01-12T14:30:00.000Z",
    status: "pending",
  },
  {
    id: "sub-5",
    type: "guide-contact",
    title: "Trek Organizer - Adventure Maharashtra",
    content: {
      guideName: "Suresh Bhosale (Adventure Maharashtra)",
      phone: "+91 9898989898",
      email: "contact@adventuremaharashtra.com",
      experience: "12 years",
      specialization: "Group treks, Corporate outings, Adventure activities",
      languages: "Marathi, Hindi, English, Gujarati",
      rate: "₹2000 per day (group rates available)",
      availability: "All days",
      description:
        "Professional trek organizing company with certified guides, safety equipment, and complete trek packages including meals and transportation.",
    },
    submittedBy: "Adventure Maharashtra",
    submittedAt: "2024-01-11T11:15:00.000Z",
    status: "approved",
    adminNotes: "Verified business registration and insurance",
    reviewedBy: "Admin",
    reviewedAt: "2024-01-12T10:00:00.000Z",
  },
];

export const getSubmissionById = (
  id: string,
): ContentSubmission | undefined => {
  return contentSubmissions.find((submission) => submission.id === id);
};

export const getSubmissionsByType = (
  type: ContentSubmission["type"],
): ContentSubmission[] => {
  return contentSubmissions.filter((submission) => submission.type === type);
};

export const getSubmissionsByStatus = (
  status: ContentSubmission["status"],
): ContentSubmission[] => {
  return contentSubmissions.filter(
    (submission) => submission.status === status,
  );
};

export const getAdminStats = (): AdminStats => {
  return {
    totalSubmissions: contentSubmissions.length,
    pendingApproval: contentSubmissions.filter((s) => s.status === "pending")
      .length,
    approvedContent: contentSubmissions.filter((s) => s.status === "approved")
      .length,
    rejectedContent: contentSubmissions.filter((s) => s.status === "rejected")
      .length,
    trekEnquiries: contentSubmissions.filter((s) => s.type === "trek-enquiry")
      .length,
    guideContacts: contentSubmissions.filter((s) => s.type === "guide-contact")
      .length,
  };
};

export const addContentSubmission = (
  submission: Omit<ContentSubmission, "id" | "submittedAt" | "status">,
): ContentSubmission => {
  const newSubmission: ContentSubmission = {
    ...submission,
    id: `sub-${Date.now()}`,
    submittedAt: new Date().toISOString(),
    status: "pending",
  };

  contentSubmissions.push(newSubmission);
  return newSubmission;
};

export const updateSubmissionStatus = (
  id: string,
  status: ContentSubmission["status"],
  adminNotes?: string,
  reviewedBy?: string,
): ContentSubmission | null => {
  const submission = contentSubmissions.find((s) => s.id === id);
  if (!submission) return null;

  submission.status = status;
  if (adminNotes) submission.adminNotes = adminNotes;
  if (reviewedBy) submission.reviewedBy = reviewedBy;
  submission.reviewedAt = new Date().toISOString();

  return submission;
};
