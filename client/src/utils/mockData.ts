import avatar1 from "../assets/avatar1.webp";
import avatar2 from "../assets/avatar2.webp";


export type Hangout = {
  id: string;

  // BASIC (REQUIRED)
  title: string;
  description: string;
  vibe: "chill" | "study" | "party" | "sports" | "networking" | "gaming" | "travel" | "explore" | "binge";
  category: "indoor" | "outdoor" | "online";

  // LOCATION
  location: {
    name: string;

    lat?: number;
    lng?: number;
    distance?: number;
  };

  // TIME
  startTime: string;

  endTime?: string;

  // HOST
  host: {
    name: string;
    avatar: string;

    id?: string;

    joinedUsers?: string[];

    visibilityRadius?: number;
  };

  // PARTICIPATION
  participants: number;
  maxParticipants: number;
  
  minParticipants?: number;

  // ACCESS CONTROL
  isPrivate: boolean;
  approvalRequired: boolean;

  // TAGS / FILTERS
  tags?: string[];
  ageLimit?: number;
  customVibe?: string;

  // STATUS
  status: "active" | "full" | "ended";

  // EXTRA
  message?: string;
  createdAt?: string;
};

/* Options used in the CreateHangout form */
export const vibeOptions: Hangout["vibe"][] = [
  "study", "party", "travel", "explore", "binge",
];

export const categoryOptions: Hangout["category"][] = [
  "indoor", "outdoor", "online",
];



export const hangouts: Hangout[] = [
  {
    id: "1",
    title: "Cafe Chill Session ☕",
    description: "Casual meetup to relax and chat",
    vibe: "chill",
    category: "indoor",

    location: {
      name: "Central Cafe",
      lat: 12.9716,
      lng: 77.5946,
      distance: 1.2,
    },

    startTime: new Date().toISOString(),
    endTime: "",

    host: {
      name: "Rahul",
      avatar: avatar1,
      id: "u1",
      joinedUsers: ["u2", "u3"],
    },

    participants: 3,
    maxParticipants: 6,
    minParticipants: 2,

    isPrivate: false,
    approvalRequired: false,

    tags: ["coffee", "chill"],
    ageLimit: 18,

    status: "active",
    message: "Bring good vibes only!",
    createdAt: new Date().toISOString(),
  },

  {
    id: "2",
    title: "Late Night Study 📚",
    description: "Group study session for exams",
    vibe: "study",
    category: "indoor",

    location: {
      name: "City Library",
      lat: 12.9352,
      lng: 77.6245,
      distance: 0.8,
    },

    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),

    host: {
      name: "Ananya",
      avatar: avatar2,
      id: "u2",
    },

    participants: 5,
    maxParticipants: 5,

    isPrivate: true,
    approvalRequired: true,

    tags: ["study", "focus"],
    ageLimit: 18,
    customVibe: "deep-focus",

    status: "full",
    message: "Please be on time",
    createdAt: new Date().toISOString(),
  },

  {
    id: "3",
    title: "Football Evening ⚽",
    description: "Friendly football match",
    vibe: "sports",
    category: "outdoor",

    location: {
      name: "Local Ground",
      lat: 12.9611,
      lng: 77.6387,
      distance: 2.5,
    },

    startTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),

    host: {
      name: "Kiran",
      avatar: avatar1,
      id: "u3",
    },

    participants: 8,
    maxParticipants: 12,

    isPrivate: false,
    approvalRequired: false,

    tags: ["football", "sports"],
    status: "active",
    createdAt: new Date().toISOString(),
  },

  {
    id: "4",
    title: "Gaming Night 🎮",
    description: "Online multiplayer gaming session",
    vibe: "gaming",
    category: "online",

    location: {
      name: "Discord Server",
    },

    startTime: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),

    host: {
      name: "Arjun",
      avatar: avatar1,
      id: "u4",
    },

    participants: 2,
    maxParticipants: 6,

    isPrivate: false,
    approvalRequired: false,

    tags: ["gaming", "fun"],
    status: "active",
    createdAt: new Date().toISOString(),
  },

  {
    id: "5",
    title: "Startup Networking 🚀",
    description: "Meet founders and developers",
    vibe: "networking",
    category: "indoor",

    location: {
      name: "Co-working Space",
      distance: 3.1,
    },

    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),

    host: {
      name: "Sneha",
      avatar: avatar1,
      id: "u5",
    },

    participants: 10,
    maxParticipants: 20,

    isPrivate: false,
    approvalRequired: true,

    tags: ["startup", "networking"],
    status: "active",
    createdAt: new Date().toISOString(),
  },

  {
    id: "6",
    title: "Morning Yoga 🧘",
    description: "Relax and stretch together",
    vibe: "chill",
    category: "outdoor",

    location: {
      name: "City Park",
      distance: 1.7,
    },

    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),

    host: {
      name: "Meera",
      avatar: avatar1,
      id: "u6",
    },

    participants: 6,
    maxParticipants: 10,

    isPrivate: false,
    approvalRequired: false,

    tags: ["yoga", "health"],
    status: "ended",
    createdAt: new Date().toISOString(),
  },
];