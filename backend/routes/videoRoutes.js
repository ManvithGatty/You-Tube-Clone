import express from "express";
import {
  createVideo,
  getVideos,
  getVideo,
  updateVideo,
  deleteVideo,
  searchVideos,
  getVideosByCategory
} from "../controllers/videoController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createVideo); // Create video
router.get("/", getVideos); // Get all videos
router.get("/search", searchVideos); //Search video
router.get("/:id", getVideo); // Get single video
router.put("/:id", authMiddleware, updateVideo); // Update video
router.delete("/:id", authMiddleware, deleteVideo); // Delete video
router.get("/category/:category", getVideosByCategory); //get videos from category

export default router;
