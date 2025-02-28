import { useParams, Link } from "wouter";
import ClubDetailView from "@/components/clubs-components/club-detail-view.tsx";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import StudentNavbar from "@/components/navigation/StudentNavbar";
import MobileBottomNav from "@/components/navigation/MobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import ActivityFeed from "@/components/Profile-ActivityFeed";
import { Post } from "../types";

type EventType = "Hackathon" | "Workshop" | "Meeting" | "Other";

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
      type: "Hackathon" as EventType,
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
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80",
      },
      content: "Excited to announce our upcoming AI Workshop!",
      tags: ["AI", "Workshop"],
      visibility: "public",
      createdAt: new Date(),
      likes: 24,
      comments: 5,
      reposts: 3,
      type: "announcement",
      timestamp: new Date().toISOString(),
      shares: 3,
      isEditable: true
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

export default function StudentClubDetail() {
  const { id } = useParams();
  const clubId = parseInt(id || "0");
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // Add state for posts
  const [posts, setPosts] = useState<Post[]>(
    clubData.activityFeed.map(post => ({
      ...post,
      timestamp: new Date(post.timestamp),
      createdAt: new Date(post.createdAt)
    }))
  );

  // Add error handling for invalid club ID
  if (!clubId) {
    return <div>Invalid club ID</div>;
  }

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
      <ClubDetailView clubId={clubId} currentUserId="1" />
      
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

      {isMobile && <MobileBottomNav role="student" />}
    </div>
  );
}
