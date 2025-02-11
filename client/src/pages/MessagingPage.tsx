import React, { useState, useCallback, useEffect } from "react";
import ChatList from "../components/ChatList";
import MessageBubble from "../components/MessageBubble";
import MessageInput from "../components/MessageInput";
import CreateGroup from "../components/CreateGroup";
import ChatSettings from "../components/ChatSettings";
import { Phone, Bell, MoreVertical } from "lucide-react";
import type { Message, Chat } from "../types";
import NewMessageModal from "../components/NewMessageModal";

// Initial data (in a real app, this would come from an API)
const initialChats: Chat[] = [
  {
    id: 1,
    type: "direct",
    name: "Mukesh Amdani",
    lastMessage: "Hey! Will you buy Jio ?, ",
    avatar:
      "https://upload.wikimedia.org/wikipedia/commons/6/69/Mukesh_Ambani.jpg",
    status: "online",
    lastSeen: "now",
    unreadCount: 0,
    isMuted: false,
    isArchived: false,
  },
  {
    id: 2,
    type: "direct",
    name: "Andrew tate",
    lastMessage: "Let's meet tomorrow",
    avatar:
      "https://polarisproject.org/wp-content/uploads/2023/01/Andrew-Tate-blog-featured-image.png",
    status: "offline",
    lastSeen: "2 hours ago",
    unreadCount: 2,
    isMuted: true,
    isArchived: false,
  },
  {
    id: 3,
    type: "group",
    name: "Project Team",
    lastMessage: "Did you see the update?",
    avatar:
      "https://upload.wikimedia.org/wikipedia/commons/3/3b/Lana_Rhoades_cropped.jpg",
    status: "online",
    lastSeen: "now",
    unreadCount: 5,
    isMuted: false,
    isArchived: false,
    members: [
      {
        id: "1",
        name: "Alice Johnson",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        role: "admin",
      },
      {
        id: "2",
        name: "John Doe",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        role: "member",
      },
    ],
  },
];

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Hey! How's it going?",
    sender: "other",
    timestamp: "09:41",
    status: "read",
  },
  {
    id: 2,
    text: "I'm doing great! Just finished the project we discussed.",
    sender: "user",
    timestamp: "09:42",
    status: "read",
    reactions: [
      { emoji: "👍", userId: "1", timestamp: new Date().toISOString() },
    ],
  },
  {
    id: 3,
    text: "That's awesome! Would you like to discuss the results over coffee?",
    sender: "other",
    timestamp: "09:45",
    status: "read",
    isPinned: true,
  },
];

