"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import ChatList from "@//components/messaging-components/ChatList";
import MessageBubble from "@/components/messaging-components/MessageBubble";
import MessageInput from "@/components/messaging-components/MessageInput";
import CreateGroup from "@/components/messaging-components/CreateGroup";
import ChatSettings from "@/components/messaging-components/ChatSettings";
import { Bell, MoreVertical, ArrowLeft } from "lucide-react";
import type { Message, Chat } from "../types";
import { AnimatePresence, motion } from "framer-motion";
import WelcomeScreen from "@/components/messaging-components/WelcomeScreen";
import StudentNavbar from "@/components/navigation/StudentNavbar";
import MobileBottomNav from "@/components/navigation/MobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";

const initialChats: Chat[] = [
  {
    id: 1,
    type: "direct",
    name: "Mukesh Amdani",
    lastMessage: "Hey! Will you buy Jio ?",
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
      "https://dragonball.guru/wp-content/uploads/2021/03/goku-profile-e1616173641804-400x400.png",
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

export default function StudentMessaging() {
  const isMobile = useIsMobile();
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState<string>("");
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showChatSettings, setShowChatSettings] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      }
    };
    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

    if (selectedChat) {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === selectedChat
            ? { ...chat, lastMessage: input, lastSeen: "now" }
            : chat,
        ),
      );

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

  const handleFileAttachment = async (
    type: "document" | "image" | "video",
    file: File
  ) => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const fileUrl = URL.createObjectURL(file);

      const newMessage: Message = {
        id: messages.length + 1,
        text: type === "document" ? `📎 ${file.name}` : "",
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "sent",
        attachment: {
          type,
          url: fileUrl,
          name: file.name,
          size: file.size,
        },
      };

      setMessages((prev) => [...prev, newMessage]);

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
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleVoiceMessage = (blob: Blob) => {
    console.log("Voice message recorded:", blob);
  };

  const handleCreateGroup = useCallback(
    (name: string, members: string[]) => {
      const newGroup: Chat = {
        id: chats.length + 1,
        type: "group",
        name,
        lastMessage: "Group created",
        avatar:
          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150",
        status: "online",
        lastSeen: "now",
        unreadCount: 0,
        isMuted: false,
        isArchived: false,
        members: members.map((memberId) => ({
          id: memberId,
          name: "Member",
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
      } else if (users.length > 1) {
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
    <div className="min-h-screen bg-gray-50">
      <StudentNavbar />
      <div
        className={`flex flex-col ${
          isMobile ? 'h-[calc(100vh-8rem)]' : 'h-[calc(100vh-4rem)]'
        }`}
      >
        <div className="flex flex-1 bg-gray-100">
          <AnimatePresence>
            {(!selectedChat || !isMobileView) && (
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full md:w-80 flex flex-col"
              >
                <ChatList
                  chats={chats}
                  selectedChat={selectedChat}
                  onSelectChat={(chatId) => {
                    setSelectedChat(chatId);
                  }}
                  onCreateChat={handleCreateChat}
                  onCreateGroup={() => setShowCreateGroup(true)}
                  isMobileView={isMobileView}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {selectedChat ? (
              <motion.div
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="flex-1 flex flex-col bg-white shadow-lg"
              >
                <div className="flex items-center justify-between p-4 border-b">
                  {isMobileView && (
                    <button
                      onClick={() => setSelectedChat(null)}
                      className="mr-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <ArrowLeft
                        size={24}
                        className="text-gray-600"
                      />
                    </button>
                  )}
                  <div className="flex items-center">
                    <img
                      src={selectedChatData?.avatar || "/placeholder.svg"}
                      alt="Chat avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="ml-3">
                      <div className="flex items-center space-x-2">
                        <h2 className="font-semibold text-gray-800">
                          {selectedChatData?.name}
                        </h2>
                        {selectedChatData?.isMuted && (
                          <Bell className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {selectedChatData?.status === "online"
                          ? "Active now"
                          : selectedChatData?.lastSeen}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setShowChatSettings(true)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <MoreVertical
                        size={20}
                        className="text-gray-600"
                      />
                    </button>
                  </div>
                </div>

                <div className="flex-1 p-4 overflow-y-auto">
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
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                <div className="mt-auto">
                  <MessageInput
                    input={input}
                    setInput={setInput}
                    onSend={handleSendMessage}
                    onAttach={handleFileAttachment}
                    onVoiceMessage={handleVoiceMessage}
                  />
                </div>
              </motion.div>
            ) : (
              !isMobileView && (
                <WelcomeScreen onCreateGroup={() => setShowCreateGroup(true)} />
              )
            )}
          </AnimatePresence>

          {showCreateGroup && (
            <CreateGroup
              onClose={() => setShowCreateGroup(false)}
              onCreate={handleCreateGroup}
            />
          )}

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
      </div>
      {isMobile && <MobileBottomNav role="student" />}
    </div>
  );
}
