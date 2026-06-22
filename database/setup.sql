-- Complete Fort Tracker Database Setup
-- Run this script to set up the entire database with sample data

-- Source all migration and seeder files
SOURCE database/migrations/001_create_tables.sql;
SOURCE database/migrations/002_add_dynamic_content.sql;
SOURCE database/seeders/002_seed_users.sql;
SOURCE database/seeders/003_seed_static_forts.sql;
SOURCE database/seeders/004_seed_trek_groups.sql;

-- Verify the setup

-- Show table counts
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'content_submissions', COUNT(*) FROM content_submissions
UNION ALL
SELECT 'fort_info', COUNT(*) FROM fort_info
UNION ALL
SELECT 'guide_contacts', COUNT(*) FROM guide_contacts
UNION ALL
SELECT 'fort_reviews', COUNT(*) FROM fort_reviews
UNION ALL
SELECT 'additional_info', COUNT(*) FROM additional_info;

-- Show sample data
SELECT 'Sample Users:' as info;
SELECT id, email, full_name, role FROM users;

SELECT 'Sample Forts:' as info;
SELECT id, fort_name, location, difficulty, duration FROM fort_info LIMIT 5;

SELECT 'Sample Reviews:' as info;
SELECT id, fort_name, rating, review_text FROM fort_reviews LIMIT 3;

SELECT 'Database setup completed successfully!' as status;
