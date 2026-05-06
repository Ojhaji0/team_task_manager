import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";
import { getMe, getUsers } from "../controllers/userController.js";

const router = express.Router();

// GET /api/users/me — current logged-in user
router.get("/me", protect, getMe);

// GET /api/users — all users (admin only)
router.get("/", protect, adminOnly, getUsers);

export default router;
