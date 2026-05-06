import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

// POST   /api/tasks             — Create a task (admin only)
router.post("/", protect, createTask);

// GET    /api/tasks?projectId=  — Get tasks for a project
router.get("/", protect, getTasks);

// GET    /api/tasks/:id         — Get a single task
router.get("/:id", protect, getTaskById);

// PUT    /api/tasks/:id         — Update task (admin: all fields, member: status only)
router.put("/:id", protect, updateTask);

// DELETE /api/tasks/:id         — Delete a task (admin only)
router.delete("/:id", protect, deleteTask);

export default router;