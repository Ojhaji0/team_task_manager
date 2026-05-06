import Task from "../models/Task.js";
import Project from "../models/Project.js";

// POST /api/tasks — Create a task (Admin only)
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, projectId, assignedTo } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({ message: "Title and project are required" });
    }

    // Verify the project exists and the creator is a member
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isMember = project.members.some(
      (m) => m.toString() === req.user.id.toString()
    );
    if (!isMember) {
      return res.status(403).json({ message: "Not a member of this project" });
    }

    // Only project admin can create tasks
    if (project.admin.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Only project admins can create tasks" });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      projectId,
      assignedTo: assignedTo || null,
      createdBy: req.user.id,
    });

    const populated = await Task.findById(task._id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.status(201).json(populated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/tasks?projectId=... — Get all tasks for a project
export const getTasks = async (req, res) => {
  try {
    const { projectId } = req.query;

    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    let filter = { projectId };

    // Members only see tasks assigned to them (Project admin sees all)
    if (project.admin.toString() !== req.user.id.toString()) {
      filter.assignedTo = req.user.id;
    }

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .populate("projectId", "admin name")
      .sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/tasks/:id — Get a single task by ID
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .populate("projectId", "name");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await Project.findById(task.projectId);

    // Members can only view tasks assigned to them
    if (
      project && project.admin.toString() !== req.user.id.toString() &&
      task.assignedTo?._id?.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/tasks/:id — Update a task
// Admin: can update any field | Member: can only update status
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await Project.findById(task.projectId);

    // Members can only update their own assigned tasks, and only the status
    if (project && project.admin.toString() !== req.user.id.toString()) {
      if (
        !task.assignedTo ||
        task.assignedTo.toString() !== req.user.id.toString()
      ) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this task" });
      }

      // Only allow status update for members
      const allowedFields = ["status"];
      const requestedFields = Object.keys(req.body);
      const hasDisallowedField = requestedFields.some(
        (f) => !allowedFields.includes(f)
      );

      if (hasDisallowedField) {
        return res.status(403).json({
          message: "Members can only update the task status",
        });
      }

      // Validate status value
      const validStatuses = ["todo", "in-progress", "done"];
      if (req.body.status && !validStatuses.includes(req.body.status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
    }

    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/tasks/:id — Delete a task (Admin only)
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await Project.findById(task.projectId);

    // Only project admin can delete tasks
    if (project && project.admin.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Only project admins can delete tasks" });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};