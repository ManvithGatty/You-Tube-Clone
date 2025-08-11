import express from "express";
import { searchVideos, filterVideos } from "../controllers/searchController.js";

const router = express.Router();

router.get("/search", searchVideos);
router.get("/filter", filterVideos);

export default router;
