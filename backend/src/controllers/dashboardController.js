import Project from "../models/Project.js";
import Task from "../models/Task.js";

// GET /api/dashboard — Dashboard stats
// Project Admin: stats for tasks in their projects + assigned tasks
// Member: stats for own assigned tasks only
export const getDashboard = async (req, res) => {
  try {
    const { projectId } = req.query;

    const adminProjects = await Project.find({ admin: req.user.id }).select("_id");
    const adminProjectIds = adminProjects.map(p => p._id);

    let filter = {
      $or: [
        { assignedTo: req.user.id },
        { projectId: { $in: adminProjectIds } }
      ]
    };

    if (projectId) {
      filter = {
        $and: [
          { projectId },
          {
            $or: [
              { assignedTo: req.user.id },
              { projectId: { $in: adminProjectIds } }
            ]
          }
        ]
      };
    }

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email")
      .populate("projectId", "name");

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter((t) => t.status === "done").length;
    const inProgressTasks = tasks.filter((t) => t.status === "in-progress").length;
    const todoTasks = tasks.filter((t) => t.status === "todo").length;

    const overdueTasks = tasks.filter(
      (t) =>
        t.dueDate &&
        new Date(t.dueDate) < new Date() &&
        t.status !== "done"
    ).length;

    // Tasks grouped per user
    const tasksPerUser = {};
    tasks.forEach((task) => {
      const key = task.assignedTo
        ? `${task.assignedTo.name} (${task.assignedTo.email})`
        : "Unassigned";
      tasksPerUser[key] = (tasksPerUser[key] || 0) + 1;
    });

    // Priority breakdown
    const tasksByPriority = {
      low: tasks.filter((t) => t.priority === "low").length,
      medium: tasks.filter((t) => t.priority === "medium").length,
      high: tasks.filter((t) => t.priority === "high").length,
    };

    // Recent overdue task details (up to 5)
    const overdueList = tasks
      .filter(
        (t) =>
          t.dueDate &&
          new Date(t.dueDate) < new Date() &&
          t.status !== "done"
      )
      .slice(0, 5)
      .map((t) => ({
        _id: t._id,
        title: t.title,
        dueDate: t.dueDate,
        assignedTo: t.assignedTo,
        project: t.projectId,
        status: t.status,
        priority: t.priority,
      }));

    res.status(200).json({
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      overdueTasks,
      tasksPerUser,
      tasksByPriority,
      overdueList,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};