"use client";

import React, { useState } from "react";
import {
  Search,
  UserPlus,
  Settings,
  X,
  Moon,
  Sun,
  BellOff,
  Users,
  MessageCircleIcon as MessageCircleUnread,
} from "lucide-react";
import type { Chat } from "@/types";
import NewMessageModal from "./NewMessageModal";
import UserSettings from "./UserSettings";

interface ChatListProps {
  chats: Chat[];
  selectedChat: number | null;
  onSelectChat: (chatId: number) => void;
  onCreateChat: (
    users: { id: string; name: string; avatar: string; role: string }[],
  ) => void;
  onCreateGroup: () => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  isMobileView: boolean;
}

export default function ChatList({
  chats,
  selectedChat,
  onSelectChat,
  onCreateChat,
  onCreateGroup,
  theme,
  setTheme,
  isMobileView,
}: ChatListProps) {
  const [filter, setFilter] = React.useState<
    "all" | "direct" | "group" | "unread"
  >("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const filteredChats = chats
    .filter((chat) => {
      if (filter === "unread") return chat.unreadCount > 0;
      if (filter === "all") return true;
      return chat.type === filter;
    })
    .filter(
      (chat) =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  return (
    <div className="w-full md:w-80 bg-white dark:bg-gray-800 shadow-lg flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-3">
          <img
            src="https://i.pinimg.com/736x/9d/99/f5/9d99f502d02028954237ffa8ce9f264c.jpg"
            alt="Your avatar"
            className="w-10 h-10 rounded-full border-2 border-blue-500"
          />
          <h2 className="font-semibold text-gray-800 dark:text-gray-200">
            Messages
          </h2>
        </div>
        <div className="flex space-x-2">
          <button
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            onClick={() => setShowNewMessageModal(true)}
          >
            <UserPlus size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
          {isMobileView && (
            <button
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              onClick={onCreateGroup}
            >
              <Users size={20} className="text-gray-600 dark:text-gray-300" />
            </button>
          )}
          <button
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            onClick={() => setShowSettings(true)}
          >
            <Settings size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-4 space-y-3">
        <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2">
          <Search size={20} className="text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages"
            className="ml-2 bg-transparent w-full outline-none text-sm text-gray-800 dark:text-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-full text-sm transition-colors whitespace-nowrap ${
              filter === "all"
                ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("direct")}
            className={`px-3 py-1 rounded-full text-sm transition-colors whitespace-nowrap ${
              filter === "direct"
                ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            Direct
          </button>
          <button
            onClick={() => setFilter("group")}
            className={`px-3 py-1 rounded-full text-sm transition-colors whitespace-nowrap flex items-center space-x-1 ${
              filter === "group"
                ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <Users size={16} />
            <span>Groups</span>
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-3 py-1 rounded-full text-sm transition-colors whitespace-nowrap flex items-center space-x-1 ${
              filter === "unread"
                ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <MessageCircleUnread size={16} />
            <span>Unread</span>
          </button>
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
                  ? "bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700 border-l-4 border-transparent"
              }
              ${chat.unreadCount > 0 ? "font-semibold" : ""}`}
            onClick={() => onSelectChat(chat.id)}
          >
            <div className="relative">
              <img
                src={chat.avatar || "/placeholder.svg"}
                alt={chat.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800
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
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-gray-900 dark:text-white truncate">
                    {chat.name}
                  </h3>
                  {chat.isMuted && (
                    <BellOff
                      size={14}
                      className="text-gray-400 dark:text-gray-500"
                    />
                  )}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {chat.lastSeen}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {chat.status === "typing" ? (
                  <span className="text-blue-500 dark:text-blue-400">
                    typing...
                  </span>
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

      {/* Theme Toggle */}
      <div className="p-4 border-t dark:border-gray-700">
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setTheme("light")}
            className={`p-2 rounded-full ${theme === "light" ? "bg-gray-200 dark:bg-gray-600" : ""}`}
          >
            <Sun size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`p-2 rounded-full ${theme === "dark" ? "bg-gray-200 dark:bg-gray-600" : ""}`}
          >
            <Moon size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <UserSettings
          onClose={() => setShowSettings(false)}
          onThemeChange={setTheme}
          onNotificationChange={(enabled) => {
            setNotificationsEnabled(enabled);
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
          onCreateGroup={onCreateGroup}
        />
      )}
    </div>
  );
}
