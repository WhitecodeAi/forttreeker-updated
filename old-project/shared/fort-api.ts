// Fort data structure
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

// API Response types
export interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  total: number;
  page: number;
  totalPages: number;
}

// Fort API responses
export interface FortsResponse extends PaginatedResponse<Fort> {}
export interface FortResponse extends APIResponse<Fort> {}
export interface FeaturedFortsResponse extends APIResponse<Fort[]> {}
export interface DistrictsResponse extends APIResponse<string[]> {}
export interface DifficultiesResponse extends APIResponse<string[]> {}

// Fort stats
export interface FortsStats {
  totalForts: number;
  totalDistricts: number;
  totalReviews: number;
  averageRating: number;
  difficultyDistribution: {
    Easy: number;
    Moderate: number;
    Difficult: number;
    Expert: number;
  };
}

export interface FortsStatsResponse extends APIResponse<FortsStats> {}

// Search suggestions
export interface SearchSuggestionsResponse extends APIResponse<string[]> {}

// Query parameters for fort API
export interface FortsQueryParams {
  search?: string;
  district?: string;
  difficulty?: string;
  minRating?: number;
  sortBy?: 'name' | 'rating' | 'elevation' | 'difficulty' | 'reviews';
  limit?: number;
  offset?: number;
}

// API endpoints
export const API_ENDPOINTS = {
  FORTS: '/api/forts',
  FORT_BY_ID: (id: number) => `/api/forts/${id}`,
  FEATURED_FORTS: '/api/forts/featured',
  DISTRICTS: '/api/forts/districts',
  DIFFICULTIES: '/api/forts/difficulties',
  FORTS_STATS: '/api/forts/stats',
  SEARCH_SUGGESTIONS: '/api/forts/search/suggestions',
  APPROVED_FORTS: '/api/content/approved-forts'
} as const;
