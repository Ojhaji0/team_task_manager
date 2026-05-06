import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout, getRole } from "../utils/auth";

const navItems = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    to: "/projects",
    label: "Projects",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    to: "/tasks",
    label: "My Tasks",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
];

export default function Sidebar({ collapsed, onToggle }) {
  const navigate = useNavigate();
  const role = getRole();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside
      style={{
        width: collapsed ? "72px" : "240px",
        minHeight: "100vh",
        background: "rgba(7,9,18,0.97)",
        borderRight: "1px solid rgba(148,163,184,0.08)",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0, left: 0, bottom: 0,
        zIndex: 40,
        transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
        overflow: "hidden",
      }}
    >
      {/* Logo */}
      <div style={{
        padding: collapsed ? "20px 0" : "24px 20px",
        borderBottom: "1px solid rgba(148,163,184,0.08)",
        display: "flex", alignItems: "center",
        justifyContent: collapsed ? "center" : "space-between",
        minHeight: "72px",
      }}>
        {!collapsed && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "9px",
              background: "linear-gradient(135deg, #6366f1, #22d3ee)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M9 11l3 3L22 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "#f8fafc", whiteSpace: "nowrap" }}>
              TaskFlow
            </span>
          </div>
        )}
        {collapsed && (
          <div style={{
            width: "32px", height: "32px", borderRadius: "9px",
            background: "linear-gradient(135deg, #6366f1, #22d3ee)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 11l3 3L22 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        )}
        {!collapsed && (
          <button
            onClick={onToggle}
            style={{
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "7px", width: "28px", height: "28px",
              cursor: "pointer", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s", flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}
        {collapsed && (
          <button
            onClick={onToggle}
            style={{
              position: "absolute", top: "22px", right: "-10px",
              background: "#1e293b", border: "1px solid rgba(148,163,184,0.15)",
              borderRadius: "50%", width: "22px", height: "22px",
              cursor: "pointer", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: "4px" }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            title={collapsed ? item.label : undefined}
            style={({ isActive }) => ({
              display: "flex", alignItems: "center",
              gap: "12px",
              padding: collapsed ? "11px 0" : "11px 12px",
              justifyContent: collapsed ? "center" : "flex-start",
              borderRadius: "10px",
              color: isActive ? "#818cf8" : "#64748b",
              textDecoration: "none",
              fontWeight: 500,
              fontSize: "0.875rem",
              background: isActive ? "rgba(99,102,241,0.14)" : "transparent",
              border: isActive ? "1px solid rgba(99,102,241,0.2)" : "1px solid transparent",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
              overflow: "hidden",
            })}
            onMouseEnter={(e) => {
              if (!e.currentTarget.style.background.includes("0.14")) {
                e.currentTarget.style.background = "rgba(99,102,241,0.07)";
                e.currentTarget.style.color = "#f8fafc";
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.style.background.includes("0.14")) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#64748b";
              }
            }}
          >
            <span style={{ flexShrink: 0 }}>{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer: role + logout */}
      <div style={{
        padding: collapsed ? "16px 10px" : "16px 14px",
        borderTop: "1px solid rgba(148,163,184,0.08)",
        display: "flex", flexDirection: "column", gap: "8px",
      }}>
        {/* Role badge */}
        {!collapsed && (
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "10px 10px", borderRadius: "10px",
            background: "rgba(15,23,42,0.8)",
            border: "1px solid rgba(148,163,184,0.08)",
            marginBottom: "4px",
          }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%",
              background: role === "admin"
                ? "linear-gradient(135deg,#6366f1,#818cf8)"
                : "linear-gradient(135deg,#0f766e,#22d3ee)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.75rem", fontWeight: 700, color: "white",
              flexShrink: 0,
            }}>
              {role?.[0]?.toUpperCase() || "U"}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: "0.75rem", color: "#f8fafc", fontWeight: 600, textTransform: "capitalize" }}>
                {role || "User"}
              </div>
              <div style={{ fontSize: "0.7rem", color: "#475569" }}>
                {role === "admin" ? "Full access" : "Limited access"}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
          style={{
            display: "flex", alignItems: "center", gap: "10px",
            justifyContent: collapsed ? "center" : "flex-start",
            padding: collapsed ? "10px 0" : "10px 12px",
            borderRadius: "10px",
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.15)",
            color: "#ef4444",
            cursor: "pointer",
            fontWeight: 500,
            fontSize: "0.875rem",
            transition: "all 0.2s",
            width: "100%",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.18)";
            e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.08)";
            e.currentTarget.style.borderColor = "rgba(239,68,68,0.15)";
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
