"use client";

import { useState, useEffect } from "react";
import {
  Reply,
  Pin,
  Smile,
  MoreVertical,
  X,
  Download,
  FileText,
} from "lucide-react";
import type { Message } from "@/types";
import { EMOJI_CATEGORIES, COMMON_REACTIONS } from "@/pages/constants";
import { motion, AnimatePresence } from "framer-motion";

interface MessageBubbleProps {
  message: Message;
  onReact: (messageId: number, emoji: string) => void;
  onPin: (messageId: number) => void;
  onReply: (messageId: number) => void;
  onRemoveReaction?: (messageId: number, reactionId: string) => void;
}

export default function MessageBubble({
  message,
  onReact,
  onPin,
  onReply,
  onRemoveReaction,
}: MessageBubbleProps) {
  const [showActions, setShowActions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<keyof typeof EMOJI_CATEGORIES>("smileys");
  const [showAttachmentPreview, setShowAttachmentPreview] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleReactionClick = (emoji: string) => {
    onReact(message.id, emoji);
    setShowEmojiPicker(false);
  };

  const handleLongPress = () => {
    if (isMobile) {
      setShowActions(true);
    }
  };

  const renderAttachment = () => {
    if (!message.attachment) return null;

    switch (message.attachment.type) {
      case "image":
        return (
          <div className="relative mt-2 rounded-lg overflow-hidden">
            <img
              src={message.attachment.url || "/placeholder.svg"}
              alt="Attached image"
              className="max-w-full h-auto rounded-lg cursor-pointer"
              onClick={() => setShowAttachmentPreview(true)}
            />
          </div>
        );
      case "video":
        return (
          <div className="relative mt-2 rounded-lg overflow-hidden">
            <video
              src={message.attachment.url}
              controls
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        );
      case "document":
        return (
          <div className="mt-2 flex items-center space-x-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <FileText className="text-gray-500 dark:text-gray-400" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {message.attachment.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {(message.attachment.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <a
              href={message.attachment.url}
              download={message.attachment.name}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
            >
              <Download className="text-gray-500 dark:text-gray-400" />
            </a>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`group flex ${message.sender === "user" ? "justify-end" : "justify-start"} relative`}
      onMouseEnter={() => !isMobile && setShowActions(true)}
      onMouseLeave={() => !isMobile && setShowActions(false)}
      onTouchStart={handleLongPress}
      onTouchEnd={() => isMobile && setShowActions(false)}
    >
      <div className="relative max-w-[80%] sm:max-w-xl">
        {/* Thread Indicator */}
        {message.replyTo && (
          <div className="mb-2 flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <Reply size={14} />
            <span>Replying to a message</span>
            <button className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-500">
              View thread
            </button>
          </div>
        )}

        {/* Pin Indicator */}
        {message.isPinned && (
          <div className="mb-2 flex items-center space-x-2 text-xs text-yellow-600 dark:text-yellow-500">
            <Pin size={14} />
            <span>Pinned message</span>
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={`relative px-4 py-2 rounded-lg shadow-sm
            ${
              message.sender === "user"
                ? "bg-blue-500 text-white"
                : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            }
            ${message.isPinned ? "border-2 border-yellow-400 dark:border-yellow-500" : ""}
          `}
        >
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.text}
          </p>

          {/* Attachment */}
          {renderAttachment()}

          {/* Message Meta */}
          <div className="flex items-center justify-end mt-1 space-x-1">
            <span
              className={`text-xs ${message.sender === "user" ? "text-blue-100" : "text-gray-400 dark:text-gray-500"}`}
            >
              {message.timestamp}
            </span>
          </div>

          {/* Quick Reaction Bar */}
          <AnimatePresence>
            {showActions && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`absolute ${
                  message.sender === "user" ? "-left-2" : "-right-2"
                } -top-10 flex items-center space-x-1 bg-white dark:bg-gray-800 rounded-full shadow-lg px-2 py-1 z-10`}
              >
                {COMMON_REACTIONS.slice(0, 6).map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleReactionClick(emoji)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <Smile
                    size={20}
                    className="text-gray-600 dark:text-gray-400"
                  />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Full Emoji Picker */}
          <AnimatePresence>
            {showEmojiPicker && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-full mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 w-72 z-20"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300">
                    Add Reaction
                  </h4>
                  <button
                    onClick={() => setShowEmojiPicker(false)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <X size={16} className="text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                {/* Category Tabs */}
                <div className="flex space-x-2 mb-3 overflow-x-auto pb-2">
                  {Object.entries(EMOJI_CATEGORIES).map(([category, data]) => (
                    <button
                      key={category}
                      onClick={() =>
                        setSelectedCategory(
                          category as keyof typeof EMOJI_CATEGORIES,
                        )
                      }
                      className={`px-3 py-1 text-sm rounded-full whitespace-nowrap transition-colors ${
                        selectedCategory === category
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {data.name}
                    </button>
                  ))}
                </div>

                {/* Emoji Grid */}
                <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
                  {EMOJI_CATEGORIES[selectedCategory].emojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleReactionClick(emoji)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-xl"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Message Actions */}
          <AnimatePresence>
            {showActions && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className={`absolute ${
                  message.sender === "user" ? "left-0" : "right-0"
                } top-0 flex items-center space-x-1 bg-white dark:bg-gray-800 rounded-full shadow-lg px-2 py-1`}
              >
                <button
                  onClick={() => onReply(message.id)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  title="Reply"
                >
                  <Reply
                    size={16}
                    className="text-gray-600 dark:text-gray-400"
                  />
                </button>
                <button
                  onClick={() => onPin(message.id)}
                  className={`p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors ${
                    message.isPinned
                      ? "text-yellow-500"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                  title={message.isPinned ? "Unpin" : "Pin"}
                >
                  <Pin size={16} />
                </button>
                <button
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  title="More actions"
                >
                  <MoreVertical
                    size={16}
                    className="text-gray-600 dark:text-gray-400"
                  />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Reactions Display */}
        {message.reactions && message.reactions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-2 flex flex-wrap gap-1"
          >
            {Object.entries(
              message.reactions.reduce(
                (acc: { [key: string]: number }, reaction) => {
                  acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
                  return acc;
                },
                {},
              ),
            ).map(([emoji, count]) => (
              <button
                key={emoji}
                onClick={() => handleReactionClick(emoji)}
                className="inline-flex items-center space-x-1 px-2 py-1 bg-white dark:bg-gray-700 rounded-full shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <span>{emoji}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {count}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Attachment Preview Modal */}
      <AnimatePresence>
        {showAttachmentPreview && message.attachment?.type === "image" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={() => setShowAttachmentPreview(false)}
          >
            <motion.img
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              src={message.attachment.url}
              alt="Preview"
              className="max-w-[90%] max-h-[90vh] object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
