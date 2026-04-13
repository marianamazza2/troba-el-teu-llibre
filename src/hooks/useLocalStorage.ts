import type { SavedResult, RecommendationResponse } from '../types';

const STORAGE_KEY = 'trobalibre_results';
const MAX_SAVED = 10;

export function saveResult(result: RecommendationResponse, recipient: string): void {
  try {
    const saved = getSavedResults();
    const newEntry: SavedResult = {
      id: result.resultId,
      timestamp: Date.now(),
      recipient,
      books: result.books,
      dedication: result.dedication,
    };
    const updated = [newEntry, ...saved].slice(0, MAX_SAVED);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage may be unavailable (private browsing, storage full)
  }
}

export function getSavedResults(): SavedResult[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as SavedResult[];
  } catch {
    return [];
  }
}

export function clearSavedResults(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/** Returns a human-readable relative time label */
export function relativeTime(timestamp: number, language: string): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours   = Math.floor(diff / 3600000);
  const days    = Math.floor(diff / 86400000);

  if (language === 'es') {
    if (days >= 2) return `hace ${days} días`;
    if (days === 1) return 'ayer';
    if (hours >= 1) return `hace ${hours}h`;
    return `hace ${minutes} min`;
  }
  if (language === 'en') {
    if (days >= 2) return `${days} days ago`;
    if (days === 1) return 'yesterday';
    if (hours >= 1) return `${hours}h ago`;
    return `${minutes} min ago`;
  }
  // cat (default)
  if (days >= 2) return `fa ${days} dies`;
  if (days === 1) return 'ahir';
  if (hours >= 1) return `fa ${hours}h`;
  return `fa ${minutes} min`;
}
