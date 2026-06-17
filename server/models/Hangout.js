import mongoose from "mongoose";

const hangoutSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: 1000,
    },
    vibe: {
      type: String,
      required: true,
      enum: [
        "chill",
        "hype",
        "study",
        "party",
        "sports",
        "networking",
        "gaming",
        "travel",
        "explore",
        "binge",
        "productive",
        "mysterious",
        "urban",
        "creative",
        "deep-talk",
        "nature",
        "food-run",
        "adventure",
      ],
      lowercase: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["indoor", "outdoor", "online", "nightlife"],
      lowercase: true,
    },

    // GeoJSON for geospatial queries (Map API)
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: {
        type: [Number],
        required: [true, "Coordinates are required"],
      }, // [lng, lat]
      name: {
        type: String,
        required: [true, "Location name is required"],
        trim: true,
      },
      address: { type: String, default: "" },
    },

    startTime: { type: Date, required: [true, "Start time is required"] },
    endTime: { type: Date },

    host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    maxParticipants: { type: Number, required: true, min: 2, max: 100 },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    approvalRequired: { type: Boolean, default: false },

    tags: [{ type: String, trim: true, lowercase: true }],
    ageLimit: { type: Number, default: 0, min: 0 },
    customVibe: { type: String, default: "", trim: true, maxlength: 50 },
    restrictions: { type: String, default: "", trim: true, maxlength: 200 },

    status: {
      type: String,
      enum: ["active", "full", "ended"],
      default: "active",
    },
    message: { type: String, default: "", trim: true, maxlength: 500 },

    image: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// 2dsphere index for geospatial queries (Map API)
hangoutSchema.index({ location: "2dsphere" });

// Index for common queries
hangoutSchema.index({ status: 1, startTime: -1 });
hangoutSchema.index({ host: 1 });
hangoutSchema.index({ category: 1 });
hangoutSchema.index({ vibe: 1 });

// Virtual: current participant count
hangoutSchema.virtual("participantCount").get(function () {
  return this.participants ? this.participants.length : 0;
});

// Virtual: is full
hangoutSchema.virtual("isFull").get(function () {
  return this.participants && this.participants.length >= this.maxParticipants;
});

// Auto-update status to 'full' when participants reach max
hangoutSchema.pre("save", function () {
  if (this.participants && this.participants.length >= this.maxParticipants) {
    this.status = "full";
  } else if (
    this.status === "full" &&
    this.participants &&
    this.participants.length < this.maxParticipants
  ) {
    this.status = "active";
  }
});

const Hangout = mongoose.model("Hangout", hangoutSchema);
export default Hangout;
