import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  Bookmark,
  Calendar,
  FileText,
  Medal,
  Folder,
  Heart,
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  content: string;
  timestamp: string;
}

interface Activity {
  id: string;
  type: "Event" | "Publication" | "Hackathon" | "Project";
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  media?: {
    type: "image" | "video";
    url: string;
  };
  tags: string[];
  commentList?: Comment[];
  showComments?: boolean;
}

interface ImageModalProps {
  url: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ url, onClose }) => (
  <motion.div
    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.div
      className="relative max-w-4xl w-full rounded-lg overflow-hidden"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>
      <img src={url} alt="Full size" className="w-full h-auto rounded-lg" />
    </motion.div>
  </motion.div>
);

const ActivitySkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
    <div className="p-4 flex items-center space-x-3">
      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
    <div className="px-4 py-2">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
      <div className="h-48 bg-gray-200 rounded-lg mb-3"></div>
      <div className="flex gap-2 mb-3">
        <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
        <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
      </div>
    </div>
    <div className="px-4 py-3 border-t border-gray-100">
      <div className="flex justify-between">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  </div>
);

const CommentSection: React.FC<{
  comments: Comment[];
  onAddComment: (content: string) => void;
}> = ({ comments, onAddComment }) => {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment("");
    }
  };

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="border-t border-gray-100 px-4 py-3"
    >
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Post
          </motion.button>
        </div>
      </form>
      <div className="space-y-4">
        {comments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={comment.author.avatar}
                alt={comment.author.name}
                className="object-cover"
              />
              <AvatarFallback className="bg-blue-500 text-white">
                {comment.author.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="bg-gray-50 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">
                    {comment.author.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {comment.author.role}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
              </div>
              <span className="text-xs text-gray-500 ml-2">
                {comment.timestamp}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const ActivityFeed: React.FC = () => {
  const [filter, setFilter] = useState<
    "All" | "Event" | "Publication" | "Hackathon" | "Project"
  >("All");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "1",
      type: "Project",
      content:
        "Just completed my final year project on Rural Healthcare AI Solutions! Our system helps connect remote villages with medical professionals. Check out the implementation details.",
      timestamp: "2 hours ago",
      likes: 145,
      comments: 32,
      isLiked: false,
      isBookmarked: false,
      author: {
        name: "Arjun Patel",
        avatar: "https://i.pravatar.cc/150?img=11",
        role: "Final Year BTech Student",
      },
      media: {
        type: "image",
        url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
      },
      tags: ["AI", "Healthcare", "RuralDevelopment"],
      commentList: [
        {
          id: "11",
          author: { name: "User A", avatar: "avatar1.jpg", role: "Engineer" },
          content: "Great work!",
          timestamp: "1 hour ago",
        },
        {
          id: "12",
          author: { name: "User B", avatar: "avatar2.jpg", role: "Designer" },
          content: "Impressive!",
          timestamp: "30 minutes ago",
        },
      ],
      showComments: false,
    },
    {
      id: "2",
      type: "Publication",
      content:
        'Honored to have our research paper on "Sustainable Smart Cities: An Indian Perspective" accepted at the International Conference on Urban Technology 2024!',
      timestamp: "Yesterday",
      likes: 278,
      comments: 43,
      isLiked: false,
      isBookmarked: false,
      author: {
        name: "Dr. Priya Sharma",
        avatar: "https://i.pravatar.cc/150?img=25",
        role: "Research Associate",
      },
      media: {
        type: "image",
        url: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800",
      },
      tags: ["SmartCities", "Sustainability", "Research"],
      showComments: false,
    },
    {
      id: "3",
      type: "Hackathon",
      content:
        'Team CodeCrafters wins first place at SIH 2024! Our project "KisanTech" focuses on empowering farmers with AI-driven crop management solutions.',
      timestamp: "3 days ago",
      likes: 456,
      comments: 85,
      isLiked: false,
      isBookmarked: false,
      author: {
        name: "Rahul Verma",
        avatar: "https://i.pravatar.cc/150?img=68",
        role: "Team Lead - CodeCrafters",
      },
      media: {
        type: "image",
        url: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjJ2GXXjJLhcOf1SEAKCM9URL1zGJ2i04IfN4V_7jHXsAVXfOSgc7d3sLGdZAA22KuErj-rKYjwpuGQQWmZe-uN7cF4dcZM_L1Xq_6cJ6tatEP64C-L8IEORK5nQj5v0bAWhjY6u5pQDKNEpTQkb5EzahgMbHyPnrTNvuOm95qWm7GUkC40JzEk5ZogadMC/s2048/470797474_998441002320167_7024409163699524016_n.jpg",
      },
      tags: ["SIH2024", "AgriTech", "Innovation"],
      showComments: false,
    },
    {
      id: "4",
      type: "Event",
      content:
        "Join us for TechFest 2024 at IIT Mumbai! Featuring workshops on Quantum Computing, Blockchain, and AI. Register now for early bird discounts.",
      timestamp: "4 days ago",
      likes: 234,
      comments: 56,
      isLiked: false,
      isBookmarked: false,
      author: {
        name: "Aisha Khan",
        avatar: "https://i.pravatar.cc/150?img=41",
        role: "Event Coordinator",
      },
      media: {
        type: "image",
        url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
      },
      tags: ["TechFest2024", "IITMumbai", "Workshop"],
      showComments: false,
    },
  ]);

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth / 2;
      const targetScroll =
        container.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);

      container.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleFilterChange = (newFilter: typeof filter) => {
    setFilter(newFilter);
  };

  const handleLike = (id: string) => {
    setActivities((prevActivities) =>
      prevActivities.map((activity) =>
        activity.id === id
          ? {
              ...activity,
              likes: activity.isLiked ? activity.likes - 1 : activity.likes + 1,
              isLiked: !activity.isLiked,
            }
          : activity,
      ),
    );
  };

  const handleBookmark = (id: string) => {
    setActivities((prevActivities) =>
      prevActivities.map((activity) =>
        activity.id === id
          ? { ...activity, isBookmarked: !activity.isBookmarked }
          : activity,
      ),
    );
  };

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "Event":
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case "Publication":
        return <FileText className="w-5 h-5 text-green-500" />;
      case "Hackathon":
        return <Medal className="w-5 h-5 text-yellow-500" />;
      case "Project":
        return <Folder className="w-5 h-5 text-purple-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleToggleComments = (id: string) => {
    setActivities((prevActivities) =>
      prevActivities.map((activity) =>
        activity.id === id
          ? { ...activity, showComments: !activity.showComments }
          : activity,
      ),
    );
  };

  const handleAddComment = (activityId: string, content: string) => {
    setActivities((prevActivities) =>
      prevActivities.map((activity) =>
        activity.id === activityId
          ? {
              ...activity,
              comments: activity.comments + 1,
              commentList: [
                ...(activity.commentList || []),
                {
                  id: Date.now().toString(),
                  author: {
                    name: "Current User",
                    avatar: "https://i.pravatar.cc/150?img=2",
                    role: "Student",
                  },
                  content,
                  timestamp: "Just now",
                },
              ],
            }
          : activity,
      ),
    );
  };

  const filteredActivities = activities.filter(
    (activity) => filter === "All" || activity.type === filter,
  );

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg shadow-xl p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-extrabold text-gray-800">Activity Feed</h2>
        <div className="relative flex items-center space-x-2">
          <motion.div
            className="w-2 h-2 bg-blue-500 rounded-full absolute -top-1 -right-1 shadow-lg"
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1],
              boxShadow: [
                "0 0 0 0 rgba(59, 130, 246, 0.4)",
                "0 0 0 10px rgba(59, 130, 246, 0)",
                "0 0 0 0 rgba(59, 130, 246, 0.4)",
              ],
            }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
          <span className="text-sm text-gray-500">Live Updates</span>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-white via-white/80 to-transparent w-12 h-12 flex items-center">
          <motion.button
            className="ml-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
            onClick={() => scroll("left")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </motion.button>
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-l from-white via-white/80 to-transparent w-12 h-12 flex items-center justify-end">
          <motion.button
            className="mr-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
            onClick={() => scroll("right")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </motion.button>
        </div>
        <div
          ref={scrollContainerRef}
          className="flex space-x-3 mb-6 overflow-x-auto scrollbar-hide px-10 py-2"
        >
          {["All", "Event", "Publication", "Hackathon", "Project"].map(
            (category) => (
              <motion.button
                key={category}
                className={`px-4 py-2 rounded-full transition-colors duration-300 whitespace-nowrap flex items-center space-x-2 ${
                  filter === category
                    ? "bg-blue-600 text-white shadow-md border-2 border-blue-700"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:border-gray-400"
                }`}
                onClick={() => handleFilterChange(category as typeof filter)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {getActivityIcon(category as Activity["type"])}
                <span>{category}</span>
              </motion.button>
            ),
          )}
        </div>
      </div>

      <ul className="space-y-6">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {[1, 2, 3].map((i) => (
                <ActivitySkeleton key={i} />
              ))}
            </motion.div>
          ) : filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <motion.li
                key={activity.id}
                className="bg-white rounded-xl shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <div className="p-4 flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={activity.author.avatar}
                      alt={activity.author.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-blue-500 text-white">
                      {activity.author.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      {activity.author.name}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {activity.author.role}
                      </span>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-xs text-gray-400">
                        {activity.timestamp}
                      </span>
                    </div>
                  </div>
                  {getActivityIcon(activity.type)}
                </div>

                <div className="px-4 py-2">
                  <p className="text-gray-800 mb-3 leading-relaxed">
                    {activity.content}
                  </p>
                  {activity.media && (
                    <motion.div
                      className="rounded-lg overflow-hidden mb-3 relative group cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => setSelectedImage(activity.media!.url)}
                    >
                      <motion.img
                        src={activity.media.url}
                        alt="Post content"
                        className="w-full h-64 object-cover transition-all duration-300 group-hover:scale-105"
                        initial={{ filter: "blur(10px)", opacity: 0 }}
                        animate={{ filter: "blur(0px)", opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/800x400?text=Image+Not+Available";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.div>
                  )}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {activity.tags.map((tag) => (
                      <motion.span
                        key={tag}
                        className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        #{tag}
                      </motion.span>
                    ))}
                  </div>
                </div>

                <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex space-x-6">
                    <motion.button
                      className={`flex items-center space-x-2 ${
                        activity.isLiked
                          ? "text-red-500"
                          : "text-gray-500 hover:text-red-500"
                      } transition-colors`}
                      onClick={() => handleLike(activity.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      animate={
                        activity.isLiked
                          ? {
                              scale: [1, 1.2, 1],
                              transition: { duration: 0.3 },
                            }
                          : {}
                      }
                    >
                      <Heart
                        className={`w-5 h-5 ${activity.isLiked ? "fill-current" : ""}`}
                      />
                      <span>{activity.likes}</span>
                    </motion.button>
                    <motion.button
                      className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
                      onClick={() => handleToggleComments(activity.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>{activity.comments}</span>
                    </motion.button>
                    <motion.button
                      className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Share2 className="w-5 h-5" />
                      <span className="hidden sm:inline">Share</span>
                    </motion.button>
                  </div>
                  <motion.button
                    className={`${
                      activity.isBookmarked
                        ? "text-yellow-500"
                        : "text-gray-500 hover:text-yellow-500"
                    } transition-colors`}
                    onClick={() => handleBookmark(activity.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    animate={
                      activity.isBookmarked
                        ? {
                            scale: [1, 1.2, 1],
                            transition: { duration: 0.3 },
                          }
                        : {}
                    }
                  >
                    <Bookmark
                      className={`w-5 h-5 ${activity.isBookmarked ? "fill-current" : ""}`}
                    />
                  </motion.button>
                </div>

                <AnimatePresence>
                  {activity.showComments && (
                    <CommentSection
                      comments={activity.commentList || []}
                      onAddComment={(content) =>
                        handleAddComment(activity.id, content)
                      }
                    />
                  )}
                </AnimatePresence>
              </motion.li>
            ))
          ) : (
            <motion.li
              className="p-8 text-center text-gray-500 bg-white rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex flex-col items-center space-y-4">
                <FileText className="w-16 h-16 text-gray-400" />
                <p className="text-xl font-medium">
                  No activities found for this filter
                </p>
                <p className="text-gray-400">
                  Try selecting a different category or create a new post!
                </p>
                <motion.button
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Post</span>
                </motion.button>
              </div>
            </motion.li>
          )}
        </AnimatePresence>
      </ul>

      <AnimatePresence>
        {selectedImage && (
          <ImageModal
            url={selectedImage}
            onClose={() => setSelectedImage(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActivityFeed;
