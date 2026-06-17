import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import connectDB from "./configs/db.js";
import errorHandler from "./middlewares/error.middleware.js";

// Route imports
import authRoutes from "./routes/auth.routes.js";
import hangoutRoutes from "./routes/hangout.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import userRoutes from "./routes/user.routes.js";

// CONFIG
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// DB
await connectDB();

// MIDDLEWARE

// Security headers
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// CORS — allow frontend dev server
const allowedOrigins = [
  "http://localhost:5173",
  "https://hangout-3xwp.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    credentials: true,
  }),
);

// Rate limiting — prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
});
app.use("/api/", limiter);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve uploaded files statically (when Cloudinary is disabled)
app.use("/uploads", express.static("uploads"));

// API ROUTES
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Hangout API is Live! 🚀",
    version: "1.0.0",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/hangouts", hangoutRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);

// 404 HANDLER
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// GLOBAL ERROR HANDLER
app.use(errorHandler);

// START SERVER
app.listen(PORT, () => {
  console.log(`\nHangout API is live at http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `Cloudinary: ${process.env.USE_CLOUDINARY === "true" ? "ENABLED" : "DISABLED (local uploads)"}`,
  );
});
