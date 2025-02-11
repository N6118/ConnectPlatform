import React, { useState } from "react";
import { Search, UserPlus, Settings } from "lucide-react";
import type { Chat } from "../types";
import NewMessageModal from "./NewMessageModal";
import UserSettings from "./UserSettings";

interface ChatListProps {
  chats: Chat[];
  selectedChat: number | null;
  onSelectChat: (chatId: number) => void;
  onCreateChat: (
    users: { id: string; name: string; avatar: string; role: string }[],
  ) => void;
}

export default function ChatList({
  chats,
  selectedChat,
  onSelectChat,
  onCreateChat,
}: ChatListProps) {
  const [filter, setFilter] = React.useState<"all" | "direct" | "group">("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const filteredChats = chats
    .filter((chat) => {
      if (filter === "all") return true;
      return chat.type === filter;
    })
    .filter(
      (chat) =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  return (
    <div className="w-80 bg-white shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-blue-500 to-blue-600">
        <div className="flex items-center space-x-3">
          <img
            src="https://images.news18.com/ibnlive/uploads/2024/11/whatsapp-image-2024-11-25-at-4.17.12-pm-2024-11-22ee49e2a3d7b9d02a3dea1775ac03ff-3x2.jpeg"
            alt="Your avatar"
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          <h2 className="font-semibold text-white">Messages</h2>
        </div>
        <div className="flex space-x-2">
          <button
            className="p-2 hover:bg-blue-600 rounded-full transition-colors"
            onClick={() => setShowNewMessageModal(true)}
          >
            <UserPlus size={20} className="text-white" />
          </button>
          <button
            className="p-2 hover:bg-blue-600 rounded-full transition-colors"
            onClick={() => setShowSettings(true)}
          >
            <Settings size={20} className="text-white" />
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-4 space-y-3">
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
          <Search size={20} className="text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages"
            className="ml-2 bg-transparent w-full outline-none text-sm"
          />
        </div>
        <div className="flex space-x-2">
          {["all", "direct", "group"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type as "all" | "direct" | "group")}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                filter === type
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            className={`flex items-center p-3 cursor-pointer transition
              ${
                selectedChat === chat.id
                  ? "bg-blue-50 border-l-4 border-blue-500"
                  : "hover:bg-gray-50 border-l-4 border-transparent"
              }
              ${chat.unreadCount > 0 ? "font-semibold" : ""}`}
            onClick={() => onSelectChat(chat.id)}
          >
            <div className="relative">
              <img
                src={chat.avatar}
                alt={chat.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white
                  ${
                    chat.status === "online"
                      ? "bg-green-500"
                      : chat.status === "typing"
                        ? "bg-blue-500"
                        : "bg-gray-400"
                  }`}
              />
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900 truncate">
                  {chat.name}
                </h3>
                <span className="text-xs text-gray-500">{chat.lastSeen}</span>
              </div>
              <p className="text-sm text-gray-500 truncate">
                {chat.status === "typing" ? (
                  <span className="text-blue-500">typing...</span>
                ) : (
                  chat.lastMessage
                )}
              </p>
              {chat.unreadCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-500 rounded-full">
                  {chat.unreadCount}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <UserSettings
          onClose={() => setShowSettings(false)}
          onThemeChange={(newTheme) => {
            setTheme(newTheme);
            // Here you would typically persist this to user preferences
          }}
          onNotificationChange={(enabled) => {
            setNotificationsEnabled(enabled);
            // Here you would typically persist this to user preferences
          }}
          currentTheme={theme}
          notificationsEnabled={notificationsEnabled}
        />
      )}

      {/* New Message Modal */}
      {showNewMessageModal && (
        <NewMessageModal
          onClose={() => setShowNewMessageModal(false)}
          onStartChat={(users) => {
            onCreateChat(users);
            setShowNewMessageModal(false);
          }}
        />
      )}
    </div>
  );
}
