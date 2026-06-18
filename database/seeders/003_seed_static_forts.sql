-- Seed Static Fort Data from forts.ts into database
-- This creates content submissions and fort_info records for all static forts

-- Insert static fort data as approved content submissions
INSERT INTO content_submissions (type, title, content, submitted_by, status, reviewed_by, reviewed_at) 
VALUES 
-- Sinhagad Fort (if not already exists)
('fort-info', 'Sinhagad Fort Complete Information', JSON_OBJECT(
    'fortName', 'Sinhagad Fort',
    'location', 'Near Pune, Maharashtra',
    'description', 'Sinhagad is a fortress located roughly 30 kilometres southwest of the city of Pune, India. Previously called Kondana, the fort has been the site of many important battles, most notably the Battle of Sinhagad in 1670.',
    'difficulty', 'easy',
    'duration', '3-4 hours',
    'bestTimeToVisit', 'October to March',
    'entryFee', 'Free',
    'facilities', 'Parking available, multiple food stalls, restrooms, water points',
    'safetyTips', 'Easy trek suitable for beginners, carry sufficient water, wear comfortable trekking shoes, avoid during heavy rains',
    'images', JSON_ARRAY()
), 'System Import', 'approved', 'admin', NOW()),

-- Rajgad Fort (if not already exists)
('fort-info', 'Rajgad Fort Complete Information', JSON_OBJECT(
    'fortName', 'Rajgad Fort',
    'location', 'Pune district, Maharashtra',
    'description', 'Rajgad is a hill fort situated in the Pune district of Maharashtra, India. Formerly known as Murumdev, the fort was the capital of the Maratha Empire under Chhatrapati Shivaji Maharaj for almost 26 years, after which the capital was moved to the Raigad Fort.',
    'difficulty', 'moderate',
    'duration', '5-6 hours',
    'bestTimeToVisit', 'October to March',
    'entryFee', 'Free',
    'facilities', 'Basic parking at base village, few food stalls, water points along trail',
    'safetyTips', 'Moderate trek requiring good fitness, carry enough water and food, wear proper trekking shoes, start early to avoid afternoon heat',
    'images', JSON_ARRAY()
), 'System Import', 'approved', 'admin', NOW()),

-- Lohagad Fort
('fort-info', 'Lohagad Fort Complete Information', JSON_OBJECT(
    'fortName', 'Lohagad Fort',
    'location', 'Lonavala, Maharashtra',
    'description', 'Lohagad is one of the many hill forts of Maharashtra state in India. Situated close to the hill station Lonavala and 52 km northwest of Pune, Lohagad rises to an elevation of 1,033 m above sea level. The fort is connected to the neighboring Visapur fort by a small range.',
    'difficulty', 'easy',
    'duration', '2-3 hours',
    'bestTimeToVisit', 'October to March',
    'entryFee', 'Free',
    'facilities', 'Parking available, food stalls, scenic viewpoints, photography spots',
    'safetyTips', 'Easy trek suitable for families, beautiful during monsoon but trails can be slippery, carry water and light snacks',
    'images', JSON_ARRAY()
), 'System Import', 'approved', 'admin', NOW()),

-- Torna Fort
('fort-info', 'Torna Fort Complete Information', JSON_OBJECT(
    'fortName', 'Torna Fort',
    'location', 'Pune district, Maharashtra',
    'description', 'Torna Fort, also known as Prachandagad, is a large fort located in Pune district, in the Indian state of Maharashtra. It is historically significant as the first fort captured by Maratha king Chhatrapati Shivaji in 1646, at the age of 16, making it the nucleus of the Maratha Empire.',
    'difficulty', 'moderate',
    'duration', '4-5 hours',
    'bestTimeToVisit', 'October to March',
    'entryFee', 'Free',
    'facilities', 'Limited parking, basic food stalls at base, water sources on route',
    'safetyTips', 'Moderately difficult trek, carry adequate water and food, start early, inform someone about your trek plan',
    'images', JSON_ARRAY()
), 'System Import', 'approved', 'admin', NOW()),

-- Visapur Fort
('fort-info', 'Visapur Fort Complete Information', JSON_OBJECT(
    'fortName', 'Visapur Fort',
    'location', 'Lonavala, Maharashtra',
    'description', 'Visapur Fort is a hill fort near Lonavala, Maharashtra, India. The fort is at an elevation of 1084 meters above sea level. The fort can be accessed by a hike from the village of Visapur. It is located near Lohagad fort and both can be visited together.',
    'difficulty', 'moderate',
    'duration', '3-4 hours',
    'bestTimeToVisit', 'October to March',
    'entryFee', 'Free',
    'facilities', 'Basic parking, limited food options, scenic views',
    'safetyTips', 'Moderate trek, can be combined with Lohagad, carry enough water, wear good trekking shoes',
    'images', JSON_ARRAY()
), 'System Import', 'approved', 'admin', NOW()),

-- Harishchandragad Fort
('fort-info', 'Harishchandragad Fort Complete Information', JSON_OBJECT(
    'fortName', 'Harishchandragad Fort',
    'location', 'Ahmednagar district, Maharashtra',
    'description', 'Harishchandragad is a hill fort in the Ahmednagar district of Maharashtra, India. Its history is linked with that of Malshej Ghat, and it has played a major role in guarding and controlling the trade route passing through the ghat. The fort is famous for the Konkan Kada, a cliff which looks like a cobra hood.',
    'difficulty', 'difficult',
    'duration', '6-8 hours',
    'bestTimeToVisit', 'October to March',
    'entryFee', 'Free',
    'facilities', 'Very basic facilities, need to carry everything, camping possible',
    'safetyTips', 'Difficult trek requiring good fitness and experience, carry sufficient food and water, avoid during monsoon, inform authorities about night stays',
    'images', JSON_ARRAY()
), 'System Import', 'approved', 'admin', NOW()),

