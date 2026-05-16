import type { Notification } from "../utils/notification";

import avatar1 from "../assets/avatar1.webp";
import avatar2 from "../assets/avatar2.webp";


export const notifications: Notification[] = [
  {
    id: "n1",

    type: "join_request",
    status: "pending",

    sender: {
      id: "u1",
      name: "Rahul",
      avatar: avatar1,
    },

    receiver: {
      id: "u2",
      name: "You",
      avatar: avatar2,
    },

    hangout: {
      id: "1",
      title: "Cafe Chill Session ☕",
      vibe: "chill",
      location: {
        name: "Central Cafe",
        distance: 1.2,
      },
      startTime: new Date().toISOString(),
    },

    message: "Hey! Can I join your hangout?",

    createdAt: new Date().toISOString(),
  },

  {
    id: "n2",

    type: "join_request",
    status: "accepted",

    sender: {
      id: "u2",
      name: "You",
      avatar: avatar2,
    },

    receiver: {
      id: "u3",
      name: "Ananya",
      avatar: avatar2,
    },

    hangout: {
      id: "2",
      title: "Late Night Study 📚",
      vibe: "study",
      location: {
        name: "City Library",
        distance: 0.8,
      },
      startTime: new Date().toISOString(),
    },

    createdAt: new Date().toISOString(),
  },

  {
    id: "n3",

    type: "join_request",
    status: "rejected",

    sender: {
      id: "u4",
      name: "Arjun",
      avatar: avatar1,
    },

    receiver: {
      id: "u2",
      name: "You",
      avatar: avatar2,
    },

    hangout: {
      id: "3",
      title: "Gaming Night 🎮",
      vibe: "gaming",
      location: {
        name: "Discord",
      },
      startTime: new Date().toISOString(),
    },

    createdAt: new Date().toISOString(),
  },
];