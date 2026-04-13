# INSTRUCCIONES PASO A PASO — Troba el teu Llibre

Lee este documento completo antes de empezar. Sigue los pasos en orden.
Para el detalle de diseño, contenido y traducciones de cada pantalla, consulta `BRIEF-WEBAPP-SANT-JORDI.md`.

---

## FASE 1: Setup del proyecto

### Paso 1.1 — Inicializar proyecto
```bash
npm create vite@latest troba-el-teu-llibre -- --template react-ts
cd troba-el-teu-llibre
npm install
```

### Paso 1.2 — Instalar dependencias
```bash
# Estilos
npm install tailwindcss @tailwindcss/vite

# Routing
npm install @tanstack/react-router

# Utilidades
npm install canvas-confetti
npm install --save-dev @types/canvas-confetti
```

### Paso 1.3 — Configurar Tailwind 4
Configurar el plugin de Tailwind en `vite.config.ts` y definir los custom colors de la paleta en el CSS:

```
primary: #C41E3A
primary-light: #FFF5F5
text: #2D2D2D
text-secondary: #777777
text-muted: #999999
cream: #F5F0E8
cream-dark: #E5DDD0
gold: #8B6914
gold-light: #FFF9EE
green: #2D5016
```

### Paso 1.4 — Importar fuentes de Google Fonts
En `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&family=Caveat:wght@400;500&display=swap" rel="stylesheet" />
```

### Paso 1.5 — Estructura de carpetas
```
src/
├── components/
│   ├── ui/              # Componentes reutilizables (botones, cards, toast)
│   ├── wizard/          # Componentes del wizard (cada paso)
│   └── results/         # Componentes de resultados y dedicatoria
├── screens/
│   ├── Landing.tsx
│   ├── Wizard.tsx
│   ├── Loading.tsx
│   ├── Results.tsx
│   ├── Dedication.tsx
│   ├── Share.tsx
│   └── SharedResult.tsx  # Para la ruta /r/:id
├── api/
│   └── recommend.ts      # Llamada al backend
├── i18n/
│   ├── translations.ts   # Todas las traducciones CAT/ES/EN
│   ├── recipients.ts     # Opciones de recipiente por idioma
│   └── genres.ts         # Opciones de género por idioma
├── hooks/
│   ├── useWizard.ts      # Estado del wizard
│   ├── useLanguage.ts    # Contexto de idioma
│   └── useLocalStorage.ts # Guardar/recuperar resultados
├── lib/
│   ├── analytics.ts      # Funciones de tracking (Plausible)
│   ├── confetti.ts       # Configuración del confetti
│   └── sound.ts          # Sonido de página
├── types/
│   └── index.ts          # Tipos TypeScript
├── App.tsx
└── main.tsx
public/
├── manifest.json          # PWA
├── sw.js                  # Service worker
├── sounds/
│   └── page-turn.mp3     # Sonido de página (buscar en freesound.org)
└── icons/
    ├── icon-192.png       # Icono PWA
    └── icon-512.png       # Icono PWA
```

---

## FASE 2: Tipos e internacionalización

### Paso 2.1 — Definir tipos TypeScript

Crear `src/types/index.ts`:

```typescript
export type Language = 'cat' | 'es' | 'en';

export interface Recipient {
  id: string;
  emoji: string;
  label: string;
}

export interface Genre {
  id: string;
  emoji: string;
  label: string;
}

export interface WizardData {
  recipient: string | null;
  description: string;
  genres: string[];
  lastBook: string;
  preferredLanguage: string;
  budget: string;
}

export interface BookRecommendation {
  title: string;
  author: string;
  synopsis: string;
  whyPerfect: string;
  priceEstimate: string;
  coverUrl: string | null;
}

export interface RecommendationResponse {
  books: BookRecommendation[];
  dedication: string;
  resultId: string;
}

export interface SavedResult {
  id: string;
  timestamp: number;
  recipient: string;
  books: BookRecommendation[];
  dedication: string;
}
```

### Paso 2.2 — Crear archivo de traducciones

