import { useState } from "react";
import { EventCarousel } from "@/components/ui/event-carousel";
import { ClubCard } from "@/components/ui/club-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const upcomingEvents = [
  {
    id: 1,
    title: "AI Workshop: Deep Learning Basics",
    date: "2024-03-15",
    time: "14:00",
    location: "Tech Lab 101",
    clubId: 1,
    clubName: "AI Club",
    banner:
      "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?auto=format&fit=crop&q=80&w=800",
    description:
      "Learn the fundamentals of deep learning in this hands-on workshop.",
    capacity: 30,
  },
  {
    id: 2,
    title: "Robotics Competition Prep",
    date: "2024-03-18",
    time: "15:30",
    location: "Engineering Workshop",
    clubId: 2,
    clubName: "Robotics Club",
    banner:
      "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&q=80&w=800",
    description:
      "Prepare for the upcoming robotics competition with our expert team.",
    capacity: 20,
  },
  {
    id: 3,
    title: "Hackathon Kickoff",
    date: "2024-03-20",
    time: "09:00",
    location: "Innovation Hub",
    clubId: 3,
    clubName: "Coding Club",
    banner:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&q=80&w=800",
    description: "Join us for an exciting 24-hour coding challenge!",
    capacity: 50,
  },
];

const clubs = [
  {
    id: 1,
    name: "AI Club",
    banner:
      "https://t3.ftcdn.net/jpg/07/66/87/68/240_F_766876856_XDPvm1sg90Ar5Hwf1jRRIHM4FNCXmhKj.jpg",
    description:
      "Explore cutting-edge AI and machine learning projects with hands-on experience.",
    members: 128,
    rating: 4.8,
    achievements: 12,
    icon: Brain,
    joined: false,
    membershipStatus: "active", // New field
    memberCount: {
      total: 128,
      leaders: 4,
      members: 124,
    },
    roles: [
      { name: "President", member: "Alice Johnson" },
      { name: "Vice President", member: "Bob Smith" },
      { name: "Secretary", member: "Carol White" },
      { name: "Tech Lead", member: "David Brown" },
    ],
  },
  {
    id: 2,
    name: "Robotics Club",
    banner:
      "https://t3.ftcdn.net/jpg/09/09/56/02/240_F_909560292_e4YkMiZoHI2It0yKOwaHN5PG4CuxoVCC.jpg",
    description:
      "Build amazing robots and compete in international robotics competitions.",
    members: 95,
    rating: 4.9,
    achievements: 15,
    icon: Rocket,
    joined: false,
    membershipStatus: "pending", // New field
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
    rating: 4.7,
    achievements: 18,
    icon: Code,
    joined: false,
    membershipStatus: "active", // New field
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
    rating: 4.6,
    achievements: 8,
    icon: Gamepad2,
    joined: false,
    membershipStatus: "inactive", // New field
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

export default function Clubs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showJoinedOnly, setShowJoinedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [clubsList, setClubsList] = useState(clubs);
  const [selectedClub, setSelectedClub] = useState(null);

  const handleJoinToggle = (clubId: number) => {
    setClubsList((prevClubs) =>
      prevClubs.map((club) =>
        club.id === clubId
          ? {
              ...club,
              joined: !club.joined,
              membershipStatus: !club.joined ? "pending" : "inactive",
            }
          : club,
      ),
    );
  };

  const getMembershipStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500";
      case "inactive":
        return "bg-gray-500/10 text-gray-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const filteredClubs = clubsList
    .filter(
      (club) =>
        club.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (showJoinedOnly ? club.joined : true),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.members - a.members;
        case "rating":
          return b.rating - a.rating;
        case "achievements":
          return b.achievements - a.achievements;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold">Clubs & Activities</h1>
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
          <EventCarousel events={upcomingEvents} />
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
                  {clubsList.reduce((acc, club) => acc + club.memberCount.total, 0)}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Trophy className="h-3 w-3" />
                  {clubsList.reduce((acc, club) => acc + club.achievements, 0)}
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

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="achievements">Most Achievements</SelectItem>
                </SelectContent>
              </Select>

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

          {filteredClubs.length === 0 ? (
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
                <div key={club.id} className="space-y-2">
                  <ClubCard club={club} onJoinToggle={handleJoinToggle} />
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`${getMembershipStatusColor(
                          club.membershipStatus,
                        )}`}
                      >
                        {club.membershipStatus}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Users className="h-3 w-3" />
                        {club.memberCount.total}
                      </Badge>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1">
                      Leaders: {club.memberCount.leaders}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}