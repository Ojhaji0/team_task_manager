import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import { useToast } from "../components/Toast";
import { getUserId, isAdmin } from "../utils/auth";

function ProjectCard({ project, onSelect, onDelete, isAdmin, onAddMember, onRemoveMember }) {
  const currentUserId = getUserId();
  const isProjectAdmin = project.admin?._id === currentUserId;

  const memberCount = project.members?.length || 0;
  const colors = ["#6366f1","#22d3ee","#10b981","#f59e0b","#a855f7","#ef4444"];
  const color = colors[(project.name.charCodeAt(0) || 0) % colors.length];

  return (
    <div
      style={{
        background: "rgba(15,23,42,0.8)",
        border: "1px solid rgba(148,163,184,0.1)",
        borderRadius: "20px",
        overflow: "hidden",
        transition: "all 0.3s",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(99,102,241,0.2)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Card header band */}
      <div style={{
        height: "6px",
        background: `linear-gradient(90deg, ${color}, ${color}80)`,
      }} />

      <div style={{ padding: "20px", flex: 1 }}>
        {/* Title */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "10px" }}>
          <div>
            <h3 style={{ fontWeight: 700, fontSize: "1.1rem", color: "#f8fafc", marginBottom: "4px" }}>
              {project.name}
            </h3>
            {project.description && (
              <p style={{ fontSize: "0.8rem", color: "#64748b", lineHeight: 1.4 }}>
                {project.description.length > 60 ? project.description.slice(0, 60) + "…" : project.description}
              </p>
            )}
          </div>
          {isProjectAdmin && (
            <span style={{
              padding: "3px 10px", borderRadius: "999px", fontSize: "0.68rem",
              fontWeight: 700, letterSpacing: "0.05em",
              background: "rgba(99,102,241,0.15)", color: "#818cf8",
              border: "1px solid rgba(99,102,241,0.25)", whiteSpace: "nowrap",
            }}>Admin</span>
          )}
        </div>

        {/* Member avatars */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px" }}>
          <div style={{ display: "flex" }}>
            {(project.members || []).slice(0, 5).map((m, i) => (
              <div key={m._id} style={{
                width: "28px", height: "28px", borderRadius: "50%",
                background: `linear-gradient(135deg, ${colors[i % colors.length]}, ${colors[(i + 2) % colors.length]})`,
                border: "2px solid rgba(15,23,42,0.9)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.65rem", fontWeight: 700, color: "white",
                marginLeft: i > 0 ? "-8px" : "0",
                zIndex: 10 - i,
                position: "relative",
              }} title={m.name}>
                {m.name?.[0]?.toUpperCase()}
              </div>
            ))}
            {memberCount > 5 && (
              <div style={{
                width: "28px", height: "28px", borderRadius: "50%",
                background: "rgba(30,41,59,0.9)",
                border: "2px solid rgba(15,23,42,0.9)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.62rem", fontWeight: 700, color: "#64748b",
                marginLeft: "-8px", zIndex: 4, position: "relative",
              }}>
                +{memberCount - 5}
              </div>
            )}
          </div>
          <span style={{ fontSize: "0.78rem", color: "#64748b", marginLeft: "4px" }}>
            {memberCount} member{memberCount !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button
            onClick={() => onSelect(project._id)}
            style={{
              flex: 1, padding: "9px 14px", borderRadius: "10px",
              background: "linear-gradient(135deg,#6366f1,#4f46e5)",
              border: "none", color: "white", fontSize: "0.82rem", fontWeight: 600,
              cursor: "pointer", transition: "all 0.2s",
              boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(99,102,241,0.5)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(99,102,241,0.35)"; }}
          >
            Open Project →
          </button>

          {isProjectAdmin && (
            <>
              <button
                onClick={() => onAddMember(project)}
                style={{
                  padding: "9px 12px", borderRadius: "10px",
                  background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)",
                  color: "#10b981", fontSize: "0.82rem", cursor: "pointer", transition: "all 0.2s",
                }}
                title="Add member"
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(16,185,129,0.2)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(16,185,129,0.1)"; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
                </svg>
              </button>
              <button
                onClick={() => onDelete(project._id)}
                style={{
                  padding: "9px 12px", borderRadius: "10px",
                  background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                  color: "#f87171", fontSize: "0.82rem", cursor: "pointer", transition: "all 0.2s",
                }}
                title="Delete project"
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.18)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M9 6V4h6v2"/>
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Members list (admin only) */}
        {isProjectAdmin && project.members?.length > 0 && (
          <div style={{ marginTop: "14px", borderTop: "1px solid rgba(148,163,184,0.08)", paddingTop: "14px" }}>
            <p style={{ fontSize: "0.72rem", color: "#475569", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Team</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {project.members.map((m) => (
                <div key={m._id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "6px 10px", borderRadius: "8px",
                  background: "rgba(30,41,59,0.4)", fontSize: "0.8rem",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{
                      width: "24px", height: "24px", borderRadius: "50%",
                      background: "linear-gradient(135deg,#6366f1,#22d3ee)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.62rem", fontWeight: 700, color: "white",
                    }}>{m.name?.[0]?.toUpperCase()}</div>
                    <span style={{ color: "#cbd5e1" }}>{m.name}</span>
                    {m._id === project.admin?._id && (
                      <span style={{ fontSize: "0.65rem", color: "#818cf8", background: "rgba(99,102,241,0.15)", padding: "1px 6px", borderRadius: "4px" }}>admin</span>
                    )}
                  </div>
                  {m._id !== project.admin?._id && (
                    <button
                      onClick={() => onRemoveMember(project._id, m._id)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", padding: "2px", transition: "color 0.2s" }}
                      title="Remove member"
                      onMouseEnter={(e) => { e.currentTarget.style.color = "#f87171"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "#475569"; }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Projects() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create modal
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", description: "" });
  const [creating, setCreating] = useState(false);

  // Add member modal
  const [memberModal, setMemberModal] = useState({ open: false, project: null });
  const [memberEmail, setMemberEmail] = useState("");
  const [adding, setAdding] = useState(false);

  const loadProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (e) {
      addToast("Failed to load projects", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProjects(); }, []);

  const createProject = async () => {
    if (!createForm.name.trim()) { addToast("Project name is required", "error"); return; }
    try {
      setCreating(true);
      await API.post("/projects", createForm);
      setCreateForm({ name: "", description: "" });
      setCreateOpen(false);
      await loadProjects();
      addToast("Project created!", "success");
    } catch (e) {
      addToast(e?.response?.data?.message || "Failed to create project", "error");
    } finally { setCreating(false); }
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project? This cannot be undone.")) return;
    try {
      await API.delete(`/projects/${id}`);
      await loadProjects();
      addToast("Project deleted", "info");
    } catch (e) {
      addToast(e?.response?.data?.message || "Failed to delete", "error");
    }
  };

  const addMember = async () => {
    if (!memberEmail.trim()) { addToast("Enter an email", "error"); return; }
    try {
      setAdding(true);
      await API.post(`/projects/${memberModal.project._id}/members`, { email: memberEmail });
      setMemberEmail("");
      setMemberModal({ open: false, project: null });
      await loadProjects();
      addToast("Member added!", "success");
    } catch (e) {
      addToast(e?.response?.data?.message || "Failed to add member", "error");
    } finally { setAdding(false); }
  };

  const removeMember = async (projectId, userId) => {
    try {
      await API.delete(`/projects/${projectId}/members/${userId}`);
      await loadProjects();
      addToast("Member removed", "info");
    } catch (e) {
      addToast(e?.response?.data?.message || "Failed to remove member", "error");
    }
  };

  const selectProject = (id) => {
    localStorage.setItem("projectId", id);
    navigate(`/projects/${id}`);
  };

  const admin = isAdmin();

  return (
    <Layout>
      <div style={{ padding: "36px 40px" }}>
        {/* Header */}
        <div className="animate-fadeInUp" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "36px" }}>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#f8fafc", marginBottom: "6px" }}>
              Projects
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
              {projects.length} project{projects.length !== 1 ? "s" : ""} · Manage your team workspaces
            </p>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="btn-primary"
            style={{ padding: "11px 22px", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "8px" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Project
          </button>
        </div>

        {/* Project Grid */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
            {[1,2,3].map((i) => (
              <div key={i} style={{ borderRadius: "20px", overflow: "hidden" }}>
                <div className="skeleton" style={{ height: "6px" }} />
                <div style={{ padding: "20px", background: "rgba(15,23,42,0.5)", border: "1px solid rgba(148,163,184,0.06)", borderTop: "none", borderRadius: "0 0 20px 20px" }}>
                  <div className="skeleton" style={{ height: "22px", width: "60%", borderRadius: "6px", marginBottom: "12px" }} />
                  <div className="skeleton" style={{ height: "14px", width: "80%", borderRadius: "4px", marginBottom: "20px" }} />
                  <div className="skeleton" style={{ height: "38px", borderRadius: "10px" }} />
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{
              width: "80px", height: "80px", borderRadius: "24px",
              background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
            }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round">
                <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
              </svg>
            </div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#94a3b8", marginBottom: "8px" }}>No projects yet</h3>
            <p style={{ color: "#475569", fontSize: "0.875rem", marginBottom: "20px" }}>
              Create your first project to get started, or wait to be added to one.
            </p>
            <button onClick={() => setCreateOpen(true)} className="btn-primary" style={{ padding: "11px 22px", fontSize: "0.875rem" }}>
              Create Project
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
            {projects.map((project, i) => (
              <div key={project._id} className="animate-fadeInUp" style={{ animationDelay: `${i * 60}ms` }}>
                <ProjectCard
                  project={project}
                  onSelect={selectProject}
                  onDelete={deleteProject}
                  isAdmin={admin}
                  onAddMember={(p) => { setMemberModal({ open: true, project: p }); setMemberEmail(""); }}
                  onRemoveMember={removeMember}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create New Project">
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "8px" }}>PROJECT NAME *</label>
            <input
              id="project-name-input"
              type="text"
              placeholder="e.g. Website Redesign"
              value={createForm.name}
              onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && createProject()}
              className="input-field"
              style={{ padding: "12px 14px" }}
              autoFocus
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "8px" }}>DESCRIPTION</label>
            <textarea
              placeholder="What is this project about?"
              value={createForm.description}
              onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
              className="input-field"
              style={{ padding: "12px 14px", resize: "vertical", minHeight: "80px" }}
            />
          </div>
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "4px" }}>
            <button
              onClick={() => setCreateOpen(false)}
              className="btn-secondary"
              style={{ padding: "10px 20px", fontSize: "0.875rem" }}
            >Cancel</button>
            <button
              id="create-project-btn"
              onClick={createProject}
              disabled={creating}
              className="btn-primary"
              style={{ padding: "10px 22px", fontSize: "0.875rem" }}
            >
              {creating ? <span className="spinner" /> : "Create Project"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Add Member Modal */}
      <Modal
        open={memberModal.open}
        onClose={() => setMemberModal({ open: false, project: null })}
        title={`Add Member — ${memberModal.project?.name || ""}`}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
            Enter the email address of the user you want to add to this project.
          </p>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "8px" }}>EMAIL ADDRESS</label>
            <input
              type="email"
              placeholder="member@example.com"
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addMember()}
              className="input-field"
              style={{ padding: "12px 14px" }}
              autoFocus
            />
          </div>
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button
              onClick={() => setMemberModal({ open: false, project: null })}
              className="btn-secondary"
              style={{ padding: "10px 20px", fontSize: "0.875rem" }}
            >Cancel</button>
            <button
              onClick={addMember}
              disabled={adding}
              className="btn-primary"
              style={{ padding: "10px 22px", fontSize: "0.875rem", background: "linear-gradient(135deg,#10b981,#0f766e)" }}
            >
              {adding ? <span className="spinner" /> : "Add Member"}
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}