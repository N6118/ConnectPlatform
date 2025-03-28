// Message Types
export interface Message {
  id: number;
  text: string;
  sender: "user" | "other";
  timestamp: string;
  status: "sent" | "delivered" | "read";
  reactions?: Reaction[];
  replyTo?: number;  // Changed from object to number
  isPinned?: boolean;
  scheduledFor?: string;
  thread?: {
    count: number;
    lastReply: string;
  };
  attachment?: {
    type: string;
    url: string;
    name: string;
    size: number;
  };
}

export interface Reaction {
  emoji: string;
  userId: string;
  timestamp: string;
}

// Chat Types
export interface Chat {
  id: number;
  type: "direct" | "group";
  name: string;
  lastMessage: string;
  avatar: string;
  status: "online" | "offline" | "typing";
  lastSeen: string;
  unreadCount: number;
  isMuted: boolean;
  isArchived: boolean;
  pinned?: boolean;
  members?: ChatMember[];
}

export interface ChatMember {
  id: string;
  name: string;
  avatar: string;
  role: "admin" | "member";
}

// Quick Reply Types
export interface QuickReply {
  text: string;
  icon?: string;
}

// Applicant Types for my-space
export interface Applicant {
  id: string;
  name: string;
  email: string;
  status: "pending" | "accepted" | "rejected" | "waitlisted";
  appliedDate: string;
  experience: string;
  notes?: string;
}

// Author type for posts
export interface Author {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

// Post type used across components
export interface Post {
  id: string;
  author: Author;
  content: string;
  title?: string;  // Add title field as optional
  image?: string;
  tags: string[];
  visibility: string;
  createdAt: Date;
  likes: number;
  comments: number;
  reposts: number;
  type: string;
  timestamp: Date;  // Changed from string to Date
  shares: number;
  isEditable: boolean;
}