import type { Language, Genre } from '../types';

const genres: Record<Language, Genre[]> = {
  cat: [
    { id: 'narrativa',  emoji: '📖', label: 'Narrativa' },
    { id: 'thriller',   emoji: '🔍', label: 'Thriller' },
    { id: 'romantic',   emoji: '💗', label: 'Romàntic' },
    { id: 'scifi',      emoji: '🚀', label: 'Ciència ficció' },
    { id: 'nofic',      emoji: '🧠', label: 'No ficció' },
    { id: 'poesia',     emoji: '🪶', label: 'Poesia' },
    { id: 'comic',      emoji: '💬', label: 'Còmic' },
    { id: 'historia',   emoji: '🏛️', label: 'Història' },
    { id: 'autoajuda',  emoji: '🌱', label: 'Autoajuda' },
    { id: 'infantil',   emoji: '🧸', label: 'Infantil/Juvenil' },
  ],
  es: [
    { id: 'narrativa',  emoji: '📖', label: 'Narrativa' },
    { id: 'thriller',   emoji: '🔍', label: 'Thriller' },
    { id: 'romantic',   emoji: '💗', label: 'Romance' },
    { id: 'scifi',      emoji: '🚀', label: 'Ciencia ficción' },
    { id: 'nofic',      emoji: '🧠', label: 'No ficción' },
    { id: 'poesia',     emoji: '🪶', label: 'Poesía' },
    { id: 'comic',      emoji: '💬', label: 'Cómic' },
    { id: 'historia',   emoji: '🏛️', label: 'Historia' },
    { id: 'autoajuda',  emoji: '🌱', label: 'Autoayuda' },
    { id: 'infantil',   emoji: '🧸', label: 'Infantil/Juvenil' },
  ],
  en: [
    { id: 'narrativa',  emoji: '📖', label: 'Fiction' },
    { id: 'thriller',   emoji: '🔍', label: 'Thriller' },
    { id: 'romantic',   emoji: '💗', label: 'Romance' },
    { id: 'scifi',      emoji: '🚀', label: 'Sci-fi' },
    { id: 'nofic',      emoji: '🧠', label: 'Non-fiction' },
    { id: 'poesia',     emoji: '🪶', label: 'Poetry' },
    { id: 'comic',      emoji: '💬', label: 'Comics' },
    { id: 'historia',   emoji: '🏛️', label: 'History' },
    { id: 'autoajuda',  emoji: '🌱', label: 'Self-help' },
    { id: 'infantil',   emoji: '🧸', label: 'Children/YA' },
  ],
};

export default genres;
