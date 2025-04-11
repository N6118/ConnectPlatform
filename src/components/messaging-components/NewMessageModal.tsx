import React, { useState } from "react";
import { X, Search, Check } from "lucide-react";

interface NewMessageModalProps {
  onClose: () => void;
  onStartChat: (
    users: Array<{ id: string; name: string; avatar: string; role: string }>,
  ) => void;
}

export default function NewMessageModal({
  onClose,
  onStartChat,
}: NewMessageModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<
    Array<{
      id: string;
      name: string;
      avatar: string;
      role: string;
    }>
  >([]);

  // Mock user data - in a real app, this would come from an API
  const mockUsers = [
    {
      id: "1",
      name: "Alice Johnson",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      role: "user",
    },
    {
      id: "2",
      name: "Bob Smith",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      role: "user",
    },
    {
      id: "3",
      name: "Carol White",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      role: "user",
    },
  ];

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !selectedUsers.find((selected) => selected.id === user.id),
  );

  const toggleUser = (user: (typeof mockUsers)[0]) => {
    setSelectedUsers((prev) =>
      prev.find((selected) => selected.id === user.id)
        ? prev.filter((selected) => selected.id !== user.id)
        : [...prev, user],
    );
  };

  const handleStartChat = () => {
    if (selectedUsers.length > 0) {
      onStartChat(selectedUsers);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">New Message</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-2.5 text-gray-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Selected Users */}
        {selectedUsers.length > 0 && (
          <div className="px-4 pb-4">
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-4 h-4 rounded-full mr-2"
                  />
                  <span>{user.name}</span>
                  <button
                    onClick={() => toggleUser(user)}
                    className="ml-2 hover:text-blue-800"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User List */}
        <div className="max-h-60 overflow-y-auto border-t">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => toggleUser(user)}
              className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer"
            >
              <div className="flex items-center">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="ml-3 text-gray-700">{user.name}</span>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedUsers.find((selected) => selected.id === user.id)
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-300"
                }`}
              >
                {selectedUsers.find((selected) => selected.id === user.id) && (
                  <Check size={14} className="text-white" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t">
          <button
            onClick={handleStartChat}
            disabled={selectedUsers.length === 0}
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Chat
          </button>
        </div>
      </div>
    </div>
  );
}
