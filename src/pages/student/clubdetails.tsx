import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Trophy, Users, CalendarDays, MessageCircle, ThumbsUp, Share2, Calendar, Trash2, Edit2, ExternalLink, MoreHorizontal, Repeat2, Heart, UserMinus, UserPlus } from "lucide-react";
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
import { clubService, ClubData, ClubAchievement as ApiClubAchievement, ClubMembershipData, ClubEvent } from "@/services/club";

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
const convertApiClubToUiClub = (clubData: any): Club => {
  console.log('Club data received:', clubData);
  
  // Handle case where API returns data in a nested structure
  const actualClubData = clubData.data || clubData;
  
  // Extract members and ensure they're not undefined
  const clubMembers: any[] = actualClubData.members || [];
  
  console.log('Club members:', clubMembers);
  
  return {
    id: actualClubData.id,
    name: actualClubData.name,
    banner: actualClubData.banner || "https://media.istockphoto.com/id/1455935808/photo/technical-college-students-exchanging-ideas.jpg?s=612x612&w=0&k=20&c=dBX_083kTILhRsHblEf89cpabyz7cuXA-UYLLPyxvP0=", 
    logo: actualClubData.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(actualClubData.name)}`,
    description: actualClubData.description || "",
    department: actualClubData.department || "",
    planOfAction: actualClubData.planOfAction || {},
    memberCount: {
      total: clubMembers.length,
      leaders: clubMembers.filter((member: any) => member.role !== "MEMBER").length,
      members: clubMembers.filter((member: any) => member.role === "MEMBER").length
    },
    upcomingEvents: [],
    activityFeed: [],
    achievements: (actualClubData.achievements || []).map((achievement: any) => ({
      id: achievement.id.toString(),
      name: achievement.title || "",
      description: achievement.description || "",
      date: achievement.date || "",
      icon: "trophy" as const,
    })),
    members: clubMembers.map((member: any, index: number) => ({
      id: `member-${index}`,
      name: member.userName || member.rollNo || `Member ${index + 1}`, // Use userName instead of rollNo as primary
      role: member.role || "MEMBER",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(member.userName || member.rollNo || `Member ${index + 1}`)}`,
      joinDate: actualClubData.createdAt || new Date().toISOString()
    }))
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
  const [isJoined, setIsJoined] = useState(false);
  const [membershipStatus, setMembershipStatus] = useState<string | null>(null);
  const [membershipLoading, setMembershipLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showMemberActionModal, setShowMemberActionModal] = useState(false);
  // Add state to track userRole from API
  const [userRole, setUserRole] = useState<string | null>(null);

  const sections = [
    { name: "Activities", icon: CalendarDays },
    { name: "Achievements", icon: Trophy },
    { name: "Members", icon: Users },
  ];

  // Function to get current user from localStorage
  const getCurrentUser = () => {
    try {
      const userDataString = localStorage.getItem('user');
      if (!userDataString) return null;
      
      return JSON.parse(userDataString);
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      return null;
    }
  };

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
        
        // Get user membership status from API response
        if (clubResponse.data.userMember !== undefined) {
          setIsJoined(clubResponse.data.userMember);
          setMembershipStatus(clubResponse.data.userMember ? "active" : null);
        }
        
        // Get user role from API response
        if (clubResponse.data.userRole !== undefined) {
          setUserRole(clubResponse.data.userRole);
        }
        
        // Convert to UI format
        const uiClub = convertApiClubToUiClub(clubResponse.data);
        setClub(uiClub);
        
        // Load club events from the API
        try {
          const eventsResponse = await clubService.getClubEvents(clubId);
          if (eventsResponse.success && eventsResponse.data && eventsResponse.data.length > 0) {
            console.log('Events API response:', eventsResponse);
            
            // Map API events to UI events format
            const uiEvents: Event[] = eventsResponse.data.map(event => {
              // Convert ISO date to YYYY-MM-DD format for UI
              let displayDate = '';
              try {
                if (event.date) {
                  const dateObj = new Date(event.date);
                  displayDate = dateObj.toISOString().split('T')[0];
                } else {
                  displayDate = new Date().toISOString().split('T')[0];
                }
              } catch (err) {
                console.warn('Error parsing date:', event.date, err);
                displayDate = new Date().toISOString().split('T')[0];
              }
              
              return {
                id: event.id?.toString() || Math.random().toString(36).substring(2),
                title: event.title || "",
                description: event.description || "",
                date: displayDate,
                type: (event.type || "WORKSHOP") as EventType,
                location: event.location || "Campus",
                registrationLink: event.registrationLink,
                natureOfEvent: event.natureOfEvent,
                theme: event.theme,
                fundingAgency: event.fundingAgency,
                chiefGuest: event.chiefGuest,
                otherSpeakers: event.otherSpeakers,
                participantsCount: event.participantsCount,
                isCompleted: event.isCompleted
              };
            });
            
            // Update club with events
            setClub(prevClub => {
              if (!prevClub) return uiClub;
              return {
                ...prevClub,
                upcomingEvents: uiEvents
              };
            });
          }
        } catch (eventsError) {
          console.warn('Error fetching club events:', eventsError);
        }
        
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
              role: uiClub.members[0]?.role || "MEMBER",
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

  // Join club handler
  const handleJoinClub = async () => {
    if (!clubId) return;
    
    setMembershipLoading(true);
    
    try {
      const currentUser = getCurrentUser();
      
      if (!currentUser || !currentUser.username) {
        throw new Error("User information not available. Please log in again.");
      }
      
      // Get student enrollment number to use as rollNo
      const rollNo = currentUser.studentDetails?.enrollmentNumber;
      
      if (!rollNo) {
        throw new Error("Enrollment number not found. Please update your profile.");
      }
      
      const membershipData: ClubMembershipData = {
        clubId: clubId,
        // Don't include userId as requested
        username: currentUser.username,
        rollNo: rollNo,
        role: "MEMBER",
        status: "pending" // Or "active" depending on your business logic
      };
      
      const response = await clubService.joinClub(membershipData);
      
      if (response.success) {
        setIsJoined(true);
        setMembershipStatus("pending"); // Or "active" depending on your business logic
        
        // Add current user to members list
        const newMember: Member = {
          id: Math.random().toString(36).substr(2, 9),
          name: currentUser.name || "Current User",
          role: "MEMBER",
          avatar: currentUser.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name || "User")}`,
          joinDate: new Date().toISOString(),
        };
        
        setClub(prev => {
          if (!prev) return null;
          return {
            ...prev,
            members: [...prev.members, newMember],
            memberCount: {
              ...prev.memberCount,
              total: prev.memberCount.total + 1,
              members: prev.memberCount.members + 1
            }
          };
        });
        
        toast({
          title: "Club Joined",
          description: "Your request to join the club has been submitted.",
        });
      } else {
        throw new Error(response.error || "Failed to join club");
      }
    } catch (error) {
      console.error('Error joining club:', error);
      toast({
        title: "Error",
        description: "Failed to join the club. Please try again.",
        variant: "destructive",
      });
    } finally {
      setMembershipLoading(false);
    }
  };

  // Leave club handler
  const handleLeaveClub = async () => {
    if (!clubId) return;
    
    setMembershipLoading(true);
    
    try {
      const currentUser = getCurrentUser();
      
      if (!currentUser || !currentUser.username) {
        throw new Error("User information not available. Please log in again.");
      }
      
      // Get student enrollment number to use as rollNo
      const rollNo = currentUser.studentDetails?.enrollmentNumber;
      
      if (!rollNo) {
        throw new Error("Enrollment number not found. Please update your profile.");
      }
      
      const membershipData: ClubMembershipData = {
        clubId: clubId,
        // Don't include userId as requested
        username: currentUser.username,
        rollNo: rollNo
      };
      
      const response = await clubService.leaveClub(membershipData);
      
      if (response.success) {
        setIsJoined(false);
        setMembershipStatus(null);
        
        // Remove current user from members list
        setClub(prev => {
          if (!prev) return null;
          
          // Filter out current user
          const updatedMembers = prev.members.filter(
            member => member.name !== currentUser.name
          );
          
          return {
            ...prev,
            members: updatedMembers,
            memberCount: {
              ...prev.memberCount,
              total: prev.memberCount.total - 1,
              members: prev.memberCount.members - 1
            }
          };
        });
        
        toast({
          title: "Club Left",
          description: "You have successfully left the club.",
        });
      } else {
        throw new Error(response.error || "Failed to leave club");
      }
    } catch (error) {
      console.error('Error leaving club:', error);
      toast({
        title: "Error",
        description: "Failed to leave the club. Please try again.",
        variant: "destructive",
      });
    } finally {
      setMembershipLoading(false);
    }
  };

  // Update member role handler
  const handleUpdateMemberRole = async (member: Member, newRole: string) => {
    if (!clubId) return;
    
    try {
      const currentUser = getCurrentUser();
      
      if (!currentUser || !currentUser.username) {
        throw new Error("User information not available. Please log in again.");
      }
      
      // Get admin's roll number for authentication
      const rollNo = currentUser.studentDetails?.enrollmentNumber;
      
      if (!rollNo) {
        throw new Error("Enrollment number not found. Please update your profile.");
      }
      
      // Use the member's name as username without modifying it
      const username = member.name;
      
      const membershipData: ClubMembershipData = {
        clubId: clubId,
        username: username, // Use member's name directly
        rollNo: rollNo,
        role: newRole // Make sure role is set correctly
      };
      
      console.log("Updating member role with data:", membershipData);
      
      // Explicitly call updateMembership method
      const response = await clubService.updateMembership(membershipData);
      
      if (response.success) {
        // Update member in the local state
        setClub(prev => {
          if (!prev) return null;
          
          const updatedMembers = prev.members.map(m => 
            m.id === member.id ? { ...m, role: newRole } : m
          );
          
          // Recalculate leaders and members count
          const leaders = updatedMembers.filter(m => m.role !== "MEMBER").length;
          const regularMembers = updatedMembers.length - leaders;
          
          return {
            ...prev,
            members: updatedMembers,
            memberCount: {
              total: updatedMembers.length,
              leaders,
              members: regularMembers
            }
          };
        });
        
        toast({
          title: "Member Role Updated",
          description: `${member.name}'s role has been updated to ${newRole}.`,
        });
      } else {
        throw new Error(response.error || "Failed to update member role");
      }
    } catch (error) {
      console.error('Error updating member role:', error);
      toast({
        title: "Error",
        description: "Failed to update member role. Please try again.",
        variant: "destructive",
      });
    }
    
    setShowMemberActionModal(false);
    setSelectedMember(null);
  };

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

  const handleAddMember = async (name: string, role: string, rollNo: string) => {
    if (!clubId) return;
    
    try {
      const currentUser = getCurrentUser();
      
      if (!currentUser || !currentUser.username) {
        throw new Error("User information not available. Please log in again.");
      }
      
      // Create username from the entered name
      const username = name.replace(/\s+/g, '.').toLowerCase();
      
      // Use the entered name and created username for API call
      const membershipData: ClubMembershipData = {
        clubId: clubId,
        // Don't include userId as requested
        username: username, // Use created username from entered name
        rollNo: rollNo,
        role: role
      };
      
      const response = await clubService.joinClub(membershipData);
      
      if (response.success) {
        setClub((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            members: [...prev.members, {
              id: Math.random().toString(36).substr(2, 9),
              name,
              role,
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
              joinDate: new Date().toISOString(),
            }],
            memberCount: {
              total: prev.memberCount.total + 1,
              leaders: role !== "MEMBER" ? prev.memberCount.leaders + 1 : prev.memberCount.leaders,
              members: role === "MEMBER" ? prev.memberCount.members + 1 : prev.memberCount.members,
            }
          };
        });
        
        setShowMemberModal(false);
        toast({
          title: "Member added",
          description: "New member has been added successfully.",
        });
      } else {
        throw new Error(response.error || "Failed to add member");
      }
    } catch (error) {
      console.error('Error adding member:', error);
      toast({
        title: "Error",
        description: "Failed to add member. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveMember = async (member: Member) => {
    if (!clubId) return;
    
    try {
      const currentUser = getCurrentUser();
      
      if (!currentUser || !currentUser.username) {
        throw new Error("User information not available. Please log in again.");
      }
      
      // Get student enrollment number to use as rollNo
      const rollNo = currentUser.studentDetails?.enrollmentNumber;
      
      if (!rollNo) {
        throw new Error("Enrollment number not found. Please update your profile.");
      }
      
      // Generate username from member's name
      const username = member.name.replace(/\s+/g, '.').toLowerCase();
      
      const membershipData: ClubMembershipData = {
        clubId: clubId,
        // Don't include userId
        username: username, // Use member's username
        rollNo: rollNo // Use authenticated user's rollNo for authorization
      };
      
      const response = await clubService.leaveClub(membershipData);
      
      if (response.success) {
        // Remove member from local state
        setClub((prev) => {
          if (!prev) return null;
          
          const updatedMembers = prev.members.filter(m => m.id !== member.id);
          
          // Recalculate leaders and members count
          const leaders = updatedMembers.filter(m => m.role !== "MEMBER").length;
          const regularMembers = updatedMembers.length - leaders;
          
          return {
            ...prev,
            members: updatedMembers,
            memberCount: {
              total: updatedMembers.length,
              leaders,
              members: regularMembers
            }
          };
        });
        
        toast({
          title: "Member removed",
          description: `${member.name} has been removed from the club.`,
        });
      } else {
        throw new Error(response.error || "Failed to remove member");
      }
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: "Error",
        description: "Failed to remove member. Please try again.",
        variant: "destructive",
      });
    }
    
    setShowMemberActionModal(false);
    setSelectedMember(null);
  };

  // Event registration handler
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

  const handleAddEvent = async () => {
    if (!clubId) return;
    
    try {
      // Format the date as ISO string with time component
      const formattedDate = newEvent.date 
        ? new Date(newEvent.date).toISOString() 
        : new Date().toISOString();
      
      // Format the event data to match the API requirements
      const eventData: ClubEvent = {
        title: newEvent.title || "",
        description: newEvent.description || "",
        date: formattedDate, // Use full ISO date format
        type: newEvent.type?.toUpperCase() || "WORKSHOP",
        location: newEvent.location || "",
        registrationLink: newEvent.registrationLink,
        natureOfEvent: newEvent.natureOfEvent || "CLUBS",
        theme: newEvent.theme || [],
        fundingAgency: newEvent.fundingAgency || "None",
        chiefGuest: newEvent.chiefGuest || "",
        otherSpeakers: newEvent.otherSpeakers || [],
        participantsCount: newEvent.participantsCount || 0,
        isCompleted: newEvent.isCompleted || false,
        isPublic: true, // Default to public
        clubId: clubId
      };
      
      console.log("Creating event with data:", eventData);
      
      // Call the API to create the event
      const response = await clubService.createClubEvent(eventData);
      
      if (response.success && response.data) {
        // Create a local UI version of the event
        const newUIEvent: Event = {
          id: response.data.id?.toString() || Math.random().toString(36).substr(2, 9),
          title: eventData.title,
          description: eventData.description,
          date: newEvent.date || new Date().toISOString().split('T')[0], // Keep original date format for UI
          type: eventData.type as EventType,
          location: eventData.location,
          registrationLink: eventData.registrationLink,
          natureOfEvent: eventData.natureOfEvent,
          theme: eventData.theme,
          fundingAgency: eventData.fundingAgency,
          chiefGuest: eventData.chiefGuest,
          otherSpeakers: eventData.otherSpeakers,
          participantsCount: eventData.participantsCount,
          isCompleted: eventData.isCompleted
        };
        
        // Update the club state with the new event
        setClub((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            upcomingEvents: [...prev.upcomingEvents, newUIEvent],
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
      } else {
        throw new Error(response.error || "Failed to create event");
      }
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
    }
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

  const handleEditEventSubmit = async () => {
    if (!selectedEvent || !clubId) return;
    
    try {
      // Format the date as ISO string with time component
      const formattedDate = selectedEvent.date 
        ? new Date(selectedEvent.date).toISOString() 
        : new Date().toISOString();
      
      // Format the event data to match the API requirements
      const eventData: Partial<ClubEvent> = {
        title: selectedEvent.title,
        description: selectedEvent.description,
        date: formattedDate, // Use full ISO date format
        type: selectedEvent.type.toUpperCase(),
        location: selectedEvent.location,
        registrationLink: selectedEvent.registrationLink,
        natureOfEvent: selectedEvent.natureOfEvent,
        theme: selectedEvent.theme,
        fundingAgency: selectedEvent.fundingAgency,
        chiefGuest: selectedEvent.chiefGuest,
        otherSpeakers: selectedEvent.otherSpeakers,
        participantsCount: selectedEvent.participantsCount,
        isCompleted: selectedEvent.isCompleted
      };
      
      console.log("Updating event with data:", eventData);
      
      // Get the numeric ID from the string ID
      const eventId = parseInt(selectedEvent.id) || 0;
      
      if (eventId === 0) {
        throw new Error("Invalid event ID");
      }
      
      // Call the API to update the event
      const response = await clubService.updateClubEvent(eventId, eventData);
      
      if (response.success) {
        // Update the local state
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
      } else {
        throw new Error(response.error || "Failed to update event");
      }
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        title: "Error",
        description: "Failed to update event. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowDeleteEventModal(true);
  };

  const handleDeleteEventConfirm = async () => {
    if (!selectedEvent || !clubId) return;
    
    try {
      // Get the numeric ID from the string ID
      const eventId = parseInt(selectedEvent.id) || 0;
      
      if (eventId === 0) {
        throw new Error("Invalid event ID");
      }
      
      // Call the API to delete the event
      const response = await clubService.deleteClubEvent(eventId);
      
      if (response.success) {
        // Update the local state
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
      } else {
        throw new Error(response.error || "Failed to delete event");
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
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
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedMember(member);
                              setShowMemberActionModal(true);
                            }}
                          >
                            <Edit2 className="h-4 w-4 mr-2" />
                            Change Role
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500 focus:text-red-500"
                            onClick={() => handleRemoveMember(member)}
                          >
                            <UserMinus className="h-4 w-4 mr-2" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                  {club?.name}
                </h1>
                <p className="text-sm sm:text-base text-white/90 max-w-2xl">
                  {club?.description}
                </p>
              </div>
              <div className="flex sm:self-end">
                <Button
                  variant={isJoined ? "outline" : "default"} 
                  className={`gap-2 ${isJoined ? 'bg-background/20 hover:bg-background/30 text-white' : ''}`}
                  onClick={isJoined ? handleLeaveClub : handleJoinClub}
                  disabled={membershipLoading}
                >
                  {membershipLoading ? (
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : isJoined ? (
                    <UserMinus className="h-4 w-4" />
                  ) : (
                    <UserPlus className="h-4 w-4" />
                  )}
                  {isJoined ? 'Leave Club' : 'Join Club'}
                </Button>
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
            <div className="grid gap-2">
              <Label htmlFor="achievement-title">Achievement Title</Label>
              <Input id="achievement-title" placeholder="Achievement Title" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="achievement-description">Description</Label>
              <Textarea id="achievement-description" placeholder="Achievement Description" />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  const titleInput = document.getElementById("achievement-title") as HTMLInputElement;
                  const descriptionInput = document.getElementById("achievement-description") as HTMLTextAreaElement;
                  
                  const title = titleInput?.value || "";
                  const description = descriptionInput?.value || "";
                  
                  console.log("Adding achievement:", { title, description });
                  
                  if (!title) {
                    toast({
                      title: "Error",
                      description: "Title is required",
                      variant: "destructive",
                    });
                    return;
                  }
                  
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
            <div className="grid gap-2">
              <Label htmlFor="member-name">Member Name</Label>
              <Input id="member-name" placeholder="Member Name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="roll-number">Roll Number</Label>
              <Input id="roll-number" placeholder="Roll Number" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="member-role">Role</Label>
              <Select defaultValue="MEMBER">
                <SelectTrigger id="member-role">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="MEMBER">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  const nameInput = document.getElementById("member-name") as HTMLInputElement;
                  const rollNumberInput = document.getElementById("roll-number") as HTMLInputElement;
                  const roleSelect = document.getElementById("member-role") as HTMLSelectElement;
                  
                  const name = nameInput?.value || "";
                  const rollNo = rollNumberInput?.value || "";
                  const role = roleSelect?.value || "MEMBER";
                  
                  console.log("Adding member:", { name, rollNo, role });
                  
                  if (!name || !rollNo) {
                    toast({
                      title: "Error",
                      description: "Name and roll number are required",
                      variant: "destructive",
                    });
                    return;
                  }
                  
                  handleAddMember(name, role, rollNo);
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

      {/* Member Action Modal */}
      <Dialog open={showMemberActionModal} onOpenChange={setShowMemberActionModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Manage Member</DialogTitle>
            <DialogDescription>
              Update {selectedMember?.name}'s role or remove them from the club.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Current Role: {selectedMember?.role}</Label>
              <Select 
                defaultValue={selectedMember?.role}
                onValueChange={(value) => {
                  if (selectedMember) {
                    handleUpdateMemberRole(selectedMember, value);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="MEMBER">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="destructive" 
              onClick={() => selectedMember && handleRemoveMember(selectedMember)}
            >
              <UserMinus className="h-4 w-4 mr-2" />
              Remove from Club
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isMobile && <MobileBottomNav role="student" />}
    </div>
  );
}
