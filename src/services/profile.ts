import { api, ApiResponse } from './api';
import { Post, Author } from '@/pages/types';

/**
 * Interface for profile information
 */
export interface ProfileInfo {
  id: string;
  name: string;
  headline?: string;
  rollNo: string;
  branch: string;
  course: string;
  college: string;
  semester: string;
  graduationYear: string;
  careerPath: string;
  followers: number;
  following: number;
  about: string;
  achievements: string[];
  interests: string[];
  socialLinks: {
    github: string;
    linkedin: string;
    portfolio: string;
  };
  avatar?: string;
}

/**
 * Interface for create post with media data
 */
export interface CreatePostDTO {
  content: string;
  type?: string;
  visibility?: 'PUBLIC' | 'PRIVATE' | 'FOLLOWERS';
  tags?: string[];
  clubId?: number;
}

/**
 * Interface for user profile response from API
 */
export interface UserProfileResponse {
  id: number;
  username: string;
  email: string;
  name: string;
  profilePicture: string | null;
  headline: string;
  role: string;
  post: Array<{
    id: string;
    type: string;
    visibility: string;
    content: string;
    createdAt: string;
    likes: number;
    comments: number;
    isLikedByUser: boolean | null;
    isBookmarked: boolean | null;
    author: {
      name: string | null;
      profilePicture: string | null;
      headline: string;
    };
    media: string | null;
    tags: string[] | null;
    commentList: any[] | null;
  }> | null;
  socialLinks: {
    github: string;
    linkedin: string;
    portfolio: string;
  };
  studentDetails: {
    enrollmentNumber: string;
    branch: string;
    course: string;
    college: string;
    semester: string;
    graduationYear: string;
    section: string;
  };
  facultyDetails?: {
    employeeId: string;
    department: string;
    designation: string;
    specialization: string;
    qualification: string;
  };
  achievement: string[];
  interest: string[];
  about?: string;
  followers?: number;
  following?: number;
  active: boolean;
}

/**
 * Interface for performance data
 */
export interface PerformanceData {
  cgpa: number;
  currentSemester: string;
  coursesCompleted: number;
  totalCredits: number;
  earnedCredits: number;
  attendance: number;
}

/**
 * Interface for skills data
 */
export interface SkillData {
  name: string;
  level: number;
  category: string;
}

/**
 * Interface for work item (projects, papers, internships, extracurricular)
 */
export interface WorkItem {
  id: number;
  name?: string;
  title?: string;
  description?: string;
  status: string;
  level?: string;
  verified?: string;
  faculty?: string;
  activity?: string;
  techStack?: string[];
  collaborators?: string[];
  date?: string;
  achievement?: string;
  citations?: number;
  journal?: string;
}

/**
 * Interface for creating a new work item
 */
export interface CreateWorkItemData {
  name?: string;
  title?: string;
  description?: string;
  status: string;
  level?: string;
  faculty?: string;
  activity?: string;
  techStack?: string[];
  collaborators?: string[];
  date?: string;
  achievement?: string;
  journal?: string;
}

/**
 * Interface for updating profile information
 */
export interface UpdateProfileData {
  about?: string;
  achievement?: string[];
  interest?: string[];
  socialLinks?: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
  };
}

/**
 * Interface for work data
 */
export interface WorkData {
  PROJECTS: WorkItem[];
  PAPERS: WorkItem[];
  INTERNSHIPS: WorkItem[];
  EXTRACURRICULAR: WorkItem[];
  [key: string]: WorkItem[];
}

/**
 * Profile service methods
 */
