import { FaEdit, FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WorkList from "@/components/WorkList";
import WorkModal from "@/components/WorkModal";
import PostsList from "@/components/PostsList";
import PerformanceOverview from "../../components/PerformanceOverview";
import SkillDevelopment from "../../components/SkillDevelopment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Heart,
  MessageCircle,
  Repeat2,
  MoreHorizontal,
  PenSquare,
  Settings,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import ActivityFeed from "@/components/Profile-ActivityFeed";
import { useToast } from "@/hooks/use-toast";
import StudentNavbar from "@/components/navigation/StudentNavbar";

interface ProfileFormData {
  about: string;
  github: string;
  linkedin: string;
  portfolio: string;
  achievements: string;
  interests: string[];
}

interface Post {
  id: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  content: string;
  image?: string;
  tags: string[];
  visibility: string;
  createdAt: Date;
  likes: number;
  comments: number;
  reposts: number;
}

export default function StudentProfile() {
  const [selectedTab, setSelectedTab] = useState("PROJECTS");
  const [showModal, setShowModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEditDetails, setShowEditDetails] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const [userData, setUserData] = useState({
    name: "Sajith Rajan",
    rollNo: "CB.EN.U4CSE21052",
    branch: "Computer Science",
    course: "B Tech",
    college: "Amrita Vishwa Vidhyapeetham",
    semester: "7",
    graduationYear: "2025",
    careerPath: "Software Engineer",
    followers: 128,
    following: 89,
    about:
      "Passionate software engineer with a focus on web development and machine learning.",
    achievements: ["Star Contributor", "Best Researcher", "Innovation Award"],
    interests: ["Web Development", "Machine Learning", "Cloud Computing"],
    socialLinks: {
      github: "https://github.com/sajithrajan",
      linkedin: "https://linkedin.com/in/sajithrajan",
      portfolio: "https://sajithrajan.dev",
    },
  });

  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      author: {
        name: "Sajith Rajan",
        role: "SDE Intern @ SAPI Full Stack | Android | ML",
        avatar: "./defaultProfile.jpg",
      },
      content:
        "Excited to share that we secured 3rd place at Anokha 2024 TechFair! 🏆✨ Over the course of 3 amazing days, we...",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&auto=format&fit=crop&q=80",
      tags: ["Event", "Hackathon"],
      visibility: "public",
      createdAt: new Date("2024-03-15T10:00:00"),
      likes: 89,
      comments: 23,
      reposts: 7,
    },
    {
      id: "2",
      author: {
        name: "Sajith Rajan",
        role: "SDE Intern @ SAPI Full Stack | Android | ML",
        avatar: "./defaultProfile.jpg",
      },
      content:
        "Just wrapped up an amazing design sprint with the team! We've made some breakthrough discoveries that will revolutionize our user experience. Can't wait to share more details soon! 🎨✨",
      tags: ["Project Update"],
      visibility: "public",
      createdAt: new Date("2024-03-20T14:30:00"),
      likes: 156,
      comments: 34,
      reposts: 12,
    },
  ]);

  const userData1 = {
    name: "Sajith Rajan",
    role: "SDE Intern @ SAPI Full Stack | Android | ML",
    avatar: "./defaultProfile.jpg",
    followers: 1234,
  };

  const { toast } = useToast();

  const handleCreatePost = (newPost: Post) => {
    setPosts([newPost, ...posts]);
    toast({
      title: "Post created",
      description: "Your post has been successfully created.",
    });
  };

  const handleEditPost = (updatedPost: Post) => {
    setPosts(
      posts.map((post) => (post.id === updatedPost.id ? updatedPost : post)),
    );
    toast({
      title: "Post updated",
      description: "Your post has been successfully updated.",
    });
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter((post) => post.id !== postId));
    toast({
      title: "Post deleted",
      description: "Your post has been successfully deleted.",
    });
  };

  const [workData, setWorkData] = useState({
    PROJECTS: [
      {
        id: 1,
        name: "Sony Project",
        description: "A web app built using React and Node.js",
        status: "Completed",
        level: "Medium",
        verified: "Verified",
        faculty: "Dr. Ritwik M",
      },
      {
        id: 2,
        name: "PiSave",
        description: "An Android app for task management",
        status: "Ongoing",
        level: "Easy",
        verified: "Unverified",
        faculty: "",
      },
    ],
    PAPERS: [
      {
        id: 1,
        title: "Research Paper A",
        status: "Published",
        verified: "Verified",
        faculty: "Prof. Anisha",
      },
    ],
    INTERNSHIPS: [
      {
        id: 1,
        name: "Software Developer Intern",
        company: "Tech Corp",
        status: "Completed",
        duration: "3 months",
        verified: "Verified",
        faculty: "Dr. Smith",
      },
    ],
    EXTRACURRICULAR: [
      {
        id: 1,
        activity: "Hackathon",
        description: "Participated in XYZ Hackathon",
      },
    ],
  });

  const handleAddItem = () => {
    setEditItem(null);
    setShowModal(true);
  };

  const handleEditItem = (item: any) => {
    setEditItem(item);
    setShowModal(true);
  };

  const handleDeleteItem = (id: number) => {
    const newData = { ...workData };
    Object.keys(newData).forEach((key) => {
      newData[key as keyof typeof workData] = newData[
        key as keyof typeof workData
      ].filter((item) => item.id !== id);
    });
    setWorkData(newData);
  };

  const handleSaveItem = (formData: any) => {
    const newData = { ...workData };
    const type = (formData.type.toUpperCase() + "S") as keyof typeof workData;

    if (editItem) {
      newData[type] = newData[type].map((item) =>
        item.id === editItem.id ? { ...item, ...formData } : item,
      );
    } else {
      const newId = Math.max(...newData[type].map((item) => item.id), 0) + 1;
      newData[type].push({ id: newId, ...formData });
    }

    setWorkData(newData);
    setShowModal(false);
    setEditItem(null);
  };

  const handleSaveDetails = (formData: ProfileFormData) => {
    setUserData({
      ...userData,
      about: formData.about,
      socialLinks: {
        github: formData.github,
        linkedin: formData.linkedin,
        portfolio: formData.portfolio,
      },
      achievements: formData.achievements.split("\n").filter((a) => a.trim()),
      interests: formData.interests,
    });
    setShowEditDetails(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <StudentNavbar />
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          <div className="relative group mx-auto lg:mx-0 flex flex-col items-center mt-14">
            {/* Avatar Section */}
            <div className="relative">
              <Avatar className="h-[200px] w-[200px] sm:h-[250px] sm:w-[250px] lg:h-[300px] lg:w-[300px] rounded-full border-4 border-blue-300 shadow-xl overflow-hidden">
                <img
                  src="https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg"
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              </Avatar>

              {/* Edit Profile Button (Visible on Hover) */}
              <button
                className="absolute bottom-2 right-2 bg-blue-600 p-2 rounded-full text-white shadow-md opacity-0 group-hover:opacity-100 hover:bg-blue-700 transition-all duration-300"
                onClick={() => setShowEditProfile(true)}
              >
                <FaEdit size={18} />
              </button>
            </div>

            {/* Follow & Message Buttons 
            <div className="absolute top-6 right-0 flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsFollowing(!isFollowing)}
                className={`text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-all duration-300 ${
                  isFollowing
                    ? "bg-blue-100 hover:bg-blue-200"
                    : "hover:bg-gray-100"
                }`}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
              <Button
                variant="secondary"
                className="text-sm font-medium px-4 py-2 rounded-lg shadow-sm"
              >
                Message
              </Button>
            </div>

            {/* Followers & Following Section */}
            <div className="mt-4 flex gap-4 text-gray-600 text-sm sm:text-base font-medium">
              <span>{userData.followers} followers</span>
              <span>{userData.following} following</span>
            </div>
          </div>

          <Card className="col-span-1 lg:col-span-2 p-6 relative">
            {/* Edit All Details Button */}
            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 right-4"
              onClick={() => setShowEditDetails(true)}
            >
              <Settings className="h-5 w-5" />
            </Button>

            <div className="flex flex-col sm:flex-row justify-between gap-6 mt-8 sm:mt-0">
              <div className="space-y-4 w-full">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-blue-800">
                    {userData.name}
                  </h1>
                  <p className="text-gray-600">{userData.rollNo}</p>
                </div>

                {/* About Section moved up */}
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">About</h3>
                  <p className="text-gray-600">{userData.about}</p>
                </div>

                {/* Profile Info Section */}
                <div className="space-y-2 mt-4">
                  <ProfileInfo label="Branch" value={userData.branch} />
                  <ProfileInfo label="Course" value={userData.course} />
                  <ProfileInfo label="College" value={userData.college} />
                  <ProfileInfo label="Semester" value={userData.semester} />
                  <ProfileInfo
                    label="Graduation Year"
                    value={userData.graduationYear}
                  />
                  <ProfileInfo
                    label="Career Path"
                    value={userData.careerPath}
                  />
                </div>

                {/* Achievements and Interests */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Achievements</h3>
                    <ScrollArea className="w-full">
                      <div className="flex gap-2 pb-2">
                        {userData.achievements.map((achievement, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="whitespace-nowrap px-3 py-1"
                          >
                            {achievement}
                          </Badge>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Interests</h3>
                    <ScrollArea className="w-full">
                      <div className="flex gap-2 pb-2">
                        {userData.interests.map((interest, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="whitespace-nowrap px-3 py-1"
                          >
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>

                <div className="flex gap-4 text-gray-600">
                  <a
                    href={userData.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 transition-colors"
                  >
                    <FaGithub size={24} />
                  </a>
                  <a
                    href={userData.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 transition-colors"
                  >
                    <FaLinkedin size={24} />
                  </a>
                  <a
                    href={userData.socialLinks.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 transition-colors"
                  >
                    <FaGlobe size={24} />
                  </a>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Skills and Performance Overview in same row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Card className="p-6">
            <PerformanceOverview />
          </Card>
          <Card className="p-6">
            <SkillDevelopment />
          </Card>
        </div>
      </div>
      <div className="container mx-auto py-8 px-4">
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8" aria-label="Work Categories">
            {["Projects", "Papers", "Internships", "Extracurricular"].map(
              (tab) => (
                <TabOption
                  key={tab}
                  label={tab}
                  selected={selectedTab === tab.toUpperCase()}
                  onClick={() => setSelectedTab(tab.toUpperCase())}
                />
              ),
            )}
          </nav>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="mt-6"
          >
            <WorkList
              items={workData[selectedTab as keyof typeof workData]}
              type={selectedTab.slice(0, -1)}
              onAdd={handleAddItem}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Activity Feed moved to bottom */}
      <div className="mt-8">
        <ActivityFeed
          userData={userData1}
          posts={posts}
          onCreatePost={handleCreatePost}
          onEditPost={handleEditPost}
          onDeletePost={handleDeletePost}
        />
      </div>

      <WorkModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveItem}
        item={editItem}
      />

      <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile Picture</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input type="file" accept="image/*" />
            <div className="flex justify-end">
              <Button onClick={() => setShowEditProfile(false)}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDetails} onOpenChange={setShowEditDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Profile Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium">About</label>
              <Textarea
                value={userData.about}
                onChange={(e) =>
                  setUserData({ ...userData, about: e.target.value })
                }
                placeholder="Write something about yourself..."
                rows={4}
              />
            </div>
            <div>
              <label className="text-sm font-medium">GitHub URL</label>
              <Input
                value={userData.socialLinks.github}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    socialLinks: {
                      ...userData.socialLinks,
                      github: e.target.value,
                    },
                  })
                }
                placeholder="https://github.com/username"
              />
            </div>
            <div>
              <label className="text-sm font-medium">LinkedIn URL</label>
              <Input
                value={userData.socialLinks.linkedin}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    socialLinks: {
                      ...userData.socialLinks,
                      linkedin: e.target.value,
                    },
                  })
                }
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Portfolio URL</label>
              <Input
                value={userData.socialLinks.portfolio}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    socialLinks: {
                      ...userData.socialLinks,
                      portfolio: e.target.value,
                    },
                  })
                }
                placeholder="https://yourportfolio.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Achievements (one per line)
              </label>
              <Textarea
                value={userData.achievements.join("\n")}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    achievements: e.target.value
                      .split("\n")
                      .filter((a) => a.trim()),
                  })
                }
                placeholder="Enter achievements..."
                rows={4}
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Interests (comma-separated)
              </label>
              <Input
                value={userData.interests.join(", ")}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    interests: e.target.value
                      .split(",")
                      .map((i) => i.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="Web Development, Machine Learning, etc."
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setShowEditDetails(false)}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Other modals remain unchanged */}
    </div>
  );
}

const ProfileInfo = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col sm:flex-row sm:gap-4">
    <div className="font-semibold text-gray-700">{label}:</div>
    <div className="text-gray-800">{value}</div>
  </div>
);

const TabOption = ({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) => (
  <button
    className={`pb-4 border-b-2 text-sm font-medium transition-colors ${
      selected
        ? "border-blue-600 text-blue-600"
        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);
