// Theme Colors
export const COLORS = {
  primary: {
    light: "#60A5FA", // blue-400
    DEFAULT: "#3B82F6", // blue-500
    dark: "#2563EB", // blue-600
  },
  secondary: {
    light: "#9CA3AF", // gray-400
    DEFAULT: "#6B7280", // gray-500
    dark: "#4B5563", // gray-600
  },
  success: {
    light: "#34D399", // green-400
    DEFAULT: "#10B981", // green-500
  },
  background: {
    light: "#F9FAFB", // gray-50
    DEFAULT: "#F3F4F6", // gray-100
    dark: "#E5E7EB", // gray-200
  },
};

// Quick Replies
export const QUICK_REPLIES = [
  { text: "Sure, let's meet!", icon: "👋" },
  { text: "I'll get back to you soon", icon: "⏳" },
  { text: "Thanks!", icon: "🙏" },
  { text: "Sounds good!", icon: "👍" },
];

// Emoji Categories for Reactions
export const EMOJI_CATEGORIES = {
  smileys: {
    name: "Smileys & Emotions",
    emojis: [
      "😀",
      "😃",
      "😄",
      "😁",
      "😅",
      "😂",
      "🤣",
      "😊",
      "😇",
      "🙂",
      "🙃",
      "😉",
      "😌",
      "😍",
      "🥰",
      "😘",
      "😗",
      "😙",
      "😚",
      "😋",
      "😛",
      "😝",
      "😜",
      "🤪",
      "🤨",
      "🧐",
      "🤓",
      "😎",
      "🤩",
      "🥳",
    ],
  },
  gestures: {
    name: "Gestures",
    emojis: [
      "👍",
      "👎",
      "👌",
      "✌️",
      "🤞",
      "🤟",
      "🤘",
      "🤙",
      "👈",
      "👉",
      "👆",
      "👇",
      "✋",
      "🤚",
      "👋",
      "👏",
      "🙌",
      "👐",
      "🤲",
      "🤝",
      "🙏",
    ],
  },
  hearts: {
    name: "Hearts",
    emojis: [
      "❤️",
      "🧡",
      "💛",
      "💚",
      "💙",
      "💜",
      "🤎",
      "🖤",
      "🤍",
      "💔",
      "❤️‍🔥",
      "❤️‍🩹",
      "💖",
      "💗",
      "💓",
      "💞",
      "💕",
      "💝",
    ],
  },
  objects: {
    name: "Objects",
    emojis: [
      "🎉",
      "✨",
      "🎵",
      "🎶",
      "💫",
      "⭐",
      "🌟",
      "✅",
      "❌",
      "❓",
      "❗",
      "💯",
      "💪",
      "🔥",
      "🌈",
      "☀️",
      "🌙",
      "⚡",
      "💡",
      "💭",
    ],
  },
  flags: {
    name: "Flags",
    emojis: ["🏁", "🚩", "🎌", "🏴", "🏳️", "🏳️‍🌈", "🏳️‍⚧️", "🏴‍☠️"],
  },
};

// Common Reactions (Quick Access)
export const COMMON_REACTIONS = [
  "👍",
  "❤️",
  "😂",
  "😮",
  "😢",
  "😡",
  "🎉",
  "🤔",
  "👏",
  "🔥",
];

// Message Status Icons
export const MESSAGE_STATUS = {
  sent: "check",
  delivered: "check-check",
  read: "check-check",
};
