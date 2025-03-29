"use client";

import type React from "react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  PenSquare,
  MoreHorizontal,
  Heart,
  MessageCircle,
  Repeat2,
  Trash2,
  Edit,
} from "lucide-react";
import CreatePostModal from "@/components/CommonDashboard-components/CreatePostModal";
import { useToast } from "../hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Post, Author } from "@/pages/types";
import { PostData } from "@/services/post";
import CreatePostButton from "@/components/CommonDashboard-components/CreatePostButton";
import { api } from "@/services/api";

// Helper function to convert PostData to Post
const convertPostDataToPost = (postData: PostData, author: Author): Post => {
  if (!postData) {
    console.error("Invalid postData received:", postData);
    // Return a fallback post object
    return {
      id: new Date().getTime().toString(),
      content: "",
      createdAt: new Date(),
      timestamp: new Date(),
      tags: [],
      likes: 0,
      comments: 0,
      reposts: 0,
      shares: 0,
      isEditable: true,
      author: {
        ...author,
        id: author?.id?.toString() || ""
      },
      type: "EVENT",
      visibility: "PUBLIC"
    };
  }
  
  console.log("Converting PostData to Post:", JSON.stringify(postData));
  
  // Ensure the ID is converted to a string (critical fix)
  let postId: string;
  if (typeof postData.id === 'number') {
    postId = postData.id.toString();
  } else if (postData.id) {
    postId = String(postData.id);
  } else {
    postId = new Date().getTime().toString();
  }
  
  // Create proper author object
  const authorObject: Author = {
    id: author?.id?.toString() || "",
    name: postData.authorName || author?.name || "Unknown User",
    role: author?.role || "",
    avatar: postData.authorAvatar || author?.avatar || "./defaultProfile.jpg"
  };
    
  return {
    id: postId,
    content: postData.content || "",
    title: postData.title,
    createdAt: postData.createdAt ? new Date(postData.createdAt) : new Date(),
    timestamp: postData.createdAt ? new Date(postData.createdAt) : new Date(),
    tags: [], // API doesn't provide tags in PostData interface
    likes: postData.likes || 0,
    comments: postData.comments || 0,
    reposts: 0,
    shares: 0,
    isEditable: true,
    author: authorObject,
    image: postData.media?.url,
    type: postData.type || "EVENT",
    visibility: "PUBLIC" // Default visibility as not provided in PostData
  };
};

interface ActivityFeedProps {
  clubId: number;
  userData: Author & {
    followers: number;
  };
  posts: Post[];
  onCreatePost: (post: Post) => void;
  onEditPost: (post: Post) => void;
  onDeletePost: (postId: string) => void;
}

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: PostData) => void;
  userData: Author & { followers: number };
  editingPost?: Post | null;
}

const createPost = async (clubId: number, post: Post) => {
  console.log('Creating post with data:', JSON.stringify(post));
  
  // Make sure club ID is treated as a number
  const clubIdNum = Number(clubId) || 1;
  
  // Ensure proper format for API request
  const postData = {
    ...post,
    authorId: post.author?.id ? Number(post.author.id) || undefined : undefined
  };
  
  return api.post(`clubs/${clubIdNum}/posts`, postData);
};

const updatePost = async (clubId: number, postId: string, post: Post) => {
  console.log('Updating post with data:', JSON.stringify(post));
  
  // Ensure proper format for API request
  const postData = {
    ...post,
    authorId: post.author?.id ? Number(post.author.id) || undefined : undefined
  };
  
  return api.patch(`posts/${postId}`, postData);
};

const deletePost = async (clubId: number, postId: string) => {
  return api.delete(`post/${postId}`);
};

