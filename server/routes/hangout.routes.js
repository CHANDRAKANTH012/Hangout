import { Router } from "express";
import {
  createHangout,
  getHangouts,
  getNearbyHangouts,
  getHangout,
  updateHangout,
  deleteHangout,
  joinHangout,
  leaveHangout,
} from "../controllers/hangout.controller.js";
import { protect, optionalAuth } from "../middlewares/auth.middleware.js";
import multer from "multer";

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

const router = Router();

// Public routes
router.get("/", optionalAuth ,getHangouts);
router.get("/nearby", getNearbyHangouts);
router.get("/:id", getHangout);

// Protected routes
router.post("/", protect, upload.single("image"), createHangout);
router.put("/:id", protect, upload.single("image"), updateHangout);
router.delete("/:id", protect, deleteHangout);
router.post("/:id/join", protect, joinHangout);
router.post("/:id/leave", protect, leaveHangout);

export default router;
