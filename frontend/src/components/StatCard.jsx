export default function StatCard({ label, value, icon, color = "#6366f1", delay = 0 }) {
  const colorMap = {
    indigo: { bg: "rgba(99,102,241,0.12)", border: "rgba(99,102,241,0.25)", glow: "rgba(99,102,241,0.3)", icon: "#818cf8" },
    cyan:   { bg: "rgba(34,211,238,0.12)",  border: "rgba(34,211,238,0.25)",  glow: "rgba(34,211,238,0.3)",  icon: "#22d3ee" },
    green:  { bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.25)",  glow: "rgba(16,185,129,0.3)",  icon: "#10b981" },
    amber:  { bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.25)",  glow: "rgba(245,158,11,0.3)",  icon: "#f59e0b" },
    red:    { bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.25)",   glow: "rgba(239,68,68,0.3)",   icon: "#ef4444" },
    purple: { bg: "rgba(168,85,247,0.12)",  border: "rgba(168,85,247,0.25)",  glow: "rgba(168,85,247,0.3)",  icon: "#a855f7" },
  };

  const c = colorMap[color] || colorMap.indigo;

  return (
    <div
      className="animate-fadeInUp"
      style={{
        animationDelay: `${delay}ms`,
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: "16px",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = `0 12px 36px ${c.glow}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Background orb */}
      <div style={{
        position: "absolute", top: "-20px", right: "-20px",
        width: "90px", height: "90px", borderRadius: "50%",
        background: c.bg, opacity: 0.6,
        filter: "blur(16px)",
      }} />

      {/* Icon */}
      <div style={{
        width: "44px", height: "44px", borderRadius: "12px",
        background: `${c.icon}20`,
        border: `1px solid ${c.icon}30`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: c.icon, marginBottom: "16px",
      }}>
        {icon}
      </div>

      {/* Value */}
      <div style={{ fontSize: "2.25rem", fontWeight: 800, color: c.icon, lineHeight: 1, marginBottom: "6px" }}>
        {value}
      </div>

      {/* Label */}
      <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </div>
    </div>
  );
}