Crear `src/i18n/translations.ts` con TODAS las traducciones en CAT, ES, EN.
El contenido completo está en la sección "Features confirmadas" del archivo `BRIEF-WEBAPP-SANT-JORDI.md`.
Incluye: todos los textos de UI, labels, botones, errores, placeholders.

### Paso 2.3 — Crear datos de recipientes y géneros

Crear `src/i18n/recipients.ts` y `src/i18n/genres.ts` con las opciones por idioma.
El contenido está en `BRIEF-WEBAPP-SANT-JORDI.md` sección "Features confirmadas".

### Paso 2.4 — Crear hook de idioma

Crear `src/hooks/useLanguage.ts`:
- React Context que provee `language` y `setLanguage` a toda la app
- Función `t(key)` que devuelve la traducción según el idioma activo
- Detección automática del idioma del navegador al cargar:
  - `navigator.language` empieza con 'ca' → 'cat'
  - empieza con 'es' → 'es'
  - cualquier otro → 'en'

---

## FASE 3: Componentes base y utilidades

### Paso 3.1 — Componentes UI reutilizables

Crear en `src/components/ui/`:

- `Button.tsx` — botón primario (bg primary, white text, rounded-xl, shadow) y secundario (border, transparent bg)
- `SelectCard.tsx` — card seleccionable con emoji + label. Props: selected, onClick, emoji, label. Cuando selected: border primary + bg primary-light
- `SelectChip.tsx` — pill seleccionable para géneros. Mismo patrón que SelectCard pero formato pill/chip
- `OptionButton.tsx` — botón tipo radio para idioma/presupuesto. Fila de opciones, una activa
- `ProgressBar.tsx` — 5 segmentos, recibe currentStep. Segmentos completados en primary, resto en cream-dark
- `Toast.tsx` — notificación temporal que aparece arriba, desaparece en 2s. Para "Copiat!", errores, etc.

### Paso 3.2 — Utilidades

Crear `src/lib/analytics.ts`:
```typescript
export function trackEvent(name: string, props?: Record<string, string>) {
  if (typeof window !== 'undefined' && (window as any).plausible) {
    (window as any).plausible(name, { props });
  }
}
```

Crear `src/lib/confetti.ts`:
```typescript
import confetti from 'canvas-confetti';

export function fireConfetti() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.3 },
    colors: ['#C41E3A', '#8B6914', '#2D5016', '#F5F0E8'],
    decay: 0.92,
    gravity: 0.8
  });
}
```

Crear `src/lib/sound.ts`:
```typescript
let pageSound: HTMLAudioElement | null = null;

export function playPageTurn() {
  if (!pageSound) {
    pageSound = new Audio('/sounds/page-turn.mp3');
    pageSound.volume = 0.3;
  }
  pageSound.currentTime = 0;
  pageSound.play().catch(() => {});
}
```

Crear `src/hooks/useLocalStorage.ts`:
```typescript
// Funciones para guardar y recuperar resultados anteriores
// saveResult(result, recipient) — guarda en localStorage, máximo 10
// getSavedResults() — devuelve array de SavedResult
// Detalle en BRIEF-WEBAPP-SANT-JORDI.md sección "LocalStorage"
```

---

## FASE 4: El Wizard (pantallas 1-6)

### Paso 4.1 — Hook del wizard

Crear `src/hooks/useWizard.ts`:
- Maneja el estado completo del wizard (currentStep, todos los datos del formulario)
- Funciones: nextStep(), prevStep(), setField(), reset()
- nextStep() llama a playPageTurn() y trackEvent()
- Validación por paso: paso 1 requiere recipient, paso 2 requiere >10 chars, paso 3 requiere >0 géneros

### Paso 4.2 — Pantalla Landing

