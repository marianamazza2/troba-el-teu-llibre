# Troba el teu Llibre — Sant Jordi 2026
## Brief técnico completo para desarrollo

---

## Descripción general

Webapp mobile-first para recomendar libros personalizados para Sant Jordi usando AI (Claude API). El usuario describe a quién quiere regalar un libro, y la app recomienda 3 libros perfectos con dedicatoria personalizada.

**URL objetivo:** trobaelteulibre.cat (o similar)
**Target:** cualquier persona en Barcelona/Catalunya buscando regalo de Sant Jordi
**Idiomas:** Catalán (default) + Castellano (toggle)

---

## Stack

- Vite + React + TypeScript
- Tailwind CSS 4
- TanStack Router (rutas: `/`, `/r/:id` para resultados compartidos)
- Backend: serverless function o API route para llamada a Claude (NO exponer API key en frontend)

---

## Diseño global

### Paleta de colores (definir como variables de Tailwind)

| Token | Hex | Uso |
|-------|-----|-----|
| `primary` | `#C41E3A` | CTAs, acentos, links, selección activa |
| `primary-light` | `#FFF5F5` | Background de elementos seleccionados |
| `text` | `#2D2D2D` | Texto principal, headers |
| `text-secondary` | `#777777` | Texto secundario, descripciones |
| `text-muted` | `#999999` | Placeholders, texto terciario |
| `cream` | `#F5F0E8` | Fondo principal de la app |
| `cream-dark` | `#E5DDD0` | Bordes, separadores, elementos inactivos |
| `gold` | `#8B6914` | Detalles premium, badges, decorativos |
| `gold-light` | `#FFF9EE` | Background de tips y notas |
| `green` | `#2D5016` | Elementos secundarios naturales |
| `white` | `#FFFFFF` | Cards, inputs, elementos elevados |

### Tipografía (importar de Google Fonts)

| Uso | Font | Weights |
|-----|------|---------|
| Títulos / Headers | Playfair Display | 700, 800 |
| Cuerpo / UI | DM Sans | 400, 500, 600, 700 |
| Dedicatoria (cursiva manuscrita) | Caveat | 400, 500 |

### Principios de diseño

- **Mobile-first**: diseñar para 375px de ancho. El 90%+ del tráfico viene de Instagram/WhatsApp en móvil
- **Fondo cream** (`#F5F0E8`) en toda la app — sensación de página de libro
- **Cards en blanco** (`#FFFFFF`) con border `cream-dark` y border-radius `14px`
- **Botones primarios**: `primary` con texto blanco, border-radius `12px`, font-weight `700`, sombra suave `rgba(196,30,58,0.3)`
- **Transiciones suaves** entre pantallas: fade + slide-up sutil (200-300ms)
- **Sin scroll horizontal** en ningún momento
- **Textura sutil** de papel en el fondo si es posible (opcional, pattern CSS o SVG sutil)

---

## Estructura de rutas

```
/                → App principal (landing + wizard + resultados)
/r/:resultId     → Resultado compartido (ver recomendaciones de otro usuario + CTA para usar la app)
```

La app principal maneja las pantallas internamente con estado de React (no rutas separadas por cada paso del wizard). Solo `/r/:id` es una ruta real para resultados compartidos.

---

## Pantallas

---

### PANTALLA 1: Landing / Home

**Ruta:** `/`
**Propósito:** primera impresión, explicar qué hace la app, invitar a empezar

#### Layout (centrado vertical, todo en una pantalla sin scroll)

```
[                                    ]
[          🌹 (rosa grande)          ]
[                                    ]
[      SANT JORDI 2026               ]  ← lettering pequeño, gold, uppercase, letter-spacing 4px
[                                    ]
[      Troba el teu                  ]  ← Playfair Display 30px bold
[      Llibre                        ]
[                                    ]
[   No saps quin llibre regalar?     ]  ← DM Sans 14px, text-secondary
[   La intel·ligència artificial     ]
[   t'ajuda a trobar el regal        ]
[   perfecte.                        ]
[                                    ]
[  [ Troba el teu llibre →        ]  ]  ← Botón primario grande, padding 16px 32px
[                                    ]
[        CAT  |  ES  |  EN          ]  ← Toggle idioma, detectar auto por navegador
[                                    ]     Activo: primary + underline. Inactivos: muted
[                                    ]
[  ─────────────────────────────────  ]
[  Creat amb codi i IA per           ]  ← Texto 10px, muted
[  Tu Agencia                        ]  ← gold, font-weight 600
[                                    ]
```

#### Comportamiento
- Al click en "Troba el teu llibre" → transición a Pantalla 2 (wizard paso 1)
- Toggle CAT/ES cambia el idioma de toda la app (guardar en state/context)
- La rosa puede tener una animación sutil de entrada (scale de 0.8 a 1, con ease-out)

#### Contenido en castellano (alternativo)
- "¿No sabes qué libro regalar?"
- "La inteligencia artificial te ayuda a encontrar el regalo perfecto."
- "Encuentra tu libro →"

---

### PANTALLA 2: Wizard Paso 1 — ¿Para quién es?

**Propósito:** identificar la relación con el receptor del regalo

#### Layout

```
[  ■ ■ □ □ □                        ]  ← Barra progreso: 5 segmentos, step 1 activo (primary)
[                                    ]
[  Per a qui és                      ]  ← Playfair Display 22px bold
[  el regal?                         ]
[  Tria la persona especial 🌹       ]  ← DM Sans 13px, text-muted
[                                    ]
[  ┌─────────┐ ┌─────────┐          ]
[  │   💕    │ │   🤝    │          ]  ← Grid 2 columnas, gap 10px
[  │ Parella │ │  Amic o  │          ]     Cards con border cream-dark
[  │         │ │  amiga   │          ]     Al seleccionar: border primary + bg primary-light
[  └─────────┘ └─────────┘          ]
[  ┌─────────┐ ┌─────────┐          ]
[  │   💐    │ │   🧒    │          ]
[  │ Mare o  │ │  Fill o  │          ]
[  │  Pare   │ │  filla   │          ]
[  └─────────┘ └─────────┘          ]
[  ┌─────────┐ ┌─────────┐          ]
[  │   💼    │ │   ✨    │          ]
[  │Company  │ │ Per a mi │          ]
[  │de feina │ │         │          ]
[  └─────────┘ └─────────┘          ]
[                                    ]
[  [ Continuar →                  ]  ]  ← Botón primario, disabled hasta seleccionar
[  [       ← Enrere               ]  ]  ← Link text, muted, vuelve a landing
```

#### Comportamiento
- Botón "Continuar" deshabilitado (bg cream-dark) hasta que el usuario seleccione una opción
- Al seleccionar: card obtiene border primary + bg primary-light, emoji se agranda levemente
- Solo se puede seleccionar una opción

#### Opciones (array para iterar)

