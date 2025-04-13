import { FaEdit, FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WorkList from "@/components/WorkList";
import WorkModal from "@/components/WorkModal";
import ProjectModal from "@/components/my-space-components/ProjectModal";
import PaperModal from "@/components/profile-components/PaperModal";

import PostsList from "@/components/PostsList";
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

import {
  Heart,
  MessageCircle,
  Repeat2,
  MoreHorizontal,
  PenSquare,
  Settings,
} from "lucide-react";

import ActivityFeed from "@/components/Profile-ActivityFeed";
import { useToast } from "@/hooks/use-toast";
import FacultyNavbar from "@/components/navigation/FacultyNavbar";
import { projectService, CreateProjectData } from "@/services/project";
import { paperService, CreatePaperData } from "@/services/paper";

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

interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  fundingAmount: string;
  teamSize: string;
  collaborators: string[];
}

interface Paper {
  id: number;
  title: string;
  journal: string;
  year: string;
  citations: number;
  impact: number;
}

interface Course {
  id: number;
  name: string;
  code: string;
  semester: string;
  students: number;
  rating: number;
}

interface Supervision {
  id: number;
  type: string;
  studentName: string;
  topic: string;
  status: string;
  year: string;
}

interface WorkItem {
  id: number;
  name: string;
  description: string;
  status: string;
  type?: string;
  // Project specific fields
  level?: string;
  techStack?: string[];
  tags?: string[];
  // Paper specific fields
  journal?: string;
  title?: string;
  year?: string;
  citations?: number;
  impact?: number;
  // Internship specific fields
  company?: string;
  location?: string;
  // Extracurricular specific fields
  organization?: string;
  role?: string;
  faculty?: string;
  activity?: string;
}

interface WorkData {
  PROJECTS: WorkItem[];
  PAPERS: WorkItem[];
}

