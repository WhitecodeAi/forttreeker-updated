
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { execSync } from 'child_process';

dotenv.config();

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "password",
    multipleStatements: true,
};

const dbName = process.env.DB_NAME || "forttracker";

async function resetDatabase() {
    let connection;
    try {
        console.log("🚀 Connecting to MySQL server for reset...");
        connection = await mysql.createConnection(dbConfig);

        // Check if we can just drop the database (local) or need to drop tables (shared)
        // For safety and compatibility with shared hosting, we'll try to drop tables.

        try {
            await connection.execute(`USE \`${dbName}\``);
            console.log(`✅ Selected database '${dbName}'`);

            console.log("🗑️  Dropping all tables...");
            // Disable FK checks to allow dropping tables in any order
            await connection.execute("SET FOREIGN_KEY_CHECKS = 0");

            // Get all tables
            const [tables] = await connection.execute("SHOW TABLES");

            if (tables.length > 0) {
                for (const row of tables) {
                    const tableName = Object.values(row)[0];
                    await connection.execute(`DROP TABLE IF EXISTS \`${tableName}\``);
                    console.log(`   Dropped table: ${tableName}`);
                }
            } else {
                console.log("   No tables found.");
            }

            await connection.execute("SET FOREIGN_KEY_CHECKS = 1");
            console.log("✅ All tables dropped.");

        } catch (err) {
            if (err.code === 'ER_BAD_DB_ERROR') {
                console.log(`ℹ️  Database '${dbName}' does not exist, nothing to reset.`);
            } else {
                throw err;
            }
        }

        console.log("🔄 Starting fresh setup...");

        try {
            execSync('node scripts/setup-database.js', { stdio: 'inherit' });
        } catch (e) {
            console.error("Setup script failed.");
            process.exit(1);
        }

    } catch (error) {
        console.error("❌ Reset failed:", error.message);
        process.exit(1);
    } finally {
        if (connection) await connection.end();
    }
}

resetDatabase();
