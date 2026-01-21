import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { handleDemo } from "./routes/demo";
import {
  getAllForts,
  getFortById,
  getFeaturedForts,
  getDistricts,
  getDifficulties,
  getFortsStats,
  getSearchSuggestions,
} from "./routes/forts";
import {
  getAllTrekPlans,
  getTrekPlanById,
  createTrekPlan,
  updateTrekPlan,
  deleteTrekPlan,
  duplicateTrekPlan,
  updateGearChecklist,
  getTrekPlanStats,
} from "./routes/trek-plans";
import {
  getTrekPlanPDFData,
  downloadTrekPlanPDF,
  getShareableURL,
} from "./routes/trek-plan-pdf";
import {
  getTransportRoutes,
  getAvailableVehicles,
  createRideBooking,
  getUserRideBookings,
  getRideBookingById,
  updateBookingStatus,
  getDriverBookings,
  getDriverNotifications,
  markNotificationRead,
  getAdminStats,
  driverLogin,
} from "./routes/ride-bookings";
import contentManagementRouter from "./routes/content-management-db";
import authRouter from "./routes/auth";
import reviewRouter from "./routes/reviews";
import adminContentRouter from "./routes/admin-content";
import { initializeDatabase } from "./database/connection";
import {
  runMigrations,
  seedSampleData,
  checkMigrationStatus,
} from "./database/mysql-migrations";

export async function createServer() {
  const app = express();

  // Initialize MySQL database
  try {
    console.log("🚀 Initializing MySQL database...");
    await initializeDatabase();

    const migrationExists = await checkMigrationStatus();
    if (!migrationExists) {
      console.log("📋 Running database migrations...");
      await runMigrations();
      console.log("🌱 Seeding sample data...");
      await seedSampleData();
    }

    console.log("✅ MySQL database initialized successfully");
  } catch (error) {
    console.error("❌ MySQL database initialization failed:", error);
    console.error(
      "⚠️  The application will start but database features will be unavailable",
    );
    console.error("📖 Please see README-MYSQL.md for setup instructions");
  }

  // Middleware
  app.use(cors({ credentials: true, origin: true }));
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check route
  app.get("/api/ping", (_req, res) => {
    res.json({
      message: "Hello from Express server v2!",
      database: "MySQL connection unavailable - using fallback data",
      timestamp: new Date().toISOString(),
    });
  });

  // Demo route
  app.get("/api/demo", handleDemo);

  // Fort routes
  app.get("/api/forts", getAllForts);
  app.get("/api/forts/featured", getFeaturedForts);
  app.get("/api/forts/districts", getDistricts);
  app.get("/api/forts/difficulties", getDifficulties);
  app.get("/api/forts/stats", getFortsStats);
  app.get("/api/forts/search/suggestions", getSearchSuggestions);
  app.get("/api/forts/:id", getFortById);

  // Trek plan routes
  app.get("/api/trek-plans", getAllTrekPlans);
  app.get("/api/trek-plans/stats", getTrekPlanStats);
  app.get("/api/trek-plans/:id", getTrekPlanById);
  app.post("/api/trek-plans", createTrekPlan);
  app.put("/api/trek-plans/:id", updateTrekPlan);
  app.delete("/api/trek-plans/:id", deleteTrekPlan);
  app.post("/api/trek-plans/:id/duplicate", duplicateTrekPlan);
  app.patch("/api/trek-plans/:id/gear", updateGearChecklist);

  // Trek plan PDF and sharing routes
  app.get("/api/trek-plans/:id/pdf-data", getTrekPlanPDFData);
  app.post("/api/trek-plans/:id/pdf-download", downloadTrekPlanPDF);
  app.get("/api/trek-plans/:id/share-url", getShareableURL);

  // Ride booking routes
  app.get("/api/ride-bookings/routes", getTransportRoutes);
  app.get("/api/ride-bookings/vehicles", getAvailableVehicles);
  app.post("/api/ride-bookings", createRideBooking);
  app.get("/api/ride-bookings", getUserRideBookings);
  app.get("/api/ride-bookings/:id", getRideBookingById);
  app.patch("/api/ride-bookings/:id/status", updateBookingStatus);
  app.post("/api/ride-bookings/driver/login", driverLogin);
  app.get("/api/ride-bookings/driver/:driverId", getDriverBookings);
  app.get(
    "/api/ride-bookings/driver/:driverId/notifications",
    getDriverNotifications,
  );
  app.patch("/api/ride-bookings/notifications/:id/read", markNotificationRead);
  app.get("/api/ride-bookings/admin/stats", getAdminStats);

  // Content management routes
  app.use("/api/content", contentManagementRouter);

  // Authentication routes
  app.use("/api/auth", authRouter);

  // Review routes
  app.use("/api/reviews", reviewRouter);

  // Admin content routes
  app.use("/api/admin", adminContentRouter);

  // Trek groups routes
  app.use("/api/trek-groups", adminContentRouter);

  // API fallback handler for unmatched routes
  app.use("/api/*", (req, res) => {
    console.log(`[API] Unmatched route: ${req.method} ${req.url}`);
    res.status(404).json({
      success: false,
      message: `API endpoint not found: ${req.method} ${req.url}`,
    });
  });

  // Global error handler for API routes
  app.use((err: any, req: any, res: any, next: any) => {
    if (req.url?.startsWith("/api")) {
      console.error(`[API Error] ${req.method} ${req.url}:`, err);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    } else {
      next(err);
    }
  });

  return app;
}
