import { FaEdit, FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WorkList from "@/components/WorkList";
import WorkModal from "@/components/WorkModal";
import PostsList from "@/components/PostsList";
import PerformanceOverview from "@/components/StudentDashboard-components/PerformanceOverview";
import SkillDevelopment from "@/components/StudentDashboard-components/SkillDevelopment";
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

import ActivityFeed from "@/components/Profile-ActivityFeed";
import { useToast } from "@/hooks/use-toast";
import StudentNavbar from "@/components/navigation/StudentNavbar";
import MobileBottomNav from "@/components/navigation/MobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { profileService, ProfileInfo, WorkData, WorkItem, UpdateProfileData, UserProfileResponse } from "@/services/profile";
import { Post } from "@/pages/types";

export default function StudentProfile() {
  const [selectedTab, setSelectedTab] = useState("PROJECTS");
  const [showModal, setShowModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEditDetails, setShowEditDetails] = useState(false);
  const [editItem, setEditItem] = useState<WorkItem | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [userData, setUserData] = useState<ProfileInfo>({
    id: "",
    name: "",
    rollNo: "",
    branch: "",
    course: "",
    college: "",
    semester: "",
    graduationYear: "",
    careerPath: "",
    followers: 0,
    following: 0,
    about: "",
    achievements: [],
    interests: [],
    socialLinks: {
      github: "",
      linkedin: "",
      portfolio: "",
    },
  });

  const [posts, setPosts] = useState<Post[]>([]);
  const [workData, setWorkData] = useState<WorkData>({
    PROJECTS: [],
    PAPERS: [],
    INTERNSHIPS: [],
    EXTRACURRICULAR: [],
  });

  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Fetch profile data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get username from localStorage
        const userDataString = localStorage.getItem('user');
        if (!userDataString) {
          throw new Error('User data not found in localStorage');
        }
        
        const userData = JSON.parse(userDataString);
        const username = userData.username;
        
        if (!username) {
          throw new Error('Username not found in user data');
        }
        
        // Fetch profile info using username
        const profileResponse = await profileService.getProfileByUsername(username);
        console.log('Profile response:', JSON.stringify(profileResponse));
        
        if (profileResponse.success && profileResponse.data) {
          const apiData = profileResponse.data.data; // Access data within the response
          console.log('API Data:', JSON.stringify(apiData));
          
          // Transform API data to match ProfileInfo structure
          const mappedUserData: Partial<ProfileInfo> = {
            id: apiData.id !== undefined ? String(apiData.id) : "",
            name: apiData.name || username || "User",
            careerPath: apiData.headline || "",
            avatar: apiData.profilePicture || undefined,
            // Map student details
            rollNo: apiData.studentDetails?.enrollmentNumber || "",
            branch: apiData.studentDetails?.branch || "",
            course: apiData.studentDetails?.course || "",
            college: apiData.studentDetails?.college || "",
            semester: apiData.studentDetails?.semester || "",
            graduationYear: apiData.studentDetails?.graduationYear || "",
            // Map other profile information
            about: apiData.about || "",
            achievements: apiData.achievement || [],
            interests: apiData.interest || [],
            // Map social links
            socialLinks: {
              github: apiData.socialLinks?.github || "",
              linkedin: apiData.socialLinks?.linkedin || "",
              portfolio: apiData.socialLinks?.portfolio || ""
            },
            // Default values for followers/following if not provided
            followers: apiData.followers || 0,
            following: apiData.following || 0
          };
          
          // Update only the fields we received, keep defaults for the rest
          setUserData(prevData => ({
            ...prevData,
            ...mappedUserData
          }));
          
          // If posts are included in the response, set them
          if (apiData.post && Array.isArray(apiData.post)) {
            try {
              console.log('Processing posts data:', JSON.stringify(apiData.post.slice(0, 1)));
              
              const mappedPosts = apiData.post.map((postData) => {
                // Verify we have an id before proceeding
                if (!postData || !postData.id) {
                  console.warn("Received invalid post data:", postData);
                  return null;
                }
                
                // Handle media URL extraction safely
                let imageUrl: string | undefined = undefined;
                if (postData.media) {
                  if (typeof postData.media === 'string') {
                    imageUrl = postData.media;
                  } else if (typeof postData.media === 'object' && postData.media !== null) {
                    // @ts-ignore - Handle potential mismatch in API response structure
                    imageUrl = postData.media.url || undefined;
                  }
                }
                
                // Create a post with required fields, using defaults for missing ones
                return {
                  id: postData.id,
                  content: postData.content || "",
                  createdAt: postData.createdAt ? new Date(postData.createdAt) : new Date(),
                  tags: Array.isArray(postData.tags) ? postData.tags : [],
                  likes: postData.likes || 0,
                  comments: postData.comments || 0,
                  visibility: postData.visibility || "PUBLIC",
                  type: postData.type || "EVENT",
                  // Required fields by Post interface, set with defaults if not in API
                  reposts: 0,
                  image: imageUrl,
                  timestamp: postData.createdAt ? new Date(postData.createdAt) : new Date(),
                  shares: 0,
                  isEditable: true,
                  author: {
                    id: String(apiData.id) || "",
                    name: postData.author?.name || apiData.name || username || "User",
                    role: postData.author?.headline || apiData.headline || "",
                    avatar: postData.author?.profilePicture || apiData.profilePicture || "./defaultProfile.jpg"
                  }
                } as Post;
              }).filter((post): post is Post => post !== null); // Type guard to filter out null values
              
              console.log('Mapped posts:', mappedPosts.length);
              setPosts(mappedPosts);
            } catch (error) {
              console.error("Error processing posts data:", error);
              // Set empty posts array on error
              setPosts([]);
            }
          } else {
            // Reset posts if none are returned
            setPosts([]);
          }
        } else {
          setError(profileResponse.error || "Failed to load profile data");
          toast({
            title: "Error",
            description: profileResponse.error || "Failed to load profile data",
            variant: "destructive",
          });
        }

        // For now, keeping these separate API calls
        // but they might need to be updated or removed based on actual API structure
        try {
          const workResponse = await profileService.getWorkData();
          if (workResponse.success && workResponse.data) {
            setWorkData(workResponse.data);
          }
        } catch (error) {
          console.log("Work data not available, using defaults");
          // Use default empty data if API fails
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleCreatePost = async (newPost: Post) => {
    console.log("Profile: handleCreatePost called with:", JSON.stringify(newPost));
    try {
      // For profile posts, we don't need clubId, so we call the profile service directly
      const response = await profileService.createPost(newPost);
      if (response.success && response.data) {
        setPosts([response.data, ...posts]);
        toast({
          title: "Post created",
          description: "Your post has been successfully created.",
        });
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to create post",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in handleCreatePost:", error);
      toast({
        title: "Error",
        description: "An error occurred while creating the post",
        variant: "destructive",
      });
    }
  };

  const handleEditPost = async (updatedPost: Post) => {
    console.log("Profile: handleEditPost called with:", JSON.stringify(updatedPost));
    try {
      // For profile posts, we use the profile service
      const response = await profileService.updatePost(updatedPost.id, updatedPost);
      if (response.success && response.data) {
        setPosts(posts.map((post) => (post.id === updatedPost.id ? response.data! : post)));
        toast({
          title: "Post updated",
          description: "Your post has been successfully updated.",
        });
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to update post",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in handleEditPost:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating the post",
        variant: "destructive",
      });
    }
  };

  const handleDeletePost = async (postId: string) => {
    console.log("Profile: handleDeletePost called with ID:", postId);
    try {
      // For profile posts, we use the profile service
      const response = await profileService.deletePost(postId);
      if (response.success) {
        setPosts(posts.filter((post) => post.id !== postId));
        toast({
          title: "Post deleted",
          description: "Your post has been successfully deleted.",
        });
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to delete post",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in handleDeletePost:", error);
      toast({
        title: "Error",
        description: "An error occurred while deleting the post",
        variant: "destructive",
      });
    }
  };

  const handleAddItem = () => {
    setEditItem(null);
    setShowModal(true);
  };

  const handleEditItem = (item: WorkItem) => {
    setEditItem(item);
    setShowModal(true);
  };

  const handleDeleteItem = async (id: number) => {
    try {
      const type = selectedTab.slice(0, -1); // Remove 's' from the end to get singular form
      const response = await profileService.deleteWorkItem(type, id);
      
      if (response.success) {
        const newData = { ...workData };
        newData[selectedTab] = workData[selectedTab].filter((item) => item.id !== id);
        setWorkData(newData);
        toast({
          title: "Success",
          description: `${type} deleted successfully.`,
        });
      } else {
        toast({
          title: "Error",
          description: response.error || `Failed to delete ${type.toLowerCase()}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the item",
        variant: "destructive",
      });
    }
  };

  const handleSaveItem = async (formData: any) => {
    try {
      const type = (formData.type.toUpperCase() + "S") as keyof WorkData;
      
      if (editItem) {
        // Update existing item
        const response = await profileService.updateWorkItem(
          formData.type, 
          editItem.id, 
          formData
        );
        
        if (response.success && response.data) {
          const newData = { ...workData };
          newData[type] = workData[type].map((item) =>
            item.id === editItem.id ? response.data! : item
          );
          setWorkData(newData);
          toast({
            title: "Success",
            description: `${formData.type} updated successfully.`,
          });
        } else {
          toast({
            title: "Error",
            description: response.error || `Failed to update ${formData.type.toLowerCase()}`,
            variant: "destructive",
          });
        }
      } else {
        // Create new item
        const response = await profileService.addWorkItem(formData.type, formData);
        
        if (response.success && response.data) {
          const newData = { ...workData };
          newData[type] = [...workData[type], response.data];
          setWorkData(newData);
          toast({
            title: "Success",
            description: `${formData.type} added successfully.`,
          });
        } else {
          toast({
            title: "Error",
            description: response.error || `Failed to add ${formData.type.toLowerCase()}`,
            variant: "destructive",
          });
        }
      }
      
      setShowModal(false);
      setEditItem(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving the item",
        variant: "destructive",
      });
    }
  };

  const handleSaveDetails = async (formData: UpdateProfileData) => {
    try {
      const response = await profileService.updateProfile(formData);
      
      if (response.success && response.data) {
        setUserData(response.data);
        setShowEditDetails(false);
        toast({
          title: "Success",
          description: "Profile updated successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to update profile",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating the profile",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProfilePicture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('avatar', file);
      
      try {
        const response = await profileService.updateProfilePicture(formData);
        
        if (response.success && response.data) {
          setUserData({
            ...userData,
            avatar: response.data.avatarUrl
          });
          setShowEditProfile(false);
          toast({
            title: "Success",
            description: "Profile picture updated successfully.",
          });
        } else {
          toast({
            title: "Error",
            description: response.error || "Failed to update profile picture",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while updating the profile picture",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="mt-4 text-gray-600">Loading profile data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <StudentNavbar />
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          <div className="relative group mx-auto lg:mx-0 flex flex-col items-center mt-14">
            {/* Avatar Section */}
            <div className="relative">
              <Avatar className="h-[200px] w-[200px] sm:h-[250px] sm:w-[250px] lg:h-[300px] lg:w-[300px] rounded-full border-4 border-blue-300 shadow-xl overflow-hidden">
                {userData.avatar ? (
                  <img
                    src={userData.avatar}
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <img
                    src="https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI0LTAxL3Jhd3BpeGVsb2ZmaWNlMTJfcGhvdG9fb2ZfeW91bmdfaW5kaWFuX2dpcmxfaG9sZGluZ19zdHVkZW50X2JhY19hNDdmMzk1OS0zZDAyLTRiZWEtYTEzOS1lYzI0ZjdhNjEwZGFfMS5qcGc.jpg"
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                )}
              </Avatar>

              {/* Edit Profile Button (Visible on Hover) */}
              <button
                className="absolute bottom-2 right-2 bg-blue-600 p-2 rounded-full text-white shadow-md opacity-0 group-hover:opacity-100 hover:bg-blue-700 transition-all duration-300"
                onClick={() => setShowEditProfile(true)}
              >
                <FaEdit size={18} />
              </button>
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
                  <ProfileInfoItem label="Branch" value={userData.branch} />
                  <ProfileInfoItem label="Course" value={userData.course} />
                  <ProfileInfoItem label="College" value={userData.college} />
                  <ProfileInfoItem label="Semester" value={userData.semester} />
                  <ProfileInfoItem
                    label="Graduation Year"
                    value={userData.graduationYear}
                  />
                  <ProfileInfoItem
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
                        {userData.achievements?.map((achievement, index) => (
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
                        {userData.interests?.map((interest, index) => (
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
        {userData && (
          <ActivityFeed
            clubId={1} // Using a default value since we're in user profile context
            userData={{
              id: String(userData.id), // Ensure ID is a string
              name: userData.name,
              role: userData.careerPath,
              avatar: userData.avatar || './defaultProfile.jpg',
              followers: userData.followers,
            }}
            posts={posts || []}
            onCreatePost={handleCreatePost}
            onEditPost={handleEditPost}
            onDeletePost={handleDeletePost}
          />
        )}
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
            <Input 
              type="file" 
              accept="image/*" 
              onChange={handleUpdateProfilePicture}
            />
            <div className="flex justify-end">
              <Button onClick={() => setShowEditProfile(false)}>
                Cancel
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
                value={userData.achievements?.join("\n") || ""}
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
                value={userData.interests?.join(", ") || ""}
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
              <Button 
                onClick={() => {
                  handleSaveDetails({
                    about: userData.about,
                    achievements: userData.achievements,
                    interests: userData.interests,
                    socialLinks: userData.socialLinks
                  });
                }}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {isMobile && <MobileBottomNav role="student" />}
    </div>
  );
}

const ProfileInfoItem = ({ label, value }: { label: string; value: string }) => (
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
