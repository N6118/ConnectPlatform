import { useState, useEffect } from "react";
import { EventCarousel } from "@/components/ui/event-carousel";
import { ClubCard } from "@/components/ui/club-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MobileBottomNav from "@/components/navigation/MobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Heart,
  HeartOff,
  Brain,
  Rocket,
  Code,
  Gamepad2,
  Users,
  Trophy,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Club as BaseClub } from "@/components/ui/club-card";
import StudentNavbar from "@/components/navigation/StudentNavbar";
import { clubService, ClubData } from "@/services/club";
import { useToast } from "@/hooks/use-toast";
import { api, ApiResponse } from "@/services/api";
import { eventService, Event as ServiceEvent } from "@/services/event";

// Extend the base Club type to include roles
type Club = BaseClub & {
  roles: {
    name: string;
    member: string;
    permissions?: string[];
  }[];
  tags?: string[];
};

// Type for events shared between clubs.tsx and EventManagement.tsx
interface ClubEvent {
  id: number;
  natureOfEvent: string;
  typeOfEvent: string;
  theme: string[];
  fundingAgency: string;
  dates: {
    start: string;
    end: string;
  };
  chiefGuest: string;
  otherSpeakers: string[];
  participantsCount: number;
  highlights: string;
  isCompleted?: boolean;
  clubId?: number;
  clubName?: string;
  location?: string;
  banner?: string;
  description?: string;
  capacity?: number;
  registeredUsers?: {
    id: number;
    username: string;
    profilePicture?: string;
  }[];
  // For backward compatibility with EventCarousel
  title?: string;
  date?: string;
  time?: string;
}

// API Event interface based on server response
interface ApiEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  type: string;
  location: string;
  registrationLink: string | null;
  natureOfEvent: string;
  theme: string[] | null;
  fundingAgency: string;
  chiefGuest: string;
  otherSpeakers: string[] | null;
  participantsCount: number;
  isCompleted: boolean;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  club: any | null;
}

// Function to convert API events to our ClubEvent format
const mapApiEventToClubEvent = (apiEvent: ApiEvent): ClubEvent => {
  // Extract date and time from the ISO string
  const dateObj = new Date(apiEvent.date);
  const formattedDate = dateObj.toISOString().split('T')[0];
  const formattedTime = dateObj.toTimeString().slice(0, 5);
  
  return {
    id: apiEvent.id,
    title: apiEvent.title || "Event Title",  // Ensure title is not empty
    description: apiEvent.description || "No description available",
    natureOfEvent: apiEvent.natureOfEvent || "CLUBS",
    typeOfEvent: apiEvent.type,
    theme: apiEvent.theme || [],
    fundingAgency: apiEvent.fundingAgency || "None",
    dates: {
      start: formattedDate,
      end: formattedDate,
    },
    chiefGuest: apiEvent.chiefGuest || "",
    otherSpeakers: apiEvent.otherSpeakers || [],
    participantsCount: apiEvent.participantsCount,
    highlights: "",
    isCompleted: apiEvent.isCompleted,
    location: apiEvent.location || "Campus",  // Ensure location is not empty
    // Critical fields for EventCarousel
    date: formattedDate,
    time: formattedTime,
    // Generate a placeholder banner if none exists
    banner: "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?auto=format&fit=crop&q=80&w=800",
    clubName: apiEvent.club?.name || "Club Event"
  };
};

// Mapping of club names to their respective icons
const clubIconMap: Record<string, any> = {
  "AI Club": Brain,
  "Robotics Club": Rocket,
  "Coding Club": Code,
  "Gaming Club": Gamepad2,
  // Add more mappings as needed
};

// Function to convert ClubData from backend to frontend Club type
const mapClubDataToClub = (clubData: ClubData): Club => {
  const clubName = clubData.name;
  const icon = clubIconMap[clubName] || Users;
  const totalMembers = clubData.members?.length || 0;
  const leaders = clubData.officeBearers?.length || 0;

  return {
    id: clubData.id,
    name: clubName,
    banner: `https://media.istockphoto.com/id/1455935808/photo/technical-college-students-exchanging-ideas.jpg?s=612x612&w=0&k=20&c=dBX_083kTILhRsHblEf89cpabyz7cuXA-UYLLPyxvP0=`,
    description: clubData.description,
    members: totalMembers,
    icon,
    joined: false,
    memberCount: {
      total: totalMembers,
      leaders,
      members: totalMembers - leaders,
    },
    roles: clubData.officeBearers?.map(bearer => ({
      name: bearer.role,
      member: bearer.name,
      permissions: bearer.details ? [bearer.details] : undefined,
    })) || [],
    tags: [clubData.department.toLowerCase()]
  };
};