export const profileService = {
  /**
   * Get profile information by user ID
   */
  getProfileById: async (userId: string): Promise<ApiResponse<ProfileInfo>> => {
    return api.get<ProfileInfo>(`profiles/${userId}`);
  },

  /**
   * Get profile information by username
   */
  getProfileByUsername: async (username: string): Promise<ApiResponse<UserProfileResponse>> => {
    return api.get<UserProfileResponse>(`user/${username}`);
  },

  /**
   * Get current user's profile information
   */
  getCurrentProfile: async (): Promise<ApiResponse<ProfileInfo>> => {
    return api.get<ProfileInfo>('profiles/me');
  },

  /**
   * Update profile information
   */
  updateProfile: async (profileData: UpdateProfileData): Promise<ApiResponse<ProfileInfo>> => {
    return api.put<ProfileInfo>('profiles/me', profileData);
  },

  /**
   * Update profile picture
   */
  updateProfilePicture: async (formData: FormData): Promise<ApiResponse<{ avatarUrl: string }>> => {
    // Don't set content-type header for FormData, browser will set it automatically with proper boundary
    return api.post<{ avatarUrl: string }>('profiles/me/avatar', formData);
  },

  /**
   * Get user performance data
   */
  getPerformanceData: async (): Promise<ApiResponse<PerformanceData>> => {
    return api.get<PerformanceData>('profiles/me/performance');
  },

  /**
   * Get user skills data
   */
  getSkillsData: async (): Promise<ApiResponse<SkillData[]>> => {
    return api.get<SkillData[]>('profiles/me/skills');
  },

  /**
   * Get user work data
   */
  getWorkData: async (): Promise<ApiResponse<WorkData>> => {
    return api.get<WorkData>('profiles/me/work');
  },

  /**
   * Add work item
   */
  addWorkItem: async (type: string, workItemData: CreateWorkItemData): Promise<ApiResponse<WorkItem>> => {
    return api.post<WorkItem>(`profiles/me/work/${type.toLowerCase()}`, workItemData);
  },

  /**
   * Update work item
   */
  updateWorkItem: async (type: string, itemId: number, workItemData: Partial<CreateWorkItemData>): Promise<ApiResponse<WorkItem>> => {
    return api.put<WorkItem>(`profiles/me/work/${type.toLowerCase()}/${itemId}`, workItemData);
  },

  /**
   * Delete work item
   */
  deleteWorkItem: async (type: string, itemId: number): Promise<ApiResponse<void>> => {
    return api.delete(`profiles/me/work/${type.toLowerCase()}/${itemId}`);
  },

  /**
   * Get user posts
   */
  getPosts: async (): Promise<ApiResponse<Post[]>> => {
    return api.get<Post[]>('profiles/me/posts');
  },

  /**
   * Create a new post with media
   */
  createPostWithMedia: async (postData: CreatePostDTO, mediaFile?: File): Promise<ApiResponse<Post>> => {
    console.log('Creating post with media');
    console.log('Post data:', JSON.stringify(postData, null, 2));
    console.log('Media file:', mediaFile ? {
      name: mediaFile.name,
      type: mediaFile.type,
      size: `${(mediaFile.size / 1024).toFixed(2)} KB`
    } : 'None');

    // Create FormData object
    const formData = new FormData();

    // Add post data as a JSON string - this is crucial for Spring @RequestPart
    formData.append('post', JSON.stringify(postData));

    // Add media file if provided
    if (mediaFile) {
      formData.append('mediaFile', mediaFile);
      console.log(`Added file ${mediaFile.name} to formData`);
    }

    // Verify the FormData contents
    console.log('FormData contents verification:');
    const formDataKeys: string[] = [];
    formData.forEach((value, key) => {
      if (value instanceof File) {
        formDataKeys.push(`${key}: File (${value.name}, ${value.type})`);
      } else {
        formDataKeys.push(`${key}: ${typeof value}`);
      }
    });
    console.log(formDataKeys);

    // Use the correct endpoint that supports multipart/form-data
    // The server expects a POST request to /api/post/create-with-media
    return api.post<Post>('posts', formData, { headers: { /* leave Content-Type out */ } });
  },

  /**
   * Create a new post
   */
  createPost: async (postData: Partial<Post>): Promise<ApiResponse<Post>> => {
    return api.post<Post>('posts', postData);
  },

  /**
   * Update a post
   */
  updatePost: async (postId: string, postData: Partial<Post>): Promise<ApiResponse<Post>> => {
    return api.put<Post>(`posts/${postId}`, postData);
  },

  /**
   * Delete a post
   */
  deletePost: async (postId: string): Promise<ApiResponse<void>> => {
    return api.delete(`posts/${postId}`);
  },

  /**
   * Update user profile using PATCH endpoint
   */
  updateUserProfile: async (username: string, updateData: any): Promise<ApiResponse<UserProfileResponse>> => {
    console.log(`PATCH request to user/${username} with data:`, JSON.stringify(updateData, null, 2));

    // Ensure the about field is correctly formatted if it exists
    if (updateData.about !== undefined) {
      console.log('About field present:', updateData.about);
    }

    return api.patch<UserProfileResponse>(`user/${username}`, updateData);
  },
};

export default profileService; 