export default function FacultyProfile() {
  const [selectedTab, setSelectedTab] = useState("PROJECTS");
  const [showModal, setShowModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showPaperModal, setShowPaperModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEditDetails, setShowEditDetails] = useState(false);
  const [editItem, setEditItem] = useState<WorkItem | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const [userData, setUserData] = useState({
    name: "Dr. Manish Reddy",
    employeeId: "FAC2024CS103",
    department: "Computer Science and Engineering",
    designation: "Associate Professor",
    college: "Amrita Vishwa Vidhyapeetham",
    experience: "15 years",
    specialization: "Machine Learning and Data Science",
    followers: 128,
    following: 89,
    about: "Experienced professor with expertise in Machine Learning and Data Science. Leading research in AI applications for healthcare. Published over 20 papers in international journals.",
    achievements: [
      "Best Faculty Award 2023",
      "IEEE Senior Member",
      "Research Excellence Award",
      "5 Patents Filed"
    ],
    interests: [
      "Machine Learning",
      "Healthcare AI",
      "Big Data Analytics",
      "Computer Vision"
    ],
    socialLinks: {
      github: "https://github.com/drsajithrajan",
      linkedin: "https://linkedin.com/in/drsajithrajan",
      portfolio: "https://sajithrajan.dev",
    },
  });

  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      author: {
        name: "Dr. Manish Reddy",
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
        name: "Dr. Manish Reddy",
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
    name: "Dr. Manish Reddy",
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

  const [workData, setWorkData] = useState<WorkData>({
    PROJECTS: [
      {
        id: 1,
        name: "AI-Powered Healthcare Diagnostics",
        description:
          "Developing machine learning models for early disease detection",
        status: "Ongoing",
        level: "Difficult",
        techStack: ["Python", "TensorFlow", "Medical Imaging"],
      },
      {
        id: 2,
        name: "Quantum Computing Algorithms",
        description:
          "Research on novel quantum algorithms for optimization problems",
        status: "Completed",
        level: "Difficult",
        techStack: ["Qiskit", "Python", "Linear Algebra"],
      },
    ],
    PAPERS: [
      {
        id: 1,
        title: "Advances in Neural Network Architectures",
        name: "Advances in Neural Network Architectures",
        description:
          "A comprehensive survey of recent innovations in neural network design",
        journal: "IEEE Transactions on Neural Networks",
        year: "2023",
        citations: 45,
        status: "Published",
      },
      {
        id: 2,
        title: "Ethical Implications of AI in Education",
        name: "Ethical Implications of AI in Education",
        description:
          "Analysis of the ethical considerations when deploying AI systems in educational settings",
        journal: "Journal of AI Ethics",
        year: "2022",
        citations: 28,
        status: "Published",
      },
    ],
  });

  const handleAddItem = () => {
    setEditItem(null);
    
    // Show the appropriate modal based on the selected tab
    switch (selectedTab) {
      case "PROJECTS":
        setShowProjectModal(true);
        break;
      case "PAPERS":
        setShowPaperModal(true);
        break;
      default:
        setShowModal(true);
        break;
    }
  };

  const handleEditItem = (item: WorkItem) => {
    setEditItem(item);
    
    // Show the appropriate modal based on the selected tab
    switch (selectedTab) {
      case "PROJECTS":
        setShowProjectModal(true);
        break;
      case "PAPERS":
        setShowPaperModal(true);
        break;
      default:
        setShowModal(true);
        break;
    }
  };

  const handleDeleteItem = (id: number) => {
    const newData = { ...workData };
    (Object.keys(newData) as Array<keyof WorkData>).forEach((key) => {
      newData[key] = (newData[key] as any[]).filter((item) => item.id !== id);
    });
    setWorkData(newData);
  };

  const handleSaveItem = (formData: any) => {
    const newData = { ...workData };
    const type = (formData.type.toUpperCase() + "S") as keyof WorkData;

    if (editItem) {
      newData[type] = newData[type].map((item) =>
        item.id === editItem.id ? { ...item, ...formData } : item
      );
    } else {
      const newId = Math.max(...newData[type].map((item) => item.id), 0) + 1;
      newData[type] = [...newData[type], { id: newId, ...formData }];
    }

    setWorkData(newData);
    setShowModal(false);
    setEditItem(null);
  };

  // Handle saving projects through the ProjectModal
  const handleSaveProject = async (projectData: any) => {
    try {
      // Convert the project data to the format expected by the API
      const createProjectData: CreateProjectData = {
        projectName: projectData.title,
        projectDescription: projectData.description,
        prerequisites: projectData.prerequisites,
        techStack: projectData.techStack.split(",").map((tech: string) => tech.trim()),
        tags: projectData.tag.split(",").map((tag: string) => tag.trim()),
        projectDurationMonths: parseInt(projectData.duration),
        projectStatus: projectData.status.toUpperCase().replace(" ", "_"),
        level: projectData.level.toUpperCase() as "EASY" | "MEDIUM" | "HARD",
        isOpenForApplications: projectData.isOpenForApplications,
      };

      // Call the project service to create the project
      const response = await projectService.createProject(createProjectData);
      
      if (response.success && response.data) {
        // Close the modal
        setShowProjectModal(false);
        
        // Add the new project to the PROJECTS array in workData
        const newProject: WorkItem = {
          id: response.data.id || 0,
          name: response.data.name,
          description: response.data.description,
          status: response.data.status,
          level: response.data.projectLevel,
          techStack: response.data.techStack,
          tags: response.data.tags
        };
        
        setWorkData(prevData => ({
          ...prevData,
          PROJECTS: [...prevData.PROJECTS, newProject]
        }));
        
        toast({
          title: "Success",
          description: "Project created successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to create project",
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Handle saving papers through the PaperModal
  const handleSavePaper = async (paperData: any) => {
    try {
      // Convert the paper data to the format expected by the API
      const createPaperData: CreatePaperData = {
        title: paperData.title,
        description: paperData.description,
        authors: paperData.authors,
        journal: paperData.journal,
        publicationDate: paperData.publicationDate,
        doi: paperData.doi,
        status: paperData.status,
        tags: paperData.tags.split(",").map((tag: string) => tag.trim()),
        url: paperData.url,
        citations: parseInt(paperData.citations) || 0,
      };

      // Call the paper service to create the paper
      const response = await paperService.createPaper(createPaperData);
      
      if (response.success && response.data) {
        // Close the modal
        setShowPaperModal(false);
        
        // Add the new paper to the PAPERS array in workData
        const newPaper: WorkItem = {
          id: response.data.id || 0, // Ensure id is a number
          title: response.data.title || '',
          name: response.data.title || '', // Set both title and name for compatibility
          description: response.data.description || '',
          status: response.data.status || '',
          journal: response.data.journal || '',
          citations: response.data.citations || 0
        };
        
        setWorkData(prevData => ({
          ...prevData,
          PAPERS: [...prevData.PAPERS, newPaper]
        }));
        
        toast({
          title: "Success",
          description: "Paper created successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to create paper",
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
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
      <FacultyNavbar />
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          <div className="relative group mx-auto lg:mx-0 flex flex-col items-center mt-14">
            {/* Avatar Section */}
            <div className="relative">
              <Avatar className="h-[200px] w-[200px] sm:h-[250px] sm:w-[250px] lg:h-[300px] lg:w-[300px] rounded-full border-4 border-green-300 shadow-xl overflow-hidden">
                <img
                  src="https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI0LTEyL3Jhd3BpeGVsX29mZmljZV8zMF9waG90b19vZl9hbl9pbmRpYW5fbWFuX3NtaWxpbmdfaXNvbGF0ZWRfb25fd182YWYzNjI5ZS1hMjNmLTRjZjgtOWUzYS1jNGQ4NWQ2MmI4NzdfMS5qcGc.jpg"
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
                  <p className="text-gray-600">{userData.designation}</p>
                  <p className="text-gray-600">{userData.employeeId}</p>
                </div>

                {/* About Section moved up */}
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">About</h3>
                  <p className="text-gray-600">{userData.about}</p>
                </div>

                {/* Profile Info Section */}
                <div className="space-y-2 mt-4">
                  <ProfileInfo label="Department" value={userData.department} />
                  <ProfileInfo label="College" value={userData.college} />
                  <ProfileInfo label="Experience" value={userData.experience} />
                  <ProfileInfo label="Specialization" value={userData.specialization} />
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
      </div>
      <div className="container mx-auto py-8 px-4">
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8" aria-label="Work Categories">
            {["Projects", "Papers"].map(
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

      {/* Regular WorkModal for generic items */}
      <WorkModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveItem}
        item={editItem}
      />

      {/* Project Modal */}
      {showProjectModal && (
        <ProjectModal
          project={editItem ? {
            title: editItem.name || (editItem as any).title || "",
            description: editItem.description || "",
            prerequisites: (editItem as any).prerequisites || "",
            mentor: editItem.faculty || "",
            tag: Array.isArray((editItem as any).tags) ? (editItem as any).tags.join(", ") : ((editItem as any).tag || ""),
            techStack: Array.isArray(editItem.techStack) ? editItem.techStack.join(", ") : ((editItem as any).techStack || ""),
            level: (editItem.level as "Easy" | "Medium" | "Difficult") || "Medium",
            duration: (editItem as any).duration || "1",
            status: editItem.status === "Ongoing" ? "In Progress" : 
                   editItem.status === "Completed" ? "Completed" : "Not Started",
            skills: (editItem as any).skills || "",
            maxTeamSize: (editItem as any).maxTeamSize || "4",
            isOpenForApplications: (editItem as any).isOpenForApplications !== undefined ? (editItem as any).isOpenForApplications : true,
          } : undefined}
          onClose={() => setShowProjectModal(false)}
          onSave={handleSaveProject}
        />
      )}

      {/* Paper Modal */}
      {showPaperModal && (
        <PaperModal
          paper={editItem ? {
            title: editItem.name || (editItem as any).title || "",
            description: editItem.description || "",
            authors: (editItem as any).authors || "",
            journal: (editItem as any).journal || "",
            publicationDate: (editItem as any).year || "",
            doi: (editItem as any).doi || "",
            status: editItem.status as "Draft" | "Submitted" | "Published" | "Rejected",
            tags: Array.isArray((editItem as any).tags) ? (editItem as any).tags.join(", ") : "",
            url: (editItem as any).url || "",
            citations: String((editItem as any).citations || "0"),
          } : undefined}
          onClose={() => setShowPaperModal(false)}
          onSave={handleSavePaper}
        />
      )}



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
