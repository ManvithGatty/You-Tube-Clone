import express from "express";
import {
  addComment,
  editComment,
  deleteComment,
} from "../controllers/commentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Add comment to a video
router.post("/:videoId", authMiddleware, addComment);

// Edit comment
router.put("/:videoId/:commentId", authMiddleware, editComment);

// Delete comment
router.delete("/:videoId/:commentId", authMiddleware, deleteComment);

export default router;
