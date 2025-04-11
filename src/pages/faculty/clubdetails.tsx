import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Trophy, Users, CalendarDays, MessageCircle, ThumbsUp, Share2, Calendar, Trash2, Edit2, ExternalLink, MoreHorizontal, Repeat2, Heart } from "lucide-react";
import StudentNavbar from "@/components/navigation/StudentNavbar";
import MobileBottomNav from "@/components/navigation/MobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import ActivityFeed from "@/components/Profile-ActivityFeed";
import { Post } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";

type EventType = "Hackathon" | "Workshop" | "Meeting" | "Competition" | "Other";

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
  type: EventType;
  location: string;
  registrationLink?: string;
  natureOfEvent?: string;
  theme?: string[];
  fundingAgency?: string;
  chiefGuest?: string;
  otherSpeakers?: string[];
  participantsCount?: number;
  isCompleted?: boolean;
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
      timestamp: new Date("2024-03-20T10:00:00Z"),
      createdAt: new Date("2024-03-20T10:00:00Z"),
      likes: 24,
      comments: 5,
      shares: 3,
      tags: ["AI", "Project"],
      visibility: "public",
      reposts: 2,
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
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80",
      type: "event",
      timestamp: new Date("2024-03-15T14:30:00Z"),
      createdAt: new Date("2024-03-15T14:30:00Z"),
      likes: 45,
      comments: 8,
      shares: 12,
      tags: ["Workshop", "WebDev"],
      visibility: "public",
      reposts: 5,
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
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80",
      type: "achievement",
      timestamp: new Date("2024-03-10T09:15:00Z"),
      createdAt: new Date("2024-03-10T09:15:00Z"),
      likes: 78,
      comments: 15,
      shares: 25,
      tags: ["Achievement", "Award"],
      visibility: "public",
      reposts: 10,
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
      timestamp: new Date("2024-03-05T16:45:00Z"),
      createdAt: new Date("2024-03-05T16:45:00Z"),
      likes: 56,
      comments: 12,
      shares: 18,
      tags: ["Blockchain", "Project"],
      visibility: "public",
      reposts: 8,
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
  try {
    const response = await fetch(`/api/clubs/${id}`);
    return response.json();
  } catch (error) {
    console.error('Error fetching club details:', error);
    return initialClub;
  }
};

const fetchClubAchievements = async (id: number) => {
  try {
    const response = await fetch(`/api/clubs/${id}/achievements`);
    return response.json();
  } catch (error) {
    console.error('Error fetching club achievements:', error);
    return initialClub.achievements;
  }
};

const fetchClubPosts = async (id: number) => {
  try {
    const response = await fetch(`/api/clubs/${id}/posts`);
    return response.json();
  } catch (error) {
    console.error('Error fetching club posts:', error);
    return { data: initialClub.activityFeed };
  }
};