export default function MessagingPage() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState<string>("");
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showChatSettings, setShowChatSettings] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const newSocket = new WebSocket(wsUrl);

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "typing":
          handleTypingIndicator(data.userId, data.isTyping);
          break;
        case "messageRead":
          handleMessageRead(data.messageId);
          break;
        // Add more cases as needed
      }
    };

    setSocket(newSocket);

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  const handleTypingIndicator = (userId: string, isTyping: boolean) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id.toString() === userId
          ? { ...chat, status: isTyping ? "typing" : "online" }
          : chat,
      ),
    );
  };

  const handleMessageRead = (messageId: number) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, status: "read" } : msg,
      ),
    );
  };

  const handleSendMessage = useCallback(() => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "sent",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // Update chat's last message
    if (selectedChat) {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === selectedChat
            ? { ...chat, lastMessage: input, lastSeen: "now" }
            : chat,
        ),
      );

      // Send message through WebSocket
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: "message",
            chatId: selectedChat,
            message: newMessage,
          }),
        );
      }
    }

    // Simulate message status updates
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg,
        ),
      );
    }, 1000);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: "read" } : msg,
        ),
      );
    }, 2000);
  }, [input, messages.length, selectedChat, socket]);

  const handleFileAttachment = (type: string, file: File) => {
    // Handle file attachment
    console.log(`Attaching ${type} file:`, file);
  };

  const handleVoiceMessage = (blob: Blob) => {
    // Handle voice message
    console.log("Voice message recorded:", blob);
  };

  const handleScheduleMessage = (date: Date) => {
    // Handle scheduled message
    console.log("Message scheduled for:", date);
  };

  const handleCreateGroup = useCallback(
    (name: string, members: string[]) => {
      const newGroup: Chat = {
        id: chats.length + 1,
        type: "group",
        name,
        lastMessage: "Group created",
        avatar:
          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150", // Default group avatar
        status: "online",
        lastSeen: "now",
        unreadCount: 0,
        isMuted: false,
        isArchived: false,
        members: members.map((memberId) => ({
          id: memberId,
          name: "Member", // In a real app, fetch member details
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
          role: memberId === "current-user" ? "admin" : "member",
        })),
      };

      setChats((prev) => [...prev, newGroup]);
      setShowCreateGroup(false);
    },
    [chats.length],
  );

  const handleCreateChat = useCallback(
    (
      users: Array<{ id: string; name: string; avatar: string; role: string }>,
    ) => {
      // For direct messages
      if (users.length === 1) {
        const newChat: Chat = {
          id: chats.length + 1,
          type: "direct",
          name: users[0].name,
          lastMessage: "Start a conversation",
          avatar: users[0].avatar,
          status: "offline",
          lastSeen: "Never",
          unreadCount: 0,
          isMuted: false,
          isArchived: false,
        };
        setChats((prev) => [...prev, newChat]);
        setSelectedChat(newChat.id);
      }
      // For group messages
      else if (users.length > 1) {
        const newChat: Chat = {
          id: chats.length + 1,
          type: "group",
          name: `${users[0].name} and ${users.length - 1} others`,
          lastMessage: "Group created",
          avatar: users[0].avatar,
          status: "online",
          lastSeen: "now",
          unreadCount: 0,
          isMuted: false,
          isArchived: false,
          members: users.map((user) => ({
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            role: "member",
          })),
        };
        setChats((prev) => [...prev, newChat]);
        setSelectedChat(newChat.id);
      }
    },
    [chats.length],
  );

  const handleMuteChat = useCallback((chatId: number) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, isMuted: !chat.isMuted } : chat,
      ),
    );
  }, []);

  const handleArchiveChat = useCallback((chatId: number) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, isArchived: !chat.isArchived } : chat,
      ),
    );
  }, []);

  const handleDeleteChat = useCallback(
    (chatId: number) => {
      setChats((prev) => prev.filter((chat) => chat.id !== chatId));
      if (selectedChat === chatId) {
        setSelectedChat(null);
      }
    },
    [selectedChat],
  );

  const selectedChatData = chats.find((chat) => chat.id === selectedChat);

  return (
    <div className="flex h-screen bg-gray-100 py-14 px-10">
      {/* Chat List */}
      <ChatList
        chats={chats}
        selectedChat={selectedChat}
        onSelectChat={setSelectedChat}
        onCreateGroup={() => setShowCreateGroup(true)}
        onMuteChat={handleMuteChat}
        onArchiveChat={handleArchiveChat}
        onDeleteChat={handleDeleteChat}
        onCreateChat={handleCreateChat}
      />

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-white shadow-lg">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center">
                <img
                  src={selectedChatData?.avatar}
                  alt="Chat avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="ml-3">
                  <h2 className="font-semibold text-gray-800">
                    {selectedChatData?.name}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {selectedChatData?.status === "online"
                      ? "Active now"
                      : selectedChatData?.lastSeen}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Phone size={20} className="text-gray-600" />
                </button>
                <button
                  className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${
                    selectedChatData?.isMuted
                      ? "text-blue-500"
                      : "text-gray-600"
                  }`}
                >
                  <Bell size={20} />
                </button>
                <button
                  onClick={() => setShowChatSettings(true)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <MoreVertical size={20} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    onReact={(messageId, emoji) => {
                      setMessages((prev) =>
                        prev.map((m) =>
                          m.id === messageId
                            ? {
                                ...m,
                                reactions: [
                                  ...(m.reactions || []),
                                  {
                                    emoji,
                                    userId: "current-user",
                                    timestamp: new Date().toISOString(),
                                  },
                                ],
                              }
                            : m,
                        ),
                      );
                    }}
                    onPin={(messageId) => {
                      setMessages((prev) =>
                        prev.map((m) =>
                          m.id === messageId
                            ? { ...m, isPinned: !m.isPinned }
                            : m,
                        ),
                      );
                    }}
                    onReply={(messageId) => {
                      const replyToMessage = messages.find(
                        (m) => m.id === messageId,
                      );
                      if (replyToMessage) {
                        setInput(`Replying to: "${replyToMessage.text}"\n`);
                      }
                    }}
                    onRemoveReaction={(messageId, reactionId) => {
                      setMessages((prev) =>
                        prev.map((m) =>
                          m.id === messageId
                            ? {
                                ...m,
                                reactions: m.reactions?.filter(
                                  (r) => r.userId !== reactionId,
                                ),
                              }
                            : m,
                        ),
                      );
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Message Input */}
            <MessageInput
              input={input}
              setInput={setInput}
              onSend={handleSendMessage}
              onAttach={handleFileAttachment}
              onSchedule={handleScheduleMessage}
              onVoiceMessage={handleVoiceMessage}
            />
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 bg-gray-50">
            <div className="text-center max-w-md p-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Welcome to CONNECT Messages
              </h3>
              <p className="text-gray-600 mb-6">
                Start a conversation, create a group, or select an existing chat
                to begin messaging.
              </p>
              <button
                onClick={() => setShowCreateGroup(true)}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Create New Group
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      {showCreateGroup && (
        <CreateGroup
          onClose={() => setShowCreateGroup(false)}
          onCreate={handleCreateGroup}
        />
      )}

      {/* Chat Settings Modal */}
      {showChatSettings && selectedChatData && (
        <ChatSettings
          chat={selectedChatData}
          onClose={() => setShowChatSettings(false)}
          onMute={() => handleMuteChat(selectedChatData.id)}
          onArchive={() => handleArchiveChat(selectedChatData.id)}
          onDelete={() => handleDeleteChat(selectedChatData.id)}
        />
      )}
    </div>
  );
}
