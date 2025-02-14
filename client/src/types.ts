export interface Member {
  id: string;
  name: string;
  avatar: string;
  role: "admin" | "member";
}

export interface Message {
  id: number;
  text: string;
  sender: "user" | "other";
  timestamp: string;
  status: "sent" | "delivered" | "read";
  reactions?: { emoji: string; userId: string; timestamp: string }[];
  replyTo?: number;
  isPinned?: boolean;
  attachment?: {
    type: "image" | "video" | "document";
    url: string;
    name: string;
    size: number;
  };
}

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
  members?: { id: string; name: string; avatar: string; role: string }[];
}

export interface QuickReply {
  text: string;
  icon?: string;
}
