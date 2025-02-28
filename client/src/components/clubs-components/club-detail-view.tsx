"use client";

import { useState, useEffect } from "react";
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
  ThumbsUp,
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface Club {
  id: number;
  name: string;
  banner: string;
  logo: string;
  description: string;
  memberCount: {
    total: number;
    leaders: number;
    members: number;
  };
  upcomingEvents: Event[];
  activityFeed: Post[];
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

interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    role: string;
    avatar: string;
  };
  content: string;
  type: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isEditable: boolean;
  images?: string[];
}

const initialClub: Club = {
  id: 1,
  name: "Tech Innovators Club",
  banner:
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80",
  logo: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?auto=format&fit=crop&q=80",
  description: "A community of tech enthusiasts building the future",
  memberCount: {
    total: 128,
    leaders: 4,
    members: 124,
  },
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
        id: "1",
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
      isEditable: true,
    },
    {
      id: "2",
      author: {
        id: "2",
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
      isEditable: true,
    },
    {
      id: "3",
      author: {
        id: "3",
        name: "Alice Johnson",
        role: "Technical Lead",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80",
      },
      content: "Our club just won the 'Best Technical Innovation' award at the Inter-College Tech Summit 2024! 🏆 Proud of our amazing team's dedication and hard work. #TechInnovators #Achievement",
      images: ["https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80"],
      type: "achievement",
      timestamp: "2024-03-10T09:15:00Z",
      likes: 78,
      comments: 15,
      shares: 25,
      isEditable: true,
    },
    {
      id: "4",
      author: {
        id: "4",
        name: "David Chen",
        role: "Project Manager",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80",
      },
      content: "📢 Important Update: We're starting a new project series on Blockchain Development! If you're interested in learning about Web3 technologies, join us this Friday for the kickoff meeting. No prior experience needed! #blockchain #learning",
      type: "announcement",
      timestamp: "2024-03-05T16:45:00Z",
      likes: 56,
      comments: 12,
      shares: 18,
      isEditable: true,
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
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80",
      joinDate: "2023-01-01",
    },
    {
      id: "2",
      name: "Jane Smith",
      role: "Tech Lead",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80",
      joinDate: "2023-03-15",
    },
  ],
};

const fetchClubDetails = async (id: number) => {
  const response = await fetch(`/api/clubs/${id}`);
  return response.json();
};

const fetchClubAchievements = async (id: number) => {
  const response = await fetch(`/api/clubs/${id}/achievements`);
  return response.json();
};

const fetchClubPosts = async (id: number) => {
  const response = await fetch(`/api/clubs/${id}/posts`);
  return response.json();
};

export default function ClubDetailView({
  clubId,
  currentUserId = "1",
}: {
  clubId: number;
  currentUserId?: string;
}) {
  const [club, setClub] = useState<Club | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [activeSection, setActiveSection] = useState("Activities");
  const [showEventModal, setShowEventModal] = useState(false);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const { toast } = useToast();

  const sections = [
    { name: "Activities", icon: CalendarDays },
    { name: "Achievements", icon: Trophy },
    { name: "Members", icon: Users },
  ];

  useEffect(() => {
    const loadClubData = async () => {
      try {
        const [clubData, achievementsData, postsData] = await Promise.all([
          fetchClubDetails(clubId),
          fetchClubAchievements(clubId),
          fetchClubPosts(clubId)
        ]);
        
        setClub(clubData);
        setAchievements(achievementsData);
        setPosts(postsData.data);
      } catch (error) {
        console.error('Error loading club data:', error);
      }
    };

    loadClubData();
  }, [clubId]);

  const handleAddAchievement = (name: string, description: string) => {
    const newAchievement: Achievement = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      description,
      date: new Date().toISOString(),
      icon: "trophy",
    };
    setClub((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        achievements: [...prev.achievements, newAchievement],
      };
    });
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
    setClub((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        members: [...prev.members, newMember],
      };
    });
    setShowMemberModal(false);
    toast({
      title: "Member added",
      description: "New member has been added successfully.",
    });
  };

  const handleEventRegistration = (eventId: string) => {
    toast({
      title: "Registration successful",
      description: "You have been registered for the event.",
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
        {club?.upcomingEvents?.map((event) => (
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
            <CardFooter className="p-6 pt-3 flex gap-2">
              <Button
                variant="default"
                className="flex-1"
                onClick={() => handleEventRegistration(event.id)}
              >
                Register
              </Button>
              {event.registrationLink && (
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => window.open(event.registrationLink, "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Details
                </Button>
              )}
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
          {club?.achievements.map((achievement) => (
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
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-semibold">Members</h3>
          <div className="flex gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              Total: {club?.memberCount.total}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              Leaders: {club?.memberCount.leaders}
            </Badge>
          </div>
        </div>
        <Button onClick={() => setShowMemberModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Member
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {club?.members.map((member) => (
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
      <div className="relative w-full h-[250px] sm:h-[300px] lg:h-[400px] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
        <img
          src={club?.banner}
          alt={club?.name}
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent rounded-lg" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6">
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-background shadow-xl">
              <AvatarImage src={club?.logo} alt={club?.name} />
              <AvatarFallback>{club?.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                {club?.name}
              </h1>
              <p className="text-sm sm:text-base text-white/90 max-w-2xl">
                {club?.description}
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

      <Dialog open={showAchievementModal} onOpenChange={setShowAchievementModal}>
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