Crear `src/screens/Landing.tsx`:
- Layout centrado vertical (flexbox, justify-center, min-h-screen)
- Rosa emoji grande (56px) con animación de entrada (scale 0.8→1)
- Textos según idioma usando hook t()
- Botón CTA primario grande
- Toggle de idioma: CAT | ES | EN (3 botones, activo en primary)
- Si hay resultados guardados en localStorage: mostrar sección "Les teves cerques anteriors" debajo del CTA
- Footer: "Creat per [agencia]"
- Fondo: cream (#F5F0E8) en toda la pantalla

### Paso 4.3 — Wizard Step 1: Recipient

Crear `src/components/wizard/Step1Recipient.tsx`:
- ProgressBar step 1
- Título + subtítulo desde traducciones
- Grid 2 columnas con SelectCard para cada recipient
- Botón continuar (disabled hasta seleccionar)
- Botón atrás (vuelve a landing)

### Paso 4.4 — Wizard Step 2: Description

Crear `src/components/wizard/Step2Description.tsx`:
- ProgressBar step 2
- Textarea con auto-grow (crece con el contenido)
- Placeholder desde traducciones
- Caja de tip debajo (bg gold-light, borde gold)
- Botón continuar (disabled si <10 chars)

### Paso 4.5 — Wizard Step 3: Genres

Crear `src/components/wizard/Step3Genres.tsx`:
- ProgressBar step 3
- Flex wrap con SelectChip para cada género (multi-select)
- Contador de seleccionados debajo
- Botón continuar (disabled si 0 seleccionados)

### Paso 4.6 — Wizard Step 4: Last Book

Crear `src/components/wizard/Step4LastBook.tsx`:
- ProgressBar step 4
- Input de texto (no textarea) con placeholder
- Link "No ho sé, saltar →" en primary que avanza al paso 5
- Botón continuar siempre activo (campo opcional)

### Paso 4.7 — Wizard Step 5: Preferences

Crear `src/components/wizard/Step5Preferences.tsx`:
- ProgressBar step 5 (completo)
- Sección "Idioma preferit" con 4 OptionButton en fila (Català, Castellà, Anglès, Tant se val). Default: Tant se val
- Sección "Pressupost" con 4 OptionButton (< 15€, 15-25€, > 25€, Tant se val). Default: Tant se val
- Botón final dice "Troba els llibres! 📚" (texto diferente al de pasos anteriores)
- Al click: transicionar a pantalla de loading + disparar la llamada API

---

## FASE 5: Backend — API Route

### Paso 5.1 — Crear el servidor backend

Para servir la API route necesitas un backend. Opciones:
- **Si usas Vercel para deploy:** crear `api/recommend.ts` como serverless function de Vercel
- **Si prefieres un backend separado:** crear un servidor Express/Hono mínimo

La función debe:
1. Recibir POST con los datos del wizard
2. Llamar a la API de Anthropic (Claude) con el prompt
3. Parsear el JSON de Claude
4. Para cada libro: buscar portada
5. Devolver el resultado al frontend

### Paso 5.2 — Llamada a Claude

```typescript
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01'
  },
  body: JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1500,
    system: `Ets un expert en literatura amb profund coneixement de llibreries de Barcelona i Catalunya. L'usuari busca un regal de Sant Jordi. Fes recomanacions de llibres REALS que existeixin, amb autors reals. Respon NOMÉS amb JSON vàlid, sense cap text addicional, backticks ni markdown.`,
    messages: [{
      role: 'user',
      content: `Busco un regal de Sant Jordi per a: ${recipient}
Descripció de la persona: ${description}
Gèneres preferits: ${genres.join(', ')}
Últim llibre que li va agradar: ${lastBook || 'No especificat'}
Idioma preferit del llibre: ${preferredLanguage}
Pressupost: ${budget}

Respon amb exactament aquest format JSON:
{
  "books": [
    {
      "title": "títol del llibre",
      "author": "nom de l'autor",
      "isbn": "ISBN si el coneixes, sinó string buit",
      "synopsis": "sinopsi breu de 2-3 línies en ${appLanguage === 'cat' ? 'català' : appLanguage === 'es' ? 'castellà' : 'anglès'}",
      "why_perfect": "1-2 línies explicant per què és ideal per a aquesta persona, en ${appLanguage === 'cat' ? 'català' : appLanguage === 'es' ? 'castellà' : 'anglès'}",
      "price_estimate": "preu estimat en euros, ex: 14.90"
    }
  ],
  "dedication": "dedicatòria curta i emotiva per al primer llibre, personalitzada per a ${recipient}, en ${appLanguage === 'cat' ? 'català' : appLanguage === 'es' ? 'castellà' : 'anglès'}"
}`
    }]
  })
});

