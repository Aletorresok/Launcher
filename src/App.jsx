const APPS = [
  {
    icon: "⚖️",
    nombre: "Agenda Legal",
    desc: "Casos, tareas y bitácora",
    url: "https://calendario-legal.vercel.app",
    color: "#c9a96e",
    bg: "#1c2a3a",
  },
  {
    icon: "🤝",
    nombre: "PAS Tracker",
    desc: "Contactos y casos de seguros",
    url: "https://pas-tracker-2-0.vercel.app",
    color: "#6366f1",
    bg: "#0f172a",
  },
  {
    icon: "💰",
    nombre: "Mis Finanzas",
    desc: "Capital, frascos y seguimiento de precios",
    url: "https://mis-finanzas-rho.vercel.app",
    color: "#c9a84c",
    bg: "#1a160a",
  },
];

export default function App() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#09090b",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans','Segoe UI',sans-serif",
      padding: 24,
    }}>
      {/* Logo */}
      <div style={{ marginBottom: 48, textAlign: "center" }}>
        <div style={{ fontSize: 13, color: "#52525b", letterSpacing: 4, textTransform: "uppercase", marginBottom: 8 }}>Alexis Torresok</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: "#fafafa", letterSpacing: -1 }}>Workspace</div>
      </div>

      {/* Tiles */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", maxWidth: 700 }}>
        {APPS.map(app => (
          <a
            key={app.nombre}
            href={app.url}
            target="_blank"
            rel="noreferrer"
            style={{
              background: app.bg,
              border: `1px solid ${app.color}33`,
              borderRadius: 16,
              padding: "28px 32px",
              width: 200,
              textDecoration: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              transition: "transform .15s, box-shadow .15s",
              cursor: "pointer",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 12px 32px ${app.color}22`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
          >
            <div style={{ fontSize: 40 }}>{app.icon}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#fafafa", textAlign: "center" }}>{app.nombre}</div>
            <div style={{ fontSize: 12, color: "#71717a", textAlign: "center", lineHeight: 1.4 }}>{app.desc}</div>
          </a>
        ))}
      </div>

      <div style={{ marginTop: 56, fontSize: 11, color: "#3f3f46" }}>
        {new Date().getFullYear()} · Workspace personal
      </div>
    </div>
  );
}
