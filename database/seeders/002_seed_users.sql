-- Seed Users and Admin Data
USE forttracker;

-- Insert default admin user
-- Password is 'admin123' hashed with bcrypt
INSERT INTO users (email, password_hash, full_name, role, is_active, email_verified) 
VALUES 
('admin@forttracker.com', '$2b$10$rGKqHILgNmj1lTfOHZG9OeLM.JQQ7WkGQNKNXpV8kY2yVqGKtH0N2', 'System Administrator', 'admin', TRUE, TRUE),
('demo@forttracker.com', '$2b$10$rGKqHILgNmj1lTfOHZG9OeLM.JQQ7WkGQNKNXpV8kY2yVqGKtH0N2', 'Demo User', 'user', TRUE, TRUE);

-- Insert sample content submissions for approved forts
INSERT INTO content_submissions (type, title, content, submitted_by, status, reviewed_by, reviewed_at) 
VALUES 
('fort-info', 'Rajgad Fort Information', JSON_OBJECT(
    'fortName', 'Rajgad Fort',
    'location', 'Pune, Maharashtra',
    'description', 'Rajgad is a hill fort situated in the Pune district of Maharashtra, India. Formerly known as Murumdev, the fort was the capital of the Maratha Empire under the rule of Chhatrapati Shivaji Maharaj for almost 26 years.',
    'difficulty', 'moderate',
    'duration', '5-6 hours',
    'bestTimeToVisit', 'October to March',
    'entryFee', 'Free',
    'facilities', 'Parking available at base village, basic food stalls, water points along the trail',
    'safetyTips', 'Carry enough water, wear proper trekking shoes, avoid during monsoon due to slippery rocks',
    'images', JSON_ARRAY()
), 'Priya Sharma', 'approved', 'admin', NOW()),

('fort-info', 'Sinhagad Fort Information', JSON_OBJECT(
    'fortName', 'Sinhagad Fort',
    'location', 'Pune, Maharashtra',
    'description', 'Sinhagad is a fortress located roughly 30 kilometres southwest of the city of Pune, India. Previously called Kondana, the fort has been the site of many important battles.',
    'difficulty', 'easy',
    'duration', '3-4 hours',
    'bestTimeToVisit', 'October to March',
    'entryFee', 'Free',
    'facilities', 'Parking, food stalls, water points, restrooms',
    'safetyTips', 'Easy trek suitable for beginners, carry water, wear comfortable shoes',
    'images', JSON_ARRAY()
), 'Rahul Patil', 'approved', 'admin', NOW()),

('fort-info', 'Lohagad Fort Information', JSON_OBJECT(
    'fortName', 'Lohagad Fort',
    'location', 'Lonavala, Maharashtra',
    'description', 'Lohagad is one of the many hill forts of Maharashtra state in India. Situated close to the hill station Lonavala and 52 km northwest of Pune, Lohagad rises to an elevation of 1,033 m above sea level.',
    'difficulty', 'easy',
    'duration', '2-3 hours',
    'bestTimeToVisit', 'October to March',
    'entryFee', 'Free',
    'facilities', 'Parking, basic food stalls, scenic viewpoints',
    'safetyTips', 'Easy trek, beautiful during monsoon but can be slippery, carry raincoat during rains',
    'images', JSON_ARRAY()
), 'Amit Kumar', 'approved', 'admin', NOW());

-- Insert fort information records
INSERT INTO fort_info (submission_id, fort_name, location, description, difficulty, duration, best_time_to_visit, entry_fee, facilities, safety_tips, images)
SELECT 
    id,
    JSON_UNQUOTE(JSON_EXTRACT(content, '$.fortName')),
    JSON_UNQUOTE(JSON_EXTRACT(content, '$.location')),
    JSON_UNQUOTE(JSON_EXTRACT(content, '$.description')),
    JSON_UNQUOTE(JSON_EXTRACT(content, '$.difficulty')),
    JSON_UNQUOTE(JSON_EXTRACT(content, '$.duration')),
    JSON_UNQUOTE(JSON_EXTRACT(content, '$.bestTimeToVisit')),
    JSON_UNQUOTE(JSON_EXTRACT(content, '$.entryFee')),
    JSON_UNQUOTE(JSON_EXTRACT(content, '$.facilities')),
    JSON_UNQUOTE(JSON_EXTRACT(content, '$.safetyTips')),
    JSON_EXTRACT(content, '$.images')
FROM content_submissions 
WHERE type = 'fort-info' AND status = 'approved';