const data = await response.json();
const result = JSON.parse(data.content[0].text);
```

**IMPORTANTE:** Si Claude no devuelve JSON válido, reintentar 1 vez. Si falla de nuevo, devolver error 500.

### Paso 5.3 — Buscar portadas

Para cada libro del resultado de Claude, ejecutar esta función:

```typescript
async function getBookCover(title: string, author: string, isbn: string): Promise<string | null> {
  
  // 1. Google Books API
  try {
    const query = isbn 
      ? `isbn:${isbn}` 
      : `intitle:${encodeURIComponent(title)}+inauthor:${encodeURIComponent(author)}`;
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${process.env.GOOGLE_BOOKS_API_KEY}`
    );
    const data = await res.json();
    const thumbnail = data.items?.[0]?.volumeInfo?.imageLinks?.thumbnail;
    if (thumbnail) {
      return thumbnail.replace('http://', 'https://').replace('zoom=1', 'zoom=2');
    }
  } catch (e) {
    console.error('Google Books error:', e);
  }

  // 2. Open Library (fallback, no necesita API key)
  try {
    if (isbn) {
      return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
    }
    const res = await fetch(
      `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}&limit=1`
    );
    const data = await res.json();
    const coverId = data.docs?.[0]?.cover_i;
    if (coverId) {
      return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
    }
  } catch (e) {
    console.error('Open Library error:', e);
  }

  return null;
}
```

### Paso 5.4 — Generar ID y devolver respuesta

```typescript
// Generar ID único para la URL de compartir
const resultId = crypto.randomUUID().substring(0, 8);

// TODO: En producción, guardar el resultado en una base de datos (Vercel KV, Supabase, etc.)
// para que la ruta /r/:id funcione. Para el MVP, se puede usar localStorage en el frontend.

// Respuesta final
return {
  books: booksWithCovers,
  dedication: result.dedication,
  resultId
};
```

### Paso 5.5 — Rate limiting

Implementar rate limit básico: máximo 10 peticiones por IP por hora.
Si se excede: devolver HTTP 429 con mensaje de error.
Opciones: usar un Map en memoria (para serverless no persiste entre calls, pero limita ráfagas) o usar Vercel KV / Upstash Redis.

### Paso 5.6 — Variables de entorno

Crear `.env`:
```
ANTHROPIC_API_KEY=tu_api_key_aqui
GOOGLE_BOOKS_API_KEY=tu_api_key_aqui
```

**NUNCA** subir estas keys al frontend. Solo se usan en la API route/backend.

Para obtener las keys:
- Anthropic: https://console.anthropic.com/ → API Keys
- Google Books: https://console.cloud.google.com/ → APIs & Services → Credentials → Create API Key → habilitar Books API

---

## FASE 6: Pantallas de resultados (7-10)

### Paso 6.1 — Pantalla Loading

Crear `src/screens/Loading.tsx`:
- Layout centrado (flex, items-center, justify-center, min-h-screen)
- Rosa emoji 64px con animación CSS pulse (scale 1→1.1→1, infinite, 1.5s)
- Texto rotativo: cambiar cada 2 segundos con transición fade. Textos desde traducciones (loading_1, loading_2, loading_3)
- 3 dots que se llenan secuencialmente (cada 400ms)
- Esta pantalla se muestra mientras la llamada a `/api/recommend` está en curso
- Cuando la API responde con éxito → transición a Results + disparar confetti
- Si error → mostrar mensaje de error con botón reintentar

### Paso 6.2 — Pantalla Results

Crear `src/screens/Results.tsx`:
- Header: badge gold "LES TEVES RECOMANACIONS" + título "3 llibres perfectes" + subtítulo "Per a la teva [recipient]"
- Al montar: llamar fireConfetti() de `src/lib/confetti.ts`
- Al montar: llamar saveResult() para guardar en localStorage
- Al montar: trackEvent('search_complete')
- 3 BookCard components, cada uno con:
  - Portada (img si coverUrl existe, placeholder div si no — colores: ["#8B2332", "#2C3E2D", "#8B6914"])
  - Título (Playfair Display, 15px, bold) + Autor (12px, muted)
  - "Per què és perfecte": texto de whyPerfect
  - Precio en primary bold
  - Badge "Buscar en llibreries →" que abre Google search en nueva pestaña
- Cards son clicables: al seleccionar, border primary + shadow
- Al seleccionar un libro: aparece botón "Generar dedicatòria per '[título]' ✍️"
- Botón secundario: "Compartir resultats →" → va a pantalla Share

### Paso 6.3 — Pantalla Dedication

Crear `src/screens/Dedication.tsx`:
- Header con ✍️ + título + subtítulo con nombre del libro
- Card de dedicatoria:
  - Fondo #FFFDF7 (crema cálido)
  - Comilla decorativa grande en Playfair Display 48px, color cream-dark
  - Texto de la dedicatoria en Caveat 17px, italic, line-height 1.8
  - Firma/cierre en primary, text-align right
  - Border cream-dark, border-radius 16px, shadow sutil
- Dos botones iguales:
  - "📋 Copiar text" → navigator.clipboard.writeText() + cambiar texto a "✓ Copiat!" por 2s + trackEvent('dedication_copy')
  - "✏️ Editar" → convertir texto a textarea editable. Botón cambia a "✓ Fet"
- Botón primario: "Compartir tot 🌹" → pantalla Share
- Link: "← Tornar als resultats"

### Paso 6.4 — Pantalla Share

Crear `src/screens/Share.tsx`:
- Header con 🌹📚 + título "Comparteix-ho!" + subtítulo
- 3 botones de compartir full-width:
  - WhatsApp (bg #25D366): abre wa.me con texto predefinido + URL
  - Instagram (bg gradient purple→pink→orange): copia link + toast "Enllaç copiat! Enganxa'l a la teva story"
  - Copiar enlace (bg white, border): clipboard + toast
  - Cada botón: trackEvent('share', { platform: '...' })
- **BLOQUE FOLLOW** (bg gold-light, border-radius 14px, border gold):
  - Título: "T'ha agradat? 🌹"
  - Subtítulo: "Ajuda'ns a arribar a més gent"
  - Botón: "📷 Segueix-nos a Instagram" → abre tu perfil + trackEvent('cta_click', {type: 'instagram_follow'})
  - Botón: "⭐ Deixa'ns una ressenya a Google" → abre tu ficha Google + trackEvent('cta_click', {type: 'google_review'})
- Botón "🔄 Trobar un altre llibre per a algú més" (bg gold): resetea wizard → paso 1 + trackEvent('restart_wizard')
- Footer: créditos agencia + CTA servicios

### Paso 6.5 — Ruta compartida /r/:id

Crear `src/screens/SharedResult.tsx`:
- Carga el resultado guardado por su ID
- Muestra las mismas BookCards que Results pero sin interacción de selección
- Al final: CTA grande (bg primary, white text): "Vols trobar el teu llibre perfecte? 🌹" + botón "Troba el teu llibre →" que lleva a la landing
- trackEvent('shared_result_view', { resultId })

---

## FASE 7: Routing y App

### Paso 7.1 — Configurar TanStack Router

Dos rutas:
- `/` → App principal (Landing → Wizard → Loading → Results → Dedication → Share). Las pantallas se manejan con estado interno, no con rutas separadas.
- `/r/:resultId` → SharedResult

### Paso 7.2 — App.tsx

- LanguageProvider envolviendo toda la app
- Router
- Fondo global: bg cream (#F5F0E8), min-h-screen
- Max-width del contenido: 480px centrado (es mobile-first)

---

## FASE 8: PWA y Analytics

### Paso 8.1 — PWA

Crear `public/manifest.json`:
```json
{
  "name": "Troba el teu Llibre — Sant Jordi 2026",
  "short_name": "Troba Llibre",
  "description": "Troba el llibre perfecte per regalar aquest Sant Jordi amb ajuda de la IA",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#F5F0E8",
  "theme_color": "#C41E3A",
  "orientation": "portrait",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

Crear `public/sw.js` (service worker básico con cache).

En `index.html`: añadir link al manifest + meta theme-color + apple-touch-icon.

En `src/main.tsx`: registrar service worker.

Crear iconos: rosa estilizada sobre fondo crema en 192x192 y 512x512.

### Paso 8.2 — Analytics (Plausible)

En `index.html`:
```html
<script defer data-domain="trobaelteulibre.cat" src="https://plausible.io/js/script.js"></script>
```

Asegurarse de que trackEvent() se llama en todos los puntos indicados en cada pantalla.

### Paso 8.3 — Meta tags OpenGraph

En `index.html`:
```html
<meta property="og:title" content="Troba el teu Llibre — Sant Jordi 2026 🌹📚" />
<meta property="og:description" content="La IA t'ajuda a trobar el llibre perfecte per regalar aquest Sant Jordi." />
<meta property="og:image" content="/og-image.png" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
```

Crear `public/og-image.png`: imagen 1200x630 con el diseño de la app (rosa + título + fondo crema).

---

## FASE 9: Testing y deploy

### Paso 9.1 — Testing manual
- [ ] Probar TODO el flujo en móvil (375px): landing → wizard completo → resultados → dedicatoria → compartir
- [ ] Probar los 3 idiomas (CAT, ES, EN)
- [ ] Probar que los botones de compartir funcionan (WhatsApp, copiar link)
- [ ] Probar que el confetti se dispara al ver resultados
- [ ] Probar que el sonido suena al avanzar en el wizard
- [ ] Probar que la dedicatoria se copia al portapapeles
- [ ] Probar que los resultados se guardan en localStorage
- [ ] Probar manejo de errores: ¿qué pasa si la API falla? ¿si no hay portada?
- [ ] Probar rate limiting
- [ ] Probar la ruta /r/:id con un resultado compartido
- [ ] Pedir a 5-10 personas que lo prueben en sus móviles

### Paso 9.2 — Deploy en Vercel
```bash
npm install -g vercel
vercel
```

Configurar variables de entorno en Vercel dashboard:
- `ANTHROPIC_API_KEY`
- `GOOGLE_BOOKS_API_KEY`

Conectar dominio custom si tienes uno (trobaelteulibre.cat).

### Paso 9.3 — Verificar en producción
- [ ] La app carga rápido en móvil (<3s)
- [ ] El flujo completo funciona end-to-end
- [ ] Los analytics registran eventos
- [ ] La PWA se puede instalar
- [ ] Los meta tags OpenGraph se ven bien al compartir en WhatsApp
- [ ] El rate limiting funciona

---

## Resumen de APIs externas que se usan

| API | Para qué | Auth | Coste |
|-----|----------|------|-------|
| Anthropic Claude | Generar recomendaciones + dedicatoria | API key (backend) | Pay per use (~$0.003 por petición con Sonnet) |
| Google Books | Buscar portadas de libros | API key (backend) | Gratis (1000 req/día) |
| Open Library | Fallback de portadas | No necesita key | Gratis (1 req/segundo) |
| Plausible | Analytics | Script tag (frontend) | Gratis <10K pageviews/mes |

---

## Orden de prioridad si vas corto de tiempo

1. **MÍNIMO VIABLE:** Landing + Wizard + Loading + Results (sin dedicatoria, sin compartir, sin PWA, sin sonido)
2. **VERSIÓN BUENA:** + Dedicatoria + Compartir (WhatsApp + copiar link) + Confetti + Analytics
3. **VERSIÓN COMPLETA:** + PWA + Sonido + LocalStorage + Follow block + 3 idiomas + Ruta /r/:id + OpenGraph
