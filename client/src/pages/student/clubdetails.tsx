import { useParams, Link } from "wouter";
import ClubDetailView from "@/components/club-detail-view";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Dummy data for a club
const clubData = {
  id: 1,
  name: "Idea Club",
  banner:
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80",
  logo: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?auto=format&fit=crop&q=80",
  description: "A club focused on AI and ML projects.",
  membershipStatus: "active",
  memberCount: {
    total: 128,
    leaders: 4,
    members: 124,
  },
  roles: [],
  upcomingEvents: [
    {
      id: "1",
      title: "AI Workshop Series",
      description: "Learn about the latest developments in AI",
      date: "2024-03-15",
      type: "Workshop",
      location: "Tech Lab 101",
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
      content: "Excited to announce our upcoming AI Workshop!",
      type: "announcement",
      timestamp: new Date().toISOString(),
      likes: 24,
      comments: 5,
      shares: 3,
    },
  ],
  achievements: [
    {
      id: "1",
      name: "Best Innovation Award",
      description: "First place in Regional Tech Competition",
      date: new Date().toISOString(),
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
      joinDate: "2024-01-01",
    },
  ],
};

export default function StudentClubDetail() {
  const { id } = useParams();

  // In a real app, you'd fetch the club data based on the ID
  const club = clubData;

  return (
    <div className="relative">
      <div className="container mx-auto p-4">
        <Button variant="ghost" className="mb-4" asChild>
          <Link href="/clubs" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Clubs
          </Link>
        </Button>
      </div>
      <ClubDetailView club={club} />
    </div>
  );
}
