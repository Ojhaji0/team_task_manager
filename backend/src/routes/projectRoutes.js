import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createProject,
  getProjects,
  getProjectById,
  deleteProject,
  addMember,
  removeMember,
} from "../controllers/projectController.js";

const router = express.Router();

// POST   /api/projects          — Create a project
router.post("/", protect, createProject);

// GET    /api/projects          — Get all projects for the current user
router.get("/", protect, getProjects);

// GET    /api/projects/:id      — Get a single project by ID
router.get("/:id", protect, getProjectById);

// DELETE /api/projects/:id      — Delete a project (admin of project only)
router.delete("/:id", protect, deleteProject);

// POST   /api/projects/:id/members         — Add a member by email
router.post("/:id/members", protect, addMember);

// DELETE /api/projects/:id/members/:userId — Remove a member
router.delete("/:id/members/:userId", protect, removeMember);

export default router;