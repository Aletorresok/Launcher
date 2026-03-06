import { useState, useEffect } from "react";

const APPS = [
  {
    icon: "⚖️",
    nombre: "Agenda Legal",
    desc: "Casos, tareas y bitácora",
    url: "https://calendario-legal.vercel.app",
    color: "#c9a96e",
  },
  {
    icon: "🤝",
    nombre: "PAS Tracker",
    desc: "Contactos y casos de seguros",
    url: "https://pas-tracker-2-0.vercel.app",
    color: "#6366f1",
  },
  {
    icon: "💰",
    nombre: "Mis Finanzas",
    desc: "Capital, frascos y seguimiento de precios",
    url: "https://mis-finanzas-rho.vercel.app",
    color: "#c9a84c",
  },
  {
    icon: "🎾",
    nombre: "Padel Tracker",
    desc: "Partidos, sets y errores no forzados",
    url: "https://padel-tracker-ruby.vercel.app",
    color: "#22c55e",
  },
];

// Fix 4: más quick links
const QUICK_LINKS = [
  { icon: "💬", label: "WhatsApp",   url: "https://web.whatsapp.com" },
  { icon: "✉️", label: "Gmail",      url: "https://mail.google.com" },
  { icon: "📁", label: "Drive",      url: "https://drive.google.com" },
  { icon: "📅", label: "Calendario", url: "https://calendar.google.com" },
  { icon: "🐙", label: "GitHub",     url: "https://github.com/Aletorresok" },
];

function getTimeOfDay(hour) {
  if (hour >= 5  && hour < 8)  return "dawn";
  if (hour >= 8  && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 20) return "sunset";
  if (hour >= 20 && hour < 23) return "dusk";
  return "night";
}

const TIME_CONFIG = {
  dawn: {
    bg: "linear-gradient(160deg, #1a0a2e 0%, #3d1f6e 25%, #c2410c 60%, #fb923c 80%, #fde68a 100%)",
    label: "Amanecer", textColor: "#fde68a",
    subColor: "rgba(253,230,138,.6)", cardOverlay: "rgba(30,10,50,.55)",
  },
  morning: {
    bg: "linear-gradient(160deg, #0369a1 0%, #0ea5e9 40%, #7dd3fc 70%, #e0f2fe 100%)",
    label: "Mañana", textColor: "#ffffff",
    subColor: "rgba(255,255,255,.7)", cardOverlay: "rgba(3,50,80,.5)",
  },
  afternoon: {
    bg: "linear-gradient(160deg, #0c4a6e 0%, #0284c7 30%, #38bdf8 65%, #bae6fd 100%)",
    label: "Tarde", textColor: "#ffffff",
    subColor: "rgba(255,255,255,.65)", cardOverlay: "rgba(5,40,70,.5)",
  },
  sunset: {
    bg: "linear-gradient(160deg, #1e1035 0%, #7c2d12 25%, #ea580c 50%, #f97316 70%, #fbbf24 90%, #fef3c7 100%)",
    label: "Atardecer", textColor: "#fef3c7",
    subColor: "rgba(254,243,199,.6)", cardOverlay: "rgba(30,10,30,.55)",
  },
  dusk: {
    bg: "linear-gradient(160deg, #0f0a1e 0%, #1e1035 30%, #4c1d95 55%, #7c3aed 75%, #c4b5fd 100%)",
    label: "Anochecer", textColor: "#e9d5ff",
    subColor: "rgba(233,213,255,.55)", cardOverlay: "rgba(15,5,30,.6)",
  },
  night: {
    bg: "linear-gradient(160deg, #020409 0%, #0a0a1a 40%, #0f0a1e 70%, #1a0a2e 100%)",
    label: "Noche", textColor: "#e2e8f0",
    subColor: "rgba(226,232,240,.45)", cardOverlay: "rgba(5,5,20,.65)",
  },
};