-- Insert sample guide contacts
INSERT INTO content_submissions (type, title, content, submitted_by, status, reviewed_by, reviewed_at) 
VALUES 
('guide-contact', 'Experienced Trek Guide - Anil Jadhav', JSON_OBJECT(
    'guideName', 'Anil Jadhav',
    'phone', '+91 9876543210',
    'email', 'anil.jadhav@example.com',
    'experience', '8 years',
    'specialization', 'Sahyadri Range, Western Ghats',
    'languages', 'Marathi, Hindi, English',
    'rate', '₹1500 per day',
    'availability', 'Weekends and holidays',
    'description', 'Certified trekking guide with extensive knowledge of Sahyadri forts. Specializes in historical storytelling and safe trekking practices.'
), 'Rajesh Kumar', 'approved', 'admin', NOW()),

('guide-contact', 'Professional Trek Guide - Sunita Desai', JSON_OBJECT(
    'guideName', 'Sunita Desai',
    'phone', '+91 9823456789',
    'email', 'sunita.desai@example.com',
    'experience', '5 years',
    'specialization', 'Pune District Forts, Night Treks',
    'languages', 'Marathi, Hindi, English',
    'rate', '₹1200 per day',
    'availability', 'All days',
    'description', 'Experienced female trek guide specializing in Pune district forts. Expert in night treks and photography tours.'
), 'Priya Sharma', 'approved', 'admin', NOW());

-- Insert guide contact records
INSERT INTO guide_contacts (submission_id, guide_name, phone, email, experience, specialization, languages, rate, availability, description, is_verified)
SELECT 
    id,
    JSON_UNQUOTE(JSON_EXTRACT(content, '$.guideName')),
    JSON_UNQUOTE(JSON_EXTRACT(content, '$.phone')),
    JSON_UNQUOTE(JSON_EXTRACT(content, '$.email')),
    JSON_UNQUOTE(JSON_EXTRACT(content, '$.experience')),
    JSON_UNQUOTE(JSON_EXTRACT(content, '$.specialization')),
    JSON_UNQUOTE(JSON_EXTRACT(content, '$.languages')),
    JSON_UNQUOTE(JSON_EXTRACT(content, '$.rate')),
    JSON_UNQUOTE(JSON_EXTRACT(content, '$.availability')),
    JSON_UNQUOTE(JSON_EXTRACT(content, '$.description')),
    TRUE
FROM content_submissions 
WHERE type = 'guide-contact' AND status = 'approved';

-- Insert sample reviews
INSERT INTO fort_reviews (user_id, fort_name, rating, review_text, photos, visit_date, is_approved)
VALUES
(2, 'Sinhagad Fort', 5, 'Amazing trek! Perfect for beginners and the views are breathtaking. The food at the top is also great.', JSON_ARRAY(), '2024-01-15', TRUE),
(2, 'Rajgad Fort', 4, 'Challenging but rewarding trek. The historical significance makes it even more special. Highly recommended for history enthusiasts.', JSON_ARRAY(), '2024-01-20', TRUE),
(NULL, 'Lohagad Fort', 5, 'Beautiful fort especially during monsoon. Easy trek with stunning views. Great for family outings.', JSON_ARRAY(), '2024-01-25', TRUE);

-- Insert sample additional info
INSERT INTO content_submissions (type, title, content, submitted_by, status, reviewed_by, reviewed_at) 
VALUES 
('additional-info', 'Best Time to Visit Western Ghats Forts', JSON_OBJECT(
    'title', 'Best Time to Visit Western Ghats Forts',
    'category', 'travel-tip',
    'content', 'The best time to visit forts in the Western Ghats is from October to March when the weather is pleasant and dry. Avoid monsoon season (June-September) unless you are an experienced trekker, as trails can be slippery and dangerous.',
    'relatedFort', 'All Western Ghats Forts'
), 'Travel Expert', 'approved', 'admin', NOW()),

('additional-info', 'Essential Trekking Gear Checklist', JSON_OBJECT(
    'title', 'Essential Trekking Gear Checklist',
    'category', 'safety',
    'content', 'Essential items: 1) Comfortable trekking shoes with good grip, 2) Minimum 2 liters of water per person, 3) Energy snacks and fruits, 4) First aid kit, 5) Headlamp or flashlight, 6) Rain protection during monsoon, 7) Power bank for emergency, 8) Whistle for emergency signaling.',
    'relatedFort', 'All Forts'
), 'Safety Guide', 'approved', 'admin', NOW());

-- Insert additional info records
INSERT INTO additional_info (submission_id, title, category, content, related_fort)
SELECT 
    id,
    JSON_UNQUOTE(JSON_EXTRACT(content, '$.title')),
    JSON_UNQUOTE(JSON_EXTRACT(content, '$.category')),
    JSON_UNQUOTE(JSON_EXTRACT(content, '$.content')),
    JSON_UNQUOTE(JSON_EXTRACT(content, '$.relatedFort'))
FROM content_submissions 
WHERE type = 'additional-info' AND status = 'approved';

COMMIT;
