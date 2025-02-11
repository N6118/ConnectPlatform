// Message Types
export interface Message {
  id: number;
  text: string;
  sender: "user" | "other";
  timestamp: string;
  status: "sent" | "delivered" | "read";
  reactions?: Reaction[];
  replyTo?: {
    id: number;
    text: string;
    sender: string;
  };
  isPinned?: boolean;
  scheduledFor?: string;
  thread?: {
    count: number;
    lastReply: string;
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
