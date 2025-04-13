import { api, ApiResponse } from './api';

/**
 * Interface for API paper data
 */
export interface PaperData {
  id?: number;
  title: string;
  description: string;
  authors: string;
  journal: string;
  publicationDate: string;
  doi: string;
  status: "Draft" | "Submitted" | "Published" | "Rejected";
  tags: string[];
  url: string;
  citations: number;
}

/**
 * Interface for paper search parameters
 */
export interface PaperSearchParams {
  title?: string;
  status?: string;
  author?: string;
  journal?: string;
  page?: number;
}

/**
 * Interface for paper creation data
 */
export interface CreatePaperData {
  title: string;
  description: string;
  authors: string;
  journal: string;
  publicationDate: string;
  doi: string;
  status: string;
  tags: string[];
  url: string;
  citations: number;
}

/**
 * Transform raw API paper data to match the Paper interface
 */
export const transformPaper = (paper: PaperData): PaperData => {
  return {
    id: paper.id,
    title: paper.title || '',
    description: paper.description || '',
    authors: paper.authors || '',
    journal: paper.journal || '',
    publicationDate: paper.publicationDate || '',
    doi: paper.doi || '',
    status: paper.status || 'Draft',
    tags: Array.isArray(paper.tags) ? paper.tags : [],
    url: paper.url || '',
    citations: paper.citations || 0,
  };
};

/**
 * Paper service methods
 */
export const paperService = {
  /**
   * Get all papers
   */
  getAllPapers: async (): Promise<ApiResponse<PaperData[]>> => {
    const response = await api.get<PaperData[]>('paper/search');

    if (response.success && response.data) {
      // Transform the API data to match our Paper interface
      const transformedPapers = response.data.map(transformPaper);
      return {
        ...response,
        data: transformedPapers
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to get papers',
    };
  },

  /**
   * Get paper by ID
   */
  getPaperById: async (id: number): Promise<ApiResponse<PaperData>> => {
    const response = await api.get<PaperData>(`paper/getPaper/${id}`);

    if (response.success && response.data) {
      return {
        ...response,
        data: transformPaper(response.data)
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to get paper data',
    };
  },

  /**
   * Create a new paper
   */
  createPaper: async (paperData: CreatePaperData): Promise<ApiResponse<PaperData>> => {
    const response = await api.post<PaperData>('paper/createPaper', paperData);

    if (response.success && response.data) {
      return {
        ...response,
        data: transformPaper(response.data)
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to create paper',
    };
  },

  /**
   * Search and filter papers
   */
  searchPapers: async (params: PaperSearchParams): Promise<ApiResponse<PaperData[]>> => {
    // Convert params to query string
    const queryParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        // Handle array parameters (like tags)
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
    const endpoint = `paper/search${queryString ? `?${queryString}` : ''}`;

    const response = await api.get<PaperData[]>(endpoint);

    if (response.success && response.data) {
      const transformedPapers = response.data.map(transformPaper);
      return {
        ...response,
        data: transformedPapers
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to search papers',
    };
  },

  /**
   * Get papers by user
   */
  getPapersByUser: async (username: string): Promise<ApiResponse<PaperData[]>> => {
    const response = await api.get<PaperData[]>(`paper/getPapersByUser/${username}`);

    if (response.success && response.data) {
      const transformedPapers = response.data.map(transformPaper);
      return {
        ...response,
        data: transformedPapers
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to get user papers',
    };
  },

  /**
   * Update paper
   */
  updatePaper: async (id: number, paperData: Partial<CreatePaperData>): Promise<ApiResponse<PaperData>> => {
    const response = await api.put<PaperData>(`paper/updatePaper/${id}`, paperData);

    if (response.success && response.data) {
      return {
        ...response,
        data: transformPaper(response.data)
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to update paper',
    };
  },

  /**
   * Delete paper
   */
  deletePaper: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<void>(`paper/deletePaper/${id}`);

    return response;
  }
};
