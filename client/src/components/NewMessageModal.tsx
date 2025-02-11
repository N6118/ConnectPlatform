import React, { useState } from "react";
import { X, Search, UserCheck } from "lucide-react";

interface User {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

interface NewMessageModalProps {
  onClose: () => void;
  onStartChat: (users: User[]) => void;
}

export default function NewMessageModal({ onClose, onStartChat }: NewMessageModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  // Mock user data - in real app, this would come from an API
  const mockUsers: User[] = [
    {
      id: "1",
      name: "Alice Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      role: "Student"
    },
    {
      id: "2",
      name: "Bob Smith",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      role: "Faculty"
    },
    // Add more mock users as needed
  ];

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleUserSelection = (user: User) => {
    if (selectedUsers.find(u => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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

        {/* Search */}
        <div className="p-4">
          <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2">
            <Search size={20} className="text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="ml-2 bg-transparent w-full outline-none"
            />
          </div>
        </div>

        {/* User List */}
        <div className="max-h-96 overflow-y-auto p-4">
          {filteredUsers.map(user => (
            <div
              key={user.id}
              onClick={() => toggleUserSelection(user)}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                selectedUsers.find(u => u.id === user.id)
                  ? 'bg-blue-50'
                  : 'hover:bg-gray-50'
              }`}
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="ml-3 flex-1">
                <h3 className="font-medium text-gray-800">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.role}</p>
              </div>
              {selectedUsers.find(u => u.id === user.id) && (
                <UserCheck size={20} className="text-blue-500" />
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <button
            onClick={() => onStartChat(selectedUsers)}
            disabled={selectedUsers.length === 0}
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Conversation
          </button>
        </div>
      </div>
    </div>
  );
}
