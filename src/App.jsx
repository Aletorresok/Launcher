import { useState, useEffect } from "react";

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
  {
    icon: "🎾",
    nombre: "Padel Tracker",
    desc: "Partidos, sets y errores no forzados",
    url: "https://padel-tracker-ruby.vercel.app",
    color: "#22c55e",
    bg: "#0a1a0f",
  },
];

const QUICK_LINKS = [
  { icon: "💬", label: "WhatsApp", url: "https://web.whatsapp.com" },
  { icon: "✉️", label: "Gmail", url: "https://mail.google.com" },
  { icon: "📁", label: "Drive", url: "https://drive.google.com" },
];

// Fondo dinámico según hora
function getTimeOfDay(hour) {
  if (hour >= 5 && hour < 8)   return "dawn";      // Amanecer
  if (hour >= 8 && hour < 12)  return "morning";   // Mañana
  if (hour >= 12 && hour < 17) return "afternoon"; // Tarde
  if (hour >= 17 && hour < 20) return "sunset";    // Atardecer
  if (hour >= 20 && hour < 23) return "dusk";      // Anochecer
  return "night";                                   // Noche
}

const TIME_CONFIG = {
  dawn: {
    bg: "linear-gradient(160deg, #1a0a2e 0%, #3d1f6e 25%, #c2410c 60%, #fb923c 80%, #fde68a 100%)",
    label: "Amanecer",
    textColor: "#fde68a",
    subColor: "rgba(253,230,138,.6)",
    cardOverlay: "rgba(30,10,50,.55)",
  },
  morning: {
    bg: "linear-gradient(160deg, #0369a1 0%, #0ea5e9 40%, #7dd3fc 70%, #e0f2fe 100%)",
    label: "Mañana",
    textColor: "#ffffff",
    subColor: "rgba(255,255,255,.7)",
    cardOverlay: "rgba(3,50,80,.5)",
  },
  afternoon: {
    bg: "linear-gradient(160deg, #0c4a6e 0%, #0284c7 30%, #38bdf8 65%, #bae6fd 100%)",
    label: "Tarde",
    textColor: "#ffffff",
    subColor: "rgba(255,255,255,.65)",
    cardOverlay: "rgba(5,40,70,.5)",
  },
  sunset: {
    bg: "linear-gradient(160deg, #1e1035 0%, #7c2d12 25%, #ea580c 50%, #f97316 70%, #fbbf24 90%, #fef3c7 100%)",
    label: "Atardecer",
    textColor: "#fef3c7",
    subColor: "rgba(254,243,199,.6)",
    cardOverlay: "rgba(30,10,30,.55)",
  },
  dusk: {
    bg: "linear-gradient(160deg, #0f0a1e 0%, #1e1035 30%, #4c1d95 55%, #7c3aed 75%, #c4b5fd 100%)",
    label: "Anochecer",
    textColor: "#e9d5ff",
    subColor: "rgba(233,213,255,.55)",
    cardOverlay: "rgba(15,5,30,.6)",
  },
  night: {
    bg: "linear-gradient(160deg, #020409 0%, #0a0a1a 40%, #0f0a1e 70%, #1a0a2e 100%)",
    label: "Noche",
    textColor: "#e2e8f0",
    subColor: "rgba(226,232,240,.45)",
    cardOverlay: "rgba(5,5,20,.65)",
  },
};

// Iconos de clima
const WEATHER_ICONS = {
  0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
  45: "🌫️", 48: "🌫️",
  51: "🌦️", 53: "🌦️", 55: "🌧️",
  61: "🌧️", 63: "🌧️", 65: "🌧️",
  71: "🌨️", 73: "🌨️", 75: "❄️",
  80: "🌦️", 81: "🌧️", 82: "⛈️",
  95: "⛈️", 96: "⛈️", 99: "⛈️",
};

