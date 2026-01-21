import { Router } from "express";
import multer from "multer";
import path from "path";
import {
  contentSubmissions,
  addContentSubmission,
  updateSubmissionStatus,
  getAdminStats,
  ContentSubmission,
  FortInfoSubmission,
  GuideContactSubmission,
  AdditionalInfoSubmission,
  TrekEnquirySubmission,
} from "../data/content-submissions.js";

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/fort-images/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Submit fort information
router.post("/submit-fort-info", upload.array("images", 5), (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    const imageFilenames = files ? files.map((file) => file.filename) : [];

    const fortInfo: FortInfoSubmission = {
      fortName: req.body.fortName,
      location: req.body.location,
      description: req.body.description,
      difficulty: req.body.difficulty,
      duration: req.body.duration,
      bestTimeToVisit: req.body.bestTimeToVisit,
      entryFee: req.body.entryFee,
      facilities: req.body.facilities,
      safetyTips: req.body.safetyTips,
      images: imageFilenames,
    };

    const submission = addContentSubmission({
      type: "fort-info",
      title: `${fortInfo.fortName} Information`,
      content: fortInfo,
      submittedBy: req.body.submittedBy || "Anonymous User",
    });

    res.json({
      success: true,
      message: "Fort information submitted successfully",
      data: submission,
    });
  } catch (error) {
    console.error("Error submitting fort info:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit fort information",
    });
  }
});

// Submit guide contact
router.post("/submit-guide-contact", (req, res) => {
  try {
    const guideInfo: GuideContactSubmission = {
      guideName: req.body.guideName,
      phone: req.body.phone,
      email: req.body.email,
      experience: req.body.experience,
      specialization: req.body.specialization,
      languages: req.body.languages,
      rate: req.body.rate,
      availability: req.body.availability,
      description: req.body.description,
    };

    const submission = addContentSubmission({
      type: "guide-contact",
      title: `Guide Contact - ${guideInfo.guideName}`,
      content: guideInfo,
      submittedBy: req.body.submittedBy || guideInfo.guideName,
    });

    res.json({
      success: true,
      message: "Guide contact submitted successfully",
      data: submission,
    });
  } catch (error) {
    console.error("Error submitting guide contact:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit guide contact",
    });
  }
});

// Submit additional information
router.post("/submit-additional-info", (req, res) => {
  try {
    const additionalInfo: AdditionalInfoSubmission = {
      title: req.body.title,
      category: req.body.category,
      content: req.body.content,
      relatedFort: req.body.relatedFort,
    };

    const submission = addContentSubmission({
      type: "additional-info",
      title: additionalInfo.title,
      content: additionalInfo,
      submittedBy: req.body.submittedBy || "Anonymous User",
    });

    res.json({
      success: true,
      message: "Additional information submitted successfully",
      data: submission,
    });
  } catch (error) {
    console.error("Error submitting additional info:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit additional information",
    });
  }
});

// Submit trek enquiry
router.post("/submit-trek-enquiry", (req, res) => {
  try {
    const trekEnquiry: TrekEnquirySubmission = {
      fortName: req.body.fortName,
      preferredDate: req.body.preferredDate,
      numberOfPeople: req.body.numberOfPeople,
      duration: req.body.duration,
      customerName: req.body.customerName,
      phone: req.body.phone,
      email: req.body.email,
      specialRequests: req.body.specialRequests,
    };

    const submission = addContentSubmission({
      type: "trek-enquiry",
      title: `Trek Enquiry - ${trekEnquiry.fortName}`,
      content: trekEnquiry,
      submittedBy: trekEnquiry.customerName,
    });

    // In a real application, you would also:
    // 1. Send email notification to admin
    // 2. Send SMS/email confirmation to customer
    // 3. Notify registered trek organizers

    res.json({
      success: true,
      message:
        "Trek enquiry submitted successfully. Our team will contact you soon.",
      data: submission,
    });
  } catch (error) {
    console.error("Error submitting trek enquiry:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit trek enquiry",
    });
  }
});

// Get all content submissions (admin)
router.get("/admin/content-submissions", (req, res) => {
  try {
    res.json({
      success: true,
      data: contentSubmissions,
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch submissions",
    });
  }
});

// Get admin statistics
router.get("/admin/content-stats", (req, res) => {
  try {
    const stats = getAdminStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
    });
  }
});

// Update submission status (admin)
router.patch("/admin/content-submissions/:id/status", (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const updatedSubmission = updateSubmissionStatus(
      id,
      status,
      adminNotes,
      "Admin",
    );

    if (!updatedSubmission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    res.json({
      success: true,
      message: `Submission ${status} successfully`,
      data: updatedSubmission,
    });
  } catch (error) {
    console.error("Error updating submission status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update submission status",
    });
  }
});

// Get approved guide contacts (public)
router.get("/approved-guides", (req, res) => {
  try {
    const approvedGuides = contentSubmissions
      .filter((s) => s.type === "guide-contact" && s.status === "approved")
      .map((s) => ({
        id: s.id,
        ...s.content,
        submittedAt: s.submittedAt,
      }));

    res.json({
      success: true,
      data: approvedGuides,
    });
  } catch (error) {
    console.error("Error fetching approved guides:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch guide contacts",
    });
  }
});

// Get approved additional information (public)
router.get("/approved-info", (req, res) => {
  try {
    const { fort, category } = req.query;

    let approvedInfo = contentSubmissions.filter(
      (s) => s.type === "additional-info" && s.status === "approved",
    );

    if (fort) {
      approvedInfo = approvedInfo.filter((s) =>
        s.content.relatedFort
          ?.toLowerCase()
          .includes((fort as string).toLowerCase()),
      );
    }

    if (category) {
      approvedInfo = approvedInfo.filter(
        (s) => s.content.category === category,
      );
    }

    const formattedInfo = approvedInfo.map((s) => ({
      id: s.id,
      title: s.title,
      ...s.content,
      submittedAt: s.submittedAt,
      submittedBy: s.submittedBy,
    }));

    res.json({
      success: true,
      data: formattedInfo,
    });
  } catch (error) {
    console.error("Error fetching approved info:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch additional information",
    });
  }
});

// Get pending trek enquiries (for trek organizers)
router.get("/trek-enquiries", (req, res) => {
  try {
    const { status = "pending" } = req.query;

    const enquiries = contentSubmissions
      .filter((s) => s.type === "trek-enquiry" && s.status === status)
      .map((s) => ({
        id: s.id,
        ...s.content,
        submittedAt: s.submittedAt,
        status: s.status,
      }));

    res.json({
      success: true,
      data: enquiries,
    });
  } catch (error) {
    console.error("Error fetching trek enquiries:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch trek enquiries",
    });
  }
});

export default router;