-- Raigad Fort
('fort-info', 'Raigad Fort Complete Information', JSON_OBJECT(
    'fortName', 'Raigad Fort',
    'location', 'Raigad district, Maharashtra',
    'description', 'Raigad is a hill fort situated in Mahad, Raigad district of Maharashtra, India. The Raigad Fort was seized by Chhatrapati Shivaji and made it his capital in 1674 when he was crowned King of the Marathas. The fort, which rises 820 metres above sea level, is located in the Sahyadri mountain range.',
    'difficulty', 'moderate',
    'duration', '4-5 hours',
    'bestTimeToVisit', 'October to March',
    'entryFee', 'Ropeway charges apply',
    'facilities', 'Ropeway available, food stalls, parking, museum, accommodation options',
    'safetyTips', 'Can use ropeway or trek, historically significant, carry water, respect the monuments',
    'images', JSON_ARRAY()
), 'System Import', 'approved', 'admin', NOW()),

-- Pratapgad Fort
('fort-info', 'Pratapgad Fort Complete Information', JSON_OBJECT(
    'fortName', 'Pratapgad Fort',
    'location', 'Satara district, Maharashtra',
    'description', 'Pratapgad is a large fort located in Satara district, in the state of Maharashtra in India. The fort, which rises 1080 metres above sea level, was built in 1656 by order of Chhatrapati Shivaji. It is the site of the famous Battle of Pratapgad.',
    'difficulty', 'moderate',
    'duration', '3-4 hours',
    'bestTimeToVisit', 'October to March',
    'entryFee', 'Nominal entry fee',
    'facilities', 'Good parking, food stalls, restrooms, museum, accommodation',
    'safetyTips', 'Well-maintained fort, suitable for families, carry water, explore the museum for historical insights',
    'images', JSON_ARRAY()
), 'System Import', 'approved', 'admin', NOW()),

-- Tikona Fort
('fort-info', 'Tikona Fort Complete Information', JSON_OBJECT(
    'fortName', 'Tikona Fort',
    'location', 'Pune district, Maharashtra',
    'description', 'Tikona Fort is a hill fort located near Lonavala in Maharashtra, India. The name Tikona means triangle in Marathi, and true to its name, the fort is triangular in shape. The fort rises to an elevation of 1,062 meters above sea level.',
    'difficulty', 'easy',
    'duration', '2-3 hours',
    'bestTimeToVisit', 'October to March',
    'entryFee', 'Free',
    'facilities', 'Basic parking, few food stalls, water points',
    'safetyTips', 'Easy triangular shaped fort, good for beginners, carry water, beautiful views from top',
    'images', JSON_ARRAY()
), 'System Import', 'approved', 'admin', NOW()),

-- Korigad Fort
('fort-info', 'Korigad Fort Complete Information', JSON_OBJECT(
    'fortName', 'Korigad Fort',
    'location', 'Lonavala, Maharashtra',
    'description', 'Korigad, also called Koraigad, is a hill fort located about 20 km south of Lonavala. The name Korigad comes from the Koli tribes. The fort was an important outpost during the rule of Chhatrapati Shivaji. It offers beautiful views of Aamby Valley.',
    'difficulty', 'easy',
    'duration', '2-3 hours',
    'bestTimeToVisit', 'October to March',
    'entryFee', 'Free',
    'facilities', 'Limited parking, basic facilities, scenic views',
    'safetyTips', 'Easy trek, good for beginners, offers views of Aamby Valley, carry enough water',
    'images', JSON_ARRAY()
), 'System Import', 'approved', 'admin', NOW());

-- Insert fort_info records for all new submissions
INSERT INTO fort_info (submission_id, fort_name, location, description, difficulty, duration, best_time_to_visit, entry_fee, facilities, safety_tips, images)
SELECT 
    cs.id,
    JSON_UNQUOTE(JSON_EXTRACT(cs.content, '$.fortName')),
    JSON_UNQUOTE(JSON_EXTRACT(cs.content, '$.location')),
    JSON_UNQUOTE(JSON_EXTRACT(cs.content, '$.description')),
    JSON_UNQUOTE(JSON_EXTRACT(cs.content, '$.difficulty')),
    JSON_UNQUOTE(JSON_EXTRACT(cs.content, '$.duration')),
    JSON_UNQUOTE(JSON_EXTRACT(cs.content, '$.bestTimeToVisit')),
    JSON_UNQUOTE(JSON_EXTRACT(cs.content, '$.entryFee')),
    JSON_UNQUOTE(JSON_EXTRACT(cs.content, '$.facilities')),
    JSON_UNQUOTE(JSON_EXTRACT(cs.content, '$.safetyTips')),
    JSON_EXTRACT(cs.content, '$.images')
FROM content_submissions cs 
LEFT JOIN fort_info fi ON JSON_UNQUOTE(JSON_EXTRACT(cs.content, '$.fortName')) = fi.fort_name
WHERE cs.type = 'fort-info' 
  AND cs.status = 'approved' 
  AND cs.submitted_by = 'System Import'
  AND fi.fort_name IS NULL; -- Only insert if not already exists

COMMIT;
