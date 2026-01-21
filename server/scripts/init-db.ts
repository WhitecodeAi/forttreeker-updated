#!/usr/bin/env node

import {
  runMigrations,
  seedSampleData,
  checkMigrationStatus,
  testConnection,
  closeDatabase,
  initializeDatabase,
} from "../database/mysql-compatible-sqlite.js";

async function initDB() {
  console.log("🚀 Starting database initialization...\n");

  try {
    // Step 1: Initialize database (create database if needed)
    console.log("📊 Step 1: Initializing database...");
    await initializeDatabase();
    console.log("✅ Database initialized\n");

    // Step 2: Check if migrations are needed
    console.log("🔍 Step 2: Checking migration status...");
    const migrationExists = await checkMigrationStatus();

    if (!migrationExists) {
      console.log("📋 Running database migrations...");
      await runMigrations();
      console.log("✅ Migrations completed\n");

      // Step 3: Seed sample data
      console.log("🌱 Step 3: Seeding sample data...");
      await seedSampleData();
      console.log("✅ Sample data seeded\n");
    } else {
      console.log("✅ Database tables already exist, skipping migrations\n");
    }

    // Step 4: Test final connection
    console.log("🔗 Step 4: Testing database connection...");
    const connectionOk = await testConnection();

    if (connectionOk) {
      console.log("🎉 Database initialization completed successfully!");
      console.log("\n📝 Next steps:");
      console.log("   • Start your application server");
      console.log("   • Visit /admin to access the admin panel");
      console.log("   • Visit /contribute to submit content");
      console.log("\n💡 Database credentials:");
      console.log(`   • Host: ${process.env.DB_HOST || "localhost"}`);
      console.log(`   • Database: ${process.env.DB_NAME || "forttracker"}`);
      console.log(`   • User: ${process.env.DB_USER || "root"}`);
    } else {
      console.log("❌ Database connection test failed");
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    console.log("\n🔧 Troubleshooting tips:");
    console.log("   • Make sure MySQL server is running");
    console.log("   • Check your database credentials in .env file");
    console.log("   • Ensure the database user has proper permissions");
    console.log("   • Try connecting to MySQL manually first");
    process.exit(1);
  } finally {
    await closeDatabase();
  }
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
FortTracker Database Initialization Script

Usage:
  npm run init-db              Initialize database with sample data
  npm run init-db --help       Show this help message

Environment Variables:
  DB_HOST                      MySQL host (default: localhost)
  DB_PORT                      MySQL port (default: 3306)
  DB_USER                      MySQL username (default: root)
  DB_PASSWORD                  MySQL password (default: password)
  DB_NAME                      Database name (default: forttracker)

Example:
  DB_HOST=localhost DB_USER=myuser DB_PASSWORD=mypass npm run init-db
  `);
  process.exit(0);
}

// Run the initialization
initDB();