export default function StudentClubDetail() {
  const { id } = useParams();
  const clubId = parseInt(id || "0");
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const [club, setClub] = useState<Club | null>(null);
  const [activeSection, setActiveSection] = useState("Activities");
  const [showEventModal, setShowEventModal] = useState(false);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  const [showDeleteEventModal, setShowDeleteEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    id: "",
    title: "",
    description: "",
    date: "",
    type: "Workshop",
    location: "",
    registrationLink: "",
    natureOfEvent: "CLUBS",
    theme: [],
    fundingAgency: "None",
    chiefGuest: "",
    otherSpeakers: [],
    participantsCount: 0,
    isCompleted: false
  });
  
  // Add state for posts
  const [posts, setPosts] = useState<Post[]>([]);

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
        setPosts(postsData.data || []);
      } catch (error) {
        console.error('Error loading club data:', error);
        setClub(initialClub);
        setPosts(initialClub.activityFeed.map(post => ({
          ...post,
          timestamp: new Date(post.timestamp),
          createdAt: new Date()
        })));
      }
    };

    if (clubId) {
      loadClubData();
    } else {
      // Use initial data if no valid clubId
      setClub(initialClub);
      setPosts(initialClub.activityFeed.map(post => ({
        ...post,
        timestamp: new Date(post.timestamp),
        createdAt: new Date()
      })));
    }
  }, [clubId]);

  // Add error handling for invalid club ID
  if (!clubId) {
    return <div>Invalid club ID</div>;
  }

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

  // Add handlers for posts
  const handleCreatePost = (newPost: Post) => {
    const completePost: Post = {
      ...newPost,
      type: newPost.type || 'post',
      timestamp: new Date(),
      createdAt: new Date(),
      shares: newPost.shares || 0,
      isEditable: newPost.isEditable ?? true
    };
    setPosts([completePost, ...posts]);
    toast({
      title: "Post created",
      description: "Your post has been successfully created.",
    });
  };

  const handleEditPost = (updatedPost: Post) => {
    setPosts(posts.map((post) => 
      post.id === updatedPost.id ? { 
        ...post, // Preserve existing properties
        ...updatedPost // Merge with updates
      } : post
    ));
    toast({
      title: "Post updated", 
      description: "Your post has been successfully updated."
    });
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter((post) => post.id !== postId));
    toast({
      title: "Post deleted",
      description: "Your post has been successfully deleted."
    });
  };

  const handleAddEvent = () => {
    const eventToAdd: Event = {
      id: Math.random().toString(36).substr(2, 9),
      title: newEvent.title || "",
      description: newEvent.description || "",
      date: newEvent.date || new Date().toISOString().split('T')[0],
      type: newEvent.type as EventType || "Workshop",
      location: newEvent.location || "",
      registrationLink: newEvent.registrationLink,
      natureOfEvent: newEvent.natureOfEvent || "CLUBS",
      theme: newEvent.theme || [],
      fundingAgency: newEvent.fundingAgency || "None",
      chiefGuest: newEvent.chiefGuest || "",
      otherSpeakers: newEvent.otherSpeakers || [],
      participantsCount: newEvent.participantsCount || 0,
      isCompleted: newEvent.isCompleted || false
    };

    setClub((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        upcomingEvents: [...prev.upcomingEvents, eventToAdd],
      };
    });

    setShowEventModal(false);
    setNewEvent({
      id: "",
      title: "",
      description: "",
      date: "",
      type: "Workshop",
      location: "",
      registrationLink: "",
      natureOfEvent: "CLUBS",
      theme: [],
      fundingAgency: "None",
      chiefGuest: "",
      otherSpeakers: [],
      participantsCount: 0,
      isCompleted: false
    });

    toast({
      title: "Event created",
      description: "The event has been successfully created.",
    });
  };

  const handleInputChange = (field: string, value: any) => {
    if (field === 'theme') {
      setNewEvent(prev => ({
        ...prev,
        theme: value.split(',').map((t: string) => t.trim())
      }));
    } else if (field === 'otherSpeakers') {
      setNewEvent(prev => ({
        ...prev,
        otherSpeakers: value.split('\n').map((s: string) => s.trim()).filter(Boolean)
      }));
    } else {
      setNewEvent(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowEditEventModal(true);
  };

  const handleEditEventSubmit = () => {
    if (selectedEvent) {
      setClub((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          upcomingEvents: prev.upcomingEvents.map((event) => 
            event.id === selectedEvent.id ? selectedEvent : event
          ),
        };
      });
      setShowEditEventModal(false);
      toast({
        title: "Event updated",
        description: "The event has been successfully updated.",
      });
    }
  };

  const handleDeleteEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowDeleteEventModal(true);
  };

  const handleDeleteEventConfirm = () => {
    if (selectedEvent) {
      setClub((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          upcomingEvents: prev.upcomingEvents.filter((event) => event.id !== selectedEvent.id),
        };
      });
      setShowDeleteEventModal(false);
      toast({
        title: "Event deleted",
        description: "The event has been successfully deleted.",
      });
    }
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
            className="hover:shadow-lg transition-all duration-300 group"
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
                <div className="flex flex-col gap-2 items-end">
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0" 
                      onClick={() => handleEditEvent(event)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50" 
                      onClick={() => handleDeleteEvent(event)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    {event.type}
                  </Badge>
                  {event.natureOfEvent && (
                    <Badge variant="outline" className="text-xs">
                      {event.natureOfEvent}
                    </Badge>
                  )}
                </div>
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
              
              {event.theme && event.theme.length > 0 && (
                <div className="mt-3">
                  <div className="text-sm font-medium mb-1">Themes:</div>
                  <div className="flex flex-wrap gap-1">
                    {event.theme.map((theme, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {theme}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {event.chiefGuest && (
                <div className="text-sm">
                  <span className="font-medium">Chief Guest:</span> {event.chiefGuest}
                </div>
              )}
              
              {event.participantsCount && event.participantsCount > 0 && (
                <div className="text-sm">
                  <span className="font-medium">Expected Participants:</span> {event.participantsCount}
                </div>
              )}
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

  const userData = {
    id: "1",
    name: "John Doe",
    role: "Club President",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80",
    followers: 128,
  };

  return (
    <div className="relative min-h-screen pb-16 md:pb-0">
      <StudentNavbar />
      <div className="container mx-auto p-4">
        <Button variant="ghost" className="mb-4" asChild>
          <Link href="/student/clubs" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Clubs
          </Link>
        </Button>
      </div>

      {/* Club Header Section */}
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
                <AvatarFallback>{club?.name?.slice(0, 2)}</AvatarFallback>
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
      </div>
      
      {/* Activity Feed */}
      <div className="mt-8">
        <ActivityFeed
          clubId={clubId}
          userData={userData}
          posts={posts}
          onCreatePost={handleCreatePost}
          onEditPost={handleEditPost}
          onDeletePost={handleDeletePost}
        />
      </div>

      {/* Modals */}
      <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Create New Event</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 mt-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-sm font-medium">Event Title</Label>
              <Input 
                id="title"
                className="w-full" 
                placeholder="Enter event title" 
                value={newEvent.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-sm font-medium">Description</Label>
              <Textarea
                id="description"
                className="w-full min-h-[100px]"
                placeholder="Enter event description"
                value={newEvent.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="natureOfEvent" className="text-sm font-medium">Nature of Event</Label>
              <Select value={newEvent.natureOfEvent} onValueChange={(value) => handleInputChange('natureOfEvent', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select nature of event" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CLUBS">Club Event</SelectItem>
                  <SelectItem value="INSTITUTIONAL">Institutional</SelectItem>
                  <SelectItem value="NATIONAL">National</SelectItem>
                  <SelectItem value="INTERNATIONAL">International</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type" className="text-sm font-medium">Event Type</Label>
              <Select value={newEvent.type as string} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Workshop">Workshop</SelectItem>
                  <SelectItem value="Hackathon">Hackathon</SelectItem>
                  <SelectItem value="Meeting">Meeting</SelectItem>
                  <SelectItem value="Competition">Competition</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="theme" className="text-sm font-medium">Theme(s)</Label>
              <Input
                id="theme"
                placeholder="Enter themes (comma separated)"
                className="w-full"
                value={newEvent.theme?.join(', ')}
                onChange={(e) => handleInputChange('theme', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date" className="text-sm font-medium">Date</Label>
              <Input 
                id="date" 
                type="date" 
                className="w-full" 
                value={newEvent.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location" className="text-sm font-medium">Location</Label>
              <Input 
                id="location" 
                className="w-full" 
                placeholder="Enter location" 
                value={newEvent.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="registrationLink" className="text-sm font-medium">Registration Link (optional)</Label>
              <Input 
                id="registrationLink" 
                className="w-full" 
                placeholder="https://" 
                value={newEvent.registrationLink}
                onChange={(e) => handleInputChange('registrationLink', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="chiefGuest" className="text-sm font-medium">Chief Guest (optional)</Label>
              <Input
                id="chiefGuest"
                placeholder="Enter chief guest name"
                className="w-full"
                value={newEvent.chiefGuest}
                onChange={(e) => handleInputChange('chiefGuest', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="otherSpeakers" className="text-sm font-medium">Other Speakers (optional)</Label>
              <Textarea
                id="otherSpeakers"
                placeholder="Enter other speakers (one per line)"
                className="min-h-[80px]"
                value={newEvent.otherSpeakers?.join('\n')}
                onChange={(e) => handleInputChange('otherSpeakers', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="participantsCount" className="text-sm font-medium">Expected Participants</Label>
              <Input
                id="participantsCount"
                type="number"
                placeholder="Enter expected number of participants"
                className="w-full"
                value={newEvent.participantsCount}
                onChange={(e) => handleInputChange('participantsCount', parseInt(e.target.value) || 0)}
              />
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setShowEventModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEvent}>
                Create Event
              </Button>
            </DialogFooter>
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

      {/* Add Edit Event Modal after the other modals */}
      <Dialog open={showEditEventModal} onOpenChange={setShowEditEventModal}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Event</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="grid gap-4 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title" className="text-sm font-medium">Event Title</Label>
                <Input 
                  id="edit-title"
                  className="w-full" 
                  placeholder="Enter event title" 
                  value={selectedEvent.title}
                  onChange={(e) => setSelectedEvent({...selectedEvent, title: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description" className="text-sm font-medium">Description</Label>
                <Textarea
                  id="edit-description"
                  className="w-full min-h-[100px]"
                  placeholder="Enter event description"
                  value={selectedEvent.description}
                  onChange={(e) => setSelectedEvent({...selectedEvent, description: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-natureOfEvent" className="text-sm font-medium">Nature of Event</Label>
                <Select 
                  value={selectedEvent.natureOfEvent} 
                  onValueChange={(value) => setSelectedEvent({...selectedEvent, natureOfEvent: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select nature of event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLUBS">Club Event</SelectItem>
                    <SelectItem value="INSTITUTIONAL">Institutional</SelectItem>
                    <SelectItem value="NATIONAL">National</SelectItem>
                    <SelectItem value="INTERNATIONAL">International</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-type" className="text-sm font-medium">Event Type</Label>
                <Select 
                  value={selectedEvent.type} 
                  onValueChange={(value) => setSelectedEvent({...selectedEvent, type: value as EventType})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                    <SelectItem value="Hackathon">Hackathon</SelectItem>
                    <SelectItem value="Meeting">Meeting</SelectItem>
                    <SelectItem value="Competition">Competition</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-theme" className="text-sm font-medium">Theme(s)</Label>
                <Input
                  id="edit-theme"
                  placeholder="Enter themes (comma separated)"
                  className="w-full"
                  value={selectedEvent.theme?.join(', ')}
                  onChange={(e) => {
                    const themes = e.target.value.split(',').map(t => t.trim());
                    setSelectedEvent({...selectedEvent, theme: themes});
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-date" className="text-sm font-medium">Date</Label>
                <Input 
                  id="edit-date" 
                  type="date" 
                  className="w-full" 
                  value={selectedEvent.date}
                  onChange={(e) => setSelectedEvent({...selectedEvent, date: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-location" className="text-sm font-medium">Location</Label>
                <Input 
                  id="edit-location" 
                  className="w-full" 
                  placeholder="Enter location" 
                  value={selectedEvent.location}
                  onChange={(e) => setSelectedEvent({...selectedEvent, location: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-registrationLink" className="text-sm font-medium">Registration Link (optional)</Label>
                <Input 
                  id="edit-registrationLink" 
                  className="w-full" 
                  placeholder="https://" 
                  value={selectedEvent.registrationLink}
                  onChange={(e) => setSelectedEvent({...selectedEvent, registrationLink: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-chiefGuest" className="text-sm font-medium">Chief Guest (optional)</Label>
                <Input
                  id="edit-chiefGuest"
                  placeholder="Enter chief guest name"
                  className="w-full"
                  value={selectedEvent.chiefGuest}
                  onChange={(e) => setSelectedEvent({...selectedEvent, chiefGuest: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-otherSpeakers" className="text-sm font-medium">Other Speakers (optional)</Label>
                <Textarea
                  id="edit-otherSpeakers"
                  placeholder="Enter other speakers (one per line)"
                  className="min-h-[80px]"
                  value={selectedEvent.otherSpeakers?.join('\n')}
                  onChange={(e) => {
                    const speakers = e.target.value.split('\n').map(s => s.trim()).filter(Boolean);
                    setSelectedEvent({...selectedEvent, otherSpeakers: speakers});
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-participantsCount" className="text-sm font-medium">Expected Participants</Label>
                <Input
                  id="edit-participantsCount"
                  type="number"
                  placeholder="Enter expected number of participants"
                  className="w-full"
                  value={selectedEvent.participantsCount}
                  onChange={(e) => setSelectedEvent({...selectedEvent, participantsCount: parseInt(e.target.value) || 0})}
                />
              </div>
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setShowEditEventModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditEventSubmit}>
                  Save Changes
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Event Confirmation Dialog */}
      <Dialog open={showDeleteEventModal} onOpenChange={setShowDeleteEventModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowDeleteEventModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteEventConfirm}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {isMobile && <MobileBottomNav role="student" />}
    </div>
  );
}
