import { X, Bell, Archive, Trash2 } from "lucide-react";
import type { Chat } from "@/types";

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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Chat Settings
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Settings Content */}
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={chat.avatar || "/placeholder.svg"}
                alt={chat.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200">
                  {chat.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {chat.type === "group"
                    ? `${chat.members?.length} members`
                    : chat.status}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onMute}
            className="w-full flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Bell size={20} className="text-gray-600 dark:text-gray-300" />
              <span className="text-gray-700 dark:text-gray-200">
                {chat.isMuted ? "Unmute notifications" : "Mute notifications"}
              </span>
            </div>
          </button>

          <button
            onClick={onArchive}
            className="w-full flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Archive size={20} className="text-gray-600 dark:text-gray-300" />
              <span className="text-gray-700 dark:text-gray-200">
                {chat.isArchived ? "Unarchive chat" : "Archive chat"}
              </span>
            </div>
          </button>

          <button
            onClick={onDelete}
            className="w-full flex items-center justify-between p-3 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Trash2 size={20} className="text-red-500" />
              <span className="text-red-500">Delete chat</span>
            </div>
          </button>
        </div>

        {/* Close Button */}
        <div className="p-4 border-t dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
