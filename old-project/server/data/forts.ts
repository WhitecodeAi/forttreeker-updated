export interface Fort {
  id: number;
  name: string;
  location: string;
  district: string;
  difficulty: "Easy" | "Moderate" | "Difficult" | "Expert";
  duration: string;
  rating: number;
  reviews: number;
  elevation: number;
  bestSeason: string[];
  images: {
    main: string;
    gallery: string[];
  };
  description: string;
  highlights: string[];
  nearestTown: string;
  distance: number;
  history: string;
  architecture: string;
  trekRoute: string;
  whatToBring: string[];
  safetyTips: string[];
  accessibility: {
    byTrain: string;
    byBus: string;
    byAir: string;
  };
  weather: {
    temperature: string;
    rainfall: string;
    bestTime: string;
  };
  facilities: {
    parking: boolean;
    restrooms: boolean;
    foodStalls: boolean;
    guides: boolean;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  timings: string;
  entryFee: string;
  photography: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const fortsData: Fort[] = [
  {
    id: 1,
    name: "Rajgad Fort",
    location: "Rajgad, Pune",
    district: "Pune",
    difficulty: "Moderate",
    duration: "6-8 hours",
    rating: 4.8,
    reviews: 342,
    elevation: 1376,
    bestSeason: ["October", "November", "December", "January", "February"],
    images: {
      main: "https://images.pexels.com/photos/14137273/pexels-photo-14137273.jpeg",
      gallery: [
        "https://images.pexels.com/photos/14137273/pexels-photo-14137273.jpeg",
        "https://images.pexels.com/photos/4481330/pexels-photo-4481330.jpeg",
        "https://images.pexels.com/photos/2491827/pexels-photo-2491827.jpeg",
        "https://images.pexels.com/photos/30308411/pexels-photo-30308411.jpeg"
      ]
    },
    description: "The capital of Maratha Empire under Chhatrapati Shivaji Maharaj. Known for its strategic importance and stunning architecture.",
    highlights: ["Historical significance", "Panoramic views", "Ancient architecture", "Balekilla", "Sanjivani Machi"],
    nearestTown: "Pune",
    distance: 60,
    history: "Rajgad Fort, also known as the 'King of Forts', served as the capital of the Maratha Empire under Chhatrapati Shivaji Maharaj for over 25 years (1648-1674). The fort was originally called Murumdev after the Murumdev temple at the top. Shivaji Maharaj renamed it Rajgad when he captured it in 1647. The fort houses the tomb of Shivaji's mother, Jijabai, and his son, Sambhaji. It was the most important strategic fort of the Maratha Empire and witnessed many important decisions that shaped the history of Maharashtra.",
    architecture: "The fort complex is divided into three main parts: Balekilla (upper fort), Sanjivani Machi, and Suvela Machi. The Balekilla contains the royal palace, the tomb of Jijabai, Sambhaji's tomb, and several water cisterns. The architecture reflects typical Maratha fort construction with strategic placement of gates, secret passages, and defensive structures. The fort's design demonstrates excellent water management systems with numerous rock-cut cisterns.",
    trekRoute: "The trek starts from Gunjavane village base. Follow the well-marked trail through dense forests and rocky patches. The route passes through Ganj Darwaja (first gate), then Pali Darwaja (second gate), and finally reaches the top. The final ascent involves some rock climbing sections. The trail is moderate with some steep sections requiring basic trekking experience.",
    whatToBring: [
      "Comfortable trekking shoes with good grip",
      "Sufficient water (3-4 liters per person)",
      "Energy bars and dry fruits",
      "First aid kit",
      "Flashlight/headlamp",
      "Rain gear (during monsoon)",
      "Sun protection (hat, sunscreen)",
      "Camera for photography",
      "Light backpack",
      "Whistle for emergency"
    ],
    safetyTips: [
      "Start early to avoid afternoon heat",
      "Stay on marked trails",
      "Don't trek alone, go in groups",
      "Check weather conditions before starting",
      "Inform someone about your trek plan",
      "Carry emergency contact numbers",
      "Avoid trekking during heavy rains",
      "Be cautious near cliff edges",
      "Stay hydrated throughout the trek",
      "Turn back if weather deteriorates"
    ],
    accessibility: {
      byTrain: "Pune Railway Station (60 km) - Take local transport to Gunjavane village",
      byBus: "Regular buses from Pune to Bhor, then local transport to Gunjavane",
      byAir: "Pune Airport (75 km) - Hire taxi or take local transport"
    },
    weather: {
      temperature: "15°C - 30°C (varies by season)",
      rainfall: "Heavy during monsoon (June-September)",
      bestTime: "October to February for pleasant weather"
    },
    facilities: {
      parking: true,
      restrooms: false,
      foodStalls: false,
      guides: true
    },
    coordinates: {
      latitude: 18.2462,
      longitude: 73.6778
    },
    timings: "6:00 AM to 6:00 PM",
    entryFee: "Free",
    photography: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    name: "Sinhagad Fort",
    location: "Sinhagad, Pune",
    district: "Pune",
    difficulty: "Easy",
    duration: "3-4 hours",
    rating: 4.6,
    reviews: 567,
    elevation: 1312,
    bestSeason: ["October", "November", "December", "January", "February", "March"],
    images: {
      main: "https://images.pexels.com/photos/4481330/pexels-photo-4481330.jpeg",
      gallery: [
        "https://images.pexels.com/photos/4481330/pexels-photo-4481330.jpeg",
        "https://images.pexels.com/photos/2491827/pexels-photo-2491827.jpeg",
        "https://images.pexels.com/photos/14137273/pexels-photo-14137273.jpeg",
        "https://images.pexels.com/photos/30308411/pexels-photo-30308411.jpeg"
      ]
    },
    description: "Famous for the Battle of Sinhagad fought by Tanaji Malusare. Perfect for beginners and offers beautiful sunset views.",
    highlights: ["Easy trek", "Great for beginners", "Historical importance", "Tanaji Memorial", "Food stalls"],
    nearestTown: "Pune",
    distance: 35,
    history: "Sinhagad Fort holds immense historical significance in Maratha history. Originally named Kondana, it was renamed Sinhagad (Lion's Fort) after the legendary Battle of Sinhagad in 1670. Tanaji Malusare, one of Shivaji Maharaj's trusted generals, recaptured this fort from the Mughals but lost his life in the process. The famous saying 'Gad ala pan Sinha gela' (The fort is captured but the lion is gone) commemorates his sacrifice.",
    architecture: "The fort features typical Maratha military architecture with strong defensive walls, water cisterns, and strategic gates. The main attractions include the tomb of Tanaji Malusare, ancient temples, and the memorial dedicated to the brave Maratha warrior. The fort's design reflects its strategic importance in controlling the trade routes between the Konkan coast and the Deccan plateau.",
    trekRoute: "The trek begins from the base village and follows a well-defined path. The route is mostly gradual with a few steep sections near the top. There are steps carved into the rock face making it accessible for beginners. The path is well-marked and maintained, making it one of the most popular entry-level treks near Pune.",
    whatToBring: [
      "Comfortable walking shoes",
      "Water bottles (2-3 liters)",
      "Energy snacks",
      "Camera",
      "Sun hat and sunscreen",
      "Light jacket for evening",
      "Cash for refreshments",
      "Torch (if planning to stay till evening)"
    ],
    safetyTips: [
      "Perfect for beginners and families",
      "Stay on the main path",
      "Be careful near cliff edges",
      "Start early to avoid crowds",
      "Carry sufficient water",
      "Watch sunset safely from designated areas",
      "Don't venture into restricted areas"
    ],
    accessibility: {
      byTrain: "Pune Railway Station (35 km) - Local buses and taxis available",
      byBus: "Direct buses from Pune to Sinhagad every 30 minutes",
      byAir: "Pune Airport (45 km) - Hire taxi or use app-based cabs"
    },
    weather: {
      temperature: "12°C - 28°C (varies by season)",
      rainfall: "Moderate during monsoon",
      bestTime: "October to March for best weather"
    },
    facilities: {
      parking: true,
      restrooms: true,
      foodStalls: true,
      guides: true
    },
    coordinates: {
      latitude: 18.3664,
      longitude: 73.7562
    },
    timings: "6:00 AM to 8:00 PM",
    entryFee: "₹30 per person",
    photography: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 3,
    name: "Raigad Fort",
    location: "Raigad, Maharashtra",
    district: "Raigad",
    difficulty: "Moderate",
    duration: "5-6 hours",
    rating: 4.9,
    reviews: 423,
    elevation: 821,
    bestSeason: ["October", "November", "December", "January", "February"],
    images: {
      main: "https://images.pexels.com/photos/30308411/pexels-photo-30308411.jpeg",
      gallery: [
        "https://images.pexels.com/photos/30308411/pexels-photo-30308411.jpeg",
        "https://images.pexels.com/photos/4481330/pexels-photo-4481330.jpeg",
        "https://images.pexels.com/photos/2491827/pexels-photo-2491827.jpeg",
        "https://images.pexels.com/photos/14137273/pexels-photo-14137273.jpeg"
      ]
    },
    description: "Coronation place of Chhatrapati Shivaji Maharaj. A UNESCO World Heritage site with remarkable palace ruins.",
    highlights: ["Royal palace ruins", "Rope way available", "UNESCO heritage", "Coronation throne", "Takmak Tok"],
    nearestTown: "Mahad",
    distance: 120,
    history: "Raigad Fort is the most significant fort in Maratha history as it was here that Shivaji Maharaj was crowned as Chhatrapati in 1674, establishing the Maratha Empire. The fort served as the capital of the Maratha Empire. The ruins of the royal palace, the coronation throne, and various other structures speak of the fort's glorious past. The fort also houses the samadhi (tomb) of Shivaji Maharaj.",
    architecture: "The fort showcases excellent Maratha architecture with ruins of the royal palace, Queen's quarters, public durbar, and private chambers. The famous 'Hirkani Buruj' and 'Takmak Tok' (execution point) are notable features. The fort had sophisticated water management systems with several tanks and wells. The coronation throne area and the ruins of Jagadishwar temple are major architectural highlights.",
    trekRoute: "You can reach the fort either by trekking from the base (3-4 hours) or by taking the ropeway (10 minutes). The trekking route is steep and challenging, passing through dense forests and rocky terrain. The ropeway is the preferred option for most visitors as it saves time and energy while offering spectacular views of the surrounding Sahyadri mountains.",
    whatToBring: [
      "Trekking shoes (if hiking)",
      "Water bottles",
      "Energy food",
      "Camera with extra batteries",
      "Sun protection",
      "Light refreshments",
      "Cash for ropeway tickets",
      "Comfortable clothing"
    ],
    safetyTips: [
      "Ropeway is safer and recommended",
      "If trekking, go in groups",
      "Be careful around ruins and cliffs",
      "Stay away from Takmak Tok edge",
      "Follow guide instructions",
      "Don't climb on ancient structures",
      "Weather can change quickly in mountains"
    ],
    accessibility: {
      byTrain: "Panvel Railway Station (120 km) - Hire taxi or take bus to Mahad",
      byBus: "Mumbai to Mahad buses, then local transport to ropeway base",
      byAir: "Mumbai Airport (170 km) - Hire taxi for scenic drive"
    },
    weather: {
      temperature: "16°C - 32°C (varies by season)",
      rainfall: "Heavy during monsoon (June-September)",
      bestTime: "October to February for clear skies"
    },
    facilities: {
      parking: true,
      restrooms: true,
      foodStalls: true,
      guides: true
    },
    coordinates: {
      latitude: 18.2356,
      longitude: 73.4402
    },
    timings: "9:00 AM to 5:30 PM (Ropeway timing)",
    entryFee: "₹50 + Ropeway charges (₹200-300)",
    photography: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 4,
    name: "Lohagad Fort",
    location: "Lohagad, Pune",
    district: "Pune",
    difficulty: "Easy",
    duration: "4-5 hours",
    rating: 4.5,
    reviews: 289,
    elevation: 1033,
    bestSeason: ["June", "July", "August", "September", "October"],
    images: {
      main: "https://images.pexels.com/photos/2491827/pexels-photo-2491827.jpeg",
      gallery: [
        "https://images.pexels.com/photos/2491827/pexels-photo-2491827.jpeg",
        "https://images.pexels.com/photos/14137273/pexels-photo-14137273.jpeg",
        "https://images.pexels.com/photos/4481330/pexels-photo-4481330.jpeg",
        "https://images.pexels.com/photos/2350366/pexels-photo-2350366.jpeg"
      ]
    },
    description: "Iron Fort famous for its historical significance and monsoon beauty. Connected to Visapur Fort.",
    highlights: ["Monsoon trek", "Historical gates", "Vinchua Kata", "Connected to Visapur", "Easy accessibility"],
    nearestTown: "Lonavala",
    distance: 65,
    history: "Lohagad, meaning 'Iron Fort', has been ruled by various dynasties including the Lohtamia dynasty, Chalukyas, Rashtrakutas, Yadavas, Bahamanis, Nizams, Mughals, and Marathas. The fort was an important hill fort during Shivaji's military campaigns and later became part of the Maratha Empire. The fort is famous for its strong walls and gates that have withstood the test of time.",
    architecture: "The fort features four gates: Ganesh Darwaja, Narayan Darwaja, Hanuman Darwaja, and Maha Darwaja. The most famous feature is the 'Vinchua Kata' (Scorpion's Tail), a narrow ridge that extends from the fort offering spectacular views. The fort has several ancient structures including temples, water cisterns, and remains of residential areas. The architecture reflects the strategic military importance of the fort.",
    trekRoute: "The trek starts from Lohagadwadi village. The path is well-defined and passes through the four historic gates. The route is relatively easy with gradual inclines. The final stretch to Vinchua Kata requires careful walking along the narrow ridge. During monsoon, the entire fort is covered in lush greenery making it extremely beautiful.",
    whatToBring: [
      "Non-slip trekking shoes",
      "Raincoat (during monsoon)",
      "Sufficient water",
      "Dry snacks",
      "Camera for scenic views",
      "First aid kit",
      "Extra clothes (monsoon)",
      "Torch for caves exploration"
    ],
    safetyTips: [
      "Extremely slippery during monsoon",
      "Be extra careful on Vinchua Kata",
      "Don't venture out during heavy rain",
      "Stay away from cliff edges",
      "Trek in groups during monsoon",
      "Avoid loose rocks",
      "Check weather before starting"
    ],
    accessibility: {
      byTrain: "Lonavala Railway Station (15 km) - Local transport to base village",
      byBus: "Mumbai/Pune to Lonavala, then local transport",
      byAir: "Pune Airport (80 km) - Drive via scenic Western Ghats"
    },
    weather: {
      temperature: "18°C - 35°C (varies by season)",
      rainfall: "Very heavy during monsoon",
      bestTime: "Post-monsoon (September-October) for best views"
    },
    facilities: {
      parking: true,
      restrooms: false,
      foodStalls: false,
      guides: true
    },
    coordinates: {
      latitude: 18.7108,
      longitude: 73.4855
    },
    timings: "6:00 AM to 6:00 PM",
    entryFee: "Free",
    photography: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 5,
    name: "Torna Fort",
    location: "Torna, Pune",
    district: "Pune",
    difficulty: "Difficult",
    duration: "7-8 hours",
    rating: 4.7,
    reviews: 156,
    elevation: 1403,
    bestSeason: ["October", "November", "December", "January", "February"],
    images: {
      main: "https://images.pexels.com/photos/4481330/pexels-photo-4481330.jpeg",
      gallery: [
        "https://images.pexels.com/photos/4481330/pexels-photo-4481330.jpeg",
        "https://images.pexels.com/photos/14137273/pexels-photo-14137273.jpeg",
        "https://images.pexels.com/photos/2491827/pexels-photo-2491827.jpeg",
        "https://images.pexels.com/photos/2350366/pexels-photo-2350366.jpeg"
      ]
    },
    description: "The first fort captured by Shivaji Maharaj at age 16. Highest fort in Pune district with challenging trek.",
    highlights: ["Highest in Pune", "First conquest of Shivaji", "Challenging trek", "Menghai Devi temple", "Spectacular views"],
    nearestTown: "Pune",
    distance: 50,
    history: "Torna Fort holds the distinction of being the first fort captured by Shivaji Maharaj in 1643 when he was just 16 years old. This conquest marked the beginning of the Maratha Empire. The fort was originally called Prachandagad. The young Shivaji's successful capture of this strategically important fort demonstrated his military acumen and vision, laying the foundation for what would become a vast empire.",
    architecture: "Being the highest fort in the Pune district at 1,403 meters, Torna offers commanding views of the surrounding region. The fort features ancient fortifications, water storage systems, and the famous Menghai Devi temple. The architecture includes several caves, old structures, and defensive walls that showcase the military engineering of the time. The trek to the top reveals various architectural remnants that speak of its historical importance.",
    trekRoute: "The trek is considered difficult and starts from Velhe village. The route involves steep climbs, rocky patches, and narrow ridges. There are several challenging sections including rock climbing near the top. The path passes through dense forests and requires good physical fitness. The final approach to the fort involves scrambling over rocks and requires careful navigation.",
    whatToBring: [
      "Excellent trekking shoes with grip",
      "Plenty of water (4-5 liters)",
      "High-energy food",
      "Climbing gloves",
      "Rope (for difficult sections)",
      "First aid kit",
      "Headlamp",
      "Emergency whistle",
      "Weather protection gear",
      "GPS device or smartphone"
    ],
    safetyTips: [
      "Only for experienced trekkers",
      "Never attempt alone",
      "Start very early (before sunrise)",
      "Check weather conditions thoroughly",
      "Inform family/friends about trek plan",
      "Carry emergency contact numbers",
      "Turn back if weather deteriorates",
      "Be extremely careful on rocky sections",
      "Stay together as a group",
      "Consider hiring local guide"
    ],
    accessibility: {
      byTrain: "Pune Railway Station (50 km) - Drive to Velhe village base",
      byBus: "Pune to Velhe village via local bus service",
      byAir: "Pune Airport (65 km) - Hire taxi to base village"
    },
    weather: {
      temperature: "10°C - 25°C (varies by season)",
      rainfall: "Heavy during monsoon - avoid trekking",
      bestTime: "October to February for safe conditions"
    },
    facilities: {
      parking: true,
      restrooms: false,
      foodStalls: false,
      guides: true
    },
    coordinates: {
      latitude: 18.2028,
      longitude: 73.6186
    },
    timings: "5:00 AM to 7:00 PM (recommended)",
    entryFee: "Free",
    photography: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 6,
    name: "Pratapgad Fort",
    location: "Mahabaleshwar, Satara",
    district: "Satara",
    difficulty: "Moderate",
    duration: "5-6 hours",
    rating: 4.6,
    reviews: 234,
    elevation: 1080,
    bestSeason: ["October", "November", "December", "January", "February", "March"],
    images: {
      main: "https://images.pexels.com/photos/4481330/pexels-photo-4481330.jpeg",
      gallery: [
        "https://images.pexels.com/photos/4481330/pexels-photo-4481330.jpeg",
        "https://images.pexels.com/photos/2491827/pexels-photo-2491827.jpeg",
        "https://images.pexels.com/photos/14137273/pexels-photo-14137273.jpeg",
        "https://images.pexels.com/photos/30308411/pexels-photo-30308411.jpeg"
      ]
    },
    description: "Built by Shivaji Maharaj in 1656. Famous for the meeting between Shivaji and Afzal Khan.",
    highlights: ["Historical meeting place", "Afzal Khan's tomb", "Bhavani temple", "Scenic beauty", "Strategic location"],
    nearestTown: "Mahabaleshwar",
    distance: 24,
    history: "Pratapgad Fort was built by Shivaji Maharaj in 1656 and is famous for the historic meeting between Shivaji Maharaj and Afzal Khan in 1659. This meeting resulted in the death of Afzal Khan and marked a significant victory for the Marathas against the Bijapur Sultanate. The fort's name means 'Fort of Valor' and it lived up to its name during this historic encounter. The fort also served as an important military base for the Marathas.",
    architecture: "The fort is divided into two parts: the lower fort (Javali) and the upper fort (Balekilla). The upper fort houses the tomb of Afzal Khan, the Bhavani temple, and several other structures. The fort's architecture is a blend of Maratha military design with Islamic influences. The strategic location offers panoramic views of the Konkan and the surrounding Sahyadri ranges. The fort's design includes multiple gates, water cisterns, and residential quarters.",
    trekRoute: "The trek to Pratapgad starts from the base and involves a moderate climb through well-defined paths. The route passes through the lower fort area and then ascends to the upper fort. The path includes stone steps and some rocky sections. The trek offers beautiful views of the surrounding Western Ghats and valleys. The route is well-marked and suitable for intermediate trekkers.",
    whatToBring: [
      "Comfortable trekking shoes",
      "Water bottles (3 liters minimum)",
      "Energy snacks and lunch",
      "Camera for historical sites",
      "Sun protection gear",
      "Light warm clothing",
      "First aid essentials",
      "Cash for local guides"
    ],
    safetyTips: [
      "Suitable for intermediate trekkers",
      "Stay on designated paths",
      "Respect historical monuments",
      "Don't climb on ancient structures",
      "Be careful around tomb area",
      "Follow local guide instructions",
      "Weather can change quickly"
    ],
    accessibility: {
      byTrain: "Satara Railway Station (45 km) - Local transport to Mahabaleshwar",
      byBus: "Regular buses from Pune/Mumbai to Mahabaleshwar",
      byAir: "Pune Airport (120 km) - Scenic drive through Western Ghats"
    },
    weather: {
      temperature: "12°C - 28°C (varies by season)",
      rainfall: "Moderate to heavy during monsoon",
      bestTime: "October to March for pleasant trekking"
    },
    facilities: {
      parking: true,
      restrooms: true,
      foodStalls: true,
      guides: true
    },
    coordinates: {
      latitude: 17.9267,
      longitude: 73.5547
    },
    timings: "6:00 AM to 6:00 PM",
    entryFee: "₹25 per person",
    photography: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
