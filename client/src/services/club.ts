import { api, ApiResponse } from './api';

/**
 * Interface for club data from API
 */
export interface ClubData {
  id: number;
  name: string;
  description: string;
  department: string;
  officeBearers: {
    name: string;
    role: string;
    details: string;
  }[];
  members: {
    rollNo: string;
    name: string;
  }[];
  otherDetails: string;
  planOfAction: {
    summary: string;
    budget: number;
  };
  events: {
    name: string;
    description: string;
    date: string;
    outcomes: string;
    awards: string;
    remarks: string;
  }[];
  advisor: string;
  clubHead: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface for creating a new club
 */
export interface CreateClubData {
  name: string;
  description: string;
  department: string;
  officeBearers?: {
    name: string;
    role: string;
    details: string;
  }[];
  members?: {
    rollNo: string;
    name: string;
  }[];
  otherDetails?: string;
  planOfAction?: {
    summary: string;
    budget: number;
  };
  events?: {
    name: string;
    description: string;
    date: string;
    outcomes: string;
    awards: string;
    remarks: string;
  }[];
  advisor: string;
  clubHead: string;
}

/**
 * Interface for club search parameters
 */
export interface ClubSearchParams {
  searchTerm?: string;
  department?: string;
  page?: number;
  limit?: number;
}

/**
 * Interface for club event data
 */
export interface ClubEventData {
  name: string;
  workshops: number;
  competitions: number;
  socialEvents: number;
}

/**
 * Interface for membership data
 */
export interface MembershipData {
  month: string;
  [key: string]: string | number;
}

/**
 * Transform raw API club data to match the frontend interface
 */
export const transformClub = (club: ClubData): ClubData => ({
  ...club,
  createdAt: new Date(club.createdAt).toLocaleDateString(),
  updatedAt: new Date(club.updatedAt).toLocaleDateString(),
});

/**
 * Club service methods
 */
export const clubService = {
  /**
   * Get all clubs with pagination
   */
  getAllClubs: async (page: number = 1, limit: number = 10): Promise<ApiResponse<ClubData[]>> => {
    const response = await api.get<ClubData[]>(`clubs?page=${page}&limit=${limit}`);
    
    if (response.success && response.data) {
      return {
        ...response,
        data: response.data.map(transformClub)
      };
    }
    
    return {
      success: false,
      error: response.error || 'Failed to get clubs',
    };
  },

  /**
   * Get club by ID
   */
  getClubById: async (id: number): Promise<ApiResponse<ClubData>> => {
    const response = await api.get<ClubData>(`clubs/${id}`);
    
    if (response.success && response.data) {
      return {
        ...response,
        data: transformClub(response.data)
      };
    }
    
    return {
      success: false,
      error: response.error || 'Failed to get club',
    };
  },

  /**
   * Create a new club
   */
  createClub: async (clubData: CreateClubData): Promise<ApiResponse<ClubData>> => {
    const response = await api.post<ClubData>('clubs', clubData);
    
    if (response.success && response.data) {
      return {
        ...response,
        data: transformClub(response.data)
      };
    }
    
    return {
      success: false,
      error: response.error || 'Failed to create club',
    };
  },

  /**
   * Update a club
   */
  updateClub: async (id: number, clubData: Partial<CreateClubData>): Promise<ApiResponse<ClubData>> => {
    const response = await api.put<ClubData>(`clubs/${id}`, clubData);
    
    if (response.success && response.data) {
      return {
        ...response,
        data: transformClub(response.data)
      };
    }
    
    return {
      success: false,
      error: response.error || 'Failed to update club',
    };
  },

  /**
   * Delete a club
   */
  deleteClub: async (id: number): Promise<ApiResponse<void>> => {
    return api.delete(`clubs/${id}`);
  },

  /**
   * Search clubs
   */
  searchClubs: async (params: ClubSearchParams): Promise<ApiResponse<ClubData[]>> => {
    const queryParams = new URLSearchParams();
    
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    }
    
    const queryString = queryParams.toString();
    const endpoint = `clubs/search${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get<ClubData[]>(endpoint);
    
    if (response.success && response.data) {
      return {
        ...response,
        data: response.data.map(transformClub)
      };
    }
    
    return {
      success: false,
      error: response.error || 'Failed to search clubs',
    };
  },

  /**
   * Get clubs by department
   */
  getClubsByDepartment: async (department: string, page: number = 1, limit: number = 10): Promise<ApiResponse<ClubData[]>> => {
    const response = await api.get<ClubData[]>(`clubs/department/${department}?page=${page}&limit=${limit}`);
    
    if (response.success && response.data) {
      return {
        ...response,
        data: response.data.map(transformClub)
      };
    }
    
    return {
      success: false,
      error: response.error || 'Failed to get department clubs',
    };
  },

  /**
   * Get club events data
   */
  getClubEventsData: async (): Promise<ApiResponse<ClubEventData[]>> => {
    return api.get<ClubEventData[]>('clubs/events/data');
  },

  /**
   * Get membership growth data
   */
  getMembershipData: async (): Promise<ApiResponse<MembershipData[]>> => {
    return api.get<MembershipData[]>('clubs/membership/data');
  },

  /**
   * Add member to club
   */
  addMember: async (clubId: number, memberData: { rollNo: string; name: string }): Promise<ApiResponse<ClubData>> => {
    const response = await api.post<ClubData>(`clubs/${clubId}/members`, memberData);
    
    if (response.success && response.data) {
      return {
        ...response,
        data: transformClub(response.data)
      };
    }
    
    return {
      success: false,
      error: response.error || 'Failed to add member',
    };
  },

  /**
   * Remove member from club
   */
  removeMember: async (clubId: number, rollNo: string): Promise<ApiResponse<ClubData>> => {
    const response = await api.delete<ClubData>(`clubs/${clubId}/members/${rollNo}`);
    
    if (response.success && response.data) {
      return {
        ...response,
        data: transformClub(response.data)
      };
    }
    
    return {
      success: false,
      error: response.error || 'Failed to remove member',
    };
  },

  /**
   * Add event to club
   */
  addEvent: async (clubId: number, eventData: {
    name: string;
    description: string;
    date: string;
    outcomes: string;
    awards: string;
    remarks: string;
  }): Promise<ApiResponse<ClubData>> => {
    const response = await api.post<ClubData>(`clubs/${clubId}/events`, eventData);
    
    if (response.success && response.data) {
      return {
        ...response,
        data: transformClub(response.data)
      };
    }
    
    return {
      success: false,
      error: response.error || 'Failed to add event',
    };
  },

  /**
   * Remove event from club
   */
  removeEvent: async (clubId: number, eventId: number): Promise<ApiResponse<ClubData>> => {
    const response = await api.delete<ClubData>(`clubs/${clubId}/events/${eventId}`);
    
    if (response.success && response.data) {
      return {
        ...response,
        data: transformClub(response.data)
      };
    }
    
    return {
      success: false,
      error: response.error || 'Failed to remove event',
    };
  }
}; 