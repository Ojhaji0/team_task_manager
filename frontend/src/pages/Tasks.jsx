import { useEffect, useState } from "react";
import API from "../api/api";
import Layout from "../components/Layout";
import TaskCard from "../components/TaskCard";
import { useToast } from "../components/Toast";
import { getUserId } from "../utils/auth";

const STATUSES = [
  { key: "todo",        label: "To Do",       color: "#64748b" },
  { key: "in-progress", label: "In Progress",  color: "#818cf8" },
  { key: "done",        label: "Done",         color: "#34d399" },
];

export default function Tasks() {
  const { addToast } = useToast();
  const currentUserId = getUserId();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const projectId = localStorage.getItem("projectId");

  const loadTasks = async () => {
    try {
      setLoading(true);
      if (projectId) {
        const res = await API.get(`/tasks?projectId=${projectId}`);
        setTasks(res.data);
      } else {
        setTasks([]);
      }
    } catch (e) {
      addToast("Failed to load tasks", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTasks(); }, []);

  const updateStatus = async (taskId, status) => {
    try {
      await API.put(`/tasks/${taskId}`, { status });
      setTasks((prev) => prev.map((t) => t._id === taskId ? { ...t, status } : t));
      addToast("Status updated", "success");
    } catch (e) {
      addToast(e?.response?.data?.message || "Update failed", "error");
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

  const filtered = filter === "all" ? tasks : tasks.filter((t) => t.status === filter);
  const isProjectAdmin = tasks.length > 0 && tasks[0].projectId?.admin === currentUserId;

  return (
    <Layout>
      <div style={{ padding: "36px 40px" }}>
        {/* Header */}
        <div className="animate-fadeInUp" style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#f8fafc", marginBottom: "6px" }}>
            {isProjectAdmin ? "All Tasks" : "My Tasks"}
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
            {projectId ? `${tasks.length} task${tasks.length !== 1 ? "s" : ""} in this project` : "No project selected"}
          </p>
        </div>

        {!projectId ? (
          // No project selected state
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{
              width: "80px", height: "80px", borderRadius: "24px",
              background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
            }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round">
                <polyline points="9 11 12 14 22 4"/>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
              </svg>
            </div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#94a3b8", marginBottom: "8px" }}>No project selected</h3>
            <p style={{ color: "#475569", fontSize: "0.875rem" }}>
              Go to <strong style={{ color: "#818cf8" }}>Projects</strong>, open a project, and its tasks will appear here.
            </p>
          </div>
        ) : (
          <>
            {/* Filter tabs */}
            <div
              className="animate-fadeInUp"
              style={{
                display: "flex", gap: "6px", marginBottom: "28px",
                background: "rgba(15,23,42,0.7)",
                border: "1px solid rgba(148,163,184,0.1)",
                borderRadius: "12px", padding: "6px",
                width: "fit-content",
              }}
            >
              {[{ key: "all", label: "All" }, ...STATUSES].map((s) => (
                <button
                  key={s.key}
                  onClick={() => setFilter(s.key)}
                  style={{
                    padding: "8px 18px", borderRadius: "8px",
                    border: "none", cursor: "pointer",
                    fontSize: "0.82rem", fontWeight: 600,
                    transition: "all 0.2s",
                    background: filter === s.key ? "rgba(99,102,241,0.2)" : "transparent",
                    color: filter === s.key ? "#818cf8" : "#64748b",
                    boxShadow: filter === s.key ? "inset 0 0 0 1px rgba(99,102,241,0.3)" : "none",
                  }}
                >
                  {s.label}
                  {s.key !== "all" && (
                    <span style={{
                      marginLeft: "6px", fontSize: "0.7rem", fontWeight: 700,
                      padding: "1px 6px", borderRadius: "999px",
                      background: filter === s.key ? "rgba(99,102,241,0.2)" : "rgba(100,116,139,0.15)",
                      color: filter === s.key ? "#818cf8" : "#475569",
                    }}>
                      {tasks.filter((t) => t.status === s.key).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Task Grid */}
            {loading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "14px" }}>
                {[1,2,3,4,5,6].map((i) => (
                  <div key={i} className="skeleton" style={{ height: "140px", borderRadius: "14px" }} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#475569" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>✅</div>
                <p style={{ fontSize: "0.95rem", fontWeight: 600, color: "#64748b" }}>
                  {filter === "all" ? "No tasks in this project yet" : `No tasks with status "${filter}"`}
                </p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "14px" }}>
                {filtered.map((task, i) => (
                  <div key={task._id} className="animate-fadeInUp" style={{ animationDelay: `${i * 40}ms` }}>
                    <TaskCard
                      task={task}
                      onStatusChange={updateStatus}
                      onDelete={deleteTask}
                      isAdmin={isProjectAdmin}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}