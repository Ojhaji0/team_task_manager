import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { useToast } from "../components/Toast";

function PasswordStrength({ password }) {
  const checks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /\d/.test(password) },
  ];
  const score = checks.filter((c) => c.pass).length;
  const colors = ["#ef4444", "#f59e0b", "#10b981"];
  const labels = ["Weak", "Fair", "Strong"];
  if (!password) return null;
  return (
    <div style={{ marginTop: "8px" }}>
      <div style={{ display: "flex", gap: "4px", marginBottom: "6px" }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            flex: 1, height: "3px", borderRadius: "999px",
            background: i < score ? colors[score - 1] : "rgba(148,163,184,0.15)",
            transition: "background 0.3s",
          }} />
        ))}
      </div>
      <div style={{ display: "flex", gap: "12px" }}>
        {checks.map((c) => (
          <span key={c.label} style={{ fontSize: "0.68rem", color: c.pass ? "#34d399" : "#475569", display: "flex", alignItems: "center", gap: "3px" }}>
            {c.pass ? "✓" : "·"} {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", role: "member" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e?.preventDefault();
    if (!form.name || !form.email || !form.password) {
      addToast("All fields are required", "error"); return;
    }
    if (form.password !== form.confirm) {
      addToast("Passwords do not match", "error"); return;
    }
    if (form.password.length < 6) {
      addToast("Password must be at least 6 characters", "error"); return;
    }
    try {
      setLoading(true);
      await API.post("/auth/register", { name: form.name, email: form.email, password: form.password, role: form.role });
      addToast("Account created! Please sign in.", "success");
      setTimeout(() => navigate("/"), 700);
    } catch (error) {
      addToast(error?.response?.data?.message || "Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    paddingLeft: "42px", paddingRight: "14px", paddingTop: "12px", paddingBottom: "12px",
  };

  const labelStyle = {
    display: "block", fontSize: "0.8rem", fontWeight: 600,
    color: "#94a3b8", marginBottom: "8px", letterSpacing: "0.04em",
  };

  return (
    <div style={{
      minHeight: "100vh", background: "var(--bg-base)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px", position: "relative", overflow: "hidden",
    }}>
      <div className="mesh-bg" />
      <div style={{
        position: "absolute", top: "5%", right: "8%",
        width: "300px", height: "300px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "8%", left: "5%",
        width: "260px", height: "260px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(34,211,238,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div
        className="animate-scaleIn"
        style={{
          width: "100%", maxWidth: "440px",
          background: "rgba(15,23,42,0.85)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(99,102,241,0.2)",
          borderRadius: "24px",
          padding: "40px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)",
          position: "relative", zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "28px" }}>
          <div style={{
            width: "52px", height: "52px", borderRadius: "16px",
            background: "linear-gradient(135deg, #6366f1, #22d3ee)",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: "14px",
            boxShadow: "0 8px 28px rgba(99,102,241,0.4)",
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="9" cy="7" r="4" stroke="white" strokeWidth="2"/>
              <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#f8fafc", textAlign: "center", marginBottom: "6px" }}>
            Create account
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.875rem", textAlign: "center" }}>
            Join TaskFlow and manage your team
          </p>
        </div>

        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Name */}
          <div>
            <label style={labelStyle}>FULL NAME</label>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#475569", pointerEvents: "none" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <input
                id="reg-name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                className="input-field"
                style={inputStyle}
                autoComplete="name"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label style={labelStyle}>EMAIL ADDRESS</label>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#475569", pointerEvents: "none" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <input
                id="reg-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="input-field"
                style={inputStyle}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={labelStyle}>PASSWORD</label>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#475569", pointerEvents: "none" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
              </div>
              <input
                id="reg-password"
                name="password"
                type={showPass ? "text" : "password"}
                placeholder="Create a strong password"
                value={form.password}
                onChange={handleChange}
                className="input-field"
                style={{ ...inputStyle, paddingRight: "42px" }}
                autoComplete="new-password"
              />
              <button type="button" onClick={() => setShowPass((v) => !v)}
                style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#475569", padding: 0 }}>
                {showPass
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
            <PasswordStrength password={form.password} />
          </div>

          {/* Confirm Password */}
          <div>
            <label style={labelStyle}>CONFIRM PASSWORD</label>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#475569", pointerEvents: "none" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <input
                id="reg-confirm"
                name="confirm"
                type="password"
                placeholder="Repeat your password"
                value={form.confirm}
                onChange={handleChange}
                className="input-field"
                style={{
                  ...inputStyle,
                  borderColor: form.confirm && form.confirm !== form.password ? "rgba(239,68,68,0.5)" : undefined,
                }}
                autoComplete="new-password"
              />
            </div>
            {form.confirm && form.confirm !== form.password && (
              <p style={{ marginTop: "6px", fontSize: "0.75rem", color: "#f87171" }}>Passwords don't match</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label style={labelStyle}>ROLE</label>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#475569", pointerEvents: "none" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="input-field"
                style={{ ...inputStyle, cursor: "pointer", appearance: "none" }}
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
              <div style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", color: "#475569", pointerEvents: "none" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
            </div>
          </div>

          <button
            id="register-submit"
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ padding: "13px", fontSize: "0.95rem", marginTop: "6px" }}
          >
            {loading
              ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <span className="spinner" /> Creating account...
                </span>
              : "Create Account"
            }
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(148,163,184,0.1)" }} />
          <span style={{ fontSize: "0.75rem", color: "#475569" }}>OR</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(148,163,184,0.1)" }} />
        </div>

        <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#64748b" }}>
          Already have an account?{" "}
          <button
            onClick={() => navigate("/")}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#818cf8", fontWeight: 600, fontSize: "inherit" }}
            onMouseEnter={(e) => (e.target.style.color = "#a5b4fc")}
            onMouseLeave={(e) => (e.target.style.color = "#818cf8")}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}