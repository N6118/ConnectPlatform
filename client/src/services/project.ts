import { api, ApiResponse } from './api';
import { Project } from '@/components/ui/project-card1';

/**
 * Interface for API project data
 */
export interface ProjectData {
  id: number;
  projectName: string;
  projectDescription: string;
  projectStatus: string;
  projectImage?: string | null;
  tags: string[];
  techStack: string[];
  prerequisites?: string;
  level?: 'EASY' | 'MEDIUM' | 'HARD';
  isOpenForApplications?: boolean;
  mentor?: string;
  projectRepo?: string;
  projectDurationMonths?: number;
}

/**
 * Interface for project search parameters
 */
export interface ProjectSearchParams {
  projectName?: string;
  projectStatus?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  projectLevel?: 'EASY' | 'MEDIUM' | 'HARD';
  tags?: string[];
  username?: string;
  page?: number;
}

/**
 * Interface for project creation data
 */
export interface CreateProjectData {
  projectName: string;
  projectDescription: string;
  projectStatus?: string;
  projectImage?: string;
  tags?: string[];
  techStack?: string[];
  prerequisites?: string;
  level?: 'EASY' | 'MEDIUM' | 'HARD';
  isOpenForApplications?: boolean;
  projectRepo?: string;
  projectDurationMonths?: number;
}

/**
 * Interface for project application data
 */
export interface ProjectApplicationData {
  projectId: number;
  userId: number;
  message?: string;
}

/**
 * Transform raw API project data to match the Project interface
 */
export const transformProject = (project: ProjectData): Project => {
  // Ensure the status is one of the valid values
  const validStatus = (status: string): 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' => {
    switch (status) {
      case 'NOT_STARTED':
      case 'IN_PROGRESS':
      case 'COMPLETED':
        return status as 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
      default:
        return 'NOT_STARTED';
    }
  };

  return {
    id: project.id,
    name: project.projectName || '',
    description: project.projectDescription || '',
    status: validStatus(project.projectStatus),
    tags: Array.isArray(project.tags) ? project.tags : [],
    image: project.projectImage || '',
    about: project.projectDescription || '',
    techStack: Array.isArray(project.techStack) ? project.techStack : [],
    prerequisites: project.prerequisites ? [project.prerequisites] : [],
    members: [], // API doesn't provide members data
    mentor: project.mentor || "",
    projectRepo: project.projectRepo,
    projectLevel: project.level,
    projectDurationMonths: project.projectDurationMonths,
  };
};

/**
 * Project service methods
 */
export const projectService = {
  /**
   * Get all projects
   */
  getAllProjects: async (): Promise<ApiResponse<Project[]>> => {
    const response = await api.get<ProjectData[]>('project/search');

    if (response.success && response.data) {
      // Transform the API data to match our Project interface
      const transformedProjects = response.data.map(transformProject);
      return {
        ...response,
        data: transformedProjects
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to get projects',
    };
  },

  /**
   * Get project by ID
   */
  getProjectById: async (id: number): Promise<ApiResponse<Project>> => {
    const response = await api.get<ProjectData>(`project/getProject/${id}`);

    if (response.success && response.data) {
      return {
        ...response,
        data: transformProject(response.data)
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to get project data',
    };
  },

  /**
   * Create a new project
   */
  createProject: async (projectData: CreateProjectData): Promise<ApiResponse<Project>> => {
    const response = await api.post<ProjectData>('project/createProject', projectData);

    if (response.success && response.data) {
      return {
        ...response,
        data: transformProject(response.data)
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to create project',
    };
  },

  /**
   * Search and filter projects
   */
  searchProjects: async (params: ProjectSearchParams): Promise<ApiResponse<Project[]>> => {
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
    const endpoint = `project/search${queryString ? `?${queryString}` : ''}`;

    const response = await api.get<ProjectData[]>(endpoint);

    if (response.success && response.data) {
      const transformedProjects = response.data.map(transformProject);
      return {
        ...response,
        data: transformedProjects
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to search projects',
    };
  },

  /**
   * Get projects by user
   */
  getProjectsByUser: async (username: string): Promise<ApiResponse<Project[]>> => {
    const response = await api.get<ProjectData[]>(`project/getProjectsByUser/${username}`);

    if (response.success && response.data) {
      const transformedProjects = response.data.map(transformProject);
      return {
        ...response,
        data: transformedProjects
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to get user projects',
    };
  },

  /**
   * Get projects by mentor
   */
  getProjectsByMentor: async (mentorUsername: string): Promise<ApiResponse<Project[]>> => {
    const response = await api.get<ProjectData[]>(`project/getProjectsByMentor/${mentorUsername}`);

    if (response.success && response.data) {
      const transformedProjects = response.data.map(transformProject);
      return {
        ...response,
        data: transformedProjects
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to get mentor projects',
    };
  },

  /**
   * Apply to a project
   */
  applyToProject: async (applicationData: ProjectApplicationData): Promise<ApiResponse<any>> => {
    return api.post('project/apply', applicationData);
  },

  /**
   * Update project progress
   */
  updateProjectProgress: async (projectId: number, progressData: any): Promise<ApiResponse<any>> => {
    return api.post(`project/${projectId}/progress`, progressData);
  },
}; 