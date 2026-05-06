export default function TaskCard({ task, onStatusChange, onDelete, isAdmin }) {
  const priorityStyle = {
    high:   { bg: "rgba(239,68,68,0.12)",  color: "#f87171", border: "rgba(239,68,68,0.25)"  },
    medium: { bg: "rgba(245,158,11,0.12)", color: "#fbbf24", border: "rgba(245,158,11,0.25)" },
    low:    { bg: "rgba(16,185,129,0.12)", color: "#34d399", border: "rgba(16,185,129,0.25)" },
  };
  const statusStyle = {
    "todo":        { bg: "rgba(100,116,139,0.12)", color: "#94a3b8", border: "rgba(100,116,139,0.25)" },
    "in-progress": { bg: "rgba(99,102,241,0.12)",  color: "#818cf8", border: "rgba(99,102,241,0.25)"  },
    "done":        { bg: "rgba(16,185,129,0.12)",  color: "#34d399", border: "rgba(16,185,129,0.25)"  },
  };

  const p = priorityStyle[task.priority] || priorityStyle.low;
  const s = statusStyle[task.status] || statusStyle.todo;

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done";

  const statusOptions = ["todo", "in-progress", "done"];
  const nextStatus = statusOptions[(statusOptions.indexOf(task.status) + 1) % statusOptions.length];

  return (
    <div
      className="animate-fadeInUp"
      style={{
        background: "rgba(15,23,42,0.9)",
        border: `1px solid ${isOverdue ? "rgba(239,68,68,0.3)" : "rgba(148,163,184,0.1)"}`,
        borderRadius: "14px",
        padding: "16px",
        transition: "all 0.25s",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.borderColor = "rgba(99,102,241,0.35)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(99,102,241,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = isOverdue ? "rgba(239,68,68,0.3)" : "rgba(148,163,184,0.1)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Title row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", marginBottom: "10px" }}>
        <h4 style={{ fontWeight: 600, fontSize: "0.9rem", color: "#f8fafc", lineHeight: 1.4 }}>{task.title}</h4>
        <span style={{
          flexShrink: 0,
          padding: "2px 8px", borderRadius: "999px", fontSize: "0.68rem",
          fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase",
          background: p.bg, color: p.color, border: `1px solid ${p.border}`,
        }}>
          {task.priority}
        </span>
      </div>

      {/* Description */}
      {task.description && (
        <p style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "12px", lineHeight: 1.5 }}>
          {task.description.length > 80 ? task.description.slice(0, 80) + "…" : task.description}
        </p>
      )}

      {/* Meta row */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
        {/* Status */}
        <span style={{
          padding: "2px 8px", borderRadius: "999px", fontSize: "0.7rem",
          fontWeight: 600, background: s.bg, color: s.color, border: `1px solid ${s.border}`,
        }}>
          {task.status === "in-progress" ? "In Progress" : task.status === "todo" ? "To Do" : "Done"}
        </span>

        {/* Due date */}
        {task.dueDate && (
          <span style={{
            fontSize: "0.72rem", color: isOverdue ? "#f87171" : "#64748b",
            display: "flex", alignItems: "center", gap: "4px",
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            {isOverdue && " · Overdue"}
          </span>
        )}

        {/* Assignee */}
        {task.assignedTo && (
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{
              width: "22px", height: "22px", borderRadius: "50%",
              background: "linear-gradient(135deg,#6366f1,#22d3ee)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.6rem", fontWeight: 700, color: "white",
            }}>
              {task.assignedTo.name?.[0]?.toUpperCase() || "?"}
            </div>
            <span style={{ fontSize: "0.72rem", color: "#64748b" }}>{task.assignedTo.name}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {task.status !== "done" && (
          <button
            onClick={() => onStatusChange(task._id, nextStatus)}
            style={{
              flex: 1, padding: "6px 10px", borderRadius: "8px",
              background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)",
              color: "#818cf8", fontSize: "0.75rem", fontWeight: 600,
              cursor: "pointer", transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(99,102,241,0.22)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(99,102,241,0.12)"; }}
          >
            → {nextStatus === "in-progress" ? "Start" : "Complete"}
          </button>
        )}

        {isAdmin && (
          <button
            onClick={() => onDelete(task._id)}
            style={{
              padding: "6px 10px", borderRadius: "8px",
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
              color: "#f87171", fontSize: "0.75rem", fontWeight: 600,
              cursor: "pointer", transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.18)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