const WEATHER_ICONS = {
  0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
  45: "🌫️", 48: "🌫️",
  51: "🌦️", 53: "🌦️", 55: "🌧️",
  61: "🌧️", 63: "🌧️", 65: "🌧️",
  71: "🌨️", 73: "🌨️", 75: "❄️",
  80: "🌦️", 81: "🌧️", 82: "⛈️",
  95: "⛈️", 96: "⛈️", 99: "⛈️",
};

// Fix 6: frases del día rotativas
const FRASES = [
  "Un caso bien trabajado hoy es un cliente satisfecho mañana.",
  "El que no contacta, no cierra.",
  "Constancia > inspiración.",
  "Cada PAS contactado es una puerta que puede abrirse.",
  "El seguimiento es la mitad del trabajo.",
  "Un recordatorio a tiempo vale por diez llamadas tarde.",
  "La agenda vacía es el peor enemigo del abogado.",
  "Cada 'no' te acerca al próximo 'sí'.",
  "Trabajá el proceso, los resultados vienen solos.",
  "Un caso nuevo empieza con un primer mensaje.",
  "Hoy es un buen día para cerrar algo pendiente.",
  "La organización es la mejor estrategia legal.",
  "El PAS que deriva hoy puede traer diez casos mañana.",
  "Revisá tus recordatorios antes de arrancar el día.",
];
function fraseDelDia() {
  return FRASES[Math.floor(Date.now() / 86400000) % FRASES.length];
}

// Fix 5: tiempo desde última visita
function tiempoDesde(iso) {
  if (!iso) return null;
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1)  return "ahora mismo";
  if (mins < 60) return `hace ${mins}min`;
  const hs = Math.floor(mins / 60);
  if (hs < 24)   return `hace ${hs}h`;
  return `hace ${Math.floor(hs / 24)}d`;
}

