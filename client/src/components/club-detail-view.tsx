"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Trophy,
  Users,
  CalendarDays,
  MessageCircle,
  Share2,
  Calendar,
  Trash2,
  Edit2,
  ExternalLink,
  MoreHorizontal,
  Repeat2,
  Heart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

// Types
[Previous interfaces remain unchanged]

export default function ClubDetailView({
  club: initialClubData,
  currentUserId = "1",
}: {
  club: Club;
  currentUserId?: string;
}) {
  const [club, setClub] = useState<Club>(initialClubData || initialClub);
  const [activeSection, setActiveSection] = useState("Activities");
  const [showEventModal, setShowEventModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<ActivityPost | null>(null);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostImage, setNewPostImage] = useState<File | null>(null);
  const { toast } = useToast();

  // [Previous helper functions remain unchanged]

  const renderActivityFeed = () => (
    <div className="space-y-6 mt-8">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold">Activity Feed</h3>
        <Button
          onClick={() => {
            setEditingPost(null);
            setNewPostContent("");
            setNewPostImage(null);
            setShowPostModal(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Post
        </Button>
      </div>
      <div className="space-y-6">
        {club.activityFeed?.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={post.author.avatar} alt={post.author.name} />
                    <AvatarFallback>{post.author.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{post.author.name}</CardTitle>
                    <CardDescription>{post.author.role}</CardDescription>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(post.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                {(post.isEditable || post.author.id === currentUserId) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        setEditingPost(post);
                        setNewPostContent(post.content);
                        setShowPostModal(true);
                      }}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit post
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete post
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{post.content}</p>
              {post.images && post.images.length > 0 && (
                <div className="grid gap-4 grid-cols-1">
                  {post.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt="Post attachment"
                      className="rounded-lg w-full object-cover max-h-96"
                    />
                  ))}
                </div>
              )}
              {post.type && (
                <Badge variant="secondary" className="capitalize">
                  {post.type.replace('-', ' ')}
                </Badge>
              )}
            </CardContent>
            <CardFooter className="flex justify-between text-sm text-muted-foreground pt-2">
              <div className="flex gap-6">
                <button className="flex items-center gap-1 hover:text-primary transition-colors">
                  <Heart className={`h-4 w-4 ${post.likes > 0 ? 'fill-current' : ''}`} />
                  {post.likes}
                </button>
                <button className="flex items-center gap-1 hover:text-primary transition-colors">
                  <MessageCircle className="h-4 w-4" />
                  {post.comments}
                </button>
                <button className="flex items-center gap-1 hover:text-primary transition-colors">
                  <Repeat2 className="h-4 w-4" />
                  {post.shares}
                </button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={showPostModal} onOpenChange={setShowPostModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? "Edit Post" : "Create New Post"}
            </DialogTitle>
            <DialogDescription>
              Share updates, announcements, or achievements with your club members
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Textarea
              placeholder="What's on your mind?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="space-y-2">
              <label className="text-sm font-medium">Add Image (optional)</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setNewPostImage(e.target.files?.[0] || null)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPostModal(false);
                  setEditingPost(null);
                  setNewPostContent("");
                  setNewPostImage(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSavePost} disabled={!newPostContent.trim()}>
                {editingPost ? "Save Changes" : "Post"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );

  // [Previous render functions remain unchanged]

  return (
    <div className="min-h-screen bg-background antialiased">
      <div className="relative w-full h-[250px] sm:h-[300px] lg:h-[400px] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
        <img
          src={club.banner}
          alt={club.name}
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent rounded-lg" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6">
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-background shadow-xl">
              <AvatarImage src={club.logo} alt={club.name} />
              <AvatarFallback>{club.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                {club.name}
              </h1>
              <p className="text-sm sm:text-base text-white/90 max-w-2xl">
                {club.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-0 bg-background/80 backdrop-blur-lg z-10 border-b">
        <nav className="flex justify-center px-2 py-2 sm:py-3 max-w-7xl mx-auto">
          <div className="flex gap-1 sm:gap-2 w-full sm:w-auto justify-between sm:justify-center">
            {sections.map(({ name, icon: Icon }) => (
              <Button
                key={name}
                variant={activeSection === name ? "default" : "ghost"}
                className="flex-1 sm:flex-initial text-sm sm:text-base gap-2 px-3 sm:px-4"
                onClick={() => setActiveSection(name)}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{name}</span>
              </Button>
            ))}
          </div>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card rounded-xl shadow-sm p-4 sm:p-6 lg:p-8">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}