export default function App() {
  const [now, setNow] = useState(new Date());
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(false);

  // Actualizar reloj cada minuto
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  // Clima Moreno, Buenos Aires — Open-Meteo (gratis, sin API key)
  useEffect(() => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=-34.6354&longitude=-58.7918&current=temperature_2m,weathercode,windspeed_10m&timezone=America%2FArgentina%2FBuenos_Aires")
      .then(r => r.json())
      .then(d => {
        setWeather({
          temp: Math.round(d.current.temperature_2m),
          code: d.current.weathercode,
          wind: Math.round(d.current.windspeed_10m),
        });
      })
      .catch(() => setWeatherError(true));
  }, []);

  const hour = now.getHours();
  const tod = getTimeOfDay(hour);
  const cfg = TIME_CONFIG[tod];

  const timeStr = now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
  const dateFormatted = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

  return (
    <div style={{
      minHeight: "100vh",
      background: cfg.bg,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans','Segoe UI',sans-serif",
      padding: "24px 16px",
      transition: "background 2s ease",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Grain overlay */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: .04,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 860, display: "flex", flexDirection: "column", alignItems: "center" }}>

        {/* Header: hora + fecha + clima */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", width: "100%", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>

          {/* Hora y fecha */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", color: cfg.subColor, marginBottom: 4 }}>
              Alexis Torresok
            </div>
            <div style={{ fontSize: 52, fontWeight: 800, color: cfg.textColor, lineHeight: 1, letterSpacing: -2 }}>
              {timeStr}
            </div>
            <div style={{ fontSize: 14, color: cfg.subColor, marginTop: 4 }}>
              {dateFormatted}
            </div>
          </div>

          {/* Clima */}
          <div style={{
            background: cfg.cardOverlay,
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,.12)",
            borderRadius: 16,
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            minWidth: 160,
          }}>
            {weather ? (
              <>
                <div style={{ fontSize: 36 }}>{WEATHER_ICONS[weather.code] || "🌡️"}</div>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: cfg.textColor, lineHeight: 1 }}>
                    {weather.temp}°C
                  </div>
                  <div style={{ fontSize: 11, color: cfg.subColor, marginTop: 3 }}>
                    Moreno · 💨 {weather.wind} km/h
                  </div>
                </div>
              </>
            ) : weatherError ? (
              <div style={{ fontSize: 12, color: cfg.subColor }}>Sin datos de clima</div>
            ) : (
              <div style={{ fontSize: 12, color: cfg.subColor }}>Cargando clima…</div>
            )}
          </div>
        </div>

        {/* App tiles */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", marginBottom: 28, width: "100%" }}>
          {APPS.map(app => (
            <a
              key={app.nombre}
              href={app.url}
              target="_blank"
              rel="noreferrer"
              style={{
                background: cfg.cardOverlay,
                backdropFilter: "blur(12px)",
                border: `1px solid ${app.color}44`,
                borderRadius: 16,
                padding: "24px 28px",
                width: 190,
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                transition: "transform .15s, box-shadow .15s, border-color .15s",
                cursor: "pointer",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = `0 16px 40px ${app.color}33`;
                e.currentTarget.style.borderColor = `${app.color}99`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "";
                e.currentTarget.style.borderColor = `${app.color}44`;
              }}
            >
              <div style={{ fontSize: 38 }}>{app.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: cfg.textColor, textAlign: "center" }}>{app.nombre}</div>
              <div style={{ fontSize: 11, color: cfg.subColor, textAlign: "center", lineHeight: 1.4 }}>{app.desc}</div>
            </a>
          ))}
        </div>

        {/* Quick links */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 36 }}>
          {QUICK_LINKS.map(link => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              style={{
                background: cfg.cardOverlay,
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,.12)",
                borderRadius: 12,
                padding: "9px 20px",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 8,
                transition: "all .15s",
                cursor: "pointer",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(255,255,255,.15)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = cfg.cardOverlay;
                e.currentTarget.style.transform = "";
              }}
            >
              <span style={{ fontSize: 18 }}>{link.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: cfg.textColor }}>{link.label}</span>
            </a>
          ))}
        </div>

        {/* Footer */}
        <div style={{ fontSize: 11, color: cfg.subColor }}>
          {new Date().getFullYear()} · Workspace personal · {cfg.label}
        </div>
      </div>
    </div>
  );
}
