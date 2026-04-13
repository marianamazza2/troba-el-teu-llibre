import { useState } from "react";

const sections = [
  {
    id: "concept",
    icon: "🎯",
    title: "Concepto",
    content: {
      name: "Troba el teu Llibre — Sant Jordi 2026",
      tagline: "Regala el libro perfecto con ayuda de la AI",
      elevator: "Una webapp donde escribes para quién es el regalo (personalidad, gustos, edad, qué le gusta) y la AI te recomienda 3 libros perfectos con una nota personalizada para dedicar. Temática visual de Sant Jordi: rosas, dragones, Barcelona.",
      why: [
        "Resuelve un problema REAL: 'No sé qué libro regalar' es la frase más repetida antes del 23 de abril",
        "Es compartible: la gente la usará y enviará a amigos → viralización orgánica",
        "Demuestra código + AI + diseño en una sola pieza → tu portfolio perfecto",
        "Tiene fecha límite natural (23 abril) → urgencia y relevancia",
        "Puede ser replicable: si funciona, ofreces esto como servicio a negocios reales"
      ]
    }
  },
  {
    id: "flow",
    icon: "🔄",
    title: "Flujo de Usuario",
    content: {
      steps: [
        { step: "1. Landing / Home", priority: "ESENCIAL", details: [
          "Hero visual con estética Sant Jordi (rosa, tonos rojos/crema, textura de papel)",
          "Copy en catalán: 'No saps quin llibre regalar per Sant Jordi?'",
          "Botón CTA: 'Troba el teu llibre →'",
          "Toggle de idioma: CAT / ES / EN",
          "Footer: 'Creat per [tu agencia]' con link a Instagram"
        ]},
        { step: "2. Wizard interactivo (5 pasos)", priority: "ESENCIAL", details: [
          "Formato wizard: una pregunta por pantalla con barra de progreso",
          "P1: '¿Para quién es?' → Parella / Amic / Mare-Pare / Fill / Company / Per a mi",
          "P2: 'Explica'ns com és' → Campo libre (aquí la AI brilla)",
          "P3: 'Gèneres?' → Multi-select con chips",
          "P4: 'Últim llibre que li va agradar?' → Opcional",
          "P5: 'Idioma + Pressupost' → Dos selects rápidos"
        ]},
        { step: "3. Pantalla de carga", priority: "ESENCIAL", details: [
          "Rosa animada (pulse) + textos rotativos en catalán/castellano/inglés",
          "3-8 segundos mientras Claude procesa",
          "NO spinner genérico — momento de experiencia"
        ]},
        { step: "4. Resultados: 3 libros", priority: "ESENCIAL", details: [
          "3 tarjetas con: portada (Google Books/Open Library), título, autor",
          "Sinopsis breve + 'Por qué es perfecto para esta persona'",
          "Precio estimado + botón 'Buscar en librerías'",
          "Confetti animado al cargar los resultados"
        ]},
        { step: "5. Dedicatoria personalizada", priority: "DIFERENCIADOR", details: [
          "Seleccionar un libro → Claude genera dedicatoria personalizada",
          "Estética de nota manuscrita (tipografía Caveat/cursiva)",
          "Botones: copiar + editar",
          "ESTO es el wow factor que genera shares"
        ]},
        { step: "6. Compartir + Follow", priority: "CLAVE VIRAL", details: [
          "Botones: WhatsApp / Instagram / Copiar enlace",
          "Bloque 'T'ha agradat?': Seguir en Instagram + Reseña Google",
          "Botón 'Trobar un altre llibre' (loop viral)",
          "Footer con tu marca y CTA de servicios",
          "Cada resultado tiene URL única compartible"
        ]}
      ]
    }
  },
  {
    id: "tech",
    icon: "🛠️",
    title: "Stack & API",
    content: {
      stack: [
        { tech: "Frontend", desc: "Vite + React + TypeScript + Tailwind 4 + TanStack Router" },
        { tech: "AI", desc: "API de Anthropic (Claude) — prompt → JSON con 3 libros + dedicatoria" },
        { tech: "Portadas", desc: "Google Books API (primario) + Open Library (fallback, sin API key)" },
        { tech: "Hosting", desc: "Vercel (free tier) — deploy instantáneo, HTTPS" },
        { tech: "Analytics", desc: "Plausible (privacy-friendly, GDPR) — trackear todo el funnel" },
        { tech: "PWA", desc: "manifest.json + service worker — instalable como app nativa" },
        { tech: "Sonido", desc: "Audio sutil de página al avanzar en el wizard" },
        { tech: "Confetti", desc: "canvas-confetti al mostrar resultados" }
      ],
      apiFlow: [
        "1. Usuario completa wizard → POST /api/recommend con todos los datos",
        "2. API route construye prompt para Claude con inputs del formulario",
        "3. Claude responde JSON: { books: [...], dedication: '...' }",
        "4. Para cada libro: buscar portada en Google Books → fallback Open Library → placeholder",
        "5. Combinar respuesta Claude + portadas → devolver al frontend",
        "6. Rate limiting: 10 peticiones/IP/hora"
      ]
    }
  },
  {
    id: "design",
    icon: "🎨",
    title: "Diseño",
    content: {
      palette: [
        { hex: "#C41E3A", name: "Rojo Sant Jordi", use: "CTAs, acentos, selección activa" },
        { hex: "#2D2D2D", name: "Negro elegante", use: "Texto principal" },
        { hex: "#F5F0E8", name: "Crema papel", use: "Fondo principal" },
        { hex: "#8B6914", name: "Dorado antiguo", use: "Detalles premium, decorativos" },
        { hex: "#2D5016", name: "Verde hoja", use: "Secundario, elementos naturales" }
      ],
      fonts: [
        "Títulos: Playfair Display (700, 800) — serif con carácter",
        "Cuerpo: DM Sans (400-700) — limpia, legible en móvil",
        "Dedicatoria: Caveat (400, 500) — cursiva manuscrita"
      ],
      principles: [
        "Mobile-first: diseñar para 375px. 90%+ del tráfico es móvil",
        "Cards blancas sobre fondo crema con border-radius 14px",
        "Transiciones suaves entre pantallas (fade + slide-up 200-300ms)",
        "Rosa estilizada como elemento recurrente (no clipart)",
        "Textura sutil de papel en el fondo"
      ]
    }
  },
  {
    id: "features",
    icon: "⚡",
    title: "Features",
    content: {
      features: [
        { name: "3 idiomas", desc: "Catalán (default), Castellano, Inglés. Detección automática por navegador. Todas las traducciones en archivo de constantes." },
        { name: "Confetti", desc: "canvas-confetti al cargar resultados. Colores Sant Jordi: rojo, dorado, verde, crema." },
        { name: "Sonido", desc: "Audio sutil de página pasando al avanzar en wizard. Volumen 0.3, fallback silencioso." },
        { name: "PWA", desc: "manifest.json + service worker. Instalable como app nativa. Icono: rosa estilizada sobre fondo crema." },
        { name: "Analytics", desc: "Plausible: trackear wizard_start, cada wizard_step, search_complete, share (por plataforma), cta_click, restart. Para el reel de métricas." },
        { name: "LocalStorage", desc: "Guardar últimos 10 resultados. Mostrar en landing: 'Les teves cerques anteriors'. Recuperar al volver." },
        { name: "Follow + Reseña", desc: "Bloque post-resultados: seguir Instagram + reseña Google. Tono cercano, no agresivo." }
      ]
    }
  },
  {
    id: "timeline",
    icon: "📅",
    title: "Timeline",
    content: {
      weeks: [
        { date: "3-6 abril", title: "Preparación y Diseño", tasks: [
          "Diseño final: paleta, tipografías, layout mobile-first",
          "Assets: rosa estilizada, elementos decorativos, placeholder portada",
          "Configurar proyecto: Vite + React + TS + Tailwind + API keys",
          "Comprar dominio si decides usar custom"
        ]},
        { date: "7-9 abril", title: "Frontend", tasks: [
          "Maquetar landing / hero con toggle 3 idiomas",
          "Wizard paso a paso con transiciones y sonido",
          "Pantalla de carga con animación rosa",
          "Tarjetas de resultados + confetti",
          "Sección dedicatoria con fuente manuscrita",
          "Responsive: testear en móvil constantemente"
        ]},
        { date: "10-11 abril", title: "Backend + AI", tasks: [
          "API route /api/recommend",
          "Prompt de Claude (iterar hasta buenas recomendaciones)",
          "Google Books API + Open Library fallback",
          "Dedicatoria personalizada",
          "Rate limiting + manejo errores"
        ]},
        { date: "12-13 abril", title: "Compartir + Pulir", tasks: [
          "Botones compartir: WhatsApp, Instagram, copiar link",
          "Bloque follow Instagram + reseña Google",
          "OpenGraph meta tags para previews",
          "PWA: manifest + service worker + iconos",
          "Analytics: todos los eventos",
          "LocalStorage: guardar/recuperar resultados",
          "Testing con 5-10 amigos en móvil"
        ]},
        { date: "14 abril", title: "🚀 LANZAMIENTO", tasks: [
          "Deploy final en Vercel",
          "Publicar REEL demo + link en bio",
          "Compartir en WhatsApp, LinkedIn, Reddit/Barcelona",
          "DM a cuentas de Barcelona / cultura / libros"
        ]},
        { date: "15-22 abril", title: "Promoción activa", tasks: [
          "Stories diarias con analytics en tiempo real",
          "Segundo push el 19-20 (finde antes de Sant Jordi)",
          "Repostear menciones e interactuar con todo"
        ]}
      ]
    }
  },
  {
    id: "content",
    icon: "📸",
    title: "Contenido Redes",
    content: {
      pieces: [
        { type: "REEL 1 — Build en vivo", when: "Semana 7-11 abril", desc: "Time-lapse programando. Hook: 'Estoy creando una webapp con AI para Sant Jordi'. CTA: follow para ver el resultado.", goal: "Expectativa + mostrar skill" },
        { type: "REEL 2 — Demo", when: "14 abril (lanzamiento)", desc: "Grabarte usando la app en tu móvil. Hook: 'Creé esto con AI para Sant Jordi'. CTA: link en bio.", goal: "Viralizar + tráfico" },
        { type: "REEL 3 — Resultados", when: "24-25 abril", desc: "Analytics: cuánta gente la usó, recomendaciones generadas. Hook: 'Fa 10 dies vaig crear una app amb IA.'", goal: "Autoridad + caso de estudio" },
        { type: "CARRUSEL — Caso de estudio", when: "26-27 abril", desc: "Brief → stack → diseño → métricas → aprendizajes. Pieza de portfolio.", goal: "Portfolio + guardados" },
        { type: "STORIES", when: "Todo el proceso", desc: "Behind the scenes, encuestas diseño, countdown, screenshots analytics.", goal: "Engagement diario" }
      ]
    }
  },
  {
    id: "viral",
    icon: "🚀",
    title: "Viralización",
    content: {
      tactics: [
        { title: "Hashtags 14-23 abril", desc: "#SantJordi2026 #SantJordiBarcelona #DiadelLlibre #23dabril #Barcelona — EXPLOTAN esos días." },
        { title: "DM a cuentas Barcelona", desc: "@bcnmes, @timeout.barcelona, librerías independientes, cuentas cultura catalana. Con que 1-2 compartan, boom." },
        { title: "La app se comparte sola", desc: "Cada WhatsApp share = nuevo usuario. El botón de compartir es tu feature #1." },
        { title: "Reddit + grupos Facebook", desc: "r/Barcelona, grupos de barrios. 'He creat una eina gratuïta amb IA per Sant Jordi'." },
        { title: "LinkedIn", desc: "Post profesional: 'En 10 días construí una webapp con AI. Así lo hice.' Clientes B2B." },
        { title: "Twitter/X", desc: "Cross-post con #SantJordi — allí también se mueve mucho ese día." }
      ]
    }
  }
];