// Profile-ActivityFeed custom modal wrapper
const PostModalWrapper = ({
  isOpen,
  onClose,
  onSubmit,
  editingPost
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: Post) => void;
  editingPost?: Post | null;
}) => {
  // Handle the conversion from PostData to Post and call the parent handler
  const handlePostCreated = (postData: PostData) => {
    try {
      if (!postData) {
        console.error("Received undefined postData in handlePostCreated");
        return;
      }
      
      console.log("PostModalWrapper received data:", JSON.stringify(postData));
      
      // Make sure we have a valid author, even if editingPost is null
      const author = editingPost?.author || { 
        id: "", 
        name: "User", 
        role: "", 
        avatar: "" 
      };
      
      // When editing a post, preserve the original ID
      if (editingPost && editingPost.id) {
        postData.id = parseInt(editingPost.id) || new Date().getTime();
      }
      
      const post = convertPostDataToPost(postData, author);
      
      console.log('Converted post:', JSON.stringify(post));
      
      // Ensure the post has all required fields
      const validatedPost: Post = {
        ...post,
        id: post.id || new Date().getTime().toString(),
        content: post.content || "",
        author: post.author || author,
        tags: Array.isArray(post.tags) ? post.tags : [],
        visibility: post.visibility || "PUBLIC",
        createdAt: post.createdAt || new Date(),
        timestamp: post.timestamp || new Date(),
        likes: post.likes || 0,
        comments: post.comments || 0,
        reposts: post.reposts || 0,
        shares: post.shares || 0,
        type: post.type || "EVENT",
        isEditable: true
      };
      
      console.log('Final validated post:', JSON.stringify(validatedPost));
      onSubmit(validatedPost);
    } catch (error) {
      console.error("Error processing post data:", error);
    }
  };

  // CreatePostModal only accepts isOpen, onClose, and onPostCreated
  return (
    <CreatePostModal
      isOpen={isOpen}
      onClose={onClose}
      onPostCreated={handlePostCreated}
    />
  );
};

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  clubId,
  userData,
  posts,
  onCreatePost,
  onEditPost,
  onDeletePost,
}) => {
  console.log("ActivityFeed userData:", JSON.stringify(userData));
  console.log("ActivityFeed posts:", posts ? posts.length : 0);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  const handleCreatePost = async (newPost: Partial<Post>) => {
    try {
      console.log("Attempting to create post:", JSON.stringify(newPost));
      const response = await createPost(clubId, newPost as Post);
      console.log("Create post response:", response);
      
      if (response && response.data) {
        onCreatePost(response.data);
        setIsCreateModalOpen(false);
      } else {
        console.error("Create post response has no data:", response);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleEditPost = async (updatedPost: Partial<Post>) => {
    if (!editingPost) {
      console.error("No editing post set");
      return;
    }
    
    try {
      console.log("Attempting to update post:", JSON.stringify(updatedPost));
      console.log("Original post ID:", editingPost.id);
      
      const response = await updatePost(clubId, editingPost.id, updatedPost as Post);
      console.log("Update post response:", response);
      
      if (response && response.data) {
        onEditPost(response.data);
        setEditingPost(null);
      } else {
        console.error("Update post response has no data:", response);
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingPostId) {
      try {
        await deletePost(clubId, deletingPostId);
        onDeletePost(deletingPostId);
        setDeletingPostId(null);
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  // Handle post creation from CreatePostButton
  const handleCreatePostButtonSubmit = (postData: PostData) => {
    try {
      if (!postData) {
        console.error("Received undefined postData from CreatePostButton");
        return;
      }
      
      console.log("Received post data from CreatePostButton:", JSON.stringify(postData));
      
      // Convert PostData to Post format
      const post = convertPostDataToPost(postData, userData);
      
      // Use the existing handler for post creation
      handleCreatePost(post);
    } catch (error) {
      console.error("Error processing post data from CreatePostButton:", error);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto mt-8">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Your Activity
            </h2>
            <p className="text-gray-500 mt-1">Keep your network updated </p>
          </div>
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-gray-600 font-medium">
                {(userData?.followers || 0).toLocaleString()} followers
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <CreatePostButton 
            onPostCreated={handleCreatePostButtonSubmit}
            userData={{
              name: userData.name,
              role: userData.role,
              avatar: userData.avatar || "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI0LTAxL3Jhd3BpeGVsb2ZmaWNlMTJfcGhvdG9fb2ZfeW91bmdfaW5kaWFuX2dpcmxfaG9sZGluZ19zdHVkZW50X2JhY19hNDdmMzk1OS0zZDAyLTRiZWEtYTEzOS1lYzI0ZjdhNjEwZGFfMS5qcGc.jpg"
            }}
          />
        </div>

        <div className="space-y-6">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              post && post.id ? (
                <PostCard
                  key={post.id}
                  post={post}
                  onEdit={() => setEditingPost(post)}
                  onDelete={() => setDeletingPostId(post.id)}
                />
              ) : null
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No posts yet. Create your first post!
            </div>
          )}
        </div>
      </CardContent>
      <PostModalWrapper
        isOpen={isCreateModalOpen || !!editingPost}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingPost(null);
        }}
        onSubmit={editingPost ? handleEditPost : handleCreatePost}
        editingPost={editingPost}
      />
      <AlertDialog
        open={!!deletingPostId}
        onOpenChange={() => setDeletingPostId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this post?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              post and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

const PostCard: React.FC<{
  post: Post;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ post, onEdit, onDelete }) => {
  const { toast } = useToast();

  // Safety check for post data
  if (!post || !post.author) {
    console.error("Invalid post data:", post);
    return null;
  }

  // Ensure author object has all required properties
  const author = {
    name: post.author.name || "User",
    role: post.author.role || "",
    avatar: post.author.avatar || "./defaultProfile.jpg"
  };

  // Format date safely
  const formattedDate = (() => {
    try {
      return post.createdAt instanceof Date 
        ? post.createdAt.toLocaleString() 
        : new Date(post.createdAt as any).toLocaleString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return new Date().toLocaleString();
    }
  })();

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start gap-4">
        <Avatar className="w-12 h-12 ring-2 ring-blue-100 ring-offset-2">
          <AvatarImage src={author.avatar} alt={author.name} />
          <AvatarFallback>{(author.name || "?")[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors">
                {author.name}
              </h3>
              <p className="text-sm text-gray-500 font-medium">
                {author.role}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                <span>{formattedDate}</span>
                {post.type && (
                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {post.type}
                  </span>
                )}
              </div>
            </div>
            {post.isEditable && <PostMenu onEdit={onEdit} onDelete={onDelete} />}
          </div>
          
          {/* Display title if available */}
          {post.title && (
            <h4 className="mt-2 text-lg font-semibold text-gray-900">
              {post.title}
            </h4>
          )}
          
          <p className="mt-3 text-gray-700 leading-relaxed whitespace-pre-line">{post.content || ""}</p>
          {post.image && (
            <div className="mt-3 rounded-lg overflow-hidden">
              <img
                src={post.image || "/placeholder.svg"}
                alt="Post attachment"
                className="w-full h-auto object-cover"
              />
            </div>
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            {Array.isArray(post.tags) && post.tags.length > 0 && post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
          <PostActions post={post} />
        </div>
      </div>
    </Card>
  );
};

const PostMenu: React.FC<{ onEdit: () => void; onDelete: () => void }> = ({
  onEdit,
  onDelete,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-gray-100 rounded-full"
        >
          <MoreHorizontal className="h-5 w-5 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit} className="flex items-center">
          <Edit className="mr-2 h-4 w-4" />
          Edit post
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onDelete}
          className="text-red-600 flex items-center"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete post
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const PostActions: React.FC<{ post: Post }> = ({ post }) => {
  if (!post) return null;
  
  return (
    <div className="mt-4 flex gap-6 pt-4 border-t">
      <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors">
        <Heart className="h-5 w-5" />
        <span className="text-sm font-medium">
          {(post.likes || 0).toLocaleString()}
        </span>
      </button>
      <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
        <MessageCircle className="h-5 w-5" />
        <span className="text-sm font-medium">
          {(post.comments || 0).toLocaleString()}
        </span>
      </button>
      <button className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors">
        <Repeat2 className="h-5 w-5" />
        <span className="text-sm font-medium">
          {(post.reposts || 0).toLocaleString()}
        </span>
      </button>
    </div>
  );
};

export default ActivityFeed;
