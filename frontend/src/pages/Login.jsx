import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { setAuth } from "../utils/auth";
import { useToast } from "../components/Toast";

export default function Login() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!form.email || !form.password) {
      addToast("Please fill in all fields", "error");
      return;
    }
    try {
      setLoading(true);
      const res = await API.post("/auth/login", form);
      setAuth(res.data.token, res.data._id, res.data.role);
      addToast("Welcome back! 👋", "success");
      setTimeout(() => navigate("/dashboard"), 400);
    } catch (error) {
      addToast(error?.response?.data?.message || "Invalid credentials", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-base)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Mesh background */}
      <div className="mesh-bg" />

      {/* Decorative circles */}
      <div style={{
        position: "absolute", top: "10%", left: "5%",
        width: "350px", height: "350px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "10%", right: "5%",
        width: "300px", height: "300px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(34,211,238,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Card */}
      <div
        className="animate-scaleIn"
        style={{
          width: "100%", maxWidth: "420px",
          background: "rgba(15,23,42,0.85)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(99,102,241,0.2)",
          borderRadius: "24px",
          padding: "40px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)",
          position: "relative", zIndex: 1,
        }}
      >
        {/* Logo mark */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "32px" }}>
          <div style={{
            width: "52px", height: "52px", borderRadius: "16px",
            background: "linear-gradient(135deg, #6366f1, #22d3ee)",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: "16px",
            boxShadow: "0 8px 28px rgba(99,102,241,0.4)",
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 11l3 3L22 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
            </svg>
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#f8fafc", textAlign: "center", marginBottom: "6px" }}>
            Welcome back
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.875rem", textAlign: "center" }}>
            Sign in to your TaskFlow account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Email */}
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "8px", letterSpacing: "0.04em" }}>
              EMAIL ADDRESS
            </label>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#475569", pointerEvents: "none" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <input
                id="login-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="input-field"
                style={{ paddingLeft: "42px", paddingRight: "14px", paddingTop: "12px", paddingBottom: "12px" }}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "8px", letterSpacing: "0.04em" }}>
              PASSWORD
            </label>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#475569", pointerEvents: "none" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </div>
              <input
                id="login-password"
                name="password"
                type={showPass ? "text" : "password"}
                placeholder="Your password"
                value={form.password}
                onChange={handleChange}
                className="input-field"
                style={{ paddingLeft: "42px", paddingRight: "42px", paddingTop: "12px", paddingBottom: "12px" }}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                style={{
                  position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", color: "#475569", padding: 0,
                }}
              >
                {showPass
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ padding: "13px", fontSize: "0.95rem", marginTop: "8px" }}
          >
            {loading
              ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <span className="spinner" /> Signing in...
                </span>
              : "Sign In"
            }
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(148,163,184,0.1)" }} />
          <span style={{ fontSize: "0.75rem", color: "#475569" }}>OR</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(148,163,184,0.1)" }} />
        </div>

        <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#64748b" }}>
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#818cf8", fontWeight: 600, fontSize: "inherit",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#a5b4fc")}
            onMouseLeave={(e) => (e.target.style.color = "#818cf8")}
          >
            Create account
          </button>
        </p>
      </div>
    </div>
  );
}