export default function WebappBrief() {
  const [activeSection, setActiveSection] = useState("concept");
  const section = sections.find(s => s.id === activeSection);

  const renderContent = () => {
    const c = section.content;
    switch (activeSection) {
      case "concept":
        return (
          <div>
            <div style={{ background: "#C41E3A", color: "#fff", borderRadius: 12, padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", opacity: 0.7 }}>Proyecto</div>
              <h2 style={{ margin: "6px 0 4px", fontSize: 20, fontWeight: 800 }}>{c.name}</h2>
              <p style={{ margin: 0, fontSize: 13, opacity: 0.85 }}>{c.tagline}</p>
            </div>
            <p style={{ fontSize: 13, color: "#333", lineHeight: 1.7, margin: "0 0 16px" }}>{c.elevator}</p>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>¿Por qué este proyecto?</div>
            {c.why.map((w, i) => (
              <div key={i} style={{ display: "flex", gap: 8, padding: "6px 0", borderBottom: i < c.why.length - 1 ? "1px solid #f0f0f0" : "none", fontSize: 12, color: "#444" }}>
                <span style={{ color: "#C41E3A", flexShrink: 0 }}>✓</span><span>{w}</span>
              </div>
            ))}
          </div>
        );
      case "flow":
        return (
          <div>
            {c.steps.map((s, i) => (
              <div key={i} style={{ padding: 12, marginBottom: 10, background: "#fafafa", borderRadius: 10, border: "1px solid #eee", borderLeft: `4px solid ${s.priority === "ESENCIAL" ? "#C41E3A" : s.priority === "DIFERENCIADOR" ? "#8B6914" : "#6C5CE7"}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: 13 }}>{s.step}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: s.priority === "ESENCIAL" ? "#C41E3A" : s.priority === "DIFERENCIADOR" ? "#8B6914" : "#6C5CE7", color: "#fff" }}>{s.priority}</span>
                </div>
                {s.details.map((d, j) => (
                  <div key={j} style={{ fontSize: 12, color: "#555", padding: "3px 0", display: "flex", gap: 6 }}>
                    <span style={{ color: "#C41E3A", flexShrink: 0 }}>→</span><span>{d}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        );
      case "tech":
        return (
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>Stack</div>
            {c.stack.map((s, i) => (
              <div key={i} style={{ padding: 10, marginBottom: 6, background: "#fafafa", borderRadius: 8, border: "1px solid #eee" }}>
                <span style={{ fontWeight: 700, fontSize: 12, color: "#C41E3A" }}>{s.tech}: </span>
                <span style={{ fontSize: 12, color: "#555" }}>{s.desc}</span>
              </div>
            ))}
            <div style={{ fontWeight: 700, fontSize: 13, margin: "16px 0 10px" }}>Flujo API</div>
            {c.apiFlow.map((s, i) => (
              <div key={i} style={{ fontSize: 12, color: "#444", padding: "5px 0", borderBottom: i < c.apiFlow.length - 1 ? "1px solid #f0f0f0" : "none" }}>{s}</div>
            ))}
          </div>
        );
      case "design":
        return (
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>Paleta</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
              {c.palette.map((p, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", padding: 8, background: "#fafafa", borderRadius: 8, border: "1px solid #eee" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 6, background: p.hex, flexShrink: 0, border: "1px solid rgba(0,0,0,0.1)" }} />
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700 }}>{p.name}</div>
                    <div style={{ fontSize: 9, color: "#888", fontFamily: "monospace" }}>{p.hex}</div>
                    <div style={{ fontSize: 10, color: "#666" }}>{p.use}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Tipografías</div>
            {c.fonts.map((f, i) => (
              <div key={i} style={{ fontSize: 12, color: "#444", padding: "4px 0" }}>→ {f}</div>
            ))}
            <div style={{ fontWeight: 700, fontSize: 13, margin: "16px 0 8px" }}>Principios</div>
            {c.principles.map((p, i) => (
              <div key={i} style={{ fontSize: 12, color: "#444", padding: "4px 0" }}>→ {p}</div>
            ))}
          </div>
        );
      case "features":
        return (
          <div>
            {c.features.map((f, i) => (
              <div key={i} style={{ padding: 12, marginBottom: 8, background: "#fafafa", borderRadius: 10, border: "1px solid #eee" }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#C41E3A", marginBottom: 4 }}>{f.name}</div>
                <div style={{ fontSize: 12, color: "#555" }}>{f.desc}</div>
              </div>
            ))}
          </div>
        );
      case "timeline":
        return (
          <div>
            {c.weeks.map((w, i) => (
              <div key={i} style={{ padding: 12, marginBottom: 10, background: "#fafafa", borderRadius: 10, border: "1px solid #eee", borderLeft: `4px solid ${w.title.includes("🚀") ? "#C41E3A" : "#ddd"}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#C41E3A", marginBottom: 2 }}>{w.date}</div>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{w.title}</div>
                {w.tasks.map((t, j) => (
                  <div key={j} style={{ fontSize: 12, color: "#444", padding: "3px 0", display: "flex", gap: 6 }}>
                    <span style={{ flexShrink: 0 }}>☐</span><span>{t}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        );
      case "content":
        return (
          <div>
            {c.pieces.map((p, i) => (
              <div key={i} style={{ padding: 12, marginBottom: 10, background: "#fafafa", borderRadius: 10, border: "1px solid #eee" }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{p.type}</div>
                <div style={{ fontSize: 11, color: "#C41E3A", fontWeight: 600, marginBottom: 4 }}>📅 {p.when}</div>
                <div style={{ fontSize: 12, color: "#555", marginBottom: 6 }}>{p.desc}</div>
                <div style={{ fontSize: 11, background: "#E8F5E9", padding: "3px 8px", borderRadius: 6, color: "#2E7D32", fontWeight: 600, display: "inline-block" }}>🎯 {p.goal}</div>
              </div>
            ))}
          </div>
        );
      case "viral":
        return (
          <div>
            {c.tactics.map((t, i) => (
              <div key={i} style={{ padding: 12, marginBottom: 8, background: "#fafafa", borderRadius: 10, border: "1px solid #eee" }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>🚀 {t.title}</div>
                <div style={{ fontSize: 12, color: "#555" }}>{t.desc}</div>
              </div>
            ))}
          </div>
        );
      default: return null;
    }
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', -apple-system, sans-serif", maxWidth: 720, margin: "0 auto", padding: "20px 16px", color: "#1a1a1a", lineHeight: 1.6 }}>
      <div style={{ textAlign: "center", marginBottom: 24, padding: "24px 20px", background: "linear-gradient(135deg, #7B1C2A 0%, #C41E3A 50%, #A01830 100%)", borderRadius: 16, color: "#fff" }}>
        <div style={{ fontSize: 36, marginBottom: 6 }}>🌹🤖</div>
        <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", opacity: 0.6 }}>Proyecto 1 · Brief</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: "6px 0" }}>Troba el teu Llibre</h1>
        <p style={{ fontSize: 12, opacity: 0.75, margin: 0 }}>Webapp AI · Lanzamiento 14 abril 2026</p>
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 18, overflowX: "auto", paddingBottom: 4, position: "sticky", top: 0, zIndex: 10, background: "#fff", padding: "6px 0" }}>
        {sections.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
            padding: "7px 10px", border: activeSection === s.id ? "2px solid #C41E3A" : "2px solid #e8e8e8",
            borderRadius: 8, background: activeSection === s.id ? "#FFF5F5" : "#fafafa",
            cursor: "pointer", fontWeight: activeSection === s.id ? 700 : 500,
            color: activeSection === s.id ? "#C41E3A" : "#999",
            fontSize: 10, whiteSpace: "nowrap", flexShrink: 0
          }}>
            <div style={{ fontSize: 14 }}>{s.icon}</div>
            <div>{s.title}</div>
          </button>
        ))}
      </div>
      <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 14, padding: 18 }}>
        <h2 style={{ margin: "0 0 14px", fontSize: 16, color: "#C41E3A", display: "flex", alignItems: "center", gap: 8 }}>
          <span>{section.icon}</span> {section.title}
        </h2>
        {renderContent()}
      </div>
      <div style={{ textAlign: "center", padding: 14, fontSize: 11, color: "#ccc", marginTop: 8 }}>
        Brief técnico detallado → BRIEF-WEBAPP-SANT-JORDI.md
      </div>
    </div>
  );
}
