import Project from "../models/Project.js";
import User from "../models/User.js";

// POST /api/projects — Create a project (creator becomes admin)
export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const project = await Project.create({
      name,
      description,
      admin: req.user.id,
      members: [req.user.id],
    });

    const populated = await Project.findById(project._id)
      .populate("admin", "name email")
      .populate("members", "name email");

    res.status(201).json(populated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/projects — Get all projects the user belongs to
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ members: req.user.id })
      .populate("admin", "name email")
      .populate("members", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/projects/:id — Get a single project by ID
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("admin", "name email")
      .populate("members", "name email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Ensure the requester is a member of this project
    const isMember = project.members.some(
      (m) => m._id.toString() === req.user.id.toString()
    );
    if (!isMember) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/projects/:id — Delete a project (Admin only)
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.admin.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Only the project admin can delete it" });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/projects/:id/members — Add a member (Admin only)
export const addMember = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Only the project admin can add members
    if (project.admin.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Only the project admin can add members" });
    }

    // Find user by email
    const userToAdd = await User.findOne({ email });

    if (!userToAdd) {
      return res.status(404).json({ message: "User not found with that email" });
    }

    // Prevent duplicates
    if (
      project.members.some(
        (member) => member.toString() === userToAdd._id.toString()
      )
    ) {
      return res.status(400).json({ message: "User is already a member" });
    }

    project.members.push(userToAdd._id);
    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate("admin", "name email")
      .populate("members", "name email");

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/projects/:id/members/:userId — Remove a member (Admin only)
export const removeMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Only the project admin can remove members
    if (project.admin.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Only the project admin can remove members" });
    }

    // Cannot remove the admin themselves
    if (req.params.userId === project.admin.toString()) {
      return res.status(400).json({ message: "Cannot remove the project admin" });
    }

    project.members = project.members.filter(
      (member) => member.toString() !== req.params.userId
    );

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate("admin", "name email")
      .populate("members", "name email");

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};