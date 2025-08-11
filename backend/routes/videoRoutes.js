import express from "express";
import {
  createVideo,
  getVideos,
  getVideo,
  updateVideo,
  deleteVideo,
} from "../controllers/videoController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createVideo); // Create video
router.get("/", getVideos); // Get all videos
router.get("/:id", getVideo); // Get single video
router.put("/:id", authMiddleware, updateVideo); // Update video
router.delete("/:id", authMiddleware, deleteVideo); // Delete video

export default router;
