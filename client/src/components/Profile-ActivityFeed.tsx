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
import CreatePostModal from "./CreatePostModal";
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

interface Author {
  name: string;
  role: string;
  avatar: string;
}

interface Post {
  id: string;
  author: Author;
  content: string;
  image?: string;
  tags: string[];
  visibility: string;
  createdAt: Date;
  likes: number;
  comments: number;
  reposts: number;
}

interface ActivityFeedProps {
  userData: Author & {
    followers: number;
  };
  posts: Post[];
  onCreatePost: (post: Post) => void;
  onEditPost: (post: Post) => void;
  onDeletePost: (postId: string) => void;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  userData,
  posts,
  onCreatePost,
  onEditPost,
  onDeletePost,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  const handleCreatePost = (newPost: Post) => {
    onCreatePost(newPost);
    setIsCreateModalOpen(false);
  };

  const handleEditPost = (updatedPost: Post) => {
    onEditPost(updatedPost);
    setEditingPost(null);
  };

  const handleDeleteConfirm = () => {
    if (deletingPostId) {
      onDeletePost(deletingPostId);
      setDeletingPostId(null);
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
                {userData.followers.toLocaleString()} followers
              </span>
            </div>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <PenSquare className="mr-2 h-4 w-4" />
              Create post
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onEdit={() => setEditingPost(post)}
              onDelete={() => setDeletingPostId(post.id)}
            />
          ))}
        </div>
      </CardContent>
      <CreatePostModal
        isOpen={isCreateModalOpen || !!editingPost}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingPost(null);
        }}
        onPostCreated={editingPost ? handleEditPost : handleCreatePost}
        userData={userData}
        editingPost={editingPost || undefined}
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

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start gap-4">
        <Avatar className="w-12 h-12 ring-2 ring-blue-100 ring-offset-2">
          <AvatarImage src={post.author.avatar} alt={post.author.name} />
          <AvatarFallback>{post.author.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors">
                {post.author.name}
              </h3>
              <p className="text-sm text-gray-500 font-medium">
                {post.author.role}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                <span>{new Date(post.createdAt).toLocaleString()}</span>
              </div>
            </div>
            <PostMenu onEdit={onEdit} onDelete={onDelete} />
          </div>
          <p className="mt-3 text-gray-700 leading-relaxed">{post.content}</p>
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
            {post.tags.map((tag) => (
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
  return (
    <div className="mt-4 flex gap-6 pt-4 border-t">
      <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors">
        <Heart className="h-5 w-5" />
        <span className="text-sm font-medium">
          {post.likes.toLocaleString()}
        </span>
      </button>
      <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
        <MessageCircle className="h-5 w-5" />
        <span className="text-sm font-medium">
          {post.comments.toLocaleString()}
        </span>
      </button>
      <button className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors">
        <Repeat2 className="h-5 w-5" />
        <span className="text-sm font-medium">
          {post.reposts.toLocaleString()}
        </span>
      </button>
    </div>
  );
};

export default ActivityFeed;
