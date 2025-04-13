import { api, ApiResponse } from './api';

/**
 * Interface for API extracurricular data
 */
export interface ExtracurricularData {
  id?: number;
  title: string;
  organization: string;
  role: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "Ongoing" | "Completed" | "Upcoming";
  achievements: string;
  skills: string[];
  url: string;
}

/**
 * Interface for extracurricular search parameters
 */
export interface ExtracurricularSearchParams {
  title?: string;
  organization?: string;
  status?: string;
  page?: number;
}

/**
 * Interface for extracurricular creation data
 */
export interface CreateExtracurricularData {
  title: string;
  organization: string;
  role: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  achievements: string;
  skills: string[];
  url: string;
}

/**
 * Transform raw API extracurricular data to match the Extracurricular interface
 */
export const transformExtracurricular = (extracurricular: ExtracurricularData): ExtracurricularData => {
  return {
    id: extracurricular.id,
    title: extracurricular.title || '',
    organization: extracurricular.organization || '',
    role: extracurricular.role || '',
    description: extracurricular.description || '',
    startDate: extracurricular.startDate || '',
    endDate: extracurricular.endDate || '',
    status: extracurricular.status || 'Ongoing',
    achievements: extracurricular.achievements || '',
    skills: Array.isArray(extracurricular.skills) ? extracurricular.skills : [],
    url: extracurricular.url || '',
  };
};

/**
 * Extracurricular service methods
 */
export const extracurricularService = {
  /**
   * Get all extracurricular activities
   */
  getAllExtracurriculars: async (): Promise<ApiResponse<ExtracurricularData[]>> => {
    const response = await api.get<ExtracurricularData[]>('extracurricular/search');

    if (response.success && response.data) {
      // Transform the API data to match our Extracurricular interface
      const transformedExtracurriculars = response.data.map(transformExtracurricular);
      return {
        ...response,
        data: transformedExtracurriculars
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to get extracurricular activities',
    };
  },

  /**
   * Get extracurricular by ID
   */
  getExtracurricularById: async (id: number): Promise<ApiResponse<ExtracurricularData>> => {
    const response = await api.get<ExtracurricularData>(`extracurricular/getExtracurricular/${id}`);

    if (response.success && response.data) {
      return {
        ...response,
        data: transformExtracurricular(response.data)
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to get extracurricular data',
    };
  },

  /**
   * Create a new extracurricular activity
   */
  createExtracurricular: async (extracurricularData: CreateExtracurricularData): Promise<ApiResponse<ExtracurricularData>> => {
    const response = await api.post<ExtracurricularData>('extracurricular/createExtracurricular', extracurricularData);

    if (response.success && response.data) {
      return {
        ...response,
        data: transformExtracurricular(response.data)
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to create extracurricular activity',
    };
  },

  /**
   * Search and filter extracurricular activities
   */
  searchExtracurriculars: async (params: ExtracurricularSearchParams): Promise<ApiResponse<ExtracurricularData[]>> => {
    // Convert params to query string
    const queryParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        // Handle array parameters
        if (Array.isArray(value)) {
          if (value.length > 0) {
            value.forEach(item => queryParams.append(key, item));
          }
        } else {
          queryParams.append(key, String(value));
        }
      }
    }

    const queryString = queryParams.toString();
    const endpoint = `extracurricular/search${queryString ? `?${queryString}` : ''}`;

    const response = await api.get<ExtracurricularData[]>(endpoint);

    if (response.success && response.data) {
      const transformedExtracurriculars = response.data.map(transformExtracurricular);
      return {
        ...response,
        data: transformedExtracurriculars
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to search extracurricular activities',
    };
  },

  /**
   * Get extracurricular activities by user
   */
  getExtracurricularsByUser: async (username: string): Promise<ApiResponse<ExtracurricularData[]>> => {
    const response = await api.get<ExtracurricularData[]>(`extracurricular/getExtracurricularsByUser/${username}`);

    if (response.success && response.data) {
      const transformedExtracurriculars = response.data.map(transformExtracurricular);
      return {
        ...response,
        data: transformedExtracurriculars
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to get user extracurricular activities',
    };
  },

  /**
   * Update extracurricular activity
   */
  updateExtracurricular: async (id: number, extracurricularData: Partial<CreateExtracurricularData>): Promise<ApiResponse<ExtracurricularData>> => {
    const response = await api.put<ExtracurricularData>(`extracurricular/updateExtracurricular/${id}`, extracurricularData);

    if (response.success && response.data) {
      return {
        ...response,
        data: transformExtracurricular(response.data)
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to update extracurricular activity',
    };
  },

  /**
   * Delete extracurricular activity
   */
  deleteExtracurricular: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<void>(`extracurricular/deleteExtracurricular/${id}`);

    return response;
  }
};
