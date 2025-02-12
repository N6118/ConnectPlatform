import { useParams } from "wouter"
import { ClubDetailView } from "@/components/ui/club-detail-view"

// Dummy data for a club
const clubData = {
  id: 1,
  name: 'Idea Club',
  banner: 'https://via.placeholder.com/1200x300',
  logo: 'https://via.placeholder.com/100',
  description: 'A club focused on AI and ML projects.',
  currentActivities: ['AI Chatbot', 'Image Recognition System'],
  pastActivities: ['AI Research Paper', 'ML Competition'],
  achievements: ['Won AI Hackathon', 'Best Research Paper Award'],
  members: ['John Doe', 'Jane Smith', 'Alice Johnson'],
}

export default function ClubDetail() {
  const { id } = useParams()
  
  // In a real app, you'd fetch the club data based on the ID
  const club = clubData

  return <ClubDetailView club={club} />
}
