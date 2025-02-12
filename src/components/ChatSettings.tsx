import React from "react";
import { X, Bell, Archive, Trash2, Users } from "lucide-react";
import type { Chat } from "../types";

interface ChatSettingsProps {
  chat: Chat;
  onClose: () => void;
  onMute: () => void;
  onArchive: () => void;
  onDelete: () => void;
}

export default function ChatSettings({
  chat,
  onClose,
  onMute,
  onArchive,
  onDelete,
}: ChatSettingsProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Chat Settings</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Chat Info */}
          <div className="flex items-center mb-6">
            <img
              src={chat.avatar}
              alt={chat.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="ml-4">
              <h3 className="font-semibold text-gray-800">{chat.name}</h3>
              <p className="text-sm text-gray-500">
                {chat.type === "group"
                  ? `${chat.members?.length || 0} members`
                  : "Direct Message"}
              </p>
            </div>
          </div>

          {/* Actions List */}
          <div className="space-y-2">
            <button
              onClick={onMute}
              className="w-full flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Bell
                size={20}
                className={`${chat.isMuted ? "text-blue-500" : "text-gray-600"} mr-3`}
              />
              <div className="flex-1 text-left">
                <p className="text-gray-800">
                  {chat.isMuted ? "Unmute" : "Mute"} Notifications
                </p>
                <p className="text-sm text-gray-500">
                  {chat.isMuted
                    ? "Start receiving notifications"
                    : "Stop receiving notifications"}
                </p>
              </div>
            </button>

            <button
              onClick={onArchive}
              className="w-full flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Archive
                size={20}
                className={`${chat.isArchived ? "text-blue-500" : "text-gray-600"} mr-3`}
              />
              <div className="flex-1 text-left">
                <p className="text-gray-800">
                  {chat.isArchived ? "Unarchive" : "Archive"} Chat
                </p>
                <p className="text-sm text-gray-500">
                  {chat.isArchived
                    ? "Move back to active chats"
                    : "Move to archived"}
                </p>
              </div>
            </button>

            {chat.type === "group" && (
              <button className="w-full flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <Users size={20} className="text-gray-600 mr-3" />
                <div className="flex-1 text-left">
                  <p className="text-gray-800">Group Members</p>
                  <p className="text-sm text-gray-500">
                    View and manage members
                  </p>
                </div>
              </button>
            )}

            <button
              onClick={onDelete}
              className="w-full flex items-center p-3 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={20} className="text-red-500 mr-3" />
              <div className="flex-1 text-left">
                <p className="text-red-500">Delete Chat</p>
                <p className="text-sm text-gray-500">
                  This action cannot be undone
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
