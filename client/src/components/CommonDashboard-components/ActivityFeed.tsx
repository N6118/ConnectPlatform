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
import { postService, PostData, PostComment, CreateCommentData } from "@/services/post";
import CreatePostModal from "./CreatePostModal";

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
  postId: number;
  comments: PostComment[];
  onAddComment: (content: string) => void;
}> = ({ postId, comments, onAddComment }) => {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const commentData: CreateCommentData = { content: newComment };
      const response = await postService.addComment(postId, commentData);
      if (response.success) {
        onAddComment(newComment);
        setNewComment("");
      }
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
                src={comment.authorAvatar}
                alt={comment.authorName}
                className="object-cover"
              />
              <AvatarFallback className="bg-blue-500 text-white">
                {comment.authorName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="bg-gray-50 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">
                    {comment.authorName}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
              </div>
              <span className="text-xs text-gray-500 ml-2">
                {new Date(comment.createdAt).toLocaleDateString()}
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
    "ALL" | "EVENT" | "PUBLICATION" | "HACKATHON" | "PROJECT"
  >("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [comments, setComments] = useState<Record<number, PostComment[]>>({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);

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
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await postService.getAllPosts(page);
        if (response.success && response.data) {
          const newPosts = response.data.filter((post): post is PostData => post !== undefined);
          setPosts(prev => [...prev, ...newPosts]);
          setHasMore(newPosts.length === 10); // Assuming 10 is our page size
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  const handleFilterChange = (newFilter: typeof filter) => {
    setFilter(newFilter);
    setPage(1);
    setPosts([]);
  };

  const handleLike = async (postId: number) => {
    try {
      const response = await postService.toggleLike(postId);
      if (response.success && response.data) {
        setPosts(prev =>
          prev.map(post =>
            post.id === postId ? response.data : post
          ).filter((post): post is PostData => post !== undefined)
        );
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleBookmark = async (postId: number) => {
    try {
      const response = await postService.toggleBookmark(postId);
      if (response.success && response.data) {
        setPosts(prev =>
          prev.map(post =>
            post.id === postId ? response.data : post
          ).filter((post): post is PostData => post !== undefined)
        );
      }
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  };

  const handleToggleComments = async (postId: number) => {
    if (!comments[postId]) {
      try {
        const response = await postService.getComments(postId);
        if (response.success && response.data) {
          const newComments = response.data.filter((comment): comment is PostComment => comment !== undefined);
          setComments(prev => ({
            ...prev,
            [postId]: newComments
          }));
        }
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    }
  };

  const handleAddComment = async (postId: number, content: string) => {
    try {
      const response = await postService.addComment(postId, { content });
      if (response.success && response.data) {
        setComments(prev => ({
          ...prev,
          [postId]: [...(prev[postId] || []), response.data].filter((comment): comment is PostComment => comment !== undefined)
        }));
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "EVENT":
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case "PUBLICATION":
        return <FileText className="w-5 h-5 text-green-500" />;
      case "HACKATHON":
        return <Medal className="w-5 h-5 text-yellow-500" />;
      case "PROJECT":
        return <Folder className="w-5 h-5 text-purple-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const filteredPosts = posts.filter(
    (post) => filter === "ALL" || post.type === filter
  );

  const handlePostCreated = (newPost: PostData) => {
    setPosts(prev => [newPost, ...prev]);
  };

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
          {["ALL", "EVENT", "PUBLICATION", "HACKATHON", "PROJECT"].map(
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
                {getActivityIcon(category)}
                <span>{category.charAt(0) + category.slice(1).toLowerCase()}</span>
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
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <motion.li
                key={post.id}
                className="bg-white rounded-xl shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <div className="p-4 flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-blue-500 text-white">
                      {(post.authorName || 'U').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      {post.authorName}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {post.authorName}
                      </span>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-xs text-gray-400">
                        {post.createdAt}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-2">
                  <p className="text-gray-800 mb-3 leading-relaxed">
                    {post.content}
                  </p>
                  {post.media && (
                    <motion.div
                      className="rounded-lg overflow-hidden mb-3 relative group cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => setSelectedImage(post.media!.url)}
                    >
                      <motion.img
                        src={post.media}
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
                    <motion.span
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      #{post.type}
                    </motion.span>
                  </div>
                </div>

                <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex space-x-6">
                    <motion.button
                      className={`flex items-center space-x-2 ${
                        post.isLiked
                          ? "text-red-500"
                          : "text-gray-500 hover:text-red-500"
                      } transition-colors`}
                      onClick={() => handleLike(post.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      animate={
                        post.isLiked
                          ? {
                              scale: [1, 1.2, 1],
                              transition: { duration: 0.3 },
                            }
                          : {}
                      }
                    >
                      <Heart
                        className={`w-5 h-5 ${post.isLiked ? "fill-current" : ""}`}
                      />
                      <span>{post.likes}</span>
                    </motion.button>
                    <motion.button
                      className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
                      onClick={() => handleToggleComments(post.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>{post.comments}</span>
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
                      post.isBookmarked
                        ? "text-yellow-500"
                        : "text-gray-500 hover:text-yellow-500"
                    } transition-colors`}
                    onClick={() => handleBookmark(post.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    animate={
                      post.isBookmarked
                        ? {
                            scale: [1, 1.2, 1],
                            transition: { duration: 0.3 },
                          }
                        : {}
                    }
                  >
                    <Bookmark
                      className={`w-5 h-5 ${post.isBookmarked ? "fill-current" : ""}`}
                    />
                  </motion.button>
                </div>

                <AnimatePresence>
                  {comments[post.id] && (
                    <CommentSection
                      postId={post.id}
                      comments={comments[post.id]}
                      onAddComment={(content) => handleAddComment(post.id, content)}
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
                  onClick={() => setIsCreatePostModalOpen(true)}
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
        <CreatePostModal
          isOpen={isCreatePostModalOpen}
          onClose={() => setIsCreatePostModalOpen(false)}
          onPostCreated={handlePostCreated}
        />
      </AnimatePresence>
    </div>
  );
};

export default ActivityFeed;