// Fallback clubs for development/testing
const fallbackClubs: Club[] = [
  {
    id: 1,
    name: "AI Club",
    banner:
      "https://t3.ftcdn.net/jpg/07/66/87/68/240_F_766876856_XDPvm1sg90Ar5Hwf1jRRIHM4FNCXmhKj.jpg",
    description:
      "Explore cutting-edge AI and machine learning projects with hands-on experience.",
    members: 128,
    icon: Brain,
    joined: false,
    memberCount: {
      total: 128,
      leaders: 4,
      members: 124,
    },
    roles: [
      { name: "President", member: "Alice Johnson", permissions: ["manage_members", "manage_events"] },
      { name: "Vice President", member: "Bob Smith", permissions: ["manage_events"] },
      { name: "Secretary", member: "Carol White", permissions: ["manage_communications"] },
      { name: "Tech Lead", member: "David Brown", permissions: ["manage_projects"] },
    ],
    tags: ["artificial-intelligence", "machine-learning", "deep-learning"]
  },
  {
    id: 2,
    name: "Robotics Club",
    banner:
      "https://t3.ftcdn.net/jpg/09/09/56/02/240_F_909560292_e4YkMiZoHI2It0yKOwaHN5PG4CuxoVCC.jpg",
    description:
      "Build amazing robots and compete in international robotics competitions.",
    members: 95,
    icon: Rocket,
    joined: false,
    memberCount: {
      total: 95,
      leaders: 3,
      members: 92,
    },
    roles: [
      { name: "President", member: "Eve Wilson" },
      { name: "Vice President", member: "Frank Miller" },
      { name: "Tech Lead", member: "Grace Davis" },
    ],
  },
  {
    id: 3,
    name: "Coding Club",
    banner:
      "https://t4.ftcdn.net/jpg/09/88/54/89/240_F_988548956_6mvDAqAnoAFMfCFXJA08LBnKbqrTPpXS.jpg",
    description:
      "Level up your programming skills through exciting challenges and projects.",
    members: 156,
    icon: Code,
    joined: false,
    memberCount: {
      total: 156,
      leaders: 5,
      members: 151,
    },
    roles: [
      { name: "President", member: "Henry Lee" },
      { name: "Vice President", member: "Ivy Chen" },
      { name: "Secretary", member: "Jack Wilson" },
      { name: "Tech Lead", member: "Kelly Zhang" },
      { name: "Event Coordinator", member: "Liam Murphy" },
    ],
  },
  {
    id: 4,
    name: "Gaming Club",
    banner:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800",
    description:
      "Join competitive gaming tournaments and casual gaming sessions.",
    members: 89,
    icon: Gamepad2,
    joined: false,
    memberCount: {
      total: 89,
      leaders: 3,
      members: 86,
    },
    roles: [
      { name: "President", member: "Mike Thompson" },
      { name: "Vice President", member: "Nina Patel" },
      { name: "Event Coordinator", member: "Oscar Rodriguez" },
    ],
  },
];

// Fallback events in case the API call fails
const fallbackEvents: ClubEvent[] = [
  {
    id: 1,
    natureOfEvent: "CLUBS",
    typeOfEvent: "WORKSHOP",
    theme: ["AI and Machine Learning", "Deep Learning"],
    fundingAgency: "None",
    dates: {
      start: "2024-03-15",
      end: "2024-03-15"
    },
    chiefGuest: "Dr. John Smith",
    otherSpeakers: ["Dr. Sarah Johnson"],
    participantsCount: 30,
    highlights: "",
    isCompleted: false,
    clubId: 1,
    clubName: "AI Club",
    location: "Tech Lab 101",
    banner: "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?auto=format&fit=crop&q=80&w=800",
    description: "Learn the fundamentals of deep learning in this hands-on workshop.",
    capacity: 30,
    // For backward compatibility
    title: "AI Workshop: Deep Learning Basics",
    date: "2024-03-15",
    time: "14:00",
    registeredUsers: [
      {
        id: 1,
        username: "john_doe",
        profilePicture: "https://example.com/profile1.jpg"
      }
    ]
  },
  {
    id: 2,
    natureOfEvent: "CLUBS",
    typeOfEvent: "WORKSHOP",
    theme: ["Robotics", "Engineering"],
    fundingAgency: "None",
    dates: {
      start: "2024-03-18",
      end: "2024-03-18"
    },
    chiefGuest: "Prof. David Wilson",
    otherSpeakers: ["Dr. Emma Davis"],
    participantsCount: 0,
    highlights: "",
    isCompleted: false,
    clubId: 2,
    clubName: "Robotics Club",
    location: "Engineering Workshop",
    banner: "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&q=80&w=800",
    description: "Prepare for the upcoming robotics competition with our expert team.",
    capacity: 20,
    // For backward compatibility
    title: "Robotics Competition Prep",
    date: "2024-03-18",
    time: "15:30"
  },
  {
    id: 3,
    natureOfEvent: "CLUBS",
    typeOfEvent: "HACKATHON",
    theme: ["Coding", "Innovation"],
    fundingAgency: "None",
    dates: {
      start: "2024-03-20",
      end: "2024-03-21"
    },
    chiefGuest: "Henry Lee",
    otherSpeakers: ["Jack Wilson", "Kelly Zhang"],
    participantsCount: 0,
    highlights: "",
    isCompleted: false,
    clubId: 3,
    clubName: "Coding Club",
    location: "Innovation Hub",
    banner: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&q=80&w=800",
    description: "Join us for an exciting 24-hour coding challenge!",
    capacity: 50,
    // For backward compatibility
    title: "Hackathon Kickoff",
    date: "2024-03-20",
    time: "09:00"
  }
];

