import { useParams, Link } from "wouter";
import ClubDetailView from "@/components/clubs-components/club-detail-view";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import FacultyNavbar from "@/components/navigation/FacultyNavbar";
const clubData = {
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
  roles: [{ name: "President", member: "John Doe" }],
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
      content: "Excited to announce our upcoming AI Workshop!",
      type: "announcement" as const,
      timestamp: new Date().toISOString(),
      likes: 24,
      comments: 5,
      shares: 3,
      isEditable: true,
    },
  ],
  achievements: [
    {
      id: "1",
      name: "Best Innovation Award",
      description: "First place in Regional Tech Competition",
      date: new Date().toISOString(),
      icon: "trophy" as const,
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

export default function FacultyClubDetail() {
  const { id } = useParams();

  return (
    <div className="relative">
      <FacultyNavbar />
      <div className="container mx-auto p-4">
        <Button variant="ghost" className="mb-4" asChild>
          <Link href="/Faculty/clubs" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Clubs
          </Link>
        </Button>
      </div>
      <ClubDetailView club={clubData} currentUserId="1" />
    </div>
  );
}