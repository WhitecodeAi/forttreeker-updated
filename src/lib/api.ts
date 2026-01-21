import {
  Fort,
  FortsResponse,
  FortResponse,
  FeaturedFortsResponse,
  DistrictsResponse,
  DifficultiesResponse,
  FortsStatsResponse,
  SearchSuggestionsResponse,
  FortsQueryParams,
  API_ENDPOINTS
} from '@shared/fort-api';

class APIService {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || '';
  }

  private async fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response received:', text.substring(0, 200) + '...');
        throw new Error('Server returned non-JSON response. Please check server configuration.');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      if (error instanceof SyntaxError && error.message.includes('Unexpected token')) {
        console.error('JSON parsing error - likely received HTML instead of JSON');
        throw new Error('API connection error: Server returned HTML instead of JSON. Please refresh the page.');
      }
      console.error('API Error:', error);
      throw error;
    }
  }

  // Get all forts with optional filtering and pagination
  async getForts(params?: FortsQueryParams): Promise<FortsResponse> {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const url = queryString ? `${API_ENDPOINTS.FORTS}?${queryString}` : API_ENDPOINTS.FORTS;

    return this.fetchAPI<FortsResponse>(url);
  }

  // Get single fort by ID
  async getFortById(id: number): Promise<FortResponse> {
    return this.fetchAPI<FortResponse>(API_ENDPOINTS.FORT_BY_ID(id));
  }

  // Get featured forts
  async getFeaturedForts(): Promise<FeaturedFortsResponse> {
    return this.fetchAPI<FeaturedFortsResponse>(API_ENDPOINTS.FEATURED_FORTS);
  }

  // Get all districts
  async getDistricts(): Promise<DistrictsResponse> {
    return this.fetchAPI<DistrictsResponse>(API_ENDPOINTS.DISTRICTS);
  }

  // Get all difficulty levels
  async getDifficulties(): Promise<DifficultiesResponse> {
    return this.fetchAPI<DifficultiesResponse>(API_ENDPOINTS.DIFFICULTIES);
  }

  // Get forts statistics
  async getFortsStats(): Promise<FortsStatsResponse> {
    return this.fetchAPI<FortsStatsResponse>(API_ENDPOINTS.FORTS_STATS);
  }

  // Get search suggestions
  async getSearchSuggestions(query: string): Promise<SearchSuggestionsResponse> {
    const searchParams = new URLSearchParams({ q: query });
    return this.fetchAPI<SearchSuggestionsResponse>(
      `${API_ENDPOINTS.SEARCH_SUGGESTIONS}?${searchParams.toString()}`
    );
  }

  // Get forts by difficulty
  async getFortsByDifficulty(difficulty: string): Promise<FortsResponse> {
    return this.getForts({ difficulty });
  }

  // Get forts by district
  async getFortsByDistrict(district: string): Promise<FortsResponse> {
    return this.getForts({ district });
  }

  // Search forts
  async searchForts(searchTerm: string, filters?: Omit<FortsQueryParams, 'search'>): Promise<FortsResponse> {
    return this.getForts({ search: searchTerm, ...filters });
  }

  // Get approved fort submissions
  async getApprovedForts(params?: { search?: string; difficulty?: string; limit?: number }): Promise<any> {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const url = queryString ? `${API_ENDPOINTS.APPROVED_FORTS}?${queryString}` : API_ENDPOINTS.APPROVED_FORTS;

    return this.fetchAPI<any>(url);
  }

  // Delete approved fort (admin only)
  async deleteApprovedFort(fortId: number): Promise<any> {
    return this.fetchAPI<any>(`${API_ENDPOINTS.APPROVED_FORTS}/${fortId}`, {
      method: 'DELETE'
    });
  }
}

export const apiService = new APIService();

// Utility functions for common operations
export const fortHelpers = {
  getDifficultyColor: (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Moderate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Difficult": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "Expert": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  },

  getDifficultyProgress: (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return 25;
      case "Moderate": return 50;
      case "Difficult": return 75;
      case "Expert": return 100;
      default: return 0;
    }
  },

  formatDuration: (duration: string) => {
    return duration.replace(/(\d+)-(\d+)/, '$1-$2');
  },

  formatElevation: (elevation: number) => {
    return `${elevation.toLocaleString()}m`;
  },

  formatDistance: (distance: number) => {
    return `${distance} km`;
  },

  formatRating: (rating: number) => {
    return rating.toFixed(1);
  }
};

export type { Fort, FortsQueryParams };
