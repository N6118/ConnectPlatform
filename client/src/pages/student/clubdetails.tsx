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
import { clubService, ClubData, ClubAchievement as ApiClubAchievement } from "@/services/club";

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
  department?: string;
  planOfAction?: {
    summary: string;
    budget: number;
  };
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

// Create an empty club template to use when API returns no data
const createEmptyClub = (id: number): Club => ({
  id,
  name: "Club not found",
  banner: "https://media.istockphoto.com/id/1455935808/photo/technical-college-students-exchanging-ideas.jpg?s=612x612&w=0&k=20&c=dBX_083kTILhRsHblEf89cpabyz7cuXA-UYLLPyxvP0=",
  logo: `https://ui-avatars.com/api/?name=Club`,
  description: "No description available",
  memberCount: {
    total: 0,
    leaders: 0,
    members: 0,
  },
  upcomingEvents: [],
  activityFeed: [],
  achievements: [],
  members: []
});

// Convert API club data to the format needed for the UI
const convertApiClubToUiClub = (clubData: ClubData): Club => {
  return {
    id: clubData.id,
    name: clubData.name,
    banner: "https://media.istockphoto.com/id/1455935808/photo/technical-college-students-exchanging-ideas.jpg?s=612x612&w=0&k=20&c=dBX_083kTILhRsHblEf89cpabyz7cuXA-UYLLPyxvP0=", 
    logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(clubData.name)}`,
    description: clubData.description,
    department: clubData.department,
    planOfAction: clubData.planOfAction,
    memberCount: {
      total: clubData.members?.length || 0,
      leaders: clubData.officeBearers?.length || 0,
      members: (clubData.members?.length || 0) - (clubData.officeBearers?.length || 0)
    },
    upcomingEvents: clubData.events?.map(event => ({
      id: Math.random().toString(36).substring(2),
      title: event.name,
      description: event.description,
      date: event.date,
      type: "Workshop" as EventType, // Default type
      location: "Campus",
      remarks: event.remarks,
      outcomes: event.outcomes
    })) || [],
    activityFeed: [],
    achievements: clubData.achievements?.map(achievement => ({
      id: achievement.id.toString(),
      name: achievement.title,
      description: achievement.description,
      date: achievement.date,
      icon: "trophy" as const,
    })) || [],
    members: [
      // Add office bearers as members
      ...(clubData.officeBearers?.map((bearer, index) => ({
        id: `officer-${index}`,
        name: bearer.name,
        role: bearer.role,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(bearer.name)}`,
        joinDate: clubData.createdAt
      })) || []),
      
      // Add members
      ...(clubData.members?.map((member, index) => ({
        id: `member-${index}`,
        name: member.name,
        role: "Member",
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}`,
        joinDate: clubData.createdAt
      })) || [])
    ]
  };
};

// Convert API club achievement to UI achievement
const convertApiAchievementToUiAchievement = (achievement: ApiClubAchievement): Achievement => {
  return {
    id: achievement.id.toString(),
    name: achievement.title,
    description: achievement.description,
    date: achievement.date,
    icon: "trophy", // Default icon
  };
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
  // Add loading state
  const [loading, setLoading] = useState(true);
  // Add error state
  const [error, setError] = useState<string | null>(null);

  const sections = [
    { name: "Activities", icon: CalendarDays },
    { name: "Achievements", icon: Trophy },
    { name: "Members", icon: Users },
  ];

  useEffect(() => {
    const loadClubData = async () => {
      if (!clubId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        console.log(`Loading data for club ID: ${clubId}`);
        
        // Fetch club data
        const clubResponse = await clubService.getClubById(clubId);
        
        if (!clubResponse.success || !clubResponse.data) {
          throw new Error(clubResponse.error || "Failed to fetch club data");
        }
        
        console.log('Club API response:', clubResponse);
        
        // Convert to UI format
        const uiClub = convertApiClubToUiClub(clubResponse.data);
        setClub(uiClub);
        
        // Fetch achievements (if needed - they should already be in the club data)
        if (!uiClub.achievements || uiClub.achievements.length === 0) {
          try {
            const achievementsResponse = await clubService.getClubAchievements(clubId);
            if (achievementsResponse.success && achievementsResponse.data) {
              const uiAchievements = achievementsResponse.data.map(convertApiAchievementToUiAchievement);
              setClub(prevClub => {
                if (!prevClub) return uiClub;
                return {
                  ...prevClub,
                  achievements: uiAchievements
                };
              });
            }
          } catch (achievementError) {
            console.warn('Error fetching achievements:', achievementError);
          }
        }
        
        // Generate dummy posts for now (replace with actual API call when available)
        const dummyPosts: Post[] = [
          {
            id: "1",
            author: {
              id: "1",
              name: uiClub.members[0]?.name || "Club Member",
              role: uiClub.members[0]?.role || "Member",
              avatar: uiClub.members[0]?.avatar || uiClub.logo,
            },
            content: `Welcome to the ${uiClub.name}! Join us for exciting events and activities.`,
            type: "announcement",
            timestamp: new Date(),
            createdAt: new Date(),
            likes: 0,
            comments: 0,
            shares: 0,
            tags: [uiClub.department || ""],
            visibility: "public",
            reposts: 0,
            isEditable: true,
          },
        ];
        
        setPosts(dummyPosts);
        
        // Success message
        toast({
          title: "Success",
          description: `Loaded club: ${uiClub.name}`,
        });
      } catch (err) {
        console.error('Error loading club data:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        
        toast({
          title: "Error",
          description: "Failed to load club data.",
          variant: "destructive",
        });
        
        // Create an empty club as fallback
        setClub(createEmptyClub(clubId));
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadClubData();
  }, [clubId, toast]);

  // Add error handling for invalid club ID
  if (!clubId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Club ID</h1>
          <p className="text-muted-foreground mb-6">Please provide a valid club ID.</p>
          <Button asChild>
            <Link href="/student/clubs">Go back to clubs</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Show loading indicator
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-lg font-medium">Loading club details...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">Error Loading Club</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
            <Button asChild>
              <Link href="/student/clubs">Go back to clubs</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If club is still null after loading (shouldn't happen, but just in case)
  if (!club) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Club Not Found</h1>
          <p className="text-muted-foreground mb-6">The requested club could not be found.</p>
          <Button asChild>
            <Link href="/student/clubs">Go back to clubs</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleAddAchievement = async (name: string, description: string) => {
    if (!club) return;
    
    try {
      const response = await clubService.addAchievement(club.id, {
        title: name,
        description: description,
        date: new Date().toISOString().split('T')[0]
      });
      
      if (response.success && response.data) {
        const newAchievement = convertApiAchievementToUiAchievement(response.data);
        
        setClub(prev => {
          if (!prev) return null;
          return {
            ...prev,
            achievements: [...prev.achievements, newAchievement],
          };
        });
        
        toast({
          title: "Achievement added",
          description: "New achievement has been added successfully.",
        });
      } else {
        throw new Error(response.error || "Failed to add achievement");
      }
    } catch (error) {
      console.error('Error adding achievement:', error);
      toast({
        title: "Error",
        description: "Failed to add achievement. Please try again.",
        variant: "destructive",
      });
    }
    
    setShowAchievementModal(false);
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
