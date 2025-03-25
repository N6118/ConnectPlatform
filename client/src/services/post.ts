import { api, ApiResponse } from './api';

/**
 * Interface for post data from API
 */
export interface PostData {
  id: number;
  title: string;
  content: string;
  authorId: number;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  comments: number;
  type: string;
  media?: {
    type: 'image' | 'video';
    url: string;
  };
  isLiked?: boolean;
  isBookmarked?: boolean;
}

/**
 * Interface for creating a new post
 */
export interface CreatePostData {
  title: string;
  content: string;
  type: string;
  media?: {
    type: 'image' | 'video';
    url: string;
  };
}

/**
 * Interface for post comment
 */
export interface PostComment {
  id: number;
  content: string;
  authorId: number;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
}

/**
 * Interface for creating a comment
 */
export interface CreateCommentData {
  content: string;
}

/**
 * Interface for post search parameters
 */
export interface PostSearchParams {
  searchTerm?: string;
  authorId?: number;
  tag?: string;
  page?: number;
  limit?: number;
}

/**
 * Transform raw API post data to match the frontend interface
 */
export const transformPost = (post: PostData): PostData => ({
  ...post,
  createdAt: new Date(post.createdAt).toLocaleDateString(),
  updatedAt: new Date(post.updatedAt).toLocaleDateString(),
});

/**
 * Post service methods
 */
export const postService = {
  /**
   * Get all posts with pagination
   */
  getAllPosts: async (page: number = 1, limit: number = 10): Promise<ApiResponse<PostData[]>> => {
    const response = await api.get<PostData[]>(`posts?page=${page}&limit=${limit}`);
    
    if (response.success && response.data) {
      return {
        ...response,
        data: response.data.map(transformPost)
      };
    }
    
    return {
      success: false,
      error: response.error || 'Failed to get posts',
    };
  },

  /**
   * Get post by ID
   */
  getPostById: async (id: number): Promise<ApiResponse<PostData>> => {
    const response = await api.get<PostData>(`posts/${id}`);
    
    if (response.success && response.data) {
      return {
        ...response,
        data: transformPost(response.data)
      };
    }
    
    return {
      success: false,
      error: response.error || 'Failed to get post',
    };
  },

  /**
   * Create a new post
   */
  createPost: async (postData: CreatePostData): Promise<ApiResponse<PostData>> => {
    const response = await api.post<PostData>('posts', postData);
    
    if (response.success && response.data) {
      return {
        ...response,
        data: transformPost(response.data)
      };
    }
    
    return {
      success: false,
      error: response.error || 'Failed to create post',
    };
  },

  /**
   * Update a post
   */
  updatePost: async (id: number, postData: Partial<CreatePostData>): Promise<ApiResponse<PostData>> => {
    const response = await api.put<PostData>(`posts/${id}`, postData);
    
    if (response.success && response.data) {
      return {
        ...response,
        data: transformPost(response.data)
      };
    }
    
    return {
      success: false,
      error: response.error || 'Failed to update post',
    };
  },

  /**
   * Delete a post
   */
  deletePost: async (id: number): Promise<ApiResponse<void>> => {
    return api.delete(`posts/${id}`);
  },

  /**
   * Search posts
   */
  searchPosts: async (params: PostSearchParams): Promise<ApiResponse<PostData[]>> => {
    const queryParams = new URLSearchParams();
    
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    }
    
    const queryString = queryParams.toString();
    const endpoint = `posts/search${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get<PostData[]>(endpoint);
    
    if (response.success && response.data) {
      return {
        ...response,
        data: response.data.map(transformPost)
      };
    }
    
    return {
      success: false,
      error: response.error || 'Failed to search posts',
    };
  },

  /**
   * Get posts by user
   */
  getPostsByUser: async (userId: number, page: number = 1, limit: number = 10): Promise<ApiResponse<PostData[]>> => {
    const response = await api.get<PostData[]>(`posts/user/${userId}?page=${page}&limit=${limit}`);
    
    if (response.success && response.data) {
      return {
        ...response,
        data: response.data.map(transformPost)
      };
    }
    
    return {
      success: false,
      error: response.error || 'Failed to get user posts',
    };
  },

  /**
   * Like/Unlike a post
   */
  toggleLike: async (postId: number): Promise<ApiResponse<PostData>> => {
    const response = await api.post<PostData>(`posts/${postId}/like`);
    
    if (response.success && response.data) {
      return {
        ...response,
        data: transformPost(response.data)
      };
    }
    
    return {
      success: false,
      error: response.error || 'Failed to toggle like',
    };
  },

  /**
   * Bookmark/Unbookmark a post
   */
  toggleBookmark: async (postId: number): Promise<ApiResponse<PostData>> => {
    const response = await api.post<PostData>(`posts/${postId}/bookmark`);
    
    if (response.success && response.data) {
      return {
        ...response,
        data: transformPost(response.data)
      };
    }
    
    return {
      success: false,
      error: response.error || 'Failed to toggle bookmark',
    };
  },

  /**
   * Get post comments
   */
  getComments: async (postId: number): Promise<ApiResponse<PostComment[]>> => {
    return api.get<PostComment[]>(`posts/${postId}/comments`);
  },

  /**
   * Add a comment to a post
   */
  addComment: async (postId: number, commentData: CreateCommentData): Promise<ApiResponse<PostComment>> => {
    return api.post<PostComment>(`posts/${postId}/comments`, commentData);
  },

  /**
   * Delete a comment
   */
  deleteComment: async (postId: number, commentId: number): Promise<ApiResponse<void>> => {
    return api.delete(`posts/${postId}/comments/${commentId}`);
  },

  /**
   * Like/Unlike a comment
   */
  toggleCommentLike: async (postId: number, commentId: number): Promise<ApiResponse<PostComment>> => {
    return api.post<PostComment>(`posts/${postId}/comments/${commentId}/like`);
  },
}; 