import type { IncomingMessage, ServerResponse } from 'node:http';

interface WizardData {
  recipient: string | null;
  description: string;
  genres: string[];
  lastBook: string;
  preferredLanguage: string;
  budget: string;
}

interface ClaudeBook {
  title: string;
  author: string;
  isbn: string;
  synopsis: string;
  why_perfect: string;
  price_estimate: string;
}

interface ClaudeResult {
  books: ClaudeBook[];
  dedication: string;
}

// Rate limiting: max 10 req/IP/hour (Map en memoria)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 3_600_000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

async function callClaude(data: WizardData): Promise<ClaudeResult> {
  const { recipient, description, genres, lastBook, preferredLanguage, budget } = data;

  const lang =
    preferredLanguage === 'Català' ? 'català' :
    preferredLanguage === 'Castellà' ? 'castellà' :
    preferredLanguage === 'Anglès' ? 'anglès' :
    'català';

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system:
        "Ets un expert en literatura amb profund coneixement de llibreries de Barcelona i Catalunya. " +
        "L'usuari busca un regal de Sant Jordi. Fes recomanacions de llibres REALS que existeixin, amb autors reals. " +
        "Respon NOMÉS amb JSON vàlid, sense cap text addicional, backticks ni markdown.",
      messages: [
        {
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
      "synopsis": "sinopsi breu de 2-3 línies en ${lang}",
      "why_perfect": "1-2 línies explicant per què és ideal per a aquesta persona, en ${lang}",
      "price_estimate": "preu estimat en euros, ex: 14.90"
    }
  ],
  "dedication": "dedicatòria curta i emotiva per al primer llibre, personalitzada per a ${recipient}, en ${lang}"
}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`);
  }

  const raw = (await response.json()) as { content: Array<{ text: string }> };
  return JSON.parse(raw.content[0].text) as ClaudeResult;
}

async function getBookCover(title: string, author: string, isbn: string): Promise<string | null> {
  // 1. Google Books API (primario)
  try {
    const query = isbn
      ? `isbn:${isbn}`
      : `intitle:${encodeURIComponent(title)}+inauthor:${encodeURIComponent(author)}`;
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${process.env.GOOGLE_BOOKS_API_KEY}`,
    );
    const data = (await res.json()) as {
      items?: Array<{ volumeInfo?: { imageLinks?: { thumbnail?: string } } }>;
    };
    const thumbnail = data.items?.[0]?.volumeInfo?.imageLinks?.thumbnail;
    if (thumbnail) {
      return thumbnail.replace('http://', 'https://').replace('zoom=1', 'zoom=2');
    }
  } catch (e) {
    console.error('Google Books error:', e);
  }

  // 2. Open Library (fallback, sin API key)
  try {
    if (isbn) {
      return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
    }
    const res = await fetch(
      `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}&limit=1`,
    );
    const data = (await res.json()) as { docs?: Array<{ cover_i?: number }> };
    const coverId = data.docs?.[0]?.cover_i;
    if (coverId) {
      return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
    }
  } catch (e) {
    console.error('Open Library error:', e);
  }

  return null;
}

async function parseBody(req: IncomingMessage): Promise<WizardData> {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk: Buffer) => { raw += chunk.toString(); });
    req.on('end', () => {
      try { resolve(JSON.parse(raw) as WizardData); }
      catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

function send(res: ServerResponse, status: number, body: unknown) {
  const json = JSON.stringify(body);
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(json);
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') {
    return send(res, 405, { error: 'Method not allowed' });
  }

  // Rate limiting
  const forwarded = req.headers['x-forwarded-for'];
  const ip =
    (Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0]) ??
    'unknown';

  if (!checkRateLimit(ip)) {
    return send(res, 429, { error: 'Massa peticions. Torna-ho a provar en una hora.' });
  }

  let data: WizardData;
  try {
    data = await parseBody(req);
  } catch {
    return send(res, 400, { error: 'Invalid request body' });
  }

  // Llamada a Claude con 1 reintento si falla el JSON
  let claudeResult: ClaudeResult;
  try {
    claudeResult = await callClaude(data);
  } catch {
    try {
      claudeResult = await callClaude(data);
    } catch (e) {
      console.error('Claude failed twice:', e);
      return send(res, 500, { error: 'No s\'han pogut obtenir recomanacions. Torna-ho a provar.' });
    }
  }

  // Buscar portadas en paralelo
  const booksWithCovers = await Promise.all(
    claudeResult.books.map(async (book) => ({
      title: book.title,
      author: book.author,
      synopsis: book.synopsis,
      whyPerfect: book.why_perfect,
      priceEstimate: book.price_estimate,
      coverUrl: await getBookCover(book.title, book.author, book.isbn),
    })),
  );

  const resultId = crypto.randomUUID().substring(0, 8);

  return send(res, 200, {
    books: booksWithCovers,
    dedication: claudeResult.dedication,
    resultId,
  });
}
