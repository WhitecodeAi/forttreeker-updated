// Fallback data when MySQL is not available - matches Fort interface
export const fallbackForts = [
  {
    id: 1,
    name: "Sinhagad Fort",
    location: "Near Pune, Maharashtra",
    district: "Pune",
    difficulty: "Easy" as const,
    duration: "2-3 hours",
    rating: 4.5,
    reviews: 1250,
    elevation: 1312,
    bestSeason: ["October", "November", "December", "January", "February", "March"],
    images: {
      main: "/placeholder.svg",
      gallery: ["/placeholder.svg"]
    },
    description: "One of the most popular forts near Pune, perfect for beginners.",
    highlights: ["Perfect for beginners", "Great views of Pune", "Easy accessibility"],
    nearestTown: "Pune",
    distance: 25,
    history: "Historic Maratha fort with great significance.",
    architecture: "Stone fortification with multiple bastions.",
    trekRoute: "Well-marked trail from base village.",
    whatToBring: ["Water", "Comfortable shoes", "Camera"],
    safetyTips: ["Trek in groups", "Carry enough water"],
    accessibility: {
      byTrain: "Pune Railway Station (25 km)",
      byBus: "Regular buses from Pune",
      byAir: "Pune Airport (35 km)"
    },
    weather: {
      temperature: "15°C - 30°C",
      rainfall: "Moderate during monsoon",
      bestTime: "October to March"
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
    timings: "6:00 AM - 6:00 PM",
    entryFee: "Free",
    photography: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const fallbackDistricts = [
  "Pune",
  "Ahmednagar", 
  "Nashik",
  "Aurangabad",
  "Kolhapur",
  "Satara"
];

export const fallbackDifficulties = [
  "Easy",
  "Moderate", 
  "Difficult",
  "Expert"
];

export const fallbackStats = {
  totalForts: fallbackForts.length,
  totalDistricts: fallbackDistricts.length,
  totalReviews: 0,
  averageRating: 0
};
