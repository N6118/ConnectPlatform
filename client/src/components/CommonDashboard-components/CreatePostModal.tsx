"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Upload, Hash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Post {
  id: string;
  content: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  image?: string;
  tags: string[];
  visibility: string;
  createdAt: Date;
  likes: number;
  comments: number;
  reposts: number;
}

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: Post) => void;
  userData: {
    name: string;
    role: string;
    avatar: string;
  };
  editingPost?: Post;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onPostCreated,
  userData,
  editingPost,
}) => {
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [visibility, setVisibility] = useState("public");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (editingPost) {
      setContent(editingPost.content);
      setSelectedTags(editingPost.tags);
      setVisibility(editingPost.visibility);
      // Note: We can't set the file here as we don't have access to the File object
    } else {
      resetForm();
    }
  }, [editingPost]);

  const resetForm = () => {
    setContent("");
    setSelectedFile(null);
    setVisibility("public");
    setSelectedTags([]);
    setNewTag("");
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Post content cannot be empty",
        variant: "destructive",
      });
      return;
    }

    const newPost: Post = {
      id: editingPost ? editingPost.id : Date.now().toString(),
      content,
      author: userData,
      image: selectedFile
        ? URL.createObjectURL(selectedFile)
        : editingPost?.image,
      tags: selectedTags,
      visibility,
      createdAt: editingPost ? editingPost.createdAt : new Date(),
      likes: editingPost ? editingPost.likes : 0,
      comments: editingPost ? editingPost.comments : 0,
      reposts: editingPost ? editingPost.reposts : 0,
    };

    onPostCreated(newPost);
    toast({
      title: editingPost ? "Post updated" : "Post created",
      description: editingPost
        ? "Your post has been successfully updated."
        : "Your post has been successfully created.",
    });
    onClose();
    resetForm();
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const addNewTag = () => {
    if (newTag && !selectedTags.includes(newTag)) {
      setSelectedTags([...selectedTags, newTag]);
      setNewTag("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{editingPost ? "Edit Post" : "Create Post"}</DialogTitle>
          <DialogDescription>
            Share your thoughts, achievements, or updates with your network
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="post-content">Content</Label>
            <Textarea
              id="post-content"
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[150px]"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="file-upload">Attachments</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file-upload"
                type="file"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              <Label
                htmlFor="file-upload"
                className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-100"
              >
                <Upload className="w-4 h-4" />
                Upload File
              </Label>
              {(selectedFile || editingPost?.image) && (
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm flex items-center gap-2">
                  {selectedFile ? selectedFile.name : "Current image"}
                  <button onClick={() => setSelectedFile(null)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm cursor-pointer"
                >
                  {tag}
                  <X className="w-3 h-3 inline ml-1" />
                </span>
              ))}
              <div className="flex items-center">
                <Input
                  type="text"
                  placeholder="Add new tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="w-32"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={addNewTag}
                >
                  <Hash className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="visibility">Visibility</Label>
            <select
              id="visibility"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="public">Public</option>
              <option value="department">Department Only</option>
              <option value="club">Club Specific</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {editingPost ? "Update" : "Post"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;
