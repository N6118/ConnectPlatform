import { useParams, Link } from "wouter";
import ClubDetailView from "@/components/club-detail-view";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Dummy data for a club
const clubData = {
  id: 1,
  name: "Idea Club",
  banner: "https://via.placeholder.com/1200x300",
  logo: "https://via.placeholder.com/100",
  description: "A club focused on AI and ML projects.",
  currentActivities: ["AI Chatbot", "Image Recognition System"],
  pastActivities: ["AI Research Paper", "ML Competition"],
  achievements: ["Won AI Hackathon", "Best Research Paper Award"],
  members: ["John Doe", "Jane Smith", "Alice Johnson"],
};

export default function ClubDetail() {
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
      <ClubDetailView club={club} /> {/*Passing the club prop here*/}
    </div>
  );
}