import type { Language, Recipient } from '../types';

const recipients: Record<Language, Recipient[]> = {
  cat: [
    { id: 'parella',   emoji: '💕', label: 'Parella' },
    { id: 'amic',      emoji: '🤝', label: 'Amic o amiga' },
    { id: 'mare_pare', emoji: '💐', label: 'Mare o Pare' },
    { id: 'fill',      emoji: '🧒', label: 'Fill o filla' },
    { id: 'company',   emoji: '💼', label: 'Company de feina' },
    { id: 'mi',        emoji: '✨', label: 'Per a mi' },
  ],
  es: [
    { id: 'parella',   emoji: '💕', label: 'Pareja' },
    { id: 'amic',      emoji: '🤝', label: 'Amigo/a' },
    { id: 'mare_pare', emoji: '💐', label: 'Madre o Padre' },
    { id: 'fill',      emoji: '🧒', label: 'Hijo/a' },
    { id: 'company',   emoji: '💼', label: 'Compañero de trabajo' },
    { id: 'mi',        emoji: '✨', label: 'Para mí' },
  ],
  en: [
    { id: 'parella',   emoji: '💕', label: 'Partner' },
    { id: 'amic',      emoji: '🤝', label: 'Friend' },
    { id: 'mare_pare', emoji: '💐', label: 'Mom or Dad' },
    { id: 'fill',      emoji: '🧒', label: 'Son or Daughter' },
    { id: 'company',   emoji: '💼', label: 'Coworker' },
    { id: 'mi',        emoji: '✨', label: 'For myself' },
  ],
};

export default recipients;
