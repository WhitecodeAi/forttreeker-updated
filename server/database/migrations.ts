import { executeQuery, pool } from "./connection.js";

// Database schema creation
export async function runMigrations(): Promise<void> {
  console.log("🚀 Running database migrations...");

  try {
    // Create content_submissions table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS content_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type ENUM('fort-info', 'guide-contact', 'additional-info', 'trek-enquiry') NOT NULL,
        title VARCHAR(255) NOT NULL,
        content JSON NOT NULL,
        submitted_by VARCHAR(255) NOT NULL,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        admin_notes TEXT NULL,
        reviewed_by VARCHAR(255) NULL,
        reviewed_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_type (type),
        INDEX idx_status (status),
        INDEX idx_submitted_at (submitted_at),
        INDEX idx_type_status (type, status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create fort_info table for structured fort information
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS fort_info (
        id INT AUTO_INCREMENT PRIMARY KEY,
        submission_id INT,
        fort_name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        description TEXT,
        difficulty ENUM('easy', 'moderate', 'difficult', 'very-difficult'),
        duration VARCHAR(100),
        best_time_to_visit VARCHAR(255),
        entry_fee VARCHAR(100),
        facilities TEXT,
        safety_tips TEXT,
        images JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (submission_id) REFERENCES content_submissions(id) ON DELETE CASCADE,
        INDEX idx_fort_name (fort_name),
        INDEX idx_difficulty (difficulty),
        FULLTEXT KEY idx_search (fort_name, location, description)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create guide_contacts table for structured guide information
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS guide_contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        submission_id INT,
        guide_name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(255),
        experience VARCHAR(100),
        specialization TEXT,
        languages VARCHAR(255),
        rate VARCHAR(100),
        availability VARCHAR(255),
        description TEXT,
        rating DECIMAL(3,2) DEFAULT 0,
        total_reviews INT DEFAULT 0,
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (submission_id) REFERENCES content_submissions(id) ON DELETE CASCADE,
        INDEX idx_guide_name (guide_name),
        INDEX idx_is_verified (is_verified),
        FULLTEXT KEY idx_search (guide_name, specialization, description)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create additional_info table for structured additional information
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS additional_info (
        id INT AUTO_INCREMENT PRIMARY KEY,
        submission_id INT,
        title VARCHAR(255) NOT NULL,
        category ENUM('travel-tip', 'route-info', 'accommodation', 'food', 'transportation', 'safety', 'weather', 'other') NOT NULL,
        content TEXT NOT NULL,
        related_fort VARCHAR(255),
        helpful_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (submission_id) REFERENCES content_submissions(id) ON DELETE CASCADE,
        INDEX idx_category (category),
        INDEX idx_related_fort (related_fort),
        FULLTEXT KEY idx_search (title, content)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create trek_enquiries table for structured trek booking enquiries
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS trek_enquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        submission_id INT,
        fort_name VARCHAR(255) NOT NULL,
        preferred_date DATE NOT NULL,
        number_of_people INT NOT NULL,
        duration ENUM('half-day', 'full-day', 'overnight', 'multi-day'),
        customer_name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(255) NOT NULL,
        special_requests TEXT,
        enquiry_status ENUM('new', 'contacted', 'quoted', 'booked', 'completed', 'cancelled') DEFAULT 'new',
        assigned_to VARCHAR(255),
        estimated_cost DECIMAL(10,2),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (submission_id) REFERENCES content_submissions(id) ON DELETE CASCADE,
        INDEX idx_fort_name (fort_name),
        INDEX idx_preferred_date (preferred_date),
        INDEX idx_enquiry_status (enquiry_status),
        INDEX idx_customer_phone (phone)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create admin_users table for admin authentication
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255),
        role ENUM('admin', 'moderator') DEFAULT 'moderator',
        is_active BOOLEAN DEFAULT TRUE,
        last_login TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_username (username),
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create admin_activity_log table for tracking admin actions
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS admin_activity_log (
        id INT AUTO_INCREMENT PRIMARY KEY,
        admin_id INT,
        action ENUM('approve', 'reject', 'edit', 'delete', 'login', 'logout') NOT NULL,
        target_type ENUM('content_submission', 'fort_info', 'guide_contact', 'additional_info', 'trek_enquiry') NULL,
        target_id INT NULL,
        details JSON,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE SET NULL,
        INDEX idx_admin_id (admin_id),
        INDEX idx_action (action),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create file_uploads table for tracking uploaded files
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS file_uploads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        submission_id INT,
        original_name VARCHAR(255) NOT NULL,
        stored_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_size INT NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        upload_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (submission_id) REFERENCES content_submissions(id) ON DELETE CASCADE,
        INDEX idx_submission_id (submission_id),
        INDEX idx_stored_name (stored_name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Insert default admin user if not exists
    await executeQuery(`
      INSERT IGNORE INTO admin_users (username, email, password_hash, full_name, role)
      VALUES ('admin', 'admin@forttracker.com', '$2b$10$rGKqHILgNmj1lTfOHZG9OeLM.JQQ7WkGQNKNXpV8kY2yVqGKtH0N2', 'System Administrator', 'admin')
    `);

    // Create indexes for better performance
    await executeQuery(`
      CREATE INDEX IF NOT EXISTS idx_content_submissions_composite 
      ON content_submissions(type, status, submitted_at DESC)
    `);

    console.log("✅ Database migrations completed successfully");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

// Function to drop all tables (for development/testing)
export async function dropAllTables(): Promise<void> {
  console.log("🗑️ Dropping all tables...");

  const tables = [
    "admin_activity_log",
    "file_uploads",
    "trek_enquiries",
    "additional_info",
    "guide_contacts",
    "fort_info",
    "content_submissions",
    "admin_users",
  ];

  try {
    // Disable foreign key checks
    await executeQuery("SET FOREIGN_KEY_CHECKS = 0");

    for (const table of tables) {
      await executeQuery(`DROP TABLE IF EXISTS ${table}`);
      console.log(`✅ Dropped table: ${table}`);
    }

    // Re-enable foreign key checks
    await executeQuery("SET FOREIGN_KEY_CHECKS = 1");

    console.log("✅ All tables dropped successfully");
  } catch (error) {
    console.error("❌ Failed to drop tables:", error);
    throw error;
  }
}

// Function to check if migrations are needed
export async function checkMigrationStatus(): Promise<boolean> {
  try {
    const tables = await executeQuery(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'content_submissions'
    `);

    return tables.length > 0;
  } catch (error) {
    console.error("❌ Failed to check migration status:", error);
    return false;
  }
}

// Seed some sample data for development
export async function seedSampleData(): Promise<void> {
  console.log("🌱 Seeding sample data...");

  try {
    // Check if data already exists
    const existingData = await executeQuery(
      "SELECT COUNT(*) as count FROM content_submissions",
    );
    if (existingData[0].count > 0) {
      console.log("📊 Sample data already exists, skipping seed");
      return;
    }

    // Sample fort info submission
    const fortSubmissionResult = await executeQuery(
      `
      INSERT INTO content_submissions (type, title, content, submitted_by, status)
      VALUES (?, ?, ?, ?, ?)
    `,
      [
        "fort-info",
        "Rajgad Fort Information",
        JSON.stringify({
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
        }),
        "Priya Sharma",
        "approved",
      ],
    );

    // Sample guide contact submission
    await executeQuery(
      `
      INSERT INTO content_submissions (type, title, content, submitted_by, status, reviewed_by, reviewed_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `,
      [
        "guide-contact",
        "Experienced Trek Guide - Anil Jadhav",
        JSON.stringify({
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
        }),
        "Rajesh Kumar",
        "approved",
        "admin",
      ],
    );

    // Sample trek enquiry
    await executeQuery(
      `
      INSERT INTO content_submissions (type, title, content, submitted_by, status)
      VALUES (?, ?, ?, ?, ?)
    `,
      [
        "trek-enquiry",
        "Trek Booking for Sinhagad Fort",
        JSON.stringify({
          fortName: "Sinhagad Fort",
          preferredDate: "2024-02-15",
          numberOfPeople: "6",
          duration: "full-day",
          customerName: "Amit Patil",
          phone: "+91 9123456789",
          email: "amit.patil@example.com",
          specialRequests:
            "Need vegetarian meal arrangements and first aid kit",
        }),
        "Amit Patil",
        "pending",
      ],
    );

    console.log("✅ Sample data seeded successfully");
  } catch (error) {
    console.error("❌ Failed to seed sample data:", error);
    throw error;
  }
}
