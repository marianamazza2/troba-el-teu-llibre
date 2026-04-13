import { useState } from 'react';
import type { Screen, WizardState, RecommendationResponse } from '../types';
import { playPageTurn } from '../lib/sound';
import { trackEvent } from '../lib/analytics';

const WIZARD_SCREENS: Screen[] = [
  'q1_recipient',
  'q2_describe',
  'q3_genres',
  'q4_lastbook',
  'q5_prefs',
];

const initialState: Omit<WizardState, 'language'> = {
  currentScreen: 'landing',
  recipient: null,
  description: '',
  genres: [],
  lastBook: '',
  preferredLanguage: 'tant_se_val',
  budget: 'tant_se_val',
  results: null,
  selectedBookIndex: null,
  isLoading: false,
  error: null,
};

export function useWizard() {
  const [state, setState] = useState(initialState);

  const setScreen = (screen: Screen) => {
    setState(prev => ({ ...prev, currentScreen: screen }));
  };

  const startWizard = () => {
    trackEvent('wizard_start');
    playPageTurn();
    setScreen('q1_recipient');
  };

  const nextStep = () => {
    const idx = WIZARD_SCREENS.indexOf(state.currentScreen as Screen);
    if (idx === -1) return;

    // Track each step
    const stepTracking: Record<string, () => void> = {
      q1_recipient: () => trackEvent('wizard_step', { step: 'recipient', value: state.recipient ?? '' }),
      q2_describe:  () => trackEvent('wizard_step', { step: 'describe', length: state.description.length.toString() }),
      q3_genres:    () => trackEvent('wizard_step', { step: 'genres', count: state.genres.length.toString() }),
      q4_lastbook:  () => trackEvent('wizard_step', { step: 'lastbook', provided: (state.lastBook.length > 0).toString() }),
      q5_prefs:     () => trackEvent('wizard_step', { step: 'prefs', language: state.preferredLanguage, budget: state.budget }),
    };
    stepTracking[state.currentScreen]?.();

    playPageTurn();

    if (idx < WIZARD_SCREENS.length - 1) {
      setScreen(WIZARD_SCREENS[idx + 1]);
    } else {
      setScreen('loading');
    }
  };

  const prevStep = () => {
    const idx = WIZARD_SCREENS.indexOf(state.currentScreen as Screen);
    if (idx <= 0) {
      setScreen('landing');
    } else {
      setScreen(WIZARD_SCREENS[idx - 1]);
    }
  };

  const setField = <K extends keyof typeof initialState>(
    key: K,
    value: (typeof initialState)[K]
  ) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const toggleGenre = (id: string) => {
    setState(prev => ({
      ...prev,
      genres: prev.genres.includes(id)
        ? prev.genres.filter(g => g !== id)
        : [...prev.genres, id],
    }));
  };

  const setResults = (results: RecommendationResponse) => {
    setState(prev => ({ ...prev, results, isLoading: false, error: null }));
  };

  const setLoading = (isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error, isLoading: false }));
  };

  const reset = () => {
    playPageTurn();
    setState({ ...initialState, currentScreen: 'q1_recipient' });
    trackEvent('restart_wizard');
  };

  // Validation per step
  const canProceed = (): boolean => {
    switch (state.currentScreen) {
      case 'q1_recipient': return state.recipient !== null;
      case 'q2_describe':  return state.description.trim().length >= 10;
      case 'q3_genres':    return state.genres.length > 0;
      case 'q4_lastbook':  return true; // optional
      case 'q5_prefs':     return true;
      default:             return false;
    }
  };

  // Wizard step index (0-4) for progress bar
  const stepIndex = (): number => {
    return WIZARD_SCREENS.indexOf(state.currentScreen as Screen);
  };

  return {
    state,
    setScreen,
    startWizard,
    nextStep,
    prevStep,
    setField,
    toggleGenre,
    setResults,
    setLoading,
    setError,
    reset,
    canProceed,
    stepIndex,
  };
}
