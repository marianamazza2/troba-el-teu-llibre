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
  resultId: string;
}

export interface SavedResult {
  id: string;
  timestamp: number;
  recipient: string;
  books: BookRecommendation[];
}

export type Screen =
  | 'landing'
  | 'q1_recipient'
  | 'q2_describe'
  | 'q3_genres'
  | 'q4_lastbook'
  | 'q5_prefs'
  | 'loading'
  | 'results'
  | 'follow_gate'
  | 'share';

export interface WizardState {
  currentScreen: Screen;
  language: Language;
  recipient: string | null;
  description: string;
  genres: string[];
  lastBook: string;
  preferredLanguage: string;
  budget: string;
  results: RecommendationResponse | null;
  selectedBookIndex: number | null;
  isLoading: boolean;
  error: string | null;
}
