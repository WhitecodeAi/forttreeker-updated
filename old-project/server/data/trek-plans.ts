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
  userId?: string; // For future user authentication
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

// In-memory storage for trek plans (in production, this would be a database)
export const trekPlansStorage: TrekPlan[] = [
  {
    id: "sample-plan-1",
    name: "Weekend Warriors Trek",
    description: "A perfect weekend getaway to explore historic forts",
    selectedForts: [1, 2], // Rajgad and Sinhagad
    trekDate: "2024-02-10",
    groupSize: "small",
    experience: "intermediate",
    preferences: ["Photography focused", "Historical exploration", "Sunrise/Sunset views"],
    notes: "Plan to reach early morning for sunrise views. Carry camera equipment.",
    estimatedDuration: "2 days",
    totalDistance: 25,
    difficulty: "Moderate",
    gearChecklist: [
      {
        id: "gear-1",
        item: "Trekking shoes",
        essential: true,
        checked: true,
        category: "equipment"
      },
      {
        id: "gear-2", 
        item: "Water bottles (3-4L)",
        essential: true,
        checked: true,
        category: "equipment"
      },
      {
        id: "gear-3",
        item: "Camera",
        essential: false,
        checked: true,
        category: "equipment"
      },
      {
        id: "gear-4",
        item: "Energy bars",
        essential: true,
        checked: false,
        category: "food"
      }
    ],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20")
  },
  {
    id: "sample-plan-2",
    name: "Solo Adventure Challenge",
    description: "Challenging solo trek for experienced trekkers",
    selectedForts: [5], // Torna Fort
    trekDate: "2024-02-25",
    groupSize: "solo",
    experience: "expert",
    preferences: ["Adventure sports", "Meditation/Yoga"],
    notes: "Solo trek planned for personal challenge and meditation. Emergency contacts informed.",
    estimatedDuration: "1 day",
    totalDistance: 15,
    difficulty: "Expert",
    gearChecklist: [
      {
        id: "gear-5",
        item: "Emergency GPS device",
        essential: true,
        checked: true,
        category: "safety"
      },
      {
        id: "gear-6",
        item: "Meditation mat",
        essential: false,
        checked: true,
        category: "other"
      }
    ],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18")
  }
];

// Default gear checklist for new trek plans
export const defaultGearChecklist: Omit<GearItem, 'id' | 'checked'>[] = [
  { item: "Trekking shoes", essential: true, category: "equipment" },
  { item: "Water bottles (3-4L)", essential: true, category: "equipment" },
  { item: "First aid kit", essential: true, category: "safety" },
  { item: "Headlamp/Flashlight", essential: true, category: "equipment" },
  { item: "Energy bars/Snacks", essential: true, category: "food" },
  { item: "Emergency whistle", essential: true, category: "safety" },
  { item: "Rain gear", essential: false, category: "clothing" },
  { item: "Trekking poles", essential: false, category: "equipment" },
  { item: "Portable charger", essential: false, category: "equipment" },
  { item: "Camera", essential: false, category: "equipment" },
  { item: "Sunscreen", essential: true, category: "safety" },
  { item: "Hat/Cap", essential: true, category: "clothing" },
  { item: "Extra clothing", essential: true, category: "clothing" },
  { item: "Lunch/Snacks", essential: true, category: "food" },
  { item: "Garbage bags", essential: true, category: "other" }
];

// Utility functions for trek plan operations
export const trekPlanUtils = {
  generateId: (): string => {
    return `trek-plan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  generateGearId: (): string => {
    return `gear-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  calculateDifficulty: (fortIds: number[]): TrekPlan['difficulty'] => {
    // This would normally query the forts data
    // For now, return based on number of forts and complexity
    if (fortIds.length === 0) return 'Easy';
    if (fortIds.length === 1) return 'Moderate';
    if (fortIds.length === 2) return 'Moderate';
    return 'Difficult';
  },

  calculateDuration: (fortIds: number[]): string => {
    // Simplified calculation based on number of forts
    if (fortIds.length === 0) return "0 days";
    if (fortIds.length === 1) return "1 day";
    if (fortIds.length === 2) return "2 days";
    return `${fortIds.length} days`;
  },

  calculateDistance: (fortIds: number[]): number => {
    // Simplified calculation - in real app, would use actual fort locations
    return fortIds.length * 12.5; // Average 12.5km per fort
  },

  createDefaultGearChecklist: (): GearItem[] => {
    return defaultGearChecklist.map(item => ({
      ...item,
      id: trekPlanUtils.generateGearId(),
      checked: false
    }));
  },

  createTrekPlanSummary: (plan: TrekPlan): TrekPlanSummary => {
    return {
      id: plan.id,
      name: plan.name,
      selectedFortsCount: plan.selectedForts.length,
      trekDate: plan.trekDate,
      difficulty: plan.difficulty,
      createdAt: plan.createdAt
    };
  }
};