```typescript
const recipients = [
  { id: "parella", emoji: "💕", label_cat: "Parella", label_es: "Pareja" },
  { id: "amic", emoji: "🤝", label_cat: "Amic o amiga", label_es: "Amigo/a" },
  { id: "mare_pare", emoji: "💐", label_cat: "Mare o Pare", label_es: "Madre o Padre" },
  { id: "fill", emoji: "🧒", label_cat: "Fill o filla", label_es: "Hijo/a" },
  { id: "company", emoji: "💼", label_cat: "Company de feina", label_es: "Compañero de trabajo" },
  { id: "mi", emoji: "✨", label_cat: "Per a mi", label_es: "Para mí" }
];
```

---

### PANTALLA 3: Wizard Paso 2 — Describe a la persona

**Propósito:** input libre donde la AI brilla — cuanto más contexto, mejor la recomendación

#### Layout

```
[  ■ ■ ■ □ □                        ]  ← Progreso step 2
[                                    ]
[  Explica'ns com és                 ]  ← Playfair Display 22px bold
[  Com més detalls, millor seran     ]  ← DM Sans 13px, text-muted
[  les recomanacions ✨               ]
[                                    ]
[  ┌──────────────────────────────┐  ]
[  │                              │  ]  ← Textarea, min-height 140px
[  │  Li agrada la natura,        │  ]     border cream-dark, border-radius 14px
[  │  viatjar per pobles petits,  │  ]     placeholder en text-muted
[  │  és molt curiosa, li         │  ]     bg white
[  │  encanten les novel·les de   │  ]
[  │  misteri...                  │  ]
[  │                              │  ]
[  └──────────────────────────────┘  ]
[                                    ]
[  ┌──────────────────────────────┐  ]
[  │ 💡 Consells per a millors    │  ]  ← Caja de tip, bg gold-light
[  │    resultats:                │  ]     border 1px gold-light (más oscuro)
[  │                              │  ]     texto 11px
[  │ Descriu la seva personalitat,│  ]
[  │ hobbies, temes que li        │  ]
[  │ interessen, o fins i tot     │  ]
[  │ pel·lícules i sèries que li  │  ]
[  │ agraden.                     │  ]
[  └──────────────────────────────┘  ]
[                                    ]
[  [ Continuar →                  ]  ]
[  [       ← Enrere               ]  ]
```

#### Comportamiento
- El textarea debe tener auto-grow (crecer con el contenido)
- Placeholder text desaparece al empezar a escribir
- Botón "Continuar" habilitado cuando hay al menos 10 caracteres escritos
- Este campo es el MÁS IMPORTANTE para la calidad de la recomendación — por eso el tip

#### Placeholder catalán
"Li agrada la natura, viatjar per pobles petits, és molt curiosa, li encanten les novel·les de misteri i les històries amb personatges femenins forts..."

#### Placeholder castellano
"Le gusta la naturaleza, viajar por pueblos pequeños, es muy curiosa, le encantan las novelas de misterio y las historias con personajes femeninos fuertes..."

---

### PANTALLA 4: Wizard Paso 3 — Géneros

**Propósito:** acotar el tipo de libro — multi-select

#### Layout

```
[  ■ ■ ■ ■ □                        ]  ← Progreso step 3
[                                    ]
[  Quins gèneres                     ]  ← Playfair Display 22px bold
[  li agraden?                       ]
[  Pots triar més d'un 📚            ]  ← DM Sans 13px, text-muted
[                                    ]
[  ┌──────────┐ ┌──────────┐         ]
[  │ 📖 Narra │ │ 🔍 Thri │         ]  ← Chips/pills, display flex wrap
[  │   tiva   │ │   ller   │         ]     padding 10px 16px, border-radius 50px
[  └──────────┘ └──────────┘         ]     border cream-dark
[  ┌──────────┐ ┌──────────┐         ]     al seleccionar: border primary + bg primary-light
[  │ 💗 Romàn│ │ 🚀 Cièn │         ]
[  │   tic    │ │ cia fic  │         ]
[  └──────────┘ └──────────┘         ]
[  ┌──────────┐ ┌──────────┐         ]
[  │ 🧠 No   │ │ 🪶 Poesi│         ]
[  │  ficció  │ │    a     │         ]
[  └──────────┘ └──────────┘         ]
[  ┌──────────┐ ┌──────────┐         ]
[  │ 💬 Còmic│ │ 🏛️ Histò│         ]
[  │          │ │   ria    │         ]
[  └──────────┘ └──────────┘         ]
[                                    ]
[  2 gèneres seleccionats            ]  ← Contador, primary, font-weight 600
[                                    ]
[  [ Continuar →                  ]  ]
[  [       ← Enrere               ]  ]
```

#### Comportamiento
- Multi-select: se pueden elegir varios
- Botón habilitado cuando hay al menos 1 seleccionado
- Mostrar contador de seleccionados debajo de los chips

#### Opciones

```typescript
const genres = [
  { id: "narrativa", emoji: "📖", label_cat: "Narrativa", label_es: "Narrativa" },
  { id: "thriller", emoji: "🔍", label_cat: "Thriller", label_es: "Thriller" },
  { id: "romantic", emoji: "💗", label_cat: "Romàntic", label_es: "Romance" },
  { id: "scifi", emoji: "🚀", label_cat: "Ciència ficció", label_es: "Ciencia ficción" },
  { id: "nofic", emoji: "🧠", label_cat: "No ficció", label_es: "No ficción" },
  { id: "poesia", emoji: "🪶", label_cat: "Poesia", label_es: "Poesía" },
  { id: "comic", emoji: "💬", label_cat: "Còmic", label_es: "Cómic" },
  { id: "historia", emoji: "🏛️", label_cat: "Història", label_es: "Historia" },
  { id: "autoajuda", emoji: "🌱", label_cat: "Autoajuda", label_es: "Autoayuda" },
  { id: "infantil", emoji: "🧸", label_cat: "Infantil/Juvenil", label_es: "Infantil/Juvenil" }
];
```

---

### PANTALLA 5: Wizard Paso 4 — Último libro

**Propósito:** input opcional para afinar la recomendación

#### Layout

```
[  ■ ■ ■ ■ ■                        ]  ← Progreso step 4
[                                    ]
[  Últim llibre que                  ]  ← Playfair Display 22px bold
[  li va agradar?                    ]
[  Opcional, però ajuda molt! 🎯     ]  ← DM Sans 13px, text-muted
[                                    ]
[  ┌──────────────────────────────┐  ]
[  │  Ex: "La sombra del viento", │  ]  ← Input text, placeholder en muted
[  │  "Sapiens"...                │  ]     border cream-dark, border-radius 14px
[  └──────────────────────────────┘  ]
[                                    ]
[        No ho sé, saltar →          ]  ← Link text en primary, salta al paso 5
[                                    ]
[  [ Continuar →                  ]  ]
[  [       ← Enrere               ]  ]
```

