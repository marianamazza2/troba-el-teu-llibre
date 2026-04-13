# NEXT STEPS — Troba el teu Llibre
Lanzamiento: jueves 16 de abril de 2026

---

## FASE 5: Backend — API Route (PRIORITARIO)

El frontend ya llama a `POST /api/recommend` pero no hay servidor que responda. Es el bloqueo más crítico.

### Paso 5.1 — Crear la API route

Opción recomendada: Vercel serverless function → crear `api/recommend.ts` en la raíz del proyecto (fuera de `src/`).

```
troba-el-teu-llibre/
├── api/
│   └── recommend.ts   ← NUEVO
├── src/
│   └── ...
```

### Paso 5.2 — Llamada a Claude (Anthropic API)

La función debe:
1. Recibir POST con los datos del wizard (`recipient`, `description`, `genres`, `lastBook`, `preferredLanguage`, `budget`)
2. Construir el prompt y llamar a Claude
3. Parsear el JSON de respuesta
4. Si Claude no devuelve JSON válido → reintentar 1 vez. Si falla de nuevo → error 500

Modelo a usar: `claude-sonnet-4-20250514`
API key: `process.env.ANTHROPIC_API_KEY`

El prompt y el formato JSON esperado están documentados en `PASOS-CLAUDE-CODE.md` → Fase 5, Paso 5.2.

### Paso 5.3 — Buscar portadas de libros

Para cada libro devuelto por Claude:
1. **Google Books API** (primario) — buscar por ISBN o título+autor
2. **Open Library** (fallback, sin API key) — si Google Books no encuentra nada
3. Devolver `null` si ninguno encuentra portada (el frontend ya maneja el placeholder)

Código completo en `PASOS-CLAUDE-CODE.md` → Fase 5, Paso 5.3.

### Paso 5.4 — Generar ID y devolver respuesta

Generar `resultId` con `crypto.randomUUID().substring(0, 8)`.
Para el MVP: el frontend guarda el resultado en localStorage (no hace falta BD).

### Paso 5.5 — Rate limiting

Máximo 10 peticiones por IP por hora.
Para MVP: Map en memoria (limita ráfagas aunque no persista entre cold starts).

### Paso 5.6 — Variables de entorno

Crear `.env` en la raíz del proyecto:
```
ANTHROPIC_API_KEY=tu_api_key_aqui
GOOGLE_BOOKS_API_KEY=tu_api_key_aqui
```

- Anthropic API key: https://console.anthropic.com/ → API Keys
- Google Books API key: https://console.cloud.google.com/ → APIs & Services → Credentials → habilitar Books API

**NUNCA** subir estas keys al repositorio ni al frontend.

---

## FASE 6: Pantallas de resultados

En `App.tsx`, los cases `results`, `dedication` y `share` muestran un placeholder `🚧`. Hay que crear estas pantallas.

### Paso 6.1 — `src/screens/Results.tsx`

- Header: badge dorado "LES TEVES RECOMANACIONS" + título + subtítulo con el destinatario
- Al montar: llamar `fireConfetti()` + `saveResult()` (localStorage) + `trackEvent('search_complete')`
- 3 BookCards con: portada (o placeholder de color), título, autor, sinopsis, "per què és perfecte", precio, botón "Buscar en llibreries" (abre Google en nueva pestaña)
- Cards clicables: al seleccionar una, border primary + shadow + aparece botón "Generar dedicatòria per '[títol]' ✍️"
- Botón secundario: "Compartir resultats →" → va a pantalla Share

### Paso 6.2 — `src/screens/Dedication.tsx`

