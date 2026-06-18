
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

async function updateSchema() {
    console.log("🔍 Connecting to database to update schema...");

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log("✅ Connected!");

        // 1. site_content
        console.log("🔨 Creating/Checking site_content table...");
        await connection.execute(`
      CREATE TABLE IF NOT EXISTS site_content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type ENUM('footer', 'page', 'announcement', 'feature') NOT NULL,
        slug VARCHAR(255) NULL,
        content JSON NOT NULL,
        is_published BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX idx_type (type),
        INDEX idx_slug (slug),
        INDEX idx_is_published (is_published),
        UNIQUE KEY unique_type_slug (type, slug)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

        // 2. trek_groups
        console.log("🔨 Creating/Checking trek_groups table...");
        await connection.execute(`
      CREATE TABLE IF NOT EXISTS trek_groups (
        id INT AUTO_INCREMENT PRIMARY KEY,
        organizer_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        fort_name VARCHAR(255) NOT NULL,
        trek_date DATE NOT NULL,
        duration VARCHAR(50) NOT NULL,
        difficulty ENUM('Easy', 'Moderate', 'Difficult', 'Expert') NOT NULL,
        max_participants INT NOT NULL,
        current_participants INT DEFAULT 0,
        meeting_point VARCHAR(255) NOT NULL,
        cost DECIMAL(10,2) NOT NULL,
        content JSON,
        status ENUM('open', 'full', 'closed', 'cancelled') DEFAULT 'open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_organizer (organizer_id),
        INDEX idx_fort_name (fort_name),
        INDEX idx_trek_date (trek_date),
        INDEX idx_difficulty (difficulty),
        INDEX idx_status (status),
        FULLTEXT KEY idx_search (title, description, fort_name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

        // 3. trek_group_participants
        console.log("🔨 Creating/Checking trek_group_participants table...");
        await connection.execute(`
      CREATE TABLE IF NOT EXISTS trek_group_participants (
        id INT AUTO_INCREMENT PRIMARY KEY,
        group_id INT NOT NULL,
        user_id INT NOT NULL,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status ENUM('joined', 'confirmed', 'cancelled') DEFAULT 'joined',
        
        FOREIGN KEY (group_id) REFERENCES trek_groups(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_group_user (group_id, user_id),
        INDEX idx_group_id (group_id),
        INDEX idx_user_id (user_id),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

        // 4. Default footer content
        console.log("📝 Checking default footer content...");
        const [rows] = await connection.execute("SELECT id FROM site_content WHERE type = 'footer'");
        if (rows.length === 0) {
            console.log("➕ Inserting default footer content...");
            await connection.execute(`
        INSERT INTO site_content (type, content) VALUES
        ('footer', ?)
        `, [JSON.stringify({
                aboutText: 'NomadTrekkers helps you discover and explore the magnificent forts of Maharashtra. Plan your treks, read reviews, and connect with fellow trekkers for unforgettable adventures.',
                contactEmail: 'contact@nomadtrekkers.org',
                contactPhone: '+91 9876543210',
                address: 'Pune, Maharashtra, India',
                socialLinks: {
                    facebook: 'https://www.facebook.com/NomadTrekkers/',
                    twitter: 'https://twitter.com/nomadtrekkers',
                    instagram: 'https://instagram.com/nomadtrekkers',
                    youtube: 'https://youtube.com/nomadtrekkers'
                },
                quickLinks: [
                    { name: 'About Us', url: '/about' },
                    { name: 'All Forts', url: '/forts' },
                    { name: 'Trek Planner', url: '/trek-planner' },
                    { name: 'Find Groups', url: '/trek-groups' },
                    { name: 'Guides', url: '/guides' },
                    { name: 'Contact', url: '/contact' }
                ]
            })]);
        } else {
            console.log("✅ Footer content already exists.");
        }

        console.log("✅ Schema update completed successfully.");

    } catch (error) {
        console.error("❌ Error updating schema:", error);
    } finally {
        if (connection) await connection.end();
    }
}

updateSchema();
