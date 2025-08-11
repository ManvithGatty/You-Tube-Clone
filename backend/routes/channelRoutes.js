import express from "express";
import {
  createChannel,
  getChannel,
  updateChannel,
  deleteChannel,
} from "../controllers/channelController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createChannel); // Create channel
router.get("/:id", getChannel); // Get channel details
router.put("/:id", authMiddleware, updateChannel); // Update channel
router.delete("/:id", authMiddleware, deleteChannel); // Delete channel

export default router;
