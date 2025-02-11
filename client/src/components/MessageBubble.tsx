import React, { useState } from "react";
import {
  Check,
  CheckCheck,
  Reply,
  Pin,
  Smile,
  MoreVertical,
  X,
} from "lucide-react";
import type { Message } from "../types";
import { EMOJI_CATEGORIES, COMMON_REACTIONS } from "../pages/constants";

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <Check size={16} className="text-gray-400" />;
      case "delivered":
      case "read":
        return (
          <CheckCheck
            size={16}
            className={status === "read" ? "text-blue-500" : "text-gray-400"}
          />
        );
      default:
        return null;
    }
  };

  const handleReactionClick = (emoji: string) => {
    onReact(message.id, emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div
      className={`group flex ${message.sender === "user" ? "justify-end" : "justify-start"} relative`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        setShowEmojiPicker(false);
      }}
    >
      <div className="relative max-w-xl">
        {/* Thread Indicator */}
        {message.replyTo && (
          <div className="mb-2 flex items-center space-x-2 text-xs text-gray-500">
            <Reply size={14} />
            <span>Replying to a message</span>
            <button
              className="text-blue-500 hover:text-blue-600"
              onClick={() => console.log("View thread")}
            >
              View thread
            </button>
          </div>
        )}

        {/* Pin Indicator */}
        {message.isPinned && (
          <div className="mb-2 flex items-center space-x-2 text-xs text-yellow-600">
            <Pin size={14} />
            <span>Pinned message</span>
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={`relative px-4 py-2 rounded-lg shadow-sm
            ${
              message.sender === "user"
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                : "bg-white text-gray-800"
            }
            ${message.isPinned ? "border-2 border-yellow-400" : ""}
          `}
        >
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.text}
          </p>

          {/* Message Meta */}
          <div className="flex items-center justify-end mt-1 space-x-1">
            <span
              className={`text-xs ${
                message.sender === "user" ? "text-blue-100" : "text-gray-400"
              }`}
            >
              {message.timestamp}
            </span>
            {message.sender === "user" && getStatusIcon(message.status)}
          </div>

          {/* Quick Reaction Bar */}
          {showActions && (
            <div
              className={`absolute ${
                message.sender === "user" ? "-left-2" : "-right-2"
              } -top-10 flex items-center space-x-1 bg-white rounded-full shadow-lg px-2 py-1 z-10`}
            >
              {COMMON_REACTIONS.slice(0, 6).map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReactionClick(emoji)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  {emoji}
                </button>
              ))}
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Smile size={20} className="text-gray-600" />
              </button>
            </div>
          )}

          {/* Full Emoji Picker */}
          {showEmojiPicker && (
            <div className="absolute bottom-full mb-2 bg-white rounded-lg shadow-xl p-4 w-72 z-20">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-700">Add Reaction</h4>
                <button
                  onClick={() => setShowEmojiPicker(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={16} className="text-gray-500" />
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
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
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
                    className="p-1 hover:bg-gray-100 rounded transition-colors text-xl"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message Actions */}
          {showActions && (
            <div
              className={`absolute ${
                message.sender === "user" ? "left-0" : "right-0"
              } top-0 flex items-center space-x-1 bg-white rounded-full shadow-lg px-2 py-1`}
            >
              <button
                onClick={() => onReply(message.id)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                title="Reply"
              >
                <Reply size={16} className="text-gray-600" />
              </button>
              <button
                onClick={() => onPin(message.id)}
                className={`p-1 hover:bg-gray-100 rounded-full transition-colors ${
                  message.isPinned ? "text-yellow-500" : "text-gray-600"
                }`}
                title={message.isPinned ? "Unpin" : "Pin"}
              >
                <Pin size={16} />
              </button>
              <button
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                title="More actions"
              >
                <MoreVertical size={16} className="text-gray-600" />
              </button>
            </div>
          )}
        </div>

        {/* Reactions Display */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
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
                className="inline-flex items-center space-x-1 px-2 py-1 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
              >
                <span>{emoji}</span>
                <span className="text-xs text-gray-500">{count}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
