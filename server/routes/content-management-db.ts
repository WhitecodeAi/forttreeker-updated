import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  ContentSubmissionModel,
  GuideContactModel,
  FortInfoModel,
  AdditionalInfoModel,
  TrekEnquiryModel,
  FileUploadModel,
} from "../database/models.js";

const router = Router();

// Ensure upload directory exists
const uploadDir = "uploads/fort-images/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
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
router.post(
  "/submit-fort-info",
  upload.array("images", 5),
  async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      const imageFilenames = files ? files.map((file) => file.filename) : [];

      const fortData = {
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

      // Create content submission
      const submissionId = await ContentSubmissionModel.create({
        type: "fort-info",
        title: `${fortData.fortName} Information`,
        content: fortData,
        submitted_by: req.body.submittedBy || "Anonymous User",
        status: "pending",
      });

      // Create structured fort info record
      await FortInfoModel.create(submissionId, fortData);

      // Save file upload records
      if (files && files.length > 0) {
        for (const file of files) {
          await FileUploadModel.create(submissionId, {
            originalName: file.originalname,
            storedName: file.filename,
            filePath: file.path,
            fileSize: file.size,
            mimeType: file.mimetype,
          });
        }
      }

      res.json({
        success: true,
        message: "Fort information submitted successfully",
        data: { id: submissionId },
      });
    } catch (error) {
      console.error("Error submitting fort info:", error);
      res.status(500).json({
        success: false,
        message: "Failed to submit fort information",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);

// Submit guide contact
router.post("/submit-guide-contact", async (req, res) => {
  try {
    const guideData = {
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

    // Create content submission
    const submissionId = await ContentSubmissionModel.create({
      type: "guide-contact",
      title: `Guide Contact - ${guideData.guideName}`,
      content: guideData,
      submitted_by: req.body.submittedBy || guideData.guideName,
      status: "pending",
    });

    // Create structured guide contact record
    await GuideContactModel.create(submissionId, guideData);

    res.json({
      success: true,
      message: "Guide contact submitted successfully",
      data: { id: submissionId },
    });
  } catch (error) {
    console.error("Error submitting guide contact:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit guide contact",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Submit additional information
router.post("/submit-additional-info", async (req, res) => {
  try {
    const additionalData = {
      title: req.body.title,
      category: req.body.category,
      content: req.body.content,
      relatedFort: req.body.relatedFort,
    };

    // Create content submission
    const submissionId = await ContentSubmissionModel.create({
      type: "additional-info",
      title: additionalData.title,
      content: additionalData,
      submitted_by: req.body.submittedBy || "Anonymous User",
      status: "pending",
    });

    // Create structured additional info record
    await AdditionalInfoModel.create(submissionId, additionalData);

    res.json({
      success: true,
      message: "Additional information submitted successfully",
      data: { id: submissionId },
    });
  } catch (error) {
    console.error("Error submitting additional info:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit additional information",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Submit trek enquiry
router.post("/submit-trek-enquiry", async (req, res) => {
  try {
    const trekData = {
      fortName: req.body.fortName,
      preferredDate: req.body.preferredDate,
      numberOfPeople: req.body.numberOfPeople,
      duration: req.body.duration,
      customerName: req.body.customerName,
      phone: req.body.phone,
      email: req.body.email,
      specialRequests: req.body.specialRequests,
    };

    // Create content submission
    const submissionId = await ContentSubmissionModel.create({
      type: "trek-enquiry",
      title: `Trek Enquiry - ${trekData.fortName}`,
      content: trekData,
      submitted_by: trekData.customerName,
      status: "pending",
    });

    // Create structured trek enquiry record
    await TrekEnquiryModel.create(submissionId, trekData);

    // TODO: In a real application, you would also:
    // 1. Send email notification to admin
    // 2. Send SMS/email confirmation to customer
    // 3. Notify registered trek organizers

    res.json({
      success: true,
      message:
        "Trek enquiry submitted successfully. Our team will contact you soon.",
      data: { id: submissionId },
    });
  } catch (error) {
    console.error("Error submitting trek enquiry:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit trek enquiry",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get all content submissions (admin)
router.get("/admin/content-submissions", async (req, res) => {
  try {
    const { type, status, limit, offset } = req.query;

    const filters = {
      type: type as string,
      status: status as string,
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined,
    };

    const submissions = await ContentSubmissionModel.getAll(filters);

    res.json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch submissions",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get admin statistics
router.get("/admin/content-stats", async (req, res) => {
  try {
    const stats = await ContentSubmissionModel.getStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Update submission status (admin)
router.patch("/admin/content-submissions/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const submissionId = parseInt(id);
    if (isNaN(submissionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid submission ID",
      });
    }

    // Get the submission to check if it exists
    const submission = await ContentSubmissionModel.getById(submissionId);
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    // Update submission status
    const updated = await ContentSubmissionModel.updateStatus(
      submissionId,
      status,
      adminNotes,
      "admin",
    );

    if (!updated) {
      return res.status(500).json({
        success: false,
        message: "Failed to update submission status",
      });
    }

    // If approved, create the corresponding structured records
    if (status === "approved") {
      try {
        const content =
          typeof submission.content === "string"
            ? JSON.parse(submission.content)
            : submission.content;

        switch (submission.type) {
          case "fort-info":
            await FortInfoModel.create(submissionId, content);
            break;
          case "guide-contact":
            await GuideContactModel.create(submissionId, content);
            break;
          case "additional-info":
            await AdditionalInfoModel.create(submissionId, content);
            break;
          case "trek-enquiry":
            await TrekEnquiryModel.create(submissionId, content);
            break;
        }
      } catch (structuredError) {
        console.error("Error creating structured record:", structuredError);
        // Don't fail the status update if structured record creation fails
      }
    }

    res.json({
      success: true,
      message: `Submission ${status} successfully`,
      data: { id: submissionId, status },
    });
  } catch (error) {
    console.error("Error updating submission status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update submission status",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get approved guide contacts (public)
router.get("/approved-guides", async (req, res) => {
  try {
    const { search, limit } = req.query;

    const filters = {
      searchTerm: search as string,
      limit: limit ? parseInt(limit as string) : undefined,
    };

    const guides = await GuideContactModel.getApproved(filters);

    res.json({
      success: true,
      data: guides,
    });
  } catch (error) {
    console.error("Error fetching approved guides:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch guide contacts",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get approved additional information (public)
router.get("/approved-info", async (req, res) => {
  try {
    const { fort, category, limit } = req.query;

    const filters = {
      category: category as string,
      relatedFort: fort as string,
      limit: limit ? parseInt(limit as string) : undefined,
    };

    const info = await AdditionalInfoModel.getApproved(filters);

    res.json({
      success: true,
      data: info,
    });
  } catch (error) {
    console.error("Error fetching approved info:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch additional information",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get trek enquiries (for admin and trek organizers)
router.get("/trek-enquiries", async (req, res) => {
  try {
    const { status, fortName, limit } = req.query;

    const filters = {
      status: status as string,
      fortName: fortName as string,
      limit: limit ? parseInt(limit as string) : undefined,
    };

    const enquiries = await TrekEnquiryModel.getAll(filters);

    res.json({
      success: true,
      data: enquiries,
    });
  } catch (error) {
    console.error("Error fetching trek enquiries:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch trek enquiries",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Update trek enquiry status (for trek organizers)
router.patch("/trek-enquiries/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedTo, estimatedCost, notes } = req.body;

    const enquiryId = parseInt(id);
    if (isNaN(enquiryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid enquiry ID",
      });
    }

    const updated = await TrekEnquiryModel.updateStatus(
      enquiryId,
      status,
      assignedTo,
      estimatedCost ? parseFloat(estimatedCost) : undefined,
      notes,
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Trek enquiry not found",
      });
    }

    res.json({
      success: true,
      message: "Trek enquiry status updated successfully",
      data: { id: enquiryId, status },
    });
  } catch (error) {
    console.error("Error updating trek enquiry status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update trek enquiry status",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Mark additional info as helpful
router.post("/additional-info/:id/helpful", async (req, res) => {
  try {
    const { id } = req.params;

    const infoId = parseInt(id);
    if (isNaN(infoId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid info ID",
      });
    }

    const updated = await AdditionalInfoModel.incrementHelpfulCount(infoId);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Additional info not found",
      });
    }

    res.json({
      success: true,
      message: "Marked as helpful",
      data: { id: infoId },
    });
  } catch (error) {
    console.error("Error marking info as helpful:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark info as helpful",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get approved fort information (public)
router.get("/approved-forts", async (req, res) => {
  try {
    const { search, difficulty, limit } = req.query;

    const filters = {
      searchTerm: search as string,
      difficulty: difficulty as string,
      limit: limit ? parseInt(limit as string) : undefined,
    };

    const forts = await FortInfoModel.getApproved(filters);

    res.json({
      success: true,
      data: forts,
    });
  } catch (error) {
    console.error("Error fetching approved forts:", error);

    // If it's a connection error, return empty array instead of failing
    if (error.code === "ECONNREFUSED") {
      console.log("🔌 MySQL unavailable - returning empty approved forts list");
      res.json({
        success: true,
        data: [],
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch fort information",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Update approved fort (admin only)
router.put(
  "/approved-forts/:id",
  upload.array("images", 5),
  async (req, res) => {
    try {
      const { id } = req.params;
      const fortId = parseInt(id);

      if (isNaN(fortId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid fort ID",
        });
      }

      const files = req.files as Express.Multer.File[];
      const imageFilenames = files ? files.map((file) => file.filename) : [];

      const fortData = {
        fortName: req.body.fortName,
        location: req.body.location,
        description: req.body.description,
        difficulty: req.body.difficulty,
        duration: req.body.duration,
        bestTimeToVisit: req.body.bestTimeToVisit,
        entryFee: req.body.entryFee,
        facilities: req.body.facilities,
        safetyTips: req.body.safetyTips,
        newImages: imageFilenames,
      };

      const updated = await FortInfoModel.update(fortId, fortData);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Fort not found",
        });
      }

      // Save new file upload records if there are new images
      if (files && files.length > 0) {
        // Get the submission_id for this fort
        const fortInfo = await FortInfoModel.getById(fortId);
        if (fortInfo && fortInfo.submission_id) {
          for (const file of files) {
            await FileUploadModel.create(fortInfo.submission_id, {
              originalName: file.originalname,
              storedName: file.filename,
              filePath: file.path,
              fileSize: file.size,
              mimeType: file.mimetype,
            });
          }
        }
      }

      res.json({
        success: true,
        message: "Fort updated successfully",
        data: { id: fortId },
      });
    } catch (error) {
      console.error("Error updating fort:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update fort",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);

// Delete approved fort (admin only)
router.delete("/approved-forts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const fortId = parseInt(id);

    if (isNaN(fortId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid fort ID",
      });
    }

    const deleted = await FortInfoModel.delete(fortId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Fort not found",
      });
    }

    res.json({
      success: true,
      message: "Fort deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting fort:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete fort",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