#### Comportamiento
- Campo OPCIONAL — botón "Continuar" siempre habilitado
- "No ho sé, saltar →" hace lo mismo que "Continuar" (avanza al paso 5)
- Si el usuario escribe algo, se incluye en el prompt a Claude

---

### PANTALLA 6: Wizard Paso 5 — Idioma y presupuesto

**Propósito:** últimos filtros antes de buscar

#### Layout

```
[  ■ ■ ■ ■ ■                        ]  ← Progreso step 5 (completo)
[                                    ]
[  Últims detalls                    ]  ← Playfair Display 22px bold
[  Quasi ho tenim! 🌹                ]  ← DM Sans 13px, text-muted
[                                    ]
[  Idioma preferit                   ]  ← Label 13px, font-weight 600
[                                    ]
[  ┌──────┐┌──────┐┌──────┐┌──────┐ ]  ← 4 botones en fila
[  │Català││Caste││Anglès││Tant  │ ]     el default es "Tant se val"
[  │      ││ llà ││      ││se val│ ]     al seleccionar: border primary + bg primary-light
[  └──────┘└──────┘└──────┘└──────┘ ]
[                                    ]
[  Pressupost                        ]  ← Label 13px, font-weight 600
[                                    ]
[  ┌──────┐┌──────┐┌──────┐┌──────┐ ]  ← 4 botones en fila
[  │< 15€ ││15-25€││> 25€ ││Tant  │ ]     default "Tant se val"
[  │      ││      ││      ││se val│ ]
[  └──────┘└──────┘└──────┘└──────┘ ]
[                                    ]
[                                    ]
[  [ Troba els llibres! 📚        ]  ]  ← Botón primario con texto diferente
[  [       ← Enrere               ]  ]
```

#### Comportamiento
- Ambos campos tienen un default de "Tant se val" (preseleccionado)
- El botón final dice "Troba els llibres! 📚" en vez de "Continuar"
- Al click → transición a pantalla de loading → llamada API

#### Opciones

```typescript
const languages = [
  { id: "catala", label_cat: "Català", label_es: "Catalán" },
  { id: "castella", label_cat: "Castellà", label_es: "Castellano" },
  { id: "angles", label_cat: "Anglès", label_es: "Inglés" },
  { id: "tant_se_val", label_cat: "Tant se val", label_es: "Da igual" }
];

const budgets = [
  { id: "under15", label: "< 15€" },
  { id: "15to25", label: "15-25€" },
  { id: "over25", label: "> 25€" },
  { id: "tant_se_val", label_cat: "Tant se val", label_es: "Da igual" }
];
```

---

### PANTALLA 7: Loading

**Propósito:** pantalla de espera mientras Claude procesa (3-8 segundos)

#### Layout (centrado vertical, sin scroll)

```
[                                    ]
[                                    ]
[                                    ]
[            🌹                      ]  ← Rosa grande (56-64px), animación pulse
[                                    ]     scale 1 → 1.1 → 1, loop infinito, 1.5s
[                                    ]
[   Buscant entre milers             ]  ← Texto rotativo, DM Sans 15px
[   de llibres...                    ]     cambia cada 2 segundos con fade
[                                    ]
[          ● ● ○                     ]  ← 3 dots, se van llenando (primary vs cream-dark)
[                                    ]     rotan cada 400ms
[                                    ]
[                                    ]
```

#### Comportamiento
- Esta pantalla aparece al enviar el formulario
- Mientras se muestra, se ejecuta la llamada POST a `/api/recommend`
- Textos rotativos (cambian cada 2s con transición fade):
  1. "Buscant entre milers de llibres..."
  2. "Llegint les teves preferències..."
  3. "Preparant les recomanacions..."
- Versiones en castellano:
  1. "Buscando entre miles de libros..."
  2. "Leyendo tus preferencias..."
  3. "Preparando las recomendaciones..."
- Cuando la API responde → transición a pantalla de resultados
- Si hay error → mostrar mensaje amable con botón de reintentar

#### Llamada API (ejecutar aquí)

```typescript
// POST a tu API route
const response = await fetch("/api/recommend", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    recipient: selectedRecipient,    // "parella", "amic", etc.
    description: descriptionText,     // texto libre del usuario
    genres: selectedGenres,           // ["narrativa", "thriller"]
    lastBook: lastBookText || null,   // opcional
    language: selectedLanguage,       // "catala", "castella", etc.
    budget: selectedBudget,           // "under15", "15to25", etc.
    appLanguage: currentLanguage      // "cat" o "es" — para que Claude responda en el idioma correcto
  })
});
```

---

### API ROUTE: /api/recommend

**Este es el backend que llama a Claude y a las APIs de libros.**

#### Prompt para Claude

```
System prompt:
"Ets un expert en literatura amb profund coneixement de llibreries de Barcelona i Catalunya. L'usuari busca un regal de Sant Jordi. Fes recomanacions de llibres REALS que existeixin, amb autors reals. Respon NOMÉS amb JSON vàlid, sense cap text addicional, backticks ni markdown."

User prompt:
"Busco un regal de Sant Jordi per a: {recipient}
Descripció de la persona: {description}
Gèneres preferits: {genres}
Últim llibre que li va agradar: {lastBook || 'No especificat'}
Idioma preferit: {language}
Pressupost: {budget}

Respon amb exactament aquest format JSON:
{
  "books": [
    {
      "title": "títol del llibre",
      "author": "nom de l'autor",
      "isbn": "ISBN si el coneixes, sinó string buit",
      "synopsis": "sinopsi breu de 2-3 línies en {appLanguage}",
      "why_perfect": "1-2 línies explicant per què és ideal per a aquesta persona en {appLanguage}",
      "price_estimate": "preu estimat en euros, ex: 14.90"
    }
  ],
  "dedication": "dedicatòria curta i emotiva per al primer llibre, personalitzada per a {recipient}, en {appLanguage}"
}"
```

#### Flujo de portadas (ejecutar para cada libro)

```typescript
async function getBookCover(title: string, author: string, isbn: string): Promise<string | null> {
  
  // 1. INTENTO: Google Books API (mejor cobertura en catalán/castellano)
  try {
    const query = isbn 
      ? `isbn:${isbn}` 
      : `intitle:${encodeURIComponent(title)}+inauthor:${encodeURIComponent(author)}`;
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${GOOGLE_BOOKS_API_KEY}`
    );
    const data = await res.json();
    const thumbnail = data.items?.[0]?.volumeInfo?.imageLinks?.thumbnail;
    if (thumbnail) {
      // Google devuelve HTTP, cambiar a HTTPS y aumentar tamaño
      return thumbnail.replace("http://", "https://").replace("zoom=1", "zoom=2");
    }
  } catch (e) {
    console.error("Google Books error:", e);
  }

  // 2. FALLBACK: Open Library (no necesita API key)
  try {
    if (isbn) {
      // Intento directo por ISBN
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
    console.error("Open Library error:", e);
  }

  // 3. SIN PORTADA: devuelve null → el frontend muestra placeholder
  return null;
}
```

#### Response shape (lo que devuelve al frontend)

```typescript
interface BookRecommendation {
  title: string;
  author: string;
  synopsis: string;
  whyPerfect: string;
  priceEstimate: string;
  coverUrl: string | null;  // URL de portada o null para placeholder
}