- Header con ✍️ + título + nombre del libro seleccionado
- Card de dedicatoria estética manuscrita (tipografía Caveat, fondo #FFFDF7, comilla decorativa 48px)
- Dos botones: "📋 Copiar text" (clipboard + toast "✓ Copiat!" 2s) y "✏️ Editar" (textarea editable)
- Botón primario: "Compartir tot 🌹" → pantalla Share
- Link "← Tornar als resultats"
- `trackEvent('dedication_copy')` al copiar

### Paso 6.3 — `src/screens/Share.tsx`

- Header 🌹📚 + título "Comparteix-ho!"
- 3 botones de compartir:
  - WhatsApp (bg #25D366): abre `wa.me` con texto + URL
  - Instagram (gradient): copia link + toast "Enllaç copiat!"
  - Copiar enlace (bg white, border): clipboard + toast
- Bloque follow (bg gold-light, borde gold): botón Instagram + botón reseña Google
- Botón "🔄 Trobar un altre llibre" (bg gold): resetea wizard al paso 1
- `trackEvent('share', { platform: '...' })` en cada botón

### Paso 6.4 — `src/screens/SharedResult.tsx`

- Carga el resultado por ID desde localStorage
- Muestra las BookCards en modo solo lectura (sin interacción de selección)
- CTA al final: "Vols trobar el teu llibre perfecte? 🌹" + botón que lleva a la landing
- `trackEvent('shared_result_view', { resultId })`

### Paso 6.5 — Conectar pantallas en App.tsx

Reemplazar los placeholders `🚧` de los cases `results`, `dedication` y `share` con los componentes reales.
Pasar las props necesarias desde el estado del wizard (`state.results`, `state.selectedBookIndex`, etc.).

---

## FASE 7: Routing

### Paso 7.1 — Configurar TanStack Router

Añadir la ruta `/r/:resultId` → `SharedResult.tsx`.
La ruta `/` sigue usando estado interno (no rutas separadas para cada pantalla del wizard).

---

## FASE 8: PWA y Analytics

### Paso 8.1 — PWA

- Crear `public/manifest.json` (contenido en `PASOS-CLAUDE-CODE.md` → Fase 8)
- Crear `public/sw.js` (service worker básico con cache)
- Añadir en `index.html`: link al manifest + `<meta name="theme-color" content="#C41E3A">` + apple-touch-icon
- Registrar el service worker en `src/main.tsx`
- Crear iconos: `public/icons/icon-192.png` y `public/icons/icon-512.png` (rosa sobre fondo crema)

### Paso 8.2 — Analytics (Plausible)

Añadir en `index.html`:
```html
<script defer data-domain="trobaelteulibre.cat" src="https://plausible.io/js/script.js"></script>
```

Verificar que `trackEvent()` se llama en todos los puntos del flujo.

### Paso 8.3 — Meta tags OpenGraph

Añadir en `index.html`:
```html
<meta property="og:title" content="Troba el teu Llibre — Sant Jordi 2026 🌹📚" />
<meta property="og:description" content="La IA t'ajuda a trobar el llibre perfecte per regalar aquest Sant Jordi." />
<meta property="og:image" content="/og-image.png" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
```

Crear `public/og-image.png` (1200x630px con rosa + título + fondo crema).

---

## FASE 9: Testing y Deploy

### Paso 9.1 — Testing manual

- [ ] Flujo completo en móvil (375px): landing → wizard → resultados → dedicatoria → compartir
- [ ] Los 3 idiomas (CAT, ES, EN)
- [ ] Botones de compartir (WhatsApp, copiar link)
- [ ] Confetti al ver resultados
- [ ] Sonido al avanzar en el wizard
- [ ] Dedicatoria se copia al portapapeles
- [ ] Resultados guardados en localStorage
- [ ] Manejo de errores: API falla, sin portada, rate limit (429)
- [ ] Ruta `/r/:id` con resultado compartido
- [ ] Probar con 5-10 personas en sus móviles

### Paso 9.2 — Deploy en Vercel

```bash
npm install -g vercel
vercel
```

Configurar en el dashboard de Vercel:
- `ANTHROPIC_API_KEY`
- `GOOGLE_BOOKS_API_KEY`

Conectar dominio `trobaelteulibre.cat` si está disponible.

### Paso 9.3 — Verificar en producción

- [ ] Carga en móvil < 3 segundos
- [ ] Flujo completo funciona end-to-end
- [ ] Analytics registran eventos
- [ ] La PWA se puede instalar
- [ ] OpenGraph se ve bien al compartir en WhatsApp
- [ ] Rate limiting funciona

---

## Prioridad para llegar al jueves 16

| Prioridad | Qué | Sin esto... |
|-----------|-----|-------------|
| 🔴 CRÍTICO | Backend (Fase 5) | La app no funciona en absoluto |
| 🔴 CRÍTICO | Results.tsx (Fase 6.1) | No se ven los resultados |
| 🟠 IMPORTANTE | Dedication + Share (Fase 6.2-6.3) | Se pierde el factor viral |
| 🟡 NICE TO HAVE | TanStack Router (Fase 7) | Sin ruta `/r/:id` compartible |
| 🟡 NICE TO HAVE | PWA + OG tags (Fase 8) | Funciona, pero peor en móvil y WhatsApp |
| 🟢 POST-LANZAMIENTO | SharedResult, Analytics, Testing exhaustivo | |
