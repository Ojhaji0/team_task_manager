import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import TaskCard from "../components/TaskCard";
import { useToast } from "../components/Toast";
import { getUserId } from "../utils/auth";

const COLUMNS = [
  { key: "todo",        label: "To Do",       color: "#64748b", glow: "rgba(100,116,139,0.2)" },
  { key: "in-progress", label: "In Progress",  color: "#818cf8", glow: "rgba(99,102,241,0.25)"  },
  { key: "done",        label: "Done",         color: "#34d399", glow: "rgba(16,185,129,0.25)"  },
];

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const currentUserId = getUserId();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: "", description: "", priority: "medium", dueDate: "", assignedTo: "" });
  const [creating, setCreating] = useState(false);

  const loadAll = async () => {
    try {
      const [projRes, taskRes] = await Promise.all([
        API.get(`/projects/${id}`),
        API.get(`/tasks?projectId=${id}`),
      ]);
      setProject(projRes.data);
      setTasks(taskRes.data);
    } catch (e) {
      addToast("Failed to load project", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [id]);

  const isProjectAdmin = project?.admin?._id === currentUserId;

  const createTask = async () => {
    if (!taskForm.title.trim()) { addToast("Task title required", "error"); return; }
    try {
      setCreating(true);
      await API.post("/tasks", { ...taskForm, projectId: id });
      setTaskForm({ title: "", description: "", priority: "medium", dueDate: "", assignedTo: "" });
      setCreateOpen(false);
      await loadAll();
      addToast("Task created!", "success");
    } catch (e) {
      addToast(e?.response?.data?.message || "Failed to create task", "error");
    } finally { setCreating(false); }
  };

  const updateStatus = async (taskId, status) => {
    try {
      await API.put(`/tasks/${taskId}`, { status });
      setTasks((prev) => prev.map((t) => t._id === taskId ? { ...t, status } : t));
      addToast("Status updated", "success");
    } catch (e) {
      addToast(e?.response?.data?.message || "Failed to update", "error");
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await API.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      addToast("Task deleted", "info");
    } catch (e) {
      addToast(e?.response?.data?.message || "Failed to delete", "error");
    }
  };

  const inputStyle = { padding: "11px 14px" };
  const labelStyle = { display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#94a3b8", marginBottom: "7px" };

  return (
    <Layout>
      <div style={{ padding: "36px 40px", minHeight: "100vh" }}>
        {/* Back + Header */}
        <div className="animate-fadeInUp" style={{ marginBottom: "28px" }}>
          <button
            onClick={() => navigate("/projects")}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              background: "none", border: "none", cursor: "pointer",
              color: "#64748b", fontSize: "0.82rem", padding: "0 0 16px 0", transition: "color 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#818cf8"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#64748b"; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back to Projects
          </button>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              {loading ? (
                <div className="skeleton" style={{ height: "36px", width: "220px", borderRadius: "8px" }} />
              ) : (
                <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#f8fafc", marginBottom: "4px" }}>
                  {project?.name}
                </h1>
              )}
              <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
                {tasks.length} task{tasks.length !== 1 ? "s" : ""} · Kanban Board
              </p>
            </div>
            {isProjectAdmin && (
              <button
                onClick={() => setCreateOpen(true)}
                className="btn-primary"
                style={{ padding: "11px 22px", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "8px" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add Task
              </button>
            )}
          </div>
        </div>

        {/* Kanban Board */}
        <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", overflowX: "auto", paddingBottom: "20px" }}>
          {COLUMNS.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.key);
            return (
              <div key={col.key} style={{
                flex: "1 1 300px", minWidth: "280px", maxWidth: "380px",
                background: "rgba(15,23,42,0.6)",
                border: `1px solid rgba(148,163,184,0.08)`,
                borderTop: `3px solid ${col.color}`,
                borderRadius: "16px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}>
                {/* Column header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: col.color, boxShadow: `0 0 8px ${col.color}` }} />
                    <span style={{ fontWeight: 700, fontSize: "0.875rem", color: "#e2e8f0" }}>{col.label}</span>
                  </div>
                  <span style={{
                    padding: "2px 9px", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 700,
                    background: `${col.color}18`, color: col.color, border: `1px solid ${col.color}40`,
                  }}>{colTasks.length}</span>
                </div>

                {/* Tasks */}
                {loading ? (
                  [1,2].map((i) => (
                    <div key={i} className="skeleton" style={{ height: "100px", borderRadius: "14px" }} />
                  ))
                ) : colTasks.length === 0 ? (
                  <div style={{
                    textAlign: "center", padding: "24px 12px",
                    border: "1px dashed rgba(148,163,184,0.12)",
                    borderRadius: "12px", color: "#334155", fontSize: "0.8rem",
                  }}>
                    No tasks
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onStatusChange={updateStatus}
                      onDelete={deleteTask}
                      isAdmin={isProjectAdmin}
                    />
                  ))
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Task Modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create New Task" maxWidth="560px">
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={labelStyle}>TASK TITLE *</label>
            <input
              type="text"
              placeholder="What needs to be done?"
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              className="input-field"
              style={inputStyle}
              autoFocus
            />
          </div>
          <div>
            <label style={labelStyle}>DESCRIPTION</label>
            <textarea
              placeholder="Add more details..."
              value={taskForm.description}
              onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
              className="input-field"
              style={{ ...inputStyle, resize: "vertical", minHeight: "72px" }}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={labelStyle}>PRIORITY</label>
              <select
                value={taskForm.priority}
                onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                className="input-field"
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>DUE DATE</label>
              <input
                type="date"
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                className="input-field"
                style={inputStyle}
              />
            </div>
          </div>
          {project?.members?.length > 0 && (
            <div>
              <label style={labelStyle}>ASSIGN TO</label>
              <select
                value={taskForm.assignedTo}
                onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                className="input-field"
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                <option value="">— Unassigned —</option>
                {project.members.map((u) => (
                  <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                ))}
              </select>
            </div>
          )}
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "4px" }}>
            <button onClick={() => setCreateOpen(false)} className="btn-secondary" style={{ padding: "10px 20px", fontSize: "0.875rem" }}>Cancel</button>
            <button
              onClick={createTask}
              disabled={creating}
              className="btn-primary"
              style={{ padding: "10px 22px", fontSize: "0.875rem" }}
            >
              {creating ? <span className="spinner" /> : "Create Task"}
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
