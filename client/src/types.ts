export interface Member {
  id: string;
  name: string;
  avatar: string;
  role: 'admin' | 'member';
}

export interface Chat {
  id: number;
  type: 'direct' | 'group';
  name: string;
  lastMessage: string;
  avatar: string;
  status: 'online' | 'offline' | 'typing';
  lastSeen: string;
  unreadCount: number;
  isMuted: boolean;
  isArchived: boolean;
  members?: Member[];
}

export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'other';
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  reactions?: Array<{
    emoji: string;
    userId: string;
    timestamp: string;
  }>;
  isPinned?: boolean;
  replyTo?: {
    id: number;
    text: string;
  };
}

export interface QuickReply {
  text: string;
  icon?: string;
}