interface RecommendationResponse {
  books: BookRecommendation[];
  dedication: string;
  resultId: string;  // ID único para la URL de compartir
}
```

#### Rate limiting
Implementar rate limit básico: máximo 10 peticiones por IP por hora. Devolver 429 si se excede.

---

### PANTALLA 8: Resultados

**Propósito:** mostrar las 3 recomendaciones de libros

#### Layout (scroll vertical)

```
[                                    ]
[     LES TEVES RECOMANACIONS        ]  ← 10px, uppercase, letter-spacing 3, gold
[                                    ]
[     3 llibres perfectes 📚         ]  ← Playfair Display 22px bold
[     Per a la teva parella          ]  ← 12px, text-muted
[                                    ]
[  ┌──────────────────────────────┐  ]
[  │  ┌──────┐                    │  ]  ← Card blanca, border cream-dark
[  │  │      │  L'ombra del vent  │  ]     border-radius 14px, padding 14px
[  │  │COVER │  Carlos Ruiz Zafón │  ]
[  │  │      │                    │  ]     Cover: 60x86px, border-radius 6px
[  │  │      │  Perfecte perquè   │  ]     Si no hay cover: placeholder con bg de color
[  │  └──────┘  li agrada el      │  ]     y título en blanco centrado
[  │            misteri i BCN...  │  ]
[  │                              │  ]
[  │  12,95€    Buscar en llibr→  │  ]  ← Precio en primary bold / badge en gold-light
[  └──────────────────────────────┘  ]
[                                    ]
[  ┌──────────────────────────────┐  ]
[  │  (misma estructura libro 2)  │  ]
[  └──────────────────────────────┘  ]
[                                    ]
[  ┌──────────────────────────────┐  ]
[  │  (misma estructura libro 3)  │  ]
[  └──────────────────────────────┘  ]
[                                    ]
[  [ Generar dedicatòria per      ]  ]  ← Botón primario, aparece al seleccionar libro
[  [ "L'ombra del vent" ✍️        ]  ]
[                                    ]
[  [ Compartir resultats →        ]  ]  ← Botón secundario (border cream-dark)
[                                    ]
```

#### Comportamiento
- Las 3 cards de libros son clicables (selección con border primary)
- Al seleccionar un libro → aparece botón "Generar dedicatòria"
- "Buscar en llibreries →" en cada card abre: `https://www.google.com/search?q=${title}+${author}+comprar+llibre+barcelona` en nueva pestaña
- Si coverUrl es null → mostrar div con degradado de color sólido + título del libro en blanco centrado (cada libro un color distinto para variedad)
- Botón "Compartir resultats" lleva a pantalla de compartir

#### Placeholder de portada (cuando no hay cover)

```tsx
// Colores para los placeholders de portada (uno por libro)
const placeholderColors = ["#8B2332", "#2C3E2D", "#8B6914"];

// Componente
<div className="w-[60px] h-[86px] rounded-md flex items-center justify-center p-1 shadow-md"
     style={{ background: `linear-gradient(135deg, ${color}, ${color}dd)` }}>
  <span className="text-white text-[8px] font-bold text-center leading-tight">
    {book.title}
  </span>
</div>
```

---

### PANTALLA 9: Dedicatoria

**Propósito:** mostrar la dedicatoria personalizada generada por Claude

#### Layout

```
[                                    ]
[            ✍️                      ]  ← 32px centrado
[                                    ]
[     La teva dedicatòria            ]  ← Playfair Display 22px bold
[     Personalitzada per a           ]  ← 12px, text-muted
[     L'ombra del vent               ]
[                                    ]
[  ┌──────────────────────────────┐  ]
[  │ "                            │  ]  ← Comilla decorativa grande Playfair 48px
[  │                              │  ]     cream-dark color
[  │  Per a tu, que m'has          │  ]
[  │  ensenyat que les millors     │  ]  ← Caveat 17px, italic, text-secondary
[  │  aventures comencen amb       │  ]     lineHeight 1.8
[  │  una pàgina en blanc i        │  ]     bg: #FFFDF7 (crema más cálido)
[  │  algú al costat per           │  ]     padding 24px
[  │  compartir-les.               │  ]     border cream-dark, border-radius 16px
[  │                              │  ]     shadow sutil gold
[  │  Amb tot el meu amor,        │  ]
[  │  aquest Sant Jordi 🌹         │  ]  ← primary color, text-align right
[  │                              │  ]
[  └──────────────────────────────┘  ]
[                                    ]
[  ┌────────────┐ ┌────────────┐     ]
[  │ 📋 Copiar  │ │ ✏️ Editar  │     ]  ← 2 botones iguales
[  │    text    │ │            │     ]     Copiar: border primary, bg primary-light
[  └────────────┘ └────────────┘     ]     Editar: border cream-dark, bg white
[                                    ]
[  [ Compartir tot 🌹             ]  ]  ← Botón primario
[  [    ← Tornar als resultats    ]  ]  ← Link text muted
```

#### Comportamiento
- "Copiar text" → copia el texto de la dedicatoria al portapapeles + feedback visual (cambiar texto a "✓ Copiat!" por 2 segundos)
- "Editar" → convierte el texto en un textarea editable. El botón cambia a "✓ Fet" para confirmar
- "Compartir tot" → lleva a pantalla de compartir
- La dedicatoria viene del response de la API (campo `dedication`)

---

### PANTALLA 10: Compartir + Follow

**Propósito:** viralizar la app + conseguir seguidores

#### Layout

```
[                                    ]
[          🌹📚                      ]  ← 48px centrado
[                                    ]
[     Comparteix-ho!                 ]  ← Playfair Display 22px bold
[     Envia les recomanacions o      ]  ← 13px, text-muted
[     ajuda a algú més a trobar      ]
[     el seu llibre                  ]
[                                    ]
[  ┌──────────────────────────────┐  ]
[  │  💬  Compartir per WhatsApp  │  ]  ← bg #25D366, white text, border-radius 12px
[  └──────────────────────────────┘  ]     full width, padding 14px
[                                    ]
[  ┌──────────────────────────────┐  ]
[  │  📸  Compartir a Instagram   │  ]  ← bg gradient (purple → pink → orange)
[  └──────────────────────────────┘  ]     white text
[                                    ]
[  ┌──────────────────────────────┐  ]
[  │  🔗  Copiar enllaç           │  ]  ← bg white, border cream-dark
[  └──────────────────────────────┘  ]     text-secondary
[                                    ]
[                                    ]
[  ┌──────────────────────────────┐  ]
[  │                              │  ]
[  │  T'ha agradat? 🌹             │  ]  ← BLOQUE DE FOLLOW/RESEÑA
[  │  Ajuda'ns a arribar          │  ]     bg gold-light, border-radius 14px
[  │  a més gent                  │  ]     border 1px gold (más oscuro)
[  │                              │  ]
[  │  ┌────────────────────────┐  │  ]
[  │  │ 📷 Segueix-nos a      │  │  ]  ← Botón: bg white, border cream-dark
[  │  │    Instagram           │  │  ]     al click: abre tu perfil de Instagram
[  │  └────────────────────────┘  │  ]
[  │  ┌────────────────────────┐  │  ]
[  │  │ ⭐ Deixa'ns una ressenya│  │  ]  ← Botón: bg white, border cream-dark
[  │  │    a Google             │  │  ]     al click: abre tu ficha de Google Business
[  │  └────────────────────────┘  │  ]
[  │                              │  ]
[  └──────────────────────────────┘  ]
[                                    ]
[  ┌──────────────────────────────┐  ]
[  │ 🔄 Trobar un altre llibre   │  ]  ← bg gold, white text
[  │    per a algú més            │  ]     reinicia todo el wizard
[  └──────────────────────────────┘  ]
[                                    ]
[  ─────────────────────────────────  ]
[  Creat amb codi real i IA per      ]  ← 10px, text-muted
[  Tu Agencia                        ]  ← gold, bold
[  Necessites una web o app? →       ]  ← primary, clickable → tu web/contacto
[                                    ]
```

#### Comportamiento de los botones de compartir

**WhatsApp:**
```typescript
const whatsappText = encodeURIComponent(
  `Mira quin llibre m'ha recomanat la IA per Sant Jordi! 🌹📚\n\n` +
  `📖 ${books[0].title} - ${books[0].author}\n\n` +
  `Troba el teu llibre perfecte aquí:\n${shareUrl}`
);
window.open(`https://wa.me/?text=${whatsappText}`, "_blank");
```

**Instagram:** Copiar el enlace al portapapeles + mostrar toast "Enllaç copiat! Enganxa'l a la teva story 📸"

**Copiar enlace:**
```typescript
await navigator.clipboard.writeText(shareUrl);
// Feedback: cambiar texto a "✓ Copiat!" por 2 segundos
```

**Seguir en Instagram:**
```typescript
window.open("https://instagram.com/TU_USUARIO", "_blank");
```

**Reseña Google:**
```typescript
window.open("https://g.page/r/TU_ID_GOOGLE/review", "_blank");
```

**Trobar un altre llibre:** reinicia todo el state del wizard y vuelve a pantalla 1 (wizard paso 1, no landing)

---

### RUTA: /r/:resultId — Resultado compartido

**Propósito:** cuando alguien abre un link compartido, ve las recomendaciones + CTA para usar la app

#### Layout

Es la misma pantalla de resultados (pantalla 8) pero:
- Sin opción de editar/cambiar selección
- Al final, en vez de los botones normales, un CTA grande:

```
[  (mismo layout de resultados)      ]
[                                    ]
[  ┌──────────────────────────────┐  ]
[  │                              │  ]
[  │  Vols trobar el teu          │  ]  ← bg primary, white text
[  │  llibre perfecte? 🌹         │  ]     border-radius 14px
[  │                              │  ]     padding 20px
[  │  [ Troba el teu llibre → ]   │  ]  ← Botón blanco sobre fondo rojo
[  │                              │  ]
[  └──────────────────────────────┘  ]
```

#### Meta tags OpenGraph (para preview bonito al compartir)

```html
<meta property="og:title" content="Mira les meves recomanacions de Sant Jordi 🌹📚" />
<meta property="og:description" content="La IA m'ha recomanat 3 llibres perfectes per Sant Jordi. Troba els teus!" />
<meta property="og:image" content="URL_A_IMAGEN_PREVIEW" />  <!-- crear imagen genérica de la app -->
<meta property="og:url" content="https://trobaelteulibre.cat/r/{resultId}" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
```

---

## Componentes reutilizables a crear

| Componente | Descripción |
|-----------|-------------|
| `WizardProgress` | Barra de 5 segmentos, recibe `currentStep` |
| `WizardLayout` | Wrapper con progreso + título + contenido + botón continuar + botón atrás |
| `SelectCard` | Card seleccionable con emoji + label (para recipients) |
| `SelectChip` | Pill seleccionable con emoji + label (para genres) |
| `OptionButton` | Botón de opción tipo radio (para idioma/presupuesto) |
| `BookCard` | Card de resultado con portada + info + precio |
| `BookCoverPlaceholder` | Placeholder de portada cuando no hay imagen |
| `DedicationCard` | Card con la dedicatoria en fuente manuscrita |
| `ShareButton` | Botón de compartir con icono y color de plataforma |
| `LoadingScreen` | Pantalla de carga con rosa animada y textos rotativos |
| `Toast` | Notificación temporal (para "Copiat!", errores, etc.) |

---

## Estado global del wizard

```typescript
interface WizardState {
  currentScreen: number;           // 0-9
  language: "cat" | "es" | "en";   // idioma de la UI (3 idiomas)
  recipient: string | null;        // id del recipiente seleccionado
  description: string;             // texto libre descriptivo
  genres: string[];                // ids de géneros seleccionados
  lastBook: string;                // último libro (opcional)
  preferredLanguage: string;       // idioma del libro
  budget: string;                  // presupuesto
  results: RecommendationResponse | null;  // respuesta de la API
  selectedBookIndex: number | null;        // libro seleccionado para dedicatoria
  isLoading: boolean;
  error: string | null;
  savedResults: SavedResult[];     // resultados anteriores de localStorage
}
```

---

## Manejo de errores

| Error | Comportamiento |
|-------|---------------|
| API timeout (>15s) | Mostrar "Uy, ha trigat massa. Torna-ho a provar?" con botón reintentar |
| API error 500 | Mostrar "Alguna cosa ha fallat. Torna-ho a provar?" con botón reintentar |
| API error 429 (rate limit) | Mostrar "Moltes peticions! Espera uns minuts i torna-ho a provar." |
| Sin portada de libro | Mostrar placeholder con color + título (NO dejar imagen rota) |
| JSON parse error de Claude | Reintentar la llamada 1 vez automáticamente, si falla mostrar error genérico |

---

## Features confirmadas (NO opcionales — implementar todas)

### 1. Animación de confetti al mostrar resultados

Cuando la pantalla de loading transiciona a resultados, lanzar confetti que cae desde arriba durante 2-3 segundos. Usar la librería `canvas-confetti` (ligera, sin dependencias).

```bash
npm install canvas-confetti
```

```typescript
import confetti from 'canvas-confetti';