export default function StudentClubs() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [showJoinedOnly, setShowJoinedOnly] = useState(false);
  const [clubsList, setClubsList] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const isMobile = useIsMobile();

  // Fetch events from API
  const fetchEvents = async () => {
    setEventsLoading(true);
    try {
      const response = await api.get<ApiEvent[]>('events');
      
      if (response.success && response.data) {
        console.log("API response events:", response.data);
        
        // Map API events to our ClubEvent format
        const transformedEvents = response.data.map(mapApiEventToClubEvent);
        console.log("Transformed events:", transformedEvents);
        
        // Show all events for now (remove filter until we confirm it works)
        setEvents(transformedEvents);
        
        // Uncomment once verified:
        // Filter out completed events to show only upcoming ones
        // const upcomingEvents = transformedEvents.filter(event => !event.isCompleted);
        // setEvents(upcomingEvents);
      } else {
        console.error("Failed to fetch events:", response.error);
        // Use fallback events if API call fails
        setEvents(fallbackEvents);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      // Use fallback events if API call fails
      setEvents(fallbackEvents);
    } finally {
      setEventsLoading(false);
    }
  };

  // Fetch clubs from backend
  useEffect(() => {
    const fetchClubs = async () => {
      setLoading(true);
      try {
        const response = await clubService.getAllClubs();
        if (response.success && response.data) {
          // Map ClubData to Club type
          const transformedClubs = response.data.map(mapClubDataToClub);
          setClubsList(transformedClubs);
        } else {
          toast({
            title: "Error",
            description: response.error || "Failed to fetch clubs",
            variant: "destructive",
          });
          // Use fallback clubs if API call fails
          setClubsList(fallbackClubs);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred while fetching clubs",
          variant: "destructive",
        });
        // Use fallback clubs if API call fails
        setClubsList(fallbackClubs);
      } finally {
        setLoading(false);
      }
    };

    // Fetch both clubs and events when component mounts
    fetchClubs();
    fetchEvents();
  }, [toast]);

  const handleJoinToggle = (clubId: number) => {
    setClubsList((prevClubs) =>
      prevClubs.map((club) =>
        club.id === clubId
          ? {
              ...club,
              joined: !club.joined,
            }
          : club,
      ),
    );
  };

  const filteredClubs = clubsList.filter(
    (club) =>
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (showJoinedOnly ? club.joined : true),
  );

  // Debug log to check what's available at render time
  console.log("Rendering with events data:", {
    eventsCount: events.length,
    eventsLoading,
    firstEvent: events[0],
  });

  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0">
      <StudentNavbar />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8 px-4 md:px-0">
          {/* Header Section */}
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold">
              Clubs & Activities
            </h1>
            <p className="text-xl text-muted-foreground">
              Stay connected with your favorite clubs and discover exciting new
              opportunities.
            </p>
          </div>

          {/* Upcoming Events Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Upcoming Events
            </h2>
            {eventsLoading ? (
              <div className="text-center py-8 bg-card rounded-xl shadow-sm">
                <Loader2 className="h-8 w-8 text-primary mx-auto mb-4 animate-spin" />
                <p className="text-muted-foreground">Loading events...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-8 bg-card rounded-xl shadow-sm">
                <p className="text-muted-foreground">No upcoming events found</p>
              </div>
            ) : (
              <EventCarousel events={events} />
            )}
          </div>

          {/* Clubs Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-foreground">
                  Clubs
                  {filteredClubs.length > 0 && (
                    <span className="ml-2 text-sm text-muted-foreground">
                      ({filteredClubs.length}{" "}
                      {filteredClubs.length === 1 ? "club" : "clubs"})
                    </span>
                  )}
                </h2>
                <div className="flex gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {clubsList.reduce(
                      (acc, club) => acc + club.memberCount.total,
                      0,
                    )}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search clubs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Button
                  onClick={() => setShowJoinedOnly(!showJoinedOnly)}
                  variant={showJoinedOnly ? "default" : "outline"}
                  className="flex items-center gap-2"
                >
                  {showJoinedOnly ? (
                    <Heart className="h-5 w-5" />
                  ) : (
                    <HeartOff className="h-5 w-5" />
                  )}
                  <span className="hidden sm:inline">
                    {showJoinedOnly ? "Joined" : "All Clubs"}
                  </span>
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12 bg-card rounded-xl shadow-sm">
                <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Loading clubs...
                </h3>
                <p className="text-muted-foreground">
                  Please wait while we fetch club information
                </p>
              </div>
            ) : filteredClubs.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-xl shadow-sm">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No clubs found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClubs.map((club) => (
                  <ClubCard
                    key={club.id}
                    club={club}
                    onJoinToggle={handleJoinToggle}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {isMobile && <MobileBottomNav role="student" />}
    </div>
  );
}
