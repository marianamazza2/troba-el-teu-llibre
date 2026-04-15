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
}

// Rate limiting: max 10 req/IP/hour
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
    preferredLanguage === 'catala' ? 'català' :
    preferredLanguage === 'castella' ? 'castellà' :
    preferredLanguage === 'angles' ? 'anglès' :
    'català';

  // 30s timeout on the Claude API call
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  let response: Response;
  try {
    response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2000,
        system:
          "Ets un expert en literatura amb profund coneixement de llibreries de Barcelona i Catalunya. " +
          "L'usuari busca un regal de Sant Jordi. Fes recomanacions de llibres REALS que existeixin, amb autors reals. " +
          "Respon ÚNICAMENT amb l'objecte JSON, sense cap text addicional, backticks ni markdown.",
        messages: [
          {
            role: 'user',
            content: `Busco un regal de Sant Jordi per a: ${recipient}
Descripció de la persona: ${description}
Gèneres preferits: ${genres.join(', ')}
Últim llibre que li va agradar: ${lastBook || 'No especificat'}
Idioma preferit del llibre: ${lang}
Pressupost: ${budget}

Respon amb exactament aquest format JSON (3 llibres):
{
  "books": [
    {
      "title": "títol del llibre",
      "author": "nom de l'autor",
      "isbn": "",
      "synopsis": "sinopsi breu de 2-3 línies en ${lang}",
      "why_perfect": "1-2 línies explicant per què és ideal per a aquesta persona, en ${lang}",
      "price_estimate": "14.90"
    }
  ]
}`,
          },
          {
            role: 'assistant',
            content: '{',
          },
        ],
      }),
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const errBody = await response.text().catch(() => '');
    throw new Error(`Claude API error: ${response.status} ${errBody}`);
  }

  const raw = (await response.json()) as { content: Array<{ text: string }> };
  const partial = raw.content?.[0]?.text ?? '';
  // The assistant prefill opened '{', we reconstruct the full JSON
  const fullJson = '{' + partial;

  // Extract up to the last '}' in case there's trailing text
  const lastBrace = fullJson.lastIndexOf('}');
  const jsonStr = lastBrace !== -1 ? fullJson.slice(0, lastBrace + 1) : fullJson;

  const parsed = JSON.parse(jsonStr) as ClaudeResult;

  if (!Array.isArray(parsed.books) || parsed.books.length === 0) {
    throw new Error('Claude returned no books');
  }

  return parsed;
}

async function getBookCover(title: string, author: string, isbn: string): Promise<string | null> {
  // 4s timeout per cover fetch
  const signal = AbortSignal.timeout(4_000);

  try {
    const query = isbn
      ? `isbn:${isbn}`
      : `intitle:${encodeURIComponent(title)}+inauthor:${encodeURIComponent(author)}`;
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${process.env.GOOGLE_BOOKS_API_KEY}`,
      { signal },
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

  // Open Library fallback — only use ISBN-based URL (instant, no search needed)
  if (isbn) {
    return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
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
  try {
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

    // Call Claude with up to 3 retries
    let claudeResult: ClaudeResult | null = null;
    let lastError: unknown;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        claudeResult = await callClaude(data);
        break;
      } catch (e) {
        lastError = e;
        console.error(`Claude attempt ${attempt + 1} failed:`, e);
      }
    }

    if (!claudeResult) {
      console.error('Claude failed after 3 attempts:', lastError);
      return send(res, 500, { error: 'No s\'han pogut obtenir recomanacions. Torna-ho a provar.' });
    }

    // Fetch covers in parallel (failures return null — covers are optional)
    const booksWithCovers = await Promise.all(
      claudeResult.books.map(async (book) => ({
        title: book.title,
        author: book.author,
        synopsis: book.synopsis,
        whyPerfect: book.why_perfect,
        priceEstimate: book.price_estimate,
        coverUrl: await getBookCover(book.title, book.author, book.isbn).catch(() => null),
      })),
    );

    const resultId = crypto.randomUUID().substring(0, 8);

    return send(res, 200, { books: booksWithCovers, resultId });

  } catch (e) {
    console.error('Unhandled handler error:', e);
    return send(res, 500, { error: 'Error inesperat. Torna-ho a provar.' });
  }
}
