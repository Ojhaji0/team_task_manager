import { useEffect, useState } from "react";
import API from "../api/api";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";

const icons = {
  total: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
  done:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  prog:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>,
  todo:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  over:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
};

function SkeletonCard() {
  return (
    <div style={{ background: "rgba(30,41,59,0.5)", borderRadius: "16px", padding: "24px", border: "1px solid rgba(148,163,184,0.06)" }}>
      <div className="skeleton" style={{ width: "44px", height: "44px", borderRadius: "12px", marginBottom: "16px" }} />
      <div className="skeleton" style={{ width: "60px", height: "36px", borderRadius: "8px", marginBottom: "8px" }} />
      <div className="skeleton" style={{ width: "80px", height: "14px", borderRadius: "4px" }} />
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/dashboard")
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const userName = localStorage.getItem("role");
  const greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 17 ? "Good afternoon" : "Good evening";

  const priorityBreakdown = stats?.priorityBreakdown || {};
  const totalForPriority = (priorityBreakdown.high || 0) + (priorityBreakdown.medium || 0) + (priorityBreakdown.low || 0);

  const tasksPerUser = stats?.tasksPerUser || {};

  return (
    <Layout>
      <div style={{ padding: "36px 40px", maxWidth: "1200px" }}>
        {/* Header */}
        <div className="animate-fadeInUp" style={{ marginBottom: "36px" }}>
          <p style={{ fontSize: "0.8rem", color: "#475569", fontWeight: 500, marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {greeting}
          </p>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#f8fafc", marginBottom: "6px" }}>
            Dashboard{" "}
            <span style={{
              background: "linear-gradient(135deg,#818cf8,#22d3ee)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Overview</span>
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
            Track your team's progress and task distribution at a glance.
          </p>
        </div>

        {/* Stat Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px", marginBottom: "36px" }}>
          {loading ? (
            [0,1,2,3,4].map((i) => <SkeletonCard key={i} />)
          ) : (
            <>
              <StatCard label="Total Tasks"  value={stats?.totalTasks || 0}       icon={icons.total} color="indigo" delay={0} />
              <StatCard label="Completed"    value={stats?.completedTasks || 0}    icon={icons.done}  color="green"  delay={60} />
              <StatCard label="In Progress"  value={stats?.inProgressTasks || 0}   icon={icons.prog}  color="purple" delay={120} />
              <StatCard label="To Do"        value={stats?.todoTasks || 0}          icon={icons.todo}  color="cyan"   delay={180} />
              <StatCard label="Overdue"      value={stats?.overdueTasks || 0}       icon={icons.over}  color="red"    delay={240} />
            </>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
          {/* Priority Breakdown */}
          <div
            className="animate-fadeInUp"
            style={{
              animationDelay: "300ms",
              background: "rgba(15,23,42,0.7)",
              border: "1px solid rgba(148,163,184,0.1)",
              borderRadius: "20px",
              padding: "24px",
            }}
          >
            <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#f8fafc", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#22d3ee)", display: "inline-block" }} />
              Priority Breakdown
            </h2>
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {[1,2,3].map((i) => <div key={i} className="skeleton" style={{ height: "40px", borderRadius: "8px" }} />)}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  { label: "High", count: priorityBreakdown.high || 0, color: "#f87171", bg: "rgba(239,68,68,0.15)" },
                  { label: "Medium", count: priorityBreakdown.medium || 0, color: "#fbbf24", bg: "rgba(245,158,11,0.15)" },
                  { label: "Low", count: priorityBreakdown.low || 0, color: "#34d399", bg: "rgba(16,185,129,0.15)" },
                ].map((p) => (
                  <div key={p.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontSize: "0.8rem", color: p.color, fontWeight: 600 }}>{p.label}</span>
                      <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{p.count} tasks</span>
                    </div>
                    <div style={{ background: "rgba(30,41,59,0.8)", borderRadius: "999px", height: "6px", overflow: "hidden" }}>
                      <div style={{
                        width: totalForPriority ? `${(p.count / totalForPriority) * 100}%` : "0%",
                        height: "100%", background: p.color,
                        borderRadius: "999px",
                        transition: "width 1s ease",
                        boxShadow: `0 0 8px ${p.color}60`,
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tasks Per User */}
          <div
            className="animate-fadeInUp"
            style={{
              animationDelay: "360ms",
              background: "rgba(15,23,42,0.7)",
              border: "1px solid rgba(148,163,184,0.1)",
              borderRadius: "20px",
              padding: "24px",
            }}
          >
            <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#f8fafc", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "linear-gradient(135deg,#22d3ee,#6366f1)", display: "inline-block" }} />
              Tasks Per Member
            </h2>
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[1,2,3].map((i) => <div key={i} className="skeleton" style={{ height: "48px", borderRadius: "10px" }} />)}
              </div>
            ) : Object.keys(tasksPerUser).length === 0 ? (
              <div style={{ textAlign: "center", color: "#475569", padding: "24px 0" }}>
                <div style={{ fontSize: "2rem", marginBottom: "8px" }}>👥</div>
                <p style={{ fontSize: "0.85rem" }}>No assigned tasks yet</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {Object.entries(tasksPerUser).map(([user, count]) => {
                  const initials = user.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
                  const maxCount = Math.max(...Object.values(tasksPerUser));
                  return (
                    <div key={user} style={{
                      display: "flex", alignItems: "center", gap: "12px",
                      padding: "10px 14px", borderRadius: "10px",
                      background: "rgba(30,41,59,0.5)",
                      border: "1px solid rgba(148,163,184,0.06)",
                    }}>
                      <div style={{
                        width: "34px", height: "34px", borderRadius: "50%", flexShrink: 0,
                        background: "linear-gradient(135deg,#6366f1,#22d3ee)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.72rem", fontWeight: 700, color: "white",
                      }}>{initials}</div>
                      <div style={{ flex: 1, overflow: "hidden" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#e2e8f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user}</span>
                          <span style={{ fontSize: "0.78rem", color: "#818cf8", fontWeight: 700, marginLeft: "8px", flexShrink: 0 }}>{count}</span>
                        </div>
                        <div style={{ background: "rgba(15,23,42,0.8)", borderRadius: "999px", height: "4px", overflow: "hidden" }}>
                          <div style={{
                            width: `${(count / maxCount) * 100}%`,
                            height: "100%", borderRadius: "999px",
                            background: "linear-gradient(90deg,#6366f1,#22d3ee)",
                            transition: "width 1s ease",
                          }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Overdue Tasks List */}
        {!loading && stats?.overdueList && stats.overdueList.length > 0 && (
          <div
            className="animate-fadeInUp"
            style={{
              animationDelay: "420ms",
              background: "rgba(239,68,68,0.05)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: "20px",
              padding: "24px",
            }}
          >
            <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#f87171", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              Overdue Tasks ({stats.overdueList.length})
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "12px" }}>
              {stats.overdueList.slice(0, 6).map((task) => (
                <div key={task._id} style={{
                  background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: "12px", padding: "14px",
                }}>
                  <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "#fca5a5", marginBottom: "6px" }}>{task.title}</div>
                  <div style={{ display: "flex", gap: "8px", fontSize: "0.75rem", color: "#94a3b8" }}>
                    <span>Due: {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    {task.assignedTo && <span>· {task.assignedTo.name}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}