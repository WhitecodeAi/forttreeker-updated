// Trek plan data structures
export interface TrekPlan {
  id: string;
  name: string;
  description?: string;
  selectedForts: number[];
  trekDate?: string; // ISO date string
  groupSize: string;
  experience: string;
  preferences: string[];
  notes: string;
  estimatedDuration: string;
  totalDistance: number;
  difficulty: 'Easy' | 'Moderate' | 'Difficult' | 'Expert';
  gearChecklist: GearItem[];
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}

export interface GearItem {
  id: string;
  item: string;
  essential: boolean;
  checked: boolean;
  category: 'clothing' | 'equipment' | 'food' | 'safety' | 'navigation' | 'other';
}

export interface TrekPlanSummary {
  id: string;
  name: string;
  selectedFortsCount: number;
  trekDate?: string;
  difficulty: string;
  createdAt: Date;
}

export interface EnrichedTrekPlan extends TrekPlan {
  fortDetails: any[]; // Fort objects from fort API
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

// Trek plan API responses
export interface TrekPlansResponse extends PaginatedResponse<TrekPlanSummary> {}
export interface TrekPlanResponse extends APIResponse<EnrichedTrekPlan> {}
export interface TrekPlanCreateResponse extends APIResponse<TrekPlan> {}

// Trek plan statistics
export interface TrekPlanStats {
  totalPlans: number;
  upcomingTreks: number;
  completedTreks: number;
  averageFortsPerPlan: number;
  difficultyDistribution: {
    Easy: number;
    Moderate: number;
    Difficult: number;
    Expert: number;
  };
  popularPreferences: Array<{
    preference: string;
    count: number;
  }>;
}

export interface TrekPlanStatsResponse extends APIResponse<TrekPlanStats> {}

// PDF data structure
export interface TrekPlanPDFData {
  plan: {
    name: string;
    description: string;
    trekDate: string;
    groupSize: string;
    experience: string;
    estimatedDuration: string;
    totalDistance: string;
    difficulty: string;
    notes: string;
    preferences: string[];
    createdAt: string;
    updatedAt: string;
  };
  forts: Array<{
    name: string;
    location: string;
    district: string;
    difficulty: string;
    duration: string;
    elevation: number;
    rating: number;
    description: string;
    highlights: string[];
    accessibility: any;
    facilities: any;
    entryFee: string;
    timings: string;
  }>;
  gear: {
    stats: {
      total: number;
      checked: number;
      completion: number;
      essentialTotal: number;
      essentialChecked: number;
      essentialCompletion: number;
    };
    essential: GearItem[];
    optional: GearItem[];
    byCategory: {
      equipment: GearItem[];
      clothing: GearItem[];
      food: GearItem[];
      safety: GearItem[];
      navigation: GearItem[];
      other: GearItem[];
    };
  };
  safety: {
    emergencyContacts: Array<{
      name: string;
      number: string;
    }>;
    generalTips: string[];
  };
  weather: {
    bestMonths: string[];
    tips: string[];
  };
}

export interface TrekPlanPDFResponse extends APIResponse<TrekPlanPDFData> {}

// Share URL response
export interface ShareURLResponse extends APIResponse<{
  shareUrl: string;
  planName: string;
  expiresAt: string;
}> {}

// Create/Update trek plan request
export interface CreateTrekPlanRequest {
  name: string;
  description?: string;
  selectedForts: number[];
  trekDate?: string;
  groupSize?: string;
  experience?: string;
  preferences?: string[];
  notes?: string;
  gearChecklist?: GearItem[];
}

export interface UpdateTrekPlanRequest extends Partial<CreateTrekPlanRequest> {}

// Query parameters for trek plans API
export interface TrekPlansQueryParams {
  limit?: number;
  offset?: number;
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'trekDate';
}

// API endpoints
export const TREK_PLAN_API_ENDPOINTS = {
  TREK_PLANS: '/api/trek-plans',
  TREK_PLAN_BY_ID: (id: string) => `/api/trek-plans/${id}`,
  TREK_PLAN_STATS: '/api/trek-plans/stats',
  DUPLICATE_TREK_PLAN: (id: string) => `/api/trek-plans/${id}/duplicate`,
  UPDATE_GEAR: (id: string) => `/api/trek-plans/${id}/gear`,
  PDF_DATA: (id: string) => `/api/trek-plans/${id}/pdf-data`,
  PDF_DOWNLOAD: (id: string) => `/api/trek-plans/${id}/pdf-download`,
  SHARE_URL: (id: string) => `/api/trek-plans/${id}/share-url`
} as const;

// Group size options
export const GROUP_SIZE_OPTIONS = [
  { value: 'solo', label: 'Solo (1 person)' },
  { value: 'small', label: 'Small Group (2-5 people)' },
  { value: 'medium', label: 'Medium Group (6-10 people)' },
  { value: 'large', label: 'Large Group (10+ people)' }
] as const;

// Experience level options
export const EXPERIENCE_LEVEL_OPTIONS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' }
] as const;

// Trek preferences options
export const TREK_PREFERENCES_OPTIONS = [
  'Photography focused',
  'Historical exploration',
  'Sunrise/Sunset views',
  'Group camping',
  'Local cuisine',
  'Wildlife spotting',
  'Adventure sports',
  'Meditation/Yoga'
] as const;

// Gear categories
export const GEAR_CATEGORIES = [
  { value: 'clothing', label: 'Clothing' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'food', label: 'Food & Water' },
  { value: 'safety', label: 'Safety' },
  { value: 'navigation', label: 'Navigation' },
  { value: 'other', label: 'Other' }
] as const;
