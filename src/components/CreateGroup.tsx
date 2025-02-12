import React, { useState } from "react";
import { X, Search, Plus, Users } from "lucide-react";

interface CreateGroupProps {
  onClose: () => void;
  onCreate: (name: string, members: string[]) => void;
}

export default function CreateGroup({ onClose, onCreate }: CreateGroupProps) {
  const [groupName, setGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  // Mock user data - in a real app, this would come from an API
  const mockUsers = [
    {
      id: "1",
      name: "Alice Johnson",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    },
    {
      id: "2",
      name: "Bob Smith",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    },
    {
      id: "3",
      name: "Carol White",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    },
    {
      id: "4",
      name: "David Brown",
      avatar:
        "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150",
    },
  ];

  const filteredUsers = mockUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (groupName.trim() && selectedMembers.length > 0) {
      onCreate(groupName.trim(), selectedMembers);
    }
  };

  const toggleMember = (userId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Create New Group
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          {/* Group Name Input */}
          <div className="mb-4">
            <label
              htmlFor="groupName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Group Name
            </label>
            <input
              type="text"
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter group name"
              required
            />
          </div>

          {/* Member Search */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Add Members
            </label>
            <div className="relative">
              <Search
                size={20}
                className="absolute left-3 top-2.5 text-gray-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search users..."
              />
            </div>
          </div>

          {/* Selected Members */}
          {selectedMembers.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <Users size={16} className="text-gray-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">
                  Selected Members ({selectedMembers.length})
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedMembers.map((memberId) => {
                  const user = mockUsers.find((u) => u.id === memberId);
                  return user ? (
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
                        type="button"
                        onClick={() => toggleMember(user.id)}
                        className="ml-2 hover:text-blue-800"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* User List */}
          <div className="max-h-60 overflow-y-auto border rounded-lg">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleMember(user.id)}
              >
                <div className="flex items-center">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="ml-3 text-gray-700">{user.name}</span>
                </div>
                <button
                  type="button"
                  className={`p-1 rounded-full transition-colors ${
                    selectedMembers.includes(user.id)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  <Plus
                    size={16}
                    className={
                      selectedMembers.includes(user.id) ? "rotate-45" : ""
                    }
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Create Button */}
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!groupName.trim() || selectedMembers.length === 0}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