// Disparar al montar la pantalla de resultados
confetti({
  particleCount: 80,
  spread: 70,
  origin: { y: 0.3 },
  colors: ['#C41E3A', '#8B6914', '#2D5016', '#F5F0E8'],  // colores Sant Jordi
  decay: 0.92,
  gravity: 0.8
});
```

Colores del confetti: rojo Sant Jordi, dorado, verde, crema — coherentes con la paleta.

### 2. Sonido al avanzar en el wizard

Sonido sutil de página de libro pasando al avanzar entre pasos del wizard. Usar un archivo MP3/WAV corto (0.3-0.5 segundos).

```typescript
const pageSound = new Audio('/sounds/page-turn.mp3');
pageSound.volume = 0.3;  // volumen bajo, sutil

// Llamar al avanzar de paso
const nextStep = () => {
  pageSound.play().catch(() => {});  // catch silencioso si el navegador bloquea autoplay
  setCurrentScreen(currentScreen + 1);
};
```

Buscar sonido libre de derechos en freesound.org: "book page turn" o "paper flip". El archivo debe ser pequeño (<50KB).

Respetar la preferencia del usuario: si el dispositivo está en silencio, no forzar sonido. El `.catch(() => {})` maneja esto.

### 3. PWA (Progressive Web App)

Permite que los usuarios "instalen" la webapp en su móvil como una app nativa. Se crea un icono en la pantalla de inicio y se abre a pantalla completa sin barra del navegador.

#### Archivo `manifest.json` (en la carpeta `public/`)

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
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

#### En el `index.html`

```html
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#C41E3A" />
<link rel="apple-touch-icon" href="/icons/icon-192.png" />
```

#### Service Worker básico (para que funcione offline con cache)

```typescript
// sw.js en public/
const CACHE_NAME = 'trobalibre-v1';
const URLS_TO_CACHE = ['/', '/index.html', '/sounds/page-turn.mp3'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
```

#### Registrar el service worker en `main.tsx`

```typescript
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
```

**Iconos necesarios:** crear icono de la app (la rosa 🌹 estilizada sobre fondo cream) en 192x192 y 512x512 px. Guardar en `public/icons/`.

### 4. Analytics (OBLIGATORIO — trackear todo)

Usar Plausible Analytics (privacy-friendly, no necesita cookie banner, GDPR compliant). Plan gratuito para <10K pageviews/mes — más que suficiente.

Alternativa: Vercel Analytics si deployeas en Vercel (incluido gratis).

#### Setup con Plausible

```html
<!-- En index.html -->
<script defer data-domain="trobaelteulibre.cat" src="https://plausible.io/js/script.js"></script>
```

#### Eventos custom a trackear (TODOS son importantes para tu caso de estudio)

```typescript
// Helper function
function trackEvent(name: string, props?: Record<string, string>) {
  if (window.plausible) {
    window.plausible(name, { props });
  }
}

// --- EVENTOS A IMPLEMENTAR ---

// 1. Inicio del wizard
trackEvent('wizard_start');

// 2. Cada paso completado (para ver dónde abandona la gente)
trackEvent('wizard_step', { step: 'recipient', value: selectedRecipient });
trackEvent('wizard_step', { step: 'describe', length: description.length.toString() });
trackEvent('wizard_step', { step: 'genres', count: selectedGenres.length.toString() });
trackEvent('wizard_step', { step: 'lastbook', provided: (lastBook.length > 0).toString() });
trackEvent('wizard_step', { step: 'prefs', language: selectedLanguage, budget: selectedBudget });

// 3. Búsqueda completada (llegó a resultados)
trackEvent('search_complete', { recipient: selectedRecipient, genres: selectedGenres.join(',') });

// 4. Dedicatoria generada
trackEvent('dedication_view', { book: selectedBookTitle });

// 5. Dedicatoria copiada
trackEvent('dedication_copy');

// 6. Compartir (esto es lo MÁS importante de trackear)
trackEvent('share', { platform: 'whatsapp' });
trackEvent('share', { platform: 'instagram' });
trackEvent('share', { platform: 'copy_link' });

// 7. Follow / Reseña
trackEvent('cta_click', { type: 'instagram_follow' });
trackEvent('cta_click', { type: 'google_review' });

// 8. "Trobar un altre llibre" (repetición — señal de que la app funciona)
trackEvent('restart_wizard');

// 9. Visita desde link compartido
trackEvent('shared_result_view', { resultId: resultId });

// 10. Cambio de idioma
trackEvent('language_change', { to: newLanguage });
```

#### Datos que necesitas para tu caso de estudio (reel de resultados)
- Total de usuarios únicos
- Total de recomendaciones generadas
- Tasa de completado del wizard (% que llega a resultados)
- Plataforma de share más usada
- Cuánta gente vino desde links compartidos (virality coefficient)
- Paso del wizard con más abandono

### 5. LocalStorage para resultados anteriores

Guardar cada resultado en localStorage para que el usuario pueda volver a ver sus recomendaciones anteriores.

```typescript
interface SavedResult {
  id: string;
  timestamp: number;
  recipient: string;
  books: BookRecommendation[];
  dedication: string;
}

// Guardar al recibir resultados
function saveResult(result: RecommendationResponse, recipient: string) {
  const saved: SavedResult[] = JSON.parse(localStorage.getItem('trobalibre_results') || '[]');
  saved.unshift({
    id: result.resultId,
    timestamp: Date.now(),
    recipient,
    books: result.books,
    dedication: result.dedication
  });
  // Máximo 10 resultados guardados
  localStorage.setItem('trobalibre_results', JSON.stringify(saved.slice(0, 10)));
}

// Recuperar
function getSavedResults(): SavedResult[] {
  return JSON.parse(localStorage.getItem('trobalibre_results') || '[]');
}
```

#### UI: añadir en la landing, debajo del CTA principal, si hay resultados guardados

```
[  [ Troba el teu llibre →        ]  ]  ← CTA principal
[                                    ]
[  📚 Les teves cerques anteriors    ]  ← Link text, solo aparece si hay resultados
[     Per a la teva parella (ahir)   ]     guardados en localStorage
[     Per a la teva mare (fa 2 dies) ]     Al click: muestra los resultados guardados
```

### 6. Tres idiomas: Catalán + Castellano + Inglés

Actualizar el sistema de idiomas para soportar 3 idiomas. Hay mucha gente internacional viviendo en Barcelona que también regala por Sant Jordi.

#### Toggle de idioma (actualizar en landing y en todo el wizard)

```
[        CAT  |  ES  |  EN          ]  ← 3 opciones, la activa en primary + underline
```

#### Estructura de traducciones

```typescript
type Language = 'cat' | 'es' | 'en';

const translations: Record<Language, Record<string, string>> = {
  cat: {
    hero_title: "Troba el teu\nLlibre",
    hero_subtitle: "No saps quin llibre regalar?\nLa intel·ligència artificial t'ajuda a trobar el regal perfecte.",
    cta_main: "Troba el teu llibre →",
    q1_title: "Per a qui és el regal?",
    q1_subtitle: "Tria la persona especial 🌹",
    q2_title: "Explica'ns com és",
    q2_subtitle: "Com més detalls, millor seran les recomanacions ✨",
    q2_placeholder: "Li agrada la natura, viatjar per pobles petits, és molt curiosa...",
    q2_tip_title: "Consells per a millors resultats:",
    q2_tip: "Descriu la seva personalitat, hobbies, temes que li interessen, o fins i tot pel·lícules i sèries que li agraden.",
    q3_title: "Quins gèneres li agraden?",
    q3_subtitle: "Pots triar més d'un 📚",
    q4_title: "Últim llibre que li va agradar?",
    q4_subtitle: "Opcional, però ajuda molt! 🎯",
    q4_skip: "No ho sé, saltar →",
    q5_title: "Últims detalls",
    q5_subtitle: "Quasi ho tenim! 🌹",
    q5_language_label: "Idioma preferit",
    q5_budget_label: "Pressupost",
    btn_continue: "Continuar →",
    btn_back: "← Enrere",
    btn_find: "Troba els llibres! 📚",
    loading_1: "Buscant entre milers de llibres...",
    loading_2: "Llegint les teves preferències...",
    loading_3: "Preparant les recomanacions...",
    results_label: "Les teves recomanacions",
    results_title: "3 llibres perfectes 📚",
    results_for: "Per a la teva",
    results_search: "Buscar en llibreries →",
    results_dedication_btn: "Generar dedicatòria ✍️",
    results_share_btn: "Compartir resultats →",
    dedication_title: "La teva dedicatòria",
    dedication_sub: "Personalitzada per a",
    dedication_copy: "📋 Copiar text",
    dedication_edit: "✏️ Editar",
    dedication_copied: "✓ Copiat!",
    dedication_share: "Compartir tot 🌹",
    dedication_back: "← Tornar als resultats",
    share_title: "Comparteix-ho!",
    share_subtitle: "Envia les recomanacions o ajuda a algú més a trobar el seu llibre",
    share_whatsapp: "Compartir per WhatsApp",
    share_instagram: "Compartir a Instagram",
    share_copy: "Copiar enllaç",
    share_copied: "✓ Enllaç copiat!",
    follow_title: "T'ha agradat? 🌹",
    follow_subtitle: "Ajuda'ns a arribar a més gent",
    follow_instagram: "Segueix-nos a Instagram",
    follow_google: "Deixa'ns una ressenya a Google",
    restart: "🔄 Trobar un altre llibre per a algú més",
    footer_credit: "Creat amb codi real i IA per",
    footer_cta: "Necessites una web o app? →",
    previous_results: "📚 Les teves cerques anteriors",
    error_timeout: "Uy, ha trigat massa. Torna-ho a provar?",
    error_generic: "Alguna cosa ha fallat. Torna-ho a provar?",
    error_rate: "Moltes peticions! Espera uns minuts i torna-ho a provar.",
    btn_retry: "Tornar-ho a provar",
    tant_se_val: "Tant se val"
  },
  es: {
    hero_title: "Encuentra tu\nLibro",
    hero_subtitle: "¿No sabes qué libro regalar?\nLa inteligencia artificial te ayuda a encontrar el regalo perfecto.",
    cta_main: "Encuentra tu libro →",
    q1_title: "¿Para quién es el regalo?",
    q1_subtitle: "Elige a la persona especial 🌹",
    q2_title: "Cuéntanos cómo es",
    q2_subtitle: "Cuantos más detalles, mejores serán las recomendaciones ✨",
    q2_placeholder: "Le gusta la naturaleza, viajar por pueblos pequeños, es muy curiosa...",
    q2_tip_title: "Consejos para mejores resultados:",
    q2_tip: "Describe su personalidad, hobbies, temas que le interesan, o incluso películas y series que le gustan.",
    q3_title: "¿Qué géneros le gustan?",
    q3_subtitle: "Puedes elegir más de uno 📚",
    q4_title: "¿Último libro que le gustó?",
    q4_subtitle: "Opcional, ¡pero ayuda mucho! 🎯",
    q4_skip: "No lo sé, saltar →",
    q5_title: "Últimos detalles",
    q5_subtitle: "¡Ya casi lo tenemos! 🌹",
    q5_language_label: "Idioma preferido",
    q5_budget_label: "Presupuesto",
    btn_continue: "Continuar →",
    btn_back: "← Atrás",
    btn_find: "¡Encuentra los libros! 📚",
    loading_1: "Buscando entre miles de libros...",
    loading_2: "Leyendo tus preferencias...",
    loading_3: "Preparando las recomendaciones...",
    results_label: "Tus recomendaciones",
    results_title: "3 libros perfectos 📚",
    results_for: "Para tu",
    results_search: "Buscar en librerías →",
    results_dedication_btn: "Generar dedicatoria ✍️",
    results_share_btn: "Compartir resultados →",
    dedication_title: "Tu dedicatoria",
    dedication_sub: "Personalizada para",
    dedication_copy: "📋 Copiar texto",
    dedication_edit: "✏️ Editar",
    dedication_copied: "✓ ¡Copiado!",
    dedication_share: "Compartir todo 🌹",
    dedication_back: "← Volver a resultados",
    share_title: "¡Compártelo!",
    share_subtitle: "Envía las recomendaciones o ayuda a alguien más a encontrar su libro",
    share_whatsapp: "Compartir por WhatsApp",
    share_instagram: "Compartir en Instagram",
    share_copy: "Copiar enlace",
    share_copied: "✓ ¡Enlace copiado!",
    follow_title: "¿Te ha gustado? 🌹",
    follow_subtitle: "Ayúdanos a llegar a más gente",
    follow_instagram: "Síguenos en Instagram",
    follow_google: "Déjanos una reseña en Google",
    restart: "🔄 Encontrar otro libro para alguien más",
    footer_credit: "Creado con código real e IA por",
    footer_cta: "¿Necesitas una web o app? →",
    previous_results: "📚 Tus búsquedas anteriores",
    error_timeout: "Uy, ha tardado demasiado. ¿Volver a intentar?",
    error_generic: "Algo ha fallado. ¿Volver a intentar?",
    error_rate: "¡Muchas peticiones! Espera unos minutos e inténtalo de nuevo.",
    btn_retry: "Volver a intentar",
    tant_se_val: "Da igual"
  },
  en: {
    hero_title: "Find your\nBook",
    hero_subtitle: "Don't know what book to give?\nAI helps you find the perfect gift for Sant Jordi.",
    cta_main: "Find your book →",
    q1_title: "Who is it for?",
    q1_subtitle: "Choose the special person 🌹",
    q2_title: "Tell us about them",
    q2_subtitle: "The more details, the better the recommendations ✨",
    q2_placeholder: "They love nature, traveling to small towns, are very curious, love mystery novels...",
    q2_tip_title: "Tips for better results:",
    q2_tip: "Describe their personality, hobbies, topics they're into, or even movies and shows they like.",
    q3_title: "What genres do they like?",
    q3_subtitle: "You can pick more than one 📚",
    q4_title: "Last book they enjoyed?",
    q4_subtitle: "Optional, but really helps! 🎯",
    q4_skip: "I don't know, skip →",
    q5_title: "Last details",
    q5_subtitle: "Almost there! 🌹",
    q5_language_label: "Preferred language",
    q5_budget_label: "Budget",
    btn_continue: "Continue →",
    btn_back: "← Back",
    btn_find: "Find the books! 📚",
    loading_1: "Searching through thousands of books...",
    loading_2: "Reading your preferences...",
    loading_3: "Preparing recommendations...",
    results_label: "Your recommendations",
    results_title: "3 perfect books 📚",
    results_for: "For your",
    results_search: "Search in bookstores →",
    results_dedication_btn: "Generate dedication ✍️",
    results_share_btn: "Share results →",
    dedication_title: "Your dedication",
    dedication_sub: "Personalized for",
    dedication_copy: "📋 Copy text",
    dedication_edit: "✏️ Edit",
    dedication_copied: "✓ Copied!",
    dedication_share: "Share everything 🌹",
    dedication_back: "← Back to results",
    share_title: "Share it!",
    share_subtitle: "Send the recommendations or help someone else find their book",
    share_whatsapp: "Share via WhatsApp",
    share_instagram: "Share on Instagram",
    share_copy: "Copy link",
    share_copied: "✓ Link copied!",
    follow_title: "Did you like it? 🌹",
    follow_subtitle: "Help us reach more people",
    follow_instagram: "Follow us on Instagram",
    follow_google: "Leave us a review on Google",
    restart: "🔄 Find another book for someone else",
    footer_credit: "Built with real code & AI by",
    footer_cta: "Need a web or app? →",
    previous_results: "📚 Your previous searches",
    error_timeout: "Oops, that took too long. Try again?",
    error_generic: "Something went wrong. Try again?",
    error_rate: "Too many requests! Wait a few minutes and try again.",
    btn_retry: "Try again",
    tant_se_val: "Any"
  }
};
```

#### Recipientes por idioma

```typescript
const recipients: Record<Language, Array<{id: string, emoji: string, label: string}>> = {
  cat: [
    { id: "parella", emoji: "💕", label: "Parella" },
    { id: "amic", emoji: "🤝", label: "Amic o amiga" },
    { id: "mare_pare", emoji: "💐", label: "Mare o Pare" },
    { id: "fill", emoji: "🧒", label: "Fill o filla" },
    { id: "company", emoji: "💼", label: "Company de feina" },
    { id: "mi", emoji: "✨", label: "Per a mi" }
  ],
  es: [
    { id: "parella", emoji: "💕", label: "Pareja" },
    { id: "amic", emoji: "🤝", label: "Amigo/a" },
    { id: "mare_pare", emoji: "💐", label: "Madre o Padre" },
    { id: "fill", emoji: "🧒", label: "Hijo/a" },
    { id: "company", emoji: "💼", label: "Compañero de trabajo" },
    { id: "mi", emoji: "✨", label: "Para mí" }
  ],
  en: [
    { id: "parella", emoji: "💕", label: "Partner" },
    { id: "amic", emoji: "🤝", label: "Friend" },
    { id: "mare_pare", emoji: "💐", label: "Mom or Dad" },
    { id: "fill", emoji: "🧒", label: "Son or Daughter" },
    { id: "company", emoji: "💼", label: "Coworker" },
    { id: "mi", emoji: "✨", label: "For myself" }
  ]
};
```

#### Géneros por idioma

```typescript
const genres: Record<Language, Array<{id: string, emoji: string, label: string}>> = {
  cat: [
    { id: "narrativa", emoji: "📖", label: "Narrativa" },
    { id: "thriller", emoji: "🔍", label: "Thriller" },
    { id: "romantic", emoji: "💗", label: "Romàntic" },
    { id: "scifi", emoji: "🚀", label: "Ciència ficció" },
    { id: "nofic", emoji: "🧠", label: "No ficció" },
    { id: "poesia", emoji: "🪶", label: "Poesia" },
    { id: "comic", emoji: "💬", label: "Còmic" },
    { id: "historia", emoji: "🏛️", label: "Història" },
    { id: "autoajuda", emoji: "🌱", label: "Autoajuda" },
    { id: "infantil", emoji: "🧸", label: "Infantil/Juvenil" }
  ],
  es: [
    { id: "narrativa", emoji: "📖", label: "Narrativa" },
    { id: "thriller", emoji: "🔍", label: "Thriller" },
    { id: "romantic", emoji: "💗", label: "Romance" },
    { id: "scifi", emoji: "🚀", label: "Ciencia ficción" },
    { id: "nofic", emoji: "🧠", label: "No ficción" },
    { id: "poesia", emoji: "🪶", label: "Poesía" },
    { id: "comic", emoji: "💬", label: "Cómic" },
    { id: "historia", emoji: "🏛️", label: "Historia" },
    { id: "autoajuda", emoji: "🌱", label: "Autoayuda" },
    { id: "infantil", emoji: "🧸", label: "Infantil/Juvenil" }
  ],
  en: [
    { id: "narrativa", emoji: "📖", label: "Fiction" },
    { id: "thriller", emoji: "🔍", label: "Thriller" },
    { id: "romantic", emoji: "💗", label: "Romance" },
    { id: "scifi", emoji: "🚀", label: "Sci-Fi" },
    { id: "nofic", emoji: "🧠", label: "Non-fiction" },
    { id: "poesia", emoji: "🪶", label: "Poetry" },
    { id: "comic", emoji: "💬", label: "Comics" },
    { id: "historia", emoji: "🏛️", label: "History" },
    { id: "autoajuda", emoji: "🌱", label: "Self-help" },
    { id: "infantil", emoji: "🧸", label: "Children/Young Adult" }
  ]
};
```

#### Detección automática de idioma

```typescript
// Detectar idioma del navegador al cargar la app
function detectLanguage(): Language {
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('ca')) return 'cat';
  if (browserLang.startsWith('es')) return 'es';
  return 'en';  // default inglés para cualquier otro idioma
}
```

#### Actualizar el estado global

```typescript
interface WizardState {
  currentScreen: number;
  language: "cat" | "es" | "en";  // ACTUALIZADO: 3 idiomas
  // ... resto igual
}
```

#### Actualizar el toggle de idioma en la landing

```
[        CAT  |  ES  |  EN          ]  ← 3 opciones
```

Cada opción: texto 12px. La activa: color primary, font-weight 700, border-bottom 2px primary. Las inactivas: color text-muted.
