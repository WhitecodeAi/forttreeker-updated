-- Seed Sample Trek Groups Data
USE forttracker;

-- Insert sample trek groups (using demo user as organizer)
INSERT INTO trek_groups (
    organizer_id, title, description, fort_name, trek_date, duration, 
    difficulty, max_participants, current_participants, meeting_point, cost, content, status
) VALUES 
(
    2, -- Demo user ID
    'Rajgad Fort Night Trek Adventure',
    'Join us for an exciting night trek to Rajgad Fort. Experience the fort under moonlight and catch the beautiful sunrise from the top. Perfect for intermediate trekkers looking for a thrilling adventure.',
    'Rajgad Fort',
    '2024-03-15',
    '1 Night, 2 Days',
    'Moderate',
    15,
    8,
    'Pune Railway Station',
    1200.00,
    JSON_OBJECT(
        'included', JSON_ARRAY('Transportation', 'Guide', 'Breakfast', 'First Aid'),
        'requirements', JSON_ARRAY('Good fitness level', 'Trekking shoes', 'Headlamp', 'Water bottle'),
        'tags', JSON_ARRAY('Night Trek', 'Sunrise', 'Historical')
    ),
    'open'
),
(
    2, -- Demo user ID
    'Sinhagad Fort Family Trek',
    'Perfect family trek to Sinhagad Fort. Suitable for all age groups including children and elderly. Enjoy local food and learn about Maratha history.',
    'Sinhagad Fort',
    '2024-03-22',
    '1 Day',
    'Easy',
    20,
    12,
    'Sinhagad Base Village',
    800.00,
    JSON_OBJECT(
        'included', JSON_ARRAY('Guide', 'Lunch', 'Entry fees', 'Photos'),
        'requirements', JSON_ARRAY('Comfortable walking shoes', 'Water bottle', 'Sun protection'),
        'tags', JSON_ARRAY('Family Friendly', 'Historical', 'Food')
    ),
    'open'
),
(
    2, -- Demo user ID
    'Harishchandragad Advanced Trek',
    'Challenging trek to Harishchandragad fort for experienced trekkers. Experience the famous Konkan Kada cliff and temple caves. Overnight camping under stars.',
    'Harishchandragad Fort',
    '2024-03-28',
    '2 Days, 1 Night',
    'Difficult',
    12,
    12,
    'Khireshwar Village',
    1800.00,
    JSON_OBJECT(
        'included', JSON_ARRAY('Guide', 'Camping equipment', 'Meals', 'Safety gear'),
        'requirements', JSON_ARRAY('High fitness level', 'Trekking experience', 'Personal medications'),
        'tags', JSON_ARRAY('Advanced', 'Camping', 'Cliff Views')
    ),
    'full'
);

-- Insert some participants for the trek groups
INSERT INTO trek_group_participants (group_id, user_id, status) VALUES
(1, 2, 'confirmed'),
(2, 2, 'confirmed');

COMMIT;