export default function App() {
  const [now, setNow]               = useState(new Date());
  const [weather, setWeather]       = useState(null);
  const [weatherError, setWeatherError] = useState(false);

  // Fix 5: última visita por app (localStorage)
  const [visitadas, setVisitadas] = useState(() => {
    try { return JSON.parse(localStorage.getItem("launcher_visited") || "{}"); } catch { return {}; }
  });

  // Fix 1: reloj sincronizado al minuto exacto
  useEffect(() => {
    let interval;
    const tick = () => setNow(new Date());
    const msHastaProximoMinuto = 60000 - (Date.now() % 60000);
    const timeout = setTimeout(() => {
      tick();
      interval = setInterval(tick, 60000);
    }, msHastaProximoMinuto);
    return () => { clearTimeout(timeout); clearInterval(interval); };
  }, []);

  // Fix 2: fetch clima con refresh automático cada 30 minutos
  const fetchClima = () => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=-34.6354&longitude=-58.7918&current=temperature_2m,weathercode,windspeed_10m&timezone=America%2FArgentina%2FBuenos_Aires")
      .then(r => r.json())
      .then(d => {
        setWeather({ temp: Math.round(d.current.temperature_2m), code: d.current.weathercode, wind: Math.round(d.current.windspeed_10m) });
        setWeatherError(false);
      })
      .catch(() => setWeatherError(true));
  };

  useEffect(() => {
    fetchClima();
    const interval = setInterval(fetchClima, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Fix 9: tod y cfg se recalculan con `now` para que el label se actualice solo
  const hour = now.getHours();
  const tod  = getTimeOfDay(hour);
  const cfg  = TIME_CONFIG[tod];

  const timeStr       = now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
  const dateStr       = now.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
  const dateFormatted = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

  const handleAppClick = (nombre) => {
    const updated = { ...visitadas, [nombre]: new Date().toISOString() };
    setVisitadas(updated);
    try { localStorage.setItem("launcher_visited", JSON.stringify(updated)); } catch {}
  };

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
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", width: "100%", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>

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

          {/* Clima — Fix 2: botón refrescar manual */}
          <div style={{
            background: cfg.cardOverlay, backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,.12)", borderRadius: 16,
            padding: "14px 20px", display: "flex", alignItems: "center", gap: 12, minWidth: 160,
          }}>
            {weather ? (
              <>
                <div style={{ fontSize: 36 }}>{WEATHER_ICONS[weather.code] || "🌡️"}</div>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: cfg.textColor, lineHeight: 1 }}>{weather.temp}°C</div>
                  <div style={{ fontSize: 11, color: cfg.subColor, marginTop: 3 }}>Moreno · 💨 {weather.wind} km/h</div>
                </div>
                <button onClick={fetchClima} title="Refrescar clima" style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 14, color: cfg.subColor, padding: 0, marginLeft: 2, opacity: 0.6 }}>🔄</button>
              </>
            ) : weatherError ? (
              <div style={{ fontSize: 12, color: cfg.subColor, display: "flex", alignItems: "center", gap: 8 }}>
                Sin datos · <button onClick={fetchClima} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 14, color: cfg.subColor, padding: 0 }}>🔄</button>
              </div>
            ) : (
              <div style={{ fontSize: 12, color: cfg.subColor }}>Cargando clima…</div>
            )}
          </div>
        </div>

        {/* Fix 6: frase del día */}
        <div style={{ width: "100%", marginBottom: 28, textAlign: "center", fontSize: 13, fontStyle: "italic", color: cfg.subColor, letterSpacing: 0.3, padding: "0 8px" }}>
          "{fraseDelDia()}"
        </div>

        {/* App tiles — Fix 10: responsive con flex + minWidth/maxWidth */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", marginBottom: 28, width: "100%" }}>
          {APPS.map(app => {
            const ultimaVisita = tiempoDesde(visitadas[app.nombre]);
            return (
              <a
                key={app.nombre}
                href={app.url}
                target="_blank"
                rel="noreferrer"
                onClick={() => handleAppClick(app.nombre)}
                style={{
                  background: cfg.cardOverlay, backdropFilter: "blur(12px)",
                  border: `1px solid ${app.color}44`, borderRadius: 16,
                  padding: "24px 20px",
                  flex: "1 1 160px", maxWidth: 220,
                  textDecoration: "none", display: "flex", flexDirection: "column",
                  alignItems: "center", gap: 10,
                  transition: "transform .15s, box-shadow .15s, border-color .15s",
                  cursor: "pointer", position: "relative",
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
                {/* Fix 5: badge última visita */}
                {ultimaVisita && (
                  <div style={{
                    position: "absolute", top: 10, right: 10,
                    fontSize: 9, color: app.color, background: app.color + "22",
                    borderRadius: 20, padding: "2px 7px", fontWeight: 600,
                  }}>
                    {ultimaVisita}
                  </div>
                )}
                <div style={{ fontSize: 38 }}>{app.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: cfg.textColor, textAlign: "center" }}>{app.nombre}</div>
                <div style={{ fontSize: 11, color: cfg.subColor, textAlign: "center", lineHeight: 1.4 }}>{app.desc}</div>
              </a>
            );
          })}
        </div>

        {/* Quick links — Fix 4: más links + flexWrap para mobile */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 36, flexWrap: "wrap" }}>
          {QUICK_LINKS.map(link => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              style={{
                background: cfg.cardOverlay, backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,.12)", borderRadius: 12,
                padding: "9px 18px", textDecoration: "none",
                display: "flex", alignItems: "center", gap: 8,
                transition: "all .15s", cursor: "pointer",
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
              <span style={{ fontSize: 16 }}>{link.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: cfg.textColor }}>{link.label}</span>
            </a>
          ))}
        </div>

        {/* Footer — Fix 9: cfg.label actualizable con `now` */}
        <div style={{ fontSize: 11, color: cfg.subColor }}>
          {now.getFullYear()} · Workspace personal · {cfg.label}
        </div>
      </div>
    </div>
  );
}
