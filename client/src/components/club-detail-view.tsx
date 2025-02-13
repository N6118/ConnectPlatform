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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Club {
  id: number;
  name: string;
  banner: string;
  logo: string;
  description: string;
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
  registrationLink?: string;
}

interface ActivityPost {
  id: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  content: string;
  images?: string[];
  type: "event" | "announcement" | "achievement" | "project-update";
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
  icon: "trophy" | "medal" | "certificate";
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
  upcomingEvents: [
    {
      id: "1",
      title: "Spring Hackathon 2024",
      description: "48-hour coding challenge to build innovative solutions",
      date: "2024-04-15",
      type: "Hackathon",
      location: "Main Campus, Building A",
      registrationLink: "https://example.com/register",
    },
    {
      id: "2",
      title: "AI Workshop Series",
      description:
        "Learn about the latest developments in AI and Machine Learning",
      date: "2024-03-30",
      type: "Workshop",
      location: "Virtual",
      registrationLink: "https://example.com/ai-workshop",
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

export default function ClubDetailView() {
  const [club, setClub] = useState<Club>(initialClub);
  const [activeSection, setActiveSection] = useState("Activities");
  const [showEventModal, setShowEventModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingPost, setEditingPost] = useState<ActivityPost | null>(null);
  const { toast } = useToast();

  const sections = [
    { name: "Activities", icon: CalendarDays },
    { name: "Achievements", icon: Trophy },
    { name: "Members", icon: Users },
  ];

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

  const handleSavePost = (content: string, image?: File) => {
    if (editingPost) {
      setClub((prev) => ({
        ...prev,
        activityFeed: prev.activityFeed.map((post) =>
          post.id === editingPost.id
            ? { ...post, content, timestamp: new Date().toISOString() }
            : post,
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
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80",
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

  const handleAddAchievement = (name: string, description: string) => {
    const newAchievement: Achievement = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      description,
      date: new Date().toISOString(),
      icon: "trophy",
    };
    setClub((prev) => ({
      ...prev,
      achievements: [...prev.achievements, newAchievement],
    }));
    setShowAchievementModal(false);
    toast({
      title: "Achievement added",
      description: "New achievement has been added successfully.",
    });
  };

  const handleAddMember = (name: string, role: string) => {
    const newMember: Member = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      role,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
      joinDate: new Date().toISOString(),
    };
    setClub((prev) => ({
      ...prev,
      members: [...prev.members, newMember],
    }));
    setShowMemberModal(false);
    toast({
      title: "Member added",
      description: "New member has been added successfully.",
    });
  };

  const renderUpcomingEvents = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-xl sm:text-2xl font-semibold">Upcoming Events</h3>
        <Button
          onClick={() => setShowEventModal(true)}
          variant="default"
          className="w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {club.upcomingEvents.map((event) => (
          <Card
            key={event.id}
            className="hover:shadow-lg transition-all duration-300"
          >
            <CardHeader className="space-y-3 p-6">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <CardTitle className="text-lg sm:text-xl">
                    {event.title}
                  </CardTitle>
                  <CardDescription className="mt-2 line-clamp-2">
                    {event.description}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="shrink-0">
                  {event.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 px-6">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {new Date(event.date).toLocaleDateString()}
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <div className="mt-1">📍</div>
                <span>{event.location}</span>
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-3">
              {event.registrationLink && (
                <Button
                  variant="outline"
                  className="w-full hover:bg-primary hover:text-primary-foreground transition-colors"
                  asChild
                >
                  <a
                    href={event.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Register Now
                  </a>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderActivityFeed = () => (
    <div className="space-y-4 mt-8">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold">Activity Feed</h3>
        <Button onClick={() => setShowPostModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Post
        </Button>
      </div>
      <div className="space-y-4">
        {club.activityFeed.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage
                    src={post.author.avatar}
                    alt={post.author.name}
                  />
                  <AvatarFallback>
                    {post.author.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{post.author.name}</CardTitle>
                  <CardDescription>{post.author.role}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditPost(post)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
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
            </CardContent>
            <CardFooter className="flex justify-between text-sm text-muted-foreground">
              <div className="flex gap-6">
                <button className="flex items-center gap-1 hover:text-primary">
                  <ThumbsUp className="h-4 w-4" />
                  {post.likes}
                </button>
                <button className="flex items-center gap-1 hover:text-primary">
                  <MessageCircle className="h-4 w-4" />
                  {post.comments}
                </button>
                <button className="flex items-center gap-1 hover:text-primary">
                  <Share2 className="h-4 w-4" />
                  {post.shares}
                </button>
              </div>
              <span>{new Date(post.timestamp).toLocaleString()}</span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAchievements = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold">Achievements</h3>
        <Button onClick={() => setShowAchievementModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Achievement
        </Button>
      </div>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {club.achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="group hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Trophy className="h-6 w-6 text-yellow-500" />
                    <CardTitle>{achievement.name}</CardTitle>
                  </div>
                  <CardDescription>{achievement.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Awarded: {new Date(achievement.date).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );

  const renderMembers = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold">Members</h3>
        <Button onClick={() => setShowMemberModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Member
        </Button>
      </div>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {club.members.map((member) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="group hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {member.role}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Joined: {new Date(member.joinDate).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );

  const renderSection = () => {
    switch (activeSection) {
      case "Activities":
        return (
          <>
            {renderUpcomingEvents()}
            <Separator className="my-8" />
            {renderActivityFeed()}
          </>
        );
      case "Achievements":
        return renderAchievements();
      case "Members":
        return renderMembers();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background antialiased">
      {/* Banner with logo and title */}
      <div className="relative w-full h-[250px] sm:h-[300px] lg:h-[400px]">
        <img
          src={club.banner}
          alt={club.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
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

      {/* Navigation */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-lg z-10 border-b">
        <nav className="flex justify-center px-2 py-2 sm:py-3 container">
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

      {/* Content section */}
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-card rounded-xl shadow-sm p-4 sm:p-6 lg:p-8">
          {renderSection()}
        </div>
      </div>

      {/* Modals with improved styling */}
      <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
        <DialogContent className="sm:max-w-[425px] p-6">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl">Create New Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Event Title</label>
              <Input className="w-full" placeholder="Enter event title" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                className="w-full min-h-[100px]"
                placeholder="Enter event description"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input type="date" className="w-full" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input className="w-full" placeholder="Enter location" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Registration Link (optional)
              </label>
              <Input className="w-full" placeholder="https://" />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowEventModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => setShowEventModal(false)}>
                Create Event
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Post Modal */}
      <Dialog
        open={showPostModal}
        onOpenChange={() => {
          setShowPostModal(false);
          setEditingPost(null);
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? "Edit Post" : "Create New Post"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Textarea
              placeholder="What's on your mind?"
              defaultValue={editingPost?.content}
            />
            <Input type="file" accept="image/*" />
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  handleSavePost(
                    document.querySelector("textarea")?.value || "",
                  );
                }}
              >
                {editingPost ? "Save Changes" : "Post"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Achievement Modal */}
      <Dialog
        open={showAchievementModal}
        onOpenChange={setShowAchievementModal}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Achievement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Input placeholder="Achievement Title" />
            <Textarea placeholder="Achievement Description" />
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  const title = document.querySelector("input")?.value || "";
                  const description =
                    document.querySelector("textarea")?.value || "";
                  handleAddAchievement(title, description);
                }}
              >
                Add Achievement
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Member Modal */}
      <Dialog open={showMemberModal} onOpenChange={setShowMemberModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Input placeholder="Member Name" />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="president">President</SelectItem>
                <SelectItem value="vice-president">Vice President</SelectItem>
                <SelectItem value="secretary">Secretary</SelectItem>
                <SelectItem value="treasurer">Treasurer</SelectItem>
                <SelectItem value="member">Member</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  const name = document.querySelector("input")?.value || "";
                  const role =
                    document.querySelector("select")?.value || "Member";
                  handleAddMember(name, role);
                }}
              >
                Add Member
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
