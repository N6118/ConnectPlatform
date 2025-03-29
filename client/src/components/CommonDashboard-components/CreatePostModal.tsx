"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { postService, PostData, CreatePostData } from "@/services/post";
import { Post } from "@/pages/types";

// Extended interface that includes id for editing posts
interface EditPostData extends CreatePostData {
  id?: string | number;
}

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: PostData) => void;
  editingPost?: Post | null;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onPostCreated, editingPost }) => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Populate form with editing post data when available
  useEffect(() => {
    if (editingPost) {
      setContent(editingPost.content || "");
      setTitle(editingPost.title || "");
      setCategory(editingPost.type || "");
      setImageUrl(editingPost.image || "");
    } else {
      // Reset form when not editing
      setContent("");
      setTitle("");
      setCategory("");
      setImageUrl("");
    }
  }, [editingPost]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Log what we're submitting
      console.log('Submitting post with title:', title, 'content:', content, 'category:', category);
      
      const postData: EditPostData = {
        title,
        content,
        type: category,
        media: imageUrl ? { type: "image", url: imageUrl } : undefined,
      };
      
      // If editing, preserve the post ID
      if (editingPost) {
        postData.id = editingPost.id;
      }

      let response;
      if (editingPost) {
        console.log('Updating existing post:', postData);
        console.log('Post ID before update:', postData.id, 'Type:', typeof postData.id);
        
        // Directly use the original ID without conversion
        const postId = editingPost.id;
        console.log('Using original post ID for update:', postId);
        
        response = await postService.updatePost(postId, postData);
      } else {
        console.log('Creating new post:', postData);
        response = await postService.createPost(postData);
      }
      
      console.log('Post response:', response);
      
      if (response.success && response.data) {
        // Log the data before passing it to the parent
        console.log('Post operation successful:', response.data);
        onPostCreated(response.data);
        onClose();
        // Reset form
        setContent("");
        setTitle("");
        setCategory("");
        setImageUrl("");
      }
    } catch (error) {
      console.error('Failed to handle post operation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-lg w-full max-w-2xl p-6"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {editingPost ? "Edit Post" : "Create New Post"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="min-h-[150px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EVENT">Event</SelectItem>
                <SelectItem value="PUBLICATION">Publication</SelectItem>
                <SelectItem value="HACKATHON">Hackathon</SelectItem>
                <SelectItem value="PROJECT">Project</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL (optional)</Label>
            <div className="flex gap-2">
              <Input
                id="image"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL"
              />
              {imageUrl && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setImageUrl("")}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? (editingPost ? "Updating..." : "Creating...") 
                : (editingPost ? "Update Post" : "Create Post")}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CreatePostModal;
