import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Hangout from "../models/Hangout.js";
import Notification from "../models/Notification.js";

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Hangout.deleteMany({}),
      Notification.deleteMany({}),
    ]);
    console.log("Cleared existing data");

    // Create users one by one (so pre-save password hash hook fires)
    const userData = [
      {
        name: "Chandru",
        username: "chandru",
        email: "chandru@test.com",
        password: "password123",
        bio: "Explorer & coffee lover ☕",
      },
      {
        name: "Mohith",
        username: "mohith",
        email: "mohith@test.com",
        password: "password123",
        bio: "Tech enthusiast 🚀",
      },
      {
        name: "Naveen",
        username: "naveen",
        email: "naveen@test.com",
        password: "password123",
        bio: "Sports & adventures 🏃",
      },
      {
        name: "Suraj",
        username: "suraj",
        email: "suraj@test.com",
        password: "password123",
        bio: "Music & vibes 🎶",
      },
      {
        name: "Divya",
        username: "divya",
        email: "divya@test.com",
        password: "password123",
        bio: "Art & design 🎨",
      },
    ];

    const users = [];
    for (const data of userData) {
      const user = new User(data);
      await user.save();
      users.push(user);
    }
    console.log(`Created ${users.length} users`);

    // Create hangouts one by one (so pre-save status hook fires)
    const hangoutData = [
      {
        title: "Cafe Chill Session ☕",
        description:
          "Casual meetup to relax, grab coffee, and chat about life. Good vibes only!",
        vibe: "chill",
        category: "indoor",
        location: {
          type: "Point",
          coordinates: [77.5946, 12.9716],
          name: "Central Cafe",
          address: "MG Road, Bangalore",
        },
        startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        host: users[0]._id,
        maxParticipants: 6,
        participants: [users[0]._id, users[1]._id],
        tags: ["coffee", "chill", "casual"],
        message: "Bring good vibes only!",
      },
      {
        title: "Late Night Study 📚",
        description:
          "Group study session for upcoming exams. Bring your notes and focus!",
        vibe: "study",
        category: "indoor",
        location: {
          type: "Point",
          coordinates: [77.6245, 12.9352],
          name: "City Library",
          address: "Indiranagar, Bangalore",
        },
        startTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
        host: users[1]._id,
        maxParticipants: 5,
        participants: [
          users[1]._id,
          users[2]._id,
          users[3]._id,
          users[4]._id,
          users[0]._id,
        ],
        approvalRequired: true,
        tags: ["study", "focus"],
        customVibe: "deep-focus",
      },
      {
        title: "Football Evening ⚽",
        description:
          "Friendly football match at the local ground. All skill levels welcome!",
        vibe: "sports",
        category: "outdoor",
        location: {
          type: "Point",
          coordinates: [77.6387, 12.9611],
          name: "Local Ground",
          address: "Koramangala, Bangalore",
        },
        startTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
        host: users[2]._id,
        maxParticipants: 12,
        participants: [users[2]._id, users[0]._id, users[3]._id],
        tags: ["football", "sports"],
      },
      {
        title: "Gaming Night 🎮",
        description: "Online multiplayer gaming session. Bring your A-game!",
        vibe: "gaming",
        category: "online",
        location: {
          type: "Point",
          coordinates: [77.58, 12.95],
          name: "Discord Server",
        },
        startTime: new Date(Date.now() + 1 * 60 * 60 * 1000),
        host: users[3]._id,
        maxParticipants: 6,
        participants: [users[3]._id, users[4]._id],
        tags: ["gaming", "fun"],
      },
      {
        title: "Startup Networking 🚀",
        description:
          "Meet fellow founders, developers, and designers. Share ideas and grow together.",
        vibe: "networking",
        category: "indoor",
        location: {
          type: "Point",
          coordinates: [77.61, 12.98],
          name: "Co-working Space",
          address: "HSR Layout, Bangalore",
        },
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
        host: users[4]._id,
        maxParticipants: 20,
        participants: [users[4]._id],
        approvalRequired: true,
        tags: ["startup", "networking"],
      },
      {
        title: "Morning Yoga 🧘",
        description: "Relax and stretch together in the park. Bring your mat!",
        vibe: "chill",
        category: "outdoor",
        location: {
          type: "Point",
          coordinates: [77.57, 12.96],
          name: "City Park",
          address: "Cubbon Park, Bangalore",
        },
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
        host: users[0]._id,
        maxParticipants: 10,
        participants: [
          users[0]._id,
          users[1]._id,
          users[2]._id,
          users[3]._id,
          users[4]._id,
        ],
        tags: ["yoga", "health"],
        status: "ended",
      },
    ];

    const hangouts = [];
    for (const data of hangoutData) {
      const hangout = new Hangout(data);
      await hangout.save();
      hangouts.push(hangout);
    }
    console.log(`Created ${hangouts.length} hangouts`);

    // Create sample notifications one by one
    const notiData = [
      {
        type: "join_request",
        status: "pending",
        sender: users[3]._id,
        receiver: users[0]._id,
        hangout: hangouts[0]._id,
        message: "Hey! Can I join your cafe session?",
      },
      {
        type: "join_request",
        status: "accepted",
        sender: users[0]._id,
        receiver: users[1]._id,
        hangout: hangouts[1]._id,
        message: "Would love to join the study group!",
      },
      {
        type: "join_request",
        status: "pending",
        sender: users[4]._id,
        receiver: users[0]._id,
        hangout: hangouts[0]._id,
        message: "Sounds fun, count me in!",
      },
    ];

    for (const data of notiData) {
      const noti = new Notification(data);
      await noti.save();
    }
    console.log("Created sample notifications");

    console.log("\n✅ Seed completed successfully!");
    console.log("\nTest accounts (all passwords: password123):");
    users.forEach((u) => console.log(`  ${u.name} — ${u.email}`));

    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
};

seed();
