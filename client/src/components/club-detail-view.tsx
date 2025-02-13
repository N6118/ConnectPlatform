"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Trophy,
  Users,
  CalendarDays,
  MessageCircle,
  ThumbsUp,
  Share2,
  Calendar,
  Trash2,
  Edit2,
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

interface Club {
  id: number;
  name: string;
  banner: string;
  logo: string;
  description: string;
  membershipStatus: string;
  memberCount: {
    total: number;
    leaders: number;
    members: number;
  };
  roles: {
    name: string;
    member: string;
  }[];
  upcomingEvents: Event[];
  activityFeed: ActivityPost[];
  achievements: Achievement[];
  members: Member[];
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "Hackathon" | "Workshop" | "Meeting" | "Other";
  location: string;
}

interface ActivityPost {
  id: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  content: string;
  type: "announcement" | "event" | "achievement";
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  date: string;
  icon: string;
}

interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
  joinDate: string;
}

const initialClub: Club = {
  id: 1,
  name: "Tech Innovators Club",
  banner:
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80",
  logo: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?auto=format&fit=crop&q=80",
  description: "A community of tech enthusiasts building the future",
  membershipStatus: "active",
  memberCount: {
    total: 128,
    leaders: 4,
    members: 124,
  },
  roles: [
    { name: "President", member: "John Doe" },
    { name: "Vice President", member: "Jane Smith" },
    { name: "Secretary", member: "Alice Johnson" },
  ],
  upcomingEvents: [
    {
      id: "1",
      title: "Spring Hackathon 2024",
      description: "48-hour coding challenge to build innovative solutions",
      date: "2024-04-15",
      type: "Hackathon",
      location: "Main Campus, Building A",
    },
    {
      id: "2",
      title: "AI Workshop Series",
      description:
        "Learn about the latest developments in AI and Machine Learning",
      date: "2024-03-30",
      type: "Workshop",
      location: "Virtual",
    },
  ],
  activityFeed: [
    {
      id: "1",
      author: {
        name: "John Doe",
        role: "Club President",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80",
      },
      content:
        "Excited to announce that our AI Chatbot project has reached its first milestone! The team has successfully implemented the core NLP features. Great work everyone! 🎉",
      type: "project-update",
      timestamp: "2024-03-20T10:00:00Z",
      likes: 24,
      comments: 5,
      shares: 3,
    },
    {
      id: "2",
      author: {
        name: "Jane Smith",
        role: "Event Coordinator",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80",
      },
      content:
        "Last week's Web Development Workshop was a huge success! Thanks to all 50+ participants who joined us. Special thanks to our speakers for sharing their valuable insights.",
      images: [
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80",
      ],
      type: "event",
      timestamp: "2024-03-15T14:30:00Z",
      likes: 45,
      comments: 8,
      shares: 12,
    },
  ],
  achievements: [
    {
      id: "1",
      name: "Best Innovation Award",
      description: "First place in Regional Tech Competition",
      date: "2024-01-15",
      icon: "trophy",
    },
  ],
  members: [
    {
      id: "1",
      name: "John Doe",
      role: "President",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80",
      joinDate: "2023-01-01",
    },
    {
      id: "2",
      name: "Jane Smith",
      role: "Tech Lead",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80",
      joinDate: "2023-03-15",
    },
  ],
};

export default function ClubDetailView({ club: initialClubData }: { club: Club }) {
  const [club, setClub] = useState<Club>(initialClubData || initialClub);
  const [activeSection, setActiveSection] = useState("Activities");
  const [showPostModal, setShowPostModal] = useState(false);
  const [editingPost, setEditingPost] = useState<ActivityPost | null>(null);
  const { toast } = useToast();

  const handleDeletePost = (postId: string) => {
    setClub((prev) => ({
      ...prev,
      activityFeed: prev.activityFeed.filter((post) => post.id !== postId),
    }));
    toast({
      title: "Post deleted",
      description: "The post has been removed successfully.",
    });
  };

  const handleEditPost = (post: ActivityPost) => {
    setEditingPost(post);
    setShowPostModal(true);
  };

  const handleSavePost = (content: string) => {
    if (editingPost) {
      setClub((prev) => ({
        ...prev,
        activityFeed: prev.activityFeed.map((post) =>
          post.id === editingPost.id
            ? { ...post, content, timestamp: new Date().toISOString() }
            : post
        ),
      }));
      toast({
        title: "Post updated",
        description: "Your post has been updated successfully.",
      });
    } else {
      const newPost: ActivityPost = {
        id: Math.random().toString(36).substr(2, 9),
        author: {
          name: "John Doe",
          role: "Club President",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
        },
        content,
        type: "announcement",
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: 0,
        shares: 0,
      };
      setClub((prev) => ({
        ...prev,
        activityFeed: [newPost, ...prev.activityFeed],
      }));
      toast({
        title: "Post created",
        description: "Your post has been published successfully.",
      });
    }
    setShowPostModal(false);
    setEditingPost(null);
  };

  const renderActivities = () => (
    <div className="space-y-8">
      {/* Activity Feed */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-semibold">Activity Feed</h3>
          <Button onClick={() => setShowPostModal(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Post
          </Button>
        </div>
        <div className="space-y-6">
          {club.activityFeed.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <CardHeader className="space-y-0">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback>{post.author.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base font-semibold">
                        {post.author.name}
                      </CardTitle>
                      <CardDescription>{post.author.role}</CardDescription>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditPost(post)}
                      className="h-8 w-8"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeletePost(post.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {new Date(post.timestamp).toLocaleString()}
                </p>
                <p>{post.content}</p>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="flex space-x-4 text-muted-foreground">
                  <button className="flex items-center space-x-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center space-x-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.comments}</span>
                  </button>
                  <button className="flex items-center space-x-1">
                    <Share2 className="h-4 w-4" />
                    <span>{post.shares}</span>
                  </button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Club Banner Section */}
      <div className="relative h-[300px] lg:h-[400px] w-full overflow-hidden">
        <img
          src={club.banner}
          alt={club.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto flex items-end space-x-6">
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src={club.logo} alt={club.name} />
              <AvatarFallback>{club.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{club.name}</h1>
              <p className="text-white/80">{club.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto">
          <div className="flex h-14 items-center justify-center">
            <div className="flex space-x-4">
              {["Activities"].map((section) => (
                <Button
                  key={section}
                  variant={activeSection === section ? "default" : "ghost"}
                  onClick={() => setActiveSection(section)}
                >
                  {section}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderActivities()}
      </main>

      {/* Create/Edit Post Modal */}
      <Dialog
        open={showPostModal}
        onOpenChange={() => {
          setShowPostModal(false);
          setEditingPost(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPost ? "Edit Post" : "Create New Post"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Textarea
              placeholder="What's on your mind?"
              defaultValue={editingPost?.content}
              className="min-h-[100px]"
            />
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  const content = (
                    document.querySelector("textarea") as HTMLTextAreaElement
                  )?.value;
                  if (content) {
                    handleSavePost(content);
                  }
                }}
              >
                {editingPost ? "Save Changes" : "Post"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}