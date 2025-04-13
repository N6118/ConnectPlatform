import { api, ApiResponse } from './api';

/**
 * Interface for API internship data
 */
export interface InternshipData {
  id?: number;
  title: string;
  company: string;
  location: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "Ongoing" | "Completed" | "Upcoming";
  skills: string[];
  supervisor: string;
  certificate: string;
}

/**
 * Interface for internship search parameters
 */
export interface InternshipSearchParams {
  title?: string;
  company?: string;
  status?: string;
  page?: number;
}

/**
 * Interface for internship creation data
 */
export interface CreateInternshipData {
  title: string;
  company: string;
  location: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  skills: string[];
  supervisor: string;
  certificate: string;
}

/**
 * Transform raw API internship data to match the Internship interface
 */
export const transformInternship = (internship: InternshipData): InternshipData => {
  return {
    id: internship.id,
    title: internship.title || '',
    company: internship.company || '',
    location: internship.location || '',
    description: internship.description || '',
    startDate: internship.startDate || '',
    endDate: internship.endDate || '',
    status: internship.status || 'Ongoing',
    skills: Array.isArray(internship.skills) ? internship.skills : [],
    supervisor: internship.supervisor || '',
    certificate: internship.certificate || '',
  };
};

/**
 * Internship service methods
 */
export const internshipService = {
  /**
   * Get all internships
   */
  getAllInternships: async (): Promise<ApiResponse<InternshipData[]>> => {
    const response = await api.get<InternshipData[]>('internship/search');

    if (response.success && response.data) {
      // Transform the API data to match our Internship interface
      const transformedInternships = response.data.map(transformInternship);
      return {
        ...response,
        data: transformedInternships
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to get internships',
    };
  },

  /**
   * Get internship by ID
   */
  getInternshipById: async (id: number): Promise<ApiResponse<InternshipData>> => {
    const response = await api.get<InternshipData>(`internship/getInternship/${id}`);

    if (response.success && response.data) {
      return {
        ...response,
        data: transformInternship(response.data)
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to get internship data',
    };
  },

  /**
   * Create a new internship
   */
  createInternship: async (internshipData: CreateInternshipData): Promise<ApiResponse<InternshipData>> => {
    const response = await api.post<InternshipData>('internship/createInternship', internshipData);

    if (response.success && response.data) {
      return {
        ...response,
        data: transformInternship(response.data)
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to create internship',
    };
  },

  /**
   * Search and filter internships
   */
  searchInternships: async (params: InternshipSearchParams): Promise<ApiResponse<InternshipData[]>> => {
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
    const endpoint = `internship/search${queryString ? `?${queryString}` : ''}`;

    const response = await api.get<InternshipData[]>(endpoint);

    if (response.success && response.data) {
      const transformedInternships = response.data.map(transformInternship);
      return {
        ...response,
        data: transformedInternships
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to search internships',
    };
  },

  /**
   * Get internships by user
   */
  getInternshipsByUser: async (username: string): Promise<ApiResponse<InternshipData[]>> => {
    const response = await api.get<InternshipData[]>(`internship/getInternshipsByUser/${username}`);

    if (response.success && response.data) {
      const transformedInternships = response.data.map(transformInternship);
      return {
        ...response,
        data: transformedInternships
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to get user internships',
    };
  },

  /**
   * Update internship
   */
  updateInternship: async (id: number, internshipData: Partial<CreateInternshipData>): Promise<ApiResponse<InternshipData>> => {
    const response = await api.put<InternshipData>(`internship/updateInternship/${id}`, internshipData);

    if (response.success && response.data) {
      return {
        ...response,
        data: transformInternship(response.data)
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to update internship',
    };
  },

  /**
   * Delete internship
   */
  deleteInternship: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<void>(`internship/deleteInternship/${id}`);

    return response;
  }
};
