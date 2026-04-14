import { LanguageContext, useLanguageState } from './hooks/useLanguage';
import { useWizard } from './hooks/useWizard';
import Landing from './screens/Landing';
import Loading from './screens/Loading';
import Results from './screens/Results';
import FollowGate from './screens/FollowGate';
import Share from './screens/Share';
import Step1Recipient from './components/wizard/Step1Recipient';
import Step2Description from './components/wizard/Step2Description';
import Step3Genres from './components/wizard/Step3Genres';
import Step4LastBook from './components/wizard/Step4LastBook';
import Step5Preferences from './components/wizard/Step5Preferences';
import { recommend } from './api/recommend';

function AppContent() {
  const wizard = useWizard();
  const {
    state,
    startWizard,
    nextStep,
    prevStep,
    setField,
    toggleGenre,
    setResults,
    setLoading,
    setError,
    setScreen,
    canProceed,
    stepIndex,
  } = wizard;

  const handleSubmit = async () => {
    setLoading(true);
    setScreen('loading');
    try {
      const result = await recommend({
        recipient: state.recipient ?? '',
        description: state.description,
        genres: state.genres,
        lastBook: state.lastBook,
        preferredLanguage: state.preferredLanguage,
        budget: state.budget,
      });
      setResults(result);
      setScreen('results');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'error';
      setError(msg);
    }
  };

  const renderScreen = () => {
    switch (state.currentScreen) {
      case 'landing':
        return <Landing onStart={startWizard} />;

      case 'q1_recipient':
        return (
          <Step1Recipient
            selected={state.recipient}
            onSelect={(id) => setField('recipient', id)}
            onNext={nextStep}
            onBack={() => setScreen('landing')}
            canProceed={canProceed()}
          />
        );

      case 'q2_describe':
        return (
          <Step2Description
            value={state.description}
            onChange={(val) => setField('description', val)}
            onNext={nextStep}
            onBack={prevStep}
            canProceed={canProceed()}
          />
        );

      case 'q3_genres':
        return (
          <Step3Genres
            selected={state.genres}
            onToggle={toggleGenre}
            onNext={nextStep}
            onBack={prevStep}
            canProceed={canProceed()}
          />
        );

      case 'q4_lastbook':
        return (
          <Step4LastBook
            value={state.lastBook}
            onChange={(val) => setField('lastBook', val)}
            onNext={nextStep}
            onSkip={nextStep}
            onBack={prevStep}
          />
        );

      case 'q5_prefs':
        return (
          <Step5Preferences
            preferredLanguage={state.preferredLanguage}
            budget={state.budget}
            onSetLanguage={(val) => setField('preferredLanguage', val)}
            onSetBudget={(val) => setField('budget', val)}
            onSubmit={handleSubmit}
            onBack={prevStep}
          />
        );

      case 'loading':
        return (
          <Loading
            error={state.error}
            onRetry={handleSubmit}
          />
        );

      case 'results':
        if (!state.results) return null;
        return (
          <Results
            results={state.results}
            recipient={state.recipient ?? ''}
            onShare={() => setScreen('follow_gate')}
            onRestart={() => { wizard.reset(); }}
          />
        );

      case 'follow_gate':
        return (
          <FollowGate
            onContinue={() => setScreen('share')}
          />
        );

      case 'share':
        if (!state.results) return null;
        return (
          <Share
            books={state.results.books}
            recipient={state.recipient ?? ''}
            onRestart={() => { wizard.reset(); }}
          />
        );

      default:
        return null;
    }
  };

  // stepIndex() retorna -1 fuera del wizard; no necesitamos prop aquí
  void stepIndex;

  return (
    <div className="min-h-dvh bg-cream">
      <div className="w-full max-w-[480px] mx-auto relative">
        {renderScreen()}
      </div>
    </div>
  );
}

export default function App() {
  const langState = useLanguageState();
  return (
    <LanguageContext.Provider value={langState}>
      <AppContent />
    </LanguageContext.Provider>
  );